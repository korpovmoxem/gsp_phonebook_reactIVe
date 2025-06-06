import { useState } from "react";
import styled from "styled-components";
import { CATEGORIES } from "../types";
import { useNavigate, useSearchParams } from "react-router-dom";

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    margin: 15px 0;
`;

const Input = styled.input`
    padding: 8px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-right: 10px;
    width: 250px;
`;

const Select = styled.select`
    padding: 8px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-right: 10px;
`;

const Button = styled.button`
    padding: 8px 12px;
    background-color: #1d75bb;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: #155d99;
    }
`;

interface Props {
    onSearch?: (value: string, category: CATEGORIES) => void;
}

export const SearchBar = ({ onSearch }: Props) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState(
        searchParams.get("value") || ""
    );
    const [category, setCategory] = useState<CATEGORIES>(
        (searchParams.get("type") as CATEGORIES) || "fullName"
    );

    const handleSearch = () => {
        navigate(`/?value=${searchValue}&type=${category}`);
        onSearch?.(searchValue, category);
    };

    return (
        <Wrapper>
            <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Поиск..."
            />
            <Select
                value={category}
                onChange={(e) => setCategory(e.target.value as CATEGORIES)}
            >
                <option value="fullName">ФИО</option>
                <option value="email">Email</option>
                <option value="phoneNumber">Телефон</option>
            </Select>
            <Button onClick={handleSearch}>Поиск</Button>
        </Wrapper>
    );
};
