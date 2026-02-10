import { NextRequest, NextResponse } from 'next/server';
import { getMealBySlug } from '@/lib/services/meals.service';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const meal = await getMealBySlug(slug);

        if (!meal) {
            return NextResponse.json(
                { error: 'Meal not found.' },
                { status: 404 }
            );
        }

        return NextResponse.json({ meal });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
