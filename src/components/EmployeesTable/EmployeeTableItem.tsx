import { memo } from "react";
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

interface Props {
    emp: Employee;
    handleRowClick: (employeeId: string, orgId: string) => void;
    observerRefs: React.RefObject<Record<string, HTMLDivElement>>;
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
    observerRefs,
    organizationId,
    employeeData,
    handleCopyClick,
}: Props) => {
    return (
        <EmployeeTableRowDiv
            key={emp.id}
            onClick={() => handleRowClick(emp.id, organizationId || "")}
            ref={(el) => {
                if (el) {
                    observerRefs.current[emp.id] = el;
                    el.dataset.organizationId = organizationId || "";
                }
            }}
            data-employee-id={emp.id}
        >
            <DivTableRow>
                {/* --- Фото --- */}
                <DivTableCell>
                    {(() => {
                        const data = employeeData[emp.id];
                        if (data === "loading") {
                            // return <PhotoObj photo={null} width="75px" />;
                            return null;
                        } else if (data === "error") {
                            return null;
                        }

                        if (typeof data !== "string" && data !== undefined) {
                            console.log("+++++++");
                            console.log(emp.id);
                            console.log(data);
                            return (
                                <PhotoObj photo={data?.photo} width="75px" />
                            );
                        }
                    })()}
                </DivTableCell>

                {/* --- ФИО --- */}
                <CellWrapper
                    style={{
                        width: "30%",
                        minWidth: "200px",
                    }}
                >
                    {emp.fullNameRus}
                    <PositionWrapper>{emp.positionTitle}</PositionWrapper>
                </CellWrapper>

                {/* --- Иконки --- */}
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

                {/* --- Телефон --- */}
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

                {/* --- Email --- */}
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
