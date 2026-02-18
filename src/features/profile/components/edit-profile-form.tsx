import * as React from 'react';
import { Alert, View } from 'react-native';

import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Text } from '@/shared/components/ui/text';

import { useUser } from '@/shared/hooks/hooks';

interface EditProfileFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EditProfileForm({ onSuccess, onCancel }: EditProfileFormProps) {
  const { user, updateUser } = useUser();

  const form = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
    },
    onSubmit: async ({ value }) => {
      if (!user) return;

      console.log('📝 [Edit Profile] Updating user data:', {
        firstName: value.firstName,
        lastName: value.lastName,
      });

      try {
        // Update user profile
        await updateUser({
          firstName: value.firstName,
          lastName: value.lastName,
        });

        console.log('✅ [Edit Profile] User data updated successfully');

        Alert.alert('Perfil Actualizado', 'Tu información se ha actualizado correctamente', [
          {
            text: 'OK',
            onPress: () => {
              if (onSuccess) onSuccess();
            },
          },
        ]);
      } catch (error: any) {
        console.error('❌ [Edit Profile] Error updating user:', error);

        // Manejar errores específicos
        let errorMessage = 'No se pudo actualizar tu perfil. Intenta nuevamente.';

        if (error.errors && error.errors.length > 0) {
          const clerkError = error.errors[0];

          // Errores comunes de Clerk
          if (clerkError.code === 'form_identifier_exists') {
            errorMessage = 'Este nombre de usuario ya está en uso';
          } else if (clerkError.message) {
            errorMessage = clerkError.message;
          }
        }

        Alert.alert('Error', errorMessage);
      }
    },
  });

  return (
    <Card>
      <CardContent className="gap-6">
        <form.Field
          name="firstName"
          validators={{
            onChange: z
              .string()
              .min(1, 'El nombre es requerido')
              .min(2, 'Debe tener al menos 2 caracteres')
              .max(50, 'No puede exceder 50 caracteres'),
          }}>
          {(field) => (
            <View className="gap-1.5">
              <Label htmlFor="firstName">Nombre</Label>
              <Input
                id="firstName"
                placeholder="Tu nombre"
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                autoCapitalize="words"
              />
              {field.state.meta.errors.length > 0 && (
                <Text className="text-sm font-medium text-destructive">
                  {String(field.state.meta.errors[0]?.message)}
                </Text>
              )}
            </View>
          )}
        </form.Field>

        <form.Field
          name="lastName"
          validators={{
            onChange: z
              .string()
              .min(1, 'El apellido es requerido')
              .min(2, 'Debe tener al menos 2 caracteres')
              .max(50, 'No puede exceder 50 caracteres'),
          }}>
          {(field) => (
            <View className="gap-1.5">
              <Label htmlFor="lastName">Apellido</Label>
              <Input
                id="lastName"
                placeholder="Tu apellido"
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                autoCapitalize="words"
              />
              {field.state.meta.errors.length > 0 && (
                <Text className="text-sm font-medium text-destructive">
                  {String(field.state.meta.errors[0]?.message)}
                </Text>
              )}
            </View>
          )}
        </form.Field>

        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <View className="flex-row gap-3 pt-2">
              {onCancel && (
                <Button
                  variant="outline"
                  className="flex-1"
                  onPress={onCancel}
                  disabled={isSubmitting}>
                  <Text>Cancelar</Text>
                </Button>
              )}
              <Button className="flex-1" onPress={form.handleSubmit} disabled={!canSubmit}>
                <Text>{isSubmitting ? 'Guardando...' : 'Guardar Cambios'}</Text>
              </Button>
            </View>
          )}
        </form.Subscribe>
      </CardContent>
    </Card>
  );
}
