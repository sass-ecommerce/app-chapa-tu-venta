// 1. React & React Native
import * as React from 'react';
import { View } from 'react-native';

// 2. Third-party libraries
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { router, useLocalSearchParams } from 'expo-router';

// 3. UI components
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Text } from '@/shared/components/ui/text';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';

// 4. Utils & hooks
import { useAuth } from '@/shared/hooks/hooks';

export function ForgotPasswordForm() {
  // Router/navigation hooks
  const { email: emailParam = '' } = useLocalSearchParams<{ email?: string }>();

  // Auth hooks
  const { forgotPassword } = useAuth();

  // Form with TanStack Form
  const form = useForm({
    defaultValues: {
      email: emailParam,
    },
    onSubmit: async ({ value }) => {
      try {
        console.log('🔑 [ForgotPassword] Requesting password reset code...');

        await forgotPassword(value.email);

        console.log('✅ [ForgotPassword] Reset code sent successfully');

        router.push(`/(auth)/reset-password?email=${value.email}`);
      } catch (err) {
        console.error('❌ [ForgotPassword] Error:', err);

        // Return field error to be displayed under email field
        if (err instanceof Error) {
          return {
            fields: {
              email: err.message,
            },
          };
        } else {
          return {
            fields: {
              email: 'Error al enviar el código de recuperación',
            },
          };
        }
      }
    },
  });

  // Render
  return (
    <View className="gap-6">
      <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">
            ¿Olvidaste tu contraseña?
          </CardTitle>
          <CardDescription className="text-center sm:text-left">
            Ingresa tu correo electrónico para restablecer tu contraseña
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            {/* Email Field */}
            <form.Field
              name="email"
              validators={{
                onChange: z
                  .string()
                  .min(1, 'El correo es requerido')
                  .email('Ingresa un correo válido'),
              }}>
              {(field) => (
                <View className="gap-1.5">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    placeholder="correo@ejemplo.com"
                    keyboardType="email-address"
                    autoComplete="email"
                    autoCapitalize="none"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                    onSubmitEditing={form.handleSubmit}
                    returnKeyType="send"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <Text className="text-sm font-medium text-destructive">
                      {String(field.state.meta.errors[0])}
                    </Text>
                  )}
                </View>
              )}
            </form.Field>

            {/* Submit Button */}
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <Button
                  className="w-full"
                  onPress={form.handleSubmit}
                  disabled={!canSubmit || isSubmitting}>
                  <Text>{isSubmitting ? 'Enviando...' : 'Restablecer contraseña'}</Text>
                </Button>
              )}
            </form.Subscribe>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
