import * as React from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { router, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

import { Text } from '@/shared/components/ui/text';
import { useForgotPasswordMutation } from '@/features/auth';

const BRAND = '#E86A1F';

function colors(dark: boolean) {
  if (dark) return {
    bg: '#0F0D0B', fg: '#F5F1EC', muted: 'rgba(245,241,236,0.55)',
    card: '#18150F', border: 'rgba(245,241,236,0.09)',
    inputBg: 'rgba(245,241,236,0.04)',
    chip: 'rgba(245,241,236,0.06)', placeholder: 'rgba(245,241,236,0.35)',
    iconBg: 'rgba(255,132,48,0.12)', iconBorder: 'rgba(255,132,48,0.25)',
  };
  return {
    bg: '#FAF7F2', fg: '#1A1815', muted: 'rgba(26,24,21,0.55)',
    card: '#FFFFFF', border: 'rgba(26,24,21,0.08)',
    inputBg: '#FAF7F2',
    chip: '#FFFFFF', placeholder: 'rgba(26,24,21,0.35)',
    iconBg: '#FFF1E6', iconBorder: '#FFDCBC',
  };
}

function BackChevron({ color }: { color: string }) {
  return <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
    <Path d="M10 2L4 7l6 5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>;
}
function MailIcon({ color }: { color: string }) {
  return <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
    <Rect x={2} y={4} width={14} height={11} rx={2} stroke={color} strokeWidth={1.5} />
    <Path d="M2.5 5l6.5 5 6.5-5" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>;
}

export function ForgotPasswordForm() {
  const { email: emailParam = '' } = useLocalSearchParams<{ email?: string }>();
  const forgotPasswordMutation = useForgotPasswordMutation();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const c = colors(isDark);

  const form = useForm({
    defaultValues: { email: emailParam },
    onSubmit: async ({ value }) => {
      try {
        await forgotPasswordMutation.mutateAsync(value.email);
        router.push(`/(auth)/reset-password?email=${value.email}`);
      } catch (err) {
        if (err instanceof Error) return { fields: { email: err.message } };
        return { fields: { email: 'Error al enviar el código' } };
      }
    },
  });

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
        <View style={{
          width: 84, height: 84, borderRadius: 24,
          backgroundColor: c.iconBg, borderWidth: 1, borderColor: c.iconBorder,
          alignItems: 'center', justifyContent: 'center', marginBottom: 24,
        }}>
          <Svg width={38} height={38} viewBox="0 0 38 38" fill="none">
            <Rect x={8} y={17} width={22} height={15} rx={3} stroke={BRAND} strokeWidth={2} />
            <Path d="M13 17v-5a6 6 0 0112 0v5" stroke={BRAND} strokeWidth={2} strokeLinecap="round" />
            <Circle cx={19} cy={24} r={2} fill={BRAND} />
            <Path d="M19 26v3" stroke={BRAND} strokeWidth={2} strokeLinecap="round" />
          </Svg>
        </View>

        <Text style={{ fontFamily: 'InstrumentSerif_400Regular', fontSize: 32, lineHeight: 36, color: c.fg, letterSpacing: -0.6, textAlign: 'center' }}>
          {'¿Olvidaste tu\n'}
          <Text style={{ fontFamily: 'InstrumentSerif_400Regular_Italic', color: BRAND }}>contraseña?</Text>
        </Text>

        <Text style={{ marginTop: 14, fontSize: 15, color: c.muted, textAlign: 'center', lineHeight: 22, maxWidth: 300 }}>
          Tranquilo. Te enviamos un código al correo para que recuperes el acceso en segundos.
        </Text>
      </View>

      {/* Card */}
      <View style={{
        margin: 16, marginTop: 28, padding: 20,
        backgroundColor: c.card, borderRadius: 24,
        borderWidth: 1, borderColor: c.border, gap: 14,
        shadowColor: isDark ? '#000' : '#141428',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: isDark ? 0.3 : 0.06,
        shadowRadius: 50, elevation: 8,
      }}>
        <form.Field
          name="email"
          validators={{ onChange: z.string().min(1, 'Requerido').email('Correo inválido') }}>
          {(field) => (
            <View style={{ gap: 6 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: c.fg }}>Correo registrado</Text>
              <View style={{ height: 52, borderRadius: 14, backgroundColor: c.inputBg, borderWidth: 1, borderColor: c.border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10 }}>
                <MailIcon color={c.muted} />
                <TextInput
                  style={{ flex: 1, fontSize: 15, color: c.fg }}
                  placeholder="tu@ejemplo.com"
                  placeholderTextColor={c.placeholder}
                  keyboardType="email-address"
                  autoComplete="email"
                  autoCapitalize="none"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                  returnKeyType="send"
                  onSubmitEditing={form.handleSubmit}
                />
              </View>
              {field.state.meta.errors.length > 0 && (
                <Text style={{ fontSize: 12, color: '#E05252' }}>{String(field.state.meta.errors[0])}</Text>
              )}
            </View>
          )}
        </form.Field>

        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Pressable
              onPress={form.handleSubmit}
              disabled={!canSubmit || isSubmitting || forgotPasswordMutation.isPending}
              style={{
                height: 54, borderRadius: 14, backgroundColor: BRAND,
                alignItems: 'center', justifyContent: 'center',
                opacity: !canSubmit || isSubmitting || forgotPasswordMutation.isPending ? 0.6 : 1,
                shadowColor: BRAND, shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.35, shadowRadius: 22, elevation: 6,
              }}>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: -0.1 }}>
                {isSubmitting || forgotPasswordMutation.isPending ? 'Enviando...' : 'Enviar código'}
              </Text>
            </Pressable>
          )}
        </form.Subscribe>

        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={{ fontSize: 13, color: c.muted }}>¿Lo recordaste? </Text>
          <Pressable onPress={() => router.replace('/(auth)/sign-in')}>
            <Text style={{ fontSize: 13, color: BRAND, fontWeight: '700' }}>Volver a iniciar sesión</Text>
          </Pressable>
        </View>
      </View>

      <View style={{ flex: 1 }} />
    </View>
  );
}
