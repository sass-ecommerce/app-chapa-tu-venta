// API Configuration
export const API_CONFIG = {
  baseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL!,
  apiKey: process.env.EXPO_PUBLIC_SUPABASE_API_KEY!,
  authToken: process.env.EXPO_PUBLIC_SUPABASE_AUTH_TOKEN!,
};

// Base fetch function with headers
export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_CONFIG.baseUrl}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      apikey: API_CONFIG.apiKey,
      Authorization: `Bearer ${API_CONFIG.authToken}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
