from typing import Literal

from minio import Minio
import yaml

from backend.config import settings
from backend.src.utils.funcs import (
    run_async,
    get_next_dat_expire_date_timedelta,
)
from backend.src.utils.decorators import format_exceptions_to_none_result
from backend.src.utils.decorators import urllib3_http_response_to_base64


client = Minio(**settings.get_storage_settings())


STATUSES_FOLDER = {
    'bucket_name': 'assets',
    'prefix': 'statuses/'
}

ACHIEVEMENTS_FOLDER = {
    'bucket_name': 'assets',
    'prefix': 'achievements/'
}

DOWNLOADING_MODES = Literal['url', 'binary']


def get_mode_func(mode=DOWNLOADING_MODES) -> callable:
    match mode:
        case 'url':
            return client.presigned_get_object
        case 'binary':
            return client.get_object


@urllib3_http_response_to_base64
@format_exceptions_to_none_result
async def get_achievement_img(achievement: str, mode=DOWNLOADING_MODES):
    descriptions = await run_async(
        client.get_object,
        ACHIEVEMENTS_FOLDER['bucket_name'],
        ACHIEVEMENTS_FOLDER['prefix'] + 'descriptions.yml'
    )
    descriptions = yaml.load(descriptions.read(), yaml.SafeLoader)
    img = await run_async(
        get_mode_func(mode),
        ACHIEVEMENTS_FOLDER['bucket_name'],
        ACHIEVEMENTS_FOLDER['prefix'] + achievement + '.png',
        get_next_dat_expire_date_timedelta()
    )
    return {
        'description': descriptions[achievement],
        'img': img
    }


@urllib3_http_response_to_base64
@format_exceptions_to_none_result
async def get_status_img(status: str, mode=DOWNLOADING_MODES):
    descriptions = await run_async(
        client.get_object,
        STATUSES_FOLDER['bucket_name'],
        STATUSES_FOLDER['prefix'] + 'descriptions.yml'
    )
    descriptions = yaml.load(descriptions.read(), yaml.SafeLoader)
    img = await run_async(
        get_mode_func(mode),
        STATUSES_FOLDER['bucket_name'],
        STATUSES_FOLDER['prefix'] + status + '.png',
        get_next_dat_expire_date_timedelta()
    )

    return {
        'description': descriptions[status],
        'img': img
    }


@urllib3_http_response_to_base64
@format_exceptions_to_none_result
async def get_photo(
        organization_id: int | str,
        email: str,
        size: int,
        mode=DOWNLOADING_MODES
) -> str | None:
    photo_url = await run_async(
        get_mode_func(mode),
            'photo-' + str(organization_id),
            f'{size}px/' + email + '.jpg',
            get_next_dat_expire_date_timedelta()
    )
    return photo_url