import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'expo-router';
import { Flame, Star } from 'lucide-react-native';
import * as React from 'react';
import { Image, Pressable, View } from 'react-native';

export type Product = {
  id: string;
  store_id?: number;
  category_id?: string;
  sku?: string;
  name: string;
  description?: string;
  price: number;
  price_list?: number; // precio de lista
  price_base?: number; // precio base
  stock_quantity: number;
  image_uri?: string;
  rating?: number;
  trending?: boolean;
  is_active?: boolean;
  created_at?: string;
};

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const [imageLoading, setImageLoading] = React.useState(true);

  const handlePress = () => {
    router.push(`/products/${product.id}`);
  };

  return (
    <Pressable onPress={handlePress}>
      <Card className="w-full overflow-hidden rounded-2xl bg-card">
        <View className="relative">
          {/* Imagen del producto */}
          <AspectRatio ratio={1} className="overflow-hidden">
            {imageLoading && product.image_uri && <Skeleton className="h-full w-full" />}
            {product.image_uri ? (
              <Image
                source={{ uri: product.image_uri }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
                onLoadStart={() => setImageLoading(true)}
                onLoadEnd={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />
            ) : (
              <Skeleton className="h-full w-full" />
            )}
          </AspectRatio>

          {/* Rating y Trending */}
          {product.rating !== undefined && product.rating > 0 && (
            <View
              className="absolute left-3 top-4 flex-row items-center justify-between"
              style={{ width: '88%' }}>
              <Badge variant="outline" className="rounded-full bg-background/90 px-3 py-1.5">
                <Icon as={Star} size={14} className="text-foreground" />
                <Text className="ml-1 text-sm font-semibold">{product.rating.toFixed(1)}</Text>
              </Badge>
              {product.trending && (
                <Badge
                  variant="outline"
                  className="h-9 w-9 items-center justify-center rounded-full bg-background/90">
                  <Icon as={Flame} size={18} className="text-orange-500" fill="#f97316" />
                </Badge>
              )}
            </View>
          )}
        </View>

        {/* Info del producto */}
        <View className="px-4 pb-4">
          <Text className="text-lg font-semibold text-foreground" numberOfLines={1}>
            {product.name}
          </Text>
          <Text className="mt-1 text-xs text-muted-foreground">
            Stock: {product.stock_quantity} unidades
          </Text>
          <View className="mt-2 flex-row items-center justify-between">
            <View>
              <Text className="text-xl font-bold text-foreground">
                S/ {product.price.toFixed(2)}
              </Text>
              {product.price_list && product.price_list > product.price && (
                <Text className="text-sm text-muted-foreground line-through">
                  S/ {product.price_list.toFixed(2)}
                </Text>
              )}
            </View>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}
