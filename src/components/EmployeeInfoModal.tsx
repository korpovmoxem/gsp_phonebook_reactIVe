import { useOrgStore } from "../store/organizationStore";
import styled from "styled-components";
import PhotoDefault from "../materials/photo.jpg";
import { ModalField } from "./ModalField";
import { CurrentEmployeeInfo } from "../types";
import { SpinnerCircular } from "spinners-react";
import {
    CloseButton,
    CustomButton,
    ModalBackground,
    ModalContainer,
    ModalContent,
    ModalHeader,
} from "./components";
import { EditInformationModal } from "./EditInformationModal";
import { useEffect, useRef } from "react";

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
    min-width: 240px;
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

export const EmployeeInfoModal: React.FC = () => {
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

    const handleEditInfo = () => {
        setIsEmployeeInfoModalOpen(!isEmployeeInfoModalOpen);
        setIsEditInformation(!isEditInformation);
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
            setIsEmployeeInfoModalOpen(false);
        }
    };

    const handleESCClick = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            setIsEmployeeInfoModalOpen(false);
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
            <ModalBackground ref={containerRef}>
                <ModalContainer>
                    <ModalContent>
                        {isCurrentEmployeeLoading ? (
                            <div style={{ margin: "35% auto" }}>
                                <SpinnerCircular
                                    size={100}
                                    thickness={180}
                                    speed={180}
                                    color="rgba(29, 117, 187, 1)"
                                    secondaryColor="rgba(57, 69, 172, 0.1)"
                                />
                            </div>
                        ) : (
                            <>
                                <ModalHeader>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                        }}
                                    >
                                        <h3>Информация о сотруднике</h3>
                                        <CustomButton
                                            onClick={() => handleEditInfo()}
                                            height="25px"
                                        >
                                            Изменить данные
                                        </CustomButton>
                                    </div>
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
                                {currentEmployeeInfo && (
                                    <PhotoAndInfo>
                                        <PhotoBlock>
                                            <img
                                                src={
                                                    currentEmployeeInfo.photo
                                                        ? `data:image/jpeg;base64,${currentEmployeeInfo.photo}`
                                                        : PhotoDefault
                                                }
                                                alt={
                                                    currentEmployeeInfo.fullNameRus
                                                }
                                                width="200px"
                                            />
                                        </PhotoBlock>
                                        <InfoBlock>
                                            <Fio>
                                                {
                                                    currentEmployeeInfo.fullNameRus
                                                }
                                            </Fio>
                                            <span style={{ fontSize: "11pt" }}>
                                                {
                                                    currentEmployeeInfo.positionTitle
                                                }
                                            </span>
                                            {currentEmployeeInfo.managers &&
                                                currentEmployeeInfo.managers
                                                    .length > 0 && (
                                                    <div>
                                                        (
                                                        {currentEmployeeInfo.managers.map(
                                                            (manager) => (
                                                                <>
                                                                    <span
                                                                        style={{
                                                                            fontSize:
                                                                                "11pt",
                                                                            textDecoration:
                                                                                "underline",
                                                                            cursor: "pointer",
                                                                            color: "#1d75bb",
                                                                        }}
                                                                        onClick={() =>
                                                                            fetchCurrentEmployeeInfo(
                                                                                manager.id,
                                                                                manager.organizationId
                                                                            )
                                                                        }
                                                                    >
                                                                        {
                                                                            manager.fullName
                                                                        }
                                                                    </span>
                                                                    {currentEmployeeInfo
                                                                        .managers
                                                                        .length >
                                                                        1 && (
                                                                        <br />
                                                                    )}
                                                                </>
                                                            )
                                                        )}
                                                        )
                                                    </div>
                                                )}
                                            {currentEmployeeInfo.assistants &&
                                                currentEmployeeInfo.assistants
                                                    .length > 0 && (
                                                    <>
                                                        <h5
                                                            style={{
                                                                marginBottom: 0,
                                                            }}
                                                        >
                                                            Помощники
                                                        </h5>
                                                        {currentEmployeeInfo.assistants.map(
                                                            (assistant) => (
                                                                <>
                                                                    <span
                                                                        onClick={() =>
                                                                            fetchCurrentEmployeeInfo(
                                                                                assistant.id,
                                                                                assistant.organizationId
                                                                            )
                                                                        }
                                                                        style={{
                                                                            textDecoration:
                                                                                "underline",
                                                                            cursor: "pointer",
                                                                            color: "#1d75bb",
                                                                        }}
                                                                    >
                                                                        {
                                                                            assistant.fullName
                                                                        }
                                                                    </span>
                                                                    {currentEmployeeInfo
                                                                        .assistants
                                                                        .length >
                                                                        1 && (
                                                                        <br />
                                                                    )}
                                                                </>
                                                            )
                                                        )}
                                                    </>
                                                )}
                                            <div style={{ marginTop: "20px" }}>
                                                {FIELDS.map((field) => (
                                                    <ModalField
                                                        nameField={
                                                            field.nameField
                                                        }
                                                        value={
                                                            currentEmployeeInfo[
                                                                field.value
                                                            ]
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        </InfoBlock>
                                    </PhotoAndInfo>
                                )}
                            </>
                        )}
                    </ModalContent>
                </ModalContainer>
            </ModalBackground>
        </>
    );
};
