import * as React from 'react';
import { View, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '@/shared/components/ui/text';
import { Card } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { ChevronRight } from 'lucide-react-native';
import type { Product } from '@/features/products/api/products';

interface ProductCardListProps {
  product: Product;
}

export const ProductCardList = React.memo(
  ({ product }: ProductCardListProps) => {
    const router = useRouter();
    const [imageLoading, setImageLoading] = React.useState(true);
    const [imageError, setImageError] = React.useState(false);

    React.useEffect(() => {
      setImageLoading(true);
      setImageError(false);
    }, [product.imageUri]);

    const handlePress = () => {
      console.log('Navigating to product detail for slug:', product.slug);
      router.push(`/products/${product.slug}`);
    };

    const getStockColor = (stock: number) => {
      if (stock > 10) return 'bg-green-500';
      if (stock >= 3) return 'bg-yellow-500';
      return 'bg-red-500';
    };

    const hasValidImage = product.imageUri && product.imageUri.trim() !== '';

    return (
      <Pressable onPress={handlePress} className="active:opacity-90">
        <Card className="mb-2 flex-row items-center gap-3 overflow-hidden rounded-xl bg-card p-3">
          {/* Image thumbnail */}
          <View className="h-16 w-16 overflow-hidden rounded-lg bg-muted">
            {hasValidImage && !imageError ? (
              <>
                {imageLoading && (
                  <View className="absolute inset-0 z-10">
                    <Skeleton className="h-full w-full" />
                  </View>
                )}
                <Image
                  source={{ uri: product.imageUri }}
                  resizeMode="cover"
                  style={{ width: '100%', height: '100%' }}
                  onLoadStart={() => setImageLoading(true)}
                  onLoad={() => setImageLoading(false)}
                  onError={() => {
                    setImageLoading(false);
                    setImageError(true);
                  }}
                />
              </>
            ) : (
              <View className="h-full w-full items-center justify-center bg-muted">
                <Text className="text-2xl">📦</Text>
              </View>
            )}
          </View>

          {/* Product info */}
          <View className="flex-1 gap-1">
            <Text className="text-sm font-bold text-foreground" numberOfLines={1}>
              {product.name}
            </Text>

            <View className="flex-row items-center gap-1.5">
              <View
                className={`h-1.5 w-1.5 rounded-full ${getStockColor(product.stockQuantity)}`}
              />
              <Text className="text-xs text-muted-foreground">
                {product.stockQuantity} disponibles
              </Text>
            </View>

            <View className="flex-row items-center gap-1.5">
              <Text className="text-base font-bold text-foreground">
                S/ {product.price.toFixed(2)}
              </Text>
              {product.priceList && product.priceList > product.price && (
                <Text className="text-xs text-muted-foreground line-through">
                  S/ {product.priceList.toFixed(2)}
                </Text>
              )}
            </View>
          </View>

          {/* Chevron */}
          <ChevronRight size={20} className="text-muted-foreground" />
        </Card>
      </Pressable>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.product.slug === nextProps.product.slug;
  }
);
