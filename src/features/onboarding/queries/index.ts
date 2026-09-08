import { useMutation } from '@tanstack/react-query';

import { createTenant } from '../api';
import type { CreateTenantPayload } from '../api';
import { authStorage, refreshAccessToken } from '@/features/auth';

export function useCreateTenantMutation() {
  return useMutation({
    mutationFn: (data: CreateTenantPayload) => createTenant(data),
    onSuccess: async (tenant) => {
      await authStorage.saveTenantId(tenant.tenantId);

      // El access token vigente no incluye el tenant recién creado. Se
      // refresca antes de golpear cualquier otra API para que el nuevo
      // token ya lleve el tenantId y evite 401/403 en (tabs).
      const refreshToken = await authStorage.getRefreshToken();
      if (refreshToken) {
        const newTokens = await refreshAccessToken(refreshToken);
        await authStorage.saveTokens(newTokens.accessToken, refreshToken);
      }
    },
  });
}
