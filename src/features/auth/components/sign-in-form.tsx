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
import { Link, router } from 'expo-router';
import * as React from 'react';
import { type TextInput, View } from 'react-native';

export function SignInForm() {
  const { login, isLoading } = useAuth();
  const { user } = useUser();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const passwordInputRef = React.useRef<TextInput>(null);
  const [error, setError] = React.useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function onSubmit() {
    if (isLoading || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError({});

    try {
      // Login with custom auth API
      await login(email, password);

      console.log('✅ [SignIn] Login successful');

      // Redirect based on onboarding status
      // Wait a bit for user to be loaded in context
      setTimeout(() => {
        if (user) {
          redirectAfterAuth(user, router);
        } else {
          // Fallback if user not loaded yet
          router.replace('/(tabs)');
        }
      }, 100);
    } catch (err) {
      console.error('❌ [SignIn] Login failed:', err);

      if (err instanceof Error) {
        const message = err.message;
        // Determine if error is email or password related
        const isEmailError =
          message.toLowerCase().includes('email') ||
          message.toLowerCase().includes('usuario no encontrado') ||
          message.toLowerCase().includes('user not found');

        setError(
          isEmailError
            ? { email: message }
            : { password: message.includes('contraseña') ? message : 'Credenciales inválidas' }
        );
      } else {
        setError({ password: 'Error al iniciar sesión' });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">
            Inicia sesión en Chapa Tu Venta
          </CardTitle>
          <CardDescription className="text-center sm:text-left">
            ¡Bienvenido de nuevo! Inicia sesión para continuar
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                placeholder="correo@ejemplo.com"
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                onChangeText={setEmail}
                onSubmitEditing={onEmailSubmitEditing}
                returnKeyType="next"
                submitBehavior="submit"
              />
              {error.email ? (
                <Text className="text-sm font-medium text-destructive">{error.email}</Text>
              ) : null}
            </View>
            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="password">Contraseña</Label>
                <Link asChild href={`/(auth)/forgot-password?email=${email}`}>
                  <Button
                    variant="link"
                    size="sm"
                    className="ml-auto h-4 px-1 py-0 web:h-fit sm:h-4">
                    <Text className="font-normal leading-4">¿Olvidaste tu contraseña?</Text>
                  </Button>
                </Link>
              </View>
              <Input
                ref={passwordInputRef}
                id="password"
                secureTextEntry
                onChangeText={setPassword}
                returnKeyType="send"
                onSubmitEditing={onSubmit}
              />
              {error.password ? (
                <Text className="text-sm font-medium text-destructive">{error.password}</Text>
              ) : null}
            </View>
            <Button className="w-full" onPress={onSubmit} disabled={isSubmitting}>
              <Text>{isSubmitting ? 'Iniciando sesión...' : 'Continuar'}</Text>
            </Button>
          </View>
          <Text className="text-center text-sm">
            ¿No tienes una cuenta?{' '}
            <Link href="/(auth)/sign-up" className="text-sm underline underline-offset-4">
              Regístrate
            </Link>
          </Text>
        </CardContent>
      </Card>
    </View>
  );
}
