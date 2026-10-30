import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveAuthUser } from "@/lib/server-auth";

async function getActiveContractorId() {
  const authResult = await resolveAuthUser();
  if ("error" in authResult) {
    return { response: NextResponse.json({ error: authResult.error }, { status: authResult.status }) };
  }

  const contractor = await prisma.user.findUnique({
    where: { id: authResult.user.dbUserId },
    select: { id: true, role: true, isActive: true },
  });
  if (!contractor || contractor.role !== "contractor" || !contractor.isActive) {
    return { response: NextResponse.json({ error: "Active contractor access required" }, { status: 403 }) };
  }
  return { contractorId: contractor.id };
}

export async function GET(_req: NextRequest) {
  try {
    const access = await getActiveContractorId();
    if ("response" in access) {
      return access.response;
    }

    // Get contractor billing info
    const billing = await prisma.contractorBilling.findUnique({
      where: { userId: access.contractorId },
    });

    if (!billing) {
      return NextResponse.json({
        availableBalance: 0,
        categories: [],
        stripeCustomerId: null,
      });
    }

    // ContractorBilling currently tracks spend, not explicit available balance or categories.
    // Expose a simple derived "availableBalance" and empty categories array for now.
    return NextResponse.json({
      availableBalance: Math.max(0, billing.spendThisMonthCents),
      categories: [],
      stripeCustomerId: billing.stripeCustomerId,
    });
  } catch (error) {
    console.error("Error fetching payout info:", error);
    return NextResponse.json(
      { error: "Failed to fetch payout info" },
      { status: 500 }
    );
  }
}

export async function POST(_req: NextRequest) {
  try {
    const access = await getActiveContractorId();
    if ("response" in access) {
      return access.response;
    }

    return NextResponse.json(
      { error: "Payout processing is not available." },
      { status: 501 },
    );
  } catch (error) {
    console.error("Error processing payout:", error);
    return NextResponse.json(
      { error: "Failed to process payout" },
      { status: 500 }
    );
  }
}
