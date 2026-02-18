import type { Router } from 'expo-router';
import type { User } from '@/features/auth/types';

/**
 * Redirects user after successful authentication based on onboarding completion status
 *
 * NOTE: Metadata is now stored in AsyncStorage (client-side only).
 * TODO: When backend provides metadata/onboarding status endpoint, update this logic
 *
 * For now, always redirect to /(tabs) after login
 * Onboarding flow is managed separately
 */
export function redirectAfterAuth(user: User, router: Router): void {
  console.log('📍 [Auth] Redirecting user after auth');

  // TODO: Check backend for onboarding completion status
  // For now, always redirect to main tabs
  console.log('✅ [Auth] Redirecting to /(tabs)');
  router.replace('/(tabs)');
}
