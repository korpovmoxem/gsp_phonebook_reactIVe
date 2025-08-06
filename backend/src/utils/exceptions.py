class AppCustomError(Exception):
    status_code = 500
    detail = 'Внутренняя ошибка сервера'
    headers = None

    def __init__(self, detail=None, status_code=None, headers=None):
        if detail:
            self.detail = detail
        if status_code:
            self.status_code = status_code
        if headers:
            self.error_code = headers

        super().__init__(self.detail)

class EmployeeNotFoundError(AppCustomError):
    status_code = 404
    detail = 'Сотрудник не найден'

class EmployeeNotEditableError(AppCustomError):
    status_code = 422
    detail = 'Сотрудник недоступен для редактирования'

class InvalidVerificationCodeError(AppCustomError):
    pass

class EmployeeWithoutEmailError(AppCustomError):
    status_code = 422
    detail = 'У сотрудника отсутствует Email'

class DailyEditLimitExceededError(AppCustomError):
    status_code = 429
    detail = 'Редактирование данных доступно один раз в день'

class DailyVerificationLimitExceededError(AppCustomError):
    status_code = 429
    detail = 'Отправка кода проверки доступна один раз в день'

class SendEmailError(AppCustomError):
    pass

class NoParamsToEditEmployee(AppCustomError):
    status_code = 400,
    detail='Не переданы параметры для изменения данных сотрудника'