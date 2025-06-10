import { useOrgStore } from "../store/organizationStore";
import styled from "styled-components";
import PhotoDefault from "../materials/photo.jpg";
import { ModalField } from "./ModalField";
import { CurrentEmployeeInfo } from "../types";
import { SpinnerCircular } from "spinners-react";
import {
    CloseButton,
    CustomButton,
    Modal2Background,
    ModalContainer,
    ModalContent,
    ModalHeader,
} from "./components";
import { CustomInputEditModal } from "./CustomInputEditModal";
import { useEffect, useRef, useState } from "react";

const CustomInputContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 70%;
    padding: 5px;
    background-color: rgb(220, 220, 220);
    border-bottom: 3px solid rgb(138, 138, 138);
    font-size: 12pt;

    &:focus-within {
        border-bottom: 3px solid #1d75bb;
        transition: all 0.7s ease-in-out;
    }
`;

const CustomLabel = styled.label`
    color: rgb(155, 155, 155);
    font-size: 10pt;

    &:focus-within {
        color: rgb(129, 129, 129);
        transition: all 0.1s ease-in-out;
    }
`;

const CustomInput = styled.input`
    background-color: unset;
    border: none;
    line-height: 20px;
    outline: none;
    margin: 5px 0 0 10px;
    padding: 0;

    &::placeholder {
        font-size: 12pt;
    }
`;

export const EditInformationModal: React.FC = () => {
    console.log("EditInformationModal");
    const {
        isEmployeeInfoModalOpen,
        setIsEmployeeInfoModalOpen,
        currentEmployeeInfo,
        fetchCurrentEmployeeInfo,
        isCurrentEmployeeLoading,
        isEditInformation,
        setIsEditInformation,
        fetchVerificatinCode,
        saveEmployeeInfo,
    } = useOrgStore();

    const [personalMobile, setPersonalMobile] = useState("");
    const [cityPhone, setCityPhone] = useState("");
    const [workPlace, setWorkPlace] = useState("");
    const [address, setAddress] = useState("");
    const [code, setCode] = useState("");

    const [isCheckboxOn, setIsCheckboxOn] = useState(false);

    const handleSendButton = () => {
        console.log("handleSendButton");
        saveEmployeeInfo(personalMobile, cityPhone, workPlace, address, code);
    };

    const containerRef = useRef<HTMLDivElement | null>(null);

    const handleClickOutside = (event: MouseEvent) => {
        console.log("handleClickOutside");
        console.log(event);
        console.log(containerRef);
        if (
            containerRef.current &&
            !containerRef.current.childNodes[0].contains(event.target as Node)
        ) {
            setIsEditInformation(false);
        }
    };

    const handleESCClick = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            setIsEditInformation(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleESCClick);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleESCClick);
        };
    }, []);

    return (
        <>
            <Modal2Background ref={containerRef}>
                <ModalContainer style={{ maxWidth: "800px" }}>
                    <ModalContent>
                        <ModalHeader>
                            <h3>Изменение данных о сотруднике</h3>
                            <CloseButton
                                onClick={() =>
                                    setIsEditInformation(!isEditInformation)
                                }
                            >
                                X
                            </CloseButton>
                        </ModalHeader>
                        {currentEmployeeInfo?.email ? (
                            <>
                                <div>
                                    <span>
                                        Для изменений данных сотрудника
                                        необходимо написать новую информацию в
                                        соответствующие поля или очистить поле
                                        для его удаления в карточке
                                    </span>
                                </div>
                                <br />
                                <div>
                                    <span>
                                        Для того, чтобы изменения вступили в
                                        силу необходимо запросить код проверки,
                                        который будет выслан на корпоративную
                                        почту сотрудника, вписать его в
                                        соответствующее поле и нажать
                                        "Сохранить". В день может быть отправлен
                                        только один код. Информацию разрешено
                                        менять один раз в день
                                    </span>
                                </div>
                                <br />
                            </>
                        ) : (
                            <>
                                <span>
                                    Электронная почта отсутствует. Изменение
                                    данных невозможно
                                </span>
                                <br />
                            </>
                        )}

                        <div>
                            <span>
                                Если ФИО, должность или подразделение сотрудника
                                указано не верно, необходимо обратиться к своему
                                кадровому работнику (куратору) для внесения
                                изменений в карточке 1С: ЗУП.
                            </span>
                        </div>
                        <br />
                        <div>
                            <span>
                                При необходимости изменить email или фотографию
                                профиля, необходимо создать{" "}
                                <a
                                    href="https://sd.gsprom.ru/portal/navigator-fields.html?service=slmService$2601911&amp;component=slmService$2603460&amp;category=serviceCateg$2601801&amp;route=serviceCall$request"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <b>
                                        заявку на Портале системы «Поддержка
                                        пользователей» / Телефонный справочник /
                                        Изменение данных пользователя
                                    </b>
                                </a>
                            </span>
                        </div>
                        {currentEmployeeInfo?.email && (
                            <>
                                <h3>{currentEmployeeInfo?.fullNameRus}</h3>
                                <CustomInputEditModal
                                    id={"mobilePersonal"}
                                    labelField={"Мобильный телефон(личный)"}
                                    onChange={(value) =>
                                        setPersonalMobile(value)
                                    }
                                />
                                <CustomInputEditModal
                                    id={"cityPhone"}
                                    labelField={"Городской телефон"}
                                    onChange={(value) => setCityPhone(value)}
                                />
                                <CustomInputEditModal
                                    id={"placeWork"}
                                    labelField={"Рабочее место"}
                                    onChange={(value) => setWorkPlace(value)}
                                />
                                <CustomInputEditModal
                                    id={"Adress"}
                                    labelField={"Адрес"}
                                    onChange={(value) => setAddress(value)}
                                />
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        width: "70%",
                                        alignSelf: "anchor-center",
                                    }}
                                >
                                    <CustomInputEditModal
                                        id={"code"}
                                        labelField={"Код проверки"}
                                        onChange={(value) => setCode(value)}
                                    />
                                    {currentEmployeeInfo && (
                                        <CustomButton
                                            onClick={() => {
                                                fetchVerificatinCode(
                                                    currentEmployeeInfo?.id,
                                                    currentEmployeeInfo?.organizationId
                                                );
                                            }}
                                            height="53px"
                                        >
                                            Отправить код проверки
                                        </CustomButton>
                                    )}
                                </div>
                                <div style={{ margin: "20px 0" }}>
                                    <input
                                        type="checkbox"
                                        value=""
                                        id="flexCheckDefault"
                                        onClick={() =>
                                            setIsCheckboxOn(!isCheckboxOn)
                                        }
                                    />
                                    <label htmlFor="flexCheckDefault">
                                        Нажимая на кнопку, я соглашаюсь с{" "}
                                        <a
                                            href="https://www.gsprom.ru/politic/"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Политикой обработки персональных
                                            данных
                                        </a>{" "}
                                        и даю согласие на{" "}
                                        <a
                                            href="https://www.gsprom.ru/politic/"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            обработку персональных данных
                                        </a>
                                    </label>
                                </div>
                                <div style={{ alignSelf: "center" }}>
                                    <CustomButton
                                        disabled={
                                            !isCheckboxOn || code.length < 10
                                        }
                                        onClick={() => handleSendButton()}
                                        height="40px"
                                    >
                                        Сохранить
                                    </CustomButton>
                                </div>
                            </>
                        )}
                    </ModalContent>
                </ModalContainer>
            </Modal2Background>
        </>
    );
};
