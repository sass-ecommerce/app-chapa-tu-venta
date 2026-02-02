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

  console.log('✅ [API] Products fetched:', data);

  // Convertir solo los campos necesarios (string a number)
  return data.map((item) => ({
    ...item,
    stockQuantity: parseInt(item.stockQuantity, 10),
    priceList: parseFloat(item.priceList),
  }));
}

// Get product by slug (requires storeSlug and token)
export async function getProductById(
  slug: string,
  storeSlug: string,
  token: string
): Promise<Product> {
  const data = await apiFetch<ApiProductResponse[]>(
    `/products?slug=eq.${slug}`,
    { headers: { Authorization: `Bearer ${token}` } },
    { storeSlug }
  );

  if (!data || data.length === 0) {
    throw new Error('Producto no encontrado');
  }

  console.log('✅ [API] Product fetched by slug:', data[0]);

  const item = data[0];
  return {
    ...item,
    stockQuantity: parseInt(item.stockQuantity, 10),
    priceList: parseFloat(item.priceList),
  };
}

// Get recent products with pagination (for home screen)
export async function getRecentProducts(
  storeSlug: string,
  token: string,
  limit: number = 5,
  offset: number = 0
): Promise<Product[]> {
  const data = await apiFetch<ApiProductResponse[]>(
    '/products',
    { headers: { Authorization: `Bearer ${token}` } },
    {
      storeSlug,
      limit: limit.toString(),
      offset: offset.toString(),
    }
  );

  console.log('✅ [API] Recent products fetched:', data);

  // Convertir solo los campos necesarios (string a number)
  return data.map((item) => ({
    ...item,
    stockQuantity: parseInt(item.stockQuantity, 10),
    priceList: parseFloat(item.priceList),
  }));
}
