import { useEffect } from "react";
import { useOrgStore } from "../store/organizationStore";
import { EmployeeSkeleton } from "./EmployeeSkeleton";
import styled from "styled-components";
import PhotoDefault from "../materials/photo.jpg";
import { PhoneOutgoingIcon, SendIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";

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

export const EmployeeList: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const {
        employees,
        selectedOrgId,
        isEmpLoading,
        loadMoreEmployees,
        totalCount,
    } = useOrgStore();

    useEffect(() => {
        console.log(123123123123);
        console.log(searchParams.get("organizationId"));
        console.log(searchParams.get("departmentId"));
        if (
            searchParams.get("organizationId") === null &&
            searchParams.get("departmentId") === null
        ) {
            loadMoreEmployees();
        }
    }, []);

    if (isEmpLoading && employees.length === 0) return <EmployeeSkeleton />;

    return (
        <EmployeeListWrapperMain style={{ padding: 10 }}>
            <h3>Сотрудники</h3>
            <EmployeeListWrapperTable>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ textAlign: "left" }}>
                            <th style={{ width: "100px" }}></th>
                            <th>ФИО</th>
                            <th>Почта</th>
                            <th>Телефон</th>
                        </tr>
                    </thead>

                    <tbody>
                        {employees.map((emp) => (
                            <tr
                                key={emp.id}
                                style={{
                                    height: "100px",
                                    borderBottom:
                                        "1px solid rgb(235, 235, 235)",
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
                                        width="80px"
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
                                    {emp.email}
                                    {emp.email && (
                                        <a href={`tel:${emp.email}`}>
                                            <SendIcon size={13} />
                                        </a>
                                    )}
                                </td>
                                <td>
                                    {emp.telephoneNumberCorp}
                                    {emp.telephoneNumberCorp !== "" && (
                                        <a
                                            href={`tel:${emp.telephoneNumberCorp}`}
                                        >
                                            <PhoneOutgoingIcon size={13} />
                                        </a>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </EmployeeListWrapperTable>
        </EmployeeListWrapperMain>
    );
};
