// EmployeeInfoModal.test.tsx

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { EmployeeInfoModal } from "./EmployeeInfoModal";
import { useOrgStore } from "../../../store/organizationStore";

// Mock Zustand store
jest.mock("../../../store/organizationStore", () => ({
    useOrgStore: jest.fn(),
}));

// Mock ModalField
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

// Mock SVG icons
jest.mock("../../../assets/contactInfo.svg", () => ({
    ReactComponent: () => <svg data-testid="contact-icon" />,
}));
jest.mock("../../../assets/workPlace.svg", () => ({
    ReactComponent: () => <svg data-testid="workplace-icon" />,
}));

// Mock Spinner
jest.mock("spinners-react", () => ({
    SpinnerCircular: () => <div data-testid="spinner" />,
}));

describe("EmployeeInfoModal", () => {
    const mockSetIsEmployeeInfoModalOpen = jest.fn();
    const mockSetIsEditInformation = jest.fn();
    const mockFetchCurrentEmployeeInfo = jest.fn();

    const baseStore = {
        isEmployeeInfoModalOpen: true,
        setIsEmployeeInfoModalOpen: mockSetIsEmployeeInfoModalOpen,
        currentEmployeeInfo: {
            telephoneNumberCorp: "+7 123 456-78-90",
            externalNumberCorp: "+7 987 654-32-10",
            mobileNumberCorp: "+7 111 222-33-44",
            mobileNumberPersonal: "+7 222 333-44-55",
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

    beforeEach(() => {
        (useOrgStore as unknown as jest.Mock).mockImplementation((selector) =>
            selector(baseStore)
        );
        jest.clearAllMocks();
    });

    it("рендерит модалку с данными сотрудника", () => {
        render(
            <MemoryRouter>
                <EmployeeInfoModal />
            </MemoryRouter>
        );

        expect(screen.getByText("Номер телефона")).toBeInTheDocument();
        expect(screen.getByText("+7 123 456-78-90")).toBeInTheDocument();

        expect(screen.getByText("Электронная почта")).toBeInTheDocument();
        expect(screen.getByText("test@example.com")).toBeInTheDocument();

        expect(screen.getByText("Организация")).toBeInTheDocument();
        expect(screen.getByText("Организация1")).toBeInTheDocument();

        expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
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

    it("вызывает setIsEmployeeInfoModalOpen(false) при нажатии на Escape", () => {
        render(
            <MemoryRouter>
                <EmployeeInfoModal />
            </MemoryRouter>
        );

        fireEvent.keyDown(document, { key: "Escape" });
        expect(mockSetIsEmployeeInfoModalOpen).toHaveBeenCalledWith(false);
    });

    it('вызывает setIsEditInformation(true) при клике на кнопку "Изменить данные"', () => {
        render(
            <MemoryRouter>
                <EmployeeInfoModal />
            </MemoryRouter>
        );

        const editButton = screen.getByText(/Изменить данные/i);
        fireEvent.click(editButton);

        expect(mockSetIsEditInformation).toHaveBeenCalledWith(true);
    });

    it("не рендерит помощников, если массив пустой", () => {
        render(
            <MemoryRouter>
                <EmployeeInfoModal />
            </MemoryRouter>
        );

        expect(screen.queryByText("Помощники")).not.toBeInTheDocument();
    });

    it("рендерит помощников, если они есть", () => {
        const storeWithAssistants = {
            ...baseStore,
            currentEmployeeInfo: {
                ...baseStore.currentEmployeeInfo,
                assistants: [
                    {
                        id: "1",
                        fullName: "Иван Петров",
                        organizationId: "org1",
                    },
                    {
                        id: "2",
                        fullName: "Петр Иванов",
                        organizationId: "org2",
                    },
                ],
            },
        };

        (useOrgStore as unknown as jest.Mock).mockImplementation((selector) =>
            selector(storeWithAssistants)
        );

        render(
            <MemoryRouter>
                <EmployeeInfoModal />
            </MemoryRouter>
        );

        expect(screen.getByText("Помощники")).toBeInTheDocument();
        expect(screen.getByText("Иван Петров")).toBeInTheDocument();
        expect(screen.getByText("Петр Иванов")).toBeInTheDocument();
    });
});
