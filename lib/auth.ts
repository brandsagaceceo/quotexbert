import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return null;
  }

  return {
    id: userId,
    role: (sessionClaims as any)?.unsafeMetadata?.role as string | undefined,
    email: sessionClaims?.email as string | undefined,
  };
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }
  return user;
}

export async function requireRole(role: string) {
  const user = await requireAuth();
  if (user.role !== role) {
    redirect("/dashboard");
  }
  return user;
}
