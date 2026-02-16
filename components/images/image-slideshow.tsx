'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import { useMeals } from '@/hooks/meals/useMeals';
import classes from './image-slideshow.module.css';

const S3_BASE_URL = 'https://natalievirt-nextjs-users-image.s3.ap-southeast-2.amazonaws.com';

export default function ImageSlideshow() {
    const { data: meals } = useMeals();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const images = (meals ?? [])
        .filter(meal => meal.image)
        .map(meal => ({
            src: `${S3_BASE_URL}/${meal.image}`,
            alt: meal.title,
        }));

    useEffect(() => {
        if (images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                prevIndex < images.length - 1 ? prevIndex + 1 : 0
            );
        }, 5000);
        return () => clearInterval(interval);
    }, [images.length]);

    if (images.length === 0) return null;

    return (
        <div className={classes.slideshow}>
            {images.map((image, index) => (
                <Image
                    key={image.src}
                    src={image.src}
                    className={index === currentImageIndex ? classes.active : ''}
                    alt={image.alt}
                    fill
                />
            ))}
        </div>
    );
}
