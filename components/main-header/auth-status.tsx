'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import styles from './auth-status.module.css';

export default function AuthStatus() {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return <div className={styles.loading}>...</div>;
    }

    if (session?.user) {
        return (
            <div className={styles.authStatus}>
                <span className={styles.userName}>{`Welcome, ${session.user.name}!`}</span>
                <button
                    className={styles.signOutBtn}
                    onClick={() => signOut({ callbackUrl: '/' })}
                >
                    Sign Out
                </button>
            </div>
        );
    }

    return (
        <Link href="/auth/login" className={styles.loginLink}>
            Login
        </Link>
    );
}
