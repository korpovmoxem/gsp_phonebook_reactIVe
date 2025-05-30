import { useState, useEffect } from "react";
import { Organization } from "../types";
import styled from "styled-components";
import { ChevronRight, ChevronDown } from "lucide-react";

interface Props {
    node: Organization;
    selectedId: string | null;
    onSelect: (id: Organization) => void;
    expandedIds: string[];
}
const ChevronDownButton = styled(ChevronDown)`
    cursor: pointer;
    &:hover {
        color: #00000070;
    }
`;

const ChevronRightButton = styled(ChevronRight)`
    cursor: pointer;
    &:hover {
        color: #00000070;
    }
`;

const ItemText = styled.span`
    &:hover {
        color: #00000070;
    }
`;

export const TreeNode = ({
    node,
    selectedId,
    onSelect,
    expandedIds,
}: Props) => {
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        setExpanded(expandedIds.includes(node.id));
    }, [expandedIds]);

    return (
        <div style={{ marginLeft: 10 }}>
            <div
                onClick={() => onSelect(node)}
                style={{
                    cursor: "pointer",
                    fontWeight: node.id === selectedId ? "bold" : "normal",
                }}
            >
                {node.children.length > 0 && (
                    <span
                        onClick={(e) => {
                            e.stopPropagation();
                            setExpanded((prev) => !prev);
                        }}
                    >
                        {expanded ? (
                            <ChevronDownButton />
                        ) : (
                            <ChevronRightButton />
                        )}
                    </span>
                )}{" "}
                <ItemText>{node.name}</ItemText>
            </div>

            {expanded &&
                node.children.map((child, index) => (
                    <TreeNode
                        key={`${child.id}__${index}`}
                        node={child}
                        selectedId={selectedId}
                        onSelect={onSelect}
                        expandedIds={expandedIds}
                    />
                ))}
        </div>
    );
};
