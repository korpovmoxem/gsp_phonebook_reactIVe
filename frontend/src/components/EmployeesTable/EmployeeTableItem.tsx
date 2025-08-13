// import { memo, useEffect } from "react";
// import { Employee } from "../../types";
// import { CustomEmailLink, CustomCopyButton } from "../StyledComponents";
// import { Icon } from "./Icon";
// import { PhotoObj } from "./PhotoObj";
// import {
//     CellWrapper,
//     DivTableCell,
//     DivTableRow,
//     EmployeeTableRowDiv,
//     PositionWrapper,
// } from "./StyledComponents";
// import { useEmployeeStore } from "../../store/employeeStore";

// interface Props {
//     emp: Employee;
//     handleRowClick: (employeeId: string, orgId: string) => void;
//     organizationId: string | null;
//     employeeData: Record<
//         string,
//         {
//             small?:
//                 | "loading"
//                 | "error"
//                 | { statuses: any[]; achievements: any[]; photo: string };
//             large?:
//                 | "loading"
//                 | "error"
//                 | { statuses: any[]; achievements: any[]; photo: string };
//         }
//     >;
//     handleCopyClick: (text: string) => void;
// }

// const EmployeeTableItem = ({
//     emp,
//     handleRowClick,
//     organizationId,
//     employeeData,
//     handleCopyClick,
// }: Props) => {
//     const loadEmployeeData = useEmployeeStore((s) => s.loadEmployeeData);

//     // Если фото еще нет — запусти загрузку
//     useEffect(() => {
//         if (emp.id && organizationId && employeeData[emp.id].small === undefined) {
//             loadEmployeeData(emp.id, organizationId, "96");
//         }
//     }, [emp.id, organizationId, employeeData, loadEmployeeData]);
//     return (
//         <EmployeeTableRowDiv
//             key={emp.id}
//             onClick={() => handleRowClick(emp.id, organizationId || "")}
//             data-employee-id={emp.id}
//         >
//             <DivTableRow>
//                 <DivTableCell>
//                     {(() => {
//                         const data = employeeData[emp.id];
//                         if (
//                             data.small === "loading" ||
//                             data.small === "error" ||
//                             data.small === undefined
//                         ) {
//                             return <PhotoObj photo={null} width="75px" />;
//                         }

//                         if (typeof data !== "string" && data !== undefined) {
//                             return (
//                                 <PhotoObj photo={data?.small.photo} width="75px" />
//                             );
//                         }
//                     })()}
//                 </DivTableCell>

//                 <CellWrapper
//                     style={{
//                         width: "30%",
//                         minWidth: "200px",
//                     }}
//                 >
//                     {emp.fullNameRus}
//                     <PositionWrapper>{emp.positionTitle}</PositionWrapper>
//                 </CellWrapper>

//                 <CellWrapper
//                     style={{
//                         flexDirection: "column",
//                         width: "20%",
//                     }}
//                 >
//                     <div>
//                         {(() => {
//                             const data = employeeData[emp.id];
//                             if (
//                                 (data.small === "loading" ||
//                                     data.small === "error" ||
//                                     typeof data.small === "string") &&
//                                 data !== undefined
//                             )
//                                 return null;
//                             return (
//                                 <>
//                                     {data?.small && data?.small.statuses &&
//                                         data?.statuses.length > 0 &&
//                                         data?.statuses.map((status, i) => (
//                                             <Icon
//                                                 key={`status-${i}`}
//                                                 icon={status}
//                                                 width="40px"
//                                                 type="status"
//                                             />
//                                         ))}
//                                     {data?.achievements &&
//                                         data?.achievements.length > 0 &&
//                                         data?.achievements.map(
//                                             (achievement, i) => (
//                                                 <Icon
//                                                     key={`reward-${i}`}
//                                                     icon={achievement}
//                                                     width="40px"
//                                                     type="achievement"
//                                                 />
//                                             )
//                                         )}
//                                 </>
//                             );
//                         })()}
//                     </div>
//                 </CellWrapper>

//                 <CellWrapper
//                     style={{
//                         width: "25%",
//                     }}
//                 >
//                     {emp.telephoneNumberCorp ? (
//                         <CustomEmailLink
//                             href={`tel:${emp.telephoneNumberCorp}`}
//                         >
//                             {emp.telephoneNumberCorp}
//                         </CustomEmailLink>
//                     ) : (
//                         "Не указан"
//                     )}
//                 </CellWrapper>

//                 <CellWrapper
//                     style={{
//                         width: "25%",
//                     }}
//                 >
//                     {emp.email ? (
//                         <div
//                             style={{
//                                 display: "flex",
//                                 flexDirection: "row",
//                             }}
//                         >
//                             <CustomEmailLink href={`mailto:${emp.email}`}>
//                                 {emp.email}
//                             </CustomEmailLink>
//                             <CustomCopyButton
//                                 size={13}
//                                 onClick={(e) => handleCopyClick(emp.email!)}
//                                 style={{ width: "20%" }}
//                             />
//                         </div>
//                     ) : (
//                         "Не указан"
//                     )}
//                 </CellWrapper>
//             </DivTableRow>
//         </EmployeeTableRowDiv>
//     );
// };

