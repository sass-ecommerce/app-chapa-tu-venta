# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Expo dev server (clears cache)
npm run ios        # Launch iOS simulator
npm run android    # Launch Android emulator
npm run web        # Run in browser
npm run clean      # Clear cache and node_modules
```

No test runner or lint script is configured in package.json.

## Architecture

This is a **React Native / Expo** mobile app (iOS, Android, Web) using **Expo Router** for file-based routing. The project uses the new Expo architecture (bridgeless mode enabled).

### Directory Layout

- `/app/` — Expo Router routes. Route groups: `/(auth)/`, `/(tabs)/`, `/(onboarding)/`. Root `_layout.tsx` handles auth guarding and provides `QueryClientProvider` + `ThemeProvider`.
- `/src/features/` — Feature-first modules. Each feature (auth, products, home, profile, stores, onboarding) is self-contained with `components/`, `api/`, `queries/`, `utils/`, `types.ts`, and `index.ts`.
- `/src/shared/` — Cross-feature code: `components/ui/` (reusable primitives), `hooks/`, `config/` (API config, constants, fetch utility), `context/` (theme), `utils/`.

### State Management

- **TanStack Query v5** — all server state. Feature queries live in `src/features/<feature>/queries/`.
- **Zustand v5** — UI/client state (e.g., product list view mode, search, filters).
- **expo-secure-store** — token persistence (never AsyncStorage for auth tokens).

### API Layer

`src/shared/config/fetch.ts` exports `apiFetch()`, a wrapper around `fetch` that:
- Injects `Authorization: Bearer <token>` from secure storage automatically.
- Handles 401s with token refresh.
- Reads base URL from `EXPO_PUBLIC_API_URL` (defaults to `http://localhost:3000/api`).

Each feature's `api/` folder contains plain async functions that call `apiFetch()`. These are consumed by TanStack Query hooks in `queries/`.

### Forms & Validation

- **TanStack Form v1** for form state management.
- **Zod v4** for schema validation.

### Styling

- **Nativewind 4** (Tailwind CSS for React Native). Class strings work on native components.
- Dark mode via `class` strategy. Theme colors are HSL CSS variables defined in the shared theme context.
- Use `cn()` from `src/shared/utils/` (clsx + tailwind-merge) for conditional classes.
- Component variants use `class-variance-authority` (CVA).

### Path Aliases (tsconfig)

- `@/*` → project root
- `@/features/*` → `src/features/*`
- `@/shared/*` → `src/shared/*`

### Key Patterns

- Each feature exports a public API via its `index.ts` barrel file.
- Icons: `lucide-react-native`.
- Primitive UI components (Popover, Select, Tabs, etc.) come from `@rn-primitives/*`.
- Gradients and animation constants are centralized in `src/shared/config/constants.ts`.
- EAS is configured for production builds — see `docs/EAS-CONFIG.md` and `BUILD_APK_GUIDE.md`.
