import { getPathToNodeFast, getPathToNodeFast1 } from "../utils/buildOrgIndex";
import { useOrgStore } from "../store/organizationStore";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useState } from "react";

interface Props {
    departmentId: string;
}

const Crumb = styled.span`
    // color: #1d75bb;
    color: #000000;
    cursor: pointer;
    margin-right: 4px;

    &:hover {
        text-decoration: underline;
    }
`;

const Separator = styled.span`
    margin: 0 4px;
    align-content: center;
`;

export const EmployeeDepartmentPath = ({ departmentId }: Props) => {
    const orgMapId = useOrgStore((state) => state.orgMapId);
    const selectOrg = useOrgStore((state) => state.selectOrg);
    const navigate = useNavigate();

    if (!orgMapId.size || !departmentId) return null;

    const pathIds = departmentId
        ? getPathToNodeFast1(departmentId, orgMapId)
        : null;
    if (!pathIds) return null;
    // console.log(pathIds);
    return (
        <div style={{ display: "flex", flexDirection: "row" }}>
            {pathIds
                .reverse()
                // .slice(0, -1)
                .map((id, index) => {
                    const node = orgMapId.get(id)?.node;
                    console.log(node);
                    if (!node) return null;

                    return (
                        <>
                            <Crumb
                                onClick={() => {
                                    selectOrg(node.organizationId || id, id);
                                    navigate(
                                        `/?organizationId=${
                                            node.organizationId || id
                                        }&departmentId=${id}&treeId=${
                                            node.treeId
                                        }`
                                    );
                                }}
                            >
                                {node.name}
                            </Crumb>
                            {index < pathIds.length - 2 && (
                                <Separator>→</Separator>
                            )}
                        </>
                    );
                })}
        </div>
    );
};

// import { getPathToNodeFast } from "../utils/buildOrgIndex";
// import { useOrgStore } from "../store/organizationStore";
// import { useNavigate } from "react-router-dom";
// import styled from "styled-components";

// interface Props {
//     treeId: string;
// }

// const Crumb = styled.span`
//     color: #000000;
//     cursor: pointer;
//     margin-right: 4px;

//     &:hover {
//         text-decoration: underline;
//     }
// `;

// const Separator = styled.span`
//     margin: 0 4px;
// `;

// export const EmployeeDepartmentPath = ({ treeId }: Props) => {
//     const orgMap = useOrgStore((state) => state.orgMap);
//     const selectOrg = useOrgStore((state) => state.selectOrg);
//     const navigate = useNavigate();

//     // Защита: если нет карты или treeId — не рендерим ничего
//     if (!orgMap || !treeId) return null;

//     // Получаем путь от корня к узлу
//     const pathIds = getPathToNodeFast(treeId, orgMap);

//     // Если путь не найден — выходим
//     if (!pathIds || pathIds.length === 0) return null;

//     return (
//         <div
//             style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
//         >
//             {pathIds.map((id, index) => {
//                 const entry = orgMap.get(id);
//                 if (!entry) return null;

//                 const node = entry.node;
//                 const isLast = index === pathIds.length - 1;

//                 return (
//                     <span key={id}>
//                         <Crumb
//                             onClick={() => {
//                                 selectOrg(node.organizationId || node.id, id);
//                                 navigate(
//                                     `/?organizationId=${
//                                         node.organizationId || node.id
//                                     }&treeId=${id}`
//                                 );
//                             }}
//                         >
//                             {node.name}
//                         </Crumb>
//                         {!isLast && <Separator>→</Separator>}
//                     </span>
//                 );
//             })}
//         </div>
//     );
// };
