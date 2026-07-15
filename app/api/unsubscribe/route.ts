import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isUnsubscribeCategory, verifyUnsubscribeToken } from "@/lib/unsubscribe";

export const dynamic = "force-dynamic";

// Maps the public unsubscribe category to the existing User preference field.
// Reuses the SAME fields already exposed by app/api/notifications/settings/route.ts —
// this route does not introduce a second preferences store.
const FIELD_MAP = {
  marketing: "notifyMarketingEmail",
  job: "notifyJobEmail",
  message: "notifyMessageEmail",
} as const;

const CATEGORY_LABEL: Record<string, string> = {
  marketing: "marketing and educational emails",
  job: "job alert emails",
  message: "new message emails",
  digest: "daily/weekly digest emails",
};

function htmlPage(opts: { title: string; message: string; ok: boolean }) {
  const { title, message, ok } = opts;
  const accent = ok ? "#9f1239" : "#b91c1c";
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} — QuoteXbert</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:48px 16px;min-height:100vh;">
  <tr><td align="center">
    <table width="100%" style="max-width:480px;" cellpadding="0" cellspacing="0">
      <tr><td style="background:linear-gradient(135deg,#9f1239 0%,#ea580c 100%);border-radius:12px 12px 0 0;padding:24px 32px;text-align:center;">
        <span style="font-size:20px;font-weight:800;color:#fff;letter-spacing:-.3px;">QuoteXbert</span>
      </td></tr>
      <tr><td style="background:#fff;border-radius:0 0 12px 12px;padding:32px;text-align:center;">
        <h1 style="margin:0 0 12px;font-size:20px;font-weight:700;color:${accent};">${title}</h1>
        <p style="margin:0 0 24px;font-size:14px;color:#475569;line-height:1.6;">${message}</p>
        <a href="/notifications" style="display:inline-block;background:#9f1239;color:#fff;font-size:14px;font-weight:700;padding:11px 24px;border-radius:8px;text-decoration:none;">Manage email preferences</a>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
  return new NextResponse(html, {
    status: ok ? 200 : 400,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

// GET /api/unsubscribe?u=<userId>&c=<category>&t=<token>
// One-click unsubscribe link used in email footers. Not session-authenticated —
// verified via a signed HMAC token instead (see lib/unsubscribe.ts), since the
// user is clicking from their email client and may not have an active session.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("u");
  const category = searchParams.get("c");
  const token = searchParams.get("t");

  if (!userId || !category || !token || !isUnsubscribeCategory(category) || !verifyUnsubscribeToken(userId, category, token)) {
    return htmlPage({
      title: "Invalid or expired link",
      message: "This unsubscribe link is invalid. You can manage your notification preferences directly from your account instead.",
      ok: false,
    });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { OR: [{ id: userId }, { clerkUserId: userId }] },
      select: { id: true },
    });

    if (!user) {
      return htmlPage({
        title: "Account not found",
        message: "We couldn't find an account matching this link.",
        ok: false,
      });
    }

    const field = FIELD_MAP[category as keyof typeof FIELD_MAP];
    await prisma.user.update({
      where: { id: user.id },
      data: category === "digest" ? { digestFrequency: "off" } : { [field]: false },
    });

    return htmlPage({
      title: "You've been unsubscribed",
      message: `You will no longer receive ${CATEGORY_LABEL[category]} from QuoteXbert. You can re-enable them anytime from your notification preferences.`,
      ok: true,
    });
  } catch (error) {
    console.error("[UNSUBSCRIBE] Failed to update preference:", error);
    return htmlPage({
      title: "Something went wrong",
      message: "We couldn't process your request right now. Please try again later.",
      ok: false,
    });
  }
}
