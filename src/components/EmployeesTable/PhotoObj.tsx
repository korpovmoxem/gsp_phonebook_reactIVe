import React, { useState } from "react";
import DefaultPhoto from "../../assets/photo.jpg";

interface Props {
    photo: string | null;
    width: string;
}

export const PhotoObj = ({ photo, width }: Props) => {
    const [imgSrc, setImgSrc] = useState(`data:image/png;base64,${photo}`);

    const handleError = () => {
        setImgSrc(DefaultPhoto);
    };

    return (
        <>
            <img
                width={width}
                src={imgSrc}
                title={""}
                alt={""}
                onError={handleError}
            />
        </>
    );
};
