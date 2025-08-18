from datetime import datetime, timedelta

import redis.asyncio as redis

from config import settings
from src.utils.funcs import get_next_day_expire_date_unix


REDIS_URL = settings.get_redis_url()
REDIS_TIMEOUT = settings.get_redis_timeout()

# БД кэширования запросов
CACHE_DB = redis.from_url(
    url=REDIS_URL,
    decode_responses=True,
    db=0,
    socket_connect_timeout=REDIS_TIMEOUT,
    socket_timeout=REDIS_TIMEOUT,
)

# БД хранения кодов верификации для изменения данных модального окна
VERIFICATION_CODES_DB = redis.from_url(
    url=REDIS_URL,
    decode_responses=True,
    db=6,
    socket_connect_timeout=REDIS_TIMEOUT,
    socket_timeout=REDIS_TIMEOUT,
)



async def r_set_cache(key: str, value):
    await CACHE_DB.set(key, value, ex=get_next_day_expire_date_unix())


async def r_get_cache(key: str):
    return await CACHE_DB.get(key)


async def r_delete_cache(key: str | None = None):
    if key is None:
        return await CACHE_DB.flushdb()
    await CACHE_DB.delete(key)


async def r_set_verification_code(key: str, value: str):
    await VERIFICATION_CODES_DB.set(key, value, ex=get_next_day_expire_date_unix())


async def r_get_verification_code(key: str) -> int:
    return await VERIFICATION_CODES_DB.get(key)


async def r_get_verification_code_seconds_expires(key: str):
    """
    Возвращает время в секундах до истечения срока жизни кода проверки
    """
    return await VERIFICATION_CODES_DB.ttl(key)


async def r_delete_verification_code(key: str):
    await VERIFICATION_CODES_DB.delete(key)
