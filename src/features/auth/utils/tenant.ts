import { getOnboardingStatus } from '../api';
import { authStorage } from './storage';

/**
 * Sesiones creadas antes de que empezáramos a persistir el domain no lo
 * tienen en SecureStore — se resuelve una vez contra /tenants/onboarding
 * y se cachea para las próximas veces.
 */
export async function getShareableTenantDomain(): Promise<string | null> {
  const stored = await authStorage.getTenantDomain();
  if (stored) return stored;

  const onboarding = await getOnboardingStatus();
  const domain = onboarding.createTenant.tenant?.domain ?? null;
  if (domain) await authStorage.saveTenantDomain(domain);
  return domain;
}
