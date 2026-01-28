import { EditProfileForm } from '@/components/edit-profile-form';
import { router, Stack } from 'expo-router';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

export default function EditProfileScreen() {
  const handleSuccess = () => {
    // Volver a la pantalla de perfil
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Editar Perfil',
          headerShadowVisible: false,
          presentation: 'modal',
        }}
      />
      <ScrollView className="flex-1 bg-background">
        <View className="p-4 pt-6">
          <EditProfileForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </View>
      </ScrollView>
    </>
  );
}
