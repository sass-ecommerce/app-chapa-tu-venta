import { useMutation } from '@tanstack/react-query';

import { createTenant } from '../api';
import type { CreateTenantPayload } from '../api';
import { authStorage } from '@/features/auth/utils/storage';

export function useCreateTenantMutation() {
  return useMutation({
    mutationFn: (data: CreateTenantPayload) => createTenant(data),
    onSuccess: async (tenant) => {
      await authStorage.saveTenantId(tenant.id);
    },
  });
}
