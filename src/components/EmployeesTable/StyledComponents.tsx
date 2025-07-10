import { styled } from "styled-components";

export const EmployeeListWrapperMain = styled.div.attrs({
    datatype: "EmployeeListWrapperMain",
})`
    display: flex;
    flex-direction: column;
    margin: 10px;
    padding: 10px;
    background: ${(props) => props.theme.backgroundBlock};
    color: ${(props) => props.theme.mainTextColor};
    transition: all 0.5s ease;
    border-radius: 10px;
    height: calc(100% - 138px);

    @media (orientation: portrait) {
        height: calc(100% - 388px);
    }
`;

export const EmployeeListWrapperTable = styled.div.attrs({
    datatype: "EmployeeListWrapperTable",
})`
    overflow-y: auto;
    scrollbar-width: thin;
    scroll-behavior: smooth;
    scrollbar-color: rgb(199, 199, 199) transparent;
    overflow-x: clip;
`;
EmployeeListWrapperTable.displayName = `EmployeeListWrapperTable`;

export const EmployeeTableRowDiv = styled.div.attrs({
    datatype: "EmployeeTableRowDiv",
})`
    display: flex;
    font-family: Arial, sans-serif;
    align-content: center;
    padding: 6px 8px;
    min-height: 100px;
    border-bottom: 1px solid ${(props) => props.theme.backgroundSubHeader};
    align-items: center;
    cursor: pointer;
    &:hover {
        background-color: ${(props) => props.theme.backgroundRowHover};
        transition: all 0.5s ease;
    }
`;

export const EmployeeTableRow = styled.div.attrs({
    datatype: "EmployeeTableRow",
})`
    display: table;
    width: 100%;
    table-layout: fixed;
    color: inherit;
    font-family: Arial, sans-serif;
    align-content: center;
    padding: 6px 8px;
    min-height: 100px;
    border-bottom: 1px solid ${(props) => props.theme.backgroundSubHeader};
    align-items: center;
    cursor: pointer;
    &:hover {
        background-color: ${(props) => props.theme.backgroundRowHover};
        transition: all 0.5s ease;
    }
`;

export const EmployeeTableRowDivForExcel = styled.div.attrs({
    datatype: "EmployeeTableRowDivForExcel",
})`
    font-family: Arial, sans-serif;
    display: flex;
    padding: 6px 8px;
    min-height: 50px;
    border-bottom: 1px solid ${(props) => props.theme.backgroundSubHeader};
    align-items: center;
    &:hover {
        background-color: ${(props) => props.theme.backgroundRowHover};
        transition: all 0.5s ease;
    }
`;

export const Crumb = styled.span.attrs({
    datatype: "Crumb",
})`
    color: ${(props) => props.theme.subHeaderColor};
    transition: all 0.5s ease;
    cursor: pointer;
    margin-right: 4px;

    &:hover {
        text-decoration: underline;
    }
`;

export const Separator = styled.span.attrs({
    datatype: "Separator",
})`
    margin: 0 4px;
    align-content: center;
`;

export const FirstHeader = styled.div.attrs({
    datatype: "FirstHeader",
})`
    position: sticky;
    top: 0;
    background: #0d67a1;
    padding: 8px;
    font-weight: bold;
    border-bottom: 1px solid ${(props) => props.theme.background};
    z-index: 4;
    display: flex;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    color: white;
`;

export const EmptyHeadColumn = styled.div.attrs({
    datatype: "EmptyHeadColumn",
})`
    min-width: 80px;
    font-weight: 400;
`;

export const HeadColumn = styled.div.attrs({
    datatype: "HeadColumn",
})`
    flex: 1 1 0%;
    font-weight: 400;
`;

export const SecondHeader = styled.div.attrs({
    datatype: "SecondHeader",
})`
    position: sticky;
    top: 35px;
    background: ${(props) => props.theme.backgroundSubHeader};
    color: ${(props) => props.theme.subHeaderColor};
    transition: all 0.5s ease;
    padding: 8px;
    font-weight: bold;
    border-bottom: 1px solid ${(props) => props.theme.background};
    z-index: 3;
`;

export const ThirdHeader = styled.div.attrs({
    datatype: "ThirdHeader",
})`
    position: sticky;
    top: 69px;
    background: ${(props) => props.theme.backgroundSubHeader};
    transition: all 0.5s ease;
    padding: 6px;
    font-weight: 500;
    z-index: 2;
`;

export const CellWrapper = styled.div.attrs({
    datatype: "CellWrapper",
})`
    flex: 1;
    padding: 4px 8px;
    flex-wrap: wrap;
`;

export const PositionWrapper = styled.div.attrs({
    datatype: "PositionWrapper",
})`
    font-size: 14px;
    color: grey;
`;

export const EmployeeDepartmentPathWrapper = styled.div.attrs({
    datatype: "EmployeeDepartmentPathWrapper",
})`
    display: flex;
    flex-direction: row;
`;

export const EmployeeListWrapper = styled.div.attrs({
    datatype: "EmployeeListWrapper",
})`
    display: flex;
    flex-direction: column;
    flex: 5 5 0%;
    height: 100%;
    min-width: 570px;
`;
