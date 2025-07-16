import { useOrgStore } from "../../../store/organizationStore";
import PhotoDefault from "../../../assets/photo.jpg";
import { ModalField } from "./ModalField";
import { SpinnerCircular } from "spinners-react";
import {
    CloseButton,
    CustomButton,
    ModalBackground,
    ModalContainer,
    ModalContent,
    ModalHeader,
} from "../../StyledComponents";
import { useEffect, useRef } from "react";
import { ReactComponent as Contact } from "../../../assets/contactInfo.svg";
import { ReactComponent as WorkPlace } from "../../../assets/workPlace.svg";
import { UsersRound } from "lucide-react";
import {
    Fio,
    InfoBlock,
    InfoBlockContent,
    InfoBlockWrapper,
    PhotoAndInfo,
    PhotoBlock,
} from "./StyledComponents";
import { PhotoObj } from "../PhotoObj";
import { useEmployeeStore } from "../../../store/employeeStore";
import { Icon } from "../Icon";

const INFORMATION_BLOCKS = [
    {
        id: "inf_block_0",
        nameBlock: "Контактная информация",
        icon: Contact,
        testId: "contact-icon",
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
                nameField: "Электронная почта",
                value: "email",
                isEditable: false,
            },
        ],
    },
    {
        id: "inf_block_1",
        nameBlock: "Место работы",
        icon: WorkPlace,
        testId: "workplace-icon",
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
    const additionalInfo = useEmployeeStore((state) => state.employeeData);
    const loadEmployeeData = useEmployeeStore(
        (state) => state.loadEmployeeData
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
                                            zIndex: "999",
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
                                <div
                                    style={{
                                        height: "calc(80vh - 80px)",
                                        overflowY: "auto",
                                    }}
                                >
                                    {currentEmployeeInfo && (
                                        <PhotoAndInfo>
                                            <PhotoBlock>
                                                {(() => {
                                                    const data =
                                                        additionalInfo[
                                                            currentEmployeeInfo
                                                                .id
                                                        ];
                                                    if (
                                                        data.large ===
                                                            "loading" ||
                                                        data.large === "error"
                                                    )
                                                        return (
                                                            <PhotoObj
                                                                photo={null}
                                                                width="200px"
                                                            />
                                                        );

                                                    if (
                                                        typeof data.large !==
                                                        "string"
                                                    ) {
                                                        return (
                                                            <PhotoObj
                                                                photo={
                                                                    data?.large
                                                                        ? data
                                                                              ?.large
                                                                              .photo
                                                                        : ""
                                                                }
                                                                width="200px"
                                                            />
                                                        );
                                                    }
                                                })()}

                                                <>
                                                    {(() => {
                                                        const data =
                                                            additionalInfo[
                                                                currentEmployeeInfo
                                                                    .id
                                                            ];
                                                        if (
                                                            data.large ===
                                                                "loading" ||
                                                            data.large ===
                                                                "error"
                                                        )
                                                            return null;

                                                        if (
                                                            typeof data.large !==
                                                                "string" &&
                                                            data.large !==
                                                                undefined
                                                        ) {
                                                            return (
                                                                <>
                                                                    <>
                                                                        {data
                                                                            .large
                                                                            .statuses
                                                                            .length >
                                                                            0 && (
                                                                            <div
                                                                                style={{
                                                                                    marginTop:
                                                                                        "10px",
                                                                                    alignContent:
                                                                                        "center",
                                                                                    alignItems:
                                                                                        "center",
                                                                                    textAlign:
                                                                                        "center",
                                                                                }}
                                                                            >
                                                                                <div
                                                                                    style={{
                                                                                        display:
                                                                                            "flex",
                                                                                        flexWrap:
                                                                                            "wrap",
                                                                                        gap: "10px",
                                                                                        width: "200px",
                                                                                        margin: "0 auto",
                                                                                    }}
                                                                                >
                                                                                    {data?.large.statuses?.map(
                                                                                        (
                                                                                            status
                                                                                        ) => (
                                                                                            <Icon
                                                                                                icon={
                                                                                                    status
                                                                                                }
                                                                                                width={
                                                                                                    "40px"
                                                                                                }
                                                                                                type={
                                                                                                    "status"
                                                                                                }
                                                                                            />
                                                                                        )
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                    <>
                                                                        {data
                                                                            .large
                                                                            .achievements
                                                                            .length >
                                                                            0 && (
                                                                            <div
                                                                                style={{
                                                                                    marginTop:
                                                                                        "10px",
                                                                                    alignContent:
                                                                                        "center",
                                                                                    alignItems:
                                                                                        "center",
                                                                                    textAlign:
                                                                                        "center",
                                                                                }}
                                                                            >
                                                                                <div
                                                                                    style={{
                                                                                        display:
                                                                                            "flex",
                                                                                        flexWrap:
                                                                                            "wrap",
                                                                                        gap: "10px",
                                                                                        width: "200px",
                                                                                        margin: "0 auto",
                                                                                    }}
                                                                                >
                                                                                    {data?.large.achievements?.map(
                                                                                        (
                                                                                            achievement
                                                                                        ) => (
                                                                                            <Icon
                                                                                                icon={
                                                                                                    achievement
                                                                                                }
                                                                                                width={
                                                                                                    "40px"
                                                                                                }
                                                                                                type={
                                                                                                    "achievement"
                                                                                                }
                                                                                            />
                                                                                        )
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                </>
                                                            );
                                                        }
                                                    })()}
                                                </>
                                            </PhotoBlock>
                                            <InfoBlockWrapper>
                                                <div></div>
                                                <Fio>
                                                    {
                                                        currentEmployeeInfo.fullNameRus
                                                    }
                                                </Fio>
                                                <span
                                                    style={{ fontSize: "11pt" }}
                                                >
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
                                                                            key={
                                                                                manager.id
                                                                            }
                                                                            style={{
                                                                                fontSize:
                                                                                    "11pt",
                                                                                textDecoration:
                                                                                    "underline",
                                                                                cursor: "pointer",
                                                                                color: "#1d75bb",
                                                                            }}
                                                                            onClick={() => {
                                                                                fetchCurrentEmployeeInfo(
                                                                                    manager.id,
                                                                                    manager.organizationId
                                                                                );
                                                                                loadEmployeeData(
                                                                                    manager.id,
                                                                                    manager.organizationId,
                                                                                    "512"
                                                                                );
                                                                            }}
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
                                                    currentEmployeeInfo
                                                        .assistants.length >
                                                        0 && (
                                                        <InfoBlock
                                                            style={{
                                                                marginTop:
                                                                    "10px",
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
                                                                            key={
                                                                                assistant.id
                                                                            }
                                                                            onClick={() => {
                                                                                fetchCurrentEmployeeInfo(
                                                                                    assistant.id,
                                                                                    assistant.organizationId
                                                                                );
                                                                                loadEmployeeData(
                                                                                    assistant.id,
                                                                                    assistant.organizationId,
                                                                                    "512"
                                                                                );
                                                                            }}
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
                                                <div
                                                    style={{
                                                        marginTop: "20px",
                                                    }}
                                                >
                                                    {INFORMATION_BLOCKS.map(
                                                        (block) => {
                                                            const IconComponent =
                                                                block.icon;
                                                            return (
                                                                <InfoBlock
                                                                    key={
                                                                        block.id
                                                                    }
                                                                >
                                                                    <>
                                                                        <h4
                                                                            style={{
                                                                                margin: 0,
                                                                                marginBottom:
                                                                                    "10px",
                                                                            }}
                                                                        >
                                                                            <IconComponent
                                                                                data-testid={
                                                                                    block.testId
                                                                                }
                                                                            />

                                                                            {
                                                                                block.nameBlock
                                                                            }
                                                                        </h4>
                                                                    </>
                                                                    <InfoBlockContent>
                                                                        {block.fields.map(
                                                                            (
                                                                                field
                                                                            ) => (
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
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            </InfoBlockWrapper>
                                        </PhotoAndInfo>
                                    )}
                                </div>
                            </>
                        )}
                    </ModalContent>
                </ModalContainer>
            </ModalBackground>
        </>
    );
};
