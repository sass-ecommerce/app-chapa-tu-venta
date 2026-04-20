import { useMutation } from '@tanstack/react-query';

import {
  registerUser,
  confirmRegistration,
  resendCode,
  loginUser,
  forgotPasswordRequest,
  resetPasswordRequest,
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
