import { Organization } from '../types';

export type OrgMap = Map<string, { node: Organization; parentId: string | null }>;

export const buildOrgIndex = (nodes: Organization[]): OrgMap => {
    
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

export const getPathToNodeFast = (id: string, orgMap: OrgMap): string[] | null => {
    console.log('getPathToNodeFast')
    console.log(id)
    console.log(orgMap)

    const path: string[] = [];
    let currentId: string | null = id;

    while (currentId) {
        const entry = orgMap.get(currentId);
        console.log('entry')
        console.log(entry)
        if (!entry) return null;
        path.unshift(currentId);
        currentId = entry.parentId;
    }

    return path;
};