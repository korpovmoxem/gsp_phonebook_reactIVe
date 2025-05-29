import { BrowserRouter } from "react-router-dom";
import { OrgSidebar } from "./components/OrgSidebar";
import styled from "styled-components";
import MainLogo from "./materials/logo.svg";
import AdressBook from "./materials/adressBook.svg";
import { EmployeeList } from "./components/EmployeeList";

const MainWrapper = styled.div`
    display: flex;
    flex-direction: row;
    height: calc(100vh - 170px);
    margin-top: 80px; //Удалить после добавления шапки
`;

function App() {
    return (
        <BrowserRouter>
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
            <MainWrapper>
                <OrgSidebar />
                <EmployeeList />
            </MainWrapper>
        </BrowserRouter>
    );
}

export default App;
