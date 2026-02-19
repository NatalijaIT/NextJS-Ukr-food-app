'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMealBySlug } from '@/lib/api/meals';

export function useDeleteMeal() {
    const queryClient = useQueryClient();

    return useMutation<{ message: string }, Error, string>({
        mutationFn: deleteMealBySlug,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['meals'] });
        },
    });
}
