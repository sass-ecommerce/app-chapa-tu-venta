import * as React from 'react';
import { View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Package, TrendingDown, DollarSign } from 'lucide-react-native';
import type { Product } from '@/lib/api/products';

interface StatsHeroProps {
  products: Product[];
  isLoading?: boolean;
}

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  delay: number;
  color: string;
}

function StatCard({ icon, value, label, delay, color }: StatCardProps) {
  return (
    <Animated.View entering={FadeInUp.delay(delay).duration(600).springify()} className="flex-1">
      <Card className="items-center justify-center rounded-xl bg-card p-3 shadow-sm">
        <View className={`mb-1.5 rounded-full bg-${color}/10 p-1.5`}>{icon}</View>
        <Text className="text-xl font-bold tracking-tight text-foreground">{value}</Text>
        <Text className="text-[10px] font-medium text-muted-foreground">{label}</Text>
      </Card>
    </Animated.View>
  );
}

export function StatsHero({ products, isLoading = false }: StatsHeroProps) {
  const totalProducts = products.length;
  const lowStockCount = products.filter((p) => p.stockQuantity > 0 && p.stockQuantity < 10).length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stockQuantity, 0);

  // Animated counter for total value
  const animatedValue = useSharedValue(0);

  React.useEffect(() => {
    if (!isLoading && totalValue > 0) {
      animatedValue.value = withDelay(
        400,
        withTiming(totalValue, {
          duration: 1200,
        })
      );
    }
  }, [totalValue, isLoading]);

  if (isLoading) {
    return (
      <View className="gap-2 px-5 pb-3">
        <View className="flex-row gap-2">
          {[1, 2, 3].map((i) => (
            <View key={i} className="flex-1">
              <Card className="h-20 rounded-xl bg-muted" />
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View className="gap-2 px-5 pb-3">
      <View className="flex-row gap-2">
        <StatCard
          icon={<Package size={16} className="text-primary" />}
          value={totalProducts}
          label="Total Productos"
          delay={0}
          color="primary"
        />
        <StatCard
          icon={<TrendingDown size={16} className="text-orange-500" />}
          value={lowStockCount}
          label="Bajo Stock"
          delay={100}
          color="orange-500"
        />
        <StatCard
          icon={<DollarSign size={16} className="text-green-500" />}
          value={`S/ ${(totalValue / 1000).toFixed(1)}K`}
          label="Valor Total"
          delay={200}
          color="green-500"
        />
      </View>
    </View>
  );
}
