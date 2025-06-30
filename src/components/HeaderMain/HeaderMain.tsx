import AdressBookImg from "../../materials/adressBook.svg";
import MainLogoImg from "../../materials/logo.svg";

import { Link, useNavigate } from "react-router-dom";
import {
    HeaderWrapper,
    LogoWrapper,
    MainLogo,
    SubLogo,
} from "./StyledComponents";
import "@theme-toggles/react/css/Classic.css";
import { Classic } from "@theme-toggles/react";
import { useThemeStore } from "../../store/useThemeStore";
import { styled } from "styled-components";

const CustomToggle = styled(Classic)`
    font-size: 22pt;
    height: 0;
    margin-top: 1%;
    color: ${(props) => props.theme.toggleColor};
    transition: all 0.5s ease;
`;

export const HeaderMain = () => {
    const navigate = useNavigate();
    const toggleTheme = useThemeStore((state) => state.toggleTheme);
    const theme = useThemeStore((state) => state.theme);

    // При появлении ошибок реакта переходть на страницу с ошибкой
    window.onerror = function (message, source, lineno, colno, error) {
        // Перейти на страницу ошибки
        navigate("/err");
    };
    window.addEventListener("unhandledrejection", function (event) {
        // Перейти на страницу ошибки при Promise-ошибках
        navigate("/err");
    });
    return (
        <HeaderWrapper>
            <LogoWrapper>
                <Link to="/#">
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            margin: 0,
                        }}
                    >
                        <MainLogo src={MainLogoImg} alt="ГазСтройПром" />
                        <SubLogo src={AdressBookImg} alt="ГазСтройПром" />
                    </div>
                </Link>
            </LogoWrapper>
            <CustomToggle
                onClickCapture={toggleTheme}
                toggled={theme === "dark" ? true : false}
                duration={500}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                title="Переключить тему"
            />
        </HeaderWrapper>
    );
};
