import { styled } from "styled-components";

export const PhotoAndInfo = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;

    @media (width < 1460px) {
        flex-direction: column;
    }
`;

export const PhotoBlock = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0 20px 20px 20px;
    width: 30%;
    min-width: 240px;
    height: 50%;
    border-radius: 10px;

    @media (width < 1460px) {
        padding: 0 20px 20px 0px;
    }
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
    svg {
        stroke: ${(props) => props.theme.mainTextColor};
        margin-right: 5px;
    }
`;

export const InfoBlockContent = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 2 колонки */
    grid-template-rows: repeat(3, auto); /* 3 строки */
    gap: 15px; /* расстояние между элементами */
`;

export const Fio = styled.h3`
    margin: 0;
    line-height: 1.1;
`;

export const FieldWrapper = styled.div`
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
`;

export const NameField = styled.label`
    font-size: 10pt;
    color: ${(props) => props.theme.greyHeader};
`;

export const BlockModalIcon = styled.img`
    margin-right: 5px;
`;

export const EditModalInputsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 2 колонки */
    gap: 10px;
    width: 100%;
`;

export const EditModalTextContainer = styled.div`
    margin: 0;
    overflow-y: auto;
    @media (height<950px) and (height>760px) {
        max-height: 200px;
    }
    @media (height<760px) and (height>700px) {
        max-height: 150px;
    }
    @media (height<700px) {
        max-height: 1000px;
    }
`;

export const EditModalContentWrapper = styled.div`
    place-items: center;
    @media (height<700px) {
        max-height: 400px;
        overflow-y: auto;
    }
`;

export const LinkSpan = styled.span`
    cursor: pointer;
    text-decoration: underline;
    &:hover {
        color: ${(props) => props.theme.hoverItemText};
        transition: all 0.5s ease;
    }
`;
