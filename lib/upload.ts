import { put } from "@vercel/blob";
import { nanoid } from "nanoid";

export async function uploadImage(
  file: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  // Check if Vercel Blob token is configured
  const hasToken = !!process.env.BLOB_READ_WRITE_TOKEN;
  
  if (!hasToken) {
    console.error('[UPLOAD] BLOB_READ_WRITE_TOKEN is not configured. Image upload is disabled.');
    throw new Error('IMAGE_UPLOAD_NOT_CONFIGURED');
  }

  try {
    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      contentType: contentType,
    });

    console.log('[UPLOAD] Successfully uploaded to Vercel Blob:', blob.url);
    return blob.url;
  } catch (error) {
    console.error('[UPLOAD] Vercel Blob upload failed:', error);
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
