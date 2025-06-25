import styled from "styled-components";
import background from "../../assets/Err.png";

const HeaderErr = styled.div`
    padding-top: 5%;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: rgb(43, 43, 43);
`;

const ErrorPageWrapper = styled.div`
    height: calc(100vh - 150px);
`;

export const ErrorPage = () => {
    console.log("Error Page render");
    return (
        <ErrorPageWrapper>
            <div>
                <HeaderErr>
                    <h1>Произошла ошибка</h1>
                    <h3>Мы уже в курсе проблемы и занимаемся её решением</h3>
                </HeaderErr>
            </div>
        </ErrorPageWrapper>
    );
};
