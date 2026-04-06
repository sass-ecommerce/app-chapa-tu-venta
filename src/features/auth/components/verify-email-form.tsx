// 1. React & React Native
import * as React from 'react';
import { type TextStyle, View } from 'react-native';

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
import { useAuth } from '@/shared/hooks/hooks';

const RESEND_CODE_INTERVAL_SECONDS = 30;

const TABULAR_NUMBERS_STYLE: TextStyle = { fontVariant: ['tabular-nums'] };

export function VerifyEmailForm() {
  // Router/navigation hooks
  const { email = '' } = useLocalSearchParams<{ email?: string }>();

  // Auth/user hooks — username = email in Cognito
  const { verifyEmail, resendVerification } = useAuth();

  // Custom hooks
  const { countdown, restartCountdown } = useCountdown(RESEND_CODE_INTERVAL_SECONDS);

  // Form with TanStack Form
  const form = useForm({
    defaultValues: { code: '' },
    onSubmit: async ({ value }) => {
      try {
        console.log('📧 [VerifyEmail] Verifying email with code...');

        // verifyEmail handles confirmSignUp + autoSignIn + fetching user profile
        await verifyEmail(email, value.code);

        console.log('✅ [VerifyEmail] Email verified and signed in');
        router.replace('/(tabs)');
      } catch (err) {
        console.error('❌ [VerifyEmail] Verification failed:', err);

        if (err instanceof Error) {
          return { fields: { code: err.message } };
        }
        return { fields: { code: 'Error al verificar el código' } };
      }
    },
  });

  // Event handlers
  async function onResendCode() {
    if (!email) {
      form.setFieldMeta('code', (prev) => ({
        ...prev,
        errors: ['No se encontró el correo'],
      }));
      return;
    }

    try {
      console.log('📧 [VerifyEmail] Resending verification code...');
      await resendVerification(email);

      form.setFieldValue('code', '');
      form.setFieldMeta('code', (prev) => ({ ...prev, errors: [] }));
      restartCountdown();

      console.log('✅ [VerifyEmail] Verification code resent');
    } catch (err) {
      console.error('❌ [VerifyEmail] Resend failed:', err);

      form.setFieldMeta('code', (prev) => ({
        ...prev,
        errors: [err instanceof Error ? err.message : 'Error al reenviar el código'],
      }));
    }
  }

  // Render
  return (
    <View className="gap-6">
      <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">Verifica tu correo</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Ingresa el código de verificación enviado a {email || 'tu correo'}
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            {/* Code Field */}
            <form.Field
              name="code"
              validators={{
                onChange: z.string().min(1, 'El código es requerido'),
              }}>
              {(field) => (
                <View className="gap-1.5">
                  <Label htmlFor="code">Código de verificación</Label>
                  <Input
                    id="code"
                    autoCapitalize="none"
                    keyboardType="numeric"
                    autoComplete="sms-otp"
                    textContentType="oneTimeCode"
                    maxLength={6}
                    returnKeyType="send"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                    onSubmitEditing={form.handleSubmit}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <Text className="text-sm font-medium text-destructive">
                      {String(field.state.meta.errors[0])}
                    </Text>
                  )}
                  <Button variant="link" size="sm" disabled={countdown > 0} onPress={onResendCode}>
                    <Text className="text-center text-xs">
                      ¿No recibiste el código? Reenviar{' '}
                      {countdown > 0 ? (
                        <Text className="text-xs" style={TABULAR_NUMBERS_STYLE}>
                          ({countdown})
                        </Text>
                      ) : null}
                    </Text>
                  </Button>
                </View>
              )}
            </form.Field>

            {/* Submit and Cancel Buttons */}
            <View className="gap-3">
              <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <Button
                    className="w-full"
                    onPress={form.handleSubmit}
                    disabled={!canSubmit || isSubmitting}>
                    <Text>{isSubmitting ? 'Verificando...' : 'Continuar'}</Text>
                  </Button>
                )}
              </form.Subscribe>
              <Button variant="link" className="mx-auto" onPress={router.back}>
                <Text>Cancelar</Text>
              </Button>
            </View>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}

function useCountdown(seconds = 30) {
  const [countdown, setCountdown] = React.useState(seconds);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = React.useCallback(() => {
    setCountdown(seconds);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [seconds]);

  React.useEffect(() => {
    startCountdown();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startCountdown]);

  return { countdown, restartCountdown: startCountdown };
}
