// API Configuration
export const API_CONFIG = {
  baseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  authToken: process.env.EXPO_PUBLIC_SUPABASE_AUTH_TOKEN!,
  // Kept for backwards compatibility with other endpoints
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL!,
  supabaseKey: process.env.EXPO_PUBLIC_SUPABASE_API_KEY!,
};

// Base fetch function with headers and query params support
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
  queryParams?: Record<string, string>
): Promise<T> {
  // Construct URL with query params
  let url = `${API_CONFIG.baseUrl}${endpoint}`;

  if (queryParams) {
    const params = new URLSearchParams(queryParams);
    url += `?${params.toString()}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    console.error('API fetch error:', await response.text());
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
