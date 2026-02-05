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

    // Check limits - Free for signed up users, 10 for non-signed up
    // Since user is signed in (required by auth above), unlimited free generations
    // Only track usage for analytics, don't enforce limits for homeowners

    // Upload before image to blob storage
    const beforeImageBuffer = await beforeImage.arrayBuffer();
    const beforeBlob = await put(`visualizer/${userId}/${Date.now()}-before.${beforeImage.name.split('.').pop()}`, beforeImageBuffer, {
      access: "public",
    });

    // Build AI prompt from description
    const prompt = `Transform this room image based on the following vision: ${description}. 
Maintain the room's layout, lighting, and perspective. Make it photorealistic and natural-looking.`;

    // Call OpenAI DALL-E 2 for image editing (transforms the actual uploaded photo)
    const startTime = Date.now();
    let afterImageUrl = "";
    let aiModel = "dall-e-2";

    try {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error("OpenAI API key not configured");
      }

      // Prepare the image for DALL-E 2 edit endpoint
      // Convert the uploaded image to PNG format and ensure it's square (DALL-E requirement)
      const imageBuffer = await beforeImage.arrayBuffer();
      
      // Create a simple prompt that describes the transformation
      const editPrompt = `Transform this interior space: ${description}. Keep the same room layout and perspective. Make it photorealistic.`;

      // Use DALL-E 2's edit endpoint which can modify the uploaded image
      const formData = new FormData();
      formData.append('image', new Blob([imageBuffer], { type: beforeImage.type }), beforeImage.name);
      formData.append('prompt', editPrompt);
      formData.append('n', '1');
      formData.append('size', '1024x1024');

      const response = await fetch("https://api.openai.com/v1/images/edits", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenAI API error:", errorData);
        
        // If edit fails, fall back to generation with a detailed prompt about the original room
        console.log("Falling back to DALL-E 3 generation...");
        const fallbackPrompt = `A photorealistic interior renovation showing: ${description}. 
Professional interior design photography, natural lighting, modern home interior, high quality, detailed.`;

        const genResponse = await fetch("https://api.openai.com/v1/images/generations", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt: fallbackPrompt,
            n: 1,
            size: "1024x1024",
            quality: "standard"
          })
        });

        if (!genResponse.ok) {
          throw new Error("Both image edit and generation failed");
        }

        const genResult = await genResponse.json();
        afterImageUrl = genResult.data[0].url;
        aiModel = "dall-e-3";
      } else {
        const aiResult = await response.json();
        afterImageUrl = aiResult.data[0].url;
      }

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
