'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { useMeal } from '@/hooks/meals/useMeal';
import { useDeleteMeal } from '@/hooks/meals/useDeleteMeal';
import Loader from '@/components/loader/loader';
import styles from './page.module.css';

export default function MealDetailsContent() {
    const { order_slug } = useParams<{ order_slug: string }>();
    const router = useRouter();
    const { data: session } = useSession();
    const { data: meal, isLoading, error } = useMeal(order_slug);
    const deleteMeal = useDeleteMeal();

    if (isLoading) {
        return <Loader message="Loading meal details..." />;
    }

    if (error || !meal) {
        return <p>Meal not found.</p>;
    }

    const formattedInstructions = meal.instructions.replace(/\n/g, '<br />');
    const isCreator = session?.user?.email === meal.creator_email;

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this meal?')) return;

        try {
            await deleteMeal.mutateAsync(meal.slug);
            router.push('/meals');
        } catch (error) {
            console.error('Failed to delete meal:', error);
        }
    };

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
            {isCreator && (
                <div className={styles.actions}>
                    <button
                        className={styles.deleteBtn}
                        onClick={handleDelete}
                        disabled={deleteMeal.isPending}
                        title="Delete Meal"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                        Delete meal
                    </button>
                </div>
            )}
        </>
    );
}
