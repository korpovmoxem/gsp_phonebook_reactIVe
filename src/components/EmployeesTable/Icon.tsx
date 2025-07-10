import React, { useState } from "react";
import { IconObject } from "../../types";
import DefaultIconStatus from "../../assets/unAvailableIcon.svg";
import DefaultIconAchievement from "../../assets/achievementIcon.svg";

interface Props {
    icon: IconObject;
    width: string;
    type: "status" | "achievement";
}

export const Icon = ({ icon, width, type }: Props) => {
    const [imgSrc, setImgSrc] = useState(icon.url);
    const [widthIcon, setWidthIcon] = useState(width);

    const handleError = () => {
        setImgSrc(
            type === "achievement" ? DefaultIconAchievement : DefaultIconStatus
        );
        setWidthIcon("20px");
    };

    return (
        <>
            <img
                width={widthIcon}
                src={imgSrc}
                title={icon.description}
                alt={icon.description}
                onError={handleError}
            />
        </>
    );
};
