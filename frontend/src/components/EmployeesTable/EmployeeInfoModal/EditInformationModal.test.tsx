import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { EditInformationModal } from "./EditInformationModal";
import { useOrgStore } from "../../../store/organizationStore";

// Мок Zustand store
jest.mock("../../../store/organizationStore", () => ({
    useOrgStore: jest.fn(),
}));

jest.mock("../../../assets/contactInfo.svg", () => ({
    ReactComponent: () => <svg data-testid="contact-icon" />,
}));
jest.mock("../../../assets/workPlace.svg", () => ({
    ReactComponent: () => <svg data-testid="workplace-icon" />,
}));

// Мок lucide icon
jest.mock("lucide-react", () => ({
    ArrowLeft: () => <span data-testid="arrow-left-icon" />,
    UsersRound: () => <span data-testid="user-round-icon" />,
}));

// Мок CustomInputEditModal
jest.mock("./CustomInputEditModal", () => ({
    CustomInputEditModal: ({ id, labelField, onChange }: any) => (
        <div>
            <label htmlFor={id}>{labelField}</label>
            <input
                id={id}
                onChange={(e) => onChange(e.target.value)}
                data-testid={`input-${id}`}
            />
        </div>
    ),
}));

// Мок CustomButton
jest.mock("../../StyledComponents", () => ({
    CustomButton: ({
        onClick,
        disabled,
        children,
        "data-testid": testId,
    }: any) => (
        <button onClick={onClick} disabled={disabled} data-testid={testId}>
            {children}
        </button>
    ),
    Modal2Background: ({ children }: any) => <div>{children}</div>,
    InfoBlock: ({ children }: any) => <div>{children}</div>,
    ModalContent: ({ children }: any) => <div>{children}</div>,
    ModalContainer: ({ children }: any) => <div>{children}</div>,
    ModalHeader: ({ children }: any) => <div>{children}</div>,
    CloseButton: ({ onClick, disabled, children }: any) => (
        <button onClick={onClick} disabled={disabled}>
            {children}
        </button>
    ),
}));

