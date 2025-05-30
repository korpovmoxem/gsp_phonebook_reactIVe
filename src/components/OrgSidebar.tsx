/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useOrgStore } from "../store/organizationStore";
import { TreeNode } from "./TreeNode";
import { SidebarSkeleton } from "./SidebarSkeleton";
import styled from "styled-components";
import { getPathToNode } from "../utils/getPathToNode";

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
    const [expandedIds, setExpandedIds] = useState<string[]>([]);

    // Загружаем дерево при инициализации
    useEffect(() => {
        fetchTree();
    }, []);

    // Следим за организациями и параметром в URL
    useEffect(() => {
        const id = searchParams.get("organizationId");
        if (!id || organizations.length === 0) return;

        selectOrg(id); // загрузка сотрудников

        const path = getPathToNode(organizations, id);
        if (path) setExpandedIds(path);
    }, [searchParams, organizations]);

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
                        expandedIds={expandedIds}
                    />
                ))}
            </TreeWrapper>
        </MainTreeWrapper>
    );
};
