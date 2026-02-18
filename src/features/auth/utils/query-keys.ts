/**
 * Centralized query keys for authentication
 * Following TanStack Query best practices for key organization
 */
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  tempCredentials: () => [...authKeys.all, 'tempCredentials'] as const,
} as const;
