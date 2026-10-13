import { STORE_WEB_DOMAIN } from '@/shared/config/constants';

export function getProductShareUrl(tenantDomain: string, productId: string): string {
  return `https://${tenantDomain}.${STORE_WEB_DOMAIN}/products/${productId}`;
}
