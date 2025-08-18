import asyncio
import random
from datetime import datetime, timedelta, date
from types import SimpleNamespace
from typing import Optional, Iterable
import os

from sqlalchemy import func, select
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import Response

from src.database import (
    Organization,
    Department,
    Employee,
    Category,
    Assistant,
    EditedEmployee,
    Position,
)
from src.models import (
    GetEmployeeDetailResponse,
    GetEmployeeTableResponse,
    GetTreeEmployeeTableResponse,
    GetEmployeeBirthdaysResponse,
    GetEmployeeBirthdayDateGroupResponse,
    GetAssistantResponse,
    SearchEmployeeResponse,
    SearchEmployeeDepartment,
    EmployeeStatus,
    EmployeeAchievement,
    GetEmployeeImageResponse,
)
from src.redis import (
    r_delete_cache,
    r_get_verification_code,
    r_set_verification_code,
    r_get_verification_code_seconds_expires,
)
from src.smtp import async_send_email
from src.utils.sql import (
    sample_employee_query
)
from src.utils.exceptions import (
    EmployeeNotFoundError,
    EmployeeNotEditableError,
    EmployeeWithoutEmailError,
    InvalidVerificationCodeError,
    DailyVerificationLimitExceededError,
    DailyEditLimitExceededError,
    SendEmailError,
)
from src.storage import (
    get_achievement_img,
    get_status_img,
    get_photo,
)
from src.utils.localcache import get_local_cache, set_local_cache
from src.utils.funcs import get_next_day_expire_date_unix


def get_verification_mail_template():
    with open(f'{os.path.dirname(os.path.abspath(__file__))}{os.sep}verification_mail.html', 'r', encoding='utf-8') as file:
        return file.read()


def format_assistant_id(assistant: Assistant, current_employee_id: str) -> Optional[GetAssistantResponse]:
    """
    Форматирование ID помощника (ID) и ID менеджера (ManagerID)
    к единому полю ID
    """
    if assistant.ID == current_employee_id:
        return GetAssistantResponse(
            ID=assistant.ManagerID,
            FullName=assistant.manager.FullNameRus,
            OrganizationID=assistant.manager.OrganizationID
        )
    elif assistant.ManagerID == current_employee_id:
        return GetAssistantResponse(
            ID=assistant.ID,
            FullName=assistant.assistant.FullNameRus,
            OrganizationID=assistant.assistant.OrganizationID
        )


def normalize_search_value(value: str) -> str:
    """
    Форматирование заменяемых букв строки поиска
    и удаление лишних символов
    """
    return (
        value.lower()
        .replace('ё', 'е')
        .strip()
    )


async def get_status_images(employee: Employee) -> list[dict]:
    status_key = None
    if employee.Boleet or employee.Otpusk:
        status_key = 'notAvailable'
    elif employee.Komandirovka:
        status_key = 'businessTrip'

    if not status_key:
        return []

    return [await get_cached_image(status_key, get_status_img)]


async def get_achievement_images(employee: Employee) -> list[dict]:
    achievements = []
    if employee.achievements:
        if getattr(employee.achievements, 'BestWorker', False):
            achievements.append('bestWorker')

    return [await get_cached_image(ach, get_achievement_img) for ach in achievements]


async def get_photo_urls(employee: Employee, size: int) -> Optional[str]:
    """
    Если фото большого размера не найдено - загружает миниатюру
    :param size: 96 или 512
    """
    photo = None
    if employee.Email:
        org_id = employee.OrganizationID
        email = employee.Email
        if size == 512:
            photo = await get_photo(org_id, email, 512, 'binary')
            if not photo:
                photo = await get_photo(org_id, email, 96, 'binary')
        elif size == 96:
            photo = await get_photo(org_id, email, 96, 'binary')

    return photo


async def get_cached_image(
    key: str,
    fetch_func: callable,
    expire_func: callable = get_next_day_expire_date_unix,
    mode: str = 'binary',
) -> dict:
    """
    Получает данные из локального кэша или загружает их через fetch_func и сохраняет в кэш.
    """
    cached = await get_local_cache(key)
    if cached:
        return cached

    result = await fetch_func(key, mode)
    expire = expire_func()
    await set_local_cache(key, result, expire=expire)

    return result


