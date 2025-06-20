import {
    getPathToNodeFast,
    getPathToNodeFast1,
} from "../../utils/buildOrgIndex";
import { useOrgStore } from "../../store/organizationStore";
import { useNavigate } from "react-router-dom";
import {
    Crumb,
    EmployeeDepartmentPathWrapper,
    Separator,
} from "./StyledComponents";

interface Props {
    departmentId: string;
}

export const EmployeeDepartmentPath = ({ departmentId }: Props) => {
    const orgMapId = useOrgStore((state) => state.orgMapId);
    const selectOrg = useOrgStore((state) => state.selectOrg);
    const navigate = useNavigate();

    if (!orgMapId.size || !departmentId) return null;

    const pathIds = departmentId
        ? getPathToNodeFast1(departmentId, orgMapId)
        : null;
    if (!pathIds) return null;

    return (
        <EmployeeDepartmentPathWrapper>
            {pathIds
                .reverse()
                .slice(0, -1)
                .reverse()
                .map((id, index) => {
                    const node = orgMapId.get(id)?.node;
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
        </EmployeeDepartmentPathWrapper>
    );
};
