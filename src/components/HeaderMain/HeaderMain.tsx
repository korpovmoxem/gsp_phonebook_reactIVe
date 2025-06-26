import AdressBookImg from "../../materials/adressBook.svg";
import MainLogoImg from "../../materials/logo.svg";

import { Link, useNavigate } from "react-router-dom";
import { HeaderWrapper, MainLogo, SubLogo } from "./StyledComponents";

export const HeaderMain = () => {
    const navigate = useNavigate();

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
        <>
            <HeaderWrapper>
                <Link to="/#">
                    <>
                        <MainLogo src={MainLogoImg} alt="ГазСтройПром" />
                        <SubLogo src={AdressBookImg} alt="ГазСтройПром" />
                    </>
                </Link>
            </HeaderWrapper>
        </>
    );
};
