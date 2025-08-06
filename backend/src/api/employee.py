from typing import Annotated, Literal

from fastapi import APIRouter, Request, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from backend.src.utils.decorators import (
    router_result_caching,
    router_result_formatter
)
from backend.src.services.employee import (
    get_employee,
    get_employee_detail,
    employee_search,
    send_verification_code,
    edit_employee,
    get_employee_birthday,
    get_employee_image,
)
from backend.src.models import (
    GetEmployeeTableRequest,
    GetEmployeeDetailRequest,
    SearchEmployeeRequest,
    SendVerificationCodeRequest,
    EditEmployeeRequest,
    GetEmployeeImageRequest,
    ResultGetTreeEmployeeTableResponse,
    ResultGetEmployeeDetailResponse,
    ResultSearchEmployeeResponse,
    ResultSendVerificationCode,
    ResultEmployeeBirthdaysDateGroupResponse,
    ResultGetEmployeeImageResponse,
)
from backend.src.utils.exceptions import NoParamsToEditEmployee
from backend.src.utils.sql import get_session


router = APIRouter(
    prefix='/employee',
    tags=['employee']
)


@router.get(
    '',
    response_model=ResultGetTreeEmployeeTableResponse
)
@router_result_caching(ResultGetTreeEmployeeTableResponse)
@router_result_formatter
async def get_employee_route(
        request: Request,
        employee_request: Annotated[GetEmployeeTableRequest, Query()],
        session: AsyncSession = Depends(get_session),
):
    return await get_employee(
        session=session,
        department_id=employee_request.DepartmentID,
        organization_id=employee_request.OrganizationID,
        with_children=employee_request.with_children,
        limit=employee_request.limit,
    )


@router.get(
    '/detail',
    response_model=ResultGetEmployeeDetailResponse
)
@router_result_caching(ResultGetEmployeeDetailResponse)
@router_result_formatter
async def get_employee_detail_route(
        request: Request,
        employee_request: Annotated[GetEmployeeDetailRequest, Query()],
        session: AsyncSession = Depends(get_session),
):
    return await get_employee_detail(
        session=session,
        employee_id=employee_request.ID,
        organization_id=employee_request.OrganizationID
    )


@router.get(
    '/image',
    response_model=ResultGetEmployeeImageResponse,
)
@router_result_caching(ResultGetEmployeeImageResponse)
@router_result_formatter
async def get_employee_image_route(
        request: Request,
        employee_request: Annotated[GetEmployeeImageRequest, Query()],
        session: AsyncSession = Depends(get_session),
):
    return await get_employee_image(
        employee_id=employee_request.ID,
        organization_id=employee_request.OrganizationID,
        photo_size=int(employee_request.PhotoSize.value),
        session=session,
    )


@router.get(
    '/search',
    response_model=ResultSearchEmployeeResponse,
)
@router_result_caching(ResultSearchEmployeeResponse)
@router_result_formatter
async def employee_search_route(
        request: Request,
        search_attrs: Annotated[SearchEmployeeRequest, Query()],
        session: AsyncSession = Depends(get_session),
):
    return await employee_search(
        session=session,
        search_value=search_attrs.value,
        search_type=search_attrs.type,
        search_limit=search_attrs.limit,
    )


@router.post(
    '/verification',
    response_model=ResultSendVerificationCode,
)
@router_result_formatter
async def send_verification_code_route(
        employee_request: SendVerificationCodeRequest,
        session: AsyncSession = Depends(get_session),
):
    return await send_verification_code(
        session=session,
        employee_id=employee_request.ID,
        organization_id=employee_request.OrganizationID,
    )


@router.patch(
    '/edit',
)
async def edit_employee_route(
        request: Request,
        edited_data: EditEmployeeRequest,
        verification_code: str,
        session: AsyncSession = Depends(get_session),
):
    # Исключаем не переданные атрибуты
    edited_data_dict = edited_data.model_dump(exclude_unset=True)

    # Проверяем были ли переданы атрибуты кроме обязательных двух
    if len(edited_data_dict) <= 2:
        raise NoParamsToEditEmployee

    edited_data_dict.pop('ID')
    edited_data_dict.pop('OrganizationID')

    return await edit_employee(
        session=session,
        verification_code=verification_code,
        employee_id=edited_data.ID,
        organization_id=edited_data.OrganizationID,
        edited_data=edited_data_dict
    )


@router.get(
    '/birthday',
    response_model=ResultEmployeeBirthdaysDateGroupResponse
)
@router_result_caching(ResultEmployeeBirthdaysDateGroupResponse)
@router_result_formatter
async def get_employee_birthday_route(
        request: Request,
        session: AsyncSession = Depends(get_session),
):
    return await get_employee_birthday(session)