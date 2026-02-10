export interface Meal {
    _id: string;
    title: string;
    slug: string;
    summary: string;
    instructions: string;
    creator: string;
    creator_email: string;
    image: string;
}

export interface MealFormData {
    name: string;
    email: string;
    title: string;
    summary: string;
    instructions: string;
    image: File | null;
}

export interface CreateMealInput {
    title: string;
    summary: string;
    instructions: string;
    creator: string;
    creator_email: string;
    image: File;
}
