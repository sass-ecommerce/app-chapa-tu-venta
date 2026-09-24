// Utils
export { authStorage } from './utils/storage';
export { routeAfterLogin } from './utils/navigation';
export { getShareableTenantDomain } from './utils/tenant';

// Types
export type { RegisterPayload, LoginPayload, LoginResponse, MeResponse, User } from './types';

// API
export {
  registerUser,
  confirmRegistration,
  resendCode,
  loginUser,
  refreshAccessToken,
  forgotPasswordRequest,
  resetPasswordRequest,
  getOnboardingStatus,
  getMe,
  updateMe,
} from './api';

// Queries
export {
  authKeys,
  useCurrentUserQuery,
  useUpdateProfileMutation,
  useRegisterMutation,
  useLoginMutation,
  useGoogleLoginMutation,
  useConfirmRegistrationMutation,
  useResendCodeMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useOnboardingStatusMutation,
  useLogoutMutation,
} from './queries';

// Hooks
export { useGoogleSignIn } from './hooks/use-google-sign-in';
