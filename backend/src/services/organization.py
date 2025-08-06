from typing import List, Dict, Generator, Optional, Iterable
from collections import defaultdict

from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from backend.src.database import (
    Organization,
    Department,
)
from backend.src.models import (
    GetOrganizationResponse,
    GetOrganizationTreeRootResponse,
    GetOrganizationTreeChildrenResponse,
)
from backend.src.utils.sql import (
    active_employee_filter,
)


def group_departments_by_parent(departments: Iterable[Department]) -> Dict[str, List[Department]]:
    """Группирует департаменты по ParentID для удобства построения дерева."""
    department_map = defaultdict(list)
    for dep in departments:
        department_map[dep.ParentID].append(dep)
    return department_map


def tree_id_generator() -> Generator[int, None, None]:
    """Генератор уникальных TreeID."""
    counter = 0
    while True:
        counter += 1
        yield counter


def build_department_subtree(
    nodes: List[Department],
    department_map: Dict[str, List[Department]],
    id_gen: Generator[int, None, None],
    custom_keywords: Optional[List[str]] = None,
) -> List[GetOrganizationTreeChildrenResponse]:
    """
    Рекурсивно строит дерево подразделений.
    """
    if custom_keywords is None:
        custom_keywords = ["Филиал", "Обособленное подразделение", "ОП"]

    custom_groups = {
        keyword: GetOrganizationTreeChildrenResponse(Name=keyword, children=[])
        for keyword in custom_keywords
    }

    subtree = []

    for node in sorted(nodes, key=lambda x: x.Level):
        current_id = str(next(id_gen))

        child_nodes = department_map.get(node.ID, [])
        children = build_department_subtree(child_nodes, department_map, id_gen, custom_keywords)

        validated = GetOrganizationTreeChildrenResponse.model_validate(node, by_name=True)
        validated.TreeID = current_id
        validated.children = children

        matched = False
        for keyword in custom_keywords:
            if keyword in validated.Name:
                custom_groups[keyword].children.append(validated)
                matched = True
                break

        if not matched:
            subtree.append(validated)

    # Добавляем сгруппированные элементы как отдельные узлы
    for group in custom_groups.values():
        if group.children:
            group.TreeID = str(next(id_gen))
            subtree.append(group)

    return subtree


async def get_organization(session: AsyncSession):
    query = (
        select(Organization)
        .where(Organization.employees.any(and_(*active_employee_filter())))
        .order_by(Organization.Order)
    )
    result = await session.execute(query)
    organizations = result.scalars().all()
    return [
        GetOrganizationResponse.model_validate(org, by_name=True)
        for org in organizations
    ]


async def get_organization_tree(session: AsyncSession):
    # Получаем организации с активными сотрудниками
    query = (
        select(Organization)
        .where(Organization.employees.any(and_(*active_employee_filter())))
        .order_by(Organization.Order)
    )
    organizations_result = await session.execute(query)
    organizations = organizations_result.scalars().all()

    # Получаем все департаменты, исключая фиктивные корневые
    query = (
        select(Department)
        .where(Department.ParentID != "00000000-0000-0000-0000-000000000000")
        .order_by(Department.Order)
    )
    departments_result = await session.execute(query)
    departments = departments_result.scalars().all()

    # Группируем департаменты по ParentID
    department_map = group_departments_by_parent(departments)

    # Подготавливаем дерево организаций
    id_gen = tree_id_generator()
    next(id_gen)  # Пропускаем первый ID (можно использовать в будущем)

    organization_tree = []
    for org in organizations:
        root_deps = [
            d for d in departments
            if str(d.OrganizationID) == str(org.ID) and d.Level == 1
        ]

        # Генерируем дерево для текущей организации
        children = build_department_subtree(root_deps, department_map, id_gen)

        # Валидируем и добавляем TreeID
        org_model = GetOrganizationTreeRootResponse.model_validate(org, by_name=True)
        org_model.TreeID = str(next(id_gen))
        org_model.children = children

        organization_tree.append(org_model)

    return organization_tree