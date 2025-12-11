import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.trim()) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Send email notification to quotexpert@gmail.com
    // In production, integrate with an email service like SendGrid, Resend, or AWS SES
    
    // For now, we'll just log it and return success
    console.log(`[AFFILIATE SIGNUP] New affiliate signup: ${email}`);
    
    // TODO: Integrate with email service
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'noreply@quotexbert.com',
    //   to: 'quotexpert@gmail.com',
    //   subject: 'New Affiliate Program Signup',
    //   html: `<p>New affiliate signup from: ${email}</p>`
    // });

    // Store in database (you can add this to your Prisma schema)
    // await prisma.affiliateSignup.create({
    //   data: { email, createdAt: new Date() }
    // });

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
