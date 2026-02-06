import { apiFetch } from './config';

// Product type - matches API response structure (camelCase)
export interface Product {
  slug: string; // UUID del producto (identificador único)
  sku: string; // Código SKU
  name: string; // Nombre del producto
  description: string; // Descripción
  price: number; // Precio actual
  stockQuantity: number; // Stock (convertido de string a number)
  isActive: boolean; // Estado activo/inactivo
  priceList: number; // Precio de lista (convertido de string a number)
  imageUri: string; // URL de la imagen
  trending: boolean; // Es trending
}

// API Response type (before conversion)
interface ApiProductResponse {
  slug: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: string; // Viene como string desde la API
  isActive: boolean;
  priceList: string; // Viene como string desde la API
  imageUri: string;
  trending: boolean;
}

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
