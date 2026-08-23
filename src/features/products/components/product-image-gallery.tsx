import * as React from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import { Image } from 'expo-image';

import { Text } from '@/shared/components/ui/text';
import type { ProductImage } from '@/features/products/types';

interface GalleryImageProps {
  image: ProductImage;
  width: number;
  height: number;
}

function GalleryImage({ image, width, height }: GalleryImageProps) {
  const imageUrl = image.url;

  return (
    <View style={{ width, height }} className="items-center justify-center bg-muted">
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={{ width, height }} contentFit="cover" />
      ) : (
        <Text className="text-6xl">📦</Text>
      )}
    </View>
  );
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  height?: number;
}

export function ProductImageGallery({ images, height = 256 }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const screenWidth = Dimensions.get('window').width;

  const sortedImages = React.useMemo(
    () =>
      [...images].sort((a, b) => {
        if (a.isPrimary !== b.isPrimary) return a.isPrimary ? -1 : 1;
        return a.sortOrder - b.sortOrder;
      }),
    [images]
  );

  if (sortedImages.length === 0) {
    return (
      <View style={{ height }} className="w-full items-center justify-center bg-muted">
        <Text className="text-6xl">📦</Text>
      </View>
    );
  }

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
          setActiveIndex(index);
        }}>
        {sortedImages.map((image) => (
          <GalleryImage key={image.id} image={image} width={screenWidth} height={height} />
        ))}
      </ScrollView>

      {sortedImages.length > 1 && (
        <View className="absolute bottom-3 w-full flex-row justify-center gap-1.5">
          {sortedImages.map((image, index) => (
            <View
              key={image.id}
              className={`h-1.5 w-1.5 rounded-full ${
                index === activeIndex ? 'bg-primary' : 'bg-white/60'
              }`}
            />
          ))}
        </View>
      )}
    </View>
  );
}
