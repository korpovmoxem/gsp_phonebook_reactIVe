import { useOrgStore } from "../store/organizationStore";
import styled from "styled-components";
import PhotoDefault from "../materials/photo.jpg";
import { ModalField } from "./ModalField";
import { CurrentEmployeeInfo } from "../types";
import { SpinnerCircular } from "spinners-react";
import {
    CloseButton,
    Modal2Background,
    ModalBackground,
    ModalContainer,
    ModalContent,
    ModalHeader,
} from "./components";

const PhotoAndInfo = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;
`;

const PhotoBlock = styled.div`
    display: flex;
    justify-content: center;
    padding: 20px;
    width: 30%;
    height: 50%;
    background-color: rgba(240, 240, 240, 0.49);
    border-radius: 10px;
`;

const InfoBlock = styled.div`
    padding: 20px;
    width: 70%;
    background-color: rgba(240, 240, 240, 0.49);
    border-radius: 10px;
`;

const Fio = styled.h3`
    margin: 0;
`;

const FIELDS = [
    {
        nameField: "Организация",
        value: "organizationName",
        isEditable: false,
    },
    {
        nameField: "Подразделение",
        value: "departmentName",
        isEditable: false,
    },
    {
        nameField: "Номер телефона",
        value: "telephoneNumberCorp",
        isEditable: false,
    },
    {
        nameField: "Городской номер",
        value: "telephoneNumberCorp",
        isEditable: true,
    },
    {
        nameField: "Мобильный (рабочий)",
        value: "mobileNumberCorp",
        isEditable: false,
    },
    {
        nameField: "Мобильный (личный)",
        value: "mobileNumberPersonal",
        isEditable: true,
    },
    {
        nameField: "Email",
        value: "email",
        isEditable: false,
    },
    {
        nameField: "Рабочее место",
        value: "workPlace",
        isEditable: true,
    },
    {
        nameField: "Адрес",
        value: "address",
        isEditable: true,
    },
];

export const EditInformationModal: React.FC = () => {
    console.log("EmployeeInfoModal");
    const {
        isEmployeeInfoModalOpen,
        setIsEmployeeInfoModalOpen,
        currentEmployeeInfo,
        fetchCurrentEmployeeInfo,
        isCurrentEmployeeLoading,
        isEditInformation,
        setIsEditInformation,
    } = useOrgStore();

    return (
        <>
            <Modal2Background>
                <ModalContainer>
                    <ModalContent>
                        <ModalHeader>
                            <h3>Изменение данных о сотруднике</h3>
                            <CloseButton
                                onClick={() =>
                                    setIsEmployeeInfoModalOpen(
                                        !isEmployeeInfoModalOpen
                                    )
                                }
                            >
                                X
                            </CloseButton>
                        </ModalHeader>
                        <div>
                            <span>
                                Для изменений данных сотрудника необходимо
                                написать новую информацию в соответствующие поля
                                или очистить поле для его удаления в карточке
                            </span>
                        </div>
                        <br />
                        <div>
                            <span>
                                Для того, чтобы изменения вступили в силу
                                необходимо запросить код проверки, который будет
                                выслан на корпоративную почту сотрудника,
                                вписать его в соответствующее поле и нажать
                                "Сохранить". В день может быть отправлен только
                                один код. Информацию разрешено менять один раз в
                                день
                            </span>
                        </div>
                        <br />
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
                                >
                                    <b>
                                        заявку на Портале системы «Поддержка
                                        пользователей» / Телефонный справочник /
                                        Изменение данных пользователя
                                    </b>
                                </a>
                            </span>
                        </div>
                    </ModalContent>
                </ModalContainer>
            </Modal2Background>
        </>
    );
};
