import React from "react";
import { render, screen } from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";
import { useOrgStore } from "../../../store/organizationStore";
import { EmployeeInfoModal } from "./EmployeeInfoModal";

// beforeEach(() => {
//     jest.clearAllMocks();
//     // или
//     jest.resetModules();
// });
// МОК zustand
jest.mock("../../../store/organizationStore", () => ({
    useOrgStore: jest.fn(),
}));

// МОК картинки
jest.mock("../../../materials/photo.jpg", () => "photo.jpg");

// МОК иконок
jest.mock("../../../materials/contactInfo.svg", () => () => (
    <svg data-testid="icon-contact" />
));

jest.mock("../../../materials/workPlace.svg", () => () => (
    <svg data-testid="icon-workplace" />
));

// МОК Spinner
jest.mock("spinners-react", () => ({
    SpinnerCircular: () => <div data-testid="spinner" />,
}));

jest.mock("./ModalField", () => ({
    ModalField: ({ nameField, value }: any) => (
        <div>
            <p>{nameField}</p>
            <p>{value || "Не указан"}</p>
        </div>
    ),
}));

describe("EmployeeInfoModal", () => {
    const mockSetIsEmployeeInfoModalOpen = jest.fn();
    const mockSetIsEditInformation = jest.fn();
    const mockFetchCurrentEmployeeInfo = jest.fn();

    beforeAll(() => {
        jest.spyOn(console, "error").mockImplementation(() => {});
        jest.spyOn(console, "warn").mockImplementation(() => {});
    });

    beforeEach(() => {
        (useOrgStore as unknown as jest.Mock).mockImplementation(
            (selector: any) =>
                selector({
                    isEmployeeInfoModalOpen: true,
                    setIsEmployeeInfoModalOpen: mockSetIsEmployeeInfoModalOpen,
                    isEditInformation: false,
                    setIsEditInformation: mockSetIsEditInformation,
                    fetchCurrentEmployeeInfo: mockFetchCurrentEmployeeInfo,
                    isCurrentEmployeeLoading: false,
                    currentEmployeeInfo: {
                        fullNameRus: "Иванов Иван Иванович",
                        email: "ivanov@example.com",
                        telephoneNumberCorp: "123456",
                        photo: null,
                        positionTitle: "Разработчик",
                        departmentName: "IT",
                        managers: [],
                        assistants: [],
                    },
                })
        );
    });

    it("отображает модалку с инфой о сотруднике", () => {
        render(
            <MemoryRouter>
                <EmployeeInfoModal />
            </MemoryRouter>
        );

        expect(screen.getByText("Информация о сотруднике")).toBeInTheDocument();
        expect(screen.getByText("Иванов Иван Иванович")).toBeInTheDocument();
        expect(screen.getByText("Разработчик")).toBeInTheDocument();
        // expect(screen.getByText("Электронная почта")).toBeInTheDocument();
        expect(screen.getByText("ivanov@example.com")).toBeInTheDocument();
    });

    // it('нажимает на "Изменить данные"', () => {
    //     render(
    //         <MemoryRouter>
    //             <EmployeeInfoModal />
    //         </MemoryRouter>
    //     );

    //     const button = screen.getByText("Изменить данные");
    //     fireEvent.click(button);

    //     expect(mockSetIsEmployeeInfoModalOpen).toHaveBeenCalledWith(false);
    //     expect(mockSetIsEditInformation).toHaveBeenCalledWith(true);
    // });
});
