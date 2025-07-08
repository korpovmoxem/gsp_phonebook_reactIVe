import styled from "styled-components";
import { Classic } from "@theme-toggles/react";

export const LogoWrapper = styled.div`
    padding: 10px;
    display: flex;
    flex-direction: column;
    max-width: 250px;
`;

export const HeaderWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

export const MainLogo = styled.img`
    margin-bottom: 20px;
    width: 10vw;
    @media (orientation: portrait) {
        width: 20vw;
    }
`;

export const SubLogo = styled.img`
    width: 10vw;
    @media (orientation: portrait) {
        width: 20vw;
    }
`;

export const SubLogoArchive = styled.a`
    text-decoration: none;
    color: #1d75bb9c;
    font-size: 15px;
`;

export const CustomToggle = styled(Classic)`
    font-size: 22pt;
    height: 0;
    margin-top: 1%;
    color: ${(props) => props.theme.toggleColor};
    transition: all 0.5s ease;
`;

export const LogoContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0;
`;
