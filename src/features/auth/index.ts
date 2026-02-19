/**
 * ========================================
 * AUTH FEATURE - PUBLIC API
 * ========================================
 *
 * Exporta solo lo necesario del feature Auth.
 * Los consumidores deben importar desde aquí, no de internals.
 *
 * Ejemplo:
 * import { useLoginMutation, SignInForm } from '@/features/auth';
 */

// Components
export { SignInForm } from './components/sign-in-form';
export { SignUpForm } from './components/sign-up-form';
export { ForgotPasswordForm } from './components/forgot-password-form';
export { VerifyEmailForm } from './components/verify-email-form';
export { ResetPasswordForm } from './components/reset-password-form';

// Queries & Mutations
export { useLoginMutation } from './queries/auth-mutations';
export { useRegisterMutation } from './queries/auth-mutations';
export { useLogoutMutation } from './queries/auth-mutations';
export { useUserQuery } from './queries/user-query';
export { useForgotPasswordMutation } from './queries/password-mutations';
export { useResetPasswordMutation } from './queries/password-mutations';
export { useVerifyEmailMutation } from './queries/verification-mutations';
export { useResendVerificationMutation } from './queries/verification-mutations';
export { useUpdateProfileMutation } from './queries/profile-mutations';

// Utils
export { authStorage } from './utils/storage';
export { authKeys } from './utils/query-keys';
export { redirectAfterAuth } from './utils/navigation-helpers';

// API
export { getUserMetadata } from './api/metadata';

// Types
export type { RegisterPayload, LoginPayload, User, AuthTokens } from './types';
export type { PublicMetadata } from './api/metadata';
