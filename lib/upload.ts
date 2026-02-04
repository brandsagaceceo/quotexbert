import { put } from "@vercel/blob";
import { nanoid } from "nanoid";

export async function uploadImage(
  file: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  try {
    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      contentType: contentType,
    });

    console.log('[Upload] Successfully uploaded to Vercel Blob:', blob.url);
    return blob.url;
  } catch (error) {
    console.error('[Upload] Vercel Blob upload failed:', error);
    throw new Error(`Failed to upload to storage: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function uploadMultipleImages(
  files: Array<{ buffer: Buffer; filename: string; contentType: string }>
): Promise<string[]> {
  const uploadPromises = files.map(file =>
    uploadImage(file.buffer, file.filename, file.contentType)
  );
  
  return Promise.all(uploadPromises);
}
