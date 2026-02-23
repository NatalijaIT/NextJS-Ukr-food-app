import styles from './loader.module.css';

interface LoaderProps {
    message?: string;
}

export default function Loader({ message = 'Loading...' }: LoaderProps) {
    return (
        <div className={styles.container} role="status" aria-live="polite" aria-label={message}>
            <div className={styles.spinner} aria-hidden="true" />
            <p className={styles.text} aria-hidden="true">{message}</p>
        </div>
    );
}
