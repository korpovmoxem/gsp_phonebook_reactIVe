import { getPathToNodeFast } from "../utils/buildOrgIndex";
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
    const [open, isOpen] = useState(false);
    const { orgMap, selectOrg } = useOrgStore();
    const navigate = useNavigate();

    if (!orgMap.size || !departmentId) return null;

    const pathIds = getPathToNodeFast(departmentId, orgMap);
    if (!pathIds) return null;

    return (
        <div style={{ display: "flex", flexDirection: "row" }}>
            {pathIds.reverse().map((id, index) => {
                const node = orgMap.get(id)?.node;
                if (!node) return null;

                return (
                    <>
                        <Crumb
                            onClick={() => {
                                selectOrg(node.organizationId || id, id);
                                navigate(
                                    `/?organizationId=${
                                        node.organizationId || id
                                    }&departmentId=${id}`
                                );
                            }}
                        >
                            {node.name}
                        </Crumb>
                        {index < pathIds.length - 1 && <Separator>→</Separator>}
                    </>
                );
            })}
        </div>
    );
};
