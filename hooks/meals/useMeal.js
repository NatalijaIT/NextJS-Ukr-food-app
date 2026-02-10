'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchMeal } from '@/lib/api/meals';

export function useMeal(slug) {
    return useQuery({
        queryKey: ['meals', slug],
        queryFn: () => fetchMeal(slug),
        enabled: !!slug,
    });
}
