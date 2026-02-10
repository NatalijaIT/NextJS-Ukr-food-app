'use client';

import MealsGrid from "@/components/meals/meals-grid";
import Link from "next/link";
import { useMeals } from "@/hooks/meals/useMeals";
import classes from "./page.module.css";

export default function MealPage() {
    const { data: meals, isLoading, error } = useMeals();

    return (
        <>
            <header className={classes.header}>
                <h1>
                    Delicious meals, created,{' '}
                    <span className={classes.highlight}>by you</span>
                </h1>
                <p>Choose your favourite recipe and cook it yourself. It's easy and fun!</p>
                <p className={classes.cta}>
                    <Link href="/meals/share">Share your favourite recipe</Link>
                </p>
            </header>
            <main className={classes.main}>
                {isLoading && <p className={classes.loading}>Fetching meals...</p>}
                {error && <p className={classes.error}>Failed to load meals.</p>}
                {meals && <MealsGrid meals={meals} />}
            </main>
        </>
    );
}
