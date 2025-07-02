import { ArrowLeft } from "lucide-react";
import { useOrgStore } from "../../../store/organizationStore";
import {
    CloseButton,
    CustomButton,
    Modal2Background,
    ModalContainer,
    ModalContent,
    ModalHeader,
} from "../../StyledComponents";
import { CustomInputEditModal } from "./CustomInputEditModal";
import { useEffect, useRef, useState } from "react";

export const EditInformationModal = () => {
    const currentEmployeeInfo = useOrgStore(
        (state) => state.currentEmployeeInfo
    );
    const isEditInformation = useOrgStore((state) => state.isEditInformation);
    const setIsEditInformation = useOrgStore(
        (state) => state.setIsEditInformation
    );
    const fetchVerificatinCode = useOrgStore(
        (state) => state.fetchVerificatinCode
    );
    const saveEmployeeInfo = useOrgStore((state) => state.saveEmployeeInfo);

    const setIsEmployeeInfoModalOpen = useOrgStore(
        (state) => state.setIsEmployeeInfoModalOpen
    );

    const isLoadingCode = useOrgStore((state) => state.isLoadingCode);

    const [personalMobile, setPersonalMobile] = useState(
        currentEmployeeInfo?.mobileNumberPersonal || ""
    );
    const [cityPhone, setCityPhone] = useState(
        currentEmployeeInfo?.externalNumberCorp || ""
    );
    const [workPlace, setWorkPlace] = useState<string | null>(
        String(currentEmployeeInfo?.workPlace) || null
    );
    const [address, setAddress] = useState(currentEmployeeInfo?.address || "");
    const [code, setCode] = useState("");

    const [isCheckboxOn, setIsCheckboxOn] = useState(false);

    const handleSendButton = () => {
        saveEmployeeInfo(
            personalMobile,
            cityPhone,
            Number(workPlace),
            address,
            code
        );
    };

    const containerRef = useRef<HTMLDivElement | null>(null);

    const handleClickOutside = (event: MouseEvent) => {
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

    const handleClickBack = () => {
        setIsEditInformation(false);
        setIsEmployeeInfoModalOpen(true);
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
            <Modal2Background ref={containerRef}>
                <ModalContainer style={{ maxWidth: "800px" }}>
                    <ModalContent>
                        <ModalHeader>
                            <h3
                                style={{
                                    verticalAlign: "middle",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <CloseButton onClick={handleClickBack}>
                                    <ArrowLeft />
                                </CloseButton>

                                <div>Изменение данных о сотруднике</div>
                            </h3>

                            <CloseButton
                                onClick={() =>
                                    setIsEditInformation(!isEditInformation)
                                }
                                style={{ fontSize: "16pt" }}
                            >
                                X
                            </CloseButton>
                        </ModalHeader>
                        {currentEmployeeInfo?.email &&
                        currentEmployeeInfo?.isEditAvailable ? (
                            <>
                                <div>
                                    <span>
                                        &nbsp;Для изменений данных сотрудника
                                        необходимо написать новую информацию в
                                        соответствующие поля или очистить поле
                                        для его удаления в карточке
                                    </span>
                                </div>
                                <br />
                                <div>
                                    <span>
                                        &nbsp;Для того, чтобы изменения вступили
                                        в силу необходимо запросить код
                                        проверки, который будет выслан на
                                        корпоративную почту сотрудника, вписать
                                        его в соответствующее поле и нажать
                                        "Сохранить". В день может быть отправлен
                                        только один код. Информацию разрешено
                                        менять один раз в день
                                    </span>
                                </div>
                                <br />
                            </>
                        ) : (
                            <>
                                {currentEmployeeInfo?.isEditAvailable && (
                                    <>
                                        <span>
                                            &nbsp;Электронная почта отсутствует.
                                            Изменение данных невозможно
                                        </span>
                                        <br />
                                    </>
                                )}
                            </>
                        )}

                        <div>
                            <span>
                                &nbsp;Если ФИО, должность или подразделение
                                сотрудника указаны неверно, необходимо
                                обратиться к своему кадровому работнику
                                (куратору) для внесения изменений в карточке 1С:
                                ЗУП.
                            </span>
                        </div>
                        <br />
                        <div>
                            <span>
                                &nbsp;При необходимости изменить email или
                                фотографию профиля, необходимо создать{" "}
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
                        {currentEmployeeInfo?.email &&
                            currentEmployeeInfo?.isEditAvailable && (
                                <>
                                    <h3>{currentEmployeeInfo?.fullNameRus}</h3>
                                    <CustomInputEditModal
                                        id={"mobilePersonal"}
                                        labelField={"Мобильный телефон(личный)"}
                                        onChange={(value) =>
                                            setPersonalMobile(value)
                                        }
                                        data-testId="input-personalMobile"
                                        defaultValue={personalMobile}
                                    />
                                    <CustomInputEditModal
                                        id={"cityPhone"}
                                        labelField={"Городской телефон"}
                                        onChange={(value) =>
                                            setCityPhone(value)
                                        }
                                        defaultValue={cityPhone}
                                        data-testId="input-cityPhone"
                                    />
                                    <CustomInputEditModal
                                        id={"placeWork"}
                                        labelField={"Рабочее место"}
                                        data-tesId="input-placeWork"
                                        onChange={(value) =>
                                            setWorkPlace(value)
                                        }
                                        defaultValue={workPlace}
                                    />
                                    <CustomInputEditModal
                                        id={"Adress"}
                                        labelField={"Адрес"}
                                        onChange={(value) => setAddress(value)}
                                        defaultValue={address}
                                        data-testId="input-address"
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
                                            defaultValue={code}
                                            data-testId="input-code"
                                        />
                                        {currentEmployeeInfo && (
                                            <CustomButton
                                                onClick={() => {
                                                    fetchVerificatinCode(
                                                        currentEmployeeInfo?.id,
                                                        currentEmployeeInfo?.organizationId
                                                    );
                                                }}
                                                data-testId="button-code"
                                                height="53px"
                                                disabled={isLoadingCode}
                                            >
                                                {isLoadingCode
                                                    ? "Код получен"
                                                    : "Отправить код проверки"}
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
                                                !isCheckboxOn || code.length < 6
                                            }
                                            onClick={() => handleSendButton()}
                                            height="40px"
                                            data-testid="save-button"
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
