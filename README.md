# Документация

Рекомендуется просмотр через Obsidian


## Правила оформления документации



---
#### Модули

Каждый модуль должен быть описан отдельной страницей в формате:

###### Заголовок

  - Название страницы - краткое описание.
  - Директория модуля
  - Описание функционала модуля
  - Разделитель

###### Содержание

Описание всех функций модуля в формате:

- Логическое и функциональное разделение функций в виде названия группы (название БД, название класса и тд.)
- Метод запроса: URL функции, если она является методом API
- Параметры для вызова (в формате Pydantic-модели если она есть, в ином случае в формате аннотации)
  - Атрибут
  - Имя (отображаемое в ответе, алиас)
  - Тип
  - Обязательный
  - Значение по-умолчанию
  - Описание (теги)
- Описание функции - тег с названием функции, что делает | зачем нужна, перечисление связей через теги, вставка кода с названием функции, параметрами и аннотацией
- Атрибуты ответа (в формате Pydantic-модели если она есть, в ином случае в формате аннотации) в виде таблицы:
  - Атрибут
  - Имя (отображаемое в ответе, алиас)
  - Тип
  - Описание (теги)
- Разделитель

---
#### Таблицы БД

Каждая таблица должна быть описана отдельным файлом 

###### Заголовок

  - Название таблицы в БД.
  - Назначение таблицы, какие данные хранит
  - Разделитель

###### Содержание

Должно содержать в себе таблицы, описывающие:

- Используемые атрибуты таблицы:
  - Атрибут
  - Тип
  - Описание
  - Теги в формате <Название таблицы>-<атрибут> для описываемой таблицы и для атрибутов связанных таблиц
    
- Отношения с таблицами:
  - Атрибут
  - Таблица (ссылка на страницу)
  - Тип отношений

---

#### Форматирование

- Italic: путь к директории, пояснения к основному тексту. 
  Примеры:
	  - */backend/src/database.py*
	  - *Для удобства все элементы таблицы в документации именуются "департаментом"*
	    
- Bold: для выделения важной информации в тексте. Например: время жизни кэша
  Примеры:
	  - Настроен на вычисление **7 часов утра следующего дня**
	    
- Code: Программный код, команды для выполнения на сервере или при запуске приложения, названия атрибутов, параметров их типы и значения; url-пути и методы запроса
  Примеры:
	  - `get_organization(request: Request)`
	  - `/organization`
	  - `ID:int`
	
- Highlight: Для выделения метода запроса 
  Примеры:
	- ==`GET`==
	
- H4 - Наименования абзацев текста с разделителем в конце текста
- H6 - Наименования таблиц, функций
- Теги - Если какой-либо объект упоминается в документации более одного раза. Должен служить инструментом для нахождения всех упоминаний объекта и формирования карты графов



  


## Сервер



---
- **IP:** 10.64.240.153
- **DNS:** phonebook.gsprom.ru
- **ОС:** Ubuntu 22.04.4 LTS
- **ЦП:** 8 ядер
- **RAM:** 16gb

- **Redis:** 6.0.16 версия


# Бэкенд


## Redis


Директория модуля - */backend/src/redis.py*

---

#redis-r_get_next_day_expire_date_unix Функция для вычисления количества секунд через которое запись будет удалена

```
r_get_next_day_expire_date_unix() -> int
```

Настроен на вычисление **7 часов утра следующего дня**

#### 0 - CACHE

*БД для кэширования запросов*

#redis-r_set_cache - записывает сформированный ответ запроса с expire-date #redis-r_get_next_day_expire_date_unix

```
r_set_cache(key: str, value)
```


#redis-r_get_cache - Возвращает кэшированный ответ запроса

```
r_get_cache(key: str)
```


#redis-r_delete_cache - Удаляет кэш по ключу, или полностью очищает БД если ключ не передан

```
r_delete_cache(key: str | None = None)
```

---

#### 6 - VERIFICATION_CODES

*БД для кодов верификации*

#redis-r_set_verification_code - Записывает код верификации

```
r_set_verification_code(key: str, value: str)
```


#redis-r_get_verification_code - Возвращает код верификации

```
r_get_verification_code(key: str) -> int
```


#redis-r_get_verification_code_seconds_expires - Возвращает время в секундах до истечения срока жизни кода проверки

