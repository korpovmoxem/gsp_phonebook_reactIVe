import { styled } from "styled-components";

// Стилизация самого searchBar
export const SearchComponent = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    border: 1px solid #eeeeee;
    border-radius: 10px;
    overflow: hidden;
    font-family: sans-serif;
    margin: 10px;
    :focus-within {
        border-color: #007bff;
    }
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
    background: #ffffff;
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
    border: none;
    width: 100px;
    border-left: 1px solid #ccc;
    padding: 16px 20px;
    background-color: #0d67a1;
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
    width: 50%;
    z-index: 10;
    margin-top: 5px;
    background-color: rgb(226, 226, 226);
    -webkit-box-shadow: 10px 15px 25px -15px rgba(34, 60, 80, 0.75);
    -moz-box-shadow: 10px 15px 25px -15px rgba(34, 60, 80, 0.75);
    box-shadow: 10px 15px 25px -15px rgba(34, 60, 80, 0.75);
    :last-child {
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        margin-bottom: 0;
    }
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
`;

export const CustomDatalistItem = styled.div`
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 40px;
    margin-bottom: 2px;
    padding: 5px;
    background-color: white;
    &:hover {
        background-color: #f8f8ff;
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
