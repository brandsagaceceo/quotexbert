import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const fromEmail = process.env.MAIL_FROM || "QuoteXbert <no-reply@quotexbert.com>";
const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "https://www.quotexbert.com";

function buildBroadcastEmail(contractorName: string): string {
  const subUrl = `${BASE_URL}/contractor/subscriptions`;
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>QuoteXbert — Start Getting Paid Jobs</title></head>
<body style="margin:0;padding:16px;background:#f1f5f9;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="center">
    <table width="100%" style="max-width:560px;" cellpadding="0" cellspacing="0">

      <!-- Header -->
      <tr><td style="background:linear-gradient(135deg,#9f1239 0%,#ea580c 100%);border-radius:12px 12px 0 0;padding:24px 32px;text-align:center;">
        <span style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-.3px;">QuoteXbert</span>
      </td></tr>

      <!-- Body -->
      <tr><td style="background:#fff;padding:28px 32px 24px;">

        <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#9f1239;text-transform:uppercase;letter-spacing:.8px;">New Jobs Are Waiting</p>
        <h1 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#0f172a;line-height:1.3;">
          Hi ${contractorName || "there"} 👋 — homeowners near you are posting jobs right now
        </h1>
        <p style="margin:0 0 20px;font-size:15px;color:#475569;line-height:1.6;">
          New renovation, plumbing, electrical, painting and handyman leads are being posted every day on QuoteXbert.
          Subscribe to your categories and get direct access — no commissions, no bidding wars.
        </p>

        <!-- Plan cards -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
          <tr>
            <!-- Handyman -->
            <td width="32%" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:14px 10px;text-align:center;vertical-align:top;">
              <div style="font-size:24px;margin-bottom:6px;">🔧</div>
              <div style="font-weight:800;color:#166534;font-size:14px;margin-bottom:2px;">Handyman</div>
              <div style="font-size:20px;font-weight:900;color:#15803d;">$49<span style="font-size:12px;font-weight:600;color:#64748b;">/mo</span></div>
              <div style="font-size:11px;color:#4ade80;margin-top:4px;">3 categories</div>
            </td>
            <td width="4%"></td>
            <!-- Renovation Xbert -->
            <td width="32%" style="background:#fff7ed;border:2px solid #fb923c;border-radius:10px;padding:14px 10px;text-align:center;vertical-align:top;">
              <div style="font-size:10px;font-weight:900;color:#ea580c;letter-spacing:.5px;margin-bottom:4px;">⭐ POPULAR</div>
              <div style="font-size:24px;margin-bottom:6px;">🏗️</div>
              <div style="font-weight:800;color:#c2410c;font-size:14px;margin-bottom:2px;">Renovation</div>
              <div style="font-size:20px;font-weight:900;color:#ea580c;">$99<span style="font-size:12px;font-weight:600;color:#64748b;">/mo</span></div>
              <div style="font-size:11px;color:#fb923c;margin-top:4px;">6 categories</div>
            </td>
            <td width="4%"></td>
            <!-- General -->
            <td width="28%" style="background:#fff1f2;border:1px solid #fda4af;border-radius:10px;padding:14px 10px;text-align:center;vertical-align:top;">
              <div style="font-size:24px;margin-bottom:6px;">👷</div>
              <div style="font-weight:800;color:#9f1239;font-size:14px;margin-bottom:2px;">General</div>
              <div style="font-size:20px;font-weight:900;color:#be123c;">$149<span style="font-size:12px;font-weight:600;color:#64748b;">/mo</span></div>
              <div style="font-size:11px;color:#fb7185;margin-top:4px;">All categories</div>
            </td>
          </tr>
        </table>

        <p style="margin:0 0 8px;font-size:14px;color:#475569;line-height:1.6;">✓ No commission on jobs won &nbsp;·&nbsp; ✓ Cancel anytime &nbsp;·&nbsp; ✓ Unlimited applications</p>

        <!-- CTA Button -->
        <table cellpadding="0" cellspacing="0" width="100%" style="margin:20px 0 0;">
          <tr>
            <td align="center">
              <a href="${subUrl}"
                 style="display:inline-block;background:linear-gradient(135deg,#9f1239 0%,#ea580c 100%);color:#fff;font-size:16px;font-weight:800;text-decoration:none;padding:14px 40px;border-radius:8px;letter-spacing:-.2px;">
                View Plans &amp; Sign Up Now →
              </a>
            </td>
          </tr>
        </table>

      </td></tr>

      <!-- Footer -->
      <tr><td style="background:#f8fafc;border-top:1px solid #e2e8f0;border-radius:0 0 12px 12px;padding:18px 32px;text-align:center;">
        <p style="margin:0 0 6px;font-size:13px;color:#64748b;">
          Need help? Email us at
          <a href="mailto:quotexbert@gmail.com" style="color:#9f1239;text-decoration:none;font-weight:600;">quotexbert@gmail.com</a>
        </p>
        <p style="margin:0;font-size:11px;color:#94a3b8;">
          © ${new Date().getFullYear()} QuoteXbert · You received this because you registered as a contractor.
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await auth();
    const userId = authResult.userId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Admin check
    const adminUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    if (!resend) {
      return NextResponse.json(
        { error: "RESEND_API_KEY not configured — emails cannot be sent" },
        { status: 500 }
      );
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
        await resend.emails.send({
          from: fromEmail,
          replyTo: "quotexbert@gmail.com",
          to: email,
          subject: "🔧 Jobs are waiting for you on QuoteXbert — sign up now",
          html: buildBroadcastEmail(name),
        });

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
