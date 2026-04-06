export const API_CONFIG = {
  baseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
};

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
  queryParams?: Record<string, string>
): Promise<T> {
  let url = `${API_CONFIG.baseUrl}${endpoint}`;

  if (queryParams) {
    url += `?${new URLSearchParams(queryParams).toString()}`;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ [API] fetch error:', errorText);
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
