import { useEffect, useMemo } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useOrgStore } from "../../store/organizationStore";
import { EmployeeSkeleton } from "./EmployeeSkeleton";
import PhotoDefault from "../../assets/photo.jpg";
import { toast } from "react-toastify";
import { EmployeeDepartmentPath } from "./EmployeeDepartmentPath";
import {
    CATEGORIES,
    Employee,
    EmployeesListTree,
    EmployeesList,
} from "../../types";
import NotFound from "../../assets/notFound.gif";
import NotFoundIcon from "../../assets/notFoundIcon.png";
import {
    CustomCopyButton,
    CustomEmailLink,
    SearchWrapper,
} from "../StyledComponents";
import {
    CellWrapper,
    ThirdHeader,
    EmployeeListWrapperMain,
    EmployeeListWrapperTable,
    EmployeeTableRowDiv,
    EmptyHeadColumn,
    FirstHeader,
    HeadColumn,
    PositionWrapper,
    SecondHeader,
} from "./StyledComponents";
import Highlighter from "react-highlight-words";
import { SearchBar } from "../SearchBar/SearchBar";
import { ClipboardCopy } from "lucide-react";

// Функция для рекурсивного сбора всех сотрудников из дерева
const getAllEmployees = (tree: EmployeesListTree): Employee[] => {
    let result = [...tree.employees];
    for (const child of tree.children) {
        result = result.concat(getAllEmployees(child));
    }
    return result;
};

// Пустой шаблон, чтобы TS не ругался
const emptyEmployeesTree: EmployeesListTree = {
    organizationId: "",
    organizationName: "",
    departmentId: "",
    departmentName: "",
    employees: [],
    children: [],
};

const HIGHLIGHTER_COLOR = "#b2dff7";

