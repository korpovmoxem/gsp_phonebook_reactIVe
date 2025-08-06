from fastapi import APIRouter, Request, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.src.models import (
    ResultGetExternalPhonebookResponse,
)
from backend.src.utils.decorators import (
    router_result_formatter,
    router_result_caching
)
from backend.src.services.external import get_external_phonebook
from backend.src.utils.sql import get_session



router = APIRouter(
    prefix='/external',
    tags=['external']
)



@router.get(
    '/phonebook',
    description='Получить ссылки на справочники внешних организаций',
    response_model=ResultGetExternalPhonebookResponse
)
@router_result_caching(ResultGetExternalPhonebookResponse)
@router_result_formatter
async def get_external_phonebook_route(
        request: Request,
        session: AsyncSession = Depends(get_session)
):
    return await get_external_phonebook(session)