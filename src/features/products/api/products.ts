import { apiFetch } from '../../../shared/config/fetch';
import type { Product, ApiProductResponse } from '../types';

// Re-export types for convenience
export type { Product, ApiProductResponse };

// Get all products (requires storeSlug)
export async function getProducts(storeSlug: string, token: string): Promise<Product[]> {
  const data = await apiFetch<ApiProductResponse[]>(
    '/products',
    { headers: { Authorization: `Bearer ${token}` } },
    { storeSlug }
  );

  console.log('✅ [API] Products fetched:', data.length, 'products');

  // Convertir solo los campos necesarios (string a number)
  return data.map((item) => ({
    ...item,
    stockQuantity: parseInt(item.stockQuantity, 10),
    priceList: parseFloat(item.priceList),
  }));
}

// Get product by slug (requires storeSlug and token)
export async function getProductBySlug(slug: string, token: string): Promise<Product> {
  const data = await apiFetch<ApiProductResponse>(`/products/${slug}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log(`✅ [API] Product fetched by slug (${slug}):`, data);

  if (!data) {
    throw new Error('Producto no encontrado');
  }

  const item = data;
  return {
    ...item,
    stockQuantity: parseInt(item.stockQuantity, 10),
    priceList: parseFloat(item.priceList),
  };
}
