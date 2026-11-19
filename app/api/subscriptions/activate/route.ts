import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { resolveAuthUser } from "@/lib/server-auth";
import { activateCheckoutSubscription, SubscriptionActivationError } from "@/lib/subscription-activation";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const authResult = await resolveAuthUser();
    if ("error" in authResult) {
      return NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status });
    }
    const { sessionId } = await request.json();
    if (typeof sessionId !== "string" || !sessionId) {
      return NextResponse.json({ success: false, error: "Missing checkout session" }, { status: 400 });
    }
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const result = await activateCheckoutSubscription(session, authResult.user.dbUserId);
    return NextResponse.json({ success: true, activated: result.categories, skipped: [], tier: result.tier });
  } catch (error) {
    console.error("[ACTIVATE] Subscription confirmation failed:", error);
    return NextResponse.json(
      { success: false, error: error instanceof SubscriptionActivationError ? error.message : "Could not confirm your subscription. Review billing before paying again." },
      { status: error instanceof SubscriptionActivationError ? error.status : 500 },
    );
  }
}
