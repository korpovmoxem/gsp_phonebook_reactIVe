from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from prometheus_fastapi_instrumentator import Instrumentator
import uvicorn

from src.api.organization import router as organization_router
from src.api.employee import router as employee_router
from src.api.external import router as external_router
from src.api.cache import router as cache_router
from src.api.status import router as status_router
from src.utils.exceptions import AppCustomError
from src.utils.localdata import generate_local_data
from config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    if 'localhost' in settings.DB_HOST:
        await generate_local_data()
    yield

import os
print(os.listdir())
app = FastAPI(
    title = 'Телефонный справочник ГСП',
    lifespan=lifespan,
)
#instrumentator = Instrumentator(use_registry=True).instrument(app)
instrumentator = Instrumentator().instrument(app)
instrumentator.expose(app)

app.include_router(organization_router)
app.include_router(employee_router)
app.include_router(external_router)
app.include_router(cache_router)
app.include_router(status_router)

origins = [
    '*',
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(AppCustomError)
async def handle_app_error(request: Request, exc: AppCustomError):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail or str(exc)},
        headers=exc.headers
    )


if __name__ == '__main__':
    uvicorn.run(
        app,
        host='0.0.0.0',
        port=8001,
    )