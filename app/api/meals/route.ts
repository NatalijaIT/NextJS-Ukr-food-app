import { NextRequest, NextResponse } from 'next/server';
import { getAllMeals, createMeal } from '@/lib/services/meals.service';

export async function GET() {
    try {
        const meals = await getAllMeals();
        return NextResponse.json({ meals });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const title = formData.get('title') as string;
        const summary = formData.get('summary') as string;
        const instructions = formData.get('instructions') as string;
        const creator = formData.get('name') as string;
        const creator_email = formData.get('email') as string;
        const image = formData.get('image') as File;

        if (!title || !summary || !instructions || !creator || !creator_email) {
            return NextResponse.json(
                { error: 'All fields are required.' },
                { status: 400 }
            );
        }

        if (!creator_email.includes('@')) {
            return NextResponse.json(
                { error: 'Please enter a valid email address.' },
                { status: 400 }
            );
        }

        if (!image || image.size === 0) {
            return NextResponse.json(
                { error: 'Image is required.' },
                { status: 400 }
            );
        }

        const meal = await createMeal({
            title,
            summary,
            instructions,
            creator,
            creator_email,
            image,
        });

        return NextResponse.json({ meal, message: 'Meal created successfully!' }, { status: 201 });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
