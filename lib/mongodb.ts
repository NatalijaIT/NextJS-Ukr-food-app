'use server';

import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI!;

let cachedClient: MongoClient | null = null;

export async function connectToDatabase(): Promise<MongoClient> {
    if (cachedClient) {
        return cachedClient;
    }

    const client = await MongoClient.connect(MONGODB_URI);
    cachedClient = client;
    return client;
}

export async function getDatabase(): Promise<{ db: Db }> {
    const client = await connectToDatabase();
    return { db: client.db() };
}
