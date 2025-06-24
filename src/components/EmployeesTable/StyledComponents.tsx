import { styled } from "styled-components";

export const EmployeeListWrapperMain = styled.div`
    display: flex;
    flex-direction: column;
    margin: 10px;
    padding: 10px;
    background: white;
    border-radius: 10px;
    height: calc(100% - 138px);
`;

export const EmployeeListWrapperTable = styled.div`
    overflow-y: auto;
    scrollbar-width: thin;
    scroll-behavior: smooth;
    scrollbar-color: rgb(199, 199, 199) transparent;
`;

export const EmployeeTableRowDiv = styled.div`
    font-family: Arial, sans-serif;
    display: flex;
    padding: 6px 8px;
    min-height: 100px;
    border-bottom: 1px solid rgb(235, 235, 235);
    align-items: center;
    cursor: pointer;
    &:hover {
        background-color: #f8f8ff;
    }
`;

export const Crumb = styled.span`
    // color: #1d75bb;
    color: #000000;
    cursor: pointer;
    margin-right: 4px;

    &:hover {
        text-decoration: underline;
    }
`;

export const Separator = styled.span`
    margin: 0 4px;
    align-content: center;
`;

export const FirstHeader = styled.div`
    position: sticky;
    top: 0;
    background: #0d67a1;
    padding: 8px;
    font-weight: bold;
    border-bottom: 1px solid rgb(255, 255, 255);
    z-index: 3;
    display: flex;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    color: white;
`;

export const EmptyHeadColumn = styled.div`
    min-width: 80px;
    font-weight: 400;
`;

export const HeadColumn = styled.div`
    flex: 1 1 0%;
    font-weight: 400;
`;

export const SecondHeader = styled.div`
    position: sticky;
    top: 35px;
    background: #f1f1f1;
    padding: 8px;
    font-weight: bold;
    border-bottom: 1px solid #fff;
    z-index: 3;
`;

export const ThirdHeader = styled.div`
    position: sticky;
    top: 69px;
    background: #f1f1f1;
    padding: 6px;
    font-weight: 500;
    z-index: 2;
`;

export const CellWrapper = styled.div`
    flex: 1;
    padding: 4px 8px;
`;

export const PositionWrapper = styled.div`
    font-size: 14px;
    color: grey;
`;

export const EmployeeDepartmentPathWrapper = styled.div`
    display: ;flex; 
    flex-direction: row;
`;
