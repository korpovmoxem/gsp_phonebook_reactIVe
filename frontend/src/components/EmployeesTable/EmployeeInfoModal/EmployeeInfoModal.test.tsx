import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { EmployeeInfoModal } from "./EmployeeInfoModal";
import { useOrgStore } from "../../../store/organizationStore";
import { useEmployeeStore } from "../../../store/employeeStore";

jest.mock("../../../store/organizationStore", () => ({
    useOrgStore: jest.fn(),
}));

jest.mock("../../../store/employeeStore", () => ({
    useEmployeeStore: jest.fn(),
}));

jest.mock("./ModalField", () => ({
    ModalField: ({
        nameField,
        value,
    }: {
        nameField: string;
        value?: string | null;
    }) => (
        <div data-testid="modal-field">
            <span>{nameField}</span>: <span>{value || "Не указан"}</span>
        </div>
    ),
}));

jest.mock("../../../assets/contactInfo.svg", () => ({
    ReactComponent: () => <svg data-testid="contact-icon" />,
}));
jest.mock("../../../assets/workPlace.svg", () => ({
    ReactComponent: () => <svg data-testid="workplace-icon" />,
}));

jest.mock("spinners-react", () => ({
    SpinnerCircular: () => <div data-testid="spinner" />,
}));

describe("EmployeeInfoModal", () => {
    const mockSetIsEmployeeInfoModalOpen = jest.fn();
    const mockSetIsEditInformation = jest.fn();
    const mockFetchCurrentEmployeeInfo = jest.fn();
    const mockLoadEmployeeData = jest.fn();

    const baseStore = {
        isEmployeeInfoModalOpen: true,
        setIsEmployeeInfoModalOpen: mockSetIsEmployeeInfoModalOpen,
        currentEmployeeInfo: {
            telephoneNumberCorp: "+7 123 456-78-90",
            email: "test@example.com",
            organizationName: "Организация1",
            departmentName: "Отдел разработки",
            address: "ул. Пушкина, д. 10",
            workPlace: "Кабинет 100",
            assistants: [],
            id: "123",
            organizationId: "org456",
            fullNameRus: "Иванов Иван",
            isEditAvailable: true,
        },
        fetchCurrentEmployeeInfo: mockFetchCurrentEmployeeInfo,
        isCurrentEmployeeLoading: false,
        isEditInformation: false,
        setIsEditInformation: mockSetIsEditInformation,
    };

    const employeeStoreMock = {
        employeeData: {
            "123": {
                large: {
                    photo: "mock-photo-url.jpg",
                    statuses: [],
                    achievements: [],
                },
            },
        },
        loadEmployeeData: mockLoadEmployeeData,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useOrgStore as unknown as jest.Mock).mockImplementation((selector) =>
            selector(baseStore)
        );
        (useEmployeeStore as unknown as jest.Mock).mockImplementation(
            (selector) => selector(employeeStoreMock)
        );
    });

    it("рендерит модалку с данными сотрудника", () => {
        render(
            <MemoryRouter>
                <EmployeeInfoModal />
            </MemoryRouter>
        );
        expect(screen.getByText(/телефон/i)).toBeInTheDocument();
        expect(screen.getByText("+7 123 456-78-90")).toBeInTheDocument();
        expect(screen.getByText(/Электронная почта/i)).toBeInTheDocument();
        expect(screen.getByText("test@example.com")).toBeInTheDocument();
    });

    it("отображает спиннер при загрузке данных", () => {
        (useOrgStore as unknown as jest.Mock).mockImplementation((selector) =>
            selector({ ...baseStore, isCurrentEmployeeLoading: true })
        );
        render(
            <MemoryRouter>
                <EmployeeInfoModal />
            </MemoryRouter>
        );
        expect(screen.getByTestId("spinner")).toBeInTheDocument();
    });

    it("закрывает модалку при Escape", () => {
        render(
            <MemoryRouter>
                <EmployeeInfoModal />
            </MemoryRouter>
        );
        fireEvent.keyDown(document, { key: "Escape" });
        expect(mockSetIsEmployeeInfoModalOpen).toHaveBeenCalledWith(false);
    });

    it("переходит в режим редактирования", () => {
        render(
            <MemoryRouter>
                <EmployeeInfoModal />
            </MemoryRouter>
        );
        const editButton = screen.getByText(/Изменить данные/i);
        fireEvent.click(editButton);
        expect(mockSetIsEditInformation).toHaveBeenCalledWith(true);
    });
});
