'use client';

import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useRegister } from '@/hooks/auth/useRegister';
import classes from './page.module.css';

interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export default function RegisterContent() {
    const router = useRouter();
    const registerMutation = useRegister();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormData>({
        defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            await registerMutation.mutateAsync({
                name: data.name,
                email: data.email,
                password: data.password,
            });

            const result = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (!result?.error) {
                router.push('/meals/share');
                router.refresh();
            }
        } catch {
            // Error is handled by registerMutation.error
        }
    };

    return (
        <>
            <header className={classes.header}>
                <h1>
                    <span className={classes.highlight}>Register</span>
                </h1>
                <p>Create an account to share your favorite meals.</p>
            </header>
            <main className={classes.main}>
                <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                    <p>
                        <label htmlFor="name">Your Name</label>
                        <input
                            type="text"
                            id="name"
                            {...register('name', { required: 'Name is required' })}
                        />
                        {errors.name && <span className={classes.error}>{errors.name.message}</span>}
                    </p>
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
                    <p>
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            {...register('confirmPassword', {
                                required: 'Please confirm your password',
                                validate: (value) =>
                                    value === watch('password') || 'Passwords do not match',
                            })}
                        />
                        {errors.confirmPassword && (
                            <span className={classes.error}>{errors.confirmPassword.message}</span>
                        )}
                    </p>
                    {registerMutation.error && (
                        <p className={classes.error}>{registerMutation.error.message}</p>
                    )}
                    <p className={classes.actions}>
                        <button type="submit" disabled={registerMutation.isPending}>
                            {registerMutation.isPending ? 'Creating account...' : 'Register'}
                        </button>
                    </p>
                    <p className={classes.switchLink}>
                        Already have an account?{' '}
                        <Link href="/auth/login">Login here</Link>
                    </p>
                </form>
            </main>
        </>
    );
}
