// import { useEffect, useMemo } from "react";
// import { useLocation, useSearchParams } from "react-router-dom";
// import { useOrgStore } from "../../store/organizationStore";
// import { EmployeeSkeleton } from "./EmployeeSkeleton";
// import PhotoDefault from "../../assets/photo.jpg";
// import { toast } from "react-toastify";
// import { EmployeeDepartmentPath } from "./EmployeeDepartmentPath";
// import {
//     CATEGORIES,
//     Employee,
//     EmployeesListTree,
//     EmployeesList,
// } from "../../types";
// // import NotFound from "../../assets/notFound.gif";
// import NotFoundIcon from "../../assets/notFoundIcon.png";
// import {
//     CustomCopyButton,
//     CustomEmailLink,
//     SearchWrapper,
// } from "../StyledComponents";
// import {
//     CellWrapper,
//     ThirdHeader,
//     EmployeeListWrapperMain,
//     EmployeeListWrapperTable,
//     EmployeeTableRowDiv,
//     EmptyHeadColumn,
//     FirstHeader,
//     HeadColumn,
//     PositionWrapper,
//     SecondHeader,
//     EmployeeListWrapper,
// } from "./StyledComponents";
// import Highlighter from "react-highlight-words";
// import { SearchBar } from "../SearchBar/SearchBar";
// import { ClipboardCopy } from "lucide-react";
// import { Icon } from "./Icon";
// import { PhotoObj } from "./PhotoObj";

// // Функция для рекурсивного сбора всех сотрудников из дерева
// const getAllEmployees = (tree: EmployeesListTree): Employee[] => {
//     let result = [...tree.employees];
//     for (const child of tree.children) {
//         result = result.concat(getAllEmployees(child));
//     }
//     return result;
// };

// // Пустой шаблон, чтобы TS не ругался
// const emptyEmployeesTree: EmployeesListTree = {
//     organizationId: "",
//     organizationName: "",
//     departmentId: "",
//     departmentName: "",
//     employees: [],
//     children: [],
// };

// const HIGHLIGHTER_COLOR = "#b2dff7";

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

//     const searchValue = searchParams.get("value");
//     const searchCategory = searchParams.get("type") as CATEGORIES | null;
//     const organizationId = searchParams.get("organizationId");
//     const departmentId = searchParams.get("departmentId");

//     const handleCopyClick = (text: string) => {
//         navigator.clipboard.writeText(text);
//         toast.info("Скопировано в буфер обмена", { position: "top-right" });
//     };

//     const handleRowClick = (empId: string, orgId: string) => {
//         setIsEmployeeInfoModalOpen(!isEmployeeInfoModalOpen);
//         fetchCurrentEmployeeInfo(empId, orgId);
//     };

//     // Берём либо реальное дерево, либо пустой шаблон
//     const employeesTree = useMemo(
//         () => employees ?? emptyEmployeesTree,
//         [employees]
//     );

//     // Плоский список всех сотрудников из дерева
//     const flatEmployees = useMemo(
//         () => getAllEmployees(employeesTree),
//         [employeesTree]
//     );

//     // Группировка плоского списка по департаментам
//     const departments = useMemo(() => {
//         const map: Record<
//             string,
//             {
//                 departmentId: string;
//                 departmentName: string;
//                 employees: Employee[];
//             }
//         > = {};
//         flatEmployees.forEach((emp) => {
//             if (!map[emp.departmentId]) {
//                 map[emp.departmentId] = {
//                     departmentId: emp.departmentId,
//                     departmentName: emp.departmentName,
//                     employees: [],
//                 };
//             }
//             map[emp.departmentId].employees.push(emp);
//         });
//         return Object.values(map);
//     }, [flatEmployees]);

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
//             employeesList.forEach((organization) => {
//                 organization.departments.forEach((department) => {
//                     department.employees.forEach((employee) => {
//                         if (employee.email) {
//                             emails += `${employee.email} `;
//                         }
//                     });
//                 });
//             });
//         } else {
//             if (employees) {
//                 emails = getAllEmails(employees).join(" ");
//             }
//         }
//         navigator.clipboard.writeText(emails);
//         toast.info("Скопировано в буфер обмена", {
//             position: "top-right",
//         });
//     };

