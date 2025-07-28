// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { useSearchParams, useLocation } from "react-router-dom";
// import { useOrgStore } from "../../store/organizationStore";
// import { EmployeeSkeleton } from "./EmployeeSkeleton";
// import { toast } from "react-toastify";
// import { EmployeeDepartmentPath } from "./EmployeeDepartmentPath";
// import { CATEGORIES, EmployeesListTree } from "../../types";
// import NotFoundIcon from "../../assets/notFoundIcon.png";
// import { SearchWrapper } from "../StyledComponents";
// import {
//     FirstHeader,
//     SecondHeader,
//     ThirdHeader,
//     EmployeeListWrapperMain,
//     EmployeeListWrapperTable,
//     EmployeeListWrapper,
//     HeadColumn,
//     EmptyHeadColumn,
// } from "./StyledComponents";
// import { SearchBar } from "../SearchBar/SearchBar";
// import { ClipboardCopy } from "lucide-react";
// import EmployeeTableItem from "./EmployeeTableItem";
// import { useEmployeeStore } from "../../store/employeeStore";
// import { GroupedVirtuoso } from "react-virtuoso";

// function flattenDepartments(tree: EmployeesListTree | undefined) {
//     if (!tree)
//         return {
//             groupCounts: [],
//             employees: [],
//             groupLabels: [],
//             departmentIds: [],
//         };
//     const groupCounts: number[] = [];
//     const employees: any[] = [];
//     const groupLabels: string[] = [];
//     const departmentIds: string[] = [];
//     function walk(node: EmployeesListTree) {
//         if (node.employees && node.employees.length > 0) {
//             groupCounts.push(node.employees.length);
//             groupLabels.push(node.departmentName);
//             departmentIds.push(node.departmentId);
//             employees.push(
//                 ...node.employees.map((emp) => ({
//                     ...emp,
//                     departmentId: node.departmentId,
//                     departmentName: node.departmentName,
//                     organizationId: node.organizationId,
//                 }))
//             );
//         }
//         if (node.children && node.children.length > 0) {
//             node.children.forEach(walk);
//         }
//     }
//     walk(tree);
//     return { groupCounts, employees, groupLabels, departmentIds };
// }

// const emptyEmployeesTree: EmployeesListTree = {
//     organizationId: "",
//     organizationName: "",
//     departmentId: "",
//     departmentName: "",
//     employees: [],
//     children: [],
// };

// export const EmployeeList: React.FC = () => {
//     const [searchParams] = useSearchParams();
//     const employees = useOrgStore((state) => state.employees);
//     const isEmpLoading = useOrgStore((state) => state.isEmpLoading);
//     const employeesList = useOrgStore((state) => state.employeesList);
//     const fetchEmployeesWithParams = useOrgStore(
//         (state) => state.fetchEmployeesWithParams
//     );
//     const isEmployeeInfoModalOpen = useOrgStore(
//         (state) => state.isEmployeeInfoModalOpen
//     );
//     const setIsEmployeeInfoModalOpen = useOrgStore(
//         (state) => state.setIsEmployeeInfoModalOpen
//     );
//     const fetchCurrentEmployeeInfo = useOrgStore(
//         (state) => state.fetchCurrentEmployeeInfo
//     );
//     const selectOrg = useOrgStore((state) => state.selectOrg);
//     const loadEmployeeData = useEmployeeStore(
//         (state) => state.loadEmployeeData
//     );
//     const employeeData = useEmployeeStore((state) => state.employeeData);

//     const searchValue = searchParams.get("value");
//     const searchCategory = searchParams.get("type") as CATEGORIES | null;
//     const organizationId = searchParams.get("organizationId");
//     const departmentId = searchParams.get("departmentId");
//     const scrollContainerRef = useRef<Window | HTMLElement | null>(null);
//     const handleCopyClick = (text: string) => {
//         navigator.clipboard.writeText(text);
//         toast.info("Скопировано в буфер обмена", { position: "top-right" });
//     };

//     const handleRowClick = (empId: string, orgId: string) => {
//         setIsEmployeeInfoModalOpen(!isEmployeeInfoModalOpen);
//         fetchCurrentEmployeeInfo(empId, orgId);
//         loadEmployeeData(empId, orgId, "512");
//     };

