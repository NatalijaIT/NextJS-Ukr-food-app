import bcrypt from 'bcryptjs';
import { getDatabase } from '../mongodb';
import { User, RegisterInput } from '@/types/user';

const SALT_ROUNDS = 12;

export async function findUserByEmail(email: string): Promise<User | null> {
    const { db } = await getDatabase();
    const user = await db.collection('users').findOne({ email: email.toLowerCase() });
    if (!user) return null;
    return {
        ...user,
        _id: user._id.toString(),
    } as User;
}

export async function createUser(input: RegisterInput): Promise<User> {
    const { db } = await getDatabase();

    const existing = await db.collection('users').findOne({
        email: input.email.toLowerCase(),
    });
    if (existing) {
        throw new Error('A user with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

    const userData = {
        name: input.name.trim(),
        email: input.email.toLowerCase().trim(),
        password: hashedPassword,
        createdAt: new Date(),
    };

    const result = await db.collection('users').insertOne(userData);
    return {
        ...userData,
        _id: result.insertedId.toString(),
    } as User;
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
}
