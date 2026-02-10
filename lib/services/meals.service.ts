import slugify from 'slugify';
import xss from 'xss';
import { getDatabase } from '../mongodb';
import { uploadImageToS3 } from '../utils/s3';
import { Meal, CreateMealInput } from '@/types/meal';

export async function getAllMeals(): Promise<Meal[]> {
    const { db } = await getDatabase();
    const meals = await db.collection('meals').find().toArray();
    return meals.map(meal => ({
        ...meal,
        _id: meal._id.toString(),
    })) as Meal[];
}

export async function getMealBySlug(slug: string): Promise<Meal | null> {
    const { db } = await getDatabase();
    const meal = await db.collection('meals').findOne({ slug });
    if (!meal) return null;
    return {
        ...meal,
        _id: meal._id.toString(),
    } as Meal;
}

export async function createMeal(mealData: CreateMealInput): Promise<Meal> {
    const slug = slugify(mealData.title, { lower: true });
    const instructions = xss(mealData.instructions);

    let imageName: string | null = null;
    if (mealData.image) {
        const extension = mealData.image.name.split('.').pop()!;
        const fileName = `${slug}.${extension}`;
        await uploadImageToS3(mealData.image, fileName);
        imageName = fileName;
    }

    const meal = {
        title: mealData.title,
        summary: mealData.summary,
        instructions,
        creator: mealData.creator,
        creator_email: mealData.creator_email,
        image: imageName,
        slug,
    };

    const { db } = await getDatabase();
    const result = await db.collection('meals').insertOne(meal);
    return {
        ...meal,
        _id: result.insertedId.toString(),
    } as Meal;
}
