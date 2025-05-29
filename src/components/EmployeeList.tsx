import { useEffect } from "react";
import { useOrgStore } from "../store/organizationStore";
import { EmployeeSkeleton } from "./EmployeeSkeleton";
import styled from "styled-components";

const EmployeeListWrapperMain = styled.div`
    display: flex;
    flex-direction: column;
    height: auto;
    margin: 10px;
    padding: 10px;
    text-align: left;
    background: #f9f9f9;
    border-radius: 10px;
    width: 100%;
`;

const EmployeeListWrapper = styled.div`
    max-height: 90%;
    overflow-y: auto;
    scrollbar-width: thin;
    scroll-behavior: smooth;
    scrollbar-color: rgb(199, 199, 199) transparent;
`;

export const EmployeeList: React.FC = () => {
    const {
        employees,
        selectedOrgId,
        isEmpLoading,
        loadMoreEmployees,
        totalCount,
    } = useOrgStore();

    console.log("EmployeeList");
    console.log(employees);

    useEffect(() => {
        loadMoreEmployees();
    }, []);

    if (!selectedOrgId) return <div>Выберите подразделение</div>;
    if (isEmpLoading && employees.length === 0) return <EmployeeSkeleton />;

    return (
        <EmployeeListWrapperMain style={{ padding: 10 }}>
            <h3>Сотрудники</h3>
            {/* <EmployeeListWrapper> */}
            <table style={{ border: "1px solid black" }}>
                <thead>
                    <th>ФИО</th>
                    <th>Должность</th>
                    <th>Почта</th>
                    <th>Телефон</th>
                </thead>

                <tbody>
                    <EmployeeListWrapper>
                        {employees.map((emp) => (
                            <tr
                                key={emp.id}
                                style={{
                                    height: "100px",
                                    border: "1px solid black",
                                }}
                            >
                                <td>{emp.name}</td>
                                <td>{emp.position}</td>
                                <td>{emp.mail}</td>
                                <td>{emp.phone}</td>
                            </tr>
                        ))}
                    </EmployeeListWrapper>
                </tbody>
            </table>
            {/* </EmployeeListWrapper> */}
            {/* {employees.length < totalCount && (
                <button onClick={loadMoreEmployees} disabled={isEmpLoading}>
                    {isEmpLoading ? "Загрузка..." : "Загрузить ещё"}
                </button>
            )} */}
        </EmployeeListWrapperMain>
    );
};
