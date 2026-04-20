// 1. React & React Native
import * as React from 'react';
import { type TextInput, View, Pressable } from 'react-native';

// 2. Third-party libraries
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { Link, router } from 'expo-router';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import { Icon } from '@/shared/components/ui/icon';

// 3. UI components
import { StatusDialog } from '@/src/shared/components/status-dialog';
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
import { useRegisterMutation } from '@/features/auth/queries';
import { logError } from '@/shared/utils/utils';

export function SignUpForm() {
  const registerMutation = useRegisterMutation();
  const [step, setStep] = React.useState<1 | 2>(1);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = React.useState(false);

  // Refs for keyboard navigation
  const lastNameInputRef = React.useRef<TextInput>(null);
  const emailInputRef = React.useRef<TextInput>(null);
  const passwordInputRef = React.useRef<TextInput>(null);
  const confirmPasswordInputRef = React.useRef<TextInput>(null);

  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async ({ value }) => {
      try {
        await registerMutation.mutateAsync({
          email: value.email,
          password: value.password,
          firstName: value.firstName,
          lastName: value.lastName,
        });

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

  async function handleContinue() {
    await form.validateField('firstName', 'change');
    await form.validateField('lastName', 'change');
    await form.validateField('email', 'change');

    const { fieldMeta, values } = form.state;
    const hasErrors =
      (fieldMeta.firstName?.errors?.length ?? 0) > 0 ||
      (fieldMeta.lastName?.errors?.length ?? 0) > 0 ||
      (fieldMeta.email?.errors?.length ?? 0) > 0;
    const hasEmpty = !values.firstName || !values.lastName || !values.email;

    if (!hasErrors && !hasEmpty) {
      setStep(2);
    }
  }

  // Render
  return (
    <View className="gap-6">
      <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          {step === 2 && (
            <Pressable
              onPress={() => setStep(1)}
              className="mb-1 flex-row items-center gap-1 self-start">
              <Icon as={ArrowLeft} size={16} className="text-muted-foreground" />
              <Text className="text-sm text-muted-foreground">Volver</Text>
            </Pressable>
          )}
          <CardTitle className="text-center text-xl sm:text-left">Crea tu cuenta</CardTitle>
          <CardDescription className="text-center sm:text-left">
            {step === 1
              ? '¡Bienvenido! Por favor completa tus datos personales.'
              : 'Ahora elige una contraseña segura para tu cuenta.'}
          </CardDescription>

          {/* Step indicator */}
          <View className="mt-3 flex-row items-center gap-2">
            <View className="h-1.5 flex-1 rounded-full bg-primary" />
            <View
              className={`h-1.5 flex-1 rounded-full ${step === 2 ? 'bg-primary' : 'bg-muted'}`}
            />
          </View>
          <Text className="mt-1 text-xs text-muted-foreground">Paso {step} de 2</Text>
        </CardHeader>

        <CardContent className="gap-6">
          <View className="gap-6">
            {step === 1 ? (
              <>
                {/* First Name */}
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
                        onSubmitEditing={() => lastNameInputRef.current?.focus()}
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

                {/* Last Name */}
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
                        onSubmitEditing={() => emailInputRef.current?.focus()}
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

                {/* Email */}
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
                        onSubmitEditing={handleContinue}
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

                <Button className="w-full" onPress={handleContinue}>
                  <Text>Continuar</Text>
                </Button>
              </>
            ) : (
              <>
                {/* Password */}
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
                          onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
                          returnKeyType="next"
                          submitBehavior="submit"
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

                {/* Confirm Password */}
                <form.Field
                  name="confirmPassword"
                  validators={{
                    onChangeListenTo: ['password'],
                    onChange: ({ value, fieldApi }) => {
                      if (!value) return 'Debes confirmar tu contraseña';
                      if (value !== fieldApi.form.getFieldValue('password')) {
                        return 'Las contraseñas no coinciden';
                      }
                      return undefined;
                    },
                  }}>
                  {(field) => (
                    <View className="gap-1.5">
                      <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                      <View className="relative">
                        <Input
                          ref={confirmPasswordInputRef}
                          id="confirmPassword"
                          secureTextEntry={!showConfirmPassword}
                          value={field.state.value}
                          onChangeText={field.handleChange}
                          onBlur={field.handleBlur}
                          returnKeyType="send"
                          onSubmitEditing={form.handleSubmit}
                          className="pr-10"
                        />
                        <Pressable
                          onPress={() => setShowConfirmPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Icon
                            as={showConfirmPassword ? EyeOff : Eye}
                            size={20}
                            className="text-muted-foreground"
                          />
                        </Pressable>
                      </View>
                      {field.state.meta.errors.length > 0 && (
                        <Text className="text-sm font-medium text-destructive">
                          {String(field.state.meta.errors[0])}
                        </Text>
                      )}
                    </View>
                  )}
                </form.Field>

                {/* Submit */}
                <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                  {([canSubmit, isSubmitting]) => (
                    <Button
                      className="w-full"
                      onPress={form.handleSubmit}
                      disabled={!canSubmit || isSubmitting}>
                      <Text>{isSubmitting ? 'Registrando...' : 'Crear cuenta'}</Text>
                    </Button>
                  )}
                </form.Subscribe>
              </>
            )}
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
