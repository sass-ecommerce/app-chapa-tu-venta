import { useMutation,  } from '@tanstack/react-query';
import { router } from 'expo-router';

import { authStorage } from '../utils/storage';
import { decodeIdTokenClaims, exchangeGoogleAuthCode } from '../utils/cognito';

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

export function useGoogleLoginMutation() {
  return useMutation({
    mutationFn: ({
      code,
      codeVerifier,
      redirectUri,
    }: {
      code: string;
      codeVerifier: string;
      redirectUri: string;
    }) => exchangeGoogleAuthCode(code, codeVerifier, redirectUri),
    onSuccess: async (tokens) => {
      const claims = tokens.idToken ? decodeIdTokenClaims(tokens.idToken) : null;

      await Promise.all([
        authStorage.saveTokens(tokens.accessToken, tokens.refreshToken ?? ''),
        authStorage.saveUser({
          userSlug: (claims?.email ?? '').split('@')[0],
          email: claims?.email ?? '',
          firstName: claims?.given_name ?? '',
          lastName: claims?.family_name ?? '',
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
      await Promise.allSettled([
        authStorage.clearUser(),
        authStorage.clearTokens(),
        authStorage.clearTenantId(),
      ]);
    },
    onSuccess: () => {
      router.replace('/(auth)/sign-in');
    },
  });
}
