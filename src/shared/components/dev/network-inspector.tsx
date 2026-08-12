import * as React from 'react';
import {
  FlatList,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  View,
  useWindowDimensions,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Check, ChevronLeft, ChevronRight, Copy, Eye, Trash2, X } from 'lucide-react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Icon } from '@/shared/components/ui/icon';
import { Text } from '@/shared/components/ui/text';
import { cn } from '@/shared/utils/utils';
import { useNetworkLogStore, type NetworkLogEntry } from '@/shared/utils/network-log-store';

function statusColorClass(entry: NetworkLogEntry) {
  if (entry.state === 'pending') return 'bg-muted text-muted-foreground';
  if (entry.state === 'error' || (entry.status && entry.status >= 400))
    return 'bg-destructive text-destructive-foreground';
  return 'bg-primary text-primary-foreground';
}

const CODE_FONT = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' });

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <View className="overflow-hidden rounded-md border border-border bg-muted">
      <View className="flex-row items-center justify-end border-b border-border px-2 py-1">
        <Pressable
          onPress={handleCopy}
          hitSlop={8}
          className="flex-row items-center gap-1 px-1 py-0.5"
        >
          <Icon as={copied ? Check : Copy} className="text-muted-foreground" size={12} />
          <Text className="text-[10px] text-muted-foreground">
            {copied ? 'Copiado' : 'Copiar'}
          </Text>
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator>
        <Text className="p-2 text-xs text-foreground" style={{ fontFamily: CODE_FONT }}>
          {code}
        </Text>
      </ScrollView>
    </View>
  );
}

function NetworkLogRow({ entry }: { entry: NetworkLogEntry }) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <View className="border-b border-border px-4 py-3">
      <Pressable onPress={() => setExpanded((prev) => !prev)}>
        <View className="flex-row items-center gap-2">
          <View className={cn('rounded-full px-2 py-0.5', statusColorClass(entry))}>
            <Text className="text-xs font-semibold">
              {entry.state === 'pending' ? '...' : (entry.status ?? '—')}
            </Text>
          </View>
          <Text className="text-xs font-semibold text-muted-foreground">{entry.method}</Text>
          <View className="flex-1" />
          <Text className="text-xs text-muted-foreground">
            {new Date(entry.timestamp).toLocaleTimeString()}
          </Text>
          {entry.duration !== undefined && (
            <Text className="text-xs text-muted-foreground">· {entry.duration}ms</Text>
          )}
        </View>

        <Text
          className="mt-1 text-sm font-medium text-foreground"
          numberOfLines={expanded ? undefined : 2}
        >
          {entry.path}
        </Text>
      </Pressable>

      {expanded && (
        <View className="mt-2 gap-2">
          <Text className="text-[11px] text-muted-foreground">{entry.url}</Text>
          {entry.requestData !== undefined && (
            <View className="gap-1">
              <Text className="text-xs font-semibold text-foreground">Request</Text>
              <CodeBlock code={JSON.stringify(entry.requestData, null, 2)} />
            </View>
          )}
          {entry.responseData !== undefined && (
            <View className="gap-1">
              <Text className="text-xs font-semibold text-foreground">Response</Text>
              <CodeBlock code={JSON.stringify(entry.responseData, null, 2)} />
            </View>
          )}
          {entry.error && (
            <View className="gap-1">
              <Text className="text-xs font-semibold text-destructive">Error</Text>
              <Text className="text-xs text-destructive">{entry.error}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

function NetworkInspectorPanel({ onClose }: { onClose: () => void }) {
  const logs = useNetworkLogStore((state) => state.logs);
  const clearLogs = useNetworkLogStore((state) => state.clearLogs);

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-background">
      <View className="flex-row items-center justify-between border-b border-border px-4 py-3">
        <Text className="text-base font-semibold text-foreground">
          Network ({logs.length})
        </Text>
        <View className="flex-row items-center gap-4">
          <Pressable onPress={clearLogs} hitSlop={8}>
            <Icon as={Trash2} className="text-muted-foreground" size={20} />
          </Pressable>
          <Pressable onPress={onClose} hitSlop={8}>
            <Icon as={X} className="text-foreground" size={22} />
          </Pressable>
        </View>
      </View>

      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NetworkLogRow entry={item} />}
        ListEmptyComponent={
          <View className="items-center justify-center py-16">
            <Text className="text-sm text-muted-foreground">Sin peticiones registradas</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const HANDLE_WIDTH = 28;
const TRIGGER_WIDTH = 48;
const PILL_WIDTH = HANDLE_WIDTH + TRIGGER_WIDTH;
const PILL_HEIGHT = 48;
const EDGE_MARGIN = 16;

export function NetworkInspector() {
  const [open, setOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(true);
  const { height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const minY = insets.top + EDGE_MARGIN;
  const maxY = screenHeight - insets.bottom - PILL_HEIGHT - EDGE_MARGIN;

  const posY = useSharedValue(Math.min(screenHeight * 0.6, maxY));
  const dragStartY = React.useRef(0);
  const translateX = useSharedValue(PILL_WIDTH - HANDLE_WIDTH);

  React.useEffect(() => {
    translateX.value = withTiming(collapsed ? PILL_WIDTH - HANDLE_WIDTH : 0, { duration: 200 });
  }, [collapsed, translateX]);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponderCapture: (_event, gesture) => Math.abs(gesture.dy) > 6,
      onPanResponderGrant: () => {
        dragStartY.current = posY.value;
      },
      onPanResponderMove: (_event, gesture) => {
        const next = dragStartY.current + gesture.dy;
        posY.value = Math.min(Math.max(next, minY), maxY);
      },
    })
  ).current;

  const containerStyle = useAnimatedStyle(() => ({
    top: posY.value,
    transform: [{ translateX: translateX.value }],
  }));

  if (!__DEV__) return null;

  return (
    <>
      <Animated.View
        {...panResponder.panHandlers}
        style={containerStyle}
        className="absolute right-0 z-50 flex-row items-center overflow-hidden rounded-l-2xl bg-foreground/90 shadow-lg shadow-black/20"
      >
        <Pressable
          onPress={() => setCollapsed((prev) => !prev)}
          hitSlop={8}
          className="items-center justify-center"
          style={{ width: HANDLE_WIDTH, height: PILL_HEIGHT }}
        >
          <Icon
            as={collapsed ? ChevronLeft : ChevronRight}
            className="text-background"
            size={18}
          />
        </Pressable>
        <View className="h-8 w-px bg-background/20" />
        <Pressable
          onPress={() => setOpen(true)}
          className="items-center justify-center"
          style={{ width: TRIGGER_WIDTH, height: PILL_HEIGHT }}
        >
          <Icon as={Eye} className="text-background" size={22} />
        </Pressable>
      </Animated.View>

      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <NetworkInspectorPanel onClose={() => setOpen(false)} />
      </Modal>
    </>
  );
}
