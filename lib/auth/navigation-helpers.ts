import type { useUser } from '@clerk/clerk-expo';
import type { Router } from 'expo-router';

import type { UserPublicMetadata } from '@/lib/types/clerk';

type User = NonNullable<ReturnType<typeof useUser>['user']>;

/**
 * Redirects user after successful authentication based on onboarding completion status
 * - If registerStoreCompleted is true -> /(tabs)
 * - Otherwise -> /(onboarding)/register-store
 *
 * NOTE: Uses unsafeMetadata for client-side updates
 * TODO: Migrate to publicMetadata with backend webhook for production
 */
export function redirectAfterAuth(user: User, router: Router): void {
  const metadata = user.unsafeMetadata as UserPublicMetadata;

  console.log('📍 [Auth] Redirecting user after auth. Metadata:', metadata);

  if (metadata?.registerStoreCompleted === true) {
    console.log('✅ [Auth] Store completed, redirecting to /(tabs)');
    router.replace('/(tabs)');
  } else {
    console.log('📝 [Auth] Store not completed, redirecting to register-store');
    router.replace('/(onboarding)/register-store');
  }
}
