import { useMutation } from '@tanstack/react-query';

import { createTenant } from '../api';
import type { CreateTenantPayload } from '../api';

export function useCreateTenantMutation() {
  return useMutation({
    mutationFn: (data: CreateTenantPayload) => createTenant(data),
  });
}
