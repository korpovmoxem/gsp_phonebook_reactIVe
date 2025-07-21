import { CustomCopyButton, CustomEmailLink } from "../../StyledComponents";
import { toast } from "react-toastify";
import { FieldWrapper, LinkSpan, NameField } from "./StyledComponents";
import { useOrgStore } from "../../../store/organizationStore";
import { useSearchParams } from "react-router-dom";

interface Props {
    nameField: string;
    value: string | null;
}

const SPECIAL_FIELDS = ["Электронная почта", "Подразделение", "Номер телефона"];

export const ModalField = ({ nameField, value }: Props) => {
    const [, setSearchParams] = useSearchParams();
    const setIsEmployeeInfoModalOpen = useOrgStore(
        (state) => state.setIsEmployeeInfoModalOpen
    );
    const currentEmployeeInfo = useOrgStore(
        (state) => state.currentEmployeeInfo
    );
    const handleCopyClick = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.info("Скопировано в буфер обмена", { position: "top-right" });
    };

    const orgMapId = useOrgStore((state) => state.orgMapId);
    const node = orgMapId.get(currentEmployeeInfo?.departmentId || "")?.node;

    return (
        <FieldWrapper>
            <NameField>{nameField}</NameField>
            {SPECIAL_FIELDS.includes(nameField) ? (
                <>
                    {nameField === "Электронная почта" && (
                        <div>
                            {value ? (
                                <div
                                    style={{
                                        display: "flex",
                                    }}
                                >
                                    <CustomEmailLink
                                        href={`mailto:${value}`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {value}
                                    </CustomEmailLink>
                                    <CustomCopyButton
                                        size={15}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCopyClick(value!);
                                        }}
                                    />
                                </div>
                            ) : (
                                "Не указан"
                            )}
                        </div>
                    )}
                    {nameField === "Номер телефона" && (
                        <div>
                            {value ? (
                                <>
                                    <CustomEmailLink
                                        href={`tel:${value}`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {value}
                                    </CustomEmailLink>
                                </>
                            ) : (
                                "Не указан"
                            )}
                        </div>
                    )}
                    {nameField === "Подразделение" && (
                        <LinkSpan
                            onClick={() => {
                                setSearchParams({
                                    organizationId:
                                        currentEmployeeInfo?.organizationId ||
                                        "",
                                    departmentId:
                                        currentEmployeeInfo?.departmentId || "",
                                    treeId: node?.treeId || "",
                                    limit: "100",
                                });
                                setIsEmployeeInfoModalOpen(false);
                            }}
                        >
                            {value || "Не указан"}
                        </LinkSpan>
                    )}
                </>
            ) : (
                <span>{value || "Не указан"}</span>
            )}
        </FieldWrapper>
    );
};