```
r_get_verification_code_seconds_expires(key: str)
```


#redis-r_delete_verification_code - Удаляет ключ верификации по ключу

```
r_delete_verification_code(key: str)
```

---



## База данных


Директория модуля - */backend/src/database.py*

---



## Информация об API


Директория модуля - */backend/src/routes.py*

#swagger Swagger доступен под адресу `/docs`

---
Все GET-методы возвращают ответ в формате `{result: ...}`
Форматирование реализовано декоратором #router_result_formatter

Для всех GET-методов реализовано кэширование #redis-r_get_cache результата функции до ее форматирования #router_result_formatter

В случае, если время ожидания подключения к [[Redis]] превышает значение установленное в [[Переменные окружения]] кэширование данных происходит в локальном хранилище. При использовании локального хранилища для работы недоступны методы, использующие #redis-r_get_verification_code #redis-r_set_verification_code 



## Модели запросов


Директория модуля - */backend/src/models.py*

В модуле описаны схемы запросов к API и схемы ответов
Описание в формате JSON см.  [[Информация об API]] #swagger 

---
### Запросы

###### Получить список сотрудников для представления в таблице
#GetEmployeeTableRequest 

Используется в #get_employee

| Атрибут          | Тип            | Название в запросе | Значение по-умолчанию                                  | Обязательный | Описание                                                                                                                                                                     |
| ---------------- | -------------- | ------------------ | ------------------------------------------------------ | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DepartmentID`   | `str`          | `departmentId`     | `None`                                                 | Нет          | ID департамента #Departments-ID                                                                                                                                              |
| `OrganizationID` | `int` \| `str` | `organizationID`   | -                                                      | Да           | ID организации #Organizations-ID                                                                                                                                             |
| `limit`          | `int`          | limit              | Если не передан `OrganizationID` - `100`. Иначе `None` | Нет          | Максимальное количество возвращаемых сотрудников                                                                                                                             |
| `with_children`  | `bool`         | `withChildren`     | `True`                                                 | Нет          | `False` - возвращает только тех сотрудников, которые были найдены по OrganizationID и DepartmentID<br><br>`True` - возвращает так же всех сотрудников дочерних департаментов |


###### Получить подробную информацию о сотруднике
#GetEmployeeDetailRequest

Используется в #get_employee_detail 

| Атрибут          | Тип        | Название в запросе | Значение по-умолчанию                                | Обязательный | Описание                                                                                                                                                                     |
| ---------------- | ---------- | ------------------ | ---------------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ID`             | str        | id                 | -                                                    | Да           | ID сотрудника #Employees-ID                                                                                                                                                  |
| `OrganizationID` | int \| str | `organizationID`   | -                                                    | Да           | ID организации<br>#Organizations-ID                                                                                                                                          |



  
GetEmployeeDetailRequest,  
GetOrganizationResponse,  
GetOrganizationTreeRootResponse,  
GetExternalPhonebookResponse,  
GetEmployeeDetailResponse,  
GetEmployeeTableResponse,  
GetTreeEmployeeTableResponse,  
GetOrganizationTreeChildrenResponse,  
GetAssistantResponse,  
SearchEmployeeRequest,  
SearchEmployeeResponse,  
SearchEmployeeDepartment,  
SendVerificationCodeRequest,  
EditEmployeeRequest,  
ResultGetTreeEmployeeTableResponse,  
ResultGetEmployeeDetailResponse,  
ResultGetExternalPhonebookResponse,  
ResultGetOrganizationResponse,  
ResultGetOrganizationTreeResponse,  
ResultSearchEmployeeResponse,  
ResultSendVerificationCode,


## Отправка писем


Директория модуля - */backend/src/smtp.py*

---



## Переменные окружения


Директория модуля - */backend/config.py*

При локальной разработке переменные указываются в */backend/.env*

---
###### Переменные

