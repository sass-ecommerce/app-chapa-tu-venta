import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authStorage } from '../utils/storage';
import { authKeys } from '../utils/query-keys';
import type { TempCredentials } from '../types';

/**
 * ========================================
 * TEMPORARY CREDENTIALS MUTATIONS
 * ========================================
 */

/**
 * Save temporary credentials mutation
 */
export function useSaveTempCredentialsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: TempCredentials) => {
      await authStorage.saveTempCredentials(credentials);
      return credentials;
    },
    onSuccess: (credentials) => {
      queryClient.setQueryData(authKeys.tempCredentials(), credentials);
    },
  });
}

/**
 * Clear temporary credentials mutation
 */
export function useClearTempCredentialsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await authStorage.clearTempCredentials();
    },
    onSuccess: () => {
      queryClient.setQueryData(authKeys.tempCredentials(), null);
    },
  });
}
