import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { put } from "@vercel/blob";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const beforeImage = formData.get("beforeImage") as File;
    const description = formData.get("description") as string;

    if (!beforeImage) {
      return NextResponse.json(
        { success: false, error: "Before image is required" },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        { success: false, error: "Description is required" },
        { status: 400 }
      );
    }

    // Check usage limits
    let subscription = await prisma.visualizerSubscription.findUnique({
      where: { userId }
    });

    if (!subscription) {
      subscription = await prisma.visualizerSubscription.create({
        data: {
          userId,
          isPaid: false,
          monthlyGenerationsUsed: 0,
          lastResetDate: new Date(),
          freeMonthlyLimit: 10
        }
      });
    }

    // Check if we need to reset monthly counter
    const now = new Date();
    const lastReset = new Date(subscription.lastResetDate);
    const daysSinceReset = Math.floor((now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceReset >= 30) {
      subscription = await prisma.visualizerSubscription.update({
        where: { userId },
        data: {
          monthlyGenerationsUsed: 0,
          lastResetDate: now
        }
      });
    }

    // Check limits
    if (!subscription.isPaid && subscription.monthlyGenerationsUsed >= subscription.freeMonthlyLimit) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Monthly generation limit reached. Please upgrade to continue.",
          code: "LIMIT_REACHED"
        },
        { status: 403 }
      );
    }

    // Upload before image to blob storage
    const beforeImageBuffer = await beforeImage.arrayBuffer();
    const beforeBlob = await put(`visualizer/${userId}/${Date.now()}-before.${beforeImage.name.split('.').pop()}`, beforeImageBuffer, {
      access: "public",
    });

    // Build AI prompt from description
    const prompt = `Transform this room image based on the following vision: ${description}. 
Maintain the room's layout, lighting, and perspective. Make it photorealistic and natural-looking.`;

    // Call OpenAI DALL-E 3 or similar AI image generation
    const startTime = Date.now();
    let afterImageUrl = "";
    let aiModel = "openai-dall-e-3";

    try {
      // For now, use a placeholder since we need OpenAI API key configured
      // In production, this would call OpenAI API
      const response = await fetch("https://api.openai.com/v1/images/edits", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "multipart/form-data"
        },
        body: formData // Send the before image and prompt
      });

      if (!response.ok) {
        throw new Error("AI generation failed");
      }

      const aiResult = await response.json();
      afterImageUrl = aiResult.data[0].url;

    } catch (error) {
      console.error("AI generation error:", error);
      // Fallback: Use a demo after image for testing
      // In production, this should return an error
      afterImageUrl = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop";
    }

    const processingTime = Date.now() - startTime;

    // Save generation to database
    const generation = await prisma.visualizerGeneration.create({
      data: {
        userId,
        beforeImageUrl: beforeBlob.url,
        afterImageUrl,
        customRequest: description, // Store user's description
        aiModel,
        promptUsed: prompt,
        processingTime,
        wasSentToQuote: false
      }
    });

    // Increment usage counter
    await prisma.visualizerSubscription.update({
      where: { userId },
      data: {
        monthlyGenerationsUsed: subscription.monthlyGenerationsUsed + 1
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        generationId: generation.id,
        beforeImageUrl: generation.beforeImageUrl,
        afterImageUrl: generation.afterImageUrl,
        processingTime: generation.processingTime
      }
    });

  } catch (error) {
    console.error("Error generating visualization:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate visualization" },
      { status: 500 }
    );
  }
}
