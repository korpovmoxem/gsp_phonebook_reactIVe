import asyncio
from datetime import datetime, timedelta


async def run_async(func, *args):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, func, *args)


def get_next_dat_expire_date_timedelta():
    next_day = datetime.now() + timedelta(days=1)
    expire_date = datetime(next_day.year, next_day.month, next_day.day, hour=7)
    return expire_date - datetime.now()


def get_next_day_expire_date_unix() -> int:
    """
    Возвращает разницу в секундах между датой удаления и текущей датой
    """
    next_day = datetime.now() + timedelta(days=1)
    expire_date = datetime(next_day.year, next_day.month, next_day.day, hour=7)
    return int(expire_date.timestamp() - datetime.now().timestamp())
