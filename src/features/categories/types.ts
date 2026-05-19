export type CategoryType = 'BASE' | 'CHILDREN';

export interface Category {
  id: string;
  tenantId: string;
  parentId: string | null;
  type: CategoryType;
  name: string;
  slug: string;
  childrenCount: number;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}

export interface CreateCategoryData {
  name: string;
  slug: string;
  parentId?: string | null;
}

export interface UpdateCategoryData {
  name?: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
