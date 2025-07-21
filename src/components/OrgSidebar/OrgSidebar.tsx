// /* eslint-disable react-hooks/exhaustive-deps */
// import { useEffect, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { useOrgStore } from "../../store/organizationStore";
// import { TreeNode } from "./TreeNode";

// import {
//     getPathToNodeFast,
//     getPathToNodeFast1,
// } from "../../utils/buildOrgIndex";
// import { toast } from "react-toastify";
// import { Organization } from "../../types";
// import { ExternalLink } from "lucide-react";
// import { SidebarSkeleton } from "./SidebarSkeleton";
// import {
//     CustomLink,
//     ItemText,
//     MainTreeWrapper,
//     OrgSidebarHeader,
//     TreeItemsWrapper,
//     TreeWrapper,
// } from "./StyledComponent";

// export const OrgSidebar: React.FC = () => {
//     const organizations = useOrgStore((state) => state.organizations);
//     const externalOrganizations = useOrgStore(
//         (state) => state.externalOrganizations
//     );
//     const selectedOrgId = useOrgStore((state) => state.selectedOrgId);
//     const fetchTree = useOrgStore((state) => state.fetchTree);
//     const fetchExternalTree = useOrgStore((state) => state.fetchExternalTree);
//     const selectOrg = useOrgStore((state) => state.selectOrg);
//     const isOrgLoading = useOrgStore((state) => state.isOrgLoading);
//     const isExternalOrgLoading = useOrgStore(
//         (state) => state.isExternalOrgLoading
//     );
//     const orgMap = useOrgStore((state) => state.orgMap);

//     const [searchParams, setSearchParams] = useSearchParams();
//     const [expandedIds, setExpandedIds] = useState<string[]>([]);

//     const navigate = useNavigate();
//     // Загружаем дерево
//     useEffect(() => {
//         fetchTree();
//         fetchExternalTree();
//     }, []);

//     // Выделение и раскрытие по ID из URL
//     useEffect(() => {
//         const orgId = searchParams.get("organizationId");
//         const depId = searchParams.get("departmentId");
//         const treeId = searchParams.get("treeId");

//         if (!orgMap || orgMap.size === 0) return;

//         // Приоритет: treeId > depId > orgId
//         let id = depId || orgId;
//         if (!id) return;

//         // Найти путь по treeId (или другому ID)
//         const path = treeId
//             ? getPathToNodeFast(treeId, orgMap)
//             : getPathToNodeFast1(id, orgMap);

//         if (!path) {
//             console.warn(`Элемент с treeId=${treeId} не найден.`);
//             toast.error("Проверьте правильность ссылки", {
//                 position: "top-right",
//             });

//             // Очистить параметры
//             const newSearchParams = new URLSearchParams(searchParams);
//             newSearchParams.delete("organizationId");
//             newSearchParams.delete("departmentId");
//             newSearchParams.delete("treeId");
//             navigate(
//                 { pathname: "/", search: newSearchParams.toString() },
//                 { replace: true }
//             );
//             return;
//         }

//         // Раскрыть путь
//         setExpandedIds(path);

//         // Выбрать организацию/отдел
//         if (treeId && orgId) {
//             selectOrg(orgId, depId);
//         }
//     }, [searchParams, orgMap]);

//     // Запускаем поиск сотрудников только для дочерних элементов. Руты нужны только для раскрытия
//     const handleSelect = (node: Organization) => {
//         if (!node.root) {
//             setSearchParams({
//                 organizationId: node.organizationId || "",
//                 departmentId: node.id,
//                 treeId: node.treeId,
//             });
//         }

//         // Открываем/закрываем только этот узел
//         setExpandedIds((prev) => {
//             const isAlreadyExpanded = prev.includes(node.treeId);
//             if (isAlreadyExpanded) {
//                 return prev.filter((id) => id !== node.treeId);
//             } else {
//                 return [node.treeId];
//             }
//         });
//     };

