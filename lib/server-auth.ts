/**
 * server-auth.ts
 *
 * Shared server-side auth + DB-user resolution utilities for API routes.
 *
 * Background:
 *   Clerk assigns each user a stable `clerkUserId` (e.g. "user_abc123").
 *   The app has two user-record creation paths:
 *     1. Via Clerk webhook — User.id = UUID,       User.clerkUserId = clerkId
 *     2. Via /api/user/role — User.id = clerkId,  User.clerkUserId = null
 *
 *   All ownership checks MUST resolve the Clerk session ID to the DB User
 *   via an OR across both columns so both user paths are handled.
 */

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { NextResponse } from "next/server";

export interface ResolvedUser {
  /** DB User.id — always a consistent UUID or clerkId, use THIS for all ownership comparisons */
  dbUserId: string;
  /** Raw Clerk session user ID (may equal dbUserId on the role-selection path) */
  clerkUserId: string;
  email: string;
  name: string | null;
}

/**
 * Resolves the currently authenticated Clerk session to a DB User record.
 *
 * Returns { user } on success, or { error, status } if authentication fails
 * or the user is not found.
 *
 * Usage:
 *   const result = await resolveAuthUser();
 *   if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status });
 *   const { user } = result;
 */
export async function resolveAuthUser(): Promise<
  | { user: ResolvedUser }
  | { error: string; status: 401 | 404 }
> {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return { error: "Authentication required", status: 401 };
  }

  const dbUser = await prisma.user.findFirst({
    where: { OR: [{ id: clerkId }, { clerkUserId: clerkId }] },
    select: { id: true, email: true, name: true },
  });

  if (!dbUser) {
    return { error: "User not found", status: 404 };
  }

  return {
    user: {
      dbUserId: dbUser.id,
      clerkUserId: clerkId,
      email: dbUser.email,
      name: dbUser.name,
    },
  };
}
