import { useMutation,  } from '@tanstack/react-query';
import { router } from 'expo-router';

import { authStorage } from '../utils/storage';

import {
  registerUser,
  confirmRegistration,
  resendCode,
  loginUser,
  forgotPasswordRequest,
  resetPasswordRequest,
  getOnboardingStatus,
} from '../api';
import type { RegisterPayload, LoginPayload } from '../types';

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (data: RegisterPayload) => registerUser(data),
  });
}

export function useConfirmRegistrationMutation() {
  return useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) =>
      confirmRegistration(email, code),
  });
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: (data: LoginPayload) => loginUser(data),
    onSuccess: async (tokens, variables) => {
      await Promise.all([
        authStorage.saveTokens(tokens.accessToken, tokens.refreshToken),
        authStorage.saveUser({
          userSlug: variables.email.split('@')[0],
          email: variables.email,
          firstName: '',
          lastName: '',
        }),
      ]);
    },
  });
}

export function useResendCodeMutation() {
  return useMutation({
    mutationFn: (email: string) => resendCode(email),
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (email: string) => forgotPasswordRequest(email),
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: ({
      email,
      code,
      newPassword,
    }: {
      email: string;
      code: string;
      newPassword: string;
    }) => resetPasswordRequest(email, code, newPassword),
  });
}

export function useOnboardingStatusMutation() {
  return useMutation({
    mutationFn: () => getOnboardingStatus(),
  });
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: async () => {
      await Promise.all([authStorage.clearUser(), authStorage.clearTokens()]);
    },
    onSuccess: () => {
      authStorage.clearTokens();

      router.replace('/(auth)/sign-in');
    },
  });
}
