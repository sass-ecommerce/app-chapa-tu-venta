import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';
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
  getMe,
  updateMe,
} from '../api';
import type {
  RegisterPayload,
  LoginPayload,
  MeResponse,
  UpdateProfilePayload,
  User,
} from '../types';

export const authKeys = {
  me: ['auth', 'me'] as const,
};

function toUser(me: MeResponse): User {
  return {
    userSlug: me.email.split('@')[0],
    email: me.email,
    firstName: me.firstName ?? '',
    lastName: me.lastName ?? '',
  };
}

// Trae el perfil desde /users/me y lo persiste. Si la API falla, se conserva
// lo que ya estaba guardado para no bloquear el login.
async function fetchAndStoreUser(): Promise<User | null> {
  try {
    const user = toUser(await getMe());
    await authStorage.saveUser(user);
    return user;
  } catch {
    return authStorage.getUser();
  }
}

async function syncCurrentUser(queryClient: QueryClient): Promise<void> {
  const user = await fetchAndStoreUser();
  queryClient.setQueryData(authKeys.me, user);
}

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: fetchAndStoreUser,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfilePayload) => updateMe(data),
    onSuccess: async (me) => {
      const user = toUser(me);
      await authStorage.saveUser(user);
      queryClient.setQueryData(authKeys.me, user);
    },
  });
}

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
  const queryClient = useQueryClient();
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
      await syncCurrentUser(queryClient);
    },
  });
}

export function useGoogleLoginMutation() {
  const queryClient = useQueryClient();
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
      await syncCurrentUser(queryClient);
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await Promise.allSettled([
        authStorage.clearUser(),
        authStorage.clearTokens(),
        authStorage.clearTenantId(),
        authStorage.clearTenantDomain(),
      ]);
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authKeys.me });
      router.replace('/(auth)/sign-in');
    },
  });
}
