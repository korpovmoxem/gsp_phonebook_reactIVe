// CustomInputEditModal.test.tsx

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CustomInputEditModal } from "./CustomInputEditModal";

describe("CustomInputEditModal", () => {
    const defaultProps = {
        id: "testId",
        labelField: "Тестовое поле",
        onChange: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("отображает label и input", () => {
        render(<CustomInputEditModal {...defaultProps} />);

        expect(screen.getByLabelText(/тестовое поле/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/введите.../i)).toBeInTheDocument();
    });

    it("передаёт новое значение в onChange при вводе текста", () => {
        render(<CustomInputEditModal {...defaultProps} />);

        const input = screen.getByLabelText(/тестовое поле/i);
        fireEvent.change(input, { target: { value: "новый текст" } });

        expect(defaultProps.onChange).toHaveBeenCalledWith("новый текст");
    });

    it("устанавливает defaultValue как значение input", () => {
        render(
            <CustomInputEditModal
                {...defaultProps}
                defaultValue="начальное значение"
            />
        );

        const input = screen.getByLabelText(/тестовое поле/i);
        expect(input).toHaveValue("начальное значение");
    });

    it('устанавливает тип "number" для id "code"', () => {
        render(<CustomInputEditModal {...defaultProps} id="code" />);

        const input = screen.getByLabelText(/тестовое поле/i);
        expect(input).toHaveAttribute("type", "number");
    });

    it('устанавливает тип "number" для id "placeWork"', () => {
        render(<CustomInputEditModal {...defaultProps} id="placeWork" />);

        const input = screen.getByLabelText(/тестовое поле/i);
        expect(input).toHaveAttribute("type", "number");
    });

    it('устанавливает тип "text" для другого id', () => {
        render(<CustomInputEditModal {...defaultProps} id="otherId" />);

        const input = screen.getByLabelText(/тестовое поле/i);
        expect(input).toHaveAttribute("type", "text");
    });
});
