import { Meal } from '@/types/meal';

export async function fetchMeals(): Promise<Meal[]> {
    const response = await fetch('/api/meals');

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch meals');
    }

    const data = await response.json();
    return data.meals;
}

export async function fetchMeal(slug: string): Promise<Meal> {
    const response = await fetch(`/api/meals/${slug}`);

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch meal');
    }

    const data = await response.json();
    return data.meal;
}

export async function createMeal(formData: FormData): Promise<{ meal: Meal; message: string }> {
    const response = await fetch('/api/meals', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create meal');
    }

    return await response.json();
}
