import { apiClient } from './api';

export interface PresignedUploadResult {
  uploadUrl: string;
  key: string;
}

export async function getPresignedUploadUrl(params: {
  folder: string;
  fileName: string;
  contentType: string;
  primaryIdentifier: string;
  secondaryIdentifier?: string;
}): Promise<PresignedUploadResult> {
  const { data } = await apiClient.post<{
    code: number;
    message: string;
    data: PresignedUploadResult;
  }>('/storage/presigned-upload', params);
  return data.data;
}

export async function getPresignedViewUrl(key: string): Promise<string> {
  const { data } = await apiClient.get<{
    code: number;
    message: string;
    data: { viewUrl: string };
  }>('/storage/presigned-view', { params: { key } });
  return data.data.viewUrl;
}

export async function uploadToS3(
  uploadUrl: string,
  fileUri: string,
  contentType: string
): Promise<void> {
  const fileResponse = await fetch(fileUri);
  const blob = await fileResponse.blob();

  const uploadResponse = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: blob,
  });

  if (!uploadResponse.ok) {
    throw new Error(`Error al subir imagen a S3: ${uploadResponse.status}`);
  }
}
