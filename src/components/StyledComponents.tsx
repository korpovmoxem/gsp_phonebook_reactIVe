import { CopyIcon } from "lucide-react";
import Skeleton from "react-loading-skeleton";
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
    background-color: ${(props) => props.theme.modalBlurColor};
    animation-name: appear;
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
    background-color: ${(props) => props.theme.backgroundBlock};
    max-width: 1000px;
    width: 900px;
    margin: auto;
    border-radius: 10px;
    max-height: 90vh;
    overflow-y: auto;
    scrollbar-width: thin;
    scroll-behavior: smooth;
    scrollbar-color: rgb(199, 199, 199) transparent;
`;

export const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    padding: 10px 30px;
    color: ${(props) => props.theme.mainTextColor};
`;

export const CloseButton = styled.button`
    border: none;
    background-color: unset;
    color: ${(props) => props.theme.mainTextColor};
    cursor: pointer;
    &:hover {
        color: rgb(167, 167, 167);
    }
`;

export const ModalHeader = styled.div`
    display: flex;
    position: sticky;
    top: 10px;
    background-color: ${(props) => props.theme.backgroundBlock};
    flex-direction: row;
    justify-content: space-between;
`;

interface ButtonProps {
    height?: string;
}

export const CustomButton = styled.button<ButtonProps>`
    height: ${(props) => (props.height ? props.height : "auto")};
    margin-left: 20px;
    border: none;
    background-color: #1d75bb;
    color: #ffffff;
    cursor: pointer;
    border-radius: 5px;

    &:hover {
        background-color: rgb(6, 106, 187);
        -webkit-box-shadow: 0px 0px 5px 0px rgba(34, 60, 80, 0.7);
        -moz-box-shadow: 0px 0px 5px 0px rgba(34, 60, 80, 0.7);
        box-shadow: 0px 0px 5px 0px rgba(34, 60, 80, 0.7);
    }

    &:disabled {
        opacity: 0.4 !important;
    }
`;

export const CustomEmailLink = styled.a`
    color: ${(props) => props.theme.mainTextColor};
    &:hover {
        color: grey;
    }
`;
export const CustomCopyButton = styled(CopyIcon)`
    margin-left: 10px;
    cursor: pointer;
    &:hover {
        color: grey;
    }
`;

export const MainWrapper = styled.div`
    margin: auto;
    max-width: 90%;
    height: 100vh;
    max-height: 100vh;
`;

export const RootWrapper = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: ${(props) => props.theme.background};
    transition: all 0.5s ease;
`;

export const ContentWrapper = styled.div`
    display: flex;
    flex-direction: row;
    height: calc(100vh - 145px);
`;

export const SearchWrapper = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
`;

export const FAB = styled.button`
    cursor: pointer;
    position: fixed;
    bottom: 70px;
    right: 50px;
    width: 40px;
    height: 40px;
    border-radius: 45px;
    border: none;
    background: rgba(167, 167, 167, 0.51);
    font-size: 25pt;
    color: #ffffff;

    &:hover {
        background: rgba(167, 167, 167, 0.9);
    }
`;

export const CustomSkeleton = styled(Skeleton)`
    --base-color: ${(props) => props.theme.backgroundSubHeader};
    --highlight-color: ${(props) => props.theme.background};
`;
