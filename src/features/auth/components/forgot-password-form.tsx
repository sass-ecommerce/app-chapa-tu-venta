import * as React from 'react';
import { View } from 'react-native';

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

import { useAuth } from '@/shared/hooks/hooks';

export function ForgotPasswordForm() {
  const { email: emailParam = '' } = useLocalSearchParams<{ email?: string }>();
  const [email, setEmail] = React.useState(emailParam);
  const { forgotPassword } = useAuth();
  const [error, setError] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = async () => {
    if (!email) {
      setError('El correo electrónico es requerido');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await forgotPassword(email);

      // Navigate to reset password form with email and sessionId
      router.push(`/(auth)/reset-password?email=${email}&sessionId=${result.sessionId}`);
    } catch (err) {
      console.error('❌ [ForgotPassword] Error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al enviar el código de recuperación');
      }
    } finally {
      setIsLoading(false);
    }
  };

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
            <View className="gap-1.5">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                defaultValue={email}
                placeholder="correo@ejemplo.com"
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                onChangeText={setEmail}
                onSubmitEditing={onSubmit}
                returnKeyType="send"
              />
              {error ? <Text className="text-sm font-medium text-destructive">{error}</Text> : null}
            </View>
            <Button className="w-full" onPress={onSubmit} disabled={isLoading}>
              <Text>{isLoading ? 'Enviando...' : 'Restablecer contraseña'}</Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
