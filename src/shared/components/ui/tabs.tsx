import * as React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Text } from '@/shared/components/ui/text';
import { cn } from '@/shared/utils/utils';

interface Tab {
  value: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  /** Overrides the active indicator + active count badge (defaults to the `primary` token). */
  accentColor?: string;
  accentForeground?: string;
}

export function Tabs({
  tabs,
  value,
  onValueChange,
  className,
  accentColor,
  accentForeground = '#fff',
}: TabsProps) {
  const [tabWidths, setTabWidths] = React.useState<number[]>([]);
  const [tabPositions, setTabPositions] = React.useState<number[]>([]);
  const indicatorLeft = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

  const activeIndex = tabs.findIndex((tab) => tab.value === value);

  React.useEffect(() => {
    if (tabWidths.length > 0 && tabPositions.length > 0 && activeIndex >= 0) {
      indicatorLeft.value = withSpring(tabPositions[activeIndex], {
        damping: 20,
        stiffness: 90,
      });
      indicatorWidth.value = withSpring(tabWidths[activeIndex], {
        damping: 20,
        stiffness: 90,
      });
    }
  }, [activeIndex, tabWidths, tabPositions]);

  const indicatorStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    bottom: 0,
    left: indicatorLeft.value,
    width: indicatorWidth.value,
    height: 3,
  }));

  return (
    <View className={cn('border-b border-border', className)}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row"
        contentContainerStyle={{ paddingHorizontal: 20 }}>
        <View className="relative flex-row">
          {tabs.map((tab, index) => {
            const isActive = tab.value === value;
            return (
              <Pressable
                key={tab.value}
                onPress={() => onValueChange(tab.value)}
                onLayout={(event) => {
                  const { width, x } = event.nativeEvent.layout;
                  setTabWidths((prev) => {
                    const newWidths = [...prev];
                    newWidths[index] = width;
                    return newWidths;
                  });
                  setTabPositions((prev) => {
                    const newPositions = [...prev];
                    newPositions[index] = x;
                    return newPositions;
                  });
                }}
                className="px-4 py-3">
                <View className="flex-row items-center gap-2">
                  <Text
                    className={cn(
                      'text-base font-semibold transition-colors',
                      isActive ? 'text-foreground' : 'text-muted-foreground'
                    )}>
                    {tab.label}
                  </Text>
                  {tab.count !== undefined && (
                    <View
                      className={cn(
                        'min-w-[20px] items-center justify-center rounded-full px-1.5 py-0.5',
                        isActive && !accentColor && 'bg-primary',
                        !isActive && 'bg-muted'
                      )}
                      style={isActive && accentColor ? { backgroundColor: accentColor } : undefined}>
                      <Text
                        className={cn(
                          'text-xs font-bold',
                          isActive && !accentColor && 'text-primary-foreground',
                          !isActive && 'text-muted-foreground'
                        )}
                        style={isActive && accentColor ? { color: accentForeground } : undefined}>
                        {tab.count}
                      </Text>
                    </View>
                  )}
                </View>
              </Pressable>
            );
          })}
          <Animated.View
            style={[indicatorStyle, accentColor ? { backgroundColor: accentColor } : null]}
            className={cn(!accentColor && 'bg-primary')}
          />
        </View>
      </ScrollView>
    </View>
  );
}