| Название            | Тип   | Описание                                          |
| ------------------- | ----- | ------------------------------------------------- |
| `DB_USER`           | `str` | Логин пользователя БД                             |
| `DB_PASSWORD`       | `str` | Пароль пользователя БД                            |
| `DB_HOST`           | `str` | URL БД                                            |
| `DB_PORT`           | `int` | Порт БД                                           |
| `DB_NAME`           | str   | Название БД                                       |
| `REDIS_HOST`        | `str` | URL Redis                                         |
| `REDIS_PORT`        | `int` | Порт Redis                                        |
| `REDIS_TIMEOUT`     | `int` | Максимальное время ожидания при обращении к Redis |
| `SMTP_SERVER`       | `str` | URL SMTP сервера                                  |
| `SMTP_PORT`         | `int` | Порт SMTP сервера                                 |
| `SMTP_USER`         | `str` | Логин пользователя SMTP                           |
| `SMTP_PASSWORD`     | `str` | Пароль пользователя SMTP                          |
| `SMTP_DISPLAY_NAME` | `str` | Отображаемое имя отправителя в письмах            |




## API-методы


## Внешние источники


Методы работы с информацией из внешних источников

---



## Кэш


Методы работы с кэшированными данными

---



## Организации


Методы работы с организациями

---
#### Получить список организаций

==`GET`== `/organization`

```
get_organization(request: Request)
```

###### Возвращаемые данные

| Атрибут    | Имя        | Тип   | Описание               |
| ---------- | ---------- | ----- | ---------------------- |
| `ID`       | `id`       | `int` | #Organizations-ID      |
| `Name`     | `name`     | `str` | #Organizations-Name    |
| `FullName` | `fullName` | `str` | #OrganizationsFullName |
| `Order`    | `order`    | `int` | #Organizations-Order   |

---
#### Получить дерево организаций

==`GET`== `/organization/tree`

Формирует дерево организаций из вложенных объектов, в которых головные элементы - [[Organizations]], все остальные - [[Departments]]
Так же группирует департаменты каждой организации в отдельные вкладки (филиалы, обособленные подразделения)

```
get_organization_tree(request: Request)
```

###### Возвращаемые данные


###### Головные элементы

| Атрибут    | Имя        | Тип    | Описание                                                   |
| ---------- | ---------- | ------ | ---------------------------------------------------------- |
| `ID`       | `id`       | `int`  | #Organizations-ID                                          |
| `Name`     | `name`     | `str`  | #Organizations-Name                                        |
| `Root`     | `root`     | `bool` | `1` - головной элемент                                     |
| `TreeID`   | `order`    | `int`  | ID элемента, который присваивается при формирования дерева |
| `children` | `children` | `list` | Список дочерних элементов                                  |

###### Дочерние элементы

| Атрибут          | Имя              | Тип    | Описание                                                   |
| ---------------- | ---------------- | ------ | ---------------------------------------------------------- |
| `ID`             | `id`             | `int`  | #Departments-ID                                            |
| `Name`           | `name`           | `str`  | #Departments-Name                                          |
| `Filial`         | `filial`         | `int`  | #Departments-Filial                                        |
| `OrganizationID` | `organizationId` | `int`  | #Organizations-ID                                          |
| `TreeID`         | `treeId`         | `int`  | ID элемента, который присваивается при формирования дерева |
| `children`       | `children`       | `list` | Список дочерних элементов                                  |

---



## Сотрудники





## Статусы


Методы проверки работоспособности компонентов

---




## Структура БД (ЕИБД)


## Categories



Таблица категорий должностей сотрудников

---
###### Используемые атрибуты таблицы

| Атрибут | Тип   | Описание                                         | Теги              |
| ------- | ----- | ------------------------------------------------ | ----------------- |
| `ID`    | `str` | ID категории                                     | #Categories-ID    |
| `Name`  | `str` | Название категории                               | #Categories-Name  |
| `Order` | `int` | Заполняется вручную, используется при сортировке | #Categories-Order |

###### Отношения с таблицами

| Атрибут        | Таблица           | Тип отношений |
| -------------- | ----------------- | ------------- |
| `employees`    | [[Employees]]     | one-to-many   |




## Departments



Таблица структурных единиц (департамент, отдел, подразделение и тд.)

*Для удобства все элементы таблицы в документации именуются "департаментом"* 

---
###### Используемые атрибуты таблицы

