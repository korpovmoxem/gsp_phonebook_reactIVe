from sqlalchemy import false, or_, Select, select, and_
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import (
    Employee,
)
from src.database import async_session_maker



def active_employee_filter():
    """
    Фильтр активных сотрудников
    """
    return and_(
        or_(Employee.Fired == false(), Employee.Fired.is_(None)),
        or_(Employee.Decret == false(), Employee.Decret.is_(None)),
        or_(Employee.Invisible == false(), Employee.Invisible.is_(None)),
        Employee.CategoryID.not_in(['К004', 'К006']),
        or_(
            and_(Employee.TelephoneNumberCorp.is_not(None), Employee.TelephoneNumberCorp != ''),
            and_(Employee.Email.is_not(None), Employee.Email != '')
        )
    )


def sample_employee_query() -> Select:
    """
    Шаблонный запрос для получения сотрудников и их связями с департаментом и компанией
    """
    return (
        select(Employee)
        .options(
            joinedload(Employee.department),
            joinedload(Employee.organization),
            joinedload(Employee.category),
            joinedload(Employee.position),
            joinedload(Employee.achievements),
        )
        .join(Employee.organization)
        .join(Employee.department)
        .join(Employee.category)
        .join(Employee.position)
        .where(active_employee_filter())
    )


async def get_session() -> AsyncSession:
    async with async_session_maker() as session:
        yield session