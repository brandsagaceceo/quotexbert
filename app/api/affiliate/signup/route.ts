import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

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
    
    // Send email notification to quotexbert@gmail.com
    if (resend) {
      try {
        await resend.emails.send({
          from: 'QuoteXbert <no-reply@quotexbert.com>',
          to: 'quotexbert@gmail.com',
          subject: '🎉 New Affiliate Lead Submitted',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">
              <div style="background: linear-gradient(135deg, #9f1239 0%, #ea580c 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0;">🎉 New Affiliate Lead!</h1>
              </div>
              <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
                <h2 style="color: #9f1239; margin-top: 0;">Lead Details</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;"><strong>Email:</strong></td>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${email}</td>
                  </tr>
                  ${refCode ? `
                  <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;"><strong>Referral Code:</strong></td>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${refCode}</td>
                  </tr>
                  ` : ''}
                  ${landingUrl ? `
                  <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;"><strong>Landing URL:</strong></td>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; word-break: break-all;">${landingUrl}</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;"><strong>IP Address:</strong></td>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${ip}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;"><strong>Submitted:</strong></td>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${new Date().toLocaleString()}</td>
                  </tr>
                </table>
                <div style="margin-top: 30px; padding: 20px; background: #fef2f2; border-left: 4px solid #9f1239; border-radius: 4px;">
                  <p style="margin: 0; color: #666; font-size: 14px;">
                    <strong>Next Steps:</strong> Contact this lead to convert them into an affiliate partner.
                  </p>
                </div>
              </div>
            </div>
          `
        });
        console.log('[AFFILIATE LEAD] Email sent to quotexbert@gmail.com');
      } catch (emailError) {
        console.error('[AFFILIATE LEAD] Failed to send email:', emailError);
      }
    } else {
      console.warn('[AFFILIATE LEAD] RESEND_API_KEY not configured, email not sent');
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for your interest! We'll be in touch soon."
    });

  } catch (error) {
    console.error("Affiliate lead error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process affiliate lead" },
      { status: 500 }
    );
  }
}
