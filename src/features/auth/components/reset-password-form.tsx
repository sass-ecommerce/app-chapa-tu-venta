// 1. React & React Native
import * as React from 'react';
import { type TextInput, View, Alert } from 'react-native';

// 2. Third-party libraries
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { router, useLocalSearchParams } from 'expo-router';

// 3. UI components
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Text } from '@/shared/components/ui/text';

// 4. Utils & hooks
import { useAuth, useUser } from '@/shared/hooks/hooks';
import { redirectAfterAuth } from '@/features/auth/utils/navigation-helpers';

export function ResetPasswordForm() {
  // Router/navigation hooks
  const { email = '', sessionId = '' } = useLocalSearchParams<{
    email?: string;
    sessionId?: string;
  }>();

  // Auth/user hooks
  const { resetPassword, login } = useAuth();
  const { user } = useUser();

  // Refs
  const codeInputRef = React.useRef<TextInput>(null);

  // Form
  const form = useForm({
    defaultValues: {
      password: '',
      code: '',
    },
    onSubmit: async ({ value }) => {
      if (!sessionId) {
        return {
          fields: {
            code: 'Sesión inválida. Por favor, solicita el código nuevamente.',
          },
        };
      }

      try {
        console.log('📝 [ResetPassword] Resetting password...');

        // Reset password
        await resetPassword(sessionId, value.code, value.password);

        console.log('✅ [ResetPassword] Password reset successful');
        Alert.alert('Éxito', 'Tu contraseña ha sido restablecida correctamente');

        // Auto-login with email and new password
        if (email) {
          try {
            console.log('🚪 [ResetPassword] Auto-logging in...');
            await login(email, value.password);

            // Wait a moment for user data to load
            setTimeout(async () => {
              if (user) {
                await redirectAfterAuth(user, router);
              } else {
                // Fallback to home if user data isn't loaded yet
                router.replace('/(tabs)');
              }
            }, 500);
          } catch (loginError) {
            console.error('❌ [ResetPassword] Auto-login failed:', loginError);
            // If auto-login fails, just go to sign-in
            router.replace('/(auth)/sign-in');
          }
        } else {
          // No email, redirect to sign-in
          router.replace('/(auth)/sign-in');
        }
      } catch (err) {
        console.error('❌ [ResetPassword] Error:', err);
        if (err instanceof Error) {
          // Return error to show under the code field
          return {
            fields: {
              code: err.message,
            },
          };
        }
        return {
          fields: {
            code: 'Error al restablecer la contraseña',
          },
        };
      }
    },
  });

  // Event handlers
  function onPasswordSubmitEditing() {
    codeInputRef.current?.focus();
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">Restablecer contraseña</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Ingresa el código enviado a tu correo y establece una nueva contraseña
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            {/* Password field */}
            <form.Field
              name="password"
              validators={{
                onChange: z
                  .string()
                  .min(1, 'La contraseña es requerida')
                  .min(6, 'La contraseña debe tener al menos 6 caracteres'),
              }}>
              {(field) => (
                <View className="gap-1.5">
                  <View className="flex-row items-center">
                    <Label htmlFor="password">Nueva contraseña</Label>
                  </View>
                  <Input
                    id="password"
                    secureTextEntry
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                    returnKeyType="next"
                    submitBehavior="submit"
                    onSubmitEditing={onPasswordSubmitEditing}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <Text className="text-sm font-medium text-destructive">
                      {String(field.state.meta.errors[0])}
                    </Text>
                  )}
                </View>
              )}
            </form.Field>

            {/* Code field */}
            <form.Field
              name="code"
              validators={{
                onChange: z.string().min(1, 'El código de verificación es requerido'),
              }}>
              {(field) => (
                <View className="gap-1.5">
                  <Label htmlFor="code">Código de verificación</Label>
                  <Input
                    id="code"
                    ref={codeInputRef}
                    autoCapitalize="none"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                    returnKeyType="send"
                    keyboardType="numeric"
                    autoComplete="sms-otp"
                    textContentType="oneTimeCode"
                    onSubmitEditing={() => form.handleSubmit()}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <Text className="text-sm font-medium text-destructive">
                      {String(field.state.meta.errors[0])}
                    </Text>
                  )}
                </View>
              )}
            </form.Field>

            {/* Submit button */}
            <form.Subscribe selector={(state) => [state.isSubmitting, state.canSubmit]}>
              {([isSubmitting, canSubmit]) => (
                <Button
                  className="w-full"
                  onPress={() => form.handleSubmit()}
                  disabled={!canSubmit || isSubmitting}>
                  <Text>{isSubmitting ? 'Restableciendo...' : 'Restablecer contraseña'}</Text>
                </Button>
              )}
            </form.Subscribe>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
