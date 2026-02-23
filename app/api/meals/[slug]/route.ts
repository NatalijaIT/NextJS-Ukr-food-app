import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getMealBySlug, deleteMeal, updateMeal } from '@/lib/services/meals.service';

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

export async function PUT(
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
                { error: 'You can only edit your own meals.' },
                { status: 403 }
            );
        }

        const formData = await request.formData();
        const title = formData.get('title') as string;
        const summary = formData.get('summary') as string;
        const instructions = formData.get('instructions') as string;
        const image = formData.get('image') as File | null;

        if (!title || !summary || !instructions) {
            return NextResponse.json(
                { error: 'Title, summary and instructions are required.' },
                { status: 400 }
            );
        }

        const updated = await updateMeal(slug, {
            title,
            summary,
            instructions,
            image: image && image.size > 0 ? image : null,
        });

        return NextResponse.json({ meal: updated, message: 'Meal updated successfully.' });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
