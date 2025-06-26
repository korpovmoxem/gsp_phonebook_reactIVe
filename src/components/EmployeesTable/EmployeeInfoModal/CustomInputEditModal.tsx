import styled from "styled-components";

const CustomInputContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 97%;
    align-self: center;
    padding: 5px;
    background-color: rgba(240, 240, 240, 0.49);
    border-bottom: 3px solid rgb(138, 138, 138);
    font-size: 12pt;
    margin-bottom: 10px;

    &:focus-within {
        border-bottom: 3px solid #1d75bb;
        transition: all 0.3s ease-in-out;
    }
`;

const CustomLabel = styled.label`
    color: rgb(155, 155, 155);
    font-size: 10pt;

    &:focus-within {
        color: rgb(129, 129, 129);
        transition: all 0.1s ease-in-out;
    }
`;

const CustomInput = styled.input`
    background-color: unset;
    border: none;
    line-height: 20px;
    outline: none;
    margin: 5px 0 0 10px;
    padding: 0;
    width: 90%;

    &::placeholder {
        font-size: 12pt;
    }

    &[type="number"] {
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
            -webkit-appearance: none;
            appearance: none;Add commentMore actions
            margin: 0;
        }

        -moz-appearance: textfield;
    }
`;

interface Props {
    id: string;
    labelField: string;
    width?: string;
    onChange: (value: string) => void;
    defaultValue?: string | number | null;
}

export const CustomInputEditModal = ({
    id,
    labelField,
    width,
    onChange,
    defaultValue,
}: Props) => {
    return (
        <>
            <CustomInputContainer>
                <CustomLabel htmlFor={id}>
                    {labelField}
                    <br />
                    <CustomInput
                        id={id}
                        placeholder="Введите..."
                        onChange={(event) => onChange(event.target.value)}
                        autoComplete="off"
                        value={defaultValue || ""}
                        type={
                            id === "code" || id === "placeWork"
                                ? "number"
                                : "text"
                        }
                    />
                </CustomLabel>
            </CustomInputContainer>
        </>
    );
};
