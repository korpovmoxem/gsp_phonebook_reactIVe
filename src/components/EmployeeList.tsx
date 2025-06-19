// import { useEffect } from "react";
// import { useOrgStore } from "../store/organizationStore";
// import { EmployeeSkeleton } from "./EmployeeSkeleton";
// import styled from "styled-components";
// import PhotoDefault from "../materials/photo.jpg";
// import { CopyIcon } from "lucide-react";
// import { useSearchParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import { EmployeeDepartmentPath } from "./EmployeeDepartmentPath";
// import { CATEGORIES, Employee, EmployeesListTree } from "../types";

// const EmployeeListWrapperMain = styled.div`
//     display: flex;
//     flex-direction: column;
//     height: auto;
//     margin: 10px;
//     padding: 10px;
//     text-align: left;
//     background: white;
//     border-radius: 10px;
//     width: 100%;
// `;

// const EmployeeListWrapperTable = styled.div`
//     width: 100%;
//     overflow-y: auto;
//     scrollbar-width: thin;
//     scroll-behavior: smooth;
//     scrollbar-color: rgb(199, 199, 199) transparent;
// `;

// const EmployeeListWrapper = styled.div`
//     max-height: 90%;
//     overflow-y: auto;
//     scrollbar-width: thin;
//     scroll-behavior: smooth;
//     scrollbar-color: rgb(199, 199, 199) transparent;
// `;

// const EmployeeTableRow = styled.tr`
//     height: 100px;
//     border-bottom: 1px solid rgb(235, 235, 235);
//     cursor: pointer;
//     &:hover {
//         background-color: #f8f8ff;
//     }
// `;

// const EmployeeTableRowDiv = styled.div`
//     display: flex;
//     padding: 6px 8px;
//     height: 100px;
//     border-bottom: 1px solid rgb(235, 235, 235);
//     align-items: anchor-center;
//     cursor: pointer;
//     &:hover {
//         background-color: #f8f8ff;
//     }
// `;

// const CustomEmailLink = styled.a`
//     color: black;
//     &:hover {
//         color: grey;
//     }
// `;

// const CustomCopyButton = styled(CopyIcon)`
//     margin-left: 10px;
//     cursor: pointer;
//     &:hover {
//         color: grey;
//     }
// `;

// export const EmployeeList: React.FC = () => {
//     const [searchParams, setSearchParams] = useSearchParams();
//     const {
//         employees,
//         isEmpLoading,
//         // loadMoreEmployees,
//         employeesList,
//         fetchEmployeesWithParams,
//         isEmployeeInfoModalOpen,
//         setIsEmployeeInfoModalOpen,
//         fetchCurrentEmployeeInfo,
//         selectOrg,
//     } = useOrgStore();

//     const value = searchParams.get("value");
//     const category = searchParams.get("type") as CATEGORIES;
//     const organizationId = searchParams.get("organizationId");
//     const departmentId = searchParams.get("departmentId");

//     const handleCopyClick = (text: string) => {
//         navigator.clipboard.writeText(text);
//         toast.info("Скопировано в буфер обмена", {
//             position: "top-right",
//         });
//     };

//     const handleRowClick = (idEmployee: string, idOrganization: string) => {
//         setIsEmployeeInfoModalOpen(!isEmployeeInfoModalOpen);
//         fetchCurrentEmployeeInfo(idEmployee, idOrganization);
//     };

//     const getAllEmployees = (tree: EmployeesListTree): Employee[] => {
//         let result: Employee[] = [...tree.employees];

//         for (const child of tree.children) {
//             result = result.concat(getAllEmployees(child));
//         }

//         return result;
//     };

