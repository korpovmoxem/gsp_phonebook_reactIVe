import { useEffect } from "react";
import { useOrgStore } from "../store/organizationStore";
import { EmployeeSkeleton } from "./EmployeeSkeleton";
import styled from "styled-components";
import PhotoDefault from "../materials/photo.jpg";
import { CopyIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

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
        selectedOrgId,
        isEmpLoading,
        loadMoreEmployees,
        totalCount,
    } = useOrgStore();

    const handleCopyClick = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.info("Скопировано в буфер обмена", {
            position: "top-right",
        });
    };

    useEffect(() => {
        if (
            searchParams.get("organizationId") === null &&
            searchParams.get("departmentId") === null
        ) {
            loadMoreEmployees();
        }
        // Зависимости не нужны, нужно только при первом рендере
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <EmployeeListWrapperMain style={{ padding: 10 }}>
            {isEmpLoading && employees.length === 0 ? (
                <EmployeeSkeleton />
            ) : (
                <>
                    <h3 style={{ margin: "0 15px 10px" }}>Сотрудники</h3>
                    <EmployeeListWrapperTable>
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
                                }}
                            >
                                <tr
                                    style={{
                                        textAlign: "left",
                                    }}
                                >
                                    <th
                                        style={{
                                            width: "100px",
                                            border: "none",
                                            borderTopLeftRadius: "5px",
                                            overflow: "hidden",
                                        }}
                                    ></th>
                                    <th>ФИО</th>
                                    <th>Почта</th>
                                    <th
                                        style={{
                                            border: "none",
                                            borderTopRightRadius: "5px",
                                            minWidth: "100px",
                                        }}
                                    >
                                        Телефон
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {employees.map((emp) => (
                                    <EmployeeTableRow
                                        key={emp.id}
                                        onClick={() => {
                                            console.log("Click");
                                        }}
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
                                            <div>{emp.fullNameRus}</div>
                                            <div
                                                style={{
                                                    fontSize: "14px",
                                                    color: "grey",
                                                }}
                                            >
                                                {emp.positionTitle}
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
                                                        onClick={(e) => {
                                                            handleCopyClick(
                                                                emp.email || ""
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
                                            {emp.telephoneNumberCorp !== "" && (
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
                                ))}
                            </tbody>
                        </table>
                    </EmployeeListWrapperTable>
                </>
            )}
        </EmployeeListWrapperMain>
    );
};
