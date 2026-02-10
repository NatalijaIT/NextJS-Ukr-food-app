'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchMeals } from '@/lib/api/meals';
import { Meal } from '@/types/meal';

export function useMeals() {
    return useQuery<Meal[]>({
        queryKey: ['meals'],
        queryFn: fetchMeals,
    });
}
