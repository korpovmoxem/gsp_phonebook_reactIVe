import React, { useMemo, useRef, useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { useOrgStore } from "../../store/organizationStore";
import { EmployeeSkeleton } from "./EmployeeSkeleton";
import { toast } from "react-toastify";
import { EmployeeDepartmentPath } from "./EmployeeDepartmentPath";
import {
    CATEGORIES,
    Employee,
    EmployeesListTree,
    EmployeesList,
} from "../../types";
import NotFoundIcon from "../../assets/notFoundIcon.png";
import {
    CustomCopyButton,
    CustomEmailLink,
    SearchWrapper,
} from "../StyledComponents";
import {
    FirstHeader,
    SecondHeader,
    ThirdHeader,
    EmployeeListWrapperMain,
    EmployeeListWrapperTable,
    EmployeeListWrapper,
    HeadColumn,
    EmptyHeadColumn,
} from "./StyledComponents";
import { SearchBar } from "../SearchBar/SearchBar";
import { ClipboardCopy } from "lucide-react";
import EmployeeTableItem from "./EmployeeTableItem";
import { useEmployeeStore } from "../../store/employeeStore";
import { GroupedVirtuoso } from "react-virtuoso";

// Функция для преобразования EmployeesListTree в массив департаментов и сотрудников
function flattenDepartments(tree: EmployeesListTree | undefined) {
    if (!tree)
        return {
            groupCounts: [],
            employees: [],
            groupLabels: [],
            departmentIds: [],
        };
    const groupCounts: number[] = [];
    const employees: any[] = [];
    const groupLabels: string[] = [];
    const departmentIds: string[] = [];
    function walk(node: EmployeesListTree) {
        if (node.employees && node.employees.length > 0) {
            groupCounts.push(node.employees.length);
            groupLabels.push(node.departmentName);
            departmentIds.push(node.departmentId);
            employees.push(
                ...node.employees.map((emp) => ({
                    ...emp,
                    departmentId: node.departmentId,
                    departmentName: node.departmentName,
                    organizationId: node.organizationId,
                }))
            );
        }
        if (node.children && node.children.length > 0) {
            node.children.forEach(walk);
        }
    }
    walk(tree);
    return { groupCounts, employees, groupLabels, departmentIds };
}

const emptyEmployeesTree: EmployeesListTree = {
    organizationId: "",
    organizationName: "",
    departmentId: "",
    departmentName: "",
    employees: [],
    children: [],
};

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
    const loadEmployeeData = useEmployeeStore(
        (state) => state.loadEmployeeData
    );
    const employeeData = useEmployeeStore((state) => state.employeeData);

    const searchValue = searchParams.get("value");
    const searchCategory = searchParams.get("type") as CATEGORIES | null;
    const organizationId = searchParams.get("organizationId");
    const departmentId = searchParams.get("departmentId");
    const scrollContainerRef = useRef<Window | HTMLElement | null>(null);

    const handleCopyClick = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.info("Скопировано в буфер обмена", { position: "top-right" });
    };

    const handleRowClick = (empId: string, orgId: string) => {
        setIsEmployeeInfoModalOpen(!isEmployeeInfoModalOpen);
        fetchCurrentEmployeeInfo(empId, orgId);
        loadEmployeeData(empId, orgId, "512");
    };

    const employeesTree = useMemo(
        () => employees ?? emptyEmployeesTree,
        [employees]
    );

    // flatten department data for GroupedVirtuoso
    const {
        groupCounts,
        employees: flatEmployees,
        groupLabels,
        departmentIds,
    } = useMemo(() => flattenDepartments(employeesTree), [employeesTree]);

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
        if (employeesList.length > 0) {
            employeesList.forEach((org) => {
                org.departments.forEach((dept) => {
                    dept.employees.forEach((emp) => {
                        if (emp.email) emails += `${emp.email} `;
                    });
                });
            });
        } else if (employees) {
            emails = getAllEmails(employees).join(" ");
        }

        navigator.clipboard.writeText(emails);
        toast.info("Скопировано в буфер обмена", { position: "top-right" });
    };

    const [showScrollButton, setShowScrollButton] = useState(false);
    const handleScroll = (e: Event) => {
        const target = e.target as HTMLElement;

        const scrollTop = "scrollTop" in target ? target.scrollTop : 0;
        console.log("Scroll position:", scrollTop);
        setShowScrollButton(scrollTop > 300); // показываем, если прокрутили больше 300px
    };

    const scrollToTop = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    React.useEffect(() => {
        if (isDefaultRoute) {
            selectOrg(
                "7842155505",
                "9c685cfe-e9a0-11e8-90f2-0050569026ba",
                "false"
            );
        } else if (
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
            fetchEmployeesWithParams(searchValue, searchCategory);
        } else if (organizationId) {
            selectOrg(organizationId, departmentId ?? null);
        }
    }, []);

    return (
        <EmployeeListWrapper>
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
                ) : employeesList.length > 0 ? (
                    // === Режим поиска ===
                    <EmployeeListWrapperTable>
                        <FirstHeader>
                            <EmptyHeadColumn></EmptyHeadColumn>
                            <HeadColumn style={{ width: "30%" }}>
                                ФИО
                            </HeadColumn>
                            <HeadColumn style={{ width: "20%" }}></HeadColumn>
                            <HeadColumn style={{ width: "25%" }}>
                                Номер телефона
                            </HeadColumn>
                            <HeadColumn style={{ width: "25%" }}>
                                Электронная почта
                            </HeadColumn>
                        </FirstHeader>
                        {employeesList.map((org: EmployeesList) => (
                            <div key={org.organizationId}>
                                <SecondHeader>
                                    Организация: {org.organizationName}
                                </SecondHeader>
                                {org.departments.map((dept) => (
                                    <div key={dept.departmentId}>
                                        <ThirdHeader>
                                            <EmployeeDepartmentPath
                                                departmentId={dept.departmentId}
                                                dept={dept}
                                            />
                                        </ThirdHeader>
                                        {dept.employees.map((emp) => (
                                            <EmployeeTableItem
                                                key={emp.id}
                                                emp={emp}
                                                handleRowClick={handleRowClick}
                                                organizationId={
                                                    dept.organizationId
                                                }
                                                employeeData={employeeData}
                                                handleCopyClick={
                                                    handleCopyClick
                                                }
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </EmployeeListWrapperTable>
                ) : flatEmployees.length === 0 ? (
                    <div style={{ textAlign: "center" }}>
                        <img
                            src={NotFoundIcon}
                            alt="Не найдено"
                            width={150}
                            style={{ margin: "15% 0 40px" }}
                        />
                        <div>
                            <span>
                                По заданным критериям сотрудники не найдены.{" "}
                                <br />
                                Проверьте правильность введенных данных или
                                выбранный фильтр
                            </span>
                        </div>
                    </div>
                ) : (
                    // === Виртуализированный список сотрудников с группировкой по подразделениям ===
                    <EmployeeListWrapperTable>
                        <FirstHeader>
                            <EmptyHeadColumn></EmptyHeadColumn>
                            <HeadColumn style={{ width: "30%" }}>
                                ФИО
                            </HeadColumn>
                            <HeadColumn style={{ width: "20%" }}></HeadColumn>
                            <HeadColumn style={{ width: "25%" }}>
                                Номер телефона
                            </HeadColumn>
                            <HeadColumn style={{ width: "25%" }}>
                                Электронная почта
                            </HeadColumn>
                        </FirstHeader>
                        <SecondHeader>
                            Организация: {employeesTree.organizationName}
                        </SecondHeader>
                        <GroupedVirtuoso
                            style={{
                                height: "calc(100% - 80px)",
                                width: "100%",
                                overflowX: "hidden",
                            }}
                            scrollerRef={(ref) => {
                                if (ref) {
                                    scrollContainerRef.current = ref;
                                    ref.addEventListener(
                                        "scroll",
                                        handleScroll
                                    );
                                }
                            }}
                            groupCounts={groupCounts}
                            groupContent={(index) => (
                                <ThirdHeader key={departmentIds[index]}>
                                    <EmployeeDepartmentPath
                                        departmentId={departmentIds[index]}
                                        dept={{
                                            departmentId: departmentIds[index],
                                            departmentName: groupLabels[index],
                                            employees: [],
                                        }}
                                    />
                                </ThirdHeader>
                            )}
                            itemContent={(index) => {
                                const emp = flatEmployees[index];
                                return (
                                    <EmployeeTableItem
                                        key={emp.id}
                                        emp={emp}
                                        handleRowClick={handleRowClick}
                                        organizationId={emp.organizationId}
                                        employeeData={employeeData}
                                        handleCopyClick={handleCopyClick}
                                    />
                                );
                            }}
                        />
                    </EmployeeListWrapperTable>
                )}
            </EmployeeListWrapperMain>
            {showScrollButton && (
                <button
                    onClick={scrollToTop}
                    style={{
                        position: "absolute",
                        bottom: "20px",
                        right: "20px",
                        zIndex: 10,
                        padding: "10px",
                        backgroundColor: "#1d75bb",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        cursor: "pointer",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        fontSize: "18px",
                    }}
                >
                    ↑
                </button>
            )}
        </EmployeeListWrapper>
    );
};

export default EmployeeList;
