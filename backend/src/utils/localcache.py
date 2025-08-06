import asyncio

from diskcache import Cache


local_cache = Cache()


async def get_local_cache(key: str):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, local_cache.get, key)


async def set_local_cache(key, value, expire=None):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, local_cache.set, key, value, expire)