'use client';

import { useEffect, useState, useRef, useImperativeHandle } from "react";
import { createPortal } from "react-dom";

import styles from './modal-dialog.module.css';

export default function ModalDialog({ ref, children }) {
    const [isDomReady, setIsDomReady] = useState(false);
    const modalDialog = useRef();

    useEffect(() => {
        setIsDomReady(true);
    })

    useImperativeHandle(ref, () => {
        return {
            open() {
                modalDialog.current.showModal();
            }
        }
    });

    return isDomReady ? createPortal(
        <dialog ref={modalDialog} className={styles.mainContent}>
            {children}
            <form method="dialog">
                <button>Done!</button>
            </form>
        </dialog>, document.getElementById('modal')
    ) : null
}