/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useOrgStore } from "../store/organizationStore";
import { TreeNode } from "./TreeNode";
import { SidebarSkeleton } from "./SidebarSkeleton";
import styled from "styled-components";

const MainTreeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: auto;
    margin: 10px;
    padding: 10px;
    text-align: left;
    width: 300px;
    max-width: 300px;
    background: rgb(215, 236, 248);
    border-radius: 10px;
`;

const TreeWrapper = styled.div`
    max-height: 90%;
    overflow-y: auto;
    scrollbar-width: thin;
    scroll-behavior: smooth;
    scrollbar-color: #1d75bb transparent;
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
        <MainTreeWrapper>
            <h3 style={{ marginLeft: "15px" }}>Организации</h3>
            <TreeWrapper>
                {organizations.map((org, index) => (
                    <TreeNode
                        key={`${org.id}_${index}`}
                        node={org}
                        selectedId={selectedOrgId}
                        onSelect={handleSelect}
                    />
                ))}
            </TreeWrapper>
        </MainTreeWrapper>
    );
};
