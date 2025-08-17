import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Simple waitlist storage - in production, you'd use a proper database
const waitlist: string[] = [];

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 },
      );
    }

    // Check if email already exists
    if (waitlist.includes(email.toLowerCase())) {
      return NextResponse.json(
        { message: "You are already on the waitlist!" },
        { status: 200 },
      );
    }

    // Add to waitlist
    waitlist.push(email.toLowerCase());

    // In production, you'd save to database and send confirmation email
    console.log(`New waitlist signup: ${email}`);
    console.log(`Total waitlist size: ${waitlist.length}`);

    return NextResponse.json({
      message: "Successfully joined the waitlist!",
      position: waitlist.length,
    });
  } catch (error) {
    console.error("Error adding to waitlist:", error);
    return NextResponse.json(
      { error: "Failed to join waitlist" },
      { status: 500 },
    );
  }
}

export async function GET() {
  // Admin endpoint to view waitlist size
  return NextResponse.json({ count: waitlist.length });
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
