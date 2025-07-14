import AdressBookImg from "../../assets/adressBook.svg";
import MainLogoImg from "../../assets/logo.svg";

import { Link, useNavigate } from "react-router-dom";
import {
    CustomToggle,
    HeaderWrapper,
    LogoContainer,
    LogoWrapper,
    MainLogo,
    SubLogo,
} from "./StyledComponents";
import "@theme-toggles/react/css/Classic.css";
import { useThemeStore } from "../../store/useThemeStore";
import { useOrgStore } from "../../store/organizationStore";

export const HeaderMain = () => {
    const navigate = useNavigate();
    const toggleTheme = useThemeStore((state) => state.toggleTheme);
    const theme = useThemeStore((state) => state.theme);
    const selectOrg = useOrgStore((state) => state.selectOrg);

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
                <Link to="/">
                    <LogoContainer
                        onClick={() => {
                            selectOrg(
                                "7842155505",
                                "9c685cfe-e9a0-11e8-90f2-0050569026ba",
                                "false"
                            );
                        }}
                    >
                        <MainLogo src={MainLogoImg} alt="ГазСтройПром" />
                        <SubLogo src={AdressBookImg} alt="ГазСтройПром" />
                    </LogoContainer>
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
