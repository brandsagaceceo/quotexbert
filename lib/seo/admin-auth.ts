import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const ADMIN_EMAILS = (
  process.env.ADMIN_EMAILS || "brandsagaceo@gmail.com,quotexbert@gmail.com"
)
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export async function resolveSeoAdmin() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return null;

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ clerkUserId }, { id: clerkUserId }],
    },
    select: { id: true, email: true },
  });
  if (!user || !ADMIN_EMAILS.includes(user.email.trim().toLowerCase())) {
    return null;
  }

  return { id: user.id };
}

export function areSeoAdminWritesEnabled() {
  return (
    process.env.VERCEL_ENV === "production" ||
    process.env.SEO_PREVIEW_WRITES_ENABLED === "true"
  );
}

export function getSeoStudioCapabilities() {
  const canEdit = areSeoAdminWritesEnabled();
  return {
    canEdit,
    canPublish: process.env.VERCEL_ENV === "production",
    canGenerate: canEdit && process.env.SEO_MANUAL_DRAFT_ENABLED === "true",
    scheduledDraftingEnabled: false,
  };
}
