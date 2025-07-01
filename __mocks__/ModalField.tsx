const ModalField = ({ nameField, value }: any) => (
    <div data-testid="modal-field">
        <p>{nameField}</p>
        <p>{value || "Не указан"}</p>
    </div>
);

export { ModalField };
