/**
 * ========================================
 * STORES FEATURE - TYPES
 * ========================================
 */

export interface CreateStorePayload {
  name: string;
  ownerEmail?: string | null;
  ruc?: number | null;
  plan?: string | null;
  settings?: Record<string, any> | null;
}

export interface Store {
  name: string;
  slug: string;
  createdAt: string;
}

export interface StoreApiResponse {
  name: string;
  slug: string;
  created_at: string;
}

// Tienda del usuario autenticado (GET/PATCH /tenants/me).
export interface MyTenant {
  id: string;
  name: string;
  domain: string;
  logoUrl: string | null;
}

export interface UpdateMyTenantPayload {
  // `null` quita el logo.
  logoKey?: string | null;
}
