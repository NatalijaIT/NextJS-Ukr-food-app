'use client';

import { useRef, useState, ChangeEvent } from 'react';
import Image from 'next/image';
import styles from './image-picker.module.css';

interface ImagePickerProps {
    label: string;
    name: string;
    onChange?: (file: File | null) => void;
    error?: string;
}

export default function ImagePicker({ label, name, onChange, error }: ImagePickerProps) {
    const [pickedImage, setPickedImage] = useState<string | null>(null);
    const [pickedFileName, setPickedFileName] = useState<string | null>(null);
    const imageInput = useRef<HTMLInputElement>(null);

    const errorId = `${name}-error`;
    const statusId = `${name}-status`;

    function handlePickClick() {
        return imageInput.current?.click();
    }

    function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        if (!file) {
            setPickedImage(null);
            setPickedFileName(null);
            onChange?.(null);
            return;
        }

        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPickedImage(fileReader.result as string);
        };
        fileReader.readAsDataURL(file);

        setPickedFileName(file.name);
        onChange?.(file);
    }

    return (
        <div className={styles.picker}>
            <label htmlFor={name}>{label}</label>
            <div className={styles.controls}>
                <div className={styles.preview} aria-hidden="true">
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
                    aria-invalid={!!error}
                    aria-describedby={`${statusId}${error ? ` ${errorId}` : ''}`}
                />
                <div>
                    <button
                        className={styles.button}
                        type="button"
                        onClick={handlePickClick}
                        aria-describedby={`${statusId}${error ? ` ${errorId}` : ''}`}
                    >
                        Pick an Image
                    </button>
                    <p id={statusId} className={styles.status} aria-live="polite">
                        {pickedFileName ? `Selected: ${pickedFileName}` : 'No image selected'}
                    </p>
                </div>
            </div>
            {error && <p id={errorId} className={styles.error} role="alert">{error}</p>}
        </div>
    )
}