// export default memo(EmployeeTableItem);

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
import { SpinnerCircular } from "spinners-react";
import { useSearchParams } from "react-router-dom";
import Highlighter from "react-highlight-words";

interface Props {
    emp: Employee;
    handleRowClick: (employeeId: string, orgId: string) => void;
    organizationId: string | null;
    employeeData: Record<
        string,
        {
            small?:
                | "loading"
                | "error"
                | { statuses: any[]; achievements: any[]; photo: string };
            large?:
                | "loading"
                | "error"
                | { statuses: any[]; achievements: any[]; photo: string };
        }
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
    const [searchParams] = useSearchParams();
    const type = searchParams.get("type");
    const value = searchParams.get("value");

    // Загружаем маленькое фото только если оно еще не загружено
    useEffect(() => {
        if (
            emp.id &&
            organizationId &&
            (!employeeData[emp.id] || employeeData[emp.id].small === undefined)
        ) {
            loadEmployeeData(emp.id, organizationId, "96");
        }
    }, [emp.id, organizationId, employeeData, loadEmployeeData]);

    // Получаем данные маленького фото
    const data = employeeData[emp.id]?.small;

    return (
        <EmployeeTableRowDiv
            key={emp.id}
            onClick={() => handleRowClick(emp.id, organizationId || "")}
            data-employee-id={emp.id}
        >
            <DivTableRow>
                {/* Фото */}
                <DivTableCell style={{ textAlign: "center" }}>
                    {(() => {
                        if (data === "loading") {
                            return (
                                <SpinnerCircular
                                    size={70}
                                    thickness={180}
                                    speed={180}
                                    color="rgba(29, 117, 187, 1)"
                                    secondaryColor="rgba(57, 69, 172, 0.1)"
                                />
                            );
                        }
                        if (data === "error" || data === undefined) {
                            return <PhotoObj photo={null} width="75px" />;
                        }

                        if (typeof data !== "string" && data !== undefined) {
                            return (
                                <PhotoObj photo={data?.photo} width="75px" />
                            );
                        }
                    })()}
                </DivTableCell>

                {/* ФИО и должность */}
                <CellWrapper
                    style={{
                        width: "30%",
                        minWidth: "200px",
                    }}
                >
                    {type === "fullName" ? (
                        <Highlighter
                            searchWords={[value || ""]}
                            autoEscape={true}
                            textToHighlight={`${emp.fullNameRus}`}
                            highlightStyle={{
                                backgroundColor: "#b2dff7",
                            }}
                        />
                    ) : (
                        <>{emp.fullNameRus}</>
                    )}
                    <PositionWrapper>
                        {type === "position" ? (
                            <Highlighter
                                searchWords={[value || ""]}
                                autoEscape={true}
                                textToHighlight={`${emp.positionTitle}`}
                                highlightStyle={{
                                    backgroundColor: "#b2dff7",
                                }}
                            />
                        ) : (
                            <>{emp.positionTitle}</>
                        )}
                    </PositionWrapper>
                </CellWrapper>

                {/* Статусы и награды */}
                <CellWrapper
                    style={{
                        flexDirection: "column",
                        width: "20%",
                    }}
                >
                    <div>
                        {(() => {
                            if (
                                data === "loading" ||
                                data === "error" ||
                                typeof data === "string" ||
                                data === undefined
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
                                    {data?.achievements &&
                                        data?.achievements.length > 0 &&
                                        data?.achievements.map(
                                            (achievement, i) => (
                                                <Icon
                                                    key={`reward-${i}`}
                                                    icon={achievement}
                                                    width="40px"
                                                    type="achievement"
                                                />
                                            )
                                        )}
                                </>
                            );
                        })()}
                    </div>
                </CellWrapper>

                {/* Телефон */}
                <CellWrapper
                    style={{
                        width: "25%",
                    }}
                >
                    {emp.telephoneNumberCorp ? (
                        <CustomEmailLink
                            href={`tel:${emp.telephoneNumberCorp}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {type === "phone" ? (
                                <Highlighter
                                    searchWords={[value || ""]}
                                    autoEscape={true}
                                    textToHighlight={`${emp.telephoneNumberCorp}`}
                                    highlightStyle={{
                                        backgroundColor: "#b2dff7",
                                    }}
                                />
                            ) : (
                                <>{emp.telephoneNumberCorp}</>
                            )}
                        </CustomEmailLink>
                    ) : (
                        "Не указан"
                    )}
                </CellWrapper>

                {/* Email */}
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
                                justifyContent: "end",
                            }}
                        >
                            <CustomEmailLink
                                href={`mailto:${emp.email}`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {type === "email" ? (
                                    <Highlighter
                                        searchWords={[value || ""]}
                                        autoEscape={true}
                                        textToHighlight={`${emp.email}`}
                                        highlightStyle={{
                                            backgroundColor: "#b2dff7",
                                        }}
                                    />
                                ) : (
                                    <>{emp.email}</>
                                )}
                            </CustomEmailLink>
                            <CustomCopyButton
                                size={13}
                                onClick={(e) => {
                                    handleCopyClick(emp.email!);
                                    e.stopPropagation();
                                }}
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
