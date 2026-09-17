export interface Collection {
  id: string;
  tenantId: string;
  name: string;
  coverImageKey: string | null;
  coverImageUrl: string | null;
  /** Primary image URL of the first (up to 4) products in the collection — used to
   * render the auto-collage cover when no manual `coverImageUrl` was set. */
  previewImageUrls: string[];
  productsCount: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface ApiCollectionResponse {
  id: string;
  tenantId: string;
  name: string;
  coverImageKey: string | null;
  coverImageUrl: string | null;
  previewImageUrls?: string[];
  productsCount: number | string;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateCollectionData {
  name: string;
}

export interface UpdateCollectionData {
  name?: string;
  coverImageKey?: string | null;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
