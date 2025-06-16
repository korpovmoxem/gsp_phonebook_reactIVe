import { Organization } from '../types';

export const getPathToNode = (
  nodes: Organization[],
  targetId: string,
  path: string[] = []
): string[] | null => {
  for (const node of nodes) {
    const currentPath = [...path, node.id];

    if (node.id === targetId) {
      return currentPath;
    }

    if (node.children.length > 0) {
      const childPath = getPathToNode(node.children, targetId, currentPath);
      if (childPath) return childPath;
    }
  }

  return null;
};