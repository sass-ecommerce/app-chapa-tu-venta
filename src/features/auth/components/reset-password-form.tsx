import * as React from 'react';
import { Alert, Pressable, TextInput, View } from 'react-native';

import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { router, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';

import { Text } from '@/shared/components/ui/text';
import { useResetPasswordMutation, useLoginMutation, authStorage } from '@/features/auth';

const BRAND = '#E86A1F';

function colors(dark: boolean) {
  if (dark) return {
    bg: '#0F0D0B', fg: '#F5F1EC', muted: 'rgba(245,241,236,0.55)',
    muted2: 'rgba(245,241,236,0.12)',
    card: '#18150F', border: 'rgba(245,241,236,0.09)',
    inputBg: 'rgba(245,241,236,0.04)',
    chip: 'rgba(245,241,236,0.06)', placeholder: 'rgba(245,241,236,0.35)',
  };
  return {
    bg: '#FAF7F2', fg: '#1A1815', muted: 'rgba(26,24,21,0.55)',
    muted2: 'rgba(26,24,21,0.10)',
    card: '#FFFFFF', border: 'rgba(26,24,21,0.08)',
    inputBg: '#FAF7F2',
    chip: '#FFFFFF', placeholder: 'rgba(26,24,21,0.35)',
  };
}

function getPasswordStrength(password: string): { level: 0 | 1 | 2 | 3 | 4; label: string } {
  if (!password) return { level: 0, label: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const labels = ['', 'Débil', 'Regular', 'Buena', 'Fuerte'];
  return { level: Math.min(score, 4) as 0 | 1 | 2 | 3 | 4, label: labels[Math.min(score, 4)] };
}

function BackChevron({ color }: { color: string }) {
  return <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
    <Path d="M10 2L4 7l6 5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>;
}
function LockIcon({ color }: { color: string }) {
  return <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
    <Rect x={3} y={8} width={12} height={8} rx={2} stroke={color} strokeWidth={1.5} />
    <Path d="M6 8V5a3 3 0 016 0v3" stroke={color} strokeWidth={1.5} />
  </Svg>;
}
function CheckSm() {
  return <Svg width={9} height={9} viewBox="0 0 9 9" fill="none">
    <Path d="M1.5 4.5l2 2 4-5" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>;
}

export function ResetPasswordForm() {
  const { email = '' } = useLocalSearchParams<{ email?: string }>();
  const resetPasswordMutation = useResetPasswordMutation();
  const loginMutation = useLoginMutation();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const c = colors(isDark);

  const [showPassword, setShowPassword] = React.useState(false);
  const [passwordDisplay, setPasswordDisplay] = React.useState('');
  const passwordRef = React.useRef<TextInput>(null);

  const strength = getPasswordStrength(passwordDisplay);
  const hasMin8 = passwordDisplay.length >= 8;
  const hasUpperAndNum = /[A-Z]/.test(passwordDisplay) && /[0-9]/.test(passwordDisplay);
  const hasSymbol = /[^A-Za-z0-9]/.test(passwordDisplay);

  const form = useForm({
    defaultValues: { code: '', password: '' },
    onSubmit: async ({ value }) => {
      if (!email) return { fields: { code: 'No se encontró el correo.' } };
      try {
        await resetPasswordMutation.mutateAsync({ email, code: value.code, newPassword: value.password });
        Alert.alert('¡Listo!', 'Tu contraseña fue restablecida correctamente.');
        try {
          const tokens = await loginMutation.mutateAsync({ email, password: value.password });
          await authStorage.saveTokens(tokens.accessToken, tokens.refreshToken);
          router.replace('/(tabs)');
        } catch { router.replace('/(auth)/sign-in'); }
      } catch (err) {
        if (err instanceof Error) return { fields: { code: err.message } };
        return { fields: { code: 'Error al restablecer la contraseña' } };
      }
    },
  });

  // Strength segment colors: 3/4 = strong per design
  const strengthColors = [BRAND, BRAND, BRAND, c.muted2];

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

      {/* Hero */}
      <View style={{ paddingHorizontal: 24 }}>
        <Text style={{ fontFamily: 'InstrumentSerif_400Regular', fontSize: 34, lineHeight: 36, color: c.fg, letterSpacing: -0.7 }}>
          {'Nueva\n'}
          <Text style={{ fontFamily: 'InstrumentSerif_400Regular_Italic', color: BRAND }}>contraseña</Text>
        </Text>
        <Text style={{ marginTop: 8, fontSize: 14, color: c.muted }}>
          Elige una clave segura. Te protegerá tus ventas.
        </Text>
      </View>

      {/* Card */}
      <View style={{
        margin: 16, marginTop: 24, padding: 20,
        backgroundColor: c.card, borderRadius: 24,
        borderWidth: 1, borderColor: c.border, gap: 14,
        shadowColor: isDark ? '#000' : '#141428',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: isDark ? 0.3 : 0.06,
        shadowRadius: 50, elevation: 8,
      }}>
        {/* Code field */}
        <form.Field name="code" validators={{ onChange: z.string().min(1, 'Requerido') }}>
          {(field) => (
            <View style={{ gap: 6 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: c.fg }}>Código de 6 dígitos</Text>
              <TextInput
                style={{ height: 52, borderRadius: 14, backgroundColor: c.inputBg, borderWidth: 1, borderColor: c.border, paddingHorizontal: 14, fontSize: 16, color: c.fg }}
                placeholder="Pega el código del correo"
                placeholderTextColor={c.placeholder}
                keyboardType="numeric"
                maxLength={6}
                autoComplete="sms-otp"
                textContentType="oneTimeCode"
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
              {field.state.meta.errors.length > 0 && (
                <Text style={{ fontSize: 12, color: '#E05252' }}>{String(field.state.meta.errors[0])}</Text>
              )}
            </View>
          )}
        </form.Field>

        {/* Password + strength */}
        <form.Field name="password" validators={{ onChange: z.string().min(8, 'Mínimo 8 caracteres') }}>
          {(field) => (
            <View style={{ gap: 0 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: c.fg, marginBottom: 6 }}>Nueva contraseña</Text>
              <View style={{
                height: 52, borderRadius: 14, backgroundColor: c.inputBg,
                borderWidth: passwordDisplay.length > 0 ? 2 : 1,
                borderColor: passwordDisplay.length > 0 ? BRAND : c.border,
                flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10,
              }}>
                <LockIcon color={c.muted} />
                <TextInput
                  ref={passwordRef}
                  style={{ flex: 1, fontSize: 15, color: c.fg }}
                  placeholder="••••••••"
                  placeholderTextColor={c.placeholder}
                  secureTextEntry={!showPassword}
                  value={field.state.value}
                  onChangeText={(text) => { field.handleChange(text); setPasswordDisplay(text); }}
                  onBlur={field.handleBlur}
                  returnKeyType="send"
                  onSubmitEditing={form.handleSubmit}
                />
                <Pressable onPress={() => setShowPassword((v) => !v)}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: c.muted }}>{showPassword ? 'Ocultar' : 'Ver'}</Text>
                </Pressable>
              </View>

              {/* Strength meter */}
              {passwordDisplay.length > 0 && (
                <View style={{ marginTop: 10 }}>
                  <View style={{ flexDirection: 'row', gap: 4 }}>
                    {[0, 1, 2, 3].map((i) => (
                      <View
                        key={i}
                        style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: i < strength.level ? BRAND : c.muted2 }}
                      />
                    ))}
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                    <Text style={{ fontSize: 12, color: c.muted }}>
                      Fuerza: <Text style={{ color: BRAND, fontWeight: '700' }}>{strength.label}</Text>
                    </Text>
                    <Text style={{ fontSize: 12, color: c.muted }}>{passwordDisplay.length} caracteres</Text>
                  </View>
                </View>
              )}
              {field.state.meta.errors.length > 0 && (
                <Text style={{ fontSize: 12, color: '#E05252', marginTop: 4 }}>{String(field.state.meta.errors[0])}</Text>
              )}
            </View>
          )}
        </form.Field>

        {/* Checklist */}
        <View style={{ gap: 6, marginTop: 2 }}>
          {[
            ['Al menos 8 caracteres', hasMin8],
            ['Una mayúscula y un número', hasUpperAndNum],
            ['Un símbolo (opcional)', hasSymbol],
          ].map(([label, ok], i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{
                width: 16, height: 16, borderRadius: 8,
                backgroundColor: ok ? BRAND : 'transparent',
                borderWidth: ok ? 0 : 1.5, borderColor: c.border,
                alignItems: 'center', justifyContent: 'center',
              }}>
                {ok && <CheckSm />}
              </View>
              <Text style={{ fontSize: 12, color: ok ? c.fg : c.muted }}>{String(label)}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <form.Subscribe selector={(s) => [s.isSubmitting, s.canSubmit]}>
          {([isSubmitting, canSubmit]) => (
            <Pressable
              onPress={() => form.handleSubmit()}
              disabled={!canSubmit || isSubmitting || resetPasswordMutation.isPending || loginMutation.isPending}
              style={{
                height: 54, borderRadius: 14, backgroundColor: BRAND,
                alignItems: 'center', justifyContent: 'center',
                opacity: !canSubmit || isSubmitting || resetPasswordMutation.isPending || loginMutation.isPending ? 0.6 : 1,
                shadowColor: BRAND, shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.35, shadowRadius: 22, elevation: 6,
              }}>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: -0.1 }}>
                {isSubmitting || resetPasswordMutation.isPending || loginMutation.isPending ? 'Guardando...' : 'Guardar y entrar'}
              </Text>
            </Pressable>
          )}
        </form.Subscribe>
      </View>

      <View style={{ flex: 1 }} />
    </View>
  );
}
