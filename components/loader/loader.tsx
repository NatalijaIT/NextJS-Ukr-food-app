import styles from './loader.module.css';

interface LoaderProps {
    message?: string;
}

export default function Loader({ message = 'Loading...' }: LoaderProps) {
    return (
        <div className={styles.container}>
            <div className={styles.spinner} />
            <p className={styles.text}>{message}</p>
        </div>
    );
}
