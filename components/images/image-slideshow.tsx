'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import { useMeals } from '@/hooks/meals/useMeals';
import classes from './image-slideshow.module.css';

const S3_BASE_URL = 'https://natalievirt-nextjs-users-image.s3.ap-southeast-2.amazonaws.com';

export default function ImageSlideshow() {
    const { data: meals } = useMeals();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mq.matches);
        const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    const images = (meals ?? [])
        .filter(meal => meal.image)
        .map(meal => ({
            src: `${S3_BASE_URL}/${meal.image}`,
            alt: meal.title,
        }));

    useEffect(() => {
        if (images.length <= 1 || prefersReducedMotion) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                prevIndex < images.length - 1 ? prevIndex + 1 : 0
            );
        }, 5000);
        return () => clearInterval(interval);
    }, [images.length, prefersReducedMotion]);

    if (images.length === 0) return null;

    return (
        <div
            className={classes.slideshow}
            role="region"
            aria-label="Food photo slideshow"
            aria-roledescription="slideshow"
        >
            {images.map((image, index) => {
                const isActive = index === currentImageIndex;
                return (
                    <Image
                        key={image.src}
                        src={image.src}
                        className={isActive ? classes.active : ''}
                        alt={isActive ? image.alt : ''}
                        aria-hidden={!isActive}
                        fill
                    />
                );
            })}
        </div>
    );
}
