import { getPathToNodeFast1 } from "../../utils/buildOrgIndex";
import { useOrgStore } from "../../store/organizationStore";
import { useNavigate } from "react-router-dom";
import {
    Crumb,
    EmployeeDepartmentPathWrapper,
    Separator,
} from "./StyledComponents";
import React from "react";

interface Props {
    departmentId: string;
    dept?: any;
}

export const EmployeeDepartmentPath = ({ departmentId, dept }: Props) => {
    const orgMapId = useOrgStore((state) => state.orgMapId);
    const selectOrg = useOrgStore((state) => state.selectOrg);
    const navigate = useNavigate();

    const pathIds = departmentId
        ? getPathToNodeFast1(departmentId, orgMapId)
        : null;

    if (!orgMapId.size || !departmentId) return null;
    if (!pathIds) return null;

    return (
        <EmployeeDepartmentPathWrapper>
            {pathIds
                .filter((item) => isNaN(Number(item)))
                .reverse()
                .map((id, index) => {
                    const node = orgMapId.get(id)?.node;
                    if (!node) return null;

                    return (
                        <React.Fragment key={`${id}_${index}`}>
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
                            {index <
                                pathIds.filter((item) => isNaN(Number(item)))
                                    .length -
                                    1 && <Separator>→</Separator>}
                        </React.Fragment>
                    );
                })}
        </EmployeeDepartmentPathWrapper>
    );
};