async def build_employee_tree(
        session: AsyncSession,
        department_id: str | None,
        with_children: bool,
        limit: int,
        organization_employees: Iterable[Employee],
        organization_departments: Iterable[Department],
) -> GetTreeEmployeeTableResponse:
    """
    Рекурсивное формирование дерева дочерних подразделений и сотрудниками в них
    """
    node_employees = list(organization_employees)
    if department_id:
        node_employees = list(filter(lambda employee: employee.DepartmentID == department_id, node_employees))

    employee_models = [GetEmployeeTableResponse.model_validate(employee, by_name=True) for employee in node_employees]

    '''
    Если в департаменте или в компании есть хотя бы один сотрудник,
    то берем атрибуты для построения дерева из него.
    Если департамент пустой, формируем запрос на получение департамента из БД
    '''
    department = next(filter(lambda dep: dep.ID == department_id, organization_departments))
    department_id = department.ID
    department_name = department.Name
    organization_id = department.organization.ID
    organization_name = department.organization.Name

    tree_model = GetTreeEmployeeTableResponse(
        DepartmentID=department_id,
        DepartmentName=department_name,
        OrganizationID=organization_id,
        OrganizationName=organization_name,
        employees=employee_models,
        children=[],
    )
    if with_children is False or department_id is None:
        return tree_model

    node_departments = list(filter(lambda department: department.ParentID == department_id, organization_departments))
    for child in node_departments:
        child_info = await build_employee_tree(
                department_id=child.ID,
                with_children=with_children,
                session=session,
                limit=limit,
                organization_employees=organization_employees,
                organization_departments=organization_departments,
            )
        tree_model.children.append(child_info)

    return tree_model


async def get_employee(
        session: AsyncSession,
        department_id: str,
        organization_id: str | int,
        with_children: bool,
        limit: int | None,
):
    query = (
        sample_employee_query()
        .where(
            Employee.OrganizationID == organization_id
        )
        .order_by(
            Department.Order,
            Category.Order,
            Position.Order,
            Employee.Order,
            Employee.FullNameRus,
        )
        .limit(limit)
    )
    employee_rows = await session.execute(query)
    employees = employee_rows.scalars().all()
    query = (
        select(Department)
        .options(
            joinedload(Department.organization)
        )
        .where(
            Department.OrganizationID == organization_id
        )
        .order_by(
            Department.Order
        )
    )
    department_rows = await session.execute(query)
    departments = department_rows.scalars().all()

    return await build_employee_tree(
        session=session,
        department_id=department_id,
        with_children=with_children,
        limit=limit,
        organization_employees=employees,
        organization_departments=departments
    )


async def get_employee_detail(
        session: AsyncSession,
        employee_id: str,
        organization_id: str
):
    query = (
        select(Employee)
        .options(
            joinedload(Employee.department),
            joinedload(Employee.organization),
            joinedload(Employee.category),
            joinedload(Employee.position),
            joinedload(Employee.edited_data),
            joinedload(Employee.achievements),

            # Явная загрузка информации о менеджерах
            joinedload(Employee.managers).joinedload(Assistant.assistant).load_only(
                Employee.FullNameRus,
                Employee.OrganizationID
            ),
            joinedload(Employee.managers).joinedload(Assistant.manager).load_only(
                Employee.FullNameRus,
                Employee.OrganizationID
            ),

            # Явная загрузка информации о помощниках
            joinedload(Employee.assistants).joinedload(Assistant.assistant).load_only(
                Employee.FullNameRus,
                Employee.OrganizationID
            ),
            joinedload(Employee.assistants).joinedload(Assistant.manager).load_only(
                Employee.FullNameRus,
                Employee.OrganizationID
            ),
        )
        .where(
            Employee.ID == employee_id,
            Employee.OrganizationID == organization_id,
        )
    )
    employee_row = await session.execute(query)
    employee = employee_row.scalar()
    if not employee:
        return None

    assistants = [
        format_assistant_id(a, employee.ID) for a in employee.assistants if a.assistant
    ]

    managers = [
        format_assistant_id(m, employee.ID) for m in employee.managers if m.manager
    ]

    # Запрет на редактирование высших менеджеров и ведущих менеджеров
    is_edit_available = True if employee.CategoryID not in ['К002', 'К001'] else False

    edited_data = dict()
    if employee.edited_data:
        edited_data = {
            'WorkPlace': employee.edited_data.WorkPlace if employee.edited_data.WorkPlace else employee.WorkPlace,
            'Order': employee.edited_data.Order if employee.edited_data.Order else employee.Order,
            'Address': employee.edited_data.Address if employee.edited_data.Address else employee.Address,
            'MobilePhonePrivate': employee.edited_data.MobilePhonePrivate if employee.edited_data.MobilePhonePrivate else None,
            'ExternalNumber': employee.edited_data.ExternalNumber if employee.edited_data.ExternalNumber else None,
        }

    # Аналог дата-класса без строгой типизации,
    # позволяющий не определять атрибуты заранее
    # и совместимый с Pydantic-моделями.
    # В данной реализации служит временным хранилищем
    # неизменяемых атрибутов модели ответа
    class EmployeeAssistants(SimpleNamespace):
        pass

    # Формирование временной модели, для возможности
    # переопределить атрибуты
    wrapped = EmployeeAssistants(
        **{
            **{
                key: getattr(employee, key)
                for key in dir(employee)
                if key not in [
                    'assistants',
                    'managers',
                    'WorkPlace',
                    'Order',
                    'Address',
                    'MobileNumberPersonal',
                    'isEditAvailable',
                ]
            },
            'assistants': assistants,
            'managers': managers,
            'isEditAvailable': is_edit_available,
            **edited_data,
        }
    )

    return GetEmployeeDetailResponse.model_validate(wrapped, from_attributes=True)


