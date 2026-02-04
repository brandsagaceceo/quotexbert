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
    console.warn('[Upload] BLOB_READ_WRITE_TOKEN not configured. Using placeholder URL for development.');
    console.warn('[Upload] To enable uploads:');
    console.warn('[Upload] 1. Go to https://vercel.com/ → Your Project → Storage');
    console.warn('[Upload] 2. Click "Create Database" → Select "Blob"');
    console.warn('[Upload] 3. Vercel will automatically add BLOB_READ_WRITE_TOKEN');
    
    // Return a placeholder Unsplash image for development
    const placeholderId = Math.floor(Math.random() * 1000);
    return `https://images.unsplash.com/photo-${placeholderId}?w=800&h=600&fit=crop`;
  }

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
