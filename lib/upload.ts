import { del, get, put } from "@vercel/blob";
import { nanoid } from "nanoid";

const PRIVATE_PHOTO_ROOT = "homeowner-photos";
const PRIVATE_PHOTO_ROUTE = "/api/private-photo";

export function getPrivateBlobStoreId(): string {
  const storeId =
    process.env.VERCEL_ENV === "production"
      ? process.env.BLOB_STORE_ID
      : process.env.PRIVATE_BLOB_STORE_ID;

  if (!process.env.VERCEL_OIDC_TOKEN?.trim() || !storeId?.trim()) {
    throw new Error("PRIVATE_IMAGE_STORAGE_NOT_CONFIGURED");
  }

  return storeId.trim();
}

export function isPrivatePhotoPathname(pathname: string): boolean {
  const parts = pathname.split("/");
  return (
    parts.length === 3 &&
    parts[0] === PRIVATE_PHOTO_ROOT &&
    /^[A-Za-z0-9_-]+$/.test(parts[1] || "") &&
    /^[A-Za-z0-9_-]+\.(?:jpe?g|png|webp)$/.test(parts[2] || "")
  );
}

export function privatePhotoUrl(pathname: string): string {
  if (!isPrivatePhotoPathname(pathname)) {
    throw new Error("INVALID_PRIVATE_PHOTO_PATH");
  }
  return `${PRIVATE_PHOTO_ROUTE}?pathname=${encodeURIComponent(pathname)}`;
}

export function privatePhotoPath(photoUrl: string): string | null {
  try {
    const url = new URL(photoUrl, "https://local.invalid");
    if (
      url.origin !== "https://local.invalid" ||
      url.pathname !== PRIVATE_PHOTO_ROUTE
    ) {
      return null;
    }

    const pathname = url.searchParams.get("pathname");
    return pathname && isPrivatePhotoPathname(pathname) ? pathname : null;
  } catch {
    return null;
  }
}

export function isPrivatePhotoOwnedBy(
  photoUrl: string,
  userId: string,
): boolean {
  const pathname = privatePhotoPath(photoUrl);
  return Boolean(pathname?.startsWith(`${PRIVATE_PHOTO_ROOT}/${userId}/`));
}

export async function uploadPrivateImage(
  file: Buffer,
  userId: string,
  contentType: string,
): Promise<string> {
  const extensionByType: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  const extension = extensionByType[contentType];
  if (!extension) {
    throw new Error("UNSUPPORTED_IMAGE_TYPE");
  }

  const blob = await put(
    `${PRIVATE_PHOTO_ROOT}/${userId}/${nanoid()}.${extension}`,
    file,
    {
      access: "private",
      storeId: getPrivateBlobStoreId(),
      contentType,
      cacheControlMaxAge: 60,
    },
  );

  return privatePhotoUrl(blob.pathname);
}

export async function getPrivateImage(pathname: string) {
  if (!isPrivatePhotoPathname(pathname)) {
    throw new Error("INVALID_PRIVATE_PHOTO_PATH");
  }
  return get(pathname, {
    access: "private",
    storeId: getPrivateBlobStoreId(),
    useCache: false,
  });
}

export async function deletePrivateImage(pathname: string): Promise<void> {
  if (!isPrivatePhotoPathname(pathname)) {
    throw new Error("INVALID_PRIVATE_PHOTO_PATH");
  }
  await del(pathname, {
    storeId: getPrivateBlobStoreId(),
  });
}

export async function uploadImage(
  file: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  // Check if Vercel Blob token is configured
  const publicToken = process.env.BLOB_READ_WRITE_TOKEN;
  
  if (!publicToken) {
    console.error('[UPLOAD] BLOB_READ_WRITE_TOKEN is not configured. Image upload is disabled.');
    throw new Error('IMAGE_UPLOAD_NOT_CONFIGURED');
  }

  try {
    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      contentType: contentType,
      token: publicToken,
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
