import { NextRequest, NextResponse } from "next/server";
import { createCommentSchema } from "@/lib/validation/schemas";
import { logEventServer } from "@/lib/analytics";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    const body = await request.json();
    
    // Validate input
    const validatedData = createCommentSchema.parse({
      ...body,
      jobId,
    });

    // Create the comment (you'll need to add a Comment model to your schema)
    // For now, we'll just log the analytics event
    
    // Log analytics event
    await logEventServer(
      "job_comment_created", 
      validatedData.userId,
      {
        jobId: validatedData.jobId,
        commentLength: validatedData.content.length,
      }
    );

    return NextResponse.json({
      success: true,
      message: "Comment created successfully",
    });
  } catch (error) {
    console.error("Error creating job comment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
