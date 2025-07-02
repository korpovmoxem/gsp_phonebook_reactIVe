import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { EmployeeDepartmentPath } from "./EmployeeDepartmentPath";
import { useNavigate } from "react-router-dom";
import { useOrgStore } from "../../store/organizationStore";

// Мокаем зависимости
jest.mock("../../store/organizationStore", () => ({
    useOrgStore: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));

jest.mock("../../utils/buildOrgIndex", () => ({
    getPathToNodeFast1: jest.fn(),
}));

jest.mock("./StyledComponents", () => ({
    EmployeeDepartmentPathWrapper: ({
        children,
    }: {
        children: React.ReactNode;
    }) => <div data-testid="path-wrapper">{children}</div>,
    Crumb: ({
        children,
        onClick,
    }: {
        children: React.ReactNode;
        onClick: () => void;
    }) => (
        <span data-testid="crumb" onClick={onClick}>
            {children}
        </span>
    ),
    Separator: ({ children }: { children: React.ReactNode }) => (
        <span data-testid="separator">{children}</span>
    ),
}));

describe("EmployeeDepartmentPath", () => {
    const mockSelectOrg = jest.fn();
    const mockNavigate = jest.fn();

    beforeEach(() => {
        (useOrgStore as unknown as jest.Mock).mockImplementation((selector) =>
            selector({
                orgMapId: new Map([
                    [
                        "dept1",
                        {
                            node: {
                                name: "IT Отдел",
                                organizationId: "org1",
                                treeId: "tree1",
                            },
                        },
                    ],
                    [
                        "dept2",
                        {
                            node: {
                                name: "Разработка",
                                organizationId: "org1",
                                treeId: "tree1",
                            },
                        },
                    ],
                    [
                        "dept3",
                        {
                            node: {
                                name: "Фронтенд",
                                organizationId: "org1",
                                treeId: "tree1",
                            },
                        },
                    ],
                ]),
                selectOrg: mockSelectOrg,
            })
        );

        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("не рендерится, если orgMapId пустой", () => {
        (useOrgStore as unknown as jest.Mock).mockImplementation((selector) =>
            selector({
                orgMapId: new Map(),
                selectOrg: mockSelectOrg,
            })
        );
        (
            require("../../utils/buildOrgIndex").getPathToNodeFast1 as jest.Mock
        ).mockReturnValue(["dept1", "dept2"]);

        render(<EmployeeDepartmentPath departmentId="dept2" />);

        expect(screen.queryByText(/IT Отдел/i)).not.toBeInTheDocument();
    });

    it("не рендерится, если путь равен null", () => {
        (
            require("../../utils/buildOrgIndex").getPathToNodeFast1 as jest.Mock
        ).mockReturnValueOnce(null);

        render(<EmployeeDepartmentPath departmentId="dept2" />);

        expect(screen.queryByTestId("path-wrapper")).not.toBeInTheDocument();
    });

    it("рендерит путь корректно", () => {
        (
            require("../../utils/buildOrgIndex").getPathToNodeFast1 as jest.Mock
        ).mockReturnValue(["dept3", "dept2", "dept1"]);

        render(<EmployeeDepartmentPath departmentId="dept3" />);

        expect(screen.getByText("IT Отдел")).toBeInTheDocument();
        expect(screen.getByText("Разработка")).toBeInTheDocument();
        expect(screen.getByText("Фронтенд")).toBeInTheDocument();

        expect(screen.getAllByTestId("separator")).toHaveLength(2); // → между крошками
    });

    it("вызывает selectOrg и navigate при клике на Crumb", () => {
        (
            require("../../utils/buildOrgIndex").getPathToNodeFast1 as jest.Mock
        ).mockReturnValue(["dept3", "dept2", "dept1"]);

        render(<EmployeeDepartmentPath departmentId="dept3" />);

        const crumb = screen.getByText("Разработка");

        fireEvent.click(crumb);

        expect(mockSelectOrg).toHaveBeenCalledWith("org1", "dept2");
        expect(mockNavigate).toHaveBeenCalledWith(
            "/?organizationId=org1&departmentId=dept2&treeId=tree1"
        );
    });
});
