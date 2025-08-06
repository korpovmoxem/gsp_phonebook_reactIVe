import random
from datetime import datetime, timedelta
from typing import List, Optional
import uuid

from backend.src.database import (
    Organization,
    Department,
    Employee,
    Category,
    Position,
    async_session_maker,
    Base,
    async_engine
)
from faker import Faker

fake = Faker('ru_RU')

def generate_organizations(count: int = 10) -> List[Organization]:
    """Генерирует заданное количество организаций."""
    organizations = []
    for i in range(1, count + 1):
        organization = Organization(
            ID=i,
            Name=fake.company(),
            FullName=f"{fake.company()} {fake.catch_phrase()}",
            Order=i
        )
        organizations.append(organization)
    return organizations


def build_department_tree(
    organization_id: int,
    parent_id: Optional[str] = None,
    level: int = 1,
    max_level: int = 5,
    departments: Optional[List[Department]] = None
) -> List[Department]:
    if departments is None:
        departments = []

    num_departments = random.randint(2, 5)

    for i in range(num_departments):
        dep_id = f"{uuid.uuid4()}"

        department = Department(
            ID=dep_id,
            Name=fake.bs().capitalize(),
            ParentID=parent_id if parent_id else "00000000-0000-0000-0000-000000000000",
            Level=level,
            Order=level,
            Filial=random.choice([0, 1]),
            OrganizationID=organization_id  # важно
        )
        departments.append(department)

        if level < max_level:
            sub_deps = build_department_tree(
                organization_id,
                dep_id,
                level + 1,
                max_level
            )
            departments.extend(sub_deps)

    return departments


def generate_departments(organizations: List[Organization]) -> List[Department]:
    """Генерирует деревья департаментов для каждой организации."""
    departments = []

    for org in organizations:
        root_department = Department(
            ID=f"{uuid.uuid4()}",
            Name=f"Корневой департамент {org.Name}",
            ParentID=str(org.ID),
            Level=1,
            Order=1,
            Filial=0,
            OrganizationID=org.ID
        )
        # Добавляем департамент к организации через relationship
        org.departments.append(root_department)
        departments.append(root_department)

        child_departments = build_department_tree(org.ID, root_department.ID, level=2)
        for dep in child_departments:
            org.departments.append(dep)  # Указываем явно, что департамент принадлежит организации
            departments.append(dep)

    return departments


def generate_categories() -> List[Category]:
    """Генерирует категории сотрудников."""
    categories = [
        Category(ID="К001", Name="Высшее руководство", Order=1),
        Category(ID="К002", Name="Ведущие менеджеры", Order=2),
        Category(ID="К003", Name="Менеджеры", Order=3),
        Category(ID="К004", Name="Специалисты", Order=4),
    ]
    return categories


def generate_positions() -> List[Position]:
    """Генерирует должности сотрудников."""
    positions = [
        Position(ID="P001", Name="Директор", Category="К001", Order=1),
        Position(ID="P002", Name="Заместитель директора", Category="К001", Order=2),
        Position(ID="P003", Name="Начальник отдела", Category="К002", Order=3),
        Position(ID="P004", Name="Ведущий специалист", Category="К003", Order=4),
        Position(ID="P005", Name="Специалист", Category="К004", Order=5),
        Position(ID="P006", Name="Ассистент", Category="К004", Order=6),
        Position(ID="P007", Name="Ведущий консультант", Category="К004", Order=7),
        Position(ID="P008", Name="Консультант", Category="К004", Order=8),
    ]
    return positions


def generate_employees(
    organizations: List[Organization],
    departments: List[Department],
    categories: List[Category],
    positions: List[Position],
    count: int = 1_000_000
) -> List[Employee]:
    employees = []

    # Фильтруем только те департаменты, которые не корневые
    active_departments = [d for d in departments if not d.ParentID.startswith("0000")]

    for i in range(1, count + 1):
        organization = random.choice(organizations)
        matching_deps = [d for d in active_departments if str(d.OrganizationID) == str(organization.ID)]
        if not matching_deps:
            department = random.choice(departments)
        else:
            department = random.choice(matching_deps)
        category = random.choice(categories)
        position = random.choice([p for p in positions if p.Category == category.ID])

        last_name, first_name, middle_name = fake.last_name(), fake.first_name(), fake.middle_name()
        employee = Employee(
            ID=str(i),
            LastNameRus=last_name,
            NameRus=first_name,
            MiddleNameRus=middle_name,
            FullNameRus=f"{last_name} {first_name} {middle_name}",
            DepartmentID=department.ID,
            OrganizationID=organization.ID,
            CategoryID=category.ID,
            PositionID=position.ID,
            PositionTitle=position.Name,
            Email=fake.email(),
            TelephoneNumberCorp=f"+7 ({random.randint(900, 999)}) {random.randint(100, 999)}-{random.randint(1000, 9999)}",
            MobileNumberCorp=f"+7 (9{random.randint(0,9)}{random.randint(0,9)}) {random.randint(100, 999)}-{random.randint(1000, 9999)}",
            WorkPlace=random.randint(1, 1000),
            Address=fake.address(),
            Order=i,
            Birthday=datetime.now() - timedelta(days=random.randint(365 * 22, 365 * 60)),
            Fired=random.random() < 0.05,
            Decret=False,
            Otpusk=False,
            Boleet=False,
            Komandirovka=False,
            Invisible=False,
        )
        employees.append(employee)

    return employees


async def generate_local_data():
    print("Создание таблиц...")

    async with async_engine.begin() as session:
        await session.run_sync(Base.metadata.create_all)

    print("Генерация новых данных...")

    organizations = generate_organizations()
    departments = generate_departments(organizations)
    categories = generate_categories()
    positions = generate_positions()
    employees = generate_employees(organizations, departments, categories, positions)

    async with async_session_maker() as session:
        print("Очистка существующих данных...")
        await session.execute(Employee.__table__.delete())
        await session.execute(Department.__table__.delete())
        await session.execute(Organization.__table__.delete())
        await session.execute(Category.__table__.delete())
        await session.execute(Position.__table__.delete())

        print("Добавление данных в базу...")

        session.add_all(organizations)
        session.add_all(departments)
        session.add_all(categories)
        session.add_all(positions)
        session.add_all(employees)

        await session.commit()

    print(f"Сгенерировано: "
          f"{len(organizations)} организаций, "
          f"{len(departments)} департаментов, "
          f"{len(employees)} сотрудников.")