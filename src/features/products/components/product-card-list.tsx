import * as React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '@/shared/components/ui/text';
import { Card } from '@/shared/components/ui/card';
import { ChevronRight } from 'lucide-react-native';
import type { Product } from '@/features/products/api/products';

interface ProductCardListProps {
  product: Product;
}

export const ProductCardList = React.memo(
  ({ product }: ProductCardListProps) => {
    const router = useRouter();

    return (
      <Pressable onPress={() => router.push(`/products/${product.id}`)} className="active:opacity-90">
        <Card className="mb-2 flex-row items-center gap-3 overflow-hidden rounded-xl bg-card p-3">
          <View className="h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-muted">
            <Text className="text-2xl">📦</Text>
          </View>

          <View className="flex-1 gap-1">
            <Text className="text-sm font-bold text-foreground" numberOfLines={1}>
              {product.name}
            </Text>
            {product.category && (
              <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                {product.category.name}
              </Text>
            )}
            <Text className="text-base font-bold text-foreground">
              S/ {product.basePrice.toFixed(2)}
            </Text>
          </View>

          <ChevronRight size={20} className="text-muted-foreground" />
        </Card>
      </Pressable>
    );
  },
  (prevProps, nextProps) => prevProps.product.id === nextProps.product.id
);