| Атрибут          | Тип   | Описание                                                                                             | Теги                                          |
| ---------------- | ----- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `ID`             | `str` | GUID len(36) Гарантирутся, что ID уникальный только в рамках одной организации                       | #Departments-ID                               |
| `Name`           | `str` | Название департамента                                                                                | #Departments-Name                             |
| `ParentID`       | `str` | ID родительского департамента                                                                        | #Departments-ParentID #Departments-ID         |
| `Order`          | `int` | Заполняется вручную, используется при сортировке                                                     | #Departments-Order                            |
| `Filial`         | `int` | 0 \| 1 - являеется филиалом или нет                                                                  | #Departments-Filial                           |
| `Level`          | `int` | Уровень вложенности департамента по отношению к головному элементу ([организации](Organizations.md)) | #Departments-Level                            |
| `OrganizationID` | `int` | ID организации                                                                                       | #Departments-OrganizationID #Organizations-ID |

###### Отношения с таблицами

| Атрибут        | Таблица           | Тип отношений |
| -------------- | ----------------- | ------------- |
| `employees`    | [[Employees]]     | one-to-many   |
| `organization` | [[Organizations]] | many-to-one   |







## EditedEmployees



Таблица с измененными через телефонный справочник данными сотрудника

---
###### Используемые атрибуты таблицы

| Атрибут              | Тип   | Описание                                                   | Теги                                           |
| -------------------- | ----- | ---------------------------------------------------------- | ---------------------------------------------- |
| `ID`                 | `str` | ID сотрудника                                              | #EditedEmployees-ID #Employees-ID              |
| `WorkPlace`          | `int` | Рабочее место сотрудника (номер рабочего места \| кабинет) | #EditedEmployees-WorkPlace #Employee-WorkPlace |
| `Order`              | `int` | Заполняется вручную, используется при сортировке           | #EditedEmployees-Order #Employee-Order         |
| `Address`            | `str` | Адрес рабочего места сотрудника                            | #EditedEmployees-Address #Employees-Address    |
| `MobilePhonePrivate` | `str` | Личный мобильный телефон сотрудника                        | #EditedEmployees-MobilePhonePrivate            |
| `ExternalNumber`     | `str` | Внешний городской номер сотрудника                         | #EditedEmployees-ExternalNumber                |



## Employees



Таблица сотрудников

---
###### Используемые атрибуты таблицы

| Атрибут               | Тип    | Описание                                                                                                 | Теги                                       |
| --------------------- | ------ | -------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `ID`                  | `str`  | ID сотрудника; GUID len(36);  Гарантирутся, что ID уникальный только в рамках одной организации          | #Employees-ID                              |
| `LastNameRus`         | `str`  | Фамилия                                                                                                  | #Employees-LastNameRus                     |
| `NameRus`             | `str`  | Имя                                                                                                      | #Employees-NameRus                         |
| `MiddleNameRus`       | `str`  | Отчество                                                                                                 | #Employees-MiddleNameRus                   |
| `FullNameRus`         | `str`  | ФИО                                                                                                      | #Employees-FullNameRus                     |
| `DepartmentID`        | `str`  | ID департамента                                                                                          | #Employee-DepartmentID #Departments-ID     |
| `OrganizationID`      | `int`  | ID организации                                                                                           | #Employee-OrganizationID #Organizations-ID |
| `CategoryID`          | `str`  | ID категории должности                                                                                   | #Employee-CategoryID #Categories-ID        |
| `PositionID`          | `str`  | ID должности                                                                                             | #Employee-PositionID #Positions-ID         |
| `PositionTitle`       | `str`  | Название должности                                                                                       | #Employees-PositionTitle                   |
| `Email`               | `str`  | Email                                                                                                    | #Employees-Email                           |
| `TelephoneNumberCorp` | `str`  | 6-значный внутренний номер телефона; первые две цифры - префикс компании; 4 последние - номер сотрудника | #Employees-TelephoneNumberCorp             |
| `MobileNumberCorp`    | `str`  | Рабочий мобильный номер сотрудника                                                                       | #Employee-MobileNumberCorp                 |
| `WorkPlace`           | `str`  | Рабочее место сотрудника (номер рабочего места \| кабинет)                                               | #Employee-WorkPlace                        |
| `Address`             | `str`  | Адрес рабочего места сотрудника                                                                          | #Employees-Address                         |
| `Order`               | `int`  | Заполняется вручную, используется при сортировке                                                         | #Employee-Order                            |
| `Fired`               | `bool` | Уволен \| не уволен                                                                                      | #Employee-Fired                            |
| `Decret`              | `bool` | В декретном отпуске                                                                                      | #Employee-Decret                           |
| `Otpusk`              | `bool` | В отпуске                                                                                                | #Employee-Otpusk                           |
| `Boleet`              | `bool` | На больничном                                                                                            | #Employee-Boleet                           |
| `Komandirovka`        | `bool` | В командировке                                                                                           | #Employee-Komandirovka                     |
| `Invisible`           | `bool` | Атрибут для ручного скрытия сотрудника                                                                   | #Employee-Invisible                        |
| `Birthday`            | `date` | Дата рождения                                                                                            | #Employee-Birthday                         |

