from fastapi import APIRouter

from src.utils.localcache import local_cache
from src.redis import (
    r_delete_cache,
    r_get_verification_code,
    r_delete_verification_code
)


router = APIRouter(
    prefix='/cache',
    tags=['cache']
)

@router.get(
    '/delete',
)
async def delete_cache(key: str | None = None):
    local_cache.clear()
    await r_delete_cache(key)
    return f'Данные кэша удалены {key}'


@router.get(
    '/code',
)
async def get_code(email: str):
    return await r_get_verification_code(email)


@router.get(
    '/code/delete',
)
async def delete_code(email: str):
    await r_delete_verification_code(email)