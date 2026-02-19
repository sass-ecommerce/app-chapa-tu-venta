import type { Router } from 'expo-router';
import type { User } from '@/features/auth/types';
import { getUserMetadata } from '@/features/auth/api/metadata';

/**
 * Redirects user after successful authentication based on onboarding completion status
 *
 * Checks if user has completed store registration by verifying publicMetadata.storeSlug
 * - If storeSlug exists → redirect to /(tabs) (main app)
 * - If storeSlug doesn't exist → redirect to /(onboarding)/register-store
 * - If API call fails → redirect to /(onboarding)/register-store (safe fallback)
 */
export async function redirectAfterAuth(user: User, router: Router): Promise<void> {
  console.log('📍 [Auth] Redirecting user after auth');

  try {
    // Fetch user metadata to check onboarding status
    const metadata = await getUserMetadata(user.userSlug);

    if (metadata.storeSlug) {
      // User has completed onboarding (store registered)
      console.log('✅ [Auth] User has store, redirecting to /(tabs)');
      router.replace('/(tabs)');
    } else {
      // User hasn't registered a store yet
      console.log('📋 [Auth] No store found, redirecting to onboarding');
      router.replace('/(onboarding)/register-store');
    }
  } catch (error) {
    // If metadata fetch fails, assume user needs to complete onboarding
    console.error('❌ [Auth] Failed to fetch metadata, redirecting to onboarding:', error);
    router.replace('/(onboarding)/register-store');
  }
}
