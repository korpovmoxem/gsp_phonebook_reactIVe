import {
    CloseButton,
    ModalBackground,
    ModalContainer,
    ModalContent,
    ModalHeader,
} from "./StyledComponents";
import { useEffect, useRef } from "react";

interface Props {
    onClose: () => void;
}

export const HelpModal = ({ onClose }: Props) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (
            containerRef.current &&
            !containerRef.current.childNodes[0].contains(event.target as Node)
        ) {
            onClose();
        }
    };

    const handleESCClick = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            onClose();
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
                        <ModalHeader>
                            <h3>Помощь</h3>
                            <CloseButton onClick={() => onClose()}>
                                X
                            </CloseButton>
                        </ModalHeader>
                        <div>
                            Уважаемые коллеги! Если у вас есть предложения или
                            вы нашли ошибку, то направляйте письма на адрес{" "}
                            <a href="mailto:phonebook@gsprom.ru">
                                phonebook@gsprom.ru
                            </a>
                            <br />
                            <br />
                            Справочник обновляется ежедневно с 7:00 до 7:30 для
                            получения данных из следующих систем:
                            <br />
                            Фото, email, номера телефонов - ActiveDirectory
                            <br />
                            Остальная информация - 1С:ЗУП
                        </div>
                    </ModalContent>
                </ModalContainer>
            </ModalBackground>
        </>
    );
};
