'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchMeal } from '@/lib/api/meals';
import { Meal } from '@/types/meal';

export function useMeal(slug: string) {
    return useQuery<Meal>({
        queryKey: ['meals', slug],
        queryFn: () => fetchMeal(slug),
        enabled: !!slug,
    });
}
