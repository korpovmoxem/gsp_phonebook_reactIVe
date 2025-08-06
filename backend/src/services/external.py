from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.src.database import (
    ExternalPhonebook
)
from backend.src.models import (
    GetExternalPhonebookResponse
)

async def get_external_phonebook(session: AsyncSession):
    query = select(ExternalPhonebook).order_by(ExternalPhonebook.Order)
    result = await session.execute(query)
    phonebooks = result.scalars().all()
    return [GetExternalPhonebookResponse.model_validate(ph, by_name=True) for ph in phonebooks]