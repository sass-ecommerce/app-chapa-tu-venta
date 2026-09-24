import * as React from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';

import { useForm } from '@tanstack/react-form';
import { isAxiosError } from 'axios';
import { z } from 'zod';

import { useCurrentUserQuery, useUpdateProfileMutation } from '@/features/auth';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Text } from '@/shared/components/ui/text';

interface EditProfileFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EditProfileForm(props: EditProfileFormProps) {
  const { data: user, isLoading } = useCurrentUserQuery();

  if (isLoading) {
    return <ActivityIndicator className="py-10" />;
  }

  // Se monta cuando ya tenemos el usuario para que los valores iniciales sean reales.
  return (
    <EditProfileFormContent
      {...props}
      firstName={user?.firstName ?? ''}
      lastName={user?.lastName ?? ''}
    />
  );
}

function EditProfileFormContent({
  onSuccess,
  onCancel,
  firstName,
  lastName,
}: EditProfileFormProps & { firstName: string; lastName: string }) {
  const updateProfileMutation = useUpdateProfileMutation();

  const form = useForm({
    defaultValues: { firstName, lastName },
    onSubmit: async ({ value }) => {
      try {
        await updateProfileMutation.mutateAsync({
          firstName: value.firstName.trim(),
          lastName: value.lastName.trim(),
        });

        Alert.alert('Perfil Actualizado', 'Tu información se ha actualizado correctamente', [
          { text: 'OK', onPress: onSuccess },
        ]);
      } catch (error) {
        console.error('❌ [Edit Profile] Error updating user:', error);

        const errorMessage =
          isAxiosError(error) && error.response?.status === 400
            ? 'Revisa los datos ingresados e intenta nuevamente.'
            : 'No se pudo actualizar tu perfil. Intenta nuevamente.';

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
