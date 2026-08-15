import { Image, getFileSize } from 'react-native-compressor';
import { logError } from './utils';

export interface CompressedImageResult {
  uri: string;
  contentType: string;
}

interface CompressImageInput {
  uri: string;
  contentType: string;
}

const PRODUCT_IMAGE_COMPRESSION_OPTIONS = {
  compressionMethod: 'auto' as const,
  maxWidth: 1600,
  maxHeight: 1600,
  quality: 0.75,
  output: 'jpg' as const,
};

// Must match PRODUCT_IMAGE_COMPRESSION_OPTIONS.output above.
const COMPRESSED_OUTPUT_CONTENT_TYPE = 'image/jpeg';

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 KB';
  const kb = bytes / 1024;
  return kb >= 1024 ? `${(kb / 1024).toFixed(2)} MB` : `${kb.toFixed(0)} KB`;
}

async function logCompressionResult(originalUri: string, compressedUri: string) {
  try {
    const [originalBytes, compressedBytes] = await Promise.all([
      getFileSize(originalUri),
      getFileSize(compressedUri),
    ]);
    const original = Number(originalBytes);
    const compressed = Number(compressedBytes);
    const reduction = original > 0 ? Math.round((1 - compressed / original) * 100) : 0;
    console.log(
      `[compressProductImage] ${formatBytes(original)} -> ${formatBytes(compressed)} (-${reduction}%)`
    );
  } catch (err) {
    logError('compressProductImage: no se pudo calcular el peso de los archivos', err);
  }
}

export async function compressProductImage({
  uri,
  contentType,
}: CompressImageInput): Promise<CompressedImageResult> {
  try {
    const compressedUri = await Image.compress(uri, PRODUCT_IMAGE_COMPRESSION_OPTIONS);
    await logCompressionResult(uri, compressedUri);
    return { uri: compressedUri, contentType: COMPRESSED_OUTPUT_CONTENT_TYPE };
  } catch (err) {
    logError('compressProductImage: usando archivo original por fallo de compresión', err);
    return { uri, contentType };
  }
}
