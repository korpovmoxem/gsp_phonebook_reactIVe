import { styled } from "styled-components";

export const ModalBackgroundTemplate = styled.div`
    display: block;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.25);
    animation-came: appear;
    animation-duration: 300ms;
    align-content: center;
`;

export const ModalBackground = styled(ModalBackgroundTemplate)`
    z-index: 100;
`;

export const Modal2Background = styled(ModalBackgroundTemplate)`
    z-index: 200;
`;

export const ModalContainer = styled.div`
    background: #ffffff;
    max-width: 1000px;
    margin: auto;
`;

export const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    padding: 30px;
`;

export const CloseButton = styled.button`
    border: none;
    background-color: unset;
    cursor: pointer;
    &:hover {
        color: rgb(167, 167, 167);
    }
`;

export const ModalHeader = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;
