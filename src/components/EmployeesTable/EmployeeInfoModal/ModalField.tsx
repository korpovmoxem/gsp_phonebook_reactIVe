import { CustomCopyButton, CustomEmailLink } from "../../StyledComponents";
import { toast } from "react-toastify";
import { FieldWrapper, NameField } from "./StyledComponents";
import { useOrgStore } from "../../../store/organizationStore";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";

interface Props {
    nameField: string;
    value: string | null;
}

const LinkSpan = styled.span`
    cursor: pointer;
    text-decoration: underline;
`;

const SPECIAL_FIELDS = ["Электронная почта", "Подразделение", "Организация"];

export const ModalField = ({ nameField, value }: Props) => {
    const [, setSearchParams] = useSearchParams();
    // const selectOrg = useOrgStore((state) => state.selectOrg);
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
                                <>
                                    <CustomEmailLink
                                        href={`mailto:${value}`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {value}
                                    </CustomEmailLink>
                                    <CustomCopyButton
                                        size={13}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCopyClick(value!);
                                        }}
                                    />
                                </>
                            ) : (
                                "Не указан"
                            )}
                        </div>
                    )}
                    {nameField === "Организация" && (
                        <LinkSpan
                            onClick={() => {
                                setSearchParams({
                                    organizationId:
                                        currentEmployeeInfo?.organizationId ||
                                        "",
                                    treeId: node?.treeId || "",
                                    limit: "100",
                                });
                                setIsEmployeeInfoModalOpen(false);
                            }}
                        >
                            {value || "Не указан"}
                        </LinkSpan>
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
