import { Organization } from '../types';

export type OrgMap = Map<string, { node: Organization; parentId: string | null }>;

export const buildOrgIndexTreeId = (nodes: Organization[]): OrgMap => {
    
    const map: OrgMap = new Map();

    const traverse = (items: Organization[], parentId: string | null) => {
        for (const item of items) {
            map.set(item.treeId, { node: item, parentId });
            if (item.children?.length > 0) {
                traverse(item.children, item.treeId);
            }
        }
    };

    traverse(nodes, null);
    return map;
};

export const buildOrgIndexId = (nodes: Organization[]): OrgMap => {
    
    const map: OrgMap = new Map();

    const traverse = (items: Organization[], parentId: string | null) => {
        for (const item of items) {
            map.set(item.id, { node: item, parentId });
            if (item.children?.length > 0) {
                traverse(item.children, item.id);
            }
        }
    };

    traverse(nodes, null);
    return map;
};

export const getPathToNodeFast1 = (id: string, orgMapId: OrgMap): string[] | null => {


    const path: string[] = [];
    let currentId: string | null = id;

    while (currentId) {
        const entry = orgMapId.get(currentId);

        if (!entry) return null;
        path.unshift(currentId);
        currentId = entry.parentId;
    }


    return path;
};

export const getPathToNodeFast = (
  targetTreeId: string,
  orgMap: OrgMap
): string[] | null => {
  const path: string[] = [];
  let currentId: string | null = targetTreeId;

  while (currentId) {
    const entry = orgMap.get(currentId);
    if (!entry) return null;

    path.unshift(currentId);

    currentId = entry.parentId;
  }

  return path;
};