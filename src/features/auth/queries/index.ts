import { useMutation, useQueryClient } from '@tanstack/react-query';

import { registerUser, confirmRegistration, resendCode } from '../api';
import type { RegisterPayload } from '../types';

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
  });
}

export function useResendCodeMutation() {
  return useMutation({
    mutationFn: (email: string) => resendCode(email),
  });
}
