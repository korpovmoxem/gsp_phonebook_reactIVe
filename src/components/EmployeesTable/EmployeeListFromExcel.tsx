import { useEffect, useMemo } from "react";
import { useOrgStore } from "../../store/organizationStore";
import { EmployeeSkeleton } from "./EmployeeSkeleton";
import { toast } from "react-toastify";
import { Employee, EmployeesListTree } from "../../types";
// import NotFound from "../../assets/notFound.gif";
import NotFoundIcon from "../../assets/notFoundIcon.png";
import {
    CustomCopyButton,
    CustomEmailLink,
    SearchWrapper,
} from "../StyledComponents";
import {
    CellWrapper,
    EmployeeListWrapperMain,
    EmployeeListWrapperTable,
    FirstHeader,
    HeadColumn,
    PositionWrapper,
    SecondHeader,
    EmployeeListWrapper,
    EmployeeTableRowDivForExcel,
} from "./StyledComponents";
import Highlighter from "react-highlight-words";
import { SearchBarForExcel } from "../SearchBar/SearchBarForExcel";

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

export const EmployeeListFromExcel: React.FC = () => {
    const employees = useOrgStore((state) => state.employees);
    const isEmpLoading = useOrgStore((state) => state.isEmpLoading);
    const employeesListFromExcel = useOrgStore(
        (state) => state.employeesListFromExcel
    );
    const selectOrg = useOrgStore((state) => state.selectOrg);

    const handleCopyClick = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.info("Скопировано в буфер обмена", { position: "top-right" });
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
        selectOrg(
            "7842155505",
            "9c685cfe-e9a0-11e8-90f2-0050569026ba",
            "false"
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <EmployeeListWrapper>
            <div>
                <SearchWrapper>
                    <SearchBarForExcel />
                </SearchWrapper>
            </div>
            <EmployeeListWrapperMain>
                {isEmpLoading ? (
                    <EmployeeSkeleton />
                ) : (
                    <EmployeeListWrapperTable>
                        <div>
                            {departments.length > 0 ? (
                                <>
                                    <FirstHeader>
                                        <HeadColumn style={{ flex: "3 3 0%" }}>
                                            ФИО
                                        </HeadColumn>
                                        <HeadColumn style={{ flex: "1 1 0%" }}>
                                            Номер телефона
                                        </HeadColumn>
                                        <HeadColumn style={{ flex: "1 1 0%" }}>
                                            Электронная почта
                                        </HeadColumn>
                                    </FirstHeader>
                                    {/* Заголовок организации */}
                                    <SecondHeader>
                                        {employeesTree.organizationName}
                                    </SecondHeader>
                                    {/* Блоки департаментов */}
                                    {departments.map((dept) => (
                                        <div key={dept.departmentId}>
                                            {/* Сотрудники департамента */}
                                            {dept.employees.map((emp) => (
                                                <EmployeeTableRowDivForExcel
                                                    key={emp.id}
                                                >
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
                                                            {emp.positionTitle}
                                                        </PositionWrapper>
                                                    </CellWrapper>
                                                    <CellWrapper
                                                        style={{
                                                            flex: "1 1 0%",
                                                        }}
                                                    >
                                                        {emp.telephoneNumberCorp &&
                                                        emp.telephoneNumberCorp !==
                                                            "" ? (
                                                            <CustomEmailLink
                                                                href={`tel:${emp.telephoneNumberCorp}`}
                                                                onClick={(e) =>
                                                                    e.stopPropagation()
                                                                }
                                                            >
                                                                {
                                                                    emp.telephoneNumberCorp
                                                                }
                                                            </CustomEmailLink>
                                                        ) : (
                                                            "Не указан"
                                                        )}
                                                    </CellWrapper>
                                                    <CellWrapper
                                                        style={{
                                                            display: "flex",
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
                                                                    size={13}
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
                                                </EmployeeTableRowDivForExcel>
                                            ))}
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div style={{ textAlignLast: "center" }}>
                                    <img
                                        src={NotFoundIcon}
                                        alt="Не найдено"
                                        width={150}
                                        style={{ margin: "15% 0 40px" }}
                                    />
                                    <div>
                                        <span>
                                            По заданным критериям сотрудники не
                                            найдены. <br />
                                            Проверьте правильность введенных
                                            данных или выбранный фильтр
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </EmployeeListWrapperTable>
                )}
            </EmployeeListWrapperMain>
        </EmployeeListWrapper>
    );
};
