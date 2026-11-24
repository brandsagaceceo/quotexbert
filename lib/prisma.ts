import { PrismaClient } from "@prisma/client";

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    process.env.POSTGRES_PRISMA_URL?.trim() ||
    process.env.POSTGRES_URL?.trim() ||
    "";
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
