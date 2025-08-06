import { useEffect, useState } from "react";
import DefaultPhoto from "../../assets/photo.jpg";

interface Props {
    photo: string | null;
    width: string;
}

export const PhotoObj = ({ photo, width }: Props) => {
    const [imgSrc, setImgSrc] = useState(
        photo ? `data:image/png;base64,${photo}` : DefaultPhoto
    );

    const handleError = () => {
        setImgSrc(DefaultPhoto);
    };

    useEffect(() => {
        if (photo) {
            setImgSrc(`data:image/png;base64,${photo}`);
        } else {
            setImgSrc(DefaultPhoto);
        }
    }, [photo]); // Обновляем imgSrc при изменении photo

    return (
        <>
            <img
                width={width}
                height={width}
                src={imgSrc}
                title={""}
                alt={""}
                onError={handleError}
                style={{ objectFit: "cover", clipPath: "inset(2px)" }}
            />
        </>
    );
};
