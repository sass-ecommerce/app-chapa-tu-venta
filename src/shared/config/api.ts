import axios, { type InternalAxiosRequestConfig } from 'axios';
import { router } from 'expo-router';
import { authStorage } from '@/features/auth/utils/storage';
import { useNetworkLogStore } from '@/shared/utils/network-log-store';

export const API_CONFIG = {
  baseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api',
};

const isDevelopment = process.env.EXPO_PUBLIC_ENVIRONMENT === 'development';

export const apiClient = axios.create({
  baseURL: API_CONFIG.baseUrl,
  headers: { 'Content-Type': 'application/json' },
});

type TrackedRequestConfig = InternalAxiosRequestConfig & {
  _logId?: string;
  _startTime?: number;
};

// ─── Request interceptor ─────────────────────────────────────────────────────
// Inyecta el access token en cada petición saliente.

apiClient.interceptors.request.use(async (config: TrackedRequestConfig) => {
  const token = await authStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log(`[API] ➡️  ${config.method?.toUpperCase()} ${config.url}`);
  } else {
    console.warn(`[API] ⚠️  ${config.method?.toUpperCase()} ${config.url} — sin access token`);
  }

  if (isDevelopment) {
    config._logId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    config._startTime = Date.now();
    useNetworkLogStore.getState().startLog({
      id: config._logId,
      method: config.method?.toUpperCase() ?? 'GET',
      url: `${config.baseURL ?? ''}${config.url ?? ''}`,
      path: config.url ?? '',
      timestamp: config._startTime,
      requestData: config.data,
    });
  }

  return config;
});

// ─── Response interceptor ────────────────────────────────────────────────────
//
// Regla 1 — 401: intenta refrescar el access token. Si el refresh falla por
//           cualquier motivo, cierra la sesión y redirige al login.
//
// Regla 2 — Otros errores (4xx, 5xx, red): los deja pasar sin intervenir para
//           que el catch de cada mutation/query los maneje según su contexto.

type FailedRequest = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
};

const clearSessionAndRedirect = async () => {
  console.log('[API] 🔒 Sesión cerrada — redirigiendo a sign-in');
  await authStorage.clearTokens();
  await authStorage.clearUser();
  router.replace('/(auth)/sign-in');
};

apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API] ✅ ${response.status} ${response.config.url}`);

    const config = response.config as TrackedRequestConfig;
    if (isDevelopment && config._logId) {
      useNetworkLogStore.getState().resolveLog(config._logId, {
        state: 'success',
        status: response.status,
        statusText: response.statusText,
        duration: config._startTime ? Date.now() - config._startTime : undefined,
        responseData: response.data,
      });
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config as TrackedRequestConfig & { _retry?: boolean };
    const status = error.response?.status;
    const url = originalRequest?.url ?? 'unknown';

    if (isDevelopment && originalRequest?._logId) {
      useNetworkLogStore.getState().resolveLog(originalRequest._logId, {
        state: 'error',
        status,
        statusText: error.response?.statusText,
        duration: originalRequest._startTime ? Date.now() - originalRequest._startTime : undefined,
        responseData: error.response?.data,
        error: error.message,
      });
    }

    // ── Regla 2: cualquier error que no sea 401 (o sin config) pasa directo ──
    if (!originalRequest || status !== 401 || originalRequest._retry) {
      console.warn(`[API] ❌ ${status ?? 'SIN_RESPUESTA'} ${url} — propagando error al caller`);
      console.error(`[API] Detalles del error:`, error.response?.data ?? error.message ?? error);
      return Promise.reject(error);
    }

    console.log(`[API] 🔑 401 en ${url} — iniciando refresh del access token`);

    // Cola de peticiones concurrentes que llegaron mientras el refresh está activo
    if (isRefreshing) {
      console.log('[API] ⏳ Refresh en curso — petición encolada');
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          console.log(`[API] ♻️  Reintentando ${url} con nuevo token (desde cola)`);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = await authStorage.getRefreshToken();

      if (!refreshToken) {
        throw new Error('No hay refresh token almacenado');
      }

      console.log('[API] 📡 Llamando a /auth/refresh...');

      // Raw axios para no disparar este mismo interceptor
      const { data } = await axios.post<{
        data: { accessToken: string; refreshToken: string };
      }>(`${API_CONFIG.baseUrl}/auth/refresh-token`, { refreshToken });

      const newAccessToken = data.data.accessToken;
      const newRefreshToken = data.data.refreshToken;

      console.log('[API] ✅ Refresh exitoso — guardando nuevos tokens');

      await authStorage.saveTokens(newAccessToken, newRefreshToken);
      apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      processQueue(null, newAccessToken);

      console.log(`[API] ♻️  Reintentando ${url} con nuevo access token`);
      return apiClient(originalRequest);
    } catch (refreshError) {
      console.error('[API] 🚨 Refresh falló — cerrando sesión', refreshError);
      processQueue(refreshError, null);
      await clearSessionAndRedirect();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
