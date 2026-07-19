import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { buildEmail, sendSharedEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'brandsagaceo@gmail.com,quotexbert@gmail.com')
  .split(',').map(e => e.trim().toLowerCase());

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "https://www.quotexbert.com";

function buildBroadcastEmail(contractorName: string): string {
  const subUrl = `${BASE_URL}/contractor/subscriptions`;
  return buildEmail("QuoteXbert Contractor Plans", [
    { type: "tag", content: "New Jobs Are Waiting" },
    { type: "heading", content: `Hi ${contractorName || "there"}, homeowners near you are posting jobs right now` },
    { type: "text", content: "New renovation, plumbing, electrical, painting and handyman leads are being posted on QuoteXbert. Subscribe to your categories and get direct access with no commissions on jobs won." },
    { type: "card", label: "Plan Options", rawHtml: true, content: `<strong>Handyman:</strong> $49/mo · 3 categories<br><strong>Renovation:</strong> $99/mo · 6 categories<br><strong>General:</strong> $149/mo · all categories` },
    { type: "text", content: "Cancel anytime. Unlimited applications included on active plans." },
    { type: "cta", content: "View Plans & Sign Up Now", href: subUrl },
  ]);
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await auth();
    const userId = authResult.userId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Admin check
    const adminUser = await prisma.user.findFirst({
      where: { OR: [{ id: userId }, { clerkUserId: userId }] },
      select: { email: true },
    });

    if (!adminUser || !ADMIN_EMAILS.includes(adminUser.email.toLowerCase())) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    // Optional: only send to contractors without any active subscription
    const unsubscribedOnly: boolean = body.unsubscribedOnly ?? true;

    // Fetch all contractors with their email addresses
    const contractors = await prisma.contractorProfile.findMany({
      include: {
        user: { select: { id: true, email: true } },
        ...(unsubscribedOnly
          ? {
              subscriptions: {
                where: { status: "active" },
                select: { id: true },
                take: 1,
              },
            }
          : {}),
      },
    });

    // Filter out contractors who already have an active subscription (if flag set)
    const targets = unsubscribedOnly
      ? contractors.filter((c: any) => !c.subscriptions || c.subscriptions.length === 0)
      : contractors;

    const results = { sent: 0, failed: 0, skipped: 0, emails: [] as string[] };

    for (const contractor of targets) {
      const email = contractor.user?.email;
      if (!email) {
        results.skipped++;
        continue;
      }

      const name = contractor.companyName || contractor.user?.email?.split("@")[0] || "there";

      try {
        const sendResult = await sendSharedEmail({
          replyTo: "quotexbert@gmail.com",
          to: email,
          subject: "🔧 Jobs are waiting for you on QuoteXbert — sign up now",
          html: buildBroadcastEmail(name),
        });

        if (!sendResult.success) {
          throw sendResult.error;
        }

        // Log the email event
        await prisma.$executeRaw`
          INSERT INTO "EmailEvent" ("id","type","to","userId","status","createdAt")
          VALUES (
            'email_' || substr(md5(random()::text), 1, 16),
            'subscription_broadcast',
            ${email},
            ${contractor.user?.id ?? null},
            'sent',
            NOW()
          )
        `;

        results.sent++;
        results.emails.push(email);

        // Small delay to respect Resend rate limits (~2 emails/sec is safe)
        await new Promise((r) => setTimeout(r, 500));
      } catch (err) {
        console.error("[BROADCAST] Failed to send to", email, err);
        results.failed++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Broadcast complete: ${results.sent} sent, ${results.failed} failed, ${results.skipped} skipped (no email)`,
      ...results,
    });
  } catch (err) {
    console.error("[BROADCAST] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
