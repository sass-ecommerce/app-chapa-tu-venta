import * as React from 'react';
import { TextInput, View, Alert } from 'react-native';

import { router, useLocalSearchParams } from 'expo-router';

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

import { useAuth, useUser } from '@/shared/hooks/hooks';
import { redirectAfterAuth } from '@/features/auth/utils/navigation-helpers';

export function ResetPasswordForm() {
  const { email = '', sessionId = '' } = useLocalSearchParams<{
    email?: string;
    sessionId?: string;
  }>();
  const { resetPassword, login } = useAuth();
  const { user } = useUser();
  const [password, setPassword] = React.useState('');
  const [code, setCode] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const codeInputRef = React.useRef<TextInput>(null);

  async function onSubmit() {
    if (!password) {
      setError('La contraseña es requerida');
      return;
    }
    if (!code) {
      setError('El código de verificación es requerido');
      return;
    }
    if (!sessionId) {
      setError('Sesión inválida. Por favor, solicita el código nuevamente.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Reset password
      await resetPassword(sessionId, code, password);

      Alert.alert('Éxito', 'Tu contraseña ha sido restablecida correctamente');

      // Auto-login with email and new password
      if (email) {
        try {
          await login(email, password);

          // Wait a moment for user data to load
          setTimeout(() => {
            if (user) {
              redirectAfterAuth(user, router);
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
        setError(err.message);
      } else {
        setError('Error al restablecer la contraseña');
      }
    } finally {
      setIsLoading(false);
    }
  }

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
            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="password">Nueva contraseña</Label>
              </View>
              <Input
                id="password"
                secureTextEntry
                onChangeText={setPassword}
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={onPasswordSubmitEditing}
              />
            </View>
            <View className="gap-1.5">
              <Label htmlFor="code">Código de verificación</Label>
              <Input
                id="code"
                ref={codeInputRef}
                autoCapitalize="none"
                onChangeText={setCode}
                returnKeyType="send"
                keyboardType="numeric"
                autoComplete="sms-otp"
                textContentType="oneTimeCode"
                onSubmitEditing={onSubmit}
              />
            </View>
            {error ? <Text className="text-sm font-medium text-destructive">{error}</Text> : null}
            <Button className="w-full" onPress={onSubmit} disabled={isLoading}>
              <Text>{isLoading ? 'Restableciendo...' : 'Restablecer contraseña'}</Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
