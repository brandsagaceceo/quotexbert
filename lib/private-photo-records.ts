import { prisma } from "@/lib/prisma";
import {
  deletePrivateImage,
  isPrivatePhotoOwnedBy,
  privatePhotoPath,
} from "@/lib/upload";

export function parseApprovedPhotoSelection(body: unknown): string[] | null {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return null;
  }

  const photos = (body as Record<string, unknown>).photos;
  if (photos === undefined) return [];
  if (
    !Array.isArray(photos) ||
    photos.length > 10 ||
    !photos.every((photo): photo is string => typeof photo === "string")
  ) {
    return null;
  }

  return Array.from(new Set(photos));
}

export function approvedProjectPhotos(
  storedPhotos: string | null | undefined,
  requestedPhotos: string[],
): string[] | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(storedPhotos || "[]");
  } catch {
    parsed = [];
  }

  const availablePhotos = new Set(
    Array.isArray(parsed)
      ? parsed.filter((photo): photo is string => typeof photo === "string")
      : [],
  );
  return requestedPhotos.every((photo) => availablePhotos.has(photo))
    ? requestedPhotos
    : null;
}

export function privatePhotoAccessAllowed(
  isOwner: boolean,
  isActiveContractor: boolean,
  hasPublishedLeadAccess: boolean,
): boolean {
  return isOwner || (isActiveContractor && hasPublishedLeadAccess);
}

export function privatePhotosBelongTo(
  photos: unknown,
  userId: string,
): boolean {
  if (photos === undefined || photos === null) return true;
  if (!Array.isArray(photos)) return false;
  return photos.every(
    (photo) =>
      typeof photo === "string" &&
      (!privatePhotoPath(photo) || isPrivatePhotoOwnedBy(photo, userId)),
  );
}

async function hasPrivatePhotoReferences(photoUrl: string): Promise<boolean> {
  const [estimate, project, lead, generation] = await Promise.all([
    prisma.aIEstimate.findFirst({
      where: { images: { contains: photoUrl } },
      select: { id: true },
    }),
    prisma.savedProject.findFirst({
      where: {
        OR: [
          { photos: { contains: photoUrl } },
          { visualizerImages: { contains: photoUrl } },
        ],
      },
      select: { id: true },
    }),
    prisma.lead.findFirst({
      where: { photos: { contains: photoUrl } },
      select: { id: true },
    }),
    prisma.visualizerGeneration.findFirst({
      where: {
        OR: [{ beforeImageUrl: photoUrl }, { afterImageUrl: photoUrl }],
      },
      select: { id: true },
    }),
  ]);

  return Boolean(estimate || project || lead || generation);
}

export async function deleteUnreferencedPrivatePhotos(
  photoUrls: string[],
): Promise<void> {
  for (const photoUrl of new Set(photoUrls)) {
    const pathname = privatePhotoPath(photoUrl);
    if (!pathname || (await hasPrivatePhotoReferences(photoUrl))) continue;
    await deletePrivateImage(pathname);
  }
}

export async function privatePhotoIsReferenced(
  photoUrl: string,
): Promise<boolean> {
  return privatePhotoPath(photoUrl)
    ? hasPrivatePhotoReferences(photoUrl)
    : false;
}
