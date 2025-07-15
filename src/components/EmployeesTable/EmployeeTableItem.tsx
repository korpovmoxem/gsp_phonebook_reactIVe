import { memo, useEffect } from "react";
import { Employee } from "../../types";
import { CustomEmailLink, CustomCopyButton } from "../StyledComponents";
import { Icon } from "./Icon";
import { PhotoObj } from "./PhotoObj";
import {
    CellWrapper,
    DivTableCell,
    DivTableRow,
    EmployeeTableRowDiv,
    PositionWrapper,
} from "./StyledComponents";
import { useEmployeeStore } from "../../store/employeeStore";

interface Props {
    emp: Employee;
    handleRowClick: (employeeId: string, orgId: string) => void;
    organizationId: string | null;
    employeeData: Record<
        string,
        "loading" | "error" | { statuses: any[]; rewards: any[]; photo: string }
    >;
    handleCopyClick: (text: string) => void;
}

const EmployeeTableItem = ({
    emp,
    handleRowClick,
    organizationId,
    employeeData,
    handleCopyClick,
}: Props) => {
    const loadEmployeeData = useEmployeeStore((s) => s.loadEmployeeData);

    // Если фото еще нет — запусти загрузку
    useEffect(() => {
        if (emp.id && organizationId && employeeData[emp.id] === undefined) {
            loadEmployeeData(emp.id, organizationId, "96");
        }
    }, [emp.id, organizationId, employeeData, loadEmployeeData]);
    return (
        <EmployeeTableRowDiv
            key={emp.id}
            onClick={() => handleRowClick(emp.id, organizationId || "")}
            data-employee-id={emp.id}
        >
            <DivTableRow>
                <DivTableCell>
                    {(() => {
                        const data = employeeData[emp.id];
                        if (
                            data === "loading" ||
                            data === "error" ||
                            data === undefined
                        ) {
                            return <PhotoObj photo={null} width="75px" />;
                        }

                        if (typeof data !== "string" && data !== undefined) {
                            return (
                                <PhotoObj photo={data?.photo} width="75px" />
                            );
                        }
                    })()}
                </DivTableCell>

                <CellWrapper
                    style={{
                        width: "30%",
                        minWidth: "200px",
                    }}
                >
                    {emp.fullNameRus}
                    <PositionWrapper>{emp.positionTitle}</PositionWrapper>
                </CellWrapper>

                <CellWrapper
                    style={{
                        flexDirection: "column",
                        width: "20%",
                    }}
                >
                    <div>
                        {(() => {
                            const data = employeeData[emp.id];
                            if (
                                (data === "loading" ||
                                    data === "error" ||
                                    typeof data === "string") &&
                                data !== undefined
                            )
                                return null;
                            return (
                                <>
                                    {data?.statuses &&
                                        data?.statuses.length > 0 &&
                                        data?.statuses.map((status, i) => (
                                            <Icon
                                                key={`status-${i}`}
                                                icon={status}
                                                width="40px"
                                                type="status"
                                            />
                                        ))}
                                    {data?.rewards &&
                                        data?.rewards.length > 0 &&
                                        data?.rewards.map((reward, i) => (
                                            <Icon
                                                key={`reward-${i}`}
                                                icon={reward}
                                                width="40px"
                                                type="achievement"
                                            />
                                        ))}
                                </>
                            );
                        })()}
                    </div>
                </CellWrapper>

                <CellWrapper
                    style={{
                        width: "25%",
                    }}
                >
                    {emp.telephoneNumberCorp ? (
                        <CustomEmailLink
                            href={`tel:${emp.telephoneNumberCorp}`}
                        >
                            {emp.telephoneNumberCorp}
                        </CustomEmailLink>
                    ) : (
                        "Не указан"
                    )}
                </CellWrapper>

                <CellWrapper
                    style={{
                        width: "25%",
                    }}
                >
                    {emp.email ? (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                            }}
                        >
                            <CustomEmailLink href={`mailto:${emp.email}`}>
                                {emp.email}
                            </CustomEmailLink>
                            <CustomCopyButton
                                size={13}
                                onClick={(e) => handleCopyClick(emp.email!)}
                                style={{ width: "20%" }}
                            />
                        </div>
                    ) : (
                        "Не указан"
                    )}
                </CellWrapper>
            </DivTableRow>
        </EmployeeTableRowDiv>
    );
};

export default memo(EmployeeTableItem);
