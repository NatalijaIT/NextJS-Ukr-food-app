import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getMealBySlug, deleteMeal } from '@/lib/services/meals.service';

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

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Authentication required.' },
                { status: 401 }
            );
        }

        const { slug } = await params;
        const meal = await getMealBySlug(slug);

        if (!meal) {
            return NextResponse.json(
                { error: 'Meal not found.' },
                { status: 404 }
            );
        }

        if (meal.creator_email !== session.user.email) {
            return NextResponse.json(
                { error: 'You can only delete your own meals.' },
                { status: 403 }
            );
        }

        await deleteMeal(meal._id);
        return NextResponse.json({ message: 'Meal deleted successfully.' });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
