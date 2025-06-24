import { useEffect, useRef, useState } from "react";
import { CATEGORIES, Employee } from "../../types";
import Highlighter from "react-highlight-words";
import { useOrgStore } from "../../store/organizationStore";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ClipboardCopy, ExternalLink } from "lucide-react";
import { toast } from "react-toastify";
import {
    ClearButton,
    CustomDatalist,
    CustomDatalistItem,
    CustomDatalistItemHeader,
    CustomDatalistItemText,
    CustomSelect,
    SearchButton,
    SearchComponent,
    SearchInput,
    SearchInputWrapper,
} from "./StyledComponents";
import { SearchedItemsSkeleton } from "./SearchedItemsSkeleton";

export const SearchBar = () => {
    const [isOpen, setIsOpen] = useState(false);

    //////////////////
    const [searchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("value") || "");
    const [category, setCategory] = useState<CATEGORIES>(
        (searchParams.get("category") as CATEGORIES) || "fullName"
    );

    const navigate = useNavigate();

    const fetchEmployeesWithParams = useOrgStore(
        (state) => state.fetchEmployeesWithParams
    );
    const setIsEmployeeInfoModalOpen = useOrgStore(
        (state) => state.setIsEmployeeInfoModalOpen
    );
    const isEmployeeInfoModalOpen = useOrgStore(
        (state) => state.isEmployeeInfoModalOpen
    );
    const fetchCurrentEmployeeInfo = useOrgStore(
        (state) => state.fetchCurrentEmployeeInfo
    );
    const employees = useOrgStore((state) => state.employees);
    const employeesList = useOrgStore((state) => state.employeesList);

    const isEmployeeForSearchBarLoading = useOrgStore(
        (state) => state.isEmployeeForSearchBarLoading
    );

    const EmployeesListLimit = useOrgStore((state) => state.EmployeesListLimit);
    const fetchEmployeeForSearchBar = useOrgStore(
        (state) => state.fetchEmployeeForSearchBar
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
    };

    const handleSearch = () => {
        if (query.trim()) {
            setIsOpen(false);
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

    const handleClickItem = (item: Employee) => {
        setIsOpen(false);
        setQuery(item.fullNameRus);
        setIsEmployeeInfoModalOpen(!isEmployeeInfoModalOpen);
        fetchCurrentEmployeeInfo(item.id, item.organizationId);
    };

    // Обработка запроса при изменении debouncedQuery
    useEffect(() => {
        async function fetchData() {
            fetchEmployeeForSearchBar(debouncedQuery, category);
            if (debouncedQuery.length >= 2) {
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }
        }

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category, debouncedQuery]);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleFocus = () => {
        if (debouncedQuery.length >= 2) {
            setIsOpen(true);
        }
    };

    // Закрытие результатов поиска при клике вне контейнера
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

    return (
        <>
            <SearchComponent
                style={{
                    border: "2px solid #0d67a1",
                }}
            >
                <SearchInputWrapper>
                    <div
                        style={{
                            background: "white",
                            height: "100%",
                            alignContent: "center",
                        }}
                    >
                        <SearchInput
                            type="text"
                            value={query}
                            onChange={(e) => handleInputChange(e.target.value)}
                            placeholder="Введите запрос..."
                            list="searchList"
                            onFocus={handleFocus}
                            ref={inputRef}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSearch();
                                }
                            }}
                            maxLength={70}
                        />

                        {isOpen && (
                            <>
                                <CustomDatalist ref={containerRef}>
                                    {isEmployeeForSearchBarLoading ? (
                                        <SearchedItemsSkeleton />
                                    ) : (
                                        <>
                                            {EmployeesListLimit.length > 0 ? (
                                                EmployeesListLimit.map((item) =>
                                                    item.departments.map(
                                                        (departmnt) =>
                                                            departmnt.employees.map(
                                                                (employee) => (
                                                                    <CustomDatalistItem
                                                                        onClick={() =>
                                                                            handleClickItem(
                                                                                employee
                                                                            )
                                                                        }
                                                                    >
                                                                        <CustomDatalistItemHeader>
                                                                            {category ===
                                                                            "fullName" ? (
                                                                                <Highlighter
                                                                                    searchWords={[
                                                                                        query,
                                                                                    ]}
                                                                                    autoEscape={
                                                                                        true
                                                                                    }
                                                                                    textToHighlight={`${employee.fullNameRus}`}
                                                                                    highlightStyle={{
                                                                                        backgroundColor:
                                                                                            "#b2dff7",
                                                                                    }}
                                                                                />
                                                                            ) : (
                                                                                employee.fullNameRus
                                                                            )}
                                                                        </CustomDatalistItemHeader>
                                                                        <CustomDatalistItemText>
                                                                            {
                                                                                employee.organizationName
                                                                            }
                                                                            {category ===
                                                                                "email" &&
                                                                                employee.email && (
                                                                                    <Highlighter
                                                                                        searchWords={[
                                                                                            query,
                                                                                        ]}
                                                                                        autoEscape={
                                                                                            true
                                                                                        }
                                                                                        textToHighlight={`, ${employee.email}`}
                                                                                        highlightStyle={{
                                                                                            backgroundColor:
                                                                                                "#b2dff7",
                                                                                        }}
                                                                                    />
                                                                                )}
                                                                            {category ===
                                                                                "phone" &&
                                                                                employee.telephoneNumberCorp && (
                                                                                    <Highlighter
                                                                                        searchWords={[
                                                                                            query,
                                                                                        ]}
                                                                                        autoEscape={
                                                                                            true
                                                                                        }
                                                                                        textToHighlight={`, ${employee.telephoneNumberCorp}`}
                                                                                        highlightStyle={{
                                                                                            backgroundColor:
                                                                                                "#b2dff7",
                                                                                        }}
                                                                                    />
                                                                                )}
                                                                            {category ===
                                                                                "position" &&
                                                                                employee.positionTitle && (
                                                                                    <Highlighter
                                                                                        searchWords={[
                                                                                            query,
                                                                                        ]}
                                                                                        autoEscape={
                                                                                            true
                                                                                        }
                                                                                        textToHighlight={`, ${employee.positionTitle}`}
                                                                                        highlightStyle={{
                                                                                            backgroundColor:
                                                                                                "#b2dff7",
                                                                                        }}
                                                                                    />
                                                                                )}
                                                                        </CustomDatalistItemText>
                                                                    </CustomDatalistItem>
                                                                )
                                                            )
                                                    )
                                                )
                                            ) : (
                                                <>
                                                    {query.length > 2 && (
                                                        <CustomDatalistItem>
                                                            По данным критериям
                                                            сотрудники не
                                                            найдены
                                                        </CustomDatalistItem>
                                                    )}
                                                </>
                                            )}
                                        </>
                                    )}
                                </CustomDatalist>
                            </>
                        )}
                    </div>
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
            {/* <span
                style={{
                    alignSelf: "center",
                    cursor: "pointer",
                    display: "flex",
                }}
                title="Скопировать Email всех найденных сотрудников"
                onClick={() => handleClickCopyEmails()}
            >
                <ClipboardCopy size={30} stroke="#1d75bb" />
            </span> */}
            {/* <span
                title="Перейти в архивный справочник"
                style={{
                    alignSelf: "center",
                    cursor: "pointer",
                    display: "flex",
                }}
            >
                <a
                    href="https://intranet.gsprom.ru/phone-archive/"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                        textDecoration: "none",
                        color: "#1d75bb",
                    }}
                >
                    <ExternalLink size={30} />
                </a>
            </span> */}
        </>
    );
};
