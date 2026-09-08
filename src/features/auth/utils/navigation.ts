import { router } from 'expo-router';

import type { OnboardingStatus } from '../api';
import { authStorage } from './storage';

export async function routeAfterLogin(onboarding: OnboardingStatus): Promise<void> {
  if (!onboarding.createTenant.completed) {
    router.replace('/(onboarding)/register-store');
    return;
  }

  if (onboarding.createTenant.tenant?.id) {
    await authStorage.saveTenantId(onboarding.createTenant.tenant.id);
  }

  router.replace('/(tabs)');
}
