import * as React from 'react';
import { View } from 'react-native';

import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { ShoppingBag } from 'lucide-react-native';

import { Text } from '@/shared/components/ui/text';

import { useAuth } from '@/shared/hooks/hooks';

const ANIMATION_DURATION = 2000; // 2 segundos

export default function AnimatedWelcomeScreen() {
  const { isAuthenticated, isLoading } = useAuth();

  // Shared values para animaciones
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.3);
  const logoRotate = useSharedValue(-180);

  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(-30);

  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(20);

  const progressWidth = useSharedValue(0);
  const screenOpacity = useSharedValue(1);

  React.useEffect(() => {
    // Esperar a que Auth cargue
    if (isLoading) {
      console.log('⏳ [WelcomeScreen] Waiting for Auth to load...');
      return;
    }

    // Si NO está autenticado, redirigir a sign-in inmediatamente
    if (!isAuthenticated) {
      console.log('🚪 [WelcomeScreen] User not authenticated. Redirecting to sign-in...');
      router.replace('/(auth)/sign-in');
      return;
    }

    console.log('✅ [WelcomeScreen] Auth loaded. User authenticated. Starting animation...');
    console.log('📍 [WelcomeScreen] isAuthenticated:', isAuthenticated);

    // 1. Logo: Bounce in + rotate (0-800ms)
    logoOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.ease) });
    logoScale.value = withSpring(1.2, { damping: 12, stiffness: 100 }, () => {
      logoScale.value = withSpring(1.0, { damping: 10, stiffness: 80 });
    });
    logoRotate.value = withSpring(0, { damping: 15, stiffness: 100 });

    // 2. Título: Slide from top (400ms delay)
    setTimeout(() => {
      titleOpacity.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.back(1.5)) });
      titleTranslateY.value = withTiming(0, {
        duration: 500,
        easing: Easing.out(Easing.back(1.5)),
      });
    }, 400);

    // 3. Subtítulo: Fade in from bottom (600ms delay)
    setTimeout(() => {
      subtitleOpacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) });
      subtitleTranslateY.value = withTiming(0, {
        duration: 400,
        easing: Easing.out(Easing.ease),
      });
    }, 600);

    // 4. Barra de progreso: 0 → 100% en 2s
    progressWidth.value = withTiming(1, { duration: ANIMATION_DURATION, easing: Easing.linear });

    // 5. Fade out (1800ms)
    setTimeout(() => {
      screenOpacity.value = withTiming(0, { duration: 200 });
    }, 1800);

    // 6. Navegar cuando termine la animación completa (2000ms)
    const navigationTimeout = setTimeout(() => {
      console.log('✅ [WelcomeScreen] Animation completed. Navigating to /(tabs)...');
      router.replace('/(tabs)');
    }, ANIMATION_DURATION);

    return () => clearTimeout(navigationTimeout);
  }, [isLoading, isAuthenticated]);

  // Estilos animados
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }, { rotate: `${logoRotate.value}deg` }],
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  const screenAnimatedStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  return (
    <Animated.View style={[{ flex: 1 }, screenAnimatedStyle]} className="bg-background">
      <View className="flex-1 items-center justify-center px-8">
        {/* Logo con animación de bounce + rotate */}
        <Animated.View style={logoAnimatedStyle}>
          <View className="mb-8 h-32 w-32 items-center justify-center rounded-[32px] bg-primary shadow-lg shadow-primary/30">
            <ShoppingBag size={64} color="white" strokeWidth={2.5} />
          </View>
        </Animated.View>

        {/* Título con slide desde arriba */}
        <Animated.View style={titleAnimatedStyle}>
          <Text className="mb-4 text-center text-5xl font-bold text-foreground">
            Chapa Tu Venta
          </Text>
        </Animated.View>

        {/* Subtítulo con fade desde abajo */}
        <Animated.View style={subtitleAnimatedStyle}>
          <Text className="text-center text-lg text-muted-foreground">
            Gestiona tu negocio de manera simple y efectiva
          </Text>
        </Animated.View>
      </View>

      {/* Barra de progreso en la parte inferior */}
      <View className="absolute bottom-0 left-0 right-0 px-8 pb-12">
        <View className="h-1 w-full overflow-hidden rounded-full bg-muted">
          <Animated.View
            style={progressAnimatedStyle}
            className="h-full rounded-full bg-primary shadow-sm shadow-primary/50"
          />
        </View>
      </View>
    </Animated.View>
  );
}
