import styled from "styled-components";
import { CustomCopyButton, CustomEmailLink } from "./components";
import { toast } from "react-toastify";

const FieldWrapper = styled.div`
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
`;

const NameField = styled.label`
    font-size: 10pt;
    color: rgb(102, 102, 102);
`;

interface Props {
    nameField: string;
    value: string;
}

export const ModalField = ({ nameField, value }: Props) => {
    const handleCopyClick = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.info("Скопировано в буфер обмена", { position: "top-right" });
    };

    return (
        <FieldWrapper>
            <NameField>{nameField}</NameField>
            {nameField === "Email" ? (
                <div>
                    <CustomEmailLink
                        href={`mailto:${value}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {value}
                    </CustomEmailLink>
                    <CustomCopyButton
                        size={13}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCopyClick(value!);
                        }}
                    />
                </div>
            ) : (
                <span>{value || "Не указано"}</span>
            )}
        </FieldWrapper>
    );
};
