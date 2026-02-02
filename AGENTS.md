# AGENTS.md - Chapa Tu Venta

React Native + Expo + TypeScript mobile app for inventory/sales management for small businesses in Peru.

**Stack**: React Native 0.81 | Expo 54 | TypeScript 5.9 | NativeWind 4.2  
**Auth**: Clerk | **Data**: TanStack Query + Supabase | **UI**: React Native Reusables  
**Forms**: TanStack Form + Zod | **State**: Zustand

**Path alias**: `@/*` = project root  
**Language**: Spanish UI, English code | **Currency**: S/ (Soles)

---

## Commands

### Development

```bash
npm run dev              # Start with cache clear (-c flag)
npm run ios              # iOS simulator
npm run android          # Android emulator
npm run web              # Web browser
npm run clean            # Remove .expo + node_modules
```

### Type Checking

```bash
npx tsc --noEmit         # Check types without build
npx tsc --noEmit --watch # Watch mode
```

### Formatting (Prettier)

```bash
npx prettier --write .                    # Format all files
npx prettier --write app/(tabs)/index.tsx # Format single file
npx prettier --check .                    # Check formatting
```

**Prettier Config**: 100 char width, single quotes, 2 spaces, Tailwind plugin

### Pre-Commit Checklist

- [ ] TypeScript compiles (`npx tsc --noEmit`)
- [ ] Code formatted (`npx prettier --check .`)
- [ ] No `console.error` in code (only for debugging)
- [ ] Tested in light AND dark mode
- [ ] Spanish text, S/ currency
- [ ] No `any` types

### Manual Testing Checklist

- [ ] Works in light + dark mode
- [ ] Loading states display correctly
- [ ] Errors show user-friendly Spanish messages
- [ ] Navigation works (back button, params)
- [ ] No console warnings
- [ ] Safe areas respected

---

## Code Style

### Import Order (STRICT - 6 parts)

```typescript
// 1. React & React Native
import * as React from 'react';
import { View, ScrollView, Alert, Pressable } from 'react-native';

// 2. Third-party libraries
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { router } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';

// 3. UI components (@/components/ui/)
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

// 4. Custom components
import { ProductCard } from '@/components/product-card';

// 5. Icons (Lucide React Native)
import { Search, Plus, ChevronRight } from 'lucide-react-native';

// 6. Utils & types
import { getProducts } from '@/lib/api/products';
import type { Product } from '@/lib/api/products';
```

**Use `import type` for TypeScript types only**

### Naming Conventions

- **PascalCase**: Components, Types, Interfaces  
  `ProductCard`, `CreateProductData`, `ApiResponse`
- **camelCase**: Functions, variables, hooks  
  `fetchProducts`, `userName`, `useProductsStore`
- **UPPER_SNAKE_CASE**: Constants, enums  
  `ONBOARDING_STEPS`, `API_CONFIG`, `MAX_FILE_SIZE`

### TypeScript Rules

- **Strict mode enabled** (tsconfig.json)
- **NO `any` types** - Use `unknown` or specific types
- **Explicit return types** for exported functions
- **Type API responses** - Create interface, transform in API layer
- **Use `import type`** for type-only imports

Example:

```typescript
// Good
export async function getProducts(): Promise<Product[]> { ... }
import type { Product } from '@/lib/api/products';

// Bad
export async function getProducts() { ... }  // Missing return type
let data: any;  // Never use 'any'
```

### Component Structure Order

```typescript
export default function MyScreen() {
  // 1. Router/navigation hooks
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // 2. Auth/user hooks
  const { user } = useUser();

  // 3. Global state (Zustand)
  const category = useProductsStore((state) => state.selectedCategory);

  // 4. Local state (useState)
  const [refreshing, setRefreshing] = React.useState(false);

  // 5. Data fetching (React Query)
  const { data, isLoading, error } = useQuery({ ... });

  // 6. Mutations (React Query)
  const mutation = useMutation({ ... });

  // 7. Forms (TanStack Form)
  const form = useForm({ ... });

  // 8. Effects (useEffect)
  React.useEffect(() => { ... }, []);

  // 9. Event handlers
  const handleSubmit = () => { ... };

  // 10. Render
  return <View>...</View>;
}
```

### Error Handling Patterns

**API errors** - Throw from `apiFetch()`:

```typescript
if (!response.ok) {
  throw new Error(`API Error: ${response.status} ${response.statusText}`);
}
```

**Component errors** - Try-catch with `Alert.alert`:

