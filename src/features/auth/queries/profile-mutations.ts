import { Alert } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { userApi } from '../../profile/api/user';
import { authStorage } from '../utils/storage';
import { authKeys } from '../utils/query-keys';
import type { User, UpdateProfilePayload } from '../types';
import { getAuthToken } from './helpers';

/**
 * ========================================
 * PROFILE MUTATIONS
 * ========================================
 */

/**
 * Update profile mutation with optimistic updates
 */
export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfilePayload) => {
      console.log('📝 [Auth] Updating profile...');

      const token = await getAuthToken();
      const userSlug = await authStorage.getUserSlug();

      if (!userSlug) {
        throw new Error('No user slug found');
      }

      const updatedUser = await userApi.updateProfile(userSlug, token, data);
      await authStorage.saveUser(updatedUser);

      console.log('✅ [Auth] Profile updated successfully');
      return updatedUser;
    },
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: authKeys.user() });

      // Snapshot previous value
      const previousUser = queryClient.getQueryData<User>(authKeys.user());

      // Optimistically update cache
      if (previousUser) {
        const optimisticUser: User = {
          ...previousUser,
          firstName: newData.firstName || previousUser.firstName,
          lastName: newData.lastName || previousUser.lastName,
        };
        queryClient.setQueryData(authKeys.user(), optimisticUser);
      }

      // Return context with previous value
      return { previousUser };
    },
    onError: (error: Error, _, context) => {
      // Rollback to previous value on error
      if (context?.previousUser) {
        queryClient.setQueryData(authKeys.user(), context.previousUser);
      }
      console.error('❌ [Auth] Failed to update profile:', error);
      Alert.alert('Error', error.message || 'Error al actualizar perfil');
    },
    onSettled: () => {
      // Refetch to ensure we have latest data
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
  });
}
