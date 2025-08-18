from functools import wraps
from typing import Callable
from time import perf_counter
import logging
import sys
import json
import base64

from fastapi import Request, HTTPException

from src.redis import (
    r_get_cache,
    r_set_cache,
    get_next_day_expire_date_unix
)
from src.utils.localcache import (
    set_local_cache,
    get_local_cache,
)


logger = logging.getLogger('routes')
logger.setLevel(logging.INFO)
handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.INFO)
formatter = logging.Formatter(
    fmt="%(levelname)s %(asctime)s [%(name)s] - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
handler.setFormatter(formatter)
logger.addHandler(handler)



def router_result_formatter(func: Callable):
    """
    Декоратор для форматирования ответа роута в вид
    {result: <response-data>}
    """
    @wraps(func)
    async def wrapper(*args, **kwargs) -> dict:
        result = await func(*args, **kwargs)
        return {'result': result}
    return wrapper


def router_result_caching(model):
    """
    Декоратор для получения кэшированного ответа роута и для его записи
    Прослойка между оригинальной функцией и декоратором router_result_formatter
    :param model: Pydantic модель ответа роута
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(request: Request, *args, **kwargs):
            if request.method != "GET":
                raise HTTPException(
                    status_code=405,
                    detail="Метод не разрешён: кэширование доступно только для GET-запросов"
                )

            start_time = perf_counter()
            logger_text = str()

            # Хранение и запись кэша по ключу соответствующему url роута
            cache_key = request.url.path + '?' + str(request.query_params)
            try:
                result = await r_get_cache(cache_key)
                logger_text = f"Взят из Redis: {cache_key}"
            except Exception as e:
                logger.error(f"Ошибка получения кэша из Redis: <{e}>")
                result = await get_local_cache(cache_key)
                if result:
                    logger_text = f"Взят из local_cache: {cache_key}"


            if result:
                # Форматирование результата к единому формату
                result = {'result': json.loads(result)}
                if isinstance(result, list):
                    result = [model.model_validate(item, by_name=True) for item in result]
                else:
                    result = model(**result)

            else:
                result = await func(request, *args, **kwargs)
                # Берем только данные без ключа 'result'
                result_data = result['result']
                if isinstance(result_data, list):
                    json_data = json.dumps([item.model_dump() for item in result_data])
                else:
                    json_data = json.dumps(result_data.model_dump())

                try:
                    await r_set_cache(cache_key, json_data)
                    logger_text = f"Записан в Redis {cache_key}"
                except Exception as e:
                    logger.error(f"Ошибка записи в Redis <{e}>")
                    await set_local_cache(
                        cache_key,
                        json_data,
                        expire=get_next_day_expire_date_unix()
                    )
                    logger_text = f"Записан в local_cache {cache_key}"

            if logger_text:
                duration = perf_counter() - start_time
                logger.info(f"{logger_text} - {duration:.4f} сек.")
            return result

        return wrapper
    return decorator


def urllib3_http_response_to_base64(func):
    async def wrapper(*args, **kwargs):
        result = await func(*args, **kwargs)
        if 'read' in dir(result):
            result = base64.b64encode(result.read()).decode('utf-8')
        elif isinstance(result, dict):
            for key, value in result.items():
                if 'read' in dir(value):
                    result[key] = base64.b64encode(value.read()).decode('utf-8')
        return result
    return wrapper


def format_exceptions_to_none_result(func):
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)
        except Exception as e:
            print(e)
            return None
    return wrapper