```typescript
try {
  await createProduct(data);
  Alert.alert('Éxito', 'Producto creado correctamente');
} catch (error) {
  console.error('❌ [Create] Error:', error);
  Alert.alert('Error', error instanceof Error ? error.message : 'Error desconocido');
}
```

**React Query errors** - Use `onError` callback:

```typescript
const mutation = useMutation({
  mutationFn: createProduct,
  onSuccess: () => {
    /* invalidate cache */
  },
  onError: (error) => {
    Alert.alert('Error', error.message);
  },
});
```

**Conditional error rendering**:

```typescript
{error && (
  <View className="rounded-lg bg-red-50 p-4">
    <Text className="text-red-900">{error.message}</Text>
    <Button onPress={() => refetch()}>Reintentar</Button>
  </View>
)}
```

### State Management

- **Server state**: React Query (queries, mutations, cache)
- **Global client state**: Zustand stores (`lib/store/`)
- **Local component state**: `useState`, `useReducer`
- **Form state**: TanStack Form

### Styling with NativeWind

- **ONLY use `className`** - NO inline `style` prop
- **Dark mode**: Use semantic colors that adapt automatically
- **Common patterns**:
  - Screen: `className="flex-1 bg-background p-5"`
  - Card: `className="rounded-2xl bg-card p-4"`
  - Title: `className="text-2xl font-bold text-foreground"`
  - Subtitle: `className="text-sm text-muted-foreground"`
  - Gap: `className="gap-3"` (12px)
  - Margin: `className="mb-6"` (24px)

**Semantic colors**: `bg-background`, `text-foreground`, `bg-card`, `text-primary`, `text-destructive`, `text-muted-foreground`  
All colors adapt to dark mode automatically.

### Console Logging

Use emoji prefixes for clarity:

```typescript
console.log('✅ [Module] Success message');
console.error('❌ [Module] Error:', error);
console.log('📝 [Module] Info:', data);
console.log('🚪 [Auth] User signed out');
```

---

## Project-Specific Rules

### Language & Localization

- **UI text**: Spanish only (`"Crear Producto"`, `"Guardar"`, `"Cancelar"`)
- **Code/variables**: English (`createProduct`, `handleSubmit`)
- **Currency**: `S/` (Soles peruanos) - NEVER use `$`
- **Date format**: 24-hour local Peruvian format

### Validation Patterns (Zod)

```typescript
// RUC (Peruvian tax ID - 11 digits, starts with 10 or 20)
z.string()
  .regex(/^\d{11}$/, 'El RUC debe tener 11 dígitos')
  .refine((val) => val.startsWith('10') || val.startsWith('20'), 'RUC inválido');

// Phone (Peruvian mobile - 9 digits, starts with 9)
z.string()
  .regex(/^\d{9}$/, 'Debe tener 9 dígitos')
  .refine((val) => val.startsWith('9'), 'Debe comenzar con 9');

// Price/Stock
z.number().positive('El precio debe ser mayor a 0');
z.number().int().nonnegative('El stock no puede ser negativo');
```

### API Patterns

- **Always use `apiFetch()`** from `lib/api/config.ts` - NEVER direct `fetch()`
- **Transform API types** - Create `ApiProduct` type, transform to app `Product` type
- **Supabase filters**: `/products?id=eq.${id}` (equal), `?name=like.*Nike*` (like)
- **Return data on POST**: Add header `Prefer: 'return=representation'`

Example:

```typescript
// lib/api/products.ts
export interface ApiProduct {
  /* Supabase schema */
}
export interface Product {
  /* App type */
}

function transformProduct(api: ApiProduct): Product {
  /* ... */
}

export async function getProducts(): Promise<Product[]> {
  const data = await apiFetch<ApiProduct[]>('/products');
  return data.map(transformProduct);
}
```

### Navigation (Expo Router)

```typescript
router.push('/products/create'); // Navigate forward
router.replace('/(tabs)'); // Replace (no back button)
router.back(); // Go back
router.push(`/products/${id}`); // Dynamic route
```

---

## Quick Reference

**File Structure**: `app/` (routes), `lib/` (logic), `components/` (UI)  
**Env vars**: `.env.local` (`EXPO_PUBLIC_*` prefix required)  
**Types**: Colocated with API modules (`lib/api/*.ts`)  
**UI Components**: React Native Reusables (`components/ui/`)  
**Full Guide**: See `DEVELOPMENT_GUIDE.md` for comprehensive patterns, component examples, and business flows

---

**Version**: 2.0.0  
**Last Updated**: January 31, 2026  
**For detailed development guide, see**: `DEVELOPMENT_GUIDE.md`
