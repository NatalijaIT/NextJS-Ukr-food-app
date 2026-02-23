import slugify from 'slugify';
import xss from 'xss';
import { getDatabase } from '../mongodb';
import { uploadImageToS3, deleteImageFromS3 } from '../utils/s3';
import { revalidatePath } from "next/cache";
import { Meal, CreateMealInput, EditMealFormData } from '@/types/meal';
import { ObjectId } from 'mongodb';

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

export async function updateMeal(slug: string, data: EditMealFormData): Promise<Meal> {
    const { db } = await getDatabase();
    const existing = await db.collection('meals').findOne({ slug });
    if (!existing) throw new Error('Meal not found.');

    const instructions = xss(data.instructions);
    let imageName = existing.image as string;

    if (data.image) {
        if (imageName) await deleteImageFromS3(imageName);
        const extension = data.image.name.split('.').pop()!;
        const fileName = `${slug}.${extension}`;
        await uploadImageToS3(data.image, fileName);
        imageName = fileName;
    }

    await db.collection('meals').updateOne(
        { slug },
        { $set: { title: data.title, summary: data.summary, instructions, image: imageName } }
    );

    revalidatePath('/meals');
    return { ...existing, _id: existing._id.toString(), title: data.title, summary: data.summary, instructions, image: imageName } as Meal;
}

export async function deleteMeal(id: string): Promise<void> {
    const { db } = await getDatabase();

    const meal = await db.collection('meals').findOne({ _id: new ObjectId(id) });

    if (meal?.image) {
        await deleteImageFromS3(meal.image as string);
    }

    await db.collection('meals').deleteOne({ _id: new ObjectId(id) });
    return revalidatePath("/meals");
}
