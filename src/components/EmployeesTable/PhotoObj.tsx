import React, { useEffect, useState } from "react";
import DefaultPhoto from "../../assets/photo.jpg";

interface Props {
    photo: string | null;
    width: string;
}

export const PhotoObj = ({ photo, width }: Props) => {
    const [src, setSrc] = useState(DefaultPhoto); // По умолчанию дефолтная иконка

    useEffect(() => {
        if (!photo) {
            // Если URL пустой или null — используем дефолтную иконку
            setSrc(DefaultPhoto);
            return;
        }

        // Создаем временное изображение для проверки
        const img = new Image();
        img.src = photo;

        img.onload = () => {
            // Если изображение успешно загрузилось — установить его как src
            setSrc(photo);
        };

        img.onerror = () => {
            // Если произошла ошибка при загрузке — оставить дефолтную иконку
            setSrc(DefaultPhoto);
        };
    }, [photo]);

    return <img width={width} src={src} alt="" loading="lazy" />;
};
