import { STORE_WEB_DOMAIN } from '@/shared/config/constants';

export function getCollectionShareUrl(tenantDomain: string, collectionId: string): string {
  return `https://${tenantDomain}.${STORE_WEB_DOMAIN}/collections/${collectionId}`;
}