//     return (
//         <MainTreeWrapper>
//             {!isOrgLoading ? (
//                 <>
//                     <OrgSidebarHeader>Организации</OrgSidebarHeader>
//                     <TreeWrapper>
//                         {organizations.map((org, index) => (
//                             <TreeNode
//                                 key={`${org.id}_${index}`}
//                                 node={org}
//                                 selectedId={selectedOrgId}
//                                 onSelect={handleSelect}
//                                 expandedIds={expandedIds}
//                             />
//                         ))}
//                         {!isExternalOrgLoading ? (
//                             <TreeItemsWrapper style={{ marginTop: "15px" }}>
//                                 {externalOrganizations.map((item) => (
//                                     <div
//                                         key={item.id}
//                                         style={{ marginTop: "15px" }}
//                                     >
//                                         <CustomLink
//                                             href={item.url}
//                                             target="_blank"
//                                             rel="noreferrer"
//                                         >
//                                             <ExternalLink
//                                                 size={15}
//                                                 stroke="#1d75bb"
//                                             />
//                                             <ItemText>{item.name}</ItemText>
//                                         </CustomLink>
//                                     </div>
//                                 ))}
//                             </TreeItemsWrapper>
//                         ) : (
//                             <SidebarSkeleton />
//                         )}
//                     </TreeWrapper>
//                 </>
//             ) : (
//                 <SidebarSkeleton title="Организации" />
//             )}
//         </MainTreeWrapper>
//     );
// };


import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { useOrgStore } from "../../store/organizationStore";
import { TreeNode } from "./TreeNode";
import {
    getPathToNodeFast,
    getPathToNodeFast1,
} from "../../utils/buildOrgIndex";
import { toast } from "react-toastify";
import { Organization } from "../../types";
import { ExternalLink } from "lucide-react";
import { SidebarSkeleton } from "./SidebarSkeleton";
import {
    CustomLink,
    ItemText,
    MainTreeWrapper,
    OrgSidebarHeader,
    TreeItemsWrapper,
    TreeWrapper,
} from "./StyledComponent";

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
    const orgMap = useOrgStore((state) => state.orgMap);

    const [searchParams, setSearchParams] = useSearchParams();
    const [expandedIds, setExpandedIds] = useState<string[]>([]);
    const location = useLocation();

    // Загружаем дерево
    useEffect(() => {
        fetchTree();
        fetchExternalTree();
    }, []);

    // Если пусто (переход на /) — ставим дефолтные значения и делаем setSearchParams
    useEffect(() => {
        if (
            (location.pathname === "/" && searchParams.toString() === "") ||
            (!searchParams.get("organizationId") && !searchParams.get("departmentId"))
        ) {
            setSearchParams({
                organizationId: "7842155505",
                departmentId: "9c685cfe-e9a0-11e8-90f2-0050569026ba",
                treeId: "3",
            }, { replace: true });
            return;
        }
    }, [location.pathname, searchParams, setSearchParams]);

    // Когда orgMap загружен или searchParams изменились — раскрываем и выбираем
    useEffect(() => {
        if (!orgMap || orgMap.size === 0) return;

        const orgId = searchParams.get("organizationId");
        const depId = searchParams.get("departmentId");
        const treeId = searchParams.get("treeId");

        let id = depId || orgId;
        if (!id) return;

        // path — это путь из id (или treeId) к корню
        const path = treeId
            ? getPathToNodeFast(treeId, orgMap)
            : getPathToNodeFast1(id, orgMap);

        if (!path) {
            toast.error("Проверьте правильность ссылки", {
                position: "top-right",
                toastId: "invalid-link",
            });
            setSearchParams({}, { replace: true });
            return;
        }

        setExpandedIds(path);

        // выбрать организацию/отдел (selectOrg)
        if (orgId) {
            selectOrg(orgId, depId ?? null);
        }
    }, [searchParams, orgMap]);

    // Логика выбора элемента дерева
    const handleSelect = (node: Organization) => {
        if (!node.root) {
            setSearchParams({
                organizationId: node.organizationId || "",
                departmentId: node.id,
                treeId: node.treeId,
            });
        }
        setExpandedIds((prev) => {
            const isAlreadyExpanded = prev.includes(node.treeId);
            if (isAlreadyExpanded) {
                return prev.filter((id) => id !== node.treeId);
            } else {
                return [node.treeId];
            }
        });
    };

    return (
        <MainTreeWrapper>
            {!isOrgLoading ? (
                <>
                    <OrgSidebarHeader>Организации</OrgSidebarHeader>
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
                            <TreeItemsWrapper style={{ marginTop: "15px" }}>
                                {externalOrganizations.map((item) => (
                                    <div
                                        key={item.id}
                                        style={{ marginTop: "15px" }}
                                    >
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
                            </TreeItemsWrapper>
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
