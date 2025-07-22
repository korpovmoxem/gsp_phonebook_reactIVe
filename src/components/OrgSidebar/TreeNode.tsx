// import { useState, useEffect, useRef } from "react";
// import { Organization } from "../../types";
// import styled from "styled-components";
// import {
//     ChevronDownButton,
//     ChevronRightButton,
//     ItemText,
//     SquareDotButton,
// } from "./StyledComponent";

// interface Props {
//     node: Organization;
//     selectedId: string | null;
//     onSelect: (id: Organization) => void;
//     expandedIds: string[];
// }

// interface RowProps {
//     selected?: boolean;
// }

// const ItemRow = styled.div<RowProps>`
//     cursor: pointer;
//     fontweight: normal;
//     display: flex;
//     flexdirection: row;
//     alignitems: center;
//     margintop: 7px;
//     lineheight: 1;
//     ${({ selected, theme }) =>
//         selected &&
//         `
//         // background-color: #e6e7e9;
//         background-color: ${theme.backgroundSubHeader};
//         border-radius: 10px;
//         margin-left: -5px;
//         padding: 5px 5px 5px 5px;
//     `}
// `;

// const DEFAULT_EXPAND_ICON_SIZE = 18;

// export const TreeNode = ({
//     node,
//     selectedId,
//     onSelect,
//     expandedIds,
// }: Props) => {
//     const [expanded, setExpanded] = useState(false);
//     const itemRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         // Проверяем treeId, а не id
//         setExpanded(expandedIds.includes(node.treeId));
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [expandedIds]);

//     useEffect(() => {
//         if (node.id === selectedId && itemRef.current) {
//             itemRef.current.scrollIntoView({
//                 behavior: "smooth",
//                 block: "center",
//             });
//         }
//     }, [selectedId, node.id]);

//     return (
//         <div
//             style={{
//                 marginLeft: 10,
//                 marginTop: 5,
//             }}
//             ref={node.id === selectedId ? itemRef : null}
//         >
// <ItemRow
//     onClick={() => {
//         node.id === null
//             ? setExpanded((prev) => !prev)
//             : onSelect(node);
//     }}
//     style={{
//         cursor: "pointer",
//         fontWeight:
//             node.id === selectedId && selectedId !== null
//                 ? "bold"
//                 : "normal",
//         display: "flex",
//         flexDirection: "row",
//         alignItems: "center",
//         marginTop: "15px",
//         lineHeight: 1,
//     }}
//     selected={node.id === selectedId && selectedId !== null}
// >
//     {node.children.length > 0 ? (
//         <span
//             onClick={(e) => {
//                 e.stopPropagation();
//                 setExpanded((prev) => !prev);
//             }}
//         >
//             {expanded ? (
//                 <ChevronDownButton
//                     size={DEFAULT_EXPAND_ICON_SIZE}
//                 />
//             ) : (
//                 <ChevronRightButton
//                     size={DEFAULT_EXPAND_ICON_SIZE}
//                 />
//             )}
//         </span>
//     ) : (
//         <span>
//             <SquareDotButton size={DEFAULT_EXPAND_ICON_SIZE} />
//         </span>
//     )}

//     <ItemText>{node.name}</ItemText>
// </ItemRow>

//             {expanded &&
//                 node.children.map((child, index) => (
//                     <TreeNode
//                         key={`${child.id}_${child.treeId}_${index}`}
//                         node={child}
//                         selectedId={selectedId}
//                         onSelect={onSelect}
//                         expandedIds={expandedIds}
//                     />
//                 ))}
//         </div>
//     );
// };

import React, { useEffect, useRef, useState } from "react";
import {
    ChevronDownButton,
    ChevronRightButton,
    ItemRowSelected,
    ItemText,
    SquareDotButton,
} from "./StyledComponent";
import { Organization } from "../../types";
import { styled } from "styled-components";
interface RowProps {
    selected?: boolean;
}
interface Props {
    node: Organization;
    selectedId: string | null;
    onSelect: (node: Organization) => void;
    expandedIds: string[];
}

const ItemRow = styled.div<RowProps>`
    cursor: pointer;
    fontweight: normal;
    display: flex;
    flexdirection: row;
    alignitems: center;
    margintop: 7px;
    lineheight: 1;
    ${({ selected, theme }) =>
        selected &&
        `
        // background-color: #e6e7e9;
        background-color: ${theme.backgroundSubHeader};
        border-radius: 10px;
        margin-left: -5px;
        padding: 5px 5px 5px 5px;
    `}
`;
const DEFAULT_EXPAND_ICON_SIZE = 18;

export const TreeNode = ({
    node,
    selectedId,
    onSelect,
    expandedIds,
}: Props) => {
    const [expanded, setExpanded] = useState(false);
    const itemRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setExpanded(expandedIds.includes(node.treeId));
    }, [expandedIds]);

    useEffect(() => {
        if (node.id === selectedId && itemRef.current && selectedId !== null) {
            itemRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [selectedId, node.id]);

    return (
        <div
            style={{
                marginLeft: 10,
                marginTop: 5,
            }}
            ref={node.id === selectedId ? itemRef : null}
        >
            <ItemRow
                onClick={() => {
                    node.id === null
                        ? setExpanded((prev) => !prev)
                        : onSelect(node);
                }}
                style={{
                    cursor: "pointer",
                    fontWeight:
                        node.id === selectedId && selectedId !== null
                            ? "bold"
                            : "normal",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: "15px",
                    lineHeight: 1,
                }}
                selected={node.id === selectedId && selectedId !== null}
            >
                {node.children.length > 0 ? (
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
                ) : (
                    <span>
                        <SquareDotButton size={DEFAULT_EXPAND_ICON_SIZE} />
                    </span>
                )}

                <ItemText>{node.name}</ItemText>
            </ItemRow>
            {expanded &&
                node.children &&
                node.children.map((child) => (
                    <TreeNode
                        key={child.id}
                        node={child}
                        selectedId={selectedId}
                        onSelect={onSelect}
                        expandedIds={expandedIds}
                    />
                ))}
        </div>
    );
};
