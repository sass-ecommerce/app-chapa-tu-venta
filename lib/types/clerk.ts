// Clerk user metadata types

export interface UserPublicMetadata {
  user?: {
    slug: string;
  };
  store?: {
    slug: string;
  };
  registerStoreCompleted?: boolean;
}
