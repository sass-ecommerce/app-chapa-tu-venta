export const STORAGE_FOLDERS = {
  PRODUCTS: 'products',
} as const;

// Brand accent (2026 redesign) — not yet wired into the --primary CSS token,
// so screens that need it apply it explicitly. See other usages in
// app/categories, app/products/[slug], and features/products/components.
export const BRAND_ORANGE = '#D9711A';

// Onboarding steps constants (deprecated - keeping for backwards compatibility)
// New approach: check user.unsafeMetadata.registerStoreCompleted
export const ONBOARDING_STEPS = {
  REGISTER_STORE: 'register-store',
} as const;

// Animation constants for UI consistency
export const ANIMATION = {
  DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
  STAGGER: 100,
  SPRING: {
    damping: 15,
    stiffness: 150,
  },
  BOUNCE: {
    damping: 10,
    stiffness: 100,
  },
} as const;

// Gradient presets for vibrancy
export const GRADIENTS = {
  PRIMARY: 'from-primary/10 to-primary/5',
  SUCCESS: 'from-green-500/10 to-emerald-500/5',
  WARNING: 'from-amber-500/10 to-orange-500/5',
  DESTRUCTIVE: 'from-red-500/10 to-rose-500/5',
  VIOLET: 'from-violet-500/10 to-purple-500/5',
} as const;

// RefreshControl colors (vibrante)
export const REFRESH_COLORS = {
  LIGHT: '#8b5cf6', // violet-500
  DARK: '#a78bfa', // violet-400
} as const;
