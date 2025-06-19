/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useOrgStore } from "../store/organizationStore";
import { ItemText, TreeNode } from "./TreeNode";
import { SidebarSkeleton } from "./SidebarSkeleton";
import styled from "styled-components";
import {
    buildOrgIndexId,
    buildOrgIndexTreeId,
    getPathToNodeFast,
    getPathToNodeFast1,
    OrgMap,
} from "../utils/buildOrgIndex";
import { toast } from "react-toastify";
import { Organization } from "../types";
import { ExternalLink } from "lucide-react";

const MainTreeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: auto;
    margin: 10px;
    padding: 10px;
    text-align: left;
    width: 400px;
    max-width: 400px;
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
    const organizations = useOrgStore((state) => state.organizations);
    const externalOrganizations = useOrgStore(
        (state) => state.externalOrganizations
    );
    const selectedOrgId = useOrgStore((state) => state.selectedOrgId);
    const fetchTree = useOrgStore((state) => state.fetchTree);
    const fetchExternalTree = useOrgStore((state) => state.fetchExternalTree);
    const selectOrg = useOrgStore((state) => state.selectOrg);
    const isOrgLoading = useOrgStore((state) => state.isOrgLoading);
    const isExternalOrgLoading = useOrgStore(
        (state) => state.isExternalOrgLoading
    );
    const [searchParams, setSearchParams] = useSearchParams();
    const [expandedIds, setExpandedIds] = useState<string[]>([]);
    const [orgMap, setOrgMap] = useState<OrgMap>(new Map());

    const navigate = useNavigate();
    const treeId = searchParams.get("treeId");
    // Загружаем дерево
    useEffect(() => {
        fetchTree();
        fetchExternalTree();
    }, []);

    // Строим индекс после загрузки
    useEffect(() => {
        if (organizations.length > 0) {
            const map = treeId
                ? buildOrgIndexTreeId(organizations)
                : buildOrgIndexId(organizations);
            setOrgMap(map);
        }
    }, [organizations, treeId]);

    // Выделение и раскрытие по ID из URL
    useEffect(() => {
        const orgId = searchParams.get("organizationId");
        const depId = searchParams.get("departmentId");
        const treeId = searchParams.get("treeId");

        if (!orgMap || orgMap.size === 0) return;

        // Приоритет: treeId > depId > orgId
        let id = depId || orgId;
        if (!id) return;

        // Найти путь по treeId (или другому ID)
        const path = treeId
            ? getPathToNodeFast(treeId, buildOrgIndexTreeId(organizations))
            : getPathToNodeFast1(id, orgMap);

        if (!path) {
            console.warn(`Элемент с treeId=${treeId} не найден.`);
            toast.error("Проверьте правильность ссылки", {
                position: "top-right",
            });

            // Очистить параметры
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.delete("organizationId");
            newSearchParams.delete("departmentId");
            newSearchParams.delete("treeId");
            navigate(
                { pathname: "/", search: newSearchParams.toString() },
                { replace: true }
            );
            return;
        }

        // Раскрыть путь
        setExpandedIds(path);

        // Выбрать организацию/отдел
        if (treeId && orgId) {
            selectOrg(orgId, depId);
        }
    }, [searchParams, orgMap]);

    const handleSelect = (node: Organization) => {
        if (node.root) {
            setSearchParams({ organizationId: node.id, treeId: node.treeId });
        } else {
            setSearchParams({
                organizationId: node.organizationId || "",
                departmentId: node.id,
                treeId: node.treeId,
            });
        }
    };

    return (
        <MainTreeWrapper>
            {!isOrgLoading ? (
                <>
                    <h3
                        style={{
                            margin: "0 15px 10px",
                            borderBottom: "0.5px solid #cfcfcf",
                            lineHeight: "34px",
                        }}
                    >
                        Организации
                    </h3>
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
                        {!isExternalOrgLoading ? (
                            <div style={{ marginTop: "10px" }}>
                                {externalOrganizations.map((item) => (
                                    <div key={item.id}>
                                        <CustomLink
                                            href={item.url}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <ExternalLink
                                                size={15}
                                                stroke="#1d75bb"
                                            />
                                            <ItemText>{item.name}</ItemText>
                                        </CustomLink>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <SidebarSkeleton />
                        )}
                    </TreeWrapper>
                </>
            ) : (
                <SidebarSkeleton title="Организации" />
            )}
        </MainTreeWrapper>
    );
};
