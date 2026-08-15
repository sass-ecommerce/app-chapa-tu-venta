export interface ProductCategory {
  id: string;
  parentId: string | null;
  name: string;
  slug: string;
}

export interface ProductImage {
  id: string;
  s3Key: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface Product {
  id: string;
  tenantId: string;
  categoryId: string | null;
  name: string;
  description?: string;
  basePrice: number;
  isActive: boolean;
  category?: ProductCategory | null;
  images: ProductImage[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiProductResponse {
  id: string;
  tenantId: string;
  categoryId: string | null;
  name: string;
  description?: string;
  basePrice: number | string;
  isActive: boolean;
  category?: ProductCategory | null;
  images?: ProductImage[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateProductData {
  name: string;
  description?: string;
  basePrice: number;
  isActive: boolean;
  categoryId?: string;
}

export interface UpdateProductData extends Partial<CreateProductData> {}
