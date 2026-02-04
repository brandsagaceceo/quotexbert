import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.trim()) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    console.log(`[AFFILIATE SIGNUP] New affiliate signup: ${email}`);
    
    // Send email notification to quotexbert@gmail.com
    if (resend) {
      try {
        await resend.emails.send({
          from: 'QuoteXbert <no-reply@quotexbert.com>',
          to: 'quotexbert@gmail.com',
          subject: '🎉 New Affiliate Program Signup',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #dc2626;">New Affiliate Signup!</h2>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Signed up:</strong> ${new Date().toLocaleString()}</p>
              <hr style="margin: 20px 0;">
              <p style="color: #666; font-size: 14px;">Log in to the admin panel to approve this affiliate.</p>
            </div>
          `
        });
        console.log('[AFFILIATE SIGNUP] Email sent to quotexbert@gmail.com');
      } catch (emailError) {
        console.error('[AFFILIATE SIGNUP] Failed to send email:', emailError);
      }
    } else {
      console.warn('[AFFILIATE SIGNUP] RESEND_API_KEY not configured, email not sent');
    }

    return NextResponse.json({
      success: true,
      message: "Successfully joined the affiliate program"
    });

  } catch (error) {
    console.error("Affiliate signup error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process affiliate signup" },
      { status: 500 }
    );
  }
}
