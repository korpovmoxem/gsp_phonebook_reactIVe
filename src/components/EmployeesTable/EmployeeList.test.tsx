import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { EmployeeList } from "./EmployeeList";
import { useOrgStore } from "../../store/organizationStore";

// 🔥 Мокаем зависимости
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
    toast: {
        info: jest.fn(),
    },
}));

jest.mock("./EmployeeSkeleton", () => ({
    EmployeeSkeleton: () => <div data-testid="employee-skeleton" />,
}));

// 🔥 Мокаем EmployeeTableItem
jest.mock("./EmployeeTableItem", () => ({
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

// 🔥 Мокаем react-virtuoso — автоматически из __mocks__
jest.mock("react-virtuoso");

// 🔥 Мокаем useNavigate
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => jest.fn(),
}));

describe("EmployeeList", () => {
    const mockSetIsEmployeeInfoModalOpen = jest.fn();
    const mockFetchCurrentEmployeeInfo = jest.fn();
    const mockLoadEmployeeData = jest.fn();

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
        loadEmployeeData: mockLoadEmployeeData,
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

        // Ждём появления хотя бы одного элемента
        await screen.findByTestId("mocked-virtuoso");

        // Теперь ищем строку сотрудника
        const row = screen.getByTestId("employee-row");
        expect(row).toHaveTextContent("Иванов Иван");
        expect(row).toHaveTextContent("Frontend Developer");
        expect(row).toHaveTextContent("123456");
        expect(row).toHaveTextContent("ivanov@example.com");
    });

    it("переходит к модалке сотрудника при клике на строку", async () => {
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

        await waitFor(() => {
            expect(mockFetchCurrentEmployeeInfo).toHaveBeenCalledWith(
                "1",
                "org1"
            );
        });

        await waitFor(() => {
            expect(mockLoadEmployeeData).toHaveBeenCalledWith(
                "1",
                "org1",
                "512"
            );
        });
    });

    it('рендерит сообщение "Не найдено" при отсутствии результатов', () => {
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

        expect(
            screen.getByText(/По заданным критериям сотрудники не найдены/i)
        ).toBeInTheDocument();
    });

    it("рендерит skeleton при загрузке", () => {
        (useOrgStore as unknown as jest.Mock).mockImplementation((selector) =>
            selector({
                ...baseStore,
                isEmpLoading: true,
            })
        );

        render(
            <MemoryRouter>
                <EmployeeList />
            </MemoryRouter>
        );

        expect(screen.getByTestId("employee-skeleton")).toBeInTheDocument();
    });
});