//     useEffect(() => {
//         if (!value && !category && !organizationId && !departmentId) {
//             // loadMoreEmployees();
//             selectOrg(
//                 "7842155505",
//                 "9c685cfe-e9a0-11e8-90f2-0050569026ba",
//                 "false"
//             );
//         }
//         if (value && category) {
//             fetchEmployeesWithParams(value, category);
//         }
//         if (organizationId || departmentId) {
//             console.log("departmentId || organizationId");
//         }
//         // Зависимости не нужны, нужно только при первом рендере
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     return (
//         <EmployeeListWrapperMain style={{ padding: 10 }}>
//             {isEmpLoading ? (
//                 <EmployeeSkeleton />
//             ) : (
//                 <>
//                     <EmployeeListWrapperTable>
//                         {/* Тут клик по оргнизации/департаменту */}
//                         {employeesList.length === 0 ? (
//                             <table
//                                 style={{
//                                     width: "100%",
//                                     borderCollapse: "collapse",
//                                 }}
//                             >
//                                 <thead
//                                     style={{
//                                         position: "sticky",
//                                         top: "0",
//                                         background: "#b2ddf6",
//                                         height: "40px",
//                                         textAlign: "left",
//                                     }}
//                                 >
//                                     <tr>
//                                         <th
//                                             style={{
//                                                 width: "100px",
//                                                 border: "none",
//                                                 borderTopLeftRadius: "5px",
//                                                 overflow: "hidden",
//                                             }}
//                                         ></th>
//                                         <th
//                                             style={{
//                                                 width: "50%",
//                                             }}
//                                         >
//                                             ФИО
//                                         </th>
//                                         <th
//                                             style={{
//                                                 width: "25%",
//                                             }}
//                                         >
//                                             Почта
//                                         </th>
//                                         <th
//                                             style={{
//                                                 border: "none",
//                                                 borderTopRightRadius: "5px",
//                                                 minWidth: "100px",
//                                                 width: "25%",
//                                             }}
//                                         >
//                                             Телефон
//                                         </th>
//                                     </tr>
//                                 </thead>

//                                 <tbody>
//                                     {employees ? (
//                                         getAllEmployees(employees).map(
//                                             (emp) => (
//                                                 // Пока коммент, рабочий вариант
//                                                 <EmployeeTableRow
//                                                     key={emp.id}
//                                                     onClick={() =>
//                                                         handleRowClick(
//                                                             emp.id,
//                                                             emp.organizationId
//                                                         )
//                                                     }
//                                                 >
//                                                     <td>
//                                                         <img
//                                                             src={
//                                                                 emp.photo
//                                                                     ? `data:image/jpeg;base64,${emp.photo}`
//                                                                     : PhotoDefault
//                                                             }
//                                                             alt={
//                                                                 emp.fullNameRus
//                                                             }
//                                                             width="75px"
//                                                         />
//                                                     </td>
//                                                     <td>
//                                                         <div
//                                                             style={{
//                                                                 marginLeft:
//                                                                     "20px",
//                                                             }}
//                                                         >
//                                                             <div>
//                                                                 {
//                                                                     emp.fullNameRus
//                                                                 }
//                                                             </div>
// <div
//     style={{
//         fontSize:
//             "14px",
//         color: "grey",
//     }}
// >
//     {
//         emp.positionTitle
//     }
// </div>
//                                                         </div>
//                                                     </td>
//                                                     <td>
//                                                         {emp.email && (
//                                                             <>
// <CustomEmailLink
//     href={`mailto:${emp.email}`}
//     onClick={(
//         e
//     ) =>
//         e.stopPropagation()
//     }
// >
//     {emp.email}
// </CustomEmailLink>
//                                                                 <CustomCopyButton
//                                                                     onClick={(
//                                                                         e
//                                                                     ) => {
//                                                                         handleCopyClick(
//                                                                             emp.email ||
//                                                                                 ""
//                                                                         );
//                                                                         e.stopPropagation();
//                                                                     }}
//                                                                     size={13}
//                                                                 />
//                                                             </>
//                                                         )}
//                                                     </td>
//                                                     <td>
//                                                         {emp.telephoneNumberCorp && (
//                                                             <>
//                                                                 {
//                                                                     emp.telephoneNumberCorp
//                                                                 }
//                                                                 <CustomCopyButton
//                                                                     onClick={(
//                                                                         e
//                                                                     ) => {
//                                                                         handleCopyClick(
//                                                                             emp.telephoneNumberCorp ||
//                                                                                 ""
//                                                                         );
//                                                                         e.stopPropagation();
//                                                                     }}
//                                                                     size={13}
//                                                                 />
//                                                             </>
//                                                         )}
//                                                     </td>
//                                                 </EmployeeTableRow>
//                                                 // Пока коммент, рабочий вариант
//                                             )
//                                         )
//                                     ) : (
//                                         <tr>
//                                             <td colSpan={4}>Нет данных</td>
//                                         </tr>
//                                     )}
//                                 </tbody>
//                             </table>
//                         ) : (
//                             <>
//                                 <div
//                                     style={{
//                                         height: "100%",
//                                         overflowY: "auto",
//                                         fontFamily: "Arial, sans-serif",
//                                     }}
//                                 >
//                                     {/* Тут поиск */}
//                                     {employeesList.map((org) => (
//                                         <div key={org.organizationId}>
//                                             {/* Sticky organization */}
//                                             <div
//                                                 style={{
//                                                     position: "sticky",
//                                                     top: 0,
//                                                     background: "#b2ddf6",
//                                                     padding: "8px",
//                                                     fontWeight: "bold",
//                                                     borderBottom:
//                                                         "1px solid #ccc",
//                                                     zIndex: 3,
//                                                 }}
//                                             >
//                                                 Организация:{" "}
//                                                 {org.organizationName}
//                                             </div>

//                                             {/* Departments block */}
//                                             {org.departments.map((dept) => (
//                                                 <div key={dept.departmentId}>
//                                                     {/* Sticky department */}
//                                                     <div
//                                                         style={{
//                                                             position: "sticky",
//                                                             top: "33px",
//                                                             background:
//                                                                 "#F1F1F1",
//                                                             padding: "6px",
//                                                             fontWeight: 500,
//                                                             borderBottom:
//                                                                 "1px solid #ccc",
//                                                             zIndex: 2,
//                                                         }}
//                                                     >
//                                                         <EmployeeDepartmentPath
//                                                             departmentId={
//                                                                 dept.departmentId
//                                                             }
//                                                         />
//                                                     </div>

//                                                     {/* Employee rows inside department */}
//                                                     {dept.employees.map(
//                                                         (employee) => (
//                                                             <EmployeeTableRowDiv
//                                                                 key={
//                                                                     employee.id
//                                                                 }
//                                                                 onClick={() =>
//                                                                     handleRowClick(
//                                                                         employee.id,
//                                                                         employee.organizationId
//                                                                     )
//                                                                 }
//                                                             >
//                                                                 <img
//                                                                     src={
//                                                                         employee.photo
//                                                                             ? `data:image/jpeg;base64,${employee.photo}`
//                                                                             : PhotoDefault
//                                                                     }
//                                                                     alt={
//                                                                         employee.fullNameRus
//                                                                     }
//                                                                     width="75px"
//                                                                     height="75px"
//                                                                 />
//                                                                 <div
//                                                                     style={{
//                                                                         flex: 1,
//                                                                         padding:
//                                                                             "4px 8px",
//                                                                     }}
//                                                                 >
//                                                                     {
//                                                                         employee.fullNameRus
//                                                                     }
//                                                                 </div>
//                                                                 <div
//                                                                     style={{
//                                                                         flex: 1,
//                                                                         padding:
//                                                                             "4px 8px",
//                                                                     }}
//                                                                 >
//                                                                     {
//                                                                         employee.telephoneNumberCorp
//                                                                     }
//                                                                 </div>
//                                                                 <div
//                                                                     style={{
//                                                                         flex: 1,
//                                                                         padding:
//                                                                             "4px 8px",
//                                                                     }}
//                                                                 >
//                                                                     {
//                                                                         employee.email
//                                                                     }
//                                                                 </div>
//                                                             </EmployeeTableRowDiv>
//                                                         )
//                                                     )}
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     ))}
//                                 </div>
//                             </>
//                         )}
//                     </EmployeeListWrapperTable>
//                 </>
//             )}
//         </EmployeeListWrapperMain>
//     );
// };

import { useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useOrgStore } from "../store/organizationStore";
import { EmployeeSkeleton } from "./EmployeeSkeleton";
import styled from "styled-components";
import PhotoDefault from "../materials/photo.jpg";
import { CopyIcon } from "lucide-react";
import { toast } from "react-toastify";
import { EmployeeDepartmentPath } from "./EmployeeDepartmentPath";
import {
    CATEGORIES,
    Employee,
    EmployeesListTree,
    EmployeesList,
} from "../types";
import NotFound from "../materials/notFound.gif";
import NotFoundIcon from "../materials/notFoundIcon.png";
import { CustomCopyButton, CustomEmailLink } from "./components";

const EmployeeListWrapperMain = styled.div`
    display: flex;
    flex-direction: column;
    margin: 10px;
    padding: 10px;
    background: white;
    border-radius: 10px;
    width: 100%;
`;

const EmployeeListWrapperTable = styled.div`
    width: 100%;
    overflow-y: auto;
    scrollbar-width: thin;
    scroll-behavior: smooth;
    scrollbar-color: rgb(199, 199, 199) transparent;
`;

const EmployeeTableRowDiv = styled.div`
    font-family: Arial, sans-serif;
    display: flex;
    padding: 6px 8px;
    min-height: 100px;
    border-bottom: 1px solid rgb(235, 235, 235);
    align-items: center;
    cursor: pointer;
    &:hover {
        background-color: #f8f8ff;
    }
`;

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

