// 1. React & React Native
import * as React from 'react';
import { type TextInput, TouchableOpacity, View } from 'react-native';

// 2. Third-party libraries
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { Link, router } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';

// 3. UI components
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Icon } from '@/shared/components/ui/icon';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Text } from '@/shared/components/ui/text';
import { StatusDialog } from '@/shared/components/status-dialog';

// 4. Utils & hooks
import { useLoginMutation, useOnboardingStatusMutation } from '@/features/auth';
import { authStorage } from '@/features/auth/utils/storage';

export function SignInForm() {
  const loginMutation = useLoginMutation();
  const onboardingStatusMutation = useOnboardingStatusMutation();

  const [errorDialog, setErrorDialog] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  // Refs for keyboard navigation
  const passwordInputRef = React.useRef<TextInput>(null);

  // Form with TanStack Form
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      try {
        await loginMutation.mutateAsync({
          email: value.email,
          password: value.password,
        });

        const onboarding = await onboardingStatusMutation.mutateAsync();

        if (!onboarding.createTenant.completed) {
          router.replace('/(onboarding)/register-store');
        } else {
          if (onboarding.createTenant.tenant?.id) {
            await authStorage.saveTenantId(onboarding.createTenant.tenant.id);
          }
          router.replace('/(tabs)');
        }
      } catch {
        setErrorDialog(true);
      }
    },
  });

  // Event handlers for keyboard navigation
  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  // Render
  return (
    <View className="gap-6">
      <StatusDialog
        open={errorDialog}
        onOpenChange={setErrorDialog}
        variant="error"
        title="Error al iniciar sesión"
        description="Credenciales incorrectas. Verifica tu correo y contraseña e inténtalo de nuevo."
        actionLabel="Intentar de nuevo"
        onAction={() => setErrorDialog(false)}
      />
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
                  <View className="flex-row items-center">
                    <Label htmlFor="password">Contraseña</Label>
                    <form.Subscribe selector={(state) => state.values.email}>
                      {(email) => (
                        <Link asChild href={`/(auth)/forgot-password?email=${email}`}>
                          <Button
                            variant="link"
                            size="sm"
                            className="ml-auto h-4 px-1 py-0 web:h-fit sm:h-4">
                            <Text className="font-normal leading-4">¿Olvidaste tu contraseña?</Text>
                          </Button>
                        </Link>
                      )}
                    </form.Subscribe>
                  </View>
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
                    <TouchableOpacity
                      onPress={() => setShowPassword((prev) => !prev)}
                      className="absolute bottom-0 right-0 top-0 items-center justify-center px-3">
                      <Icon
                        as={showPassword ? EyeOff : Eye}
                        size={18}
                        className="text-muted-foreground"
                      />
                    </TouchableOpacity>
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
                  disabled={!canSubmit || isSubmitting || loginMutation.isPending}>
                  <Text>
                    {isSubmitting || loginMutation.isPending ? 'Iniciando sesión...' : 'Continuar'}
                  </Text>
                </Button>
              )}
            </form.Subscribe>
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
