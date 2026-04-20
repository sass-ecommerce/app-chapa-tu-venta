import * as React from 'react';
import { type TextStyle, Pressable, TextInput, View } from 'react-native';

import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { router, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';

import { Text } from '@/shared/components/ui/text';
import { StatusDialog } from '@/src/shared/components/status-dialog';
import { useConfirmRegistrationMutation, useResendCodeMutation } from '@/features/auth/queries';
import { logError } from '@/shared/utils/utils';

const BRAND = '#E86A1F';
const TABULAR: TextStyle = { fontVariant: ['tabular-nums'] };

function colors(dark: boolean) {
  if (dark) return {
    bg: '#0F0D0B', fg: '#F5F1EC', muted: 'rgba(245,241,236,0.55)',
    card: '#18150F', border: 'rgba(245,241,236,0.09)',
    inputBg: 'rgba(245,241,236,0.04)',
    chip: 'rgba(245,241,236,0.06)',
    iconBg: 'rgba(255,132,48,0.12)', iconBorder: 'rgba(255,132,48,0.25)',
  };
  return {
    bg: '#FAF7F2', fg: '#1A1815', muted: 'rgba(26,24,21,0.55)',
    card: '#FFFFFF', border: 'rgba(26,24,21,0.08)',
    inputBg: '#FAF7F2',
    chip: '#FFFFFF',
    iconBg: '#FFF1E6', iconBorder: '#FFDCBC',
  };
}

function BackChevron({ color }: { color: string }) {
  return <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
    <Path d="M10 2L4 7l6 5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>;
}

export function VerifyEmailForm() {
  const { email = '' } = useLocalSearchParams<{ email?: string }>();
  const confirmMutation = useConfirmRegistrationMutation();
  const resendMutation = useResendCodeMutation();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const c = colors(isDark);

  const [otp, setOtp] = React.useState(['', '', '', '', '', '']);
  const [errorDialogOpen, setErrorDialogOpen] = React.useState(false);
  const [resendErrorDialogOpen, setResendErrorDialogOpen] = React.useState(false);
  const { countdown, restartCountdown } = useCountdown(30);

  const ref0 = React.useRef<TextInput>(null);
  const ref1 = React.useRef<TextInput>(null);
  const ref2 = React.useRef<TextInput>(null);
  const ref3 = React.useRef<TextInput>(null);
  const ref4 = React.useRef<TextInput>(null);
  const ref5 = React.useRef<TextInput>(null);
  const refs = [ref0, ref1, ref2, ref3, ref4, ref5];

  const form = useForm({
    defaultValues: { code: '' },
    onSubmit: async ({ value }) => {
      try {
        await confirmMutation.mutateAsync({ email, code: value.code });
        router.replace('/(auth)/sign-in');
      } catch (err) {
        logError('[VerifyEmail]', err);
        setErrorDialogOpen(true);
      }
    },
  });

  function handleOtpChange(text: string, index: number) {
    const char = text.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);
    form.setFieldValue('code', newOtp.join(''));
    if (char && index < 5) refs[index + 1].current?.focus();
  }

  function handleKeyPress(key: string, index: number) {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      form.setFieldValue('code', newOtp.join(''));
      refs[index - 1].current?.focus();
    }
  }

  async function onResendCode() {
    if (!email) { setResendErrorDialogOpen(true); return; }
    try {
      await resendMutation.mutateAsync(email);
      restartCountdown();
    } catch (err) {
      logError('[VerifyEmail] Resend failed:', err);
      setResendErrorDialogOpen(true);
    }
  }

  const codeComplete = otp.join('').length === 6;

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{ height: insets.top + 8 }} />

      {/* Back */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 12 }}>
        <Pressable
          onPress={() => router.back()}
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: c.chip, borderWidth: 1, borderColor: c.border, alignItems: 'center', justifyContent: 'center' }}>
          <BackChevron color={c.fg} />
        </Pressable>
      </View>

      {/* Icon + heading */}
      <View style={{ paddingHorizontal: 24, alignItems: 'center' }}>
        <View style={{ position: 'relative', marginBottom: 18 }}>
          <View style={{
            width: 72, height: 72, borderRadius: 20,
            backgroundColor: c.iconBg, borderWidth: 1, borderColor: c.iconBorder,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Svg width={34} height={34} viewBox="0 0 34 34" fill="none">
              <Rect x={6} y={9} width={22} height={16} rx={3} stroke={BRAND} strokeWidth={2} />
              <Path d="M6 11l11 8 11-8" stroke={BRAND} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
          {/* notification ping */}
          <View style={{
            position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: 8,
            backgroundColor: BRAND, borderWidth: 2, borderColor: c.bg,
          }} />
        </View>

        <Text style={{ fontFamily: 'InstrumentSerif_400Regular', fontSize: 32, lineHeight: 36, color: c.fg, letterSpacing: -0.6, textAlign: 'center' }}>
          {'Revisa tu\n'}
          <Text style={{ fontFamily: 'InstrumentSerif_400Regular_Italic', color: BRAND }}>bandeja</Text>
        </Text>

        <Text style={{ marginTop: 10, fontSize: 14, color: c.muted, textAlign: 'center', lineHeight: 21 }}>
          {'Enviamos un código de 6 dígitos a\n'}
          <Text style={{ color: c.fg, fontWeight: '600' }}>{email}</Text>
        </Text>
      </View>

      {/* Card */}
      <View style={{
        margin: 16, marginTop: 24, padding: 20,
        backgroundColor: c.card, borderRadius: 24,
        borderWidth: 1, borderColor: c.border, gap: 16,
        shadowColor: isDark ? '#000' : '#141428',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: isDark ? 0.3 : 0.06,
        shadowRadius: 50, elevation: 8,
      }}>
        {/* OTP boxes — use Instrument Serif for numbers */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {otp.map((digit, i) => (
            <TextInput
              key={i}
              ref={refs[i]}
              style={{
                flex: 1, height: 56, borderRadius: 14,
                backgroundColor: c.inputBg,
                borderWidth: digit ? 2 : 1.5,
                borderColor: i === otp.findIndex((d, idx) => !d && idx >= (otp.filter(Boolean).length)) || (!digit && i === otp.filter(Boolean).length) ? BRAND : (digit ? BRAND : c.border),
                textAlign: 'center',
                fontFamily: 'InstrumentSerif_400Regular',
                fontSize: 26, fontWeight: '500',
                color: c.fg,
              }}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, i)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
              textContentType="oneTimeCode"
              autoComplete={i === 0 ? 'sms-otp' : undefined}
              selectTextOnFocus
            />
          ))}
        </View>

        {/* Submit */}
        <form.Subscribe selector={(s) => s.isSubmitting}>
          {(isSubmitting) => (
            <Pressable
              onPress={form.handleSubmit}
              disabled={!codeComplete || isSubmitting || confirmMutation.isPending}
              style={{
                height: 54, borderRadius: 14, backgroundColor: BRAND,
                alignItems: 'center', justifyContent: 'center',
                opacity: !codeComplete || isSubmitting || confirmMutation.isPending ? 0.6 : 1,
                shadowColor: BRAND, shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.35, shadowRadius: 22, elevation: 6,
              }}>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: -0.1 }}>
                {isSubmitting || confirmMutation.isPending ? 'Verificando...' : 'Verificar y continuar'}
              </Text>
            </Pressable>
          )}
        </form.Subscribe>

        {/* Resend */}
        <Pressable onPress={countdown === 0 ? onResendCode : undefined} disabled={countdown > 0 || resendMutation.isPending}>
          <Text style={{ textAlign: 'center', fontSize: 13, color: c.muted }}>
            ¿No llegó? Reenviar en{' '}
            <Text style={{ color: c.fg, fontWeight: '700', ...TABULAR }}>
              {String(Math.floor(countdown / 60)).padStart(2, '0')}:{String(countdown % 60).padStart(2, '0')}
            </Text>
          </Text>
        </Pressable>
      </View>

      <View style={{ flex: 1 }} />

      <StatusDialog
        open={errorDialogOpen}
        onOpenChange={setErrorDialogOpen}
        variant="error"
        title="Código inválido"
        description="El código ingresado es inválido o ha expirado. Solicita uno nuevo."
        actionLabel="Reintentar"
        onAction={() => setErrorDialogOpen(false)}
      />
      <StatusDialog
        open={resendErrorDialogOpen}
        onOpenChange={setResendErrorDialogOpen}
        variant="error"
        title="Error al reenviar"
        description="No pudimos reenviar el código. Por favor, intenta de nuevo."
        actionLabel="Reintentar"
        onAction={() => { setOtp(['', '', '', '', '', '']); form.setFieldValue('code', ''); setResendErrorDialogOpen(false); }}
      />
    </View>
  );
}

function useCountdown(seconds = 30) {
  const [countdown, setCountdown] = React.useState(seconds);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = React.useCallback(() => {
    setCountdown(seconds);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; } return 0; }
        return prev - 1;
      });
    }, 1000);
  }, [seconds]);

  React.useEffect(() => {
    startCountdown();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [startCountdown]);

  return { countdown, restartCountdown: startCountdown };
}