async def employee_search(
        session: AsyncSession,
        search_value: str,
        search_type: str,
        search_limit: int,

):
    query = sample_employee_query()

    match search_type:
        case 'fullName':
            query = (
                query
                .where(
                    func.replace(func.lower(Employee.FullNameRus), 'ё', 'е')
                    .like(f"%{normalize_search_value(search_value)}%"))
            )
        case 'phone':
            query = (
                query
                .where(Employee.TelephoneNumberCorp.like(f'%{normalize_search_value(search_value)}%'))
            )
        case 'email':
            query = (
                query
                .where(Employee.Email.like(f'%{normalize_search_value(search_value)}%'))
            )
        case 'position':
            query = (
                query
                .where(
                    func.replace(func.lower(Employee.PositionTitle), 'ё', 'е')
                    .like(f"%{normalize_search_value(search_value)}%"))
                )

    query = (
        query
        .order_by(
            Organization.Order,
            Department.Order,
            Category.Order,
            Position.Order,
            Employee.Order,
            Employee.FullNameRus,
        )
    )

    if search_limit:
        query = query.limit(search_limit)

    employee_rows = await session.execute(query)
    employees = employee_rows.scalars().all()

    result = list()

    """
    Группировка сотрудников по компаниям и департаментам
    """
    cached_id = set()
    for employee in employees:
        if employee.ID in cached_id:
            continue

        organization_employees = list(filter(
            lambda item: item.organization.ID == employee.organization.ID,
            employees))

        organization_model_data = {
            'OrganizationID': employee.organization.ID,
            'OrganizationName': employee.organization.Name,
            'departments': list(),
        }

        for org_employee in organization_employees:
            if org_employee.ID in cached_id:
                continue

            department_employees = list(filter(
                lambda item: org_employee.department.ID == item.department.ID and
                             org_employee.organization.ID == item.organization.ID,
                employees))

            cached_id.update(
                set(map(lambda item: item.ID, department_employees))
            )

            departments_model_data = {
                'DepartmentID': org_employee.department.ID,
                'DepartmentName': org_employee.department.Name,
                'OrganizationID': org_employee.organization.ID,
                'employees': [GetEmployeeTableResponse.model_validate(employee, by_name=True) for employee in department_employees]
            }

            organization_model_data['departments'].append(SearchEmployeeDepartment(**departments_model_data))

        result.append(SearchEmployeeResponse(**organization_model_data))
    return result


