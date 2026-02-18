import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/services/users.service';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Name, email, and password are required.' },
                { status: 400 }
            );
        }

        if (!email.includes('@')) {
            return NextResponse.json(
                { error: 'Please enter a valid email address.' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters.' },
                { status: 400 }
            );
        }

        const user = await createUser({ name, email, password });

        return NextResponse.json(
            {
                message: 'Registration successful!',
                user: { id: user._id, name: user.name, email: user.email },
            },
            { status: 201 }
        );
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        const status = message.includes('already exists') ? 409 : 500;
        return NextResponse.json({ error: message }, { status });
    }
}
