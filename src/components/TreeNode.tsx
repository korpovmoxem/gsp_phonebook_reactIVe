import { useState, useEffect } from "react";
import { Organization } from "../types";
import styled from "styled-components";
import { SquareChevronRight, SquareChevronDown } from "lucide-react";

interface Props {
    node: Organization;
    selectedId: string | null;
    onSelect: (id: Organization) => void;
    expandedIds: string[];
}
const ChevronDownButton = styled(SquareChevronDown)`
    cursor: pointer;
    stroke: #1d75bb;
    &:hover {
        stroke: #1d74bb8a;
    }
`;

const ChevronRightButton = styled(SquareChevronRight)`
    cursor: pointer;
    stroke: #1d75bb;
    &:hover {
        stroke: #1d74bb8a;
    }
`;

export const ItemText = styled.span`
    user-select: none;
    margin-left: 10px;
    letter-spacing: 0.57;
    &:hover {
        color: #00000070;
    }
`;

const DEFAULT_EXPAND_ICON_SIZE = 18;

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
        <div
            style={{
                marginLeft: 10,
                marginTop: 5,
                // borderBottom: "1px dashed rgb(197, 197, 197)",
            }}
        >
            <div
                onClick={() => onSelect(node)}
                style={{
                    cursor: "pointer",
                    fontWeight: node.id === selectedId ? "bold" : "normal",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: "7px",
                    lineHeight: 1,
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
                            <ChevronDownButton
                                size={DEFAULT_EXPAND_ICON_SIZE}
                            />
                        ) : (
                            <ChevronRightButton
                                size={DEFAULT_EXPAND_ICON_SIZE}
                            />
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
