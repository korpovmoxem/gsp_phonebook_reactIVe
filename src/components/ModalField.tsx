import styled from "styled-components";

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
    console.log("ModalField");

    return (
        <FieldWrapper>
            <NameField>{nameField}</NameField>
            <span>{value || "Не указано"}</span>
        </FieldWrapper>
    );
};