//     useEffect(() => {
//         // При пустых параметрах — выбираем дефолтную орг. и департамент
//         if (isDefaultRoute) {
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
//             selectOrg(
//                 "7842155505",
//                 "9c685cfe-e9a0-11e8-90f2-0050569026ba",
//                 "false"
//             );
//         } else if (searchValue && searchCategory) {
//             // Режим поиска
//             fetchEmployeesWithParams(searchValue, searchCategory);
//         } else if (organizationId) {
//             // Клик по организации/департаменту через URL
//             selectOrg(organizationId, departmentId ?? null);
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     // useEffect(() => {
//     //     if (isDefaultRoute) {

//     //     }
//     //     // eslint-disable-next-line react-hooks/exhaustive-deps
//     // }, [isDefaultRoute]);

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
//                 ) : (
//                     <EmployeeListWrapperTable>
//                         {/* === Пункт 1: выбор по орг/департаменту + начальное отображение === */}
//                         {employeesList.length === 0 ? (
//                             <div>
//                                 {departments.length > 0 && (
//                                     <>
//                                         <FirstHeader>
//                                             <EmptyHeadColumn> </EmptyHeadColumn>
//                                             <HeadColumn
//                                                 style={{
//                                                     minWidth: "30%",
//                                                     maxWidth: "30%",
//                                                 }}
//                                             >
//                                                 ФИО
//                                             </HeadColumn>
//                                             <HeadColumn
//                                                 style={{
//                                                     minWidth: "10%",
//                                                     maxWidth: "10%",
//                                                 }}
//                                             ></HeadColumn>
//                                             <HeadColumn
//                                                 style={{
//                                                     minWidth: "25%",
//                                                     maxWidth: "25%",
//                                                 }}
//                                             >
//                                                 Номер телефона
//                                             </HeadColumn>
//                                             <HeadColumn
//                                                 style={{
//                                                     minWidth: "25%",
//                                                     maxWidth: "25%",
//                                                 }}
//                                             >
//                                                 Электронная почта
//                                             </HeadColumn>
//                                         </FirstHeader>
//                                         {/* Заголовок организации */}
//                                         <SecondHeader>
//                                             Организация:{" "}
//                                             {employeesTree.organizationName}
//                                         </SecondHeader>
//                                         {/* Блоки департаментов */}
//                                         {departments.map((dept) => (
//                                             <div key={dept.departmentId}>
//                                                 {/* Хлебные крошки с полным путём */}
//                                                 <ThirdHeader>
//                                                     <EmployeeDepartmentPath
//                                                         departmentId={
//                                                             dept.departmentId
//                                                         }
//                                                         dept={dept}
//                                                     />
//                                                 </ThirdHeader>
//                                                 {/* Сотрудники департамента */}
//                                                 {dept.employees.map((emp) => (
//                                                     <EmployeeTableRowDiv
//                                                         key={emp.id}
//                                                         onClick={() =>
//                                                             handleRowClick(
//                                                                 emp.id,
//                                                                 emp.organizationId
//                                                             )
//                                                         }
//                                                     >
//                                                         <div
//                                                             style={{
//                                                                 display:
//                                                                     "table-row",
//                                                             }}
//                                                         >
//                                                             <div
//                                                                 style={{
//                                                                     display:
//                                                                         "table-cell",
//                                                                 }}
//                                                             >
//                                                                 <PhotoObj
//                                                                     photo={
//                                                                         emp.photo
//                                                                     }
//                                                                     width="75px"
//                                                                 />
//                                                             </div>
//                                                             <CellWrapper
//                                                                 style={{
//                                                                     minWidth:
//                                                                         "30%",
//                                                                     maxWidth:
//                                                                         "30%",
//                                                                 }}
//                                                             >
//                                                                 {
//                                                                     emp.fullNameRus
//                                                                 }
//                                                                 <PositionWrapper>
//                                                                     {
//                                                                         emp.positionTitle
//                                                                     }
//                                                                 </PositionWrapper>
//                                                             </CellWrapper>
//                                                             <CellWrapper
//                                                                 style={{
//                                                                     flexDirection:
//                                                                         "column",
//                                                                 }}
//                                                             >
//                                                                 <div>
//                                                                     {/* {emp.statuses.map(
//                                                                         (
//                                                                             status
//                                                                         ) => (
//                                                                             <Icon
//                                                                                 icon={
//                                                                                     status
//                                                                                 }
//                                                                                 width="40px"
//                                                                                 type="status"
//                                                                             />
//                                                                         )
//                                                                     )}
//                                                                     {emp.rewards.map(
//                                                                         (
//                                                                             status
//                                                                         ) => (
//                                                                             <Icon
//                                                                                 icon={
//                                                                                     status
//                                                                                 }
//                                                                                 width="40px"
//                                                                                 type="achievement"
//                                                                             />
//                                                                         )
//                                                                     )} */}
//                                                                 </div>
//                                                             </CellWrapper>
//                                                             <CellWrapper
//                                                                 style={{
//                                                                     minWidth:
//                                                                         "25%",
//                                                                     maxWidth:
//                                                                         "25%",
//                                                                 }}
//                                                             >
//                                                                 {emp.telephoneNumberCorp &&
//                                                                 emp.telephoneNumberCorp !==
//                                                                     "" ? (
//                                                                     <CustomEmailLink
//                                                                         href={`tel:${emp.telephoneNumberCorp}`}
//                                                                         onClick={(
//                                                                             e
//                                                                         ) =>
//                                                                             e.stopPropagation()
//                                                                         }
//                                                                     >
//                                                                         {
//                                                                             emp.telephoneNumberCorp
//                                                                         }
//                                                                     </CustomEmailLink>
//                                                                 ) : (
//                                                                     "Не указан"
//                                                                 )}
//                                                             </CellWrapper>
//                                                             <CellWrapper
//                                                                 style={{
//                                                                     display:
//                                                                         "flex",
//                                                                 }}
//                                                             >
//                                                                 {emp.email ? (
//                                                                     <>
//                                                                         <CustomEmailLink
//                                                                             href={`mailto:${emp.email}`}
//                                                                             onClick={(
//                                                                                 e
//                                                                             ) =>
//                                                                                 e.stopPropagation()
//                                                                             }
//                                                                         >
//                                                                             {emp.email ||
//                                                                                 "Не указан"}
//                                                                         </CustomEmailLink>
//                                                                         <CustomCopyButton
//                                                                             size={
//                                                                                 13
//                                                                             }
//                                                                             onClick={(
//                                                                                 e
//                                                                             ) => {
//                                                                                 e.stopPropagation();
//                                                                                 handleCopyClick(
//                                                                                     emp.email!
//                                                                                 );
//                                                                             }}
//                                                                         />
//                                                                     </>
//                                                                 ) : (
//                                                                     "Не указан"
//                                                                 )}
//                                                             </CellWrapper>
//                                                         </div>
//                                                     </EmployeeTableRowDiv>
//                                                 ))}
//                                             </div>
//                                         ))}
//                                     </>
//                                 )}
// {departments.length === 0 && (
//     <div style={{ textAlignLast: "center" }}>
//         {/* <img src={NotFound} alt="Не найдено" /> */}
//         <img
//             src={NotFoundIcon}
//             alt="Не найдено"
//             width={150}
//             style={{ margin: "15% 0 40px" }}
//         />
//         <div>
//             <span>
//                 По заданным критериям сотрудники
//                 не найдены. <br />
//                 Проверьте правильность введенных
//                 данных или выбранный фильтр
//             </span>
//         </div>
//     </div>
// )}
//                             </div>
//                         ) : (
//                             /* === Пункт 2: режим поиска === */
//                             <div>
//                                 <FirstHeader>
//                                     <EmptyHeadColumn> </EmptyHeadColumn>
//                                     <HeadColumn
//                                         style={{
//                                             minWidth: "30%",
//                                             maxWidth: "30%",
//                                         }}
//                                     >
//                                         ФИО
//                                     </HeadColumn>
//                                     <HeadColumn
//                                         style={{
//                                             minWidth: "25%",
//                                             maxWidth: "25%",
//                                         }}
//                                     >
//                                         Номер телефона
//                                     </HeadColumn>
//                                     <HeadColumn
//                                         style={{
//                                             minWidth: "25%",
//                                             maxWidth: "25%",
//                                         }}
//                                     >
//                                         Электронная почта
//                                     </HeadColumn>
//                                 </FirstHeader>
//                                 {employeesList.length > 0 &&
//                                     employeesList.map((org: EmployeesList) => (
//                                         <div key={org.organizationId}>
//                                             <SecondHeader>
//                                                 Организация:{" "}
//                                                 {org.organizationName}
//                                             </SecondHeader>
//                                             {org.departments.map((dept) => (
//                                                 <div key={dept.departmentId}>
//                                                     <ThirdHeader>
//                                                         <EmployeeDepartmentPath
//                                                             departmentId={
//                                                                 dept.departmentId
//                                                             }
//                                                             dept={dept}
//                                                         />
//                                                     </ThirdHeader>
//                                                     {dept.employees.map(
//                                                         (emp) => (
//                                                             <EmployeeTableRowDiv
//                                                                 key={emp.id}
//                                                                 onClick={() =>
//                                                                     handleRowClick(
//                                                                         emp.id,
//                                                                         emp.organizationId
//                                                                     )
//                                                                 }
//                                                             >
//                                                                 {/* <img
//                                                                     src={
//                                                                         emp.photo &&
//                                                                         emp
//                                                                             .photo
//                                                                             .fullSizeUrl
//                                                                             ? emp
//                                                                                   .photo
//                                                                                   .fullSizeUrl
//                                                                             : PhotoDefault
//                                                                     }
//                                                                     alt={
//                                                                         emp.fullNameRus
//                                                                     }
//                                                                     width="75px"
//                                                                     height="75px"
//                                                                 /> */}
//                                                                 <PhotoObj
//                                                                     photo={
//                                                                         emp.photo
//                                                                     }
//                                                                     width="75px"
//                                                                 />
//                                                                 <CellWrapper
//                                                                     style={{
//                                                                         minWidth:
//                                                                             "40%",
//                                                                         maxWidth:
//                                                                             "40%",
//                                                                     }}
//                                                                 >
//                                                                     <Highlighter
//                                                                         searchWords={[
//                                                                             searchValue ||
//                                                                                 "",
//                                                                         ]}
//                                                                         autoEscape={
//                                                                             true
//                                                                         }
//                                                                         textToHighlight={`${emp.fullNameRus}`}
//                                                                         highlightStyle={{
//                                                                             backgroundColor:
//                                                                                 HIGHLIGHTER_COLOR,
//                                                                         }}
//                                                                     />

