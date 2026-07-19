import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildEmail, sendSharedEmail } from "@/lib/email";

/** Generate a short referral code like "alice7X2QP" */
function generateReferralCode(email: string): string {
  const raw = email.split("@")[0] ?? "";
  const prefix = raw.replace(/[^a-zA-Z0-9]/g, "").toLowerCase().slice(0, 6);
  const suffix = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${prefix}${suffix}`;
}

function escHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, refCode, landingUrl } = body;

    if (!email || !email.trim()) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Get IP and user agent for spam prevention
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    console.log(`[AFFILIATE LEAD] New affiliate lead: ${email}, ref: ${refCode || 'none'}`);
    
    // Store affiliate lead in database
    try {
      await prisma.$executeRaw`
        INSERT INTO "AffiliateLead" (
          "id",
          "email",
          "refCode",
          "landingUrl",
          "ip",
          "userAgent",
          "createdAt"
        ) VALUES (
          'lead_' || substr(md5(random()::text), 1, 16),
          ${email},
          ${refCode || null},
          ${landingUrl || null},
          ${ip},
          ${userAgent},
          NOW()
        )
        ON CONFLICT ("email") DO UPDATE SET
          "refCode" = COALESCE(EXCLUDED."refCode", "AffiliateLead"."refCode"),
          "landingUrl" = COALESCE(EXCLUDED."landingUrl", "AffiliateLead"."landingUrl"),
          "createdAt" = NOW()
      `;
      console.log('[AFFILIATE LEAD] Stored in database');
    } catch (dbError) {
      console.error('[AFFILIATE LEAD] Database error:', dbError);
      // Continue to send email even if DB fails
    }

    // Create or retrieve real Affiliate record so they have a referral link immediately
    let referralCode: string | null = null;
    const baseUrl = process.env.NEXT_PUBLIC_URL || "https://www.quotexbert.com";

    try {
      referralCode = generateReferralCode(email);
      const affiliate = await prisma.affiliate.upsert({
        where: { email },
        create: {
          email,
          referralCode,
          name: email.split("@")[0],
          payoutPercent: 20,
          notes: `Auto-created from affiliate signup form on ${new Date().toISOString()}`,
        },
        update: {},  // Already exists — keep existing record
      });
      referralCode = affiliate.referralCode;
      console.log(`[AFFILIATE] Affiliate record ready: ${referralCode}`);
    } catch (affiliateError) {
      console.error("[AFFILIATE] Failed to create affiliate record:", affiliateError);
      // Non-blocking; we still respond success
    }

    // Send email notification to quotexbert@gmail.com
    {
      try {
        const submittedAt = new Date().toLocaleString();
        await sendSharedEmail({
          to: 'quotexbert@gmail.com',
          subject: '🎉 New Affiliate Lead Submitted',
          html: buildEmail('New Affiliate Lead', [
            { type: 'tag', content: 'Affiliate' },
            { type: 'heading', content: 'New Affiliate Lead Submitted' },
            { type: 'card', label: 'Lead Details', rawHtml: true, content: `<strong>Email:</strong> ${escHtml(email)}${refCode ? `<br><strong>Referral Code:</strong> ${escHtml(refCode)}` : ''}${landingUrl ? `<br><strong>Landing URL:</strong> <span style="word-break:break-all;">${escHtml(landingUrl)}</span>` : ''}<br><strong>IP Address:</strong> ${escHtml(ip)}<br><strong>Submitted:</strong> ${escHtml(submittedAt)}` },
            { type: 'text', content: 'Contact this lead to convert them into an affiliate partner.' },
          ]),
        });
        console.log('[AFFILIATE LEAD] Email sent to quotexbert@gmail.com');
      } catch (emailError) {
        console.error('[AFFILIATE LEAD] Failed to send email:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for your interest! We'll be in touch soon.",
      referralCode,
      referralUrl: referralCode ? `${baseUrl}/?ref=${referralCode}` : null,
    });

  } catch (error) {
    console.error("Affiliate lead error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process affiliate lead" },
      { status: 500 }
    );
  }
}
