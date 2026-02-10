'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMeal } from '@/lib/api/meals';
import { Meal } from '@/types/meal';

export function useCreateMeal() {
    const queryClient = useQueryClient();

    return useMutation<{ meal: Meal; message: string }, Error, FormData>({
        mutationFn: createMeal,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['meals'] });
        },
    });
}
