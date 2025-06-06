import React, { useEffect, useRef, useState } from "react";
import "./SearchBar.css"; // стили вынесены отдельно
import axios from "axios";
import { CATEGORIES, Employee, EmployeesList } from "../types";
import Highlighter from "react-highlight-words";
import { styled } from "styled-components";
import { useOrgStore } from "../store/organizationStore";
import { useNavigate, useSearchParams } from "react-router-dom";

const CustomDatalist = styled.div`
    position: fixed;
    width: 50%;
    z-index: 10;
    margin-top: 5px;
    background-color: rgb(226, 226, 226);
    -webkit-box-shadow: 0px 9px 8px 6px rgba(34, 60, 80, 0.2);
    -moz-box-shadow: 0px 9px 8px 6px rgba(34, 60, 80, 0.2);
    box-shadow: 0px 9px 8px 6px rgba(34, 60, 80, 0.2);
`;

const CustomDatalistItem = styled.div`
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

const CustomDatalistItemHeader = styled.span`
    margin-left: 20px;
    font-size: 15px;
`;

const CustomDatalistItemText = styled.span`
    margin: 0 0 0 20px;
    font-size: 12px;
    color: grey;
`;

interface Props {
    onSearch: (query: string, category: string) => void;
}

export const SearchBar = ({ onSearch }: Props) => {
    const [listQuery, setListQuery] = useState<EmployeesList[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    //////////////////
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("value") || "");
    const [category, setCategory] = useState<CATEGORIES>(
        (searchParams.get("category") as CATEGORIES) || "fullName"
    );
    /////////////////

    const navigate = useNavigate();

    const { fetchEmployeesWithParams } = useOrgStore();

    const handleInputChange = (e: string) => {
        setQuery(e);
        if (!isNaN(Number(e)) && e !== "") {
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
    };

    const handleSearch = () => {
        if (query.trim()) {
            onSearch(query.trim(), category);
            fetchEmployeesWithParams(query, category);
            navigate(`/employee/search?value=${query}&type=${category}`);
        } else {
            alert("Введите запрос");
        }
    };

    const useDebouncedValue = (value: string, delay: number) => {
        const [debouncedValue, setDebouncedValue] = useState(value);

        useEffect(() => {
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);

            return () => clearTimeout(handler); // очистка таймера при каждом новом значении value
        }, [value, delay]);

        return debouncedValue;
    };

    const debouncedQuery = useDebouncedValue(query, 500); // Задержка 500 мс

    const handleChange = (value: string) => {
        setQuery(value);
    };

    const handleClickItem = (item: Employee) => {
        setIsOpen(false);
        console.log(item);
    };

    // Обработка запроса при изменении debouncedQuery
    useEffect(() => {
        if (!debouncedQuery.trim()) {
            setListQuery([]);
            return;
        }

        async function fetchData() {
            try {
                if (debouncedQuery.length >= 2) {
                    const response = await axios.get(
                        `http://172.16.153.53:8001/employee/search?value=${debouncedQuery}&type=${category}&limit=10`
                    );
                    console.log("Results:", response.data.result);
                    setListQuery(response.data.result);
                    setIsOpen(true);
                } else {
                    setListQuery([]);
                }
            } catch (err) {
                console.error(err);
            }
        }

        fetchData();
    }, [debouncedQuery]);

    // useEffect(() => {
    // setListQuery([]);
    // setQuery("");
    // }, [category]);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (
            containerRef.current &&
            !containerRef.current.contains(event.target as Node) &&
            inputRef.current &&
            !inputRef.current.contains(event.target as Node)
        ) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    console.log("+_+_+_+_+_+_+_+_+_+_+_+");
    console.log(listQuery);

    return (
        <div className="search-component">
            <div className="search-input-wrapper">
                <div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => handleInputChange(e.target.value)}
                        className="search-input"
                        placeholder="Введите..."
                        list="searchList"
                        onFocus={() => setIsOpen(true)}
                        ref={inputRef}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearch();
                            }
                        }}
                    />
                </div>
                {query && (
                    <button className="clear-button" onClick={clearInput}>
                        ×
                    </button>
                )}
            </div>

            <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CATEGORIES)}
                className="search-select"
            >
                <option value="fullName">ФИО</option>
                <option value="phone">Телефон</option>
                <option value="email">Email</option>
                <option value="position">Должность</option>
            </select>

            <button className="search-button" onClick={handleSearch}>
                Поиск
            </button>
        </div>
    );
};
