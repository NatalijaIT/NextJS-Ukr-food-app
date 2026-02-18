import { Suspense } from 'react';
import { Metadata } from 'next';
import LoginContent from './login-content';

export const metadata: Metadata = {
    title: 'Login | Ukrainian Food',
    description: 'Sign in to share your favorite Ukrainian meals.',
};

export default function LoginPage() {
    return (
        <Suspense>
            <LoginContent />
        </Suspense>
    );
}
