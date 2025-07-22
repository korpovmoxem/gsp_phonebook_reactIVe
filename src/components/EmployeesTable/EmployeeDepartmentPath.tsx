import { getPathToNodeFast1 } from "../../utils/buildOrgIndex";
import { useOrgStore } from "../../store/organizationStore";
import { useNavigate } from "react-router-dom";
import {
    Crumb,
    EmployeeDepartmentPathWrapper,
    NonClickableCrumb,
    Separator,
} from "./StyledComponents";
import React from "react";

interface Props {
    departmentId: string;
    dept?: any;
    showOrganization?: boolean;
    organizationId?: string;
    organizationName?: string;
}

export const EmployeeDepartmentPath = ({
    departmentId,
    dept,
    showOrganization = false,
    organizationId,
    organizationName,
}: Props) => {
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
            {/* Только если showOrganization === true */}
            {showOrganization && organizationId && organizationName && (
                <>
                    <NonClickableCrumb>{organizationName}</NonClickableCrumb>
                    <Separator>|</Separator>
                </>
            )}
            {pathIds
                .filter((item) => isNaN(Number(item)))
                .map((id, index, arr) => {
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
                            {index < arr.length - 1 && <Separator>→</Separator>}
                        </React.Fragment>
                    );
                })}
        </EmployeeDepartmentPathWrapper>
    );
};
