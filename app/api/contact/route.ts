import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const SUPPORT_EMAIL = "quotexbert@gmail.com";
const FROM_EMAIL = process.env.MAIL_FROM || "Quotexbert <no-reply@quotexbert.com>";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    const subjectLabels: Record<string, string> = {
      estimate: "Help with Estimates",
      contractor: "Contractor Questions",
      billing: "Billing Support",
      technical: "Technical Issues",
      general: "General Inquiry",
    };
    const subjectLabel = subjectLabels[subject] || subject;

    const html = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #9f1239 0%, #ea580c 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0;">New Support Request</h1>
              <p style="margin: 8px 0 0 0; opacity: 0.9;">QuoteXbert Contact Form</p>
            </div>
            <div style="padding: 30px; background: #f9fafb; border-radius: 0 0 10px 10px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 120px;">Name</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Email</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${email}" style="color: #9f1239;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Subject</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${subjectLabel}</td>
                </tr>
              </table>
              <div style="margin-top: 20px;">
                <p style="font-weight: bold; margin-bottom: 8px;">Message:</p>
                <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #9f1239; white-space: pre-wrap;">${message}</div>
              </div>
              <p style="margin-top: 20px; color: #6b7280; font-size: 13px;">Submitted on ${new Date().toLocaleString("en-CA", { timeZone: "America/Toronto" })} ET</p>
            </div>
          </div>
        </body>
      </html>
    `;

    if (!resend) {
      console.warn("[CONTACT] RESEND_API_KEY not configured — contact form submission logged only:", { name, email, subject });
      return NextResponse.json({ success: true });
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to: SUPPORT_EMAIL,
      replyTo: email,
      subject: `[QuoteXbert Support] ${subjectLabel} — from ${name}`,
      html,
    });

    console.log(`[CONTACT] Support request sent from ${email} — subject: ${subjectLabel}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CONTACT] Failed to process contact form:", error);
    return NextResponse.json(
      { error: "Failed to send your message. Please email us directly at quotexbert@gmail.com." },
      { status: 500 }
    );
  }
}
