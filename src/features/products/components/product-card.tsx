import { AspectRatio } from '@/shared/components/ui/aspect-ratio';
import { Card } from '@/shared/components/ui/card';
import { Text } from '@/shared/components/ui/text';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import type { Product } from '@/features/products/api/products';
import { useProductImageUrl } from '@/features/products/queries';

type ProductCardProps = {
  product: Product;
};

export const ProductCard = React.memo(
  ({ product }: ProductCardProps) => {
    const router = useRouter();
    const primaryImage =
      product.images.find((img) => img.isPrimary) ?? product.images[0] ?? null;
    const { data: imageUrl } = useProductImageUrl(primaryImage?.s3Key);

    return (
      <Pressable onPress={() => router.push(`/products/${product.id}`)} className="active:opacity-90">
        <Card className="w-full overflow-hidden rounded-xl bg-card">
          <AspectRatio ratio={4 / 3} className="overflow-hidden bg-muted">
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
              />
            ) : (
              <View className="h-full w-full items-center justify-center bg-muted">
                <Text className="text-4xl">📦</Text>
              </View>
            )}
          </AspectRatio>

          <View className="gap-1 px-3 pb-3 pt-2">
            <Text className="text-sm font-bold text-foreground" numberOfLines={1}>
              {product.name}
            </Text>
            {product.images.length > 1 && (
              <Text className="text-xs text-muted-foreground">
                {product.images.length} fotos
              </Text>
            )}
            <Text className="text-base font-bold text-foreground">
              S/ {product.basePrice.toFixed(2)}
            </Text>
          </View>
        </Card>
      </Pressable>
    );
  },
  (prevProps, nextProps) => prevProps.product.id === nextProps.product.id
);
