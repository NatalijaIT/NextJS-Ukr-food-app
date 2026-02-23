'use client';

import { useParams } from 'next/navigation';
import { useMeal } from '@/hooks/meals/useMeal';
import ShareContent from '@/app/meals/share/share-content';
import Loader from '@/components/loader/loader';

export default function EditMealPage() {
    const { order_slug } = useParams<{ order_slug: string }>();
    const { data: meal, isLoading } = useMeal(order_slug);

    if (isLoading) return <Loader message="Loading meal..." />;
    if (!meal) return <p>Meal not found.</p>;

    return <ShareContent meal={meal} />;
}
