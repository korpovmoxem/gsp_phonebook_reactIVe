/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useOrgStore } from "../store/organizationStore";
import { ItemText, TreeNode } from "./TreeNode";
import { SidebarSkeleton } from "./SidebarSkeleton";
import styled from "styled-components";
import {
    buildOrgIndex,
    getPathToNodeFast,
    OrgMap,
} from "../utils/buildOrgIndex";
import { toast } from "react-toastify";
import { Organization } from "../types";

const MainTreeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: auto;
    margin: 10px;
    padding: 10px;
    text-align: left;
    width: 300px;
    max-width: 300px;
    background: white;
    border-radius: 10px;
`;

const TreeWrapper = styled.div`
    max-height: 90%;
    overflow-y: auto;
    scrollbar-width: thin;
    scroll-behavior: smooth;
    scrollbar-color: rgb(199, 199, 199) transparent;
`;

const CustomLink = styled.a`
    text-decoration: none;
    color: black;
`;

export const OrgSidebar: React.FC = () => {
    const {
        organizations,
        externalOrganizations,
        selectedOrgId,
        fetchTree,
        fetchExternalTree,
        selectOrg,
        isOrgLoading,
        isExternalOrgLoading,
    } = useOrgStore();
    const [searchParams, setSearchParams] = useSearchParams();
    const [expandedIds, setExpandedIds] = useState<string[]>([]);
    const [orgMap, setOrgMap] = useState<OrgMap>(new Map());

    const navigate = useNavigate();

    // Загружаем дерево
    useEffect(() => {
        fetchTree();
        fetchExternalTree();
    }, []);

    // Строим индекс после загрузки
    useEffect(() => {
        if (organizations.length > 0) {
            const map = buildOrgIndex(organizations);
            setOrgMap(map);
        }
    }, [organizations]);

    // Выделение и раскрытие по ID из URL
    useEffect(() => {
        const orgId = searchParams.get("organizationId");
        const depId = searchParams.get("departmentId");
        const id = depId || orgId;
        console.log("++++++++");
        console.log(orgId);
        console.log(depId);
        console.log(orgMap);
        if (!orgId || orgMap.size === 0) return;

        if (depId === null) {
        } else {
            if (!orgMap.has(orgId)) {
                console.warn(`Организация с ID ${orgId} не найдена.`);
                searchParams.delete("organizationId");
                navigate(
                    { pathname: "/", search: searchParams.toString() },
                    { replace: true }
                );
                toast.error("Проверьте правильность написания ссылки", {
                    position: "top-right",
                });
                return;
            } else if (!orgMap.has(depId)) {
                console.warn(`Департамент с ID ${orgId} не найден.`);
                searchParams.delete("departmentId");
                navigate(
                    { pathname: "/", search: searchParams.toString() },
                    { replace: true }
                );
                toast.error("Проверьте правильность написания ссылки", {
                    position: "top-right",
                });
            }
        }

        selectOrg(orgId, depId);
        const path = id ? getPathToNodeFast(id, orgMap) : null;
        if (path) setExpandedIds(path);
    }, [searchParams, orgMap]);

    const handleSelect = (node: Organization) => {
        console.log(node);
        if (node.root) {
            setSearchParams({ organizationId: node.id });
        } else {
            setSearchParams({
                organizationId: node.organizationId || "",
                departmentId: node.id,
            });
        }
        // setSearchParams({ organizationId: id });
    };

    // if (isOrgLoading) return <SidebarSkeleton />;

    return (
        <MainTreeWrapper>
            {!isOrgLoading ? (
                <>
                    <h3 style={{ margin: "0 15px 10px" }}>Организации</h3>
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
                </>
            ) : (
                <SidebarSkeleton title="Организации" />
            )}
            {!isExternalOrgLoading ? (
                <>
                    <h3 style={{ margin: "0 15px 10px" }}>
                        Внешние организации (?)
                    </h3>
                    {externalOrganizations.map((item) => (
                        <CustomLink
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            key={item.id}
                        >
                            <ItemText>{item.name}</ItemText>
                        </CustomLink>
                    ))}
                </>
            ) : (
                <SidebarSkeleton title="Внешние организации(?)" />
            )}
        </MainTreeWrapper>
    );
};
