from typing import List, Optional
from enum import Enum
from datetime import date

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


def replace_quotes(value: str):
    if '"' in value:
        value = value.replace('"', '«', 1).replace('"', '»')
    return value

def str_value_to_int(value: str):
    if isinstance(value, int):
        value = str(value)
    return value

def empty_value_to_none(value: str | None):
    if not value and value is not None:
        return None
    return value


class GetOrganizationRequest(BaseModel):
    ID: int = Field(alias='id')

    model_config = ConfigDict(populate_by_name=True)


class GetOrganizationResponse(BaseModel):
    ID: int = Field(alias='id')
    Name: str = Field(alias='name')
    FullName: str = Field(alias='fullName')
    Order: int = Field(alias='order')

    @field_validator('Name', 'FullName')
    def change_name_quotes(cls, value):
        return replace_quotes(value)

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class GetDepartmentResponse(BaseModel):
    ID: str = Field(alias='id')
    Name: str = Field(alias='name')
    ParentID: str = Field(alias='parentId')
    Order: int = Field(alias='order')
    Filial: int = Field(alias='filial')
    Level: int = Field(alias='level')
    OrganizationID: int | str = Field(alias='organizationId')

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    @field_validator('OrganizationID')
    def convert_organization_to_str(cls, value) -> str:
        return str_value_to_int(value)


class GetOrganizationTreeChildrenResponse(BaseModel):
    ID: str | None = Field(alias='id', default=None)
    Name: str = Field(alias='name')
    Filial: int = Field(alias='filial', default=0)
    OrganizationID: int | str | None = Field(alias='organizationId', default=None)
    TreeID: str | None = Field(alias='treeId', default=None)

    children: List['GetOrganizationTreeChildrenResponse'] = []

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    @field_validator('OrganizationID')
    def convert_organization_to_str(cls, value) -> str:
        return str_value_to_int(value)


class GetOrganizationTreeRootResponse(BaseModel):
    ID: int | str = Field(alias='id')
    Name: str = Field(alias='name')
    Root: bool = Field(alias='root', default=True)
    TreeID: str | None = Field(alias='treeId', default=None)

    children: List[GetOrganizationTreeChildrenResponse] = []

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    @field_validator('Name')
    def change_name_quotes(cls, value):
        return replace_quotes(value)

    @field_validator('ID')
    def convert_organization_to_str(cls, value) -> str:
        return str_value_to_int(value)


class GetEmployeeTableRequest(BaseModel):
    DepartmentID: str = Field(alias='departmentId', default=None)
    OrganizationID: int | str = Field(alias='organizationId')
    limit: Optional[int] = Field(default=None)
    with_children: bool | None = Field(alias='withChildren', default=True)

    model_config = ConfigDict(populate_by_name=True)

    '''
    @model_validator(mode='after')
    def set_limit_to_organization(self):
        if self.OrganizationID is not None and self.DepartmentID is None:
            object.__setattr__(self, 'limit', 100)
        return self
    '''

    @model_validator(mode='after')
    def organization_without_children(self):
        if self.OrganizationID is not None and self.DepartmentID is None:
            object.__setattr__(self, 'with_children', False)
        return self

    @field_validator('with_children')
    def bool_with_children(cls, value):
        if value is None:
            return True
        return value


class EmployeeStatus(BaseModel):
    description: Optional[str]
    img: Optional[str]

    ConfigDict(populate_by_name=True)

class EmployeeAchievement(BaseModel):
    description: Optional[str]
    img: Optional[str]

    ConfigDict(populate_by_name=True)


class GetEmployeeTableResponse(BaseModel):
    ID: str = Field(alias='id')
    FullNameRus: str = Field(alias='fullNameRus')
    PositionTitle: str = Field(alias='positionTitle')
    Email: Optional[str] = Field(alias='email')
    TelephoneNumberCorp: Optional[str] = Field(alias='telephoneNumberCorp')

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    @field_validator('TelephoneNumberCorp')
    def phone_to_none(cls, value):
        return empty_value_to_none(value)


class GetTreeEmployeeTableResponse(BaseModel):
    DepartmentID: str = Field(alias='departmentId')
    DepartmentName: str = Field(alias='departmentName')
    OrganizationID: int | str = Field(alias='organizationId')
    OrganizationName: str = Field(alias='organizationName')
    employees: List[GetEmployeeTableResponse]
    children: List['GetTreeEmployeeTableResponse']

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    @field_validator('OrganizationName')
    def change_name_quotes(cls, value):
        return replace_quotes(value)

    @field_validator('OrganizationID')
    def convert_organization_to_str(cls, value) -> str:
        return str_value_to_int(value)


class GetEmployeeBirthdaysResponse(BaseModel):
    FullNameRus: str = Field(alias='fullNameRus')
    OrganizationName: str = Field(alias='organizationName')

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    @field_validator('OrganizationName')
    def change_name_quotes(cls, value):
        return replace_quotes(value)


class GetEmployeeBirthdayDateGroupResponse(BaseModel):
    date: date | str
    employees: List[GetEmployeeBirthdaysResponse]

    @field_validator('date')
    def date_to_str(cls, value):
        if isinstance(value, date):
            value = value.isoformat()
        return value


class GetEmployeeDetailRequest(BaseModel):
    ID: str = Field(alias='id')
    OrganizationID: int | str = Field(alias='organizationId')

    model_config = ConfigDict(populate_by_name=True)


class GetAssistantResponse(BaseModel):
    ID: str = Field(alias='id')
    OrganizationID: int | str = Field(alias='organizationId')
    FullName: str = Field(alias='fullName')

    model_config = ConfigDict(populate_by_name=True)

    @field_validator('OrganizationID')
    def convert_organization_to_str(cls, value) -> str:
        return str_value_to_int(value)


