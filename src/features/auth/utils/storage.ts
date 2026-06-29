import * as SecureStore from 'expo-secure-store';
import type { User } from '../types';

const USER_DATA_KEY = 'auth_user_data';
const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const TENANT_ID_KEY = 'auth_tenant_id';

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

  async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
    ]);
  },

  async getAccessToken(): Promise<string | null> {
    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },

  async getRefreshToken(): Promise<string | null> {
    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },

  async clearTokens(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ]);
  },

  async saveTenantId(tenantId: string): Promise<void> {
    await SecureStore.setItemAsync(TENANT_ID_KEY, tenantId);
  },

  async getTenantId(): Promise<string | null> {
    return SecureStore.getItemAsync(TENANT_ID_KEY);
  },

  async clearTenantId(): Promise<void> {
    await SecureStore.deleteItemAsync(TENANT_ID_KEY);
  },
};
