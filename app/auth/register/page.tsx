import { Metadata } from 'next';
import RegisterContent from './register-content';

export const metadata: Metadata = {
    title: 'Register | Ukrainian Food',
    description: 'Create an account to share your favorite Ukrainian meals.',
};

export default function RegisterPage() {
    return <RegisterContent />;
}