//     const employeesTree = useMemo(
//         () => employees ?? emptyEmployeesTree,
//         [employees]
//     );

//     // Обычный режим (по орг/департаменту, дерево)
//     const {
//         groupCounts,
//         employees: flatEmployees,
//         groupLabels,
//         departmentIds,
//     } = useMemo(() => flattenDepartments(employeesTree), [employeesTree]);

//     // Режим поиска (поиск по всему employeesList)
//     const {
//         groupCounts: searchGroupCounts,
//         groupLabels: searchGroupLabels,
//         employeesFlat: searchEmployeesFlat,
//     } = useMemo(() => {
//         const groupCounts: number[] = [];
//         const groupLabels: {
//             orgId: string;
//             orgName: string;
//             departmentId: string;
//             departmentName: string;
//         }[] = [];
//         const employeesFlat: any[] = [];
//         employeesList.forEach((org) => {
//             org.departments.forEach((dept) => {
//                 groupCounts.push(dept.employees.length);
//                 groupLabels.push({
//                     orgId: org.organizationId,
//                     orgName: org.organizationName,
//                     departmentId: dept.departmentId,
//                     departmentName: dept.departmentName,
//                 });
//                 dept.employees.forEach((emp) => {
//                     employeesFlat.push({
//                         ...emp,
//                         orgId: org.organizationId,
//                         orgName: org.organizationName,
//                         departmentId: dept.departmentId,
//                         departmentName: dept.departmentName,
//                     });
//                 });
//             });
//         });
//         return { groupCounts, groupLabels, employeesFlat };
//     }, [employeesList]);

//     const location = useLocation();
//     const isDefaultRoute =
//         location.pathname === "/" && ![...searchParams].length;

//     function getAllEmails(data: EmployeesListTree): (string | null)[] {
//         const emails: (string | null)[] = [
//             ...data.employees.map((emp) => emp.email),
//         ];
//         for (const child of data.children) {
//             emails.push(...getAllEmails(child));
//         }
//         return emails;
//     }

//     const handleClickCopyEmails = () => {
//         let emails = "";
//         if (employeesList.length > 0) {
//             employeesList.forEach((org) => {
//                 org.departments.forEach((dept) => {
//                     dept.employees.forEach((emp) => {
//                         if (emp.email) emails += `${emp.email}`;
//                     });
//                 });
//             });
//         } else if (employees) {
//             emails = getAllEmails(employees).join(" ");
//         }

//         navigator.clipboard.writeText(emails);
//         toast.info("Скопировано в буфер обмена", { position: "top-right" });
//     };
//     const [showScrollButton, setShowScrollButton] = useState(false);
//     const handleScroll = (e: Event) => {
//         const target = e.target as HTMLElement;

//         const scrollTop = "scrollTop" in target ? target.scrollTop : 0;
//         setShowScrollButton(scrollTop > 300); // показываем, если прокрутили больше 300px
//     };

//     const scrollToTop = () => {
//         if (scrollContainerRef.current) {
//             scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
//         }
//     };
//     useEffect(() => {
//         if (isDefaultRoute) {
//             // organizationId=7842155505&departmentId=9c685cfe-e9a0-11e8-90f2-0050569026ba&treeId=3
//             searchParams.set("organizationId", "7842155505");
//             searchParams.set(
//                 "departmentId",
//                 "9c685cfe-e9a0-11e8-90f2-0050569026ba"
//             );
//             searchParams.set("treeId", "3");

//             selectOrg(
//                 "7842155505",
//                 "9c685cfe-e9a0-11e8-90f2-0050569026ba",
//                 "false"
//             );
//         } else if (
//             !searchValue &&
//             !searchCategory &&
//             !organizationId &&
//             !departmentId
//         ) {
//             searchParams.set("organizationId", "7842155505");
//             searchParams.set(
//                 "departmentId",
//                 "9c685cfe-e9a0-11e8-90f2-0050569026ba"
//             );
//             searchParams.set("treeId", "3");
//             selectOrg(
//                 "7842155505",
//                 "9c685cfe-e9a0-11e8-90f2-0050569026ba",
//                 "false"
//             );
//         } else if (searchValue && searchCategory) {
//             fetchEmployeesWithParams(searchValue, searchCategory);
//         } else if (organizationId) {
//             selectOrg(organizationId, departmentId ?? null);
//         }
//     }, []);

