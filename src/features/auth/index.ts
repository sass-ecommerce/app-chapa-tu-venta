// Utils
export { authStorage } from './utils/storage';
export { routeAfterLogin } from './utils/navigation';

// Types
export type { RegisterPayload, LoginPayload, LoginResponse, User } from './types';

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
} from './api';

// Queries
export {
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
