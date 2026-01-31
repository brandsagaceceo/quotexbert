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

    // Call OpenAI DALL-E 3 for image generation
    const startTime = Date.now();
    let afterImageUrl = "";
    let aiModel = "dall-e-3";

    try {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error("OpenAI API key not configured");
      }

      // DALL-E 3 generates images from text prompts only
      // Since we need to edit an existing image, we'll describe what the room should look like
      const detailedPrompt = `A photorealistic interior design rendering showing: ${description}. 
Professional photography, natural lighting, modern home interior, high quality, detailed.`;

      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: detailedPrompt,
          n: 1,
          size: "1024x1024",
          quality: "standard"
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenAI API error:", errorData);
        throw new Error(`AI generation failed: ${errorData.error?.message || 'Unknown error'}`);
      }

      const aiResult = await response.json();
      afterImageUrl = aiResult.data[0].url;

    } catch (error) {
      console.error("AI generation error:", error);
      // Return error to user instead of using fallback
      return NextResponse.json(
        { 
          success: false, 
          error: error instanceof Error ? error.message : "AI generation failed. Please try again." 
        },
        { status: 500 }
      );
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
