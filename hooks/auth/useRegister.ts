import { useMutation } from '@tanstack/react-query';
import { registerUser } from '@/lib/api/auth';
import { RegisterInput } from '@/types/user';

export function useRegister() {
    return useMutation<{ message: string }, Error, RegisterInput>({
        mutationFn: registerUser,
    });
}
