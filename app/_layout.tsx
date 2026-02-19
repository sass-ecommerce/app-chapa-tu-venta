import '@/global.css';

import { NAV_THEME } from '@/shared/context/theme';
import { useAuth } from '@/shared/hooks/hooks';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Create QueryClient outside component to avoid recreating on each render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Routes />
        <PortalHost />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

SplashScreen.preventAutoHideAsync();

function Routes() {
  const { isAuthenticated, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  // Redirigir automáticamente cuando cambia el estado de autenticación
  React.useEffect(() => {
    if (isLoading) return; // Esperar a que termine de cargar

    if (!isAuthenticated) {
      // Usuario no autenticado → redirigir a sign-in
      console.log('🔒 [Routes] User not authenticated. Redirecting to sign-in...');
      router.replace('/(auth)/sign-in');
    } else {
      // Usuario autenticado → redirigir a index (pantalla de bienvenida animada)
      console.log('✅ [Routes] User authenticated. Redirecting to welcome screen...');
      router.replace('/');
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      {!isAuthenticated ? (
        <>
          {/* Screens only shown when the user is NOT authenticated */}
          <Stack.Screen name="(auth)/sign-in" />
          <Stack.Screen name="(auth)/sign-up" />
          <Stack.Screen name="(auth)/reset-password" />
          <Stack.Screen name="(auth)/forgot-password" />
        </>
      ) : (
        <>
          {/* Screens only shown when the user IS authenticated */}
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(onboarding)/register-store" />
          <Stack.Screen name="products/[id]" />
          <Stack.Screen name="products/create" />
          <Stack.Screen name="profile/edit" />
        </>
      )}

      {/* Screens outside the guards are accessible to everyone (e.g. not found) */}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
