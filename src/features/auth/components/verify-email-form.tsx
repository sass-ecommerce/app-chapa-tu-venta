import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Text } from '@/shared/components/ui/text';
import { useAuth, useUser } from '@/shared/hooks/hooks';
import { redirectAfterAuth } from '@/features/auth/utils/navigation-helpers';
import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { type TextStyle, View } from 'react-native';

const RESEND_CODE_INTERVAL_SECONDS = 30;

const TABULAR_NUMBERS_STYLE: TextStyle = { fontVariant: ['tabular-nums'] };

export function VerifyEmailForm() {
  const { verifyEmail, resendVerification, login, getTempCredentials, clearTempCredentials } =
    useAuth();
  const { user } = useUser();
  const { sessionId = '', email = '' } = useLocalSearchParams<{
    sessionId?: string;
    email?: string;
  }>();
  const [code, setCode] = React.useState('');
  const [error, setError] = React.useState('');
  const [currentSessionId, setCurrentSessionId] = React.useState(sessionId);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { countdown, restartCountdown } = useCountdown(RESEND_CODE_INTERVAL_SECONDS);

  async function onSubmit() {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    try {
      console.log('📧 [VerifyEmail] Verifying email with code...');

      // Verify email with OTP code
      await verifyEmail(currentSessionId, code);

      console.log('✅ [VerifyEmail] Email verified successfully');

      // Get temporary credentials saved during registration
      const tempCredentials = await getTempCredentials();

      if (tempCredentials) {
        console.log('🔑 [VerifyEmail] Auto-logging in with saved credentials...');

        // Auto-login with saved credentials
        await login(tempCredentials.email, tempCredentials.password);

        // Clear temporary credentials
        await clearTempCredentials();

        console.log('✅ [VerifyEmail] Auto-login successful');

        // Redirect based on onboarding status
        setTimeout(() => {
          if (user) {
            redirectAfterAuth(user, router);
          } else {
            // Fallback if user not loaded yet
            router.replace('/(onboarding)/register-store');
          }
        }, 100);
      } else {
        console.log('⚠️ [VerifyEmail] No temp credentials found, redirecting to sign-in');
        // If no temp credentials, redirect to sign-in
        router.replace('/(auth)/sign-in');
      }
    } catch (err) {
      console.error('❌ [VerifyEmail] Verification failed:', err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al verificar el código');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onResendCode() {
    if (!currentSessionId) {
      setError('No se encontró el ID de sesión');
      return;
    }

    try {
      console.log('📧 [VerifyEmail] Resending verification code...');

      const response = await resendVerification(currentSessionId);

      // Update session ID with the new one
      setCurrentSessionId(response.sessionId);

      restartCountdown();
      setError('');

      console.log('✅ [VerifyEmail] Verification code resent, new sessionId:', response.sessionId);
    } catch (err) {
      console.error('❌ [VerifyEmail] Resend failed:', err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al reenviar el código');
      }
    }
  }

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
            <View className="gap-1.5">
              <Label htmlFor="code">Código de verificación</Label>
              <Input
                id="code"
                autoCapitalize="none"
                onChangeText={setCode}
                returnKeyType="send"
                keyboardType="numeric"
                autoComplete="sms-otp"
                textContentType="oneTimeCode"
                onSubmitEditing={onSubmit}
                maxLength={6}
              />
              {!error ? null : (
                <Text className="text-sm font-medium text-destructive">{error}</Text>
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
            <View className="gap-3">
              <Button className="w-full" onPress={onSubmit} disabled={isSubmitting}>
                <Text>{isSubmitting ? 'Verificando...' : 'Continuar'}</Text>
              </Button>
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
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startCountdown]);

  return { countdown, restartCountdown: startCountdown };
}
