import { VerifyEmailForm } from '@/features/auth/components/verify-email-form';
import { useFocusEffect } from 'expo-router';
import { Stack } from 'expo-router';
import * as React from 'react';
import { BackHandler, ScrollView, View } from 'react-native';

export default function VerifyEmailScreen() {
  useFocusEffect(
    React.useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => subscription.remove();
    }, [])
  );

  return (
    <>
      <Stack.Screen options={{ gestureEnabled: false, headerBackVisible: false }} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="sm:flex-1 items-center justify-center p-4 py-8 sm:py-4 sm:p-6 mt-safe ios:mt-0"
        keyboardDismissMode="interactive">
        <View className="w-full max-w-sm">
          <VerifyEmailForm />
        </View>
      </ScrollView>
    </>
  );
}
