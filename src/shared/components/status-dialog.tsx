import * as React from 'react';
import { View } from 'react-native';
import { Check, AlertCircle } from 'lucide-react-native';

import * as AlertDialogPrimitive from '@rn-primitives/alert-dialog';
import { NativeOnlyAnimatedView } from '@/shared/components/ui/native-only-animated-view';
import { Text } from '@/shared/components/ui/text';
import { cn } from '@/shared/utils/utils';
import { Platform } from 'react-native';
import { FadeIn, FadeOut } from 'react-native-reanimated';
import { FullWindowOverlay as RNFullWindowOverlay } from 'react-native-screens';

const FullWindowOverlay = Platform.OS === 'ios' ? RNFullWindowOverlay : React.Fragment;

const config = {
  success: {
    blob: 'bg-green-50',
    circle: 'bg-green-500',
    button: 'bg-green-500',
    Icon: Check,
  },
  error: {
    blob: 'bg-red-50',
    circle: 'bg-red-500',
    button: 'bg-red-500',
    Icon: AlertCircle,
  },
} as const;

interface StatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: 'success' | 'error';
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

export function StatusDialog({
  open,
  onOpenChange,
  variant,
  title,
  description,
  actionLabel,
  onAction,
}: StatusDialogProps) {
  const { blob, circle, button, Icon } = config[variant];

  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialogPrimitive.Portal>
        <FullWindowOverlay>
          <AlertDialogPrimitive.Overlay
            className="absolute bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black/50 p-2">
            <NativeOnlyAnimatedView
              entering={FadeIn.duration(200).delay(50)}
              exiting={FadeOut.duration(150)}>
              <AlertDialogPrimitive.Content className="z-50 w-72 overflow-hidden rounded-2xl bg-background shadow-lg shadow-black/10">
                {/* Blob top section */}
                <View
                  className={cn('items-center px-6 pb-10 pt-8', blob)}
                  style={{ borderBottomLeftRadius: 80, borderBottomRightRadius: 80 }}>
                  <View className={cn('h-16 w-16 items-center justify-center rounded-full', circle)}>
                    <Icon size={32} color="white" strokeWidth={2.5} />
                  </View>
                </View>

                {/* Text */}
                <View className="items-center gap-1.5 px-6 py-5">
                  <AlertDialogPrimitive.Title className="text-center text-xl font-bold text-foreground">
                    {title}
                  </AlertDialogPrimitive.Title>
                  <AlertDialogPrimitive.Description className="text-center text-sm text-muted-foreground">
                    {description}
                  </AlertDialogPrimitive.Description>
                </View>

                {/* Action button */}
                <View className="px-6 pb-6">
                  <AlertDialogPrimitive.Action
                    className={cn(
                      'w-full items-center justify-center rounded-full py-3',
                      button
                    )}
                    onPress={onAction}>
                    <Text className="text-sm font-bold uppercase tracking-widest text-white">
                      {actionLabel}
                    </Text>
                  </AlertDialogPrimitive.Action>
                </View>
              </AlertDialogPrimitive.Content>
            </NativeOnlyAnimatedView>
          </AlertDialogPrimitive.Overlay>
        </FullWindowOverlay>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
}
