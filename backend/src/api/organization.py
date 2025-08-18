from fastapi import APIRouter, Request, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.models import (
    ResultGetOrganizationResponse,
    ResultGetOrganizationTreeResponse
)
from src.services.organization import (
    get_organization,
    get_organization_tree
)
from src.utils.decorators import (
    router_result_caching,
    router_result_formatter
)
from src.utils.sql import get_session


router = APIRouter(
    prefix='/organization',
    tags=['organization']
)


@router.get(
    '',
    description='Получить информацию об организациях',
    response_model=ResultGetOrganizationResponse,
)
@router_result_caching(ResultGetOrganizationResponse)
@router_result_formatter
async def get_organization_route(
        request: Request,
        session: AsyncSession = Depends(get_session)
):
    return await get_organization(session)


@router.get(
    '/tree',
    description='Получить древо структурных единиц',
    response_model=ResultGetOrganizationTreeResponse,
)
@router_result_caching(ResultGetOrganizationTreeResponse)
@router_result_formatter
async def get_organization_tree_route(
        request: Request,
        session: AsyncSession = Depends(get_session)
):
    return await get_organization_tree(session)