export const EmployeeList: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

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

    return (
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
                                    <div
                                        style={{
                                            position: "sticky",
                                            top: 0,
                                            // background: "#b2ddf6",
                                            background: "#0d67a1",
                                            padding: "8px",
                                            fontWeight: "bold",
                                            borderBottom:
                                                "1px solid rgb(255, 255, 255)",
                                            zIndex: 3,
                                            display: "flex",
                                            borderTopLeftRadius: "10px",
                                            borderTopRightRadius: "10px",
                                            color: "white",
                                        }}
                                    >
                                        <div
                                            style={{
                                                minWidth: "80px",
                                                fontWeight: "400",
                                            }}
                                        >
                                            {" "}
                                        </div>
                                        <div
                                            style={{
                                                flex: "1 1 0%",
                                                fontWeight: "400",
                                            }}
                                        >
                                            ФИО
                                        </div>
                                        <div
                                            style={{
                                                flex: "1 1 0%",
                                                fontWeight: "400",
                                            }}
                                        >
                                            Номер телефона
                                        </div>
                                        <div
                                            style={{
                                                flex: "1 1 0%",
                                                fontWeight: "400",
                                            }}
                                        >
                                            Email
                                        </div>
                                    </div>
                                    {/* Заголовок организации */}
                                    <div
                                        style={{
                                            position: "sticky",
                                            top: "35px",
                                            background: "#F1F1F1",
                                            padding: "8px",
                                            fontWeight: "bold",
                                            borderBottom: "1px solid #FFF",
                                            zIndex: 3,
                                        }}
                                    >
                                        Организация:{" "}
                                        {employeesTree.organizationName}
                                    </div>
                                    {/* Блоки департаментов */}
                                    {departments.map((dept) => (
                                        <div key={dept.departmentId}>
                                            {/* Хлебные крошки с полным путём */}
                                            <div
                                                style={{
                                                    position: "sticky",
                                                    top: "69px",
                                                    background: "#F1F1F1",
                                                    padding: "6px",
                                                    fontWeight: 500,

                                                    zIndex: 2,
                                                }}
                                            >
                                                <EmployeeDepartmentPath
                                                    departmentId={
                                                        dept.departmentId
                                                    }
                                                />
                                            </div>
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
                                                        alt={emp.fullNameRus}
                                                        width="75px"
                                                        height="75px"
                                                    />
                                                    <div
                                                        style={{
                                                            flex: 1,
                                                            padding: "4px 8px",
                                                        }}
                                                    >
                                                        {emp.fullNameRus}
                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    "14px",
                                                                color: "grey",
                                                            }}
                                                        >
                                                            {emp.positionTitle}
                                                        </div>
                                                    </div>
                                                    <div
                                                        style={{
                                                            flex: 1,
                                                            padding: "4px 8px",
                                                        }}
                                                    >
                                                        {
                                                            emp.telephoneNumberCorp
                                                        }
                                                    </div>
                                                    <div
                                                        style={{
                                                            flex: 1,
                                                            padding: "4px 8px",
                                                        }}
                                                    >
                                                        {emp.email && (
                                                            <>
                                                                <CustomEmailLink
                                                                    href={`mailto:${emp.email}`}
                                                                    onClick={(
                                                                        e
                                                                    ) =>
                                                                        e.stopPropagation()
                                                                    }
                                                                >
                                                                    {emp.email}
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
                                                        )}
                                                    </div>
                                                </EmployeeTableRowDiv>
                                            ))}
                                        </div>
                                    ))}
                                </>
                            )}
                            {departments.length === 0 && (
                                <div style={{ textAlignLast: "center" }}>
                                    <img src={NotFound} />
                                    {/* <img src={NotFoundIcon} /> */}
                                    <div>
                                        <span>
                                            По заданным критериям сотрудники не
                                            найдены
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* === Пункт 2: режим поиска === */
                        <div>
                            <div
                                style={{
                                    position: "sticky",
                                    top: 0,
                                    background: "#b2ddf6",
                                    padding: "8px",
                                    fontWeight: "bold",
                                    borderBottom: "1px solid #ccc",
                                    zIndex: 3,
                                    display: "flex",
                                    borderTopLeftRadius: "10px",
                                    borderTopRightRadius: "10px",
                                }}
                            >
                                <div style={{ minWidth: "80px" }}> </div>
                                <div style={{ flex: "1 1 0%" }}>ФИО</div>
                                <div style={{ flex: "1 1 0%" }}>
                                    Номер телефона
                                </div>
                                <div style={{ flex: "1 1 0%" }}>Email</div>
                            </div>
                            {employeesList.length > 0 &&
                                employeesList.map((org: EmployeesList) => (
                                    <div key={org.organizationId}>
                                        <div
                                            style={{
                                                position: "sticky",
                                                top: "35px",
                                                background: "#F1F1F1",
                                                padding: "8px",
                                                fontWeight: "bold",
                                                borderBottom: "1px solid #ccc",
                                                zIndex: 3,
                                            }}
                                        >
                                            Организация: {org.organizationName}
                                        </div>
                                        {org.departments.map((dept) => (
                                            <div key={dept.departmentId}>
                                                <div
                                                    style={{
                                                        position: "sticky",
                                                        top: "69px",
                                                        background: "#F1F1F1",
                                                        padding: "6px",
                                                        fontWeight: 500,
                                                        borderBottom:
                                                            "1px solid #ccc",
                                                        zIndex: 2,
                                                    }}
                                                >
                                                    <EmployeeDepartmentPath
                                                        departmentId={
                                                            dept.departmentId
                                                        }
                                                    />
                                                </div>
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
                                                        />
                                                        <div
                                                            style={{
                                                                flex: 1,
                                                                padding:
                                                                    "4px 8px",
                                                            }}
                                                        >
                                                            {emp.fullNameRus}
                                                            <div
                                                                style={{
                                                                    fontSize:
                                                                        "14px",
                                                                    color: "grey",
                                                                }}
                                                            >
                                                                {
                                                                    emp.positionTitle
                                                                }
                                                            </div>
                                                        </div>
                                                        <div
                                                            style={{
                                                                flex: 1,
                                                                padding:
                                                                    "4px 8px",
                                                            }}
                                                        >
                                                            {
                                                                emp.telephoneNumberCorp
                                                            }
                                                        </div>
                                                        <div
                                                            style={{
                                                                flex: 1,
                                                                padding:
                                                                    "4px 8px",
                                                            }}
                                                        >
                                                            {emp.email && (
                                                                <>
                                                                    <CustomEmailLink
                                                                        href={`mailto:${emp.email}`}
                                                                        onClick={(
                                                                            e
                                                                        ) =>
                                                                            e.stopPropagation()
                                                                        }
                                                                    >
                                                                        {
                                                                            emp.email
                                                                        }
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
                                                            )}
                                                        </div>
                                                    </EmployeeTableRowDiv>
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
    );
};
