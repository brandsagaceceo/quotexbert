import { NextRequest, NextResponse } from "next/server";
import { buildEmail, sendSharedEmail } from "@/lib/email";

const SUPPORT_EMAIL = "quotexbert@gmail.com";

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

    const submittedAt = new Date().toLocaleString("en-CA", { timeZone: "America/Toronto" });
    const html = buildEmail("New Support Request", [
      { type: "tag", content: "Contact Form" },
      { type: "heading", content: "New Support Request" },
      { type: "card", label: "Request Details", rawHtml: true, content: `<strong>Name:</strong> ${escHtml(name)}<br><strong>Email:</strong> <a href="mailto:${escHtml(email)}" style="color:#9f1239;font-weight:700;text-decoration:none;">${escHtml(email)}</a><br><strong>Subject:</strong> ${escHtml(subjectLabel)}<br><strong>Submitted:</strong> ${escHtml(submittedAt)} ET` },
      { type: "card", label: "Message", content: message },
    ]);

    const result = await sendSharedEmail({
      to: SUPPORT_EMAIL,
      replyTo: email,
      subject: `[QuoteXbert Support] ${subjectLabel} — from ${name}`,
      html,
    });

    if (!result.success) {
      console.warn("[CONTACT] Email service unavailable — contact form submission logged only:", { name, email, subject });
      return NextResponse.json({ success: true });
    }

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
