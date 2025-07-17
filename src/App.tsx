import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { OrgSidebar } from "./components/OrgSidebar/OrgSidebar";
import { EmployeeList } from "./components/EmployeesTable/EmployeeList";
import { ToastContainer } from "react-toastify";
import { HeaderMain } from "./components/HeaderMain/HeaderMain";
import {
    MainWrapper,
    ContentWrapper,
    RootWrapper,
} from "./components/StyledComponents";
import { ErrorPage } from "./components/ErrorPage/ErrorPage";
import { Footer } from "./components/Footer/Footer";
import { useOrgStore } from "./store/organizationStore";
import { EmployeeInfoModal } from "./components/EmployeesTable/EmployeeInfoModal/EmployeeInfoModal";
import { EditInformationModal } from "./components/EmployeesTable/EmployeeInfoModal/EditInformationModal";
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./theme/themes";
import { useThemeStore } from "./store/useThemeStore";

function App() {
    const isEmployeeInfoModalOpen = useOrgStore(
        (state) => state.isEmployeeInfoModalOpen
    );
    const isEditInformation = useOrgStore((state) => state.isEditInformation);

    const { theme } = useThemeStore();
    const currentTheme = theme === "light" ? lightTheme : darkTheme;

    return (
        <BrowserRouter>
            <ThemeProvider theme={currentTheme}>
                <RootWrapper>
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

                        <ToastContainer
                            position="top-right"
                            autoClose={5000}
                            theme="light"
                        />
                        {isEmployeeInfoModalOpen && <EmployeeInfoModal />}
                        {isEditInformation && <EditInformationModal />}
                    </MainWrapper>
                </RootWrapper>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
