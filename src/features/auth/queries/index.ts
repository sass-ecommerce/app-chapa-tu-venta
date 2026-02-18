/**
 * Auth Queries & Mutations
 * Barrel export following Vercel React Best Practices
 *
 * Uses modular structure for better tree-shaking and bundle optimization
 */

// Helper functions
export { getAuthToken, invalidateUser, setUserData, getUserData } from './helpers';

// Queries
export { useUserQuery, useTempCredentialsQuery } from './user-query';

// Auth mutations (login, logout, register)
export { useLoginMutation, useLogoutMutation, useRegisterMutation } from './auth-mutations';

// Email verification mutations
export { useVerifyEmailMutation, useResendVerificationMutation } from './verification-mutations';

// Password reset mutations
export { useForgotPasswordMutation, useResetPasswordMutation } from './password-mutations';

// Profile mutations
export { useUpdateProfileMutation } from './profile-mutations';

// Temporary credentials mutations
export {
  useSaveTempCredentialsMutation,
  useClearTempCredentialsMutation,
} from './temp-credentials';
