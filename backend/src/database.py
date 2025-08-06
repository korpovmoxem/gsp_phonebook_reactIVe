from datetime import date
from typing import Optional, List
import asyncio

from sqlalchemy import ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, relationship, validates, sessionmaker
from sqlalchemy.ext.asyncio import AsyncAttrs, async_sessionmaker, create_async_engine
from sqlalchemy.testing.schema import mapped_column
from sqlalchemy.schema import PrimaryKeyConstraint
from sqlalchemy.ext.hybrid import hybrid_property

from backend.config import settings


DATABASE_URL = settings.get_async_db_url()
async_engine = create_async_engine(
    url=DATABASE_URL,
    #echo=True,
    pool_pre_ping=True,
)

async_session_maker = async_sessionmaker(async_engine, expire_on_commit=False)


class Base(AsyncAttrs, DeclarativeBase):
    __abstract__ = True


class Organization(Base):
    __tablename__ = 'Organizations'

    ID: Mapped[int] = mapped_column('ID')
    Name: Mapped[str]
    Order: Mapped[int]
    FullName: Mapped[str]

    __mapper_args__ = {
        'primary_key': [ID]
    }

    employees: Mapped[List['Employee']] = relationship('Employee', back_populates='organization')
    departments: Mapped[list['Department']] = relationship('Department', back_populates='organization')


class Department(Base):
    __tablename__ = 'Departments'

    __table_args__ = (
        PrimaryKeyConstraint(
            'ID',
            'OrganizationID'
        ),
    )

    ID: Mapped[str] = mapped_column('ID')
    Name: Mapped[str]
    ParentID: Mapped[str] = mapped_column('ParentID', ForeignKey('Departments.ID'))
    Order: Mapped[int]
    Filial: Mapped[int]
    Level: Mapped[int]
    OrganizationID: Mapped[str] = mapped_column('OrganizationID', ForeignKey('Organizations.ID'))
    #ManagerID: Mapped[str]

    employees: Mapped[List['Employee']] = relationship('Employee', back_populates='department')
    organization: Mapped['Organization'] = relationship('Organization', back_populates='departments')


class Employee(Base):
    __tablename__ = 'Employees'

    __table_args__ = (
        PrimaryKeyConstraint(
            'ID',
            'OrganizationID'
        ),
    )

    ID: Mapped[str]
    LastNameRus: Mapped[str]
    NameRus: Mapped[str]
    MiddleNameRus: Mapped[str]
    FullNameRus: Mapped[str]
    DepartmentID: Mapped[str] = mapped_column(ForeignKey('Departments.ID'))
    OrganizationID: Mapped[int] = mapped_column(ForeignKey('Organizations.ID'))
    CategoryID: Mapped[str] = mapped_column(ForeignKey('Categories.ID'))
    PositionID: Mapped[str] = mapped_column(ForeignKey('Positions.ID'))
    PositionTitle: Mapped[str]
    Email: Mapped[str]
    TelephoneNumberCorp: Mapped[str]
    MobileNumberCorp: Mapped[str]
    WorkPlace: Mapped[str]
    Address: Mapped[str]
    Order: Mapped[int]
    Fired: Mapped[bool]
    Decret: Mapped[bool]
    Otpusk: Mapped[bool]
    Boleet: Mapped[bool]
    Komandirovka: Mapped[bool]
    Invisible: Mapped[bool]
    Birthday: Mapped[date]

    organization: Mapped['Organization'] = relationship('Organization', back_populates='employees')
    department: Mapped['Department'] = relationship('Department', back_populates='employees')
    category: Mapped['Category'] = relationship('Category', back_populates='employees')
    position: Mapped['Position'] = relationship('Position', back_populates='employee')
    edited_data: Mapped['EditedEmployee'] = relationship('EditedEmployee')
    achievements: Mapped['Achievements'] = relationship('Achievements')

    managers: Mapped[List["Assistant"]] = relationship(
        "Assistant",
        foreign_keys="[Assistant.ID]",
        primaryjoin="Employee.ID == Assistant.ID",
        back_populates="assistant"
    )

    assistants: Mapped[List["Assistant"]] = relationship(
        "Assistant",
        foreign_keys="[Assistant.ManagerID]",
        primaryjoin="Employee.ID == Assistant.ManagerID",
        back_populates="manager"
    )


    @hybrid_property
    def DepartmentName(self) -> Optional[str]:
        if self.department is not None:
            return self.department.Name
        return None

    @hybrid_property
    def OrganizationName(self) -> Optional[str]:
        if self.organization is not None:
            return self.organization.Name
        return None


class Category(Base):
    __tablename__ = 'Categories'

    ID: Mapped[str] = mapped_column(primary_key=True)
    Name: Mapped[str]
    Order: Mapped[int]

    employees: Mapped[List['Employee']] = relationship('Employee', back_populates='category')


class Position(Base):
    __tablename__ = 'Positions'

    ID: Mapped[str] = mapped_column(primary_key=True)
    Name: Mapped[str]
    Category: Mapped[str]
    Order: Mapped[int]

    employee: Mapped[List['Employee']] = relationship('Employee', back_populates='position')


class ExternalPhonebook(Base):
    __tablename__ = 'ExternalPhonebooks'

    ID: Mapped[int] = mapped_column(primary_key=True)
    URL: Mapped[str]
    Name: Mapped[str]
    Order: Mapped[int]


class Assistant(Base):
    __tablename__ = 'ManagerAssistants'

    ID: Mapped[str] = mapped_column(ForeignKey('Employees.ID'), primary_key=True)
    ManagerID: Mapped[str] = mapped_column(ForeignKey('Employees.ID'), primary_key=True)

    assistant: Mapped["Employee"] = relationship(
        "Employee",
        foreign_keys=[ID],
        primaryjoin="Assistant.ID == Employee.ID",
        back_populates="managers",
    )

    manager: Mapped["Employee"] = relationship(
        "Employee",
        foreign_keys=[ManagerID],
        primaryjoin="Assistant.ManagerID == Employee.ID",
        back_populates="assistants",
    )

    @property
    def OrganizationID(self) -> int | None:
        if self.assistant:
            return self.assistant.OrganizationID
        elif self.manager:
            return self.manager.OrganizationID

    @property
    def FullName(self) -> str:
        if self.assistant:
            return self.assistant.FullNameRus
        elif self.manager:
            return self.manager.FullNameRus


class EditedEmployee(Base):
    __tablename__ = 'EditedEmployees'

    ID: Mapped[str] = mapped_column(ForeignKey('Employees.ID'), primary_key=True)
    WorkPlace: Mapped[int]
    Order: Mapped[int]
    Address: Mapped[str]
    MobilePhonePrivate: Mapped[str]
    ExternalNumber: Mapped[str]
    #HideEmail: Mapped[str]
    #HideTelephoneNumberCorp: Mapped[str]
    #HideWorkPlace: Mapped[str]
    #HideAddress: Mapped[str]


class Achievements(Base):
    __tablename__ = 'Achievements'

    EmployeeID: Mapped[str] = mapped_column(ForeignKey('Employees.ID'), primary_key=True)
    BestWorker: Mapped[bool]
