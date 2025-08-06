from fastapi import APIRouter, Response


router = APIRouter(
    prefix='/status',
    tags=['status']
)


@router.get(
    '',
)
def get_status():
    return Response(status_code=204)