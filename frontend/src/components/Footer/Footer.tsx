export const Footer = () => {
    return (
        <div style={{ placeItems: "center", margin: 0, height: "40px" }}>
            <hr
                style={{
                    color: "grey",
                    width: "99%",
                    margin: 0,
                }}
            />
            <div
                style={{
                    height: "95%",
                    alignContent: "center",
                }}
            >
                <span
                    style={{
                        color: "grey",
                        fontSize: "10pt",
                    }}
                >
                    © Разработано{" "}
                    <a
                        href="https://www.gsp-center.ru/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        ООО «ГСП Центр»
                    </a>
                </span>
            </div>
        </div>
    );
};
