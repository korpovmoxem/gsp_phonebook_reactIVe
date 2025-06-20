import { styled } from "styled-components";

export const PhotoAndInfo = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;
`;

export const PhotoBlock = styled.div`
    display: flex;
    justify-content: center;
    padding: 20px;
    width: 30%;
    min-width: 240px;
    height: 50%;
    border-radius: 10px;
`;

export const InfoBlockWrapper = styled.div`
    padding: 0 20px 20px 20px;
    width: 70%;
    border-radius: 10px;
    font-weight: 400;
    font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji",
        "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    font-feature-settings: normal;
    font-variation-settings: normal;
`;

export const InfoBlock = styled.div`
    padding: 20px;
    width: 94%;
    border: 1px solid rgb(223, 223, 223);
    border-radius: 10px;
    margin-bottom: 10px;
`;

export const Fio = styled.h3`
    margin: 0;
`;

export const FieldWrapper = styled.div`
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
`;

export const NameField = styled.label`
    font-size: 10pt;
    color: rgb(102, 102, 102);
`;
