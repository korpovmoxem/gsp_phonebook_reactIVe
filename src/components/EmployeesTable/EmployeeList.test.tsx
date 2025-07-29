import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import EmployeeList from "./EmployeeList";
import { useOrgStore } from "../../store/organizationStore";

jest.mock("../../store/organizationStore", () => ({
    useOrgStore: jest.fn(),
}));

jest.mock("../SearchBar/SearchBar", () => ({
    SearchBar: () => <div data-testid="search-bar">SearchBar</div>,
}));

jest.mock("./EmployeeDepartmentPath", () => ({
    EmployeeDepartmentPath: ({ departmentId }: { departmentId: string }) => (
        <div data-testid="employee-department-path">{departmentId}</div>
    ),
}));

jest.mock("react-toastify", () => ({
    toast: { info: jest.fn() },
}));

jest.mock("./EmployeeSkeleton", () => ({
    EmployeeSkeleton: () => <div data-testid="employee-skeleton" />,
}));

jest.mock("./EmployeeTableItem", () => ({
    __esModule: true,
    default: ({ emp, handleRowClick }: any) => (
        <div
            data-testid="employee-row"
            data-emp-id={emp.id}
            onClick={() => handleRowClick(emp.id, emp.organizationId)}
            role="button"
            tabIndex={0}
        >
            <span>{emp.fullNameRus}</span>
            <span>{emp.positionTitle}</span>
            <span>{emp.telephoneNumberCorp}</span>
            <span>{emp.email}</span>
        </div>
    ),
}));

jest.mock("react-virtuoso", () => ({
    GroupedVirtuoso: ({ groupCounts, groupContent, itemContent }: any) => (
        <div data-testid="mocked-virtuoso">
            {groupCounts.map((count: number, groupIndex: number) => (
                <div key={groupIndex}>
                    {groupContent(groupIndex)}
                    {Array.from({ length: count }).map((_, itemIndex) =>
                        itemContent(
                            groupCounts
                                .slice(0, groupIndex)
                                .reduce(
                                    (acc: number, cur: number) => acc + cur,
                                    0
                                ) + itemIndex
                        )
                    )}
                </div>
            ))}
        </div>
    ),
}));

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => jest.fn(),
}));

describe("EmployeeList", () => {
    const mockSetIsEmployeeInfoModalOpen = jest.fn();
    const mockFetchCurrentEmployeeInfo = jest.fn();

    const baseStore = {
        employees: {
            organizationId: "org1",
            organizationName: "IT Department",
            departmentId: "dept1",
            departmentName: "Development",
            employees: [
                {
                    id: "1",
                    fullNameRus: "Иванов Иван",
                    telephoneNumberCorp: "123456",
                    email: "ivanov@example.com",
                    departmentId: "dept1",
                    departmentName: "Development",
                    positionTitle: "Frontend Developer",
                    organizationId: "org1",
                    photo: null,
                },
            ],
            children: [],
        },
        isEmpLoading: false,
        employeesList: [],
        fetchEmployeesWithParams: jest.fn(),
        selectOrg: jest.fn(),
        isEmployeeInfoModalOpen: false,
        setIsEmployeeInfoModalOpen: mockSetIsEmployeeInfoModalOpen,
        fetchCurrentEmployeeInfo: mockFetchCurrentEmployeeInfo,
        loadEmployeeData: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useOrgStore as unknown as jest.Mock).mockImplementation((selector) =>
            selector(baseStore)
        );
    });

    it("рендерит список сотрудников", async () => {
        render(
            <MemoryRouter>
                <EmployeeList />
            </MemoryRouter>
        );

        await screen.findByTestId("mocked-virtuoso");
        const row = screen.getByTestId("employee-row");
        expect(row).toHaveTextContent("Иванов Иван");
        expect(row).toHaveTextContent("Frontend Developer");
    });

    it("открывает модалку по клику", async () => {
        render(
            <MemoryRouter>
                <EmployeeList />
            </MemoryRouter>
        );

        const row = await screen.findByTestId("employee-row");
        fireEvent.click(row);

        await waitFor(() => {
            expect(mockSetIsEmployeeInfoModalOpen).toHaveBeenCalledWith(true);
        });
        expect(mockFetchCurrentEmployeeInfo).toHaveBeenCalledWith("1", "org1");
    });

    it("показывает сообщение при пустых данных", () => {
        (useOrgStore as unknown as jest.Mock).mockImplementation((selector) =>
            selector({
                ...baseStore,
                employees: {
                    ...baseStore.employees,
                    employees: [],
                    children: [],
                },
                employeesList: [],
            })
        );

        render(
            <MemoryRouter>
                <EmployeeList />
            </MemoryRouter>
        );

        expect(screen.getByText(/не найдены/i)).toBeInTheDocument();
    });

    it("показывает skeleton при загрузке", () => {
        (useOrgStore as unknown as jest.Mock).mockImplementation((selector) =>
            selector({ ...baseStore, isEmpLoading: true })
        );

        render(
            <MemoryRouter>
                <EmployeeList />
            </MemoryRouter>
        );

        expect(screen.getByTestId("employee-skeleton")).toBeInTheDocument();
    });
});
