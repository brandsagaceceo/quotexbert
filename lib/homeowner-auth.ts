import { prisma } from "@/lib/prisma";
import { resolveAuthUser, type ResolvedUser } from "@/lib/server-auth";

type HomeownerIdentityResult =
  | {
      success: true;
      user: ResolvedUser;
      homeownerIds: string[];
    }
  | { success: false; error: string; status: number };

type HomeownerIdentityDependencies = {
  resolveAuthUser: typeof resolveAuthUser;
  user: Pick<typeof prisma.user, "findMany">;
};

export async function resolveHomeownerIdentity(
  dependencies: HomeownerIdentityDependencies = {
    resolveAuthUser,
    user: prisma.user,
  },
) {
  const authResult = await dependencies.resolveAuthUser();
  if ("error" in authResult) {
    return {
      success: false,
      error: authResult.error,
      status: authResult.status,
    } satisfies HomeownerIdentityResult;
  }

  const principalIds = [
    ...new Set([authResult.user.dbUserId, authResult.user.clerkUserId]),
  ];
  const linkedUsers = await dependencies.user.findMany({
    where: {
      OR: [
        { id: { in: principalIds } },
        { clerkUserId: authResult.user.clerkUserId },
      ],
    },
    select: {
      id: true,
      role: true,
      homeownerProfile: { select: { userId: true } },
      contractorProfile: { select: { userId: true } },
    },
  });

  const isHomeowner =
    linkedUsers.length > 0 &&
    linkedUsers.every(
      (user) =>
        user.contractorProfile === null &&
        (user.role === "homeowner" ||
          (user.role === null && user.homeownerProfile !== null)),
    );

  if (!isHomeowner) {
    return {
      success: false,
      error: "Homeowner access required",
      status: 403,
    } satisfies HomeownerIdentityResult;
  }

  return {
    success: true,
    user: authResult.user,
    homeownerIds: Array.from(
      new Set([...principalIds, ...linkedUsers.map((user) => user.id)]),
    ),
  } satisfies HomeownerIdentityResult;
}