//                                                                     <PositionWrapper>
//                                                                         {
//                                                                             emp.positionTitle
//                                                                         }
//                                                                     </PositionWrapper>
//                                                                 </CellWrapper>
//                                                                 <CellWrapper
//                                                                     style={{
//                                                                         flexDirection:
//                                                                             "column",
//                                                                     }}
//                                                                 >
//                                                                     <div>
//                                                                         {/* {emp.statuses.map(
//                                                                             (
//                                                                                 status
//                                                                             ) => (
//                                                                                 <Icon
//                                                                                     icon={
//                                                                                         status
//                                                                                     }
//                                                                                     width="40px"
//                                                                                     type="status"
//                                                                                 />
//                                                                             )
//                                                                         )}
//                                                                         {emp.rewards.map(
//                                                                             (
//                                                                                 status
//                                                                             ) => (
//                                                                                 <Icon
//                                                                                     icon={
//                                                                                         status
//                                                                                     }
//                                                                                     width="40px"
//                                                                                     type="achievement"
//                                                                                 />
//                                                                             )
//                                                                         )} */}
//                                                                     </div>
//                                                                 </CellWrapper>
//                                                                 <CellWrapper
//                                                                     style={{
//                                                                         minWidth:
//                                                                             "25%",
//                                                                         maxWidth:
//                                                                             "25%",
//                                                                     }}
//                                                                 >
//                                                                     {emp.telephoneNumberCorp &&
//                                                                     emp.telephoneNumberCorp !==
//                                                                         "" ? (
//                                                                         <CustomEmailLink
//                                                                             href={`tel:${emp.telephoneNumberCorp}`}
//                                                                             onClick={(
//                                                                                 e
//                                                                             ) =>
//                                                                                 e.stopPropagation()
//                                                                             }
//                                                                         >
//                                                                             {org
//                                                                                 .departments
//                                                                                 .length >
//                                                                             1 ? (
//                                                                                 <Highlighter
//                                                                                     searchWords={[
//                                                                                         searchValue ||
//                                                                                             "",
//                                                                                     ]}
//                                                                                     autoEscape={
//                                                                                         true
//                                                                                     }
//                                                                                     textToHighlight={`${
//                                                                                         emp.telephoneNumberCorp ||
//                                                                                         "Не указан"
//                                                                                     }`}
//                                                                                     highlightStyle={{
//                                                                                         backgroundColor:
//                                                                                             HIGHLIGHTER_COLOR,
//                                                                                     }}
//                                                                                 />
//                                                                             ) : (
//                                                                                 emp.telephoneNumberCorp ||
//                                                                                 "Не указан"
//                                                                             )}
//                                                                         </CustomEmailLink>
//                                                                     ) : (
//                                                                         "Не указан"
//                                                                     )}
//                                                                 </CellWrapper>
//                                                                 <CellWrapper
//                                                                     style={{
//                                                                         flex: "1 1 0%",
//                                                                         display:
//                                                                             "flex",
//                                                                     }}
//                                                                 >
//                                                                     {emp.email ? (
//                                                                         <>
//                                                                             <CustomEmailLink
//                                                                                 href={`mailto:${emp.email}`}
//                                                                                 onClick={(
//                                                                                     e
//                                                                                 ) =>
//                                                                                     e.stopPropagation()
//                                                                                 }
//                                                                             >
//                                                                                 {emp.email ||
//                                                                                     "Не указан"}
//                                                                             </CustomEmailLink>
//                                                                             <CustomCopyButton
//                                                                                 size={
//                                                                                     13
//                                                                                 }
//                                                                                 onClick={(
//                                                                                     e
//                                                                                 ) => {
//                                                                                     e.stopPropagation();
//                                                                                     handleCopyClick(
//                                                                                         emp.email!
//                                                                                     );
//                                                                                 }}
//                                                                             />
//                                                                         </>
//                                                                     ) : (
//                                                                         "Не указан"
//                                                                     )}
//                                                                 </CellWrapper>
//                                                             </EmployeeTableRowDiv>
//                                                         )
//                                                     )}
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     ))}
//                             </div>
//                         )}
//                     </EmployeeListWrapperTable>
//                 )}
//             </EmployeeListWrapperMain>
//         </EmployeeListWrapper>
//     );
// };

