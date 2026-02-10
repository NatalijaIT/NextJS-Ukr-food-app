import { NextResponse } from 'next/server';
import { getMealBySlug } from '@/lib/services/meals.service';

export async function GET(request, { params }) {
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
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
