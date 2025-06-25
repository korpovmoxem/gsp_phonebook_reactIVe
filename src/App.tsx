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

    // Глобальная обработка ошибок
    useEffect(() => {
        const handleError = (event: ErrorEvent | PromiseRejectionEvent) => {
            event.preventDefault(); // Предотвращаем стандартное поведение
            console.error("Ошибка перехвачена, показываем ErrorPage", event);
            showCustomErrorPage();
        };

        // Обработка обычных ошибок
        window.onerror = (message, source, lineno, colno, error) => {
            handleError({ preventDefault: () => {} } as ErrorEvent);
            return true; // предотвращаем дальнейшее распространение
        };

        // Обработка unhandledrejection
        window.onunhandledrejection = handleError;

        return () => {
            window.onerror = null;
            window.onunhandledrejection = null;
        };
    }, []);

    try {
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
    } catch {
        return <ErrorPage />;
    }
}

export default App;
