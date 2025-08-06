
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr
import asyncio
import logging
import sys

import aiosmtplib

from backend.config import settings


logger = logging.getLogger('smtp')
logger.setLevel(logging.DEBUG)
handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.DEBUG)
formatter = logging.Formatter(
    fmt="%(levelname)s: %(asctime)s [%(name)s] - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"

)
handler.setFormatter(formatter)
logger.addHandler(handler)


smtp_semaphore = asyncio.Semaphore(10)


async def async_send_email(text: str, theme: str, recipients: str | list[str]) -> dict:
    logger_events = list()
    success_status = True
    smtp_settings = settings.get_aiosmtp_settings()
    print(smtp_settings)
    display_name_from = settings.get_smtp_display_name()
    if isinstance(recipients, str):
        recipients = [recipients]

    for to in recipients:
        msg = MIMEMultipart()
        msg.attach(MIMEText(text, 'html'))
        msg['Subject'] = theme
        msg['From'] = formataddr((display_name_from, smtp_settings['username']))
        msg['To'] = to
        async with smtp_semaphore:
            try:
                await aiosmtplib.send(
                    msg,
                    **smtp_settings,
                    timeout=30,
                    start_tls=True,
                    validate_certs=False,
                )
                logger.debug(f'Письмо отправлено на {to}')
            except Exception as e:
                exc_type, exc_obj, exc_tb = sys.exc_info()
                logger_text = f"Не удалось отправить письмо на {to}"
                logger.error(f'{logger_text}: {exc_type} {e} {exc_tb.tb_lineno}')
                logger_events.append(logger_text)
                success_status = False

    if not success_status:
        return {
            'success': success_status,
            'detail': logger_text
        }
    return {
        'success': success_status,
        'detail': 'Все письма успешно отправлены'
    }