#### Отношения с таблицами


| Атрибут        | Таблица               | Тип отношений |
| -------------- | --------------------- | ------------- |
| `organization` | [[Organizations]]     | many-to-one   |
| `department`   | [[Departments]]       | many-to-one   |
| `category`     | [[Categories]]        | many-to-one   |
| `position`     | [[Positions]]         | many-to-one   |
| `edited_data`  | [[EditedEmployees]]   | one-to-one    |
| `managers`     | [[ManagerAssistants]] | many-to-many  |
| `assistants`   | [[ManagerAssistants]] | many-to-many  |



## ExternalPhonebooks



Таблица со ссылками на телефонные справочники компаний

---
###### Используемые атрибуты таблицы

| Атрибут | Тип   | Описание                                         | Теги                      |
| ------- | ----- | ------------------------------------------------ | ------------------------- |
| `ID`    | `int` | Первичный ключ                                   | #ExternalPhonebooks-ID    |
| `URL`   | `str` | Ссылка на справочник                             | #ExternalPhonebooks-URL   |
| `Name`  | `str` | Текст ссылки (название организации)              | #ExternalPhonebooks-Name  |
| `Order` | `int` | Заполняется вручную, используется при сортировке | #ExternalPhonebooks-Order |



## ManagerAssistants



Таблица с отношениями сотрудник - помощник

---
###### Используемые атрибуты таблицы

| Атрибут     | Тип   | Описание                                  | Теги                                       |
| ----------- | ----- | ----------------------------------------- | ------------------------------------------ |
| `ID`        | `str` | ID сотрудника (помощника)                 | #ManagerAssistants-ID #Employees-ID        |
| `ManagerID` | `str` | ID сотрудника (кому принадлежит помощник) | #ManagerAssistants-ManagerID #Employees-ID |

###### Отношения с таблицами

| Атрибут     | Таблица       | Тип отношений |
| ----------- | ------------- | ------------- |
| `assistant` | [[Employees]] | many-to-many  |
| `manager`   | [[Employees]] | many-to-many  |




## Organizations



Таблица организаций

---

###### Используемые атрибуты таблицы

| Атрибут    | Тип   | Описание                                         | Теги                   |
| ---------- | ----- | ------------------------------------------------ | ---------------------- |
| `ID`       | `int` | ИНН организации                                  | #Organizations-ID      |
| `Name`     | `str` | Сокращенное название организации                 | #Organizations-Name    |
| `Order`    | `int` | Заполняется вручную, используется при сортировке | #Organizations-Order   |
| `FullName` | `str` | Полное название организации                      | #OrganizationsFullName |

###### Отношения с таблицами

| Атрибут       | Таблица         | Тип отношений |
| ------------- | --------------- | ------------- |
| `employees`   | [[Employees]]   | one-to-many   |
| `departments` | [[Departments]] | one-to-many   |






## Positions



Таблица должностей сотрудников

---
###### Используемые атрибуты таблицы

| Атрибут    | Тип   | Описание                                         | Теги                |
| ---------- | ----- | ------------------------------------------------ | ------------------- |
| `ID`       | `str` | ID должности; GUID len(36)                       | #Positions-ID       |
| `Name`     | `str` | Название должности                               | #Positions-Name     |
| `Category` | `str` | ID категории должности                           | #Positions-Category |
| `Order`    | `int` | Заполняется вручную, используется при сортировке | #Positions-Order    |

###### Отношения с таблицами

| Атрибут     | Таблица       | Тип отношений |
| ----------- | ------------- | ------------- |
| `employees` | [[Employees]] | many-to-many  |




# Фронтенд

