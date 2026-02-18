import * as SecureStore from 'expo-secure-store';
import type { AuthTokens, User, TempCredentials } from '../types';

// Storage keys
const KEYS = {
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  TOKEN_EXPIRES_AT: 'auth_token_expires_at',
  USER_SLUG: 'auth_user_slug',
  USER_DATA: 'auth_user_data',
  TEMP_CREDENTIALS: 'auth_temp_credentials',
} as const;

/**
 * Secure storage service for authentication data
 * Uses expo-secure-store for sensitive data persistence
 */
export const authStorage = {
  /**
   * Save authentication tokens
   */
  async saveTokens(tokens: AuthTokens): Promise<void> {
    try {
      console.log('🔐 [AuthStorage] Saving tokens to secure storage...');
      console.log('📊 [AuthStorage] Token details:', tokens);
      await SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, tokens.accessToken);
      await SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, tokens.refreshToken);
      await SecureStore.setItemAsync(KEYS.USER_SLUG, tokens.userSlug);

      // Calculate expiration timestamp (current time + expires_in seconds)
      const expiresAt = Date.now() + tokens.expiresIn * 1000;
      await SecureStore.setItemAsync(KEYS.TOKEN_EXPIRES_AT, expiresAt.toString());

      console.log('✅ [AuthStorage] Tokens saved successfully');
    } catch (error) {
      console.error('❌ [AuthStorage] Error saving tokens:', error);
      throw error;
    }
  },

  /**
   * Get access token
   */
  async getAccessToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
    } catch (error) {
      console.error('❌ [AuthStorage] Error getting access token:', error);
      return null;
    }
  },

  /**
   * Get refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('❌ [AuthStorage] Error getting refresh token:', error);
      return null;
    }
  },

  /**
   * Get user slug
   */
  async getUserSlug(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(KEYS.USER_SLUG);
    } catch (error) {
      console.error('❌ [AuthStorage] Error getting user slug:', error);
      return null;
    }
  },

  /**
   * Check if access token is expired
   */
  async isTokenExpired(): Promise<boolean> {
    try {
      const expiresAt = await SecureStore.getItemAsync(KEYS.TOKEN_EXPIRES_AT);
      if (!expiresAt) {
        return true;
      }

      const expirationTime = parseInt(expiresAt, 10);
      const now = Date.now();

      // Add 60 second buffer to refresh before actual expiration
      return now >= expirationTime - 60000;
    } catch (error) {
      console.error('❌ [AuthStorage] Error checking token expiration:', error);
      return true;
    }
  },

  /**
   * Save user data
   */
  async saveUser(user: User): Promise<void> {
    try {
      await SecureStore.setItemAsync(KEYS.USER_DATA, JSON.stringify(user));
      console.log('✅ [AuthStorage] User data saved successfully');
    } catch (error) {
      console.error('❌ [AuthStorage] Error saving user data:', error);
      throw error;
    }
  },

  /**
   * Get user data
   */
  async getUser(): Promise<User | null> {
    try {
      const userData = await SecureStore.getItemAsync(KEYS.USER_DATA);
      if (!userData) {
        return null;
      }
      return JSON.parse(userData) as User;
    } catch (error) {
      console.error('❌ [AuthStorage] Error getting user data:', error);
      return null;
    }
  },

  /**
   * Get temporary credentials
   */
  async saveTempCredentials(credentials: TempCredentials): Promise<void> {
    try {
      await SecureStore.setItemAsync(KEYS.TEMP_CREDENTIALS, JSON.stringify(credentials));
      console.log('✅ [AuthStorage] Temp credentials saved');
    } catch (error) {
      console.error('❌ [AuthStorage] Error saving temp credentials:', error);
      throw error;
    }
  },

  /**
   * Get temporary credentials
   */
  async getTempCredentials(): Promise<TempCredentials | null> {
    try {
      const credentials = await SecureStore.getItemAsync(KEYS.TEMP_CREDENTIALS);
      if (!credentials) {
        return null;
      }
      return JSON.parse(credentials) as TempCredentials;
    } catch (error) {
      console.error('❌ [AuthStorage] Error getting temp credentials:', error);
      return null;
    }
  },

  /**
   * Clear temporary credentials
   */
  async clearTempCredentials(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(KEYS.TEMP_CREDENTIALS);
      console.log('✅ [AuthStorage] Temp credentials cleared');
    } catch (error) {
      console.error('❌ [AuthStorage] Error clearing temp credentials:', error);
    }
  },

  /**
   * Get initial auth state from storage
   * Used for initializing TanStack Query cache
   */
  async getInitialAuthState(): Promise<{
    user: User | null;
    isAuthenticated: boolean;
  }> {
    try {
      const token = await this.getAccessToken();
      const isExpired = await this.isTokenExpired();

      if (!token || isExpired) {
        return { user: null, isAuthenticated: false };
      }

      const user = await this.getUser();
      return {
        user,
        isAuthenticated: !!user,
      };
    } catch (error) {
      console.error('❌ [AuthStorage] Error getting initial auth state:', error);
      return { user: null, isAuthenticated: false };
    }
  },

  /**
   * Clear all authentication data (logout)
   */
  async clearAll(): Promise<void> {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN),
        SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN),
        SecureStore.deleteItemAsync(KEYS.TOKEN_EXPIRES_AT),
        SecureStore.deleteItemAsync(KEYS.USER_SLUG),
        SecureStore.deleteItemAsync(KEYS.USER_DATA),
        SecureStore.deleteItemAsync(KEYS.TEMP_CREDENTIALS),
      ]);
      console.log('✅ [AuthStorage] All auth data cleared');
    } catch (error) {
      console.error('❌ [AuthStorage] Error clearing auth data:', error);
      throw error;
    }
  },
};
