import { useEffect } from "react";
import { useOrgStore } from "../store/organizationStore";
import { EmployeeSkeleton } from "./EmployeeSkeleton";
import styled from "styled-components";
import PhotoDefault from "../materials/photo.jpg";
import { CopyIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { EmployeeDepartmentPath } from "./EmployeeDepartmentPath";
import { CATEGORIES, Employee, EmployeesListTree } from "../types";

const EmployeeListWrapperMain = styled.div`
    display: flex;
    flex-direction: column;
    height: auto;
    margin: 10px;
    padding: 10px;
    text-align: left;
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

const EmployeeListWrapper = styled.div`
    max-height: 90%;
    overflow-y: auto;
    scrollbar-width: thin;
    scroll-behavior: smooth;
    scrollbar-color: rgb(199, 199, 199) transparent;
`;

const EmployeeTableRow = styled.tr`
    height: 100px;
    border-bottom: 1px solid rgb(235, 235, 235);
    cursor: pointer;
    &:hover {
        background-color: #f8f8ff;
    }
`;

const EmployeeTableRowDiv = styled.div`
    display: flex;
    padding: 6px 8px;
    height: 100px;
    border-bottom: 1px solid rgb(235, 235, 235);
    align-items: anchor-center;
    cursor: pointer;
    &:hover {
        background-color: #f8f8ff;
    }
`;

const CustomEmailLink = styled.a`
    color: black;
    &:hover {
        color: grey;
    }
`;

const CustomCopyButton = styled(CopyIcon)`
    margin-left: 10px;
    cursor: pointer;
    &:hover {
        color: grey;
    }
`;

export const EmployeeList: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const {
        employees,
        isEmpLoading,
        // loadMoreEmployees,
        employeesList,
        fetchEmployeesWithParams,
        isEmployeeInfoModalOpen,
        setIsEmployeeInfoModalOpen,
        fetchCurrentEmployeeInfo,
        selectOrg,
    } = useOrgStore();

    const value = searchParams.get("value");
    const category = searchParams.get("type") as CATEGORIES;
    const organizationId = searchParams.get("organizationId");
    const departmentId = searchParams.get("departmentId");

    const handleCopyClick = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.info("Скопировано в буфер обмена", {
            position: "top-right",
        });
    };

    const handleRowClick = (idEmployee: string, idOrganization: string) => {
        setIsEmployeeInfoModalOpen(!isEmployeeInfoModalOpen);
        fetchCurrentEmployeeInfo(idEmployee, idOrganization);
    };

    const getAllEmployees = (tree: EmployeesListTree): Employee[] => {
        let result: Employee[] = [...tree.employees];

        for (const child of tree.children) {
            result = result.concat(getAllEmployees(child));
        }

        return result;
    };

    useEffect(() => {
        if (!value && !category && !organizationId && !departmentId) {
            // loadMoreEmployees();
            selectOrg(
                "7842155505",
                "9c685cfe-e9a0-11e8-90f2-0050569026ba",
                "false"
            );
        }
        if (value && category) {
            fetchEmployeesWithParams(value, category);
        }
        if (organizationId || departmentId) {
            console.log("departmentId || organizationId");
        }
        // Зависимости не нужны, нужно только при первом рендере
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    console.log("========employees=========");
    console.log(employees);

    return (
        <EmployeeListWrapperMain style={{ padding: 10 }}>
            {isEmpLoading ? (
                <EmployeeSkeleton />
            ) : (
                <>
                    <EmployeeListWrapperTable>
                        {employeesList.length === 0 ? (
                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                }}
                            >
                                <thead
                                    style={{
                                        position: "sticky",
                                        top: "0",
                                        background: "#b2ddf6",
                                        height: "40px",
                                        textAlign: "left",
                                    }}
                                >
                                    <tr>
                                        <th
                                            style={{
                                                width: "100px",
                                                border: "none",
                                                borderTopLeftRadius: "5px",
                                                overflow: "hidden",
                                            }}
                                        ></th>
                                        <th
                                            style={{
                                                width: "50%",
                                            }}
                                        >
                                            ФИО
                                        </th>
                                        <th
                                            style={{
                                                width: "25%",
                                            }}
                                        >
                                            Почта
                                        </th>
                                        <th
                                            style={{
                                                border: "none",
                                                borderTopRightRadius: "5px",
                                                minWidth: "100px",
                                                width: "25%",
                                            }}
                                        >
                                            Телефон
                                        </th>
                                    </tr>
                                </thead>

                                {/* <tbody>  МОЙ КОД
                                    {employees ? (
                                        employees.employees.map((emp) => (
                                            <EmployeeTableRow
                                                key={emp.id}
                                                onClick={() =>
                                                    handleRowClick(
                                                        emp.id,
                                                        emp.organizationId
                                                    )
                                                }
                                            >
                                                <td>
                                                    <img
                                                        src={
                                                            emp.photo
                                                                ? `data:image/jpeg;base64,${emp.photo}`
                                                                : PhotoDefault
                                                        }
                                                        alt={emp.fullNameRus}
                                                        width="75px"
                                                    />
                                                </td>
                                                <td>
                                                    <div
                                                        style={{
                                                            marginLeft: "20px",
                                                        }}
                                                    >
                                                        <div>
                                                            {emp.fullNameRus}
                                                        </div>
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
                                                </td>
                                                <td>
                                                    {emp.email && (
                                                        <>
                                                            <CustomEmailLink
                                                                href={`mailTo:${emp.email}`}
                                                                onClick={(e) =>
                                                                    e.stopPropagation()
                                                                }
                                                            >
                                                                {emp.email}
                                                            </CustomEmailLink>
                                                            <CustomCopyButton
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    handleCopyClick(
                                                                        emp.email ||
                                                                            ""
                                                                    );
                                                                    e.stopPropagation();
                                                                }}
                                                                size={13}
                                                            />
                                                        </>
                                                    )}
                                                </td>
                                                <td>
                                                    {emp.telephoneNumberCorp}
                                                    {emp.telephoneNumberCorp !==
                                                        null && (
                                                        <CustomCopyButton
                                                            onClick={(e) => {
                                                                handleCopyClick(
                                                                    emp.telephoneNumberCorp ||
                                                                        ""
                                                                );
                                                                e.stopPropagation();
                                                            }}
                                                            size={13}
                                                        />
                                                    )}
                                                </td>
                                            </EmployeeTableRow>
                                        ))
                                    ) : (
                                        <></>
                                    )}
                                </tbody> МОЙ КОД */}

                                <tbody>
                                    {employees ? (
                                        getAllEmployees(employees).map(
                                            (emp) => (
                                                <EmployeeTableRow
                                                    key={emp.id}
                                                    onClick={() =>
                                                        handleRowClick(
                                                            emp.id,
                                                            emp.organizationId
                                                        )
                                                    }
                                                >
                                                    <td>
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
                                                        />
                                                    </td>
                                                    <td>
                                                        <div
                                                            style={{
                                                                marginLeft:
                                                                    "20px",
                                                            }}
                                                        >
                                                            <div>
                                                                {
                                                                    emp.fullNameRus
                                                                }
                                                            </div>
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
                                                    </td>
                                                    <td>
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
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        handleCopyClick(
                                                                            emp.email ||
                                                                                ""
                                                                        );
                                                                        e.stopPropagation();
                                                                    }}
                                                                    size={13}
                                                                />
                                                            </>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {emp.telephoneNumberCorp && (
                                                            <>
                                                                {
                                                                    emp.telephoneNumberCorp
                                                                }
                                                                <CustomCopyButton
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        handleCopyClick(
                                                                            emp.telephoneNumberCorp ||
                                                                                ""
                                                                        );
                                                                        e.stopPropagation();
                                                                    }}
                                                                    size={13}
                                                                />
                                                            </>
                                                        )}
                                                    </td>
                                                </EmployeeTableRow>
                                            )
                                        )
                                    ) : (
                                        <tr>
                                            <td colSpan={4}>Нет данных</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            <>
                                {/* {employeesList.map((organization) => (
                                    <>
                                        <h1 style={{ position: "sticky" }}>
                                            {organization.organizationName}
                                        </h1>
                                        {organization.departments.map(
                                            (department) => (
                                                <table
                                                    style={{
                                                        width: "100%",
                                                        borderCollapse:
                                                            "collapse",
                                                        marginBottom: "10px",
                                                    }}
                                                >
                                                    <thead
                                                        style={{
                                                            top: "0",
                                                            background:
                                                                "#b2ddf6",
                                                            height: "40px",
                                                        }}
                                                    >
                                                        <tr>
                                                            <th colSpan={5}>
                                                                {
                                                                    department.departmentName
                                                                }
                                                                <hr
                                                                    style={{
                                                                        border: "1px solid #FFFFFF",
                                                                    }}
                                                                ></hr>
                                                            </th>
                                                        </tr>
                                                        <tr
                                                            style={{
                                                                textAlign:
                                                                    "left",
                                                            }}
                                                        >
                                                            <th
                                                                style={{
                                                                    width: "100px",
                                                                    border: "none",
                                                                    overflow:
                                                                        "hidden",
                                                                    textAlign:
                                                                        "left",
                                                                }}
                                                            ></th>
                                                            <th
                                                                style={{
                                                                    width: "50%",
                                                                }}
                                                            >
                                                                ФИО
                                                            </th>
                                                            <th
                                                                style={{
                                                                    width: "25%",
                                                                }}
                                                            >
                                                                Почта
                                                            </th>
                                                            <th
                                                                style={{
                                                                    border: "none",
                                                                    minWidth:
                                                                        "100px",
                                                                    width: "25%",
                                                                }}
                                                            >
                                                                Телефон
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {department.employees.map(
                                                            (employee) => (
                                                                <EmployeeTableRow
                                                                    key={
                                                                        employee.id
                                                                    }
                                                                    onClick={() => {
                                                                        console.log(
                                                                            "Click"
                                                                        );
                                                                    }}
                                                                >
                                                                    <td>
                                                                        <img
                                                                            src={
                                                                                employee.photo
                                                                                    ? `data:image/jpeg;base64,${employee.photo}`
                                                                                    : PhotoDefault
                                                                            }
                                                                            alt={
                                                                                employee.fullNameRus
                                                                            }
                                                                            width="75px"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <div>
                                                                            {
                                                                                employee.fullNameRus
                                                                            }
                                                                        </div>
                                                                        <div
                                                                            style={{
                                                                                fontSize:
                                                                                    "14px",
                                                                                color: "grey",
                                                                            }}
                                                                        >
                                                                            {
                                                                                employee.positionTitle
                                                                            }
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        {employee.email && (
                                                                            <>
                                                                                <CustomEmailLink
                                                                                    href={`mailTo:${employee.email}`}
                                                                                    onClick={(
                                                                                        e
                                                                                    ) =>
                                                                                        e.stopPropagation()
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        employee.email
                                                                                    }
                                                                                </CustomEmailLink>
                                                                                <CustomCopyButton
                                                                                    onClick={(
                                                                                        e
                                                                                    ) => {
                                                                                        handleCopyClick(
                                                                                            employee.email ||
                                                                                                ""
                                                                                        );
                                                                                        e.stopPropagation();
                                                                                    }}
                                                                                    size={
                                                                                        13
                                                                                    }
                                                                                />
                                                                            </>
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {employee.telephoneNumberCorp && (
                                                                            <>
                                                                                {
                                                                                    employee.telephoneNumberCorp
                                                                                }
                                                                                <CustomCopyButton
                                                                                    onClick={(
                                                                                        e
                                                                                    ) => {
                                                                                        handleCopyClick(
                                                                                            employee.telephoneNumberCorp ||
                                                                                                ""
                                                                                        );
                                                                                        e.stopPropagation();
                                                                                    }}
                                                                                    size={
                                                                                        13
                                                                                    }
                                                                                />
                                                                            </>
                                                                        )}
                                                                    </td>
                                                                </EmployeeTableRow>
                                                            )
                                                        )}
                                                    </tbody>
                                                </table>
                                            )
                                        )}
                                    </>
                                ))} */}

                                <div
                                    style={{
                                        height: "100%",
                                        overflowY: "auto",
                                        fontFamily: "Arial, sans-serif",
                                    }}
                                >
                                    {employeesList.map((org) => (
                                        <div key={org.organizaionId}>
                                            {/* Sticky organization */}
                                            <div
                                                style={{
                                                    position: "sticky",
                                                    top: 0,
                                                    background: "#b2ddf6",
                                                    padding: "8px",
                                                    fontWeight: "bold",
                                                    borderBottom:
                                                        "1px solid #ccc",
                                                    zIndex: 3,
                                                }}
                                            >
                                                Организация:{" "}
                                                {org.organizationName}
                                            </div>

                                            {/* Departments block */}
                                            {org.departments.map((dept) => (
                                                <div key={dept.departmentId}>
                                                    {/* Sticky department */}
                                                    <div
                                                        style={{
                                                            position: "sticky",
                                                            top: "36px",
                                                            background:
                                                                "#F1F1F1",
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

                                                    {/* Employee rows inside department */}
                                                    {dept.employees.map(
                                                        (employee) => (
                                                            <EmployeeTableRowDiv
                                                                key={
                                                                    employee.id
                                                                }
                                                                onClick={() =>
                                                                    handleRowClick(
                                                                        employee.id,
                                                                        employee.organizationId
                                                                    )
                                                                }
                                                            >
                                                                <img
                                                                    src={
                                                                        employee.photo
                                                                            ? `data:image/jpeg;base64,${employee.photo}`
                                                                            : PhotoDefault
                                                                    }
                                                                    alt={
                                                                        employee.fullNameRus
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
                                                                    {
                                                                        employee.fullNameRus
                                                                    }
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        flex: 1,
                                                                        padding:
                                                                            "4px 8px",
                                                                    }}
                                                                >
                                                                    {
                                                                        employee.telephoneNumberCorp
                                                                    }
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        flex: 1,
                                                                        padding:
                                                                            "4px 8px",
                                                                    }}
                                                                >
                                                                    {
                                                                        employee.email
                                                                    }
                                                                </div>
                                                            </EmployeeTableRowDiv>
                                                        )
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </EmployeeListWrapperTable>
                </>
            )}
        </EmployeeListWrapperMain>
    );
};
function fetchEmployeesWithParams() {
    throw new Error("Function not implemented.");
}