class GetEmployeeDetailResponse(BaseModel):
    ID: str = Field(alias='id')
    FullNameRus: str = Field(alias='fullNameRus')
    DepartmentID: str = Field(alias='departmentId')
    OrganizationID: int | str = Field(alias='organizationId')
    DepartmentName: Optional[str] = Field(alias='departmentName')
    OrganizationName: Optional[str] = Field(alias='organizationName')
    PositionTitle: str = Field(alias='positionTitle')
    Email: Optional[str] = Field(alias='email')
    TelephoneNumberCorp: Optional[str] = Field(alias='telephoneNumberCorp')
    ExternalNumber: Optional[str] = Field(alias='externalNumberCorp', default=None)
    MobileNumberCorp: Optional[str] = Field(alias='mobileNumberCorp', default=None)
    MobilePhonePrivate: Optional[str] = Field(alias='mobileNumberPersonal', default=None)
    WorkPlace: Optional[int | None | str] = Field(alias='workPlace', default=None)
    Address: Optional[str] = Field(alias='address', default=None)

    assistants: Optional[List[GetAssistantResponse]]
    managers: Optional[List[GetAssistantResponse]]
    is_edit_available: bool = Field(alias='isEditAvailable', default=True)

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    @field_validator('OrganizationName')
    def change_name_quotes(cls, value):
        return replace_quotes(value)

    @field_validator('OrganizationID')
    def convert_organization_to_str(cls, value) -> str:
        return str_value_to_int(value)

    @field_validator('TelephoneNumberCorp')
    def phone_to_none(cls, value):
        return empty_value_to_none(value)

    @field_validator('WorkPlace')
    def empty_workplace_to_none(cls, value) -> int | None:
        if isinstance(value, str) and not value:
            value = None
        return value


class EmployeePhotoSize(Enum):
     full = '512'
     mini = '96'


class GetEmployeeImageRequest(BaseModel):
    ID: str = Field(alias='id')
    OrganizationID: str | int = Field(alias='organizationId')
    PhotoSize: EmployeePhotoSize = Field(alias='photoSize')

    model_config = ConfigDict(populate_by_name=True)


class GetEmployeeImageResponse(BaseModel):
    statuses: List[Optional[EmployeeStatus]]
    achievements: List[Optional[EmployeeAchievement]]
    photo: Optional[str]


class EditEmployeeRequest(BaseModel):
    ID: str = Field(alias='id')
    OrganizationID: int | str = Field(alias='organizationId')
    MobilePhonePrivate: Optional[str] = Field(alias='mobileNumberPersonal', default=None)
    ExternalNumber: Optional[str] = Field(alias='externalNumberCorp', default=None)
    WorkPlace: Optional[int | None] = Field(alias='workPlace', default=None)
    Address: Optional[str] = Field(alias='address', default=None)

    model_config = ConfigDict(populate_by_name=True)


class SearchType(Enum):
    FullName = 'fullName'
    Phone = 'phone'
    Email = 'email'
    Position = 'position'


class SearchEmployeeRequest(BaseModel):
    value: str
    type: SearchType
    limit: Optional[int] = Field(default=None)

    model_config = ConfigDict(populate_by_name=True)

    @field_validator('type')
    def search_type_to_str(cls, value) -> str:
        return value.value


class SearchEmployeeDepartment(BaseModel):
    DepartmentID: str = Field(alias='departmentId')
    OrganizationID: int | str = Field(alias='organizationId')
    DepartmentName: str = Field(alias='departmentName')

    employees: List[GetEmployeeTableResponse]

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    @field_validator('OrganizationID')
    def convert_organization_to_str(cls, value) -> str:
        return str_value_to_int(value)


class SearchEmployeeResponse(BaseModel):
    OrganizationID: int | str = Field(alias='organizationId')
    OrganizationName: str = Field(alias='organizationName')

    departments: List[SearchEmployeeDepartment]

    @field_validator('OrganizationName')
    def change_name_quotes(cls, value):
        return replace_quotes(value)

    @field_validator('OrganizationID')
    def convert_organization_to_str(cls, value) -> str:
        return str_value_to_int(value)

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class GetExternalPhonebookResponse(BaseModel):
    URL: str = Field(alias='url')
    Name: str = Field(alias='name')

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class SendVerificationCodeRequest(BaseModel):
    ID: str = Field(alias='id')
    OrganizationID: int | str = Field(alias='organizationId')

    model_config = ConfigDict(populate_by_name=True)


class ResultGetOrganizationResponse(BaseModel):
    result: List[GetOrganizationResponse]

class ResultGetDepartmentResponse(BaseModel):
    result: List[GetDepartmentResponse]

class ResultGetOrganizationTreeResponse(BaseModel):
    result: List[GetOrganizationTreeRootResponse]

class ResultGetEmployeeResponse(BaseModel):
    result: List[GetEmployeeTableResponse]

class ResultGetTreeEmployeeTableResponse(BaseModel):
    result: GetTreeEmployeeTableResponse

class ResultGetEmployeeDetailResponse(BaseModel):
    result : GetEmployeeDetailResponse | None

class ResultGetExternalPhonebookResponse(BaseModel):
    result: List[GetExternalPhonebookResponse]

class ResultSearchEmployeeResponse(BaseModel):
    result: List[SearchEmployeeResponse]

class ResultSendVerificationCode(BaseModel):
    result: str

class ResultEmployeeBirthdaysDateGroupResponse(BaseModel):
    result: List[GetEmployeeBirthdayDateGroupResponse]

class ResultGetEmployeeImageResponse(BaseModel):
    result: GetEmployeeImageResponse