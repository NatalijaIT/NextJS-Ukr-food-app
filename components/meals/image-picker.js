'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import styles from './image-picker.module.css';

export default function ImagePicker({ label, name, onChange, error }) {
    const [pickedImage, setPickedImage] = useState();
    const imageInput = useRef();

    function handlePickClick() {
        return imageInput.current.click();
    }

    function handleImageChange(event) {
        const file = event.target.files[0];

        if (!file) {
            setPickedImage(null);
            onChange?.(null);
            return;
        }

        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPickedImage(fileReader.result);
        };
        fileReader.readAsDataURL(file);

        onChange?.(file);
    }

    return (
        <div className={styles.picker}>
            <label htmlFor={name}>{label}</label>
            <div className={styles.controls}>
                <div className={styles.preview}>
                    {!pickedImage ?
                        <p>No image picked yet.</p> :
                        <Image
                            src={pickedImage}
                            alt="Selected image"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />}
                </div>
                <input
                    className={styles.input}
                    type="file"
                    id={name}
                    accept="image/png, image/jpeg"
                    name={name}
                    ref={imageInput}
                    onChange={handleImageChange}
                />
                <button
                    className={styles.button}
                    type="button"
                    onClick={handlePickClick}
                >
                    Pick an Image
                </button>
            </div>
            {error && <p className={styles.error}>{error}</p>}
        </div>
    )
}
