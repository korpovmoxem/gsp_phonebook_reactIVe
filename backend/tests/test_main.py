import asyncio
from time import perf_counter
import json
import os

import pytest
from httpx import ASGITransport, AsyncClient

from backend.main import app
from backend.src.models import (
    SearchEmployeeRequest,
    GetEmployeeTableRequest,
    GetEmployeeDetailRequest,
    SendVerificationCodeRequest,
    EditEmployeeRequest,
)
from backend.src.redis import r_delete_verification_code, r_get_verification_code


ORGANIZATION_URL = '/organization'
ORGANIZATION_TREE_URL = '/organization/tree'
EXTERNAL_PHONEBOOK_URL = '/external/phonebook'
EMPLOYEE_URL = '/employee'
EMPLOYEE_SEARCH_URL = '/employee/search'
EMPLOYEE_DETAIL_URL = '/employee/detail'
EMPLOYEE_VERIFICATION_URL = '/employee/verification'
EMPLOYEE_EDIT_URL = '/employee/edit'


with open(f'{os.path.dirname(os.path.abspath(__file__))}{os.sep}test_cases.json', 'r', encoding='utf-8') as file:
    test_cases = json.load(file)


@pytest.fixture(scope="module")
async def async_client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://testserver") as client:
        yield client


@pytest.fixture(scope="module")
def event_loop():
    policy = asyncio.WindowsSelectorEventLoopPolicy() if os.name == 'nt' else None
    if policy:
        asyncio.set_event_loop_policy(policy)

    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


def get_result_data(response_result: dict):
    return response_result['result']


@pytest.mark.anyio
async def test_organization(async_client):
    response = await async_client.get(ORGANIZATION_URL)
    assert response.status_code == 200
    assert get_result_data(response.json())


@pytest.mark.anyio
async def test_organization_tree(async_client):
    response = await async_client.get(ORGANIZATION_TREE_URL)
    assert response.status_code == 200
    assert get_result_data(response.json())

    # Проверка скорости получения кэша
    start_time = perf_counter()
    response = await async_client.get(ORGANIZATION_TREE_URL)
    assert get_result_data(response.json())
    assert (perf_counter() - start_time) < 0.5


@pytest.mark.anyio
async def test_external_phonebook(async_client):
    response = await async_client.get(EXTERNAL_PHONEBOOK_URL)
    assert response.status_code == 200
    assert get_result_data(response.json())

'''
@pytest.mark.anyio
async def test_employee(async_client):

    # Ограничение количества тестируемых департаментов
    # для каждой организации
    max_iterations = 1

    organizations = await async_client.get(ORGANIZATION_TREE_URL)
    for organization in get_result_data(organizations.json()):
        print(organization['id'])
        department_iteration_counter = int()

        # Загрузка сотрудников организации
        params = GetEmployeeTableRequest(
            organizationId=organization['id']
        ).model_dump(exclude_unset=True, by_alias=True)
        print(EMPLOYEE_URL, params)
        response = await async_client.get(EMPLOYEE_URL, params=params)
        assert response.status_code == 200
        assert get_result_data(response.json())

        # Загрузка сотрудников департаментов
        for department in organization['children']:
            if department_iteration_counter >= max_iterations:
                break
            if department['id'] is None:
                continue
            department_iteration_counter += 1
            params = GetEmployeeTableRequest(
                departmentId=department['id'],
                organizationId=department['organizationId']
            ).model_dump(exclude_unset=True, by_alias=True)
            print(EMPLOYEE_URL, params)
            response = await async_client.get(EMPLOYEE_URL, params=params)
            assert response.status_code == 200
            employees = get_result_data(response.json())['employees']
            assert next(filter(lambda row: row['organizationId'] != organization['id'] or
                                           row['departmentId'] != department['id'], employees), None) is None
'''

@pytest.mark.anyio
@pytest.mark.parametrize(
    "case",
    test_cases['employee']['search'],
    ids=lambda test: f"case-{test['type']}"
)
async def test_employee_search(async_client, case):
    params = SearchEmployeeRequest(**case).model_dump(exclude_unset=True)
    print(EMPLOYEE_SEARCH_URL, case)
    response = await async_client.get(EMPLOYEE_SEARCH_URL, params=params)
    assert response.status_code == 200
    assert get_result_data(response.json())

'''
@pytest.mark.anyio
async def test_employee_detail(async_client):
    organizations = await async_client.get(ORGANIZATION_URL)
    for organization in get_result_data(organizations.json()):
        params = GetEmployeeTableRequest(
            organizationId=organization['id'],
            limit=1
        ).model_dump(exclude_unset=True, by_alias=True)
        print(EMPLOYEE_URL, params)
        response = await async_client.get(EMPLOYEE_URL, params=params)
        for emp in get_result_data(response.json())['employees']:
            params = GetEmployeeDetailRequest(**emp).model_dump(exclude_unset=True, by_alias=True)
            print(EMPLOYEE_DETAIL_URL, params)
            response = await async_client.get(EMPLOYEE_DETAIL_URL, params=params)
            assert response.status_code == 200
            assert get_result_data(response.json())
'''