async def send_verification_code(
        session: AsyncSession,
        employee_id: str,
        organization_id: str | int,
):
    query = (
        select(Employee)
        .where(
            Employee.ID == employee_id,
            Employee.OrganizationID == organization_id,
        )
    )
    employee_row = await session.execute(query)
    employee = employee_row.scalar()

    if not employee:
        raise EmployeeNotFoundError(f'Не найден сотрудник с ID={employee_id} и OrganizationID={organization_id}')

    # Запрет на редактирование высших менеджеров и ведущих менеджеров
    if employee.CategoryID in ['К002', 'К001']:
        raise EmployeeNotEditableError(f'Сотрудники с CategoryID={employee.CategoryID} недоступен для редактирования')

    if not employee.Email:
        raise EmployeeWithoutEmailError(f'Сотрудники без Email недоступны для редактирования')

    is_code_exists = await r_get_verification_code(employee.Email)
    if is_code_exists:
        retry_after = await r_get_verification_code_seconds_expires(employee.Email)
        retry_date = (datetime.now() + timedelta(seconds=int(retry_after))).strftime('%d.%m.%Y %H:%M:%S')
        headers = {
                'Retry-After': str(retry_after),
                'X-Rate-Limit-Limit': '1',
                'X-Rate-Limit-Remaining': '0',
                'X-Rate-Limit-Reset': str(retry_date)
                }
        if is_code_exists == '0':
            raise DailyEditLimitExceededError(headers=headers)
        else:
            raise DailyVerificationLimitExceededError(headers=headers)


    verification_code = str(random.randrange(99999, 1000000))
    await r_set_verification_code(employee.Email, verification_code)
    email_text = get_verification_mail_template().replace('{{verification_code}}', verification_code)
    smtp_result = await async_send_email(
        email_text,
        'Код проверки',
        employee.Email
    )

    if smtp_result['success'] is True:
        return f'Письмо с кодом отправлено на {employee.Email}'
    else:
        raise SendEmailError


async def edit_employee(
        session: AsyncSession,
        verification_code: str,
        employee_id: str,
        organization_id: str | int,
        edited_data: dict
):
    query = (
        select(Employee)
        .where(
            Employee.ID == employee_id,
            Employee.OrganizationID == organization_id,
        )
    )
    employee_row = await session.execute(query)
    employee = employee_row.scalar()
    if not employee:
        raise EmployeeNotFoundError

    # Запрет на редактирование высших менеджеров и ведущих менеджеров
    if employee.CategoryID in ['К002', 'К001']:
        raise EmployeeNotEditableError

    employee_code = await r_get_verification_code(employee.Email)

    if employee_code == '0':
        retry_after = await r_get_verification_code_seconds_expires(employee.Email)
        retry_date = (datetime.now() + timedelta(seconds=int(retry_after))).strftime('%d.%m.%Y %H:%M:%S')
        headers = {
                'Retry-After': str(retry_after),
                'X-Rate-Limit-Limit': '1',
                'X-Rate-Limit-Remaining': '0',
                'X-Rate-Limit-Reset': str(retry_date)
                }
        raise DailyEditLimitExceededError(headers=headers)

    elif verification_code != employee_code:
        raise InvalidVerificationCodeError

    query = select(EditedEmployee).where(EditedEmployee.ID == employee.ID)
    edited_employee_row = await session.execute(query)
    edited_employee = edited_employee_row.scalar()

    if edited_employee:
        for key, value in edited_data.items():
            setattr(edited_employee, key, value)
    else:
        edited_employee = EditedEmployee(ID=employee_id, **edited_data)
        session.add(edited_employee)
    await session.commit()

    # Очистка кэша модального окна
    await r_delete_cache(f'/employee/detail?id={employee_id}&organizationId={organization_id}')

    # Замена кода проверки отметкой о том,
    # что для сотрудника были изменены данные
    await r_set_verification_code(employee.Email, '0')

    return Response(status_code=204)


async def get_employee_birthday(
        session: AsyncSession
):
    current_date = date.today()
    result = list()
    for _ in range(11):
        query = (
            sample_employee_query()
            .where(
                Employee.Birthday.is_not(None),
                Employee.Birthday.contains(current_date.strftime('%m-%d')),
            )
            .order_by(
                Organization.Order
            )
        )
        employee_rows = await session.execute(query)
        employees = employee_rows.scalars().all()
        result.append(
            GetEmployeeBirthdayDateGroupResponse(
                date=current_date,
                employees=[GetEmployeeBirthdaysResponse.model_validate(employee) for employee in employees]
            )
        )
        current_date = current_date + timedelta(days=1)

    return result


async def get_employee_image(
        employee_id: str,
        organization_id: str | int,
        photo_size: int,
        session: AsyncSession,
):
    query = (
        sample_employee_query()
        .where(
            Employee.ID == employee_id,
            Employee.OrganizationID == organization_id,
        )
    )
    employee_row = await session.execute(query)
    employee = employee_row.scalar()
    if not employee:
        raise EmployeeNotFoundError

    statuses = await get_status_images(employee)
    achievements = await get_achievement_images(employee)
    photo_urls = await get_photo_urls(employee, photo_size)
    return GetEmployeeImageResponse.model_validate(
        {
            'achievements': [EmployeeAchievement.model_validate(item) for item in achievements],
            'statuses': [EmployeeStatus.model_validate(item) for item in statuses],
            'photo': photo_urls
        }
    )
