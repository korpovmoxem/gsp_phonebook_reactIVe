import React, { useEffect, useState } from "react";
import DefaultPhoto from "../../assets/photo.jpg";

interface Props {
    photo: string | null;
    width: string;
}

export const PhotoObj = ({ photo, width }: Props) => {
    // console.log("ГРУЗИМ ФОТО");
    // console.log(photo);
    // const [src, setSrc] = useState(DefaultPhoto); // По умолчанию дефолтная иконка

    // useEffect(() => {
    //     if (!photo) {
    //         // Если URL пустой или null — используем дефолтную иконку
    //         setSrc(DefaultPhoto);
    //         return;
    //     }

    //     // Создаем временное изображение для проверки
    //     const img = new Image();
    //     if (
    //         photo &&
    //         (!photo.startsWith("data:image/jpeg;base64,") ||
    //             !photo.startsWith("data:image/png;base64,"))
    //     ) {
    //         img.src = `data:image/jpeg;base64,${photo}`;
    //     } else {
    //         console.log("ELSE");
    //         img.src = photo;
    //     }

    //     img.onload = () => {
    //         // Если изображение успешно загрузилось — установить его как src
    //         setSrc(photo);
    //     };

    //     img.onerror = () => {
    //         // Если произошла ошибка при загрузке — оставить дефолтную иконку
    //         setSrc(DefaultPhoto);
    //     };
    // }, [photo]);

    // return (
    //     <img
    //         width={width}
    //         src={`data:image/png;base64,${src}`}
    //         alt=""
    //         loading="lazy"
    //     />
    // );

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
