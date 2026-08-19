import * as React from 'react';
import { View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { Text } from '@/shared/components/ui/text';
import { Icon } from '@/shared/components/ui/icon';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
  disabled?: boolean;
}

export function ScreenHeader({ title, onBack, right, disabled }: ScreenHeaderProps) {
  const router = useRouter();
  const { top } = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: top }} className="border-b border-border bg-background">
      <View className="flex-row items-center px-2 py-3">
        <Pressable
          onPress={onBack ?? (() => router.back())}
          disabled={disabled}
          className="px-2 py-1 active:opacity-60 disabled:opacity-40">
          <Icon as={ChevronLeft} size={26} className="text-primary" />
        </Pressable>

        <View className="absolute left-0 right-0" pointerEvents="none">
          <Text className="text-center text-base font-semibold text-foreground">{title}</Text>
        </View>

        {right && <View className="ml-auto px-2">{right}</View>}
      </View>
    </View>
  );
}
