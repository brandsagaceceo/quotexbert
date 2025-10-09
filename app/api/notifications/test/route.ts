import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { notifications } from "@/lib/notifications";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type } = await request.json();

    let result;

    switch (type) {
      case "welcome":
        result = await notifications.welcome(userId, { firstName: "Test User" });
        break;
      
      case "payment_received":
        result = await notifications.paymentReceived(userId, {
          amount: 15.00,
          leadId: "test-lead-id",
          title: "Kitchen Renovation"
        });
        break;
      
      case "new_message":
        result = await notifications.newMessage(userId, {
          messageId: "test-message-id",
          title: "Kitchen Project",
          message: "Hello! I'm interested in your kitchen renovation project. When would be a good time to discuss the details?",
          senderName: "John's Contracting"
        });
        break;
      
      case "job_claimed":
        result = await notifications.jobClaimed(userId, {
          leadId: "test-lead-id",
          title: "Bathroom Renovation",
          contractorName: "Smith Construction"
        });
        break;
      
      case "lead_matched":
        result = await notifications.leadMatched(userId, {
          leadId: "test-lead-id",
          title: "Kitchen Cabinets",
          location: "Toronto, ON"
        });
        break;
      
      default:
        return NextResponse.json({ error: "Invalid notification type" }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `${type} notification sent successfully`,
      notification: result 
    });
  } catch (error) {
    console.error("Error sending test notification:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}