import React, { useEffect, useState } from "react";
import "./SearchBar.css"; // стили вынесены отдельно
import axios from "axios";

interface Props {
    onSearch: (query: string, category: string) => void;
}
export const SearchBar = ({ onSearch }: Props) => {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("all");

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
                    `http://172.16.153.53:8001/employee/search?value=${debouncedQuery}&type=fullName&limit=10`
                );
                console.log("Results:", response.data.results);
            } catch (err) {
                console.error(err);
            }
        }

        fetchData();
    }, [debouncedQuery]);

    return (
        <div className="search-component">
            <div className="search-input-wrapper">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="search-input"
                    placeholder="Введите..."
                />
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
                <option value="name">ФИО</option>
                <option value="phone">Телефон</option>
                <option value="department">Email</option>
                <option value="department">Должность</option>
            </select>

            <button className="search-button" onClick={handleSearch}>
                Поиск
            </button>
        </div>
    );
};

export default SearchBar;
