'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';

import { useMeal } from '@/hooks/meals/useMeal';
import styles from './page.module.css';

export default function MealDetailsPage() {
    const { order_slug } = useParams<{ order_slug: string }>();
    const { data: meal, isLoading, error } = useMeal(order_slug);

    if (isLoading) {
        return <p>Loading meal details...</p>;
    }

    if (error || !meal) {
        return <p>Meal not found.</p>;
    }

    const formattedInstructions = meal.instructions.replace(/\n/g, '<br />');

    return (
        <>
            <header className={styles.header}>
                <div className={styles.image}>
                    <Image
                        src={`https://natalievirt-nextjs-users-image.s3.ap-southeast-2.amazonaws.com/${meal.image}`}
                        alt={meal.title}
                        fill
                    />
                </div>
                <div className={styles.headerText}>
                    <h1>{meal.title}</h1>
                    <p className={styles.creator}>
                        by <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a>
                    </p>
                    <p className={styles.summary}>{meal.summary}</p>
                </div>
            </header>
            <main>
                <p className={styles.instructions} dangerouslySetInnerHTML={{
                    __html: formattedInstructions,
                }}></p>
            </main>
        </>
    );
}
