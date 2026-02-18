'use client';

import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

import { LoginInput } from '@/types/user';
import classes from './page.module.css';

export default function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/meals/share';
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        defaultValues: { email: '', password: '' },
    });

    const onSubmit = async (data: LoginInput) => {
        setIsLoading(true);
        setError(null);

        const result = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false,
        });

        setIsLoading(false);

        if (result?.error) {
            setError('Invalid email or password.');
        } else {
            router.push(callbackUrl);
            router.refresh();
        }
    };

    return (
        <>
            <header className={classes.header}>
                <h1>
                    <span className={classes.highlight}>Login</span>
                </h1>
                <p>Sign in to share your favorite meals.</p>
            </header>
            <main className={classes.main}>
                <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                    <p>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address',
                                },
                            })}
                        />
                        {errors.email && <span className={classes.error}>{errors.email.message}</span>}
                    </p>
                    <p>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 6, message: 'Minimum 6 characters' },
                            })}
                        />
                        {errors.password && <span className={classes.error}>{errors.password.message}</span>}
                    </p>
                    {error && <p className={classes.error}>{error}</p>}
                    <p className={classes.actions}>
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? 'Signing in...' : 'Login'}
                        </button>
                    </p>
                    <p className={classes.switchLink}>
                        Don&apos;t have an account?{' '}
                        <Link href="/auth/register">Register here</Link>
                    </p>
                </form>
            </main>
        </>
    );
}
