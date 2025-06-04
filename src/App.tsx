import {
    BrowserRouter,
    Route,
    Router,
    Routes,
    useNavigate,
} from "react-router-dom";
import { OrgSidebar } from "./components/OrgSidebar";
import styled from "styled-components";
import MainLogo from "./materials/logo.svg";
import AdressBook from "./materials/adressBook.svg";
import { EmployeeList } from "./components/EmployeeList";
import { ToastContainer, Bounce } from "react-toastify";
import { SearchBar } from "./components/SearchBar";
import { ExternalLink } from "lucide-react";
import Shepherd from "shepherd.js";
import { useEffect, useState } from "react";

const MainWrapper = styled.div`
    margin: auto;
    max-width: 85%;
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: row;
    height: calc(100vh - 200px);
`;

const SearchWrapper = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
`;

const FAB = styled.button`
    cursor: pointer;
    position: fixed;
    bottom: 70px;
    right: 70px;
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

function App() {
    const handleSearch = (a: string, b: string) => {
        console.log(a, b);
    };

    // Подключить, если потребуется интерактивный тур
    // TODO: разобраться с ошибками в модуле
    // const [showTour, setShowTour] = useState(true);
    // useEffect(() => {
    //     if (showTour) {
    //         const tour = new Shepherd.Tour({
    //             // создаём новый тур
    //             defaultStepOptions: {
    //                 classes: "shadow-md bg-white rounded-lg p-4",
    //                 scrollTo: true,
    //             },
    //         });

    //         // добавляем шаги в тур
    //         tour.addStep({
    //             id: "intro-step",
    //             title: "Добро пожаловать в телефонный справочник 2.0!",
    //             text: "Хотите пройти вводный курс по его использоанию?",
    //             attachTo: { element: MainWrapper },
    //             buttons: [
    //                 {
    //                     action: () => tour.next(), // Кнопка назад
    //                     text: "Да",
    //                 },
    //                 {
    //                     action: () => tour.cancel(),
    //                     text: "Нет",
    //                 },
    //             ],
    //         });

    //         // tour.addStep("first-step", {
    //         //     title: "Первая страница",
    //         //     text: "Это главная страница приложения.",
    //         //     attachTo: "#main-page top", // Привяжем второе окно сверху главной страницы
    //         //     buttons: [
    //         //         {
    //         //             action: () => tour.back(), // Кнопка назад
    //         //             text: "Назад",
    //         //         },
    //         //         {
    //         //             action: () => tour.next(),
    //         //             text: "Далее",
    //         //         },
    //         //     ],
    //         // });

    //         tour.start(); // стартуем тур
    //     }
    // }, []); // перезапускаем эффект при изменении showTour

    return (
        <>
            <BrowserRouter>
                <MainWrapper>
                    <div
                        style={{
                            padding: "10px",
                            display: "flex",
                            flexDirection: "column",
                            maxWidth: "250px",
                        }}
                    >
                        <a href="/">
                            <>
                                <img
                                    style={{ marginBottom: "20px" }}
                                    src={MainLogo}
                                    alt="ГазСтройПром"
                                />
                                <img
                                    src={AdressBook}
                                    alt="ГазСтройПром"
                                    style={{ width: "-webkit-fill-available" }}
                                />
                            </>
                        </a>
                        <a
                            href="https://intranet.gsprom.ru/phone-archive/"
                            target="_blank"
                            rel="noreferrer"
                            style={{
                                textDecoration: "none",
                                color: "#1d75bb9c",
                                fontSize: "15px",
                            }}
                        >
                            Перейти в архивный справочник{" "}
                            <ExternalLink size={15} />
                        </a>
                    </div>
                    <SearchWrapper>
                        {/* <input />
                    <button /> */}
                        <SearchBar onSearch={handleSearch} />
                    </SearchWrapper>
                    <ContentWrapper>
                        <OrgSidebar />
                        <EmployeeList />
                    </ContentWrapper>
                </MainWrapper>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                    transition={Bounce}
                />
            </BrowserRouter>
            <FAB title="Помощь">?</FAB>
        </>
    );
}

export default App;