export const EmployeeList: React.FC = () => {
    const [searchParams] = useSearchParams();

    const employees = useOrgStore((state) => state.employees);
    const isEmpLoading = useOrgStore((state) => state.isEmpLoading);
    const employeesList = useOrgStore((state) => state.employeesList);
    const fetchEmployeesWithParams = useOrgStore(
        (state) => state.fetchEmployeesWithParams
    );
    const isEmployeeInfoModalOpen = useOrgStore(
        (state) => state.isEmployeeInfoModalOpen
    );
    const setIsEmployeeInfoModalOpen = useOrgStore(
        (state) => state.setIsEmployeeInfoModalOpen
    );
    const fetchCurrentEmployeeInfo = useOrgStore(
        (state) => state.fetchCurrentEmployeeInfo
    );
    const selectOrg = useOrgStore((state) => state.selectOrg);

    const searchValue = searchParams.get("value");
    const searchCategory = searchParams.get("type") as CATEGORIES | null;
    const organizationId = searchParams.get("organizationId");
    const departmentId = searchParams.get("departmentId");

    const handleCopyClick = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.info("Скопировано в буфер обмена", { position: "top-right" });
    };

    const handleRowClick = (empId: string, orgId: string) => {
        setIsEmployeeInfoModalOpen(!isEmployeeInfoModalOpen);
        fetchCurrentEmployeeInfo(empId, orgId);
    };

    // Берём либо реальное дерево, либо пустой шаблон
    const employeesTree = useMemo(
        () => employees ?? emptyEmployeesTree,
        [employees]
    );

    // Плоский список всех сотрудников из дерева
    const flatEmployees = useMemo(
        () => getAllEmployees(employeesTree),
        [employeesTree]
    );

    // Группировка плоского списка по департаментам
    const departments = useMemo(() => {
        const map: Record<
            string,
            {
                departmentId: string;
                departmentName: string;
                employees: Employee[];
            }
        > = {};
        flatEmployees.forEach((emp) => {
            if (!map[emp.departmentId]) {
                map[emp.departmentId] = {
                    departmentId: emp.departmentId,
                    departmentName: emp.departmentName,
                    employees: [],
                };
            }
            map[emp.departmentId].employees.push(emp);
        });
        return Object.values(map);
    }, [flatEmployees]);

    useEffect(() => {
        // При пустых параметрах — выбираем дефолтную орг. и департамент
        if (
            !searchValue &&
            !searchCategory &&
            !organizationId &&
            !departmentId
        ) {
            selectOrg(
                "7842155505",
                "9c685cfe-e9a0-11e8-90f2-0050569026ba",
                "false"
            );
        } else if (searchValue && searchCategory) {
            // Режим поиска
            fetchEmployeesWithParams(searchValue, searchCategory);
        } else if (organizationId) {
            // Клик по организации/департаменту через URL
            selectOrg(organizationId, departmentId ?? null, "false");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const location = useLocation();
    const isDefaultRoute =
        location.pathname === "/" && ![...searchParams].length;

    function getAllEmails(data: EmployeesListTree): (string | null)[] {
        const emails: (string | null)[] = [
            ...data.employees.map((emp) => emp.email),
        ];

        for (const child of data.children) {
            emails.push(...getAllEmails(child));
        }

        return emails;
    }

    const handleClickCopyEmails = () => {
        let emails = "";
        console.log("handleClickCopyEmails");
        console.log(employeesList);
        console.log(employees);
        if (employeesList.length > 0) {
            employeesList.forEach((organization) => {
                organization.departments.forEach((department) => {
                    department.employees.forEach((employee) => {
                        if (employee.email) {
                            emails += `${employee.email} `;
                        }
                    });
                });
            });
        } else {
            if (employees) {
                emails = getAllEmails(employees).join(" ");
            }
        }
        navigator.clipboard.writeText(emails);
        toast.info("Скопировано в буфер обмена", {
            position: "top-right",
        });
    };

    useEffect(() => {
        if (isDefaultRoute) {
            selectOrg(
                "7842155505",
                "9c685cfe-e9a0-11e8-90f2-0050569026ba",
                "false"
            );
        }
    }, [isDefaultRoute]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                flex: "5 5 0%",
                height: "100%",
            }}
        >
            <div>
                <SearchWrapper>
                    <SearchBar />
                </SearchWrapper>
                <span
                    style={{
                        justifySelf: "end",
                        cursor: "pointer",
                        display: "flex",
                        margin: "5px 10px 0 0",
                    }}
                    title="Скопировать Email всех найденных сотрудников"
                    onClick={handleClickCopyEmails}
                >
                    <ClipboardCopy size={20} stroke="grey" />
                </span>
            </div>
            <EmployeeListWrapperMain>
                {isEmpLoading ? (
                    <EmployeeSkeleton />
                ) : (
                    <EmployeeListWrapperTable>
                        {/* === Пункт 1: выбор по орг/департаменту + начальное отображение === */}
                        {employeesList.length === 0 ? (
                            <div>
                                {departments.length > 0 && (
                                    <>
                                        <FirstHeader>
                                            <EmptyHeadColumn> </EmptyHeadColumn>
                                            <HeadColumn
                                                style={{ flex: "3 3 0%" }}
                                            >
                                                ФИО
                                            </HeadColumn>
                                            <HeadColumn
                                                style={{ flex: "1 1 0%" }}
                                            >
                                                Номер телефона
                                            </HeadColumn>
                                            <HeadColumn
                                                style={{ flex: "1 1 0%" }}
                                            >
                                                Email
                                            </HeadColumn>
                                        </FirstHeader>
                                        {/* Заголовок организации */}
                                        <SecondHeader>
                                            Организация:{" "}
                                            {employeesTree.organizationName}
                                        </SecondHeader>
                                        {/* Блоки департаментов */}
                                        {departments.map((dept) => (
                                            <div key={dept.departmentId}>
                                                {/* Хлебные крошки с полным путём */}
                                                <ThirdHeader>
                                                    <EmployeeDepartmentPath
                                                        departmentId={
                                                            dept.departmentId
                                                        }
                                                        dept={dept}
                                                    />
                                                </ThirdHeader>
                                                {/* Сотрудники департамента */}
                                                {dept.employees.map((emp) => (
                                                    <EmployeeTableRowDiv
                                                        key={emp.id}
                                                        onClick={() =>
                                                            handleRowClick(
                                                                emp.id,
                                                                emp.organizationId
                                                            )
                                                        }
                                                    >
                                                        <img
                                                            src={
                                                                emp.photo
                                                                    ? `data:image/jpeg;base64,${emp.photo}`
                                                                    : PhotoDefault
                                                            }
                                                            alt={
                                                                emp.fullNameRus
                                                            }
                                                            width="75px"
                                                            height="75px"
                                                            loading="lazy"
                                                        />
                                                        <CellWrapper
                                                            style={{
                                                                flex: "3 3 0%",
                                                            }}
                                                        >
                                                            {emp.fullNameRus}
                                                            <PositionWrapper
                                                                style={{
                                                                    flex: "1 1 0%",
                                                                }}
                                                            >
                                                                {
                                                                    emp.positionTitle
                                                                }
                                                            </PositionWrapper>
                                                        </CellWrapper>
                                                        <CellWrapper
                                                            style={{
                                                                flex: "1 1 0%",
                                                            }}
                                                        >
                                                            {emp.telephoneNumberCorp ||
                                                                "Не указан"}
                                                        </CellWrapper>
                                                        <CellWrapper>
                                                            {emp.email ? (
                                                                <>
                                                                    <CustomEmailLink
                                                                        href={`mailto:${emp.email}`}
                                                                        onClick={(
                                                                            e
                                                                        ) =>
                                                                            e.stopPropagation()
                                                                        }
                                                                    >
                                                                        {emp.email ||
                                                                            "Не указан"}
                                                                    </CustomEmailLink>
                                                                    <CustomCopyButton
                                                                        size={
                                                                            13
                                                                        }
                                                                        onClick={(
                                                                            e
                                                                        ) => {
                                                                            e.stopPropagation();
                                                                            handleCopyClick(
                                                                                emp.email!
                                                                            );
                                                                        }}
                                                                    />
                                                                </>
                                                            ) : (
                                                                "Не указан"
                                                            )}
                                                        </CellWrapper>
                                                    </EmployeeTableRowDiv>
                                                ))}
                                            </div>
                                        ))}
                                    </>
                                )}
                                {departments.length === 0 && (
                                    <div style={{ textAlignLast: "center" }}>
                                        {/* <img src={NotFound} alt="Не найдено" /> */}
                                        <img
                                            src={NotFoundIcon}
                                            alt="Не найдено"
                                        />
                                        <div>
                                            <span>
                                                По заданным критериям сотрудники
                                                не найдены. <br />
                                                Проверьте правильность введенных
                                                данных или выбранный фильтр
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* === Пункт 2: режим поиска === */
                            <div>
                                <FirstHeader>
                                    <EmptyHeadColumn> </EmptyHeadColumn>
                                    <HeadColumn
                                        style={{
                                            flex: "3 3 0%",
                                        }}
                                    >
                                        ФИО
                                    </HeadColumn>
                                    <HeadColumn
                                        style={{
                                            flex: "1 1 0%",
                                        }}
                                    >
                                        Номер телефона
                                    </HeadColumn>
                                    <HeadColumn
                                        style={{
                                            flex: "1 1 0%",
                                        }}
                                    >
                                        Email
                                    </HeadColumn>
                                </FirstHeader>
                                {employeesList.length > 0 &&
                                    employeesList.map((org: EmployeesList) => (
                                        <div key={org.organizationId}>
                                            <SecondHeader>
                                                Организация:{" "}
                                                {org.organizationName}
                                            </SecondHeader>
                                            {org.departments.map((dept) => (
                                                <div key={dept.departmentId}>
                                                    <ThirdHeader>
                                                        <EmployeeDepartmentPath
                                                            departmentId={
                                                                dept.departmentId
                                                            }
                                                            dept={dept}
                                                        />
                                                    </ThirdHeader>
                                                    {dept.employees.map(
                                                        (emp) => (
                                                            <EmployeeTableRowDiv
                                                                key={emp.id}
                                                                onClick={() =>
                                                                    handleRowClick(
                                                                        emp.id,
                                                                        emp.organizationId
                                                                    )
                                                                }
                                                            >
                                                                <img
                                                                    src={
                                                                        emp.photo
                                                                            ? `data:image/jpeg;base64,${emp.photo}`
                                                                            : PhotoDefault
                                                                    }
                                                                    alt={
                                                                        emp.fullNameRus
                                                                    }
                                                                    width="75px"
                                                                    height="75px"
                                                                    loading="lazy"
                                                                />
                                                                <CellWrapper
                                                                    style={{
                                                                        flex: "3 3 0%",
                                                                    }}
                                                                >
                                                                    <Highlighter
                                                                        searchWords={[
                                                                            searchValue ||
                                                                                "",
                                                                        ]}
                                                                        autoEscape={
                                                                            true
                                                                        }
                                                                        textToHighlight={`${emp.fullNameRus}`}
                                                                        highlightStyle={{
                                                                            backgroundColor:
                                                                                HIGHLIGHTER_COLOR,
                                                                        }}
                                                                    />

                                                                    <PositionWrapper>
                                                                        {
                                                                            emp.positionTitle
                                                                        }
                                                                    </PositionWrapper>
                                                                </CellWrapper>
                                                                <CellWrapper
                                                                    style={{
                                                                        flex: "1 1 0%",
                                                                    }}
                                                                >
                                                                    <Highlighter
                                                                        searchWords={[
                                                                            searchValue ||
                                                                                "",
                                                                        ]}
                                                                        autoEscape={
                                                                            true
                                                                        }
                                                                        textToHighlight={`${
                                                                            emp.telephoneNumberCorp ||
                                                                            "Не указан"
                                                                        }`}
                                                                        highlightStyle={{
                                                                            backgroundColor:
                                                                                HIGHLIGHTER_COLOR,
                                                                        }}
                                                                    />
                                                                </CellWrapper>
                                                                <CellWrapper
                                                                    style={{
                                                                        flex: "1 1 0%",
                                                                    }}
                                                                >
                                                                    {emp.email ? (
                                                                        <>
                                                                            <CustomEmailLink
                                                                                href={`mailto:${emp.email}`}
                                                                                onClick={(
                                                                                    e
                                                                                ) =>
                                                                                    e.stopPropagation()
                                                                                }
                                                                            >
                                                                                {emp.email ||
                                                                                    "Не указан"}
                                                                            </CustomEmailLink>
                                                                            <CustomCopyButton
                                                                                size={
                                                                                    13
                                                                                }
                                                                                onClick={(
                                                                                    e
                                                                                ) => {
                                                                                    e.stopPropagation();
                                                                                    handleCopyClick(
                                                                                        emp.email!
                                                                                    );
                                                                                }}
                                                                            />
                                                                        </>
                                                                    ) : (
                                                                        "Не указан"
                                                                    )}
                                                                </CellWrapper>
                                                            </EmployeeTableRowDiv>
                                                        )
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                            </div>
                        )}
                    </EmployeeListWrapperTable>
                )}
            </EmployeeListWrapperMain>
        </div>
    );
};
