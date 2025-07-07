import { useEffect, useRef, useState } from "react";
import { CATEGORIES } from "../../types";
import Highlighter from "react-highlight-words";
import { useOrgStore } from "../../store/organizationStore";
import {
    ClearButton,
    CustomSelect,
    InputWrapper,
    SearchButton,
    SearchComponent,
    SearchInput,
    SearchInputWrapper,
} from "./StyledComponents";
import { toast } from "react-toastify";

export const SearchBarForExcel = () => {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState<CATEGORIES>("fullName");

    const fetchEmployeesWithParams = useOrgStore(
        (state) => state.fetchEmployeesWithParams
    );

    const handleInputChange = (e: string) => {
        setQuery(e);
        if (!isNaN(Number(e)) && e !== "" && e !== " ") {
            setCategory("phone");
        } else if (e.indexOf("@") !== -1) {
            setCategory("email");
        }
        if (e === "" && category !== "position") {
            setCategory("fullName");
        }
    };

    const clearInput = () => {
        setQuery("");
        setCategory("fullName");
    };

    const handleSearch = () => {
        if (query.trim()) {
            fetchEmployeesWithParams(query, category);
        } else {
            toast.error("Введите запрос");
        }
    };

    return (
        <SearchComponent>
            <SearchInputWrapper>
                <InputWrapper>
                    <SearchInput
                        type="text"
                        value={query}
                        onChange={(e) => handleInputChange(e.target.value)}
                        placeholder="Введите запрос..."
                        list="searchList"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearch();
                            }
                        }}
                        maxLength={70}
                    />
                </InputWrapper>
                {query && <ClearButton onClick={clearInput}>×</ClearButton>}
            </SearchInputWrapper>

            <CustomSelect
                value={category}
                onChange={(e) => setCategory(e.target.value as CATEGORIES)}
            >
                <option value="fullName">ФИО</option>
                <option value="phone">Телефон</option>
                <option value="email">Email</option>
                <option value="position">Должность</option>
            </CustomSelect>
            <SearchButton onClick={handleSearch}>Поиск</SearchButton>
        </SearchComponent>
    );
};
