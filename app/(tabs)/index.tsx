import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useUser } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import { Clock, Flame, Flag, Navigation, XIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Image, type ImageStyle, View } from 'react-native';
import { Switch } from '@/components/ui/switch';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const STORE_LOGO = require('@/assets/images/tienda.png');

const CLERK_LOGO = {
  light: require('@/assets/images/clerk-logo-light.png'),
  dark: require('@/assets/images/clerk-logo-dark.png'),
};

const LOGO_STYLE: ImageStyle = {
  height: 80,
  width: 80,
};

export default function HomeScreen() {
  const { colorScheme } = useColorScheme();
  const { user } = useUser();
  
  // Datos de ventas
  const salesData = {
    current: 100, // Número de ventas del día
    goal: 1000, // Objetivo de ventas
  };
  
  // Calcular el porcentaje (0-100)
  const salesPercentage = (salesData.current / salesData.goal) * 100;
  
  // Estado para animación del contador
  const [animatedSales, setAnimatedSales] = React.useState(0);
  
  // Animar el contador de ventas
  React.useEffect(() => {
    const duration = 1500; // duración de la animación en ms
    const steps = 60; // número de pasos
    const increment = salesData.current / steps;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setAnimatedSales(Math.round(increment * currentStep));
      } else {
        setAnimatedSales(salesData.current);
        clearInterval(timer);
      }
    }, stepDuration);
    
    return () => clearInterval(timer);
  }, [salesData.current]);

  return (
    <View className="flex-1 gap-8 p-4">
      {/* Header con saludo y logo */}
      <View className="flex-row items-start justify-start pt-12">
        <View>
          <Text className="text-base font-normal">Hola</Text>
          <Text className="text-2xl font-bold">{user?.firstName || 'Cesar'}</Text>
        </View>
        <Image source={STORE_LOGO} style={LOGO_STYLE} />
      </View>

      {/* Progreso Circular de Ventas */}
      <View className="items-center justify-center">
        <AnimatedCircularProgress
          size={200}
          width={15}
          fill={salesPercentage}
          tintColor="#10b981"
          backgroundColor="#e5e7eb"
          rotation={0}
          lineCap="round"
          duration={1500}>
          {() => (
            <View className="items-center">
              <Text className="text-4xl font-bold text-foreground">{animatedSales}</Text>
              <Text className="text-sm text-muted-foreground">de {salesData.goal}</Text>
              <Text className="mt-2 text-xs font-medium text-primary">ventas del día</Text>
              <Text className="mt-1 text-xs text-muted-foreground">
                {salesPercentage.toFixed(1)}% completado
              </Text>
            </View>
          )}
        </AnimatedCircularProgress>
      </View>

      {/* Actividades */}
      <View className="gap-4">
        <Text className="text-2xl font-bold">Actividades</Text>

        <View className="flex-row gap-4">
          {/* Training Times */}
          <View className="flex-1 rounded-2xl bg-card p-4 shadow-sm">
            <Icon as={Clock} className="text-muted-foreground" size={20} />
            <Text className="mt-3 text-3xl font-bold">120</Text>
            <Text className="text-xs text-muted-foreground">minutes</Text>
            <Text className="mt-2 text-sm font-medium text-primary">Training Times</Text>
          </View>

          {/* Maximum Distance */}
          <View className="flex-1 rounded-2xl bg-card p-4 shadow-sm">
            <Icon as={Navigation} className="text-muted-foreground" size={20} />
            <Text className="mt-3 text-3xl font-bold">5600</Text>
            <Text className="text-xs text-muted-foreground">kilometers</Text>
            <Text className="mt-2 text-sm font-medium text-primary">Maximum Distance</Text>
          </View>
        </View>

        <View className="flex-row gap-4">
          {/* Estimated Point */}
          <View className="flex-1 rounded-2xl bg-card p-4 shadow-sm">
            <Icon as={Flag} className="text-muted-foreground" size={20} />
            <Text className="mt-3 text-3xl font-bold">8020</Text>
            <Text className="text-xs text-muted-foreground">points</Text>
            <Text className="mt-2 text-sm font-medium text-primary">Estimated Point</Text>
          </View>

          {/* Calories */}
          <View className="flex-1 rounded-2xl bg-card p-4 shadow-sm">
            <Icon as={Flame} className="text-muted-foreground" size={20} />
            <Text className="mt-3 text-3xl font-bold">450</Text>
            <Text className="text-xs text-muted-foreground">cal</Text>
            <Text className="mt-2 text-sm font-medium text-primary">Calories</Text>
          </View>
        </View>
      </View>
      {/* actividades */}
    </View>
  );
}
