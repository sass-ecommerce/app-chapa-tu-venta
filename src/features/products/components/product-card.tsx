import { AspectRatio } from '@/shared/components/ui/aspect-ratio';
import { Badge } from '@/shared/components/ui/badge';
import { Card } from '@/shared/components/ui/card';
import { Icon } from '@/shared/components/ui/icon';
import { Text } from '@/shared/components/ui/text';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useRouter } from 'expo-router';
import { Flame, Star } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, View, Image } from 'react-native';
import type { Product } from '@/features/products/api/products';

type ProductCardProps = {
  product: Product;
};

export const ProductCard = React.memo(
  ({ product }: ProductCardProps) => {
    const router = useRouter();
    const [imageLoading, setImageLoading] = React.useState(true);
    const [imageError, setImageError] = React.useState(false);

    React.useEffect(() => {
      setImageLoading(true);
      setImageError(false);
    }, [product.imageUri]);

    const handlePress = () => {
      router.push(`/products/${product.slug}`);
    };

    // Helper function to get stock badge color based on stock level
    const getStockColor = (stock: number) => {
      if (stock > 10) return 'bg-green-500';
      if (stock >= 3) return 'bg-yellow-500';
      return 'bg-red-500';
    };

    // Check if imageUri is valid
    const hasValidImage = product.imageUri && product.imageUri.trim() !== '';

    return (
      <Pressable onPress={handlePress} className="active:opacity-90">
        <Card className="w-full overflow-hidden rounded-xl bg-card">
          <View className="relative">
            {/* Imagen del producto */}
            <AspectRatio ratio={4 / 3} className="overflow-hidden bg-muted">
              <View className="relative h-full w-full">
                {imageLoading && hasValidImage && !imageError && (
                  <View className="absolute inset-0 z-10">
                    <Skeleton className="h-full w-full" />
                  </View>
                )}
                {hasValidImage && !imageError ? (
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
                ) : (
                  <View className="absolute inset-0 items-center justify-center bg-muted">
                    <Text className="text-4xl">📦</Text>
                  </View>
                )}
              </View>
            </AspectRatio>

            {/* Rating */}
            {/* {product.rating !== undefined && product.rating > 0 && (
            <View className="absolute left-3 top-4">
              <Badge variant="outline" className="rounded-full bg-background/90 px-3 py-1.5">
                <Icon as={Star} size={14} className="text-foreground" />
                <Text className="ml-1 text-sm font-semibold">{product.rating.toFixed(1)}</Text>
              </Badge>
            </View>
          )} */}

            {/* Trending */}
            {product.trending && (
              <View className="absolute right-2 top-2">
                <Badge
                  variant="outline"
                  className="h-7 w-7 items-center justify-center rounded-full bg-background/90">
                  <Icon as={Flame} size={14} className="text-orange-500" fill="#f97316" />
                </Badge>
              </View>
            )}
          </View>

          {/* Info del producto */}
          <View className="gap-1 px-3 pb-3 pt-2">
            <Text className="text-sm font-bold text-foreground" numberOfLines={1}>
              {product.name}
            </Text>

            {/* Stock badge with color indicator */}
            <View className="flex-row items-center gap-1.5">
              <View
                className={`h-1.5 w-1.5 rounded-full ${getStockColor(product.stockQuantity)}`}
              />
              <Text className="text-xs text-muted-foreground">
                {product.stockQuantity} disponibles
              </Text>
            </View>

            {/* Prices inline */}
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
        </Card>
      </Pressable>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if the product slug changes (indicating a different product)
    return prevProps.product.slug === nextProps.product.slug;
  }
);
