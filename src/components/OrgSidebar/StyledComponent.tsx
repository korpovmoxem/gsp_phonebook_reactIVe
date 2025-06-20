import { styled } from "styled-components";
import { SquareChevronRight, SquareChevronDown } from "lucide-react";

export const OrgSidebarHeader = styled.h3`
    margin: 0 15px 10px;
    border-bottom: 0.5px solid #cfcfcf;
    line-height: 34px;
`;

export const TreeItemsWrapper = styled.div`
    margin-top: 10px;
`;

export const MainTreeWrapper = styled.div`
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

export const TreeWrapper = styled.div`
    max-height: 90%;
    overflow-y: auto;
    scrollbar-width: thin;
    scroll-behavior: smooth;
    scrollbar-color: rgb(199, 199, 199) transparent;
`;

export const CustomLink = styled.a`
    text-decoration: none;
    color: black;
`;

export const ChevronDownButton = styled(SquareChevronDown)`
    cursor: pointer;
    stroke: #1d75bb;
    &:hover {
        stroke: #1d74bb8a;
    }
`;

export const ChevronRightButton = styled(SquareChevronRight)`
    cursor: pointer;
    stroke: #1d75bb;
    &:hover {
        stroke: #1d74bb8a;
    }
`;

export const ItemText = styled.span`
    user-select: none;
    margin-left: 10px;
    letter-spacing: 0.2px;

    &:hover {
        color: #00000070;
    }
`;

export const ItemRowSelected = styled(ItemText)`
    background-color: #e6e7e9;
    border-radius: 10px;
    padding: 5px;
`;
