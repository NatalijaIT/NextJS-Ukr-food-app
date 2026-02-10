import slugify from 'slugify';
import xss from 'xss';
import { getDatabase } from '../mongodb';
import { uploadImageToS3 } from '../utils/s3';

export async function getAllMeals() {
    const { db } = await getDatabase();
    const meals = await db.collection('meals').find().toArray();
    return meals.map(meal => ({
        ...meal,
        _id: meal._id.toString(),
    }));
}

export async function getMealBySlug(slug) {
    const { db } = await getDatabase();
    const meal = await db.collection('meals').findOne({ slug });
    if (!meal) return null;
    return {
        ...meal,
        _id: meal._id.toString(),
    };
}

export async function createMeal(mealData) {
    const slug = slugify(mealData.title, { lower: true });
    const instructions = xss(mealData.instructions);

    let imageName = null;
    if (mealData.image) {
        const extension = mealData.image.name.split('.').pop();
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
    };
}
