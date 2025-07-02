import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { EmployeeList } from "./EmployeeList";
import { useOrgStore } from "../../store/organizationStore";
import { toast } from "react-toastify";

// Мокаем зависимости
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

describe("EmployeeList", () => {
    const mockFetchEmployeesWithParams = jest.fn();
    const mockSelectOrg = jest.fn();
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
        fetchEmployeesWithParams: mockFetchEmployeesWithParams,
        selectOrg: mockSelectOrg,
        setIsEmployeeInfoModalOpen: mockSetIsEmployeeInfoModalOpen,
        fetchCurrentEmployeeInfo: mockFetchCurrentEmployeeInfo,
    };

    beforeEach(() => {
        (useOrgStore as unknown as jest.Mock).mockImplementation((selector) =>
            selector(baseStore)
        );
    });

    it("рендерит список сотрудников", () => {
        render(
            <MemoryRouter>
                <EmployeeList />
            </MemoryRouter>
        );

        expect(screen.getByText("Иванов Иван")).toBeInTheDocument();
        expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
        expect(screen.getByText("123456")).toBeInTheDocument();
        expect(screen.getByText("ivanov@example.com")).toBeInTheDocument();
    });

    it("переходит к модалке сотрудника при клике на строку", () => {
        const mockNavigate = jest.fn();
        jest.mock("react-router-dom", () => ({
            ...jest.requireActual("react-router-dom"),
            useNavigate: () => mockNavigate,
        }));

        render(
            <MemoryRouter>
                <EmployeeList />
            </MemoryRouter>
        );

        const employeeRow = screen.getByText("Иванов Иван");
        fireEvent.click(employeeRow!);

        expect(mockSetIsEmployeeInfoModalOpen).toHaveBeenCalledWith(true);
        expect(mockFetchCurrentEmployeeInfo).toHaveBeenCalledWith("1", "org1");
    });

    it('рендерит сообщение "Не найдено" при отсутствии результатов', () => {
        (useOrgStore as unknown as jest.Mock).mockImplementation((selector) =>
            selector({
                ...baseStore,
                employees: undefined,
                isEmpLoading: false,
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
