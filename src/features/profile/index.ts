/**
 * ========================================
 * PROFILE FEATURE - PUBLIC API
 * ========================================
 *
 * Exporta solo lo necesario del feature Profile.
 * Los consumidores deben importar desde aquí, no de internals.
 *
 * Ejemplo:
 * import { EditProfileForm, useUpdateProfileMutation } from '@/features/profile';
 */

// Components
export { EditProfileForm } from './components/edit-profile-form';

// API
export { userApi } from './api/user';

// Types
export type { User, UpdateProfilePayload } from './types';
