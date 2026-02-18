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
import { Link, router } from 'expo-router';
import * as React from 'react';
import { TextInput, View } from 'react-native';

export function SignUpForm() {
  const { register, saveTempCredentials, isLoading } = useAuth();
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const lastNameInputRef = React.useRef<TextInput>(null);
  const emailInputRef = React.useRef<TextInput>(null);
  const passwordInputRef = React.useRef<TextInput>(null);
  const [error, setError] = React.useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function onSubmit() {
    if (isLoading || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError({});

    try {
      console.log('📝 [SignUp] Starting registration...');

      // Call register API
      const response = await register({
        email,
        password,
        firstName,
        lastName,
      });

      console.log('✅ [SignUp] Registration successful, sessionId:', response.sessionId);

      // Save credentials temporarily for auto-login after email verification
      await saveTempCredentials({ email, password });

      // Navigate to verification screen with sessionId and email
      router.push({
        pathname: '/(auth)/sign-up/verify-email',
        params: {
          sessionId: response.sessionId,
          email,
        },
      });
    } catch (err) {
      console.error('❌ [SignUp] Registration failed:', err);

      if (err instanceof Error) {
        const message = err.message;
        // Determine which field has the error
        const isEmailError = message.toLowerCase().includes('email');
        const isPasswordError =
          message.toLowerCase().includes('password') ||
          message.toLowerCase().includes('contraseña');
        const isFirstNameError =
          message.toLowerCase().includes('first') || message.toLowerCase().includes('nombre');
        const isLastNameError =
          message.toLowerCase().includes('last') || message.toLowerCase().includes('apellido');

        if (isEmailError) {
          setError({ email: message });
        } else if (isPasswordError) {
          setError({ password: message });
        } else if (isFirstNameError) {
          setError({ firstName: message });
        } else if (isLastNameError) {
          setError({ lastName: message });
        } else {
          setError({ email: 'Error al registrar usuario' });
        }
      } else {
        setError({ email: 'Error al registrar usuario' });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function onFirstNameSubmitEditing() {
    lastNameInputRef.current?.focus();
  }

  function onLastNameSubmitEditing() {
    emailInputRef.current?.focus();
  }

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">Crea tu cuenta</CardTitle>
          <CardDescription className="text-center sm:text-left">
            ¡Bienvenido! Por favor completa los detalles para comenzar.
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="firstName">Nombre</Label>
              <Input
                id="firstName"
                placeholder="Tu nombre"
                autoComplete="given-name"
                autoCapitalize="words"
                onChangeText={setFirstName}
                onSubmitEditing={onFirstNameSubmitEditing}
                returnKeyType="next"
                submitBehavior="submit"
              />
              {error.firstName ? (
                <Text className="text-sm font-medium text-destructive">{error.firstName}</Text>
              ) : null}
            </View>
            <View className="gap-1.5">
              <Label htmlFor="lastName">Apellido</Label>
              <Input
                ref={lastNameInputRef}
                id="lastName"
                placeholder="Tu apellido"
                autoComplete="family-name"
                autoCapitalize="words"
                onChangeText={setLastName}
                onSubmitEditing={onLastNameSubmitEditing}
                returnKeyType="next"
                submitBehavior="submit"
              />
              {error.lastName ? (
                <Text className="text-sm font-medium text-destructive">{error.lastName}</Text>
              ) : null}
            </View>
            <View className="gap-1.5">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                ref={emailInputRef}
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
              <Text>{isSubmitting ? 'Registrando...' : 'Continuar'}</Text>
            </Button>
          </View>
          <Text className="text-center text-sm">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/(auth)/sign-in" dismissTo className="text-sm underline underline-offset-4">
              Inicia sesión
            </Link>
          </Text>
        </CardContent>
      </Card>
    </View>
  );
}
