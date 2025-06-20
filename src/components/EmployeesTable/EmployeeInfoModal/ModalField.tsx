import { CustomCopyButton, CustomEmailLink } from "../../StyledComponents";
import { toast } from "react-toastify";
import { FieldWrapper, NameField } from "./StyledComponents";

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
