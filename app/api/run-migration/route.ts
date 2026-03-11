import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Running production migration...");

    // Add displayName column to users table if it doesn't exist
    await prisma.$executeRaw`
      DO $$ 
      BEGIN
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'users' AND column_name = 'displayName'
          ) THEN
              ALTER TABLE users ADD COLUMN "displayName" TEXT;
          END IF;
      END $$;
    `;

    // Add claimedBy column to leads table if it doesn't exist
    await prisma.$executeRaw`
      DO $$ 
      BEGIN
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'leads' AND column_name = 'claimedBy'
          ) THEN
              ALTER TABLE leads ADD COLUMN "claimedBy" TEXT;
          END IF;
      END $$;
    `;

    // Add claimedAt column to leads table if it doesn't exist
    await prisma.$executeRaw`
      DO $$ 
      BEGIN
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'leads' AND column_name = 'claimedAt'
          ) THEN
              ALTER TABLE leads ADD COLUMN "claimedAt" TIMESTAMP(3);
          END IF;
      END $$;
    `;

    console.log("✅ Migration completed successfully");

    return NextResponse.json({
      success: true,
      message: "Migration completed successfully",
    });
  } catch (error: any) {
    console.error("❌ Migration failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
