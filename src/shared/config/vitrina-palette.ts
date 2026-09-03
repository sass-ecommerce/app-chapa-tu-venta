/**
 * Color world for "Vitrina de mercado" — the home tab direction.
 * The magenta is Yape's purple, the color a seller checks dozens of times
 * a day to confirm a payment. Bg values are duplicated as literal Tailwind
 * classes in app/(tabs)/index.tsx (bg-[...] dark:bg-[...]) — keep both in sync.
 */
export interface VitrinaTheme {
  bg: string;
  surface: string;
  ink: string;
  muted: string;
  accent: string;
  ok: string;
  warn: string;
  bad: string;
}

export const VITRINA_LIGHT: VitrinaTheme = {
  bg: '#FBF9F4',
  surface: '#FFFFFF',
  ink: '#1A1A1A',
  muted: '#6B675F',
  accent: '#C0289C',
  ok: '#1E9E86',
  warn: '#B8860B',
  bad: '#E8432F',
};

export const VITRINA_DARK: VitrinaTheme = {
  bg: '#18140F',
  surface: '#221C15',
  ink: '#F3EFE8',
  muted: '#9C9384',
  accent: '#E85BC0',
  ok: '#3FCDAE',
  warn: '#F0A500',
  bad: '#FF6B54',
};

export function getVitrinaTheme(isDark: boolean): VitrinaTheme {
  return isDark ? VITRINA_DARK : VITRINA_LIGHT;
}
