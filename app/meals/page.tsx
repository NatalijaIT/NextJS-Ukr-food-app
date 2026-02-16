import { Metadata } from 'next';
import MealsContent from './meals-content';

export const metadata: Metadata = {
    title: 'All Meals | Ukrainian Food',
    description: 'Browse delicious Ukrainian meals shared by our food-loving community.',
};

export default function MealPage() {
    return <MealsContent />;
}
