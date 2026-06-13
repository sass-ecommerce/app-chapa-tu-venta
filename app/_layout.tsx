import '@/global.css';

import { NAV_THEME } from '@/shared/context/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
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
  React.useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)/sign-in" />
      <Stack.Screen name="(auth)/sign-up" />
      <Stack.Screen name="(auth)/forgot-password" />
      <Stack.Screen name="(auth)/reset-password" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(onboarding)/register-store" />
      <Stack.Screen name="products/[slug]" />
      <Stack.Screen name="products/create" />
      <Stack.Screen name="categories" />
      <Stack.Screen name="categories/[id]" />
      <Stack.Screen name="profile/edit" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
