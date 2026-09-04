/**
 * Color world for "Escaparate" — the e-commerce-polish direction that
 * replaced the market-stall (magenta price-tag) system. Purple accent +
 * rounded cards, modeled after the modern retail apps sellers use daily.
 * Kept the `getVitrinaTheme`/`VitrinaTheme` names on purpose to avoid
 * touching every import across the app for a rename — see PR notes.
 * Bg values are duplicated as literal Tailwind classes in several
 * app/*.tsx screens (bg-[...] dark:bg-[...]) — keep both in sync.
 */
export interface VitrinaTheme {
  bg: string;
  surface: string;
  ink: string;
  muted: string;
  accent: string;
  /** Secondary stop for accent gradients (hero cards, store mark). */
  accent2: string;
  ok: string;
  warn: string;
  bad: string;
}

export const VITRINA_LIGHT: VitrinaTheme = {
  bg: '#F6F5FB',
  surface: '#FFFFFF',
  ink: '#17151F',
  muted: '#76718C',
  accent: '#6C4FF2',
  accent2: '#8B6BFA',
  ok: '#1FAE7A',
  warn: '#E0972A',
  bad: '#EF4444',
};

export const VITRINA_DARK: VitrinaTheme = {
  bg: '#101018',
  surface: '#1B1926',
  ink: '#F2F0FA',
  muted: '#9C97B5',
  accent: '#8B6BFA',
  accent2: '#6C4FF2',
  ok: '#33D18F',
  warn: '#F2A83E',
  bad: '#FF6B6B',
};

export function getVitrinaTheme(isDark: boolean): VitrinaTheme {
  return isDark ? VITRINA_DARK : VITRINA_LIGHT;
}

/** Fixed near-black used for the price pill overlaid on product photos —
 * stays constant in both themes, it's a label on an image, not a surface. */
export const NAV_BAR = '#17151F';
