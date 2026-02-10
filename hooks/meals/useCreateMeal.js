'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMeal } from '@/lib/api/meals';

export function useCreateMeal() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createMeal,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['meals'] });
        },
    });
}
