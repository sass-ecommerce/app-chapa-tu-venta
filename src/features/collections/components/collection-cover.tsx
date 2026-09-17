import * as React from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'nativewind';

import { Text } from '@/shared/components/ui/text';
import { getVitrinaTheme } from '@/shared/config/vitrina-palette';

interface CollectionCoverProps {
  name: string;
  coverImageUrl?: string | null;
  previewImageUrls?: string[];
  monogramFontSize?: number;
}

/**
 * Resolves a collection's cover art: the manually uploaded photo when there
 * is one, otherwise an auto-collage of the first 4 product photos (like a
 * playlist cover), otherwise a gradient monogram — never a generic folder icon.
 */
export function CollectionCover({
  name,
  coverImageUrl,
  previewImageUrls = [],
  monogramFontSize = 36,
}: CollectionCoverProps) {
  const { colorScheme } = useColorScheme();
  const theme = getVitrinaTheme(colorScheme === 'dark');

  if (coverImageUrl) {
    return (
      <Image
        source={{ uri: coverImageUrl }}
        style={{ width: '100%', height: '100%' }}
        contentFit="cover"
      />
    );
  }

  if (previewImageUrls.length >= 4) {
    return (
      <View className="h-full w-full flex-row flex-wrap" style={{ gap: 1.5 }}>
        {previewImageUrls.slice(0, 4).map((url, index) => (
          <View key={index} style={{ width: '49.5%', height: '49.5%' }}>
            <Image source={{ uri: url }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
          </View>
        ))}
      </View>
    );
  }

  const initial = name.trim().charAt(0).toUpperCase() || '#';

  return (
    <LinearGradient
      colors={[theme.accent, theme.accent2]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
      <Text className="font-extrabold text-white" style={{ fontSize: monogramFontSize }}>
        {initial}
      </Text>
    </LinearGradient>
  );
}
