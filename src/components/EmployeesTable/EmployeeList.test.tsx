/* eslint-disable testing-library/no-node-access */
import { render, screen, fireEvent } from "@testing-library/react";
import { EmployeeList } from "./EmployeeList";
import { useOrgStore } from "../../store/organizationStore";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

const mockStore = {
    organizations: [],
    externalOrganizations: [],
    selectedOrgId: null,
    employees: undefined,
    isOrgLoading: false,
    isExternalOrgLoading: false,
    isEmpLoading: true,
    categories: "fullName",
    search: "",
    employeesList: [],
    orgMap: new Map(),
    orgMapId: new Map(),
    isEmployeeInfoModalOpen: false,
    currentEmployeeInfo: undefined,
    isCurrentEmployeeLoading: false,
    isEditInformation: false,
    isLoadingCode: false,
    isEmployeeForSearchBarLoading: false,
    EmployeesListLimit: [],
    fetchTree: jest.fn(),
    fetchExternalTree: jest.fn(),
    selectOrg: jest.fn(),
    loadMoreEmployees: jest.fn(),
    fetchEmployeesWithParams: jest.fn(),
    fetchCurrentEmployeeInfo: jest.fn(),
    setIsEmployeeInfoModalOpen: jest.fn(),
    setIsEditInformation: jest.fn(),
    fetchVerificatinCode: jest.fn(),
    saveEmployeeInfo: jest.fn(),
    fetchEmployeeForSearchBar: jest.fn(),
};

jest.mock("../../store/organizationStore", () => ({
    useOrgStore: jest.fn(),
}));

const baseEmployee = {
    id: "1",
    fullNameRus: "Иванов Иван Иванович",
    positionTitle: "Разработчик",
    departmentId: "d1",
    departmentName: "ИТ",
    organizationId: "org1",
    telephoneNumberCorp: "123-456",
    email: "ivanov@gsprom.ru",
    photo: null,
};

// beforeEach(() => {
//   (useOrgStore as jest.Mock).mockImplementation((selector) =>
//     selector(mockStore)
//   );
// });

const renderWithRouter = (ui: React.ReactNode) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("EmployeeList component", () => {
    const mockStore = {
        employees: {
            organizationId: "org1",
            organizationName: "Газпром",
            departmentId: "",
            departmentName: "",
            employees: [baseEmployee],
            children: [],
        },
        isEmpLoading: false,
        fetchCurrentEmployeeInfo: jest.fn(),
        isEmployeeInfoModalOpen: false,
        setIsEmployeeInfoModalOpen: jest.fn(),
        selectOrg: jest.fn(),
        isEditInformation: false,
        isLoadingCode: false,
        isEmployeeForSearchBarLoading: false,
        EmployeesListLimit: [],
        employeesList: [],
        fetchEmployeesWithParams: jest.fn(),
    };

    beforeEach(() => {
        (useOrgStore as unknown as jest.Mock).mockImplementation((selector) =>
            selector(mockStore)
        );
    });

    it("renders employee full name", () => {
        render(<EmployeeList />);
        expect(screen.getByText("Иванов Иван Иванович")).toBeInTheDocument();
    });
});
