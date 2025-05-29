/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useOrgStore } from "../store/organizationStore";
import { TreeNode } from "./TreeNode";
import { SidebarSkeleton } from "./SidebarSkeleton";
import styled from "styled-components";

const TreeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: auto;
    margin: 10px;
    padding: 10px;
    text-align: left;
    width: 300px;
    max-width: 300px;
    background: #e5f0f9;
    border-radius: 10px;
    overflow-y: auto;
    scrollbar-width: thin;
    scroll-behavior: smooth;
    scrollbar-color: gray transparent;
`;

export const OrgSidebar: React.FC = () => {
    const { organizations, fetchTree, selectedOrgId, selectOrg, isOrgLoading } =
        useOrgStore();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        fetchTree();
    }, []);

    useEffect(() => {
        const orgId = searchParams.get("organizationId");
        if (orgId) {
            selectOrg(orgId);
        }
    }, [searchParams]);

    const handleSelect = (id: string) => {
        setSearchParams({ organizationId: id });
    };

    if (isOrgLoading) return <SidebarSkeleton />;

    return (
        <TreeWrapper>
            <h3 style={{ marginLeft: "15px" }}>Организации</h3>
            {organizations.map((org, index) => (
                <TreeNode
                    key={`${org.ID}_${index}`}
                    node={org}
                    selectedId={selectedOrgId}
                    onSelect={handleSelect}
                />
            ))}
        </TreeWrapper>
    );
};
