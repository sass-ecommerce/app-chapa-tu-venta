import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getMyTenant, updateMyTenant } from '../api/stores';
import { getPresignedUploadUrl, uploadToS3 } from '@/shared/config/storage';
import { STORAGE_FOLDERS } from '@/shared/config/constants';
import { compressLogoImage } from '@/shared/utils/image-compression';

export const storeKeys = {
  me: ['stores', 'me'] as const,
};

const EXTENSION_BY_CONTENT_TYPE: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/heic': 'heic',
  'image/heif': 'heif',
};

export function useMyTenantQuery() {
  return useQuery({
    queryKey: storeKeys.me,
    queryFn: getMyTenant,
  });
}

export function useUploadStoreLogoMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      fileUri,
      contentType,
      tenantId,
    }: {
      fileUri: string;
      contentType: string;
      tenantId: string;
    }) => {
      const compressed = await compressLogoImage({ uri: fileUri, contentType });
      // El backend valida que la extensión coincida con el tipo: se deriva
      // del resultado de la compresión (PNG, o el original si falló).
      const extension = EXTENSION_BY_CONTENT_TYPE[compressed.contentType] ?? 'png';

      const { uploadUrl, key } = await getPresignedUploadUrl({
        folder: STORAGE_FOLDERS.STORES,
        fileName: `logo.${extension}`,
        contentType: compressed.contentType,
        primaryIdentifier: tenantId,
      });
      await uploadToS3(uploadUrl, compressed.uri, compressed.contentType);

      // La subida a S3 solo deja el archivo ahí — hay que registrar la key en
      // la tienda para que quede asociada.
      return updateMyTenant({ logoKey: key });
    },
    onSuccess: (tenant) => {
      queryClient.setQueryData(storeKeys.me, tenant);
    },
  });
}
