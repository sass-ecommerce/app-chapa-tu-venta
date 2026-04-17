// 1. React & React Native
import * as React from 'react';
import { type TextInput, View } from 'react-native';

// 2. Third-party libraries
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { Link, router } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import { Icon } from '@/shared/components/ui/icon';

// 3. UI components
import { StatusDialog } from '@/src/shared/components/status-dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Text } from '@/shared/components/ui/text';
import { Pressable } from 'react-native';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';

// 4. Utils & hooks
import { useRegisterMutation } from '@/features/auth/queries';
import { logError } from '@/shared/utils/utils';

export function SignUpForm() {
  const registerMutation = useRegisterMutation();
  const [showPassword, setShowPassword] = React.useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = React.useState(false);

  // Refs for keyboard navigation
  const lastNameInputRef = React.useRef<TextInput>(null);
  const emailInputRef = React.useRef<TextInput>(null);
  const passwordInputRef = React.useRef<TextInput>(null);

  // Form with TanStack Form
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      try {
        console.log('📝 [SignUp] Starting registration...');

        await registerMutation.mutateAsync({
          email: value.email,
          password: value.password,
          firstName: value.firstName,
          lastName: value.lastName,
        });

        console.log('✅ [SignUp] Registration successful');

        // Navigate to verification screen with email (no sessionId needed with Cognito)
        router.push({
          pathname: '/(auth)/sign-up/verify-email',
          params: { email: value.email },
        });
      } catch (err) {
        logError('[SignUp] Registration failed:', err);
        setErrorDialogOpen(true);
      }
    },
  });

  // Event handlers for keyboard navigation
  function onFirstNameSubmitEditing() {
    lastNameInputRef.current?.focus();
  }

  function onLastNameSubmitEditing() {
    emailInputRef.current?.focus();
  }

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  // Render
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
            {/* First Name Field */}
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
                    autoComplete="given-name"
                    autoCapitalize="words"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                    onSubmitEditing={onFirstNameSubmitEditing}
                    returnKeyType="next"
                    submitBehavior="submit"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <Text className="text-sm font-medium text-destructive">
                      {String(field.state.meta.errors[0]?.message)}
                    </Text>
                  )}
                </View>
              )}
            </form.Field>

            {/* Last Name Field */}
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
                    ref={lastNameInputRef}
                    id="lastName"
                    placeholder="Tu apellido"
                    autoComplete="family-name"
                    autoCapitalize="words"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                    onSubmitEditing={onLastNameSubmitEditing}
                    returnKeyType="next"
                    submitBehavior="submit"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <Text className="text-sm font-medium text-destructive">
                      {String(field.state.meta.errors[0]?.message)}
                    </Text>
                  )}
                </View>
              )}
            </form.Field>

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
                    ref={emailInputRef}
                    id="email"
                    placeholder="correo@ejemplo.com"
                    keyboardType="email-address"
                    autoComplete="email"
                    autoCapitalize="none"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                    onSubmitEditing={onEmailSubmitEditing}
                    returnKeyType="next"
                    submitBehavior="submit"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <Text className="text-sm font-medium text-destructive">
                      {String(field.state.meta.errors[0]?.message)}
                    </Text>
                  )}
                </View>
              )}
            </form.Field>

            {/* Password Field */}
            <form.Field
              name="password"
              validators={{
                onChange: z
                  .string()
                  .min(1, 'La contraseña es requerida')
                  .min(6, 'Debe tener al menos 6 caracteres'),
              }}>
              {(field) => (
                <View className="gap-1.5">
                  <Label htmlFor="password">Contraseña</Label>
                  <View className="relative">
                    <Input
                      ref={passwordInputRef}
                      id="password"
                      secureTextEntry={!showPassword}
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      onBlur={field.handleBlur}
                      returnKeyType="send"
                      onSubmitEditing={form.handleSubmit}
                      className="pr-10"
                    />
                    <Pressable
                      onPress={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Icon
                        as={showPassword ? EyeOff : Eye}
                        size={20}
                        className="text-muted-foreground"
                      />
                    </Pressable>
                  </View>
                  {field.state.meta.errors.length > 0 && (
                    <Text className="text-sm font-medium text-destructive">
                      {String(field.state.meta.errors[0]?.message)}
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
                  <Text>{isSubmitting ? 'Registrando...' : 'Continuar'}</Text>
                </Button>
              )}
            </form.Subscribe>
          </View>

          <Text className="text-center text-sm">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/(auth)/sign-in" dismissTo className="text-sm underline underline-offset-4">
              Inicia sesión
            </Link>
          </Text>
        </CardContent>
      </Card>
      <StatusDialog
        open={errorDialogOpen}
        onOpenChange={setErrorDialogOpen}
        variant="error"
        title="No pudimos crear tu cuenta"
        description="Ocurrió un problema al registrar tu cuenta. Puedes intentarlo nuevamente o continuar más tarde."
        actionLabel="Reintentar ahora"
        onAction={() => setErrorDialogOpen(false)}
      />
    </View>
  );
}
