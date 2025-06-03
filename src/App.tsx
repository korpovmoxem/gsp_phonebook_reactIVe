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
import SearchBar from "./components/SearchBar";
import { ExternalLink } from "lucide-react";

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

function App() {
    const handleSearch = (a: string, b: string) => {
        console.log(a, b);
    };

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
                        Перейти в архивный справочник <ExternalLink size={15} />
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
    );
}

export default App;
