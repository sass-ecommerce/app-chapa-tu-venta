import { apiFetch } from './config';
import type { Product } from '@/components/product-card';

// API Response types (coincide con el schema de Supabase)
export interface ApiProduct {
  id: number;
  store_id?: number;
  category_id?: string;
  sku?: string;
  name: string;
  description?: string;
  price: number;
  price_list?: number;
  price_base?: number;
  stock_quantity: number;
  image_uri?: string;
  rating?: number;
  trending?: boolean;
  is_active?: boolean;
  created_at?: string;
}

// Transform API product to app Product type
function transformProduct(apiProduct: ApiProduct): Product {
  return {
    id: String(apiProduct.id),
    store_id: apiProduct.store_id,
    category_id: apiProduct.category_id,
    sku: apiProduct.sku,
    name: apiProduct.name,
    description: apiProduct.description,
    price: apiProduct.price,
    price_list: apiProduct.price_list,
    price_base: apiProduct.price_base,
    stock_quantity: apiProduct.stock_quantity,
    image_uri: apiProduct.image_uri,
    rating: apiProduct.rating,
    trending: apiProduct.trending,
    is_active: apiProduct.is_active,
    created_at: apiProduct.created_at,
  };
}

// Get all products
export async function getProducts(): Promise<Product[]> {
  const apiProducts = await apiFetch<ApiProduct[]>('/products');
  return apiProducts.map(transformProduct);
}

// Get product by ID
export async function getProductById(id: string): Promise<Product> {
  const apiProducts = await apiFetch<ApiProduct[]>(`/products?id=eq.${id}`);
  if (apiProducts.length === 0) {
    throw new Error('Product not found');
  }
  return transformProduct(apiProducts[0]);
}
