import { BrowserRouter } from "react-router-dom";
import { OrgSidebar } from "./components/OrgSidebar/OrgSidebar";
import styled from "styled-components";

import { EmployeeList } from "./components/EmployeesTable/EmployeeList";
import { ToastContainer, Bounce } from "react-toastify";
import { SearchBar } from "./components/SearchBar/SearchBar";

import { useState } from "react";
import { useOrgStore } from "./store/organizationStore";
import { EmployeeInfoModal } from "./components/EmployeesTable/EmployeeInfoModal/EmployeeInfoModal";
import { EditInformationModal } from "./components/EmployeesTable/EmployeeInfoModal/EditInformationModal";
import { HelpModal } from "./components/HelpModal";
import { HeaderMain } from "./components/HeaderMain/HeaderMain";
import {
    MainWrapper,
    SearchWrapper,
    ContentWrapper,
    FAB,
} from "./components/StyledComponents";

function App() {
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    const isEmployeeInfoModalOpen = useOrgStore(
        (state) => state.isEmployeeInfoModalOpen
    );

    const isEditInformation = useOrgStore((state) => state.isEditInformation);

    return (
        <>
            <BrowserRouter>
                <MainWrapper>
                    <HeaderMain />
                    <SearchWrapper>
                        <SearchBar />
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
                {isEmployeeInfoModalOpen && <EmployeeInfoModal />}
                {isEditInformation && <EditInformationModal />}
                {isHelpOpen && (
                    <HelpModal
                        onClose={() => {
                            setIsHelpOpen(false);
                        }}
                    />
                )}
            </BrowserRouter>
            <FAB title="Помощь" onClick={() => setIsHelpOpen(true)}>
                ?
            </FAB>
        </>
    );
}

export default App;
