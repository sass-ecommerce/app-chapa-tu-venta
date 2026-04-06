import * as SecureStore from 'expo-secure-store';
import type { User } from '../types';

const USER_DATA_KEY = 'auth_user_data';

/**
 * Secure storage for user profile data.
 * Auth tokens are managed by Amplify internally.
 */
export const authStorage = {
  async saveUser(user: User): Promise<void> {
    await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(user));
  },

  async getUser(): Promise<User | null> {
    const data = await SecureStore.getItemAsync(USER_DATA_KEY);
    return data ? (JSON.parse(data) as User) : null;
  },

  async clearUser(): Promise<void> {
    await SecureStore.deleteItemAsync(USER_DATA_KEY);
  },
};