@pytest.mark.anyio
async def test_employee_birthday(async_client):
    response = await async_client.get('/employee/birthday')
    assert response.status_code == 200
    assert get_result_data(response.json())


@pytest.mark.anyio
@pytest.mark.parametrize("case", test_cases['employee']['verification'])
async def test_employee_verification(async_client, case):
    params = GetEmployeeDetailRequest(**case).model_dump(exclude_unset=True, by_alias=True)
    print(EMPLOYEE_DETAIL_URL, params)
    response = await async_client.get(EMPLOYEE_DETAIL_URL, params=params)
    employee_email = get_result_data(response.json())['email']

    # Удаление кода если он есть для тестирования первой отправки за день
    await r_delete_verification_code(employee_email)

    params = SendVerificationCodeRequest(**case).model_dump()
    response = await async_client.post(EMPLOYEE_VERIFICATION_URL, json=params)
    assert response.status_code == 200

    # Проверка ограничения отправки раз в день
    response = await async_client.post(EMPLOYEE_VERIFICATION_URL, json=params)
    assert response.status_code == 429
    await r_delete_verification_code(employee_email)


@pytest.mark.anyio
@pytest.mark.parametrize("case", test_cases['employee']['edit'])
async def test_employee_edit(async_client, case):
    employee_params = GetEmployeeDetailRequest(**case).model_dump(exclude_unset=True, by_alias=True)
    print(EMPLOYEE_DETAIL_URL, employee_params)
    response = await async_client.get(EMPLOYEE_DETAIL_URL, params=employee_params)
    employee_info = get_result_data(response.json())
    employee_email = employee_info['email']

    # Удаление кода для проверки ограничения отправки письма раз в день
    # и ограничения на изменения данных раз в день
    await r_delete_verification_code(employee_email)

    verification_code_params = SendVerificationCodeRequest(**case).model_dump()
    print(EMPLOYEE_VERIFICATION_URL, verification_code_params)
    response = await async_client.post(EMPLOYEE_VERIFICATION_URL, json=verification_code_params)
    verification_code = await r_get_verification_code(employee_email)

    params = EditEmployeeRequest(**case,).model_dump(exclude_unset=True, by_alias=True)
    print(EMPLOYEE_EDIT_URL, params)
    response = await async_client.patch(
        EMPLOYEE_EDIT_URL,
        params={'verification_code': verification_code},
        json=params
    )
    assert response.status_code == 204

    print(EMPLOYEE_DETAIL_URL, params)
    response = await async_client.get(EMPLOYEE_DETAIL_URL, params=employee_params)
    updated_employee_info = get_result_data(response.json())
    for key in case.keys():
        if key in ['id', 'organizationId']:
            continue
        print(key, case[key], employee_info[key], updated_employee_info[key])
        assert updated_employee_info[key] == case[key]
        assert updated_employee_info[key] != employee_info[key]

    # Проверяем, что код нельзя использовать повторно
    print(EMPLOYEE_EDIT_URL, params, verification_code)
    response = await async_client.patch(
        EMPLOYEE_EDIT_URL,
        params={'verification_code': verification_code},
        json=params
    )
    assert response.status_code == 429

    # Проверяем, что нельзя запрашивать изменения чаще одного раза в день
    print(EMPLOYEE_VERIFICATION_URL, verification_code_params)
    response = await async_client.post(EMPLOYEE_VERIFICATION_URL, json=verification_code_params)
    assert response.status_code == 429

    # Удаление кода для возвращения исходных значений атрибутов
    await r_delete_verification_code(employee_email)

    print(EMPLOYEE_VERIFICATION_URL, verification_code_params)
    response = await async_client.post(EMPLOYEE_VERIFICATION_URL, json=verification_code_params)
    verification_code = await r_get_verification_code(employee_email)

    # Возвращаем значения атрибутов до тестирования
    params = EditEmployeeRequest(**employee_info).model_dump(exclude_unset=True, by_alias=True)
    print(EMPLOYEE_EDIT_URL, params, verification_code)
    response = await async_client.patch(
        EMPLOYEE_EDIT_URL,
        params={'verification_code': verification_code},
        json=params
    )
    assert response.status_code == 204
    print(EMPLOYEE_DETAIL_URL, employee_params)
    response = await async_client.get(EMPLOYEE_DETAIL_URL, params=employee_params)
    assert get_result_data(response.json()) == employee_info

    await r_delete_verification_code(employee_email)





















