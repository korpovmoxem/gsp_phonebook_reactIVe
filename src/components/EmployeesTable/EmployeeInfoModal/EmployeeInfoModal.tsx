import { useOrgStore } from "../../../store/organizationStore";
import PhotoDefault from "../../../assets/photo.jpg";
import { ModalField } from "./ModalField";
import { SpinnerCircular } from "../../../../node_modules/spinners-react/lib/esm/SpinnerCircular";
import {
    CloseButton,
    CustomButton,
    ModalBackground,
    ModalContainer,
    ModalContent,
    ModalHeader,
} from "../../StyledComponents";
import { useEffect, useRef } from "react";
import Contact from "../../../assets/contactInfo.svg";
import WorkPlace from "../../../assets/workPlace.svg";
import { UsersRound } from "lucide-react";
import {
    Fio,
    InfoBlock,
    InfoBlockContent,
    InfoBlockWrapper,
    PhotoAndInfo,
    PhotoBlock,
} from "./StyledComponents";

const INFORMATION_BLOCKS = [
    {
        id: "inf_block_0",
        nameBlock: "Контактная информация",
        icon: Contact,
        fields: [
            {
                id: "inf_block_0_0",
                nameField: "Номер телефона",
                value: "telephoneNumberCorp",
                isEditable: false,
            },
            {
                id: "inf_block_0_1",
                nameField: "Городской номер",
                value: "externalNumberCorp",
                isEditable: true,
            },
            {
                id: "inf_block_0_2",
                nameField: "Мобильный (рабочий)",
                value: "mobileNumberCorp",
                isEditable: false,
            },
            {
                id: "inf_block_0_3",
                nameField: "Мобильный (личный)",
                value: "mobileNumberPersonal",
                isEditable: true,
            },
            {
                id: "inf_block_0_4",
                nameField: "Email",
                value: "email",
                isEditable: false,
            },
        ],
    },
    {
        id: "inf_block_1",
        nameBlock: "Место работы",
        icon: WorkPlace,
        fields: [
            {
                id: "inf_block_1_0",
                nameField: "Организация",
                value: "organizationName",
                isEditable: false,
            },
            {
                id: "inf_block_1_1",
                nameField: "Подразделение",
                value: "departmentName",
                isEditable: false,
            },
            {
                id: "inf_block_1_2",
                nameField: "Адрес",
                value: "address",
                isEditable: true,
            },
            {
                id: "inf_block_1_3",
                nameField: "Рабочее место",
                value: "workPlace",
                isEditable: true,
            },
        ],
    },
];

export const EmployeeInfoModal: React.FC = () => {
    const isEmployeeInfoModalOpen = useOrgStore(
        (state) => state.isEmployeeInfoModalOpen
    );
    const setIsEmployeeInfoModalOpen = useOrgStore(
        (state) => state.setIsEmployeeInfoModalOpen
    );
    const currentEmployeeInfo = useOrgStore(
        (state) => state.currentEmployeeInfo
    );
    const fetchCurrentEmployeeInfo = useOrgStore(
        (state) => state.fetchCurrentEmployeeInfo
    );
    const isCurrentEmployeeLoading = useOrgStore(
        (state) => state.isCurrentEmployeeLoading
    );
    const isEditInformation = useOrgStore((state) => state.isEditInformation);
    const setIsEditInformation = useOrgStore(
        (state) => state.setIsEditInformation
    );

    const handleEditInfo = () => {
        setIsEmployeeInfoModalOpen(!isEmployeeInfoModalOpen);
        setIsEditInformation(!isEditInformation);
    };

    const containerRef = useRef<HTMLDivElement | null>(null);

    const handleClickOutside = (event: MouseEvent) => {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                                        style={{ fontSize: "16pt" }}
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
                                                loading="lazy"
                                            />
                                        </PhotoBlock>
                                        <InfoBlockWrapper>
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
                                                    <InfoBlock
                                                        style={{
                                                            marginTop: "10px",
                                                        }}
                                                    >
                                                        <h4
                                                            style={{
                                                                margin: 0,
                                                                marginBottom:
                                                                    "10px",
                                                            }}
                                                        >
                                                            <UsersRound
                                                                size={16}
                                                                style={{
                                                                    marginRight:
                                                                        "5px",
                                                                }}
                                                            />
                                                            Помощники
                                                        </h4>
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
                                                    </InfoBlock>
                                                )}
                                            <div style={{ marginTop: "20px" }}>
                                                {INFORMATION_BLOCKS.map(
                                                    (block) => (
                                                        <InfoBlock
                                                            key={block.id}
                                                        >
                                                            <>
                                                                <h4
                                                                    style={{
                                                                        margin: 0,
                                                                        marginBottom:
                                                                            "10px",
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={
                                                                            block.icon
                                                                        }
                                                                        style={{
                                                                            marginRight:
                                                                                "5px",
                                                                        }}
                                                                        alt="Иконка блока"
                                                                    />
                                                                    {
                                                                        block.nameBlock
                                                                    }
                                                                </h4>
                                                            </>
                                                            <InfoBlockContent>
                                                                {block.fields.map(
                                                                    (field) => (
                                                                        <ModalField
                                                                            key={
                                                                                field.id
                                                                            }
                                                                            nameField={
                                                                                field.nameField
                                                                            }
                                                                            value={
                                                                                currentEmployeeInfo[
                                                                                    field
                                                                                        .value
                                                                                ]
                                                                            }
                                                                        />
                                                                    )
                                                                )}
                                                            </InfoBlockContent>
                                                        </InfoBlock>
                                                    )
                                                )}
                                            </div>
                                        </InfoBlockWrapper>
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
