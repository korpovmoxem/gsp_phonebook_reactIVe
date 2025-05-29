import { useState } from "react";
import { Organization } from "../types";
import styled from "styled-components";
import { ChevronRight, ChevronDown } from "lucide-react";

interface Props {
    node: Organization;
    selectedId: string | null;
    onSelect: (id: string) => void;
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

export const TreeNode: React.FC<Props> = ({ node, selectedId, onSelect }) => {
    const [expanded, setExpanded] = useState(false);

    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedId === node.id;

    return (
        <div style={{ paddingLeft: 20 }}>
            <div
                style={{
                    cursor: "pointer",
                    fontWeight: isSelected ? "bold" : "normal",
                    display: "flex",
                }}
                onClick={() => onSelect(String(node.id))}
            >
                {hasChildren && (
                    <span
                        onClick={(e) => {
                            e.stopPropagation();
                            setExpanded(!expanded);
                        }}
                    >
                        {expanded ? (
                            <ChevronDownButton />
                        ) : (
                            <ChevronRightButton />
                        )}
                        &nbsp;
                    </span>
                )}
                <ItemText>{node.name}</ItemText>
            </div>
            {expanded &&
                hasChildren &&
                node.children.map((child, index) => (
                    <TreeNode
                        key={`${child.id}__${index}`}
                        node={child}
                        selectedId={selectedId}
                        onSelect={onSelect}
                    />
                ))}
        </div>
    );
};
