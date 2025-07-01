import { render, screen } from "@testing-library/react";
import { ModalField } from "./ModalField";
import { MemoryRouter } from "react-router-dom";

describe("ModalField", () => {
    it("показывает поле и значение", () => {
        render(
            <MemoryRouter>
                <ModalField nameField="Телефон" value="123-456" />
            </MemoryRouter>
        );
        expect(screen.getByText("Телефон")).toBeInTheDocument();
        expect(screen.getByText("123-456")).toBeInTheDocument();
    });

    it('показывает "Не указан", если значение null', () => {
        render(
            <MemoryRouter>
                <ModalField nameField="Электронная почта" value={null} />
            </MemoryRouter>
        );
        expect(screen.getByText("Электронная почта")).toBeInTheDocument();
        expect(screen.getByText("Не указан")).toBeInTheDocument();
    });
});
