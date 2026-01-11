'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import borschtImg from '@/assets/borscht.jpg';
import varenykyImg from '@/assets/varenyky.jpg';
import holubtsiImg from '@/assets/holubtsi.jpg';
import derunyImg from '@/assets/deruny.jpg';
import syrnyky from '@/assets/syrnyky.jpg';

import classes from './image-slideshow.module.css';

const images = [
    { image: borschtImg, alt: 'A delicious, borscht' },
    { image: varenykyImg, alt: 'A delicious, varenyky' },
    { image: holubtsiImg, alt: 'Steamed holubtsi' },
    { image: derunyImg, alt: 'Deruny' },
    { image: syrnyky, alt: 'A delicious syrnyky' },
];

export default function ImageSlideshow() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                prevIndex < images.length - 1 ? prevIndex + 1 : 0
            );
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={classes.slideshow}>
            {images.map((image, index) => {
                return (<Image
                    key={index}
                    src={image.image}
                    className={index === currentImageIndex ? classes.active : ''}
                    alt={image.alt}
                />)
            })}
        </div>
    )
}