//     // ref для scrollToTopButton
//     const tableRef = useRef<HTMLDivElement>(null);

//     // -- UI
//     return (
//         <EmployeeListWrapper>
//             <div>
//                 <SearchWrapper>
//                     <SearchBar />
//                 </SearchWrapper>
//                 <span
//                     style={{
//                         justifySelf: "end",
//                         cursor: "pointer",
//                         display: "flex",
//                         margin: "5px 10px 0 0",
//                     }}
//                     title="Скопировать Email всех найденных сотрудников"
//                     onClick={handleClickCopyEmails}
//                 >
//                     <ClipboardCopy size={20} stroke="grey" />
//                 </span>
//             </div>
//             <EmployeeListWrapperMain>
//                 {isEmpLoading ? (
//                     <EmployeeSkeleton />
//                 ) : employeesList.length > 0 ? (
//                     <EmployeeListWrapperTable ref={tableRef}>
//                         <FirstHeader>
//                             <EmptyHeadColumn></EmptyHeadColumn>
//                             <HeadColumn style={{ width: "30%" }}>
//                                 ФИО
//                             </HeadColumn>
//                             <HeadColumn style={{ width: "20%" }}></HeadColumn>
//                             <HeadColumn style={{ width: "25%" }}>
//                                 Номер телефона
//                             </HeadColumn>
//                             <HeadColumn
//                                 style={{ width: "25%", textAlign: "center" }}
//                             >
//                                 Электронная почта
//                             </HeadColumn>
//                         </FirstHeader>
//                         <GroupedVirtuoso
//                             style={{
//                                 height: "calc(100% - 56px)",
//                                 width: "100%",
//                                 overflowX: "hidden",
//                             }}
//                             groupCounts={searchGroupCounts}
//                             groupContent={(groupIndex) => {
//                                 const curr = searchGroupLabels[groupIndex];
//                                 return (
//                                     <ThirdHeader>
//                                         <EmployeeDepartmentPath
//                                             departmentId={curr.departmentId}
//                                             dept={{
//                                                 departmentId: curr.departmentId,
//                                                 departmentName:
//                                                     curr.departmentName,
//                                                 employees: [],
//                                             }}
//                                             showOrganization={true}
//                                             organizationId={curr.orgId}
//                                             organizationName={curr.orgName}
//                                         />
//                                     </ThirdHeader>
//                                 );
//                             }}
//                             scrollerRef={(ref) => {
//                                 if (ref) {
//                                     scrollContainerRef.current = ref;
//                                     ref.addEventListener(
//                                         "scroll",
//                                         handleScroll
//                                     );
//                                 }
//                             }}
//                             itemContent={(index) => {
//                                 const emp = searchEmployeesFlat[index];
//                                 return (
//                                     <EmployeeTableItem
//                                         key={emp.id}
//                                         emp={emp}
//                                         handleRowClick={handleRowClick}
//                                         organizationId={emp.orgId}
//                                         employeeData={employeeData}
//                                         handleCopyClick={handleCopyClick}
//                                     />
//                                 );
//                             }}
//                         />
//                     </EmployeeListWrapperTable>
//                 ) : flatEmployees.length === 0 ? (
//                     <div style={{ textAlign: "center" }}>
//                         <img
//                             src={NotFoundIcon}
//                             alt="Не найдено"
//                             width={150}
//                             style={{ margin: "15% 0 40px" }}
//                         />
//                         <div>
//                             <span>
//                                 По заданным критериям сотрудники не найдены.{" "}
//                                 <br />
//                                 Проверьте правильность введенных данных или
//                                 выбранный фильтр
//                             </span>
//                         </div>
//                     </div>
//                 ) : (
//                     <EmployeeListWrapperTable ref={tableRef}>
//                         <FirstHeader>
//                             <EmptyHeadColumn></EmptyHeadColumn>
//                             <HeadColumn style={{ width: "30%" }}>
//                                 ФИО
//                             </HeadColumn>
//                             <HeadColumn style={{ width: "20%" }}></HeadColumn>
//                             <HeadColumn style={{ width: "25%" }}>
//                                 Номер телефона
//                             </HeadColumn>
//                             <HeadColumn
//                                 style={{ width: "25%", textAlign: "center" }}
//                             >
//                                 Электронная почта
//                             </HeadColumn>
//                         </FirstHeader>
//                         <div style={{ position: "sticky", top: 35, zIndex: 3 }}>
//                             <SecondHeader>
//                                 {employeesTree.organizationName.toUpperCase()}
//                             </SecondHeader>
//                         </div>
//                         <GroupedVirtuoso
//                             style={{
//                                 height: "calc(100% - 80px)",
//                                 width: "100%",
//                                 overflowX: "hidden",
//                             }}
//                             scrollerRef={(ref) => {
//                                 if (ref) {
//                                     scrollContainerRef.current = ref;
//                                     ref.addEventListener(
//                                         "scroll",
//                                         handleScroll
//                                     );
//                                 }
//                             }}
//                             groupCounts={groupCounts}
//                             groupContent={(index) => (
//                                 <ThirdHeader key={departmentIds[index]}>
//                                     <EmployeeDepartmentPath
//                                         departmentId={departmentIds[index]}
//                                         dept={{
//                                             departmentId: departmentIds[index],
//                                             departmentName: groupLabels[index],
//                                             employees: [],
//                                         }}
//                                     />
//                                 </ThirdHeader>
//                             )}
//                             itemContent={(index) => {
//                                 const emp = flatEmployees[index];
//                                 return (
//                                     <EmployeeTableItem
//                                         key={emp.id}
//                                         emp={emp}
//                                         handleRowClick={handleRowClick}
//                                         organizationId={emp.organizationId}
//                                         employeeData={employeeData}
//                                         handleCopyClick={handleCopyClick}
//                                     />
//                                 );
//                             }}
//                         />
//                     </EmployeeListWrapperTable>
//                 )}
//             </EmployeeListWrapperMain>
//             {showScrollButton && (
//                 <button
//                     onClick={scrollToTop}
//                     style={{
//                         position: "absolute",
//                         bottom: "20px",
//                         right: "20px",
//                         zIndex: 10,
//                         padding: "10px",
//                         backgroundColor: "#1d75bb",
//                         color: "white",
//                         border: "none",
//                         borderRadius: "50%",
//                         width: "40px",
//                         height: "40px",
//                         cursor: "pointer",
//                         boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
//                         fontSize: "18px",
//                     }}
//                 >
//                     ↑
//                 </button>
//             )}
//         </EmployeeListWrapper>
//     );
// };

