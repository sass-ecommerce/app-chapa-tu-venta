import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authStorage } from '../utils/storage';
import { registerUser, confirmRegistration, resendCode } from '../api';
import type { RegisterPayload, User } from '../types';

const USER_KEY = ['auth', 'user'] as const;

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (data: RegisterPayload) => registerUser(data),
  });
}

export function useConfirmRegistrationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) =>
      confirmRegistration(email, code),
    onSuccess: async (_, { email }) => {
      const user: User = { userSlug: '', email, firstName: '', lastName: '' };
      await authStorage.saveUser(user);
      queryClient.setQueryData(USER_KEY, user);
    },
  });
}

export function useResendCodeMutation() {
  return useMutation({
    mutationFn: (email: string) => resendCode(email),
  });
}
