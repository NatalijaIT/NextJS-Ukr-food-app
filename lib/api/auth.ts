import { RegisterInput } from '@/types/user';

export async function registerUser(input: RegisterInput): Promise<{ message: string }> {
    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Registration failed');
    }

    return await response.json();
}
