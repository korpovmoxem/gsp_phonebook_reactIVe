import { css, keyframes, styled } from "styled-components";

// Анимация тени
const highlightShadow = keyframes`
  0% {
    box-shadow: 0 0 0 7px rgba(0, 123, 255, 0);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(0, 123, 255, 0.6);
  }
  100% {
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0);
  }
`;

interface SearchComponentProps {
    $isAnimated?: boolean;
}

// Стилизация самого searchBar
export const SearchComponent = styled.div<SearchComponentProps>`
    display: flex;
    width: 100%;
    align-items: center;
    background: #0d67a1;
    place-items: stretch;
    border-radius: 10px;
    overflow: hidden;
    font-family: sans-serif;
    border: 2px solid #0d67a1;
    margin: 10px;
    :focus-within {
        border-color: #007bff;
    }

    ${({ $isAnimated }) =>
        $isAnimated &&
        css`
            animation: ${highlightShadow} 0.5s ease-in-out;
        `}
`;

export const SearchInputWrapper = styled.div`
    position: relative;
    flex-grow: 1;
`;

export const SearchInput = styled.input`
    width: 100%;
    padding: 15px 40px 15px 15px;
    border: none;
    outline: none;
    background: ${(props) => props.theme.backgroundSearh};
    color: ${(props) => props.theme.mainTextColor};
    transition: all 0.5s ease;
    box-sizing: border-box;
`;

export const ClearButton = styled.button`
    position: absolute;
    right: 6px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    font-size: 16px;
    color: #888;
    cursor: pointer;
`;

export const SearchSelect = styled.select`
    border: none;
    border-left: 1px solid #ccc;
    padding: 15px;
    background: ${(props) => props.theme.backgroundSearh};
    color: ${(props) => props.theme.mainTextColor};
    transition: all 0.5s ease;
    cursor: pointer;
`;

export const CustomSelect = styled(SearchSelect)`
    appearance: none; /* скрываем стандартную стрелочку */
    -webkit-appearance: none;
    -moz-appearance: none;

    /* Добавляем кастомную стрелочку, чтобы сделать отступ справа */
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'><polyline points='1,1 6,6 11,1' stroke='black' stroke-width='1' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>");
    padding-right: 3em; /* отступ от стрелки */
    background-repeat: no-repeat;
    background-position: right 1em center;
    background-size: 1em;
`;

export const SearchButton = styled.button`
    border: 1px solid #076eb5;
    width: 100px;
    padding: 16px 20px;
    background-color: #076eb5;
    color: white;
    cursor: pointer;
    :hover {
        background-color: #0056b3;
        -webkit-box-shadow: 7px 0px 15px 0px rgba(73, 133, 178, 0.9);
        -moz-box-shadow: 7px 0px 15px 0px rgba(73, 133, 178, 0.9);
        box-shadow: 7px 0px 15px 0px rgba(73, 133, 178, 0.9);
    }
`;

////////////

export const CustomDatalist = styled.div`
    position: fixed;
    width: 60%;
    z-index: 10;
    margin-top: 5px;
    background-color: ${(props) => props.theme.backgroundBlock};
    -webkit-box-shadow: 10px 15px 25px -15px ${(props) => props.theme.shadowColor};
    -moz-box-shadow: 10px 15px 25px -15px ${(props) => props.theme.shadowColor};
    box-shadow: 10px 15px 25px -15px ${(props) => props.theme.shadowColor};
    :last-child {
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        margin-bottom: 0;
    }
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;

    @media (height<800px) {
        max-height: 400px;
        overflow: auto;
    }
`;

export const CustomDatalistItem = styled.div`
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 40px;
    margin-bottom: 2px;
    padding: 5px;
    background-color: ${(props) => props.theme.backgroundSearchItem};
    color: ${(props) => props.theme.mainTextColor};
    &:hover {
        background-color: ${(props) => props.theme.backgroundRowHover};
    }
`;

export const CustomDatalistItemHeader = styled.span`
    margin-left: 20px;
    font-size: 15px;
`;

export const CustomDatalistItemText = styled.span`
    margin: 0 0 0 20px;
    font-size: 12px;
    color: grey;
`;

export const InputWrapper = styled.div`
    background: ${(props) => props.theme.backgroundSearh};
    transition: all 0.5s ease;
    height: 100%;
    align-content: center;
`;

export const MoreButtonContainer = styled.div`
    padding: 5px;
    text-align: center;
    cursor: pointer;
    width: 99%;

    &:hover {
        background-color: ${(props) => props.theme.backgroundRowHover};
    }
`;

export const MoreButton = styled.button`
    all: unset;
    width: 99%;
    font-weight: 700;
    color: ${(props) => props.theme.mainTextColor};
`;
