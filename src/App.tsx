import { BrowserRouter } from "react-router-dom";
import { OrgSidebar } from "./components/OrgSidebar";
import styled from "styled-components";
// import { EmployeeList } from './components/EmployeeList';

const MainWrapper = styled.div`
    display: flex;
    flex-direction: row;
    height: calc(100vh - 170px);
    margin-top: 170px; //Удалить после добавления шапки
`;

function App() {
    return (
        <BrowserRouter>
            <MainWrapper>
                <OrgSidebar />
                {/* <EmployeeList /> */}
            </MainWrapper>
        </BrowserRouter>
    );
}

export default App;
