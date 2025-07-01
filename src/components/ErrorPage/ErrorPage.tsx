import styled from "styled-components";
import { CustomButton } from "../StyledComponents";
import { useNavigate } from "react-router-dom";

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

const ErrorHeader = styled.h1`
    color: ${(props) => props.theme.mainTextColor};
`;

const ErrorDescription = styled.h3`
    color: ${(props) => props.theme.mainTextColor};
`;

export const ErrorPage = () => {
    const navigate = useNavigate();
    return (
        <ErrorPageWrapper>
            <div>
                <HeaderErr>
                    <ErrorHeader>Произошла ошибка</ErrorHeader>
                    <ErrorDescription>
                        Мы уже в курсе проблемы и занимаемся её решением
                    </ErrorDescription>
                    <CustomButton height="40px" onClick={() => navigate("/")}>
                        Вернуться на главную
                    </CustomButton>
                </HeaderErr>
            </div>
        </ErrorPageWrapper>
    );
};
