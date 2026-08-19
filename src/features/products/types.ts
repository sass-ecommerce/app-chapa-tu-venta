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

export interface ProductAttribute {
  attributeKey: string;
  attributeLabel: string;
  value: string;
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
  categories?: ProductCategory[];
  images: ProductImage[];
  attributes?: ProductAttribute[];
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
  categories?: ProductCategory[];
  images?: ProductImage[];
  attributes?: ProductAttribute[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductAttributeInput {
  attributeKey: string;
  attributeLabel: string;
  value: string;
}

export interface CreateProductData {
  name: string;
  description?: string;
  basePrice: number;
  isActive: boolean;
  categoryId?: string;
  attributes?: ProductAttributeInput[];
}

export interface UpdateProductData extends Partial<CreateProductData> {}
