import React, { useEffect, useState } from "react";
import "./SearchBar.css"; // стили вынесены отдельно
import axios from "axios";
import { EmployeesList } from "../types";
import Highlighter from "react-highlight-words";
import { styled } from "styled-components";

const CustomDatalist = styled.div`
    position: fixed;
    width: 50%;
    z-index: 10;
    margin-top: 5px;
    background-color: white;
`;

const CustomDatalistItem = styled.div`
    display: flex;
    flex-direction: column;
    height: 40px;
    margin-bottom: 2px;
    padding: 5px;
    border-radius: 10px;
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
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("fullName");
    const [listQuery, setListQuery] = useState<EmployeesList[]>([]);

    const handleInputChange = (e: string) => {
        setQuery(e);
    };

    const clearInput = () => {
        setQuery("");
    };

    const handleSearch = () => {
        if (query.trim()) {
            onSearch(query.trim(), category);
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

    // Обработка запроса при изменении debouncedQuery
    useEffect(() => {
        if (!debouncedQuery.trim()) return;

        async function fetchData() {
            try {
                const response = await axios.get(
                    `http://172.16.153.53:8001/employee/search?value=${debouncedQuery}&type=${category}&limit=10`
                );
                console.log("Results:", response.data.result);
                setListQuery(response.data.result);
            } catch (err) {
                console.error(err);
            }
        }

        fetchData();
    }, [debouncedQuery]);

    useEffect(() => {
        setListQuery([]);
        setQuery("");
    }, [category]);

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
                    />
                    {/* <datalist id="searchList">
                    {listQuery.map((item) =>
                        item.employees.map((employee) => (
                            <option
                                key={employee.id}
                                value={employee.fullNameRus}
                            >
                                <Highlighter
                                    searchWords={[query]}
                                    autoEscape={true}
                                    textToHighlight={`${employee.fullNameRus}`}
                                />
                            </option>
                        ))
                    )}
                </datalist> */}
                    <CustomDatalist>
                        {/* {[...Array(12)].map((_, i) => (
                            <div key={i} style={{ marginBottom: "2px" }}>
                                <Skeleton height={40} />
                            </div>
                        ))} */}
                        {listQuery.map((item) =>
                            item.employees.map((employee) => (
                                <CustomDatalistItem>
                                    <CustomDatalistItemHeader>
                                        {category === "fullName" ? (
                                            <Highlighter
                                                searchWords={[query]}
                                                autoEscape={true}
                                                textToHighlight={`${employee.fullNameRus}`}
                                                highlightStyle={{
                                                    backgroundColor: "#38b6b2",
                                                }}
                                            />
                                        ) : (
                                            employee.fullNameRus
                                        )}
                                    </CustomDatalistItemHeader>
                                    <CustomDatalistItemText>
                                        {employee.organizationName}
                                        {category === "email" &&
                                            employee.email && (
                                                <Highlighter
                                                    searchWords={[query]}
                                                    autoEscape={true}
                                                    textToHighlight={`, ${employee.email}`}
                                                    highlightStyle={{
                                                        backgroundColor:
                                                            "#38b6b2",
                                                    }}
                                                />
                                            )}
                                        {category === "phone" &&
                                            employee.telephoneNumberCorp && (
                                                <Highlighter
                                                    searchWords={[query]}
                                                    autoEscape={true}
                                                    textToHighlight={`, ${employee.telephoneNumberCorp}`}
                                                    highlightStyle={{
                                                        backgroundColor:
                                                            "#38b6b2",
                                                    }}
                                                />
                                            )}
                                        {category === "position" &&
                                            employee.positionTitle && (
                                                <Highlighter
                                                    searchWords={[query]}
                                                    autoEscape={true}
                                                    textToHighlight={`, ${employee.positionTitle}`}
                                                    highlightStyle={{
                                                        backgroundColor:
                                                            "#38b6b2",
                                                    }}
                                                />
                                            )}
                                    </CustomDatalistItemText>
                                </CustomDatalistItem>
                            ))
                        )}
                    </CustomDatalist>
                </div>
                {query && (
                    <button className="clear-button" onClick={clearInput}>
                        &times;
                    </button>
                )}
            </div>

            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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

export default SearchBar;
