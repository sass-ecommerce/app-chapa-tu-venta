/**
 * ========================================
 * PRODUCTS FEATURE - TYPES
 * ========================================
 */

// Product type - App domain model (camelCase)
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
export interface ApiProductResponse {
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

// Create Product Payload
export interface CreateProductData {
  sku: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  isActive: boolean;
  priceList: number;
  imageUri?: string;
  trending?: boolean;
}

// Update Product Payload
export interface UpdateProductData extends Partial<CreateProductData> {
  slug: string;
}
