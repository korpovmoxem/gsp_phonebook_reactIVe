import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { OrgSidebar } from "./components/OrgSidebar/OrgSidebar";
import { EmployeeList } from "./components/EmployeesTable/EmployeeList";
import { ToastContainer } from "react-toastify";
import { HeaderMain } from "./components/HeaderMain/HeaderMain";
import {
    MainWrapper,
    ContentWrapper,
    FAB,
} from "./components/StyledComponents";
import { ErrorPage } from "./components/ErrorPage/ErrorPage";
import { Footer } from "./components/Footer/Footer";
import { useOrgStore } from "./store/organizationStore";
import { EmployeeInfoModal } from "./components/EmployeesTable/EmployeeInfoModal/EmployeeInfoModal";
import { EditInformationModal } from "./components/EmployeesTable/EmployeeInfoModal/EditInformationModal";
import { HelpModal } from "./components/HelpModal";
import { SearchBar } from "./components/SearchBar/SearchBar";

function App() {
    const [isHelpOpen, setIsHelpOpen] = React.useState(false);
    const isEmployeeInfoModalOpen = useOrgStore(
        (state) => state.isEmployeeInfoModalOpen
    );
    const isEditInformation = useOrgStore((state) => state.isEditInformation);

    // Функция для отображения ErrorPage
    const showCustomErrorPage = () => {
        const rootElement = document.getElementById("root");
        if (!rootElement) return;

        const errorRoot = document.createElement("div");
        errorRoot.id = "error-root";
        rootElement.innerHTML = "";
        rootElement.appendChild(errorRoot);

        const root = ReactDOM.createRoot(errorRoot);
        root.render(<ErrorPage />);
    };

    // При появлении ошибок реакта переходть на страницу с ошибкой
    window.onerror = function (message, source, lineno, colno, error) {
        // Перейти на страницу ошибки
        window.location.href = "/err";
    };
    window.addEventListener("unhandledrejection", function (event) {
        // Перейти на страницу ошибки при Promise-ошибках
        window.location.href = "/err";
    });

    return (
        <BrowserRouter>
            <MainWrapper>
                <HeaderMain />

                <Routes>
                    <Route
                        path="/*"
                        element={
                            <ContentWrapper>
                                <OrgSidebar />
                                <EmployeeList />
                            </ContentWrapper>
                        }
                    />
                    <Route path="/err" element={<ErrorPage />} />
                </Routes>

                <Footer />
                <FAB title="Помощь" onClick={() => setIsHelpOpen(true)}>
                    ?
                </FAB>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    theme="light"
                />
                {isEmployeeInfoModalOpen && <EmployeeInfoModal />}
                {isEditInformation && <EditInformationModal />}
                {isHelpOpen && (
                    <HelpModal onClose={() => setIsHelpOpen(false)} />
                )}
            </MainWrapper>
        </BrowserRouter>
    );
}

export default App;