// export default EmployeeList;

import React, { useMemo, useRef, useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { useOrgStore } from "../../store/organizationStore";
import { EmployeeSkeleton } from "./EmployeeSkeleton";
import { toast } from "react-toastify";
import { EmployeeDepartmentPath } from "./EmployeeDepartmentPath";
import { CATEGORIES, EmployeesListTree } from "../../types";
import NotFoundIcon from "../../assets/notFoundIcon.png";
import { SearchWrapper } from "../StyledComponents";
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

    const isEmployeeInfoModalOpen = useOrgStore(
        (state) => state.isEmployeeInfoModalOpen
    );
    const setIsEmployeeInfoModalOpen = useOrgStore(
        (state) => state.setIsEmployeeInfoModalOpen
    );
    const fetchCurrentEmployeeInfo = useOrgStore(
        (state) => state.fetchCurrentEmployeeInfo
    );
    const loadEmployeeData = useEmployeeStore(
        (state) => state.loadEmployeeData
    );
    const employeeData = useEmployeeStore((state) => state.employeeData);

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

    // Обычный режим (по орг/департаменту, дерево)
    const {
        groupCounts,
        employees: flatEmployees,
        groupLabels,
        departmentIds,
    } = useMemo(() => flattenDepartments(employeesTree), [employeesTree]);

    // Режим поиска (поиск по всему employeesList)
    const {
        groupCounts: searchGroupCounts,
        groupLabels: searchGroupLabels,
        employeesFlat: searchEmployeesFlat,
    } = useMemo(() => {
        const groupCounts: number[] = [];
        const groupLabels: {
            orgId: string;
            orgName: string;
            departmentId: string;
            departmentName: string;
        }[] = [];
        const employeesFlat: any[] = [];
        employeesList.forEach((org) => {
            org.departments.forEach((dept) => {
                groupCounts.push(dept.employees.length);
                groupLabels.push({
                    orgId: org.organizationId,
                    orgName: org.organizationName,
                    departmentId: dept.departmentId,
                    departmentName: dept.departmentName,
                });
                dept.employees.forEach((emp) => {
                    employeesFlat.push({
                        ...emp,
                        orgId: org.organizationId,
                        orgName: org.organizationName,
                        departmentId: dept.departmentId,
                        departmentName: dept.departmentName,
                    });
                });
            });
        });
        return { groupCounts, groupLabels, employeesFlat };
    }, [employeesList]);

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
                        if (emp.email) emails += `${emp.email}`;
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
        setShowScrollButton(scrollTop > 300); // показываем, если прокрутили больше 300px
    };

    const scrollToTop = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    // ref для scrollToTopButton
    const tableRef = useRef<HTMLDivElement>(null);

    // -- UI
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
                    <EmployeeListWrapperTable ref={tableRef}>
                        <FirstHeader>
                            <EmptyHeadColumn></EmptyHeadColumn>
                            <HeadColumn style={{ width: "30%" }}>
                                ФИО
                            </HeadColumn>
                            <HeadColumn style={{ width: "20%" }}></HeadColumn>
                            <HeadColumn style={{ width: "25%" }}>
                                Номер телефона
                            </HeadColumn>
                            <HeadColumn
                                style={{ width: "25%", textAlign: "center" }}
                            >
                                Электронная почта
                            </HeadColumn>
                        </FirstHeader>
                        <GroupedVirtuoso
                            style={{
                                height: "calc(100% - 56px)",
                                width: "100%",
                                overflowX: "hidden",
                            }}
                            groupCounts={searchGroupCounts}
                            groupContent={(groupIndex) => {
                                const curr = searchGroupLabels[groupIndex];
                                return (
                                    <ThirdHeader>
                                        <EmployeeDepartmentPath
                                            departmentId={curr.departmentId}
                                            dept={{
                                                departmentId: curr.departmentId,
                                                departmentName:
                                                    curr.departmentName,
                                                employees: [],
                                            }}
                                            showOrganization={true}
                                            organizationId={curr.orgId}
                                            organizationName={curr.orgName}
                                        />
                                    </ThirdHeader>
                                );
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
                            itemContent={(index) => {
                                const emp = searchEmployeesFlat[index];
                                return (
                                    <EmployeeTableItem
                                        key={emp.id}
                                        emp={emp}
                                        handleRowClick={handleRowClick}
                                        organizationId={emp.orgId}
                                        employeeData={employeeData}
                                        handleCopyClick={handleCopyClick}
                                    />
                                );
                            }}
                        />
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
                    <EmployeeListWrapperTable ref={tableRef}>
                        <FirstHeader>
                            <EmptyHeadColumn></EmptyHeadColumn>
                            <HeadColumn style={{ width: "30%" }}>
                                ФИО
                            </HeadColumn>
                            <HeadColumn style={{ width: "20%" }}></HeadColumn>
                            <HeadColumn style={{ width: "25%" }}>
                                Номер телефона
                            </HeadColumn>
                            <HeadColumn
                                style={{ width: "25%", textAlign: "center" }}
                            >
                                Электронная почта
                            </HeadColumn>
                        </FirstHeader>
                        <div style={{ position: "sticky", top: 35, zIndex: 3 }}>
                            <SecondHeader>
                                {employeesTree.organizationName.toUpperCase()}
                            </SecondHeader>
                        </div>
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
