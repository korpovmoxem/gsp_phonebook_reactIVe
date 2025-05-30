import { BrowserRouter } from "react-router-dom";
import { OrgSidebar } from "./components/OrgSidebar";
import styled from "styled-components";
import MainLogo from "./materials/logo.svg";
import AdressBook from "./materials/adressBook.svg";
import { EmployeeList } from "./components/EmployeeList";
import { ToastContainer, Bounce } from "react-toastify";

const MainWrapper = styled.div`
    margin: auto;
    max-width: 85%;
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: row;
    height: calc(100vh - 100px);
`;

function App() {
    return (
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
                    <img src={MainLogo} alt="ГазСтройПром" />
                    <img
                        src={AdressBook}
                        alt="ГазСтройПром"
                        style={{ fill: "red" }}
                    />
                </div>
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
    );
}

export default App;
