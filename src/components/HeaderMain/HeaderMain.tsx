import AdressBookImg from "../../materials/adressBook.svg";
import MainLogoImg from "../../materials/logo.svg";
import { ExternalLink } from "lucide-react";

import { Link } from "react-router-dom";
import {
    HeaderWrapper,
    MainLogo,
    SubLogo,
    SubLogoArchive,
} from "./StyledComponents";

export const HeaderMain = () => {
    return (
        <>
            <HeaderWrapper>
                <Link to="/">
                    <>
                        <MainLogo src={MainLogoImg} alt="ГазСтройПром" />
                        <SubLogo src={AdressBookImg} alt="ГазСтройПром" />
                    </>
                </Link>
                <SubLogoArchive
                    href="https://intranet.gsprom.ru/phone-archive/"
                    target="_blank"
                    rel="noreferrer"
                >
                    Перейти в архивный справочник <ExternalLink size={15} />
                </SubLogoArchive>
            </HeaderWrapper>
        </>
    );
};