import React, { useEffect, useMemo, useState, useRef } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { useOrgStore } from "../../store/organizationStore";
import { EmployeeSkeleton } from "./EmployeeSkeleton";
import DefaultPhoto from "../../assets/photo.jpg";
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
    EmployeeListWrapper,
    DivTableRow,
    DivTableCell,
} from "./StyledComponents";
import Highlighter from "react-highlight-words";
import { SearchBar } from "../SearchBar/SearchBar";
import { ClipboardCopy } from "lucide-react";
import { Icon } from "./Icon";
import { PhotoObj } from "./PhotoObj";
import EmployeeTableItem from "./EmployeeTableItem";
import { useEmployeeStore } from "../../store/employeeStore";

// Типы
interface StatusReward {
    url: string;
    description: string;
}

interface employeeData {
    statuses: StatusReward[];
    rewards: StatusReward[];
    photo: string;
}

type PhotoStatus = "loading" | "error" | employeeData;

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
    const loadEmployeeData = useEmployeeStore(
        (state) => state.loadEmployeeData
    );
    const employeeData = useEmployeeStore((state) => state.employeeData);

    const searchValue = searchParams.get("value");
    const searchCategory = searchParams.get("type") as CATEGORIES | null;
    const organizationId = searchParams.get("organizationId");
    const departmentId = searchParams.get("departmentId");

    const observerRefs = useRef<Record<string, HTMLDivElement>>({});

    const handleCopyClick = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.info("Скопировано в буфер обмена", { position: "top-right" });
    };

    const handleRowClick = (empId: string, orgId: string) => {
        setIsEmployeeInfoModalOpen(!isEmployeeInfoModalOpen);
        fetchCurrentEmployeeInfo(empId, orgId);
        loadEmployeeData(empId, orgId);
    };

    const employeesTree = useMemo(
        () => employees ?? emptyEmployeesTree,
        [employees]
    );

    const departments = useMemo(() => {
        const map = new Map<
            string,
            {
                departmentId: string;
                departmentName: string;
                employees: Employee[];
            }
        >();

        // Рекурсивная функция для обхода дерева
        const traverse = (node: EmployeesListTree) => {
            if (node.employees?.length > 0) {
                const deptId = node.departmentId;

                if (!map.has(deptId)) {
                    map.set(deptId, {
                        departmentId: deptId,
                        departmentName: node.departmentName,
                        employees: [],
                    });
                }

                map.get(deptId)?.employees.push(...node.employees);
            }

            if (node.children?.length > 0) {
                for (const child of node.children) {
                    traverse(child);
                }
            }
        };

        if (employeesTree) {
            traverse(employeesTree);
        }

        return Array.from(map.values());
    }, [employeesTree]);

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

    useEffect(() => {
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

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const target = entry.target as HTMLElement;
                    const employeeId = target.dataset.employeeId;
                    const orgId = target.dataset.organizationId;

                    if (
                        entry.isIntersecting &&
                        employeeId &&
                        orgId &&
                        !employeeData[employeeId]
                    ) {
                        loadEmployeeData(employeeId, orgId);
                    }
                });
            },
            {
                rootMargin: "0px 0px 200px 0px",
                threshold: 0,
            }
        );

        // После появления сотрудников, подписываемся на их DOM-элементы
        Object.values(observerRefs.current).forEach((el) => {
            if (el) observer.observe(el);
        });
        observer.takeRecords();
        return () => {
            observer.disconnect();
        };
        // Должно зависеть от списка сотрудников, т.к. меняются refs
    }, [departments, employeesList]);

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
                ) : (
                    <EmployeeListWrapperTable>
                        {/* === Пункт 1: выбор по орг/департаменту === */}
                        {employeesList.length === 0 ? (
                            <div>
                                {departments.length > 0 && (
                                    <>
                                        <FirstHeader>
                                            <EmptyHeadColumn></EmptyHeadColumn>
                                            <HeadColumn
                                                style={{
                                                    width: "30%",
                                                }}
                                            >
                                                ФИО
                                            </HeadColumn>
                                            <HeadColumn
                                                style={{
                                                    width: "20%",
                                                }}
                                            ></HeadColumn>
                                            <HeadColumn
                                                style={{
                                                    width: "25%",
                                                }}
                                            >
                                                Номер телефона
                                            </HeadColumn>
                                            <HeadColumn
                                                style={{
                                                    width: "25%",
                                                }}
                                            >
                                                Электронная почта
                                            </HeadColumn>
                                        </FirstHeader>
                                        <SecondHeader>
                                            Организация:{" "}
                                            {employeesTree.organizationName}
                                        </SecondHeader>
                                        {departments.map((dept) => (
                                            <div key={dept.departmentId}>
                                                <ThirdHeader>
                                                    <EmployeeDepartmentPath
                                                        departmentId={
                                                            dept.departmentId ||
                                                            ""
                                                        }
                                                        dept={departments}
                                                    />
                                                </ThirdHeader>
                                                {dept.employees.map((emp) => (
                                                    <EmployeeTableItem
                                                        emp={emp}
                                                        handleRowClick={
                                                            handleRowClick
                                                        }
                                                        observerRefs={
                                                            observerRefs
                                                        }
                                                        organizationId={
                                                            organizationId
                                                        }
                                                        employeeData={
                                                            employeeData
                                                        }
                                                        handleCopyClick={
                                                            handleCopyClick
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        ))}
                                        {departments.length === 0 && (
                                            <div
                                                style={{
                                                    textAlignLast: "center",
                                                }}
                                            >
                                                {/* <img src={NotFound} alt="Не найдено" /> */}
                                                <img
                                                    src={NotFoundIcon}
                                                    alt="Не найдено"
                                                    width={150}
                                                    style={{
                                                        margin: "15% 0 40px",
                                                    }}
                                                />
                                                <div>
                                                    <span>
                                                        По заданным критериям
                                                        сотрудники не найдены.{" "}
                                                        <br />
                                                        Проверьте правильность
                                                        введенных данных или
                                                        выбранный фильтр
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ) : (
                            /* === Пункт 2: режим поиска === */
                            <div>
                                <FirstHeader>
                                    <EmptyHeadColumn></EmptyHeadColumn>
                                    <HeadColumn
                                        style={{
                                            width: "30%",
                                        }}
                                    >
                                        ФИО
                                    </HeadColumn>
                                    <HeadColumn
                                        style={{
                                            width: "20%",
                                        }}
                                    ></HeadColumn>
                                    <HeadColumn
                                        style={{
                                            width: "25%",
                                        }}
                                    >
                                        Номер телефона
                                    </HeadColumn>
                                    <HeadColumn
                                        style={{
                                            width: "25%",
                                        }}
                                    >
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
                                                        departmentId={
                                                            dept.departmentId
                                                        }
                                                        dept={dept}
                                                    />
                                                </ThirdHeader>
                                                {dept.employees.map((emp) => (
                                                    <EmployeeTableItem
                                                        emp={emp}
                                                        handleRowClick={
                                                            handleRowClick
                                                        }
                                                        observerRefs={
                                                            observerRefs
                                                        }
                                                        organizationId={
                                                            dept.organizationId
                                                        }
                                                        employeeData={
                                                            employeeData
                                                        }
                                                        handleCopyClick={
                                                            handleCopyClick
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </EmployeeListWrapperTable>
                )}
            </EmployeeListWrapperMain>
        </EmployeeListWrapper>
    );
};
