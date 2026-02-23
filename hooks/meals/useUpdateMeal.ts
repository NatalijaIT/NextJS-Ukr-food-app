'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMealBySlug } from '@/lib/api/meals';
import { Meal } from '@/types/meal';

export function useUpdateMeal() {
    const queryClient = useQueryClient();

    return useMutation<{ meal: Meal; message: string }, Error, { slug: string; formData: FormData }>({
        mutationFn: ({ slug, formData }) => updateMealBySlug(slug, formData),
        onSuccess: (_, { slug }) => {
            queryClient.invalidateQueries({ queryKey: ['meals'] });
            queryClient.invalidateQueries({ queryKey: ['meal', slug] });
        },
    });
}