describe("EditInformationModal", () => {
    const mockSetIsEditInformation = jest.fn();
    const mockFetchVerificatinCode = jest.fn();
    const mockSaveEmployeeInfo = jest.fn();
    const mockSetIsEmployeeInfoModalOpen = jest.fn();

    const baseStore = {
        currentEmployeeInfo: {
            id: "123",
            organizationId: "org456",
            fullNameRus: "Иванов Иван",
            email: "ivanov@example.com",
            isEditAvailable: true,
            mobileNumberPersonal: "+7 900 123-45-67",
            externalNumberCorp: "+7 495 123-45-67",
            workPlace: 100500,
            address: "ул. Пушкина, д. 10",
        },
        isEditInformation: true,
        isEmployeeInfoModalOpen: false,
        setIsEditInformation: mockSetIsEditInformation,
        fetchVerificatinCode: mockFetchVerificatinCode,
        saveEmployeeInfo: mockSaveEmployeeInfo,
        setIsEmployeeInfoModalOpen: mockSetIsEmployeeInfoModalOpen,
    };

    beforeEach(() => {
        (useOrgStore as unknown as jest.Mock).mockImplementation((selector) =>
            selector(baseStore)
        );
        jest.clearAllMocks();
    });

    it("рендерит модалку с полями ввода", () => {
        render(
            <MemoryRouter>
                <EditInformationModal />
            </MemoryRouter>
        );

        expect(
            screen.getByText("Изменение данных о сотруднике")
        ).toBeInTheDocument();
        expect(
            screen.getByLabelText("Мобильный телефон(личный)")
        ).toBeInTheDocument();
        expect(screen.getByLabelText("Городской телефон")).toBeInTheDocument();
        expect(screen.getByLabelText("Рабочее место")).toBeInTheDocument();
        expect(screen.getByLabelText("Адрес")).toBeInTheDocument();
        expect(screen.getByLabelText("Код проверки")).toBeInTheDocument();
    });

    it("отображает текст о необходимости электронной почты при её отсутствии", () => {
        (useOrgStore as unknown as jest.Mock).mockImplementation((selector) =>
            selector({
                ...baseStore,
                currentEmployeeInfo: {
                    ...baseStore.currentEmployeeInfo,
                    email: null,
                },
            })
        );

        render(
            <MemoryRouter>
                <EditInformationModal />
            </MemoryRouter>
        );

        expect(
            screen.getByText(/Электронная почта отсутствует/i)
        ).toBeInTheDocument();
    });

    it('вызывает fetchVerificatinCode при клике на кнопку "Отправить код проверки"', () => {
        render(
            <MemoryRouter>
                <EditInformationModal />
            </MemoryRouter>
        );

        const sendCodeButton = screen.getByText(/Отправить код проверки/i);
        fireEvent.click(sendCodeButton);

        expect(mockFetchVerificatinCode).toHaveBeenCalledWith("123", "org456");
    });

    it('вызывает saveEmployeeInfo при нажатии на "Сохранить" с заполненными данными', () => {
        render(
            <MemoryRouter>
                <EditInformationModal />
            </MemoryRouter>
        );

        // Проверяем, что поля отрендерились
        expect(screen.getByTestId("input-mobilePersonal")).toBeInTheDocument();
        expect(screen.getByTestId("input-cityPhone")).toBeInTheDocument();
        expect(screen.getByTestId("input-placeWork")).toBeInTheDocument();
        expect(screen.getByTestId("input-Adress")).toBeInTheDocument();
        expect(screen.getByTestId("input-code")).toBeInTheDocument();

        // Заполняем поля
        fireEvent.change(screen.getByTestId("input-code"), {
            target: { value: "123456" },
        });
        fireEvent.change(screen.getByTestId("input-mobilePersonal"), {
            target: { value: "+7 911 123-45-67" },
        });
        fireEvent.change(screen.getByTestId("input-cityPhone"), {
            target: { value: "+7 495 987-65-43" },
        });
        fireEvent.change(screen.getByTestId("input-placeWork"), {
            target: { value: 100500 },
        });
        fireEvent.change(screen.getByTestId("input-Adress"), {
            target: { value: "ул. Ленина, д. 20" },
        });

        // Кликаем на чекбокс
        fireEvent.click(screen.getByLabelText(/Нажимая на кнопку/i));

        // Нажимаем "Сохранить"
        fireEvent.click(screen.getByTestId("save-button"));

        // Проверяем вызов
        expect(mockSaveEmployeeInfo).toHaveBeenCalledWith(
            "+7 911 123-45-67",
            "+7 495 987-65-43",
            100500,
            "ул. Ленина, д. 20",
            "123456"
        );
    });

    it('отключает кнопку "Сохранить", если checkbox не выбран', () => {
        render(
            <MemoryRouter>
                <EditInformationModal />
            </MemoryRouter>
        );

        const saveButton = screen.getByTestId("save-button");
        expect(saveButton).toBeDisabled();
    });

    it('включает кнопку "Сохранить", если checkbox выбран и код введён', () => {
        render(
            <MemoryRouter>
                <EditInformationModal />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByTestId("input-code"), {
            target: { value: "123456" },
        });

        fireEvent.click(screen.getByLabelText(/Нажимая на кнопку/i));
        const saveButton = screen.getByTestId("save-button");
        expect(saveButton).not.toBeDisabled();
    });

    it("закрывает модалку при нажатии ESC", () => {
        render(
            <MemoryRouter>
                <EditInformationModal />
            </MemoryRouter>
        );

        fireEvent.keyDown(document, { key: "Escape" });
        expect(mockSetIsEditInformation).toHaveBeenCalledWith(false);
    });

    it("возвращает к предыдущей модалке при нажатии на стрелку", () => {
        render(
            <MemoryRouter>
                <EditInformationModal />
            </MemoryRouter>
        );

        const arrowIcon = screen.getByTestId("arrow-left-icon");
        fireEvent.click(arrowIcon);

        expect(mockSetIsEditInformation).toHaveBeenCalledWith(false);
        expect(useOrgStore).toHaveBeenCalled();
    });
});
