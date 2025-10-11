import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { conversationId, contractorId } = await request.json();

    if (!conversationId || !contractorId) {
      return NextResponse.json(
        { error: "Conversation ID and contractor ID are required" },
        { status: 400 }
      );
    }

    // Get conversation with messages and job details
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        job: true,
        homeowner: true,
        contractor: true,
        messages: {
          orderBy: { createdAt: "asc" },
          where: {
            type: "text" // Only analyze text messages
          }
        }
      }
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Extract project details from job and conversation
    const projectDetails = {
      title: conversation.job.title,
      description: conversation.job.description,
      category: conversation.job.category,
      budget: conversation.job.budget,
      location: conversation.job.zipCode
    };

    // Analyze conversation messages to extract requirements
    const conversationText = conversation.messages
      .map(msg => `${msg.senderRole}: ${msg.content}`)
      .join("\n");

    // AI Analysis prompt
    const analysisPrompt = `
Analyze this conversation between a homeowner and contractor about a home improvement project. Extract specific requirements, materials needed, labor estimates, and create a professional quote.

PROJECT DETAILS:
Title: ${projectDetails.title}
Description: ${projectDetails.description}
Category: ${projectDetails.category}
Budget: $${projectDetails.budget}
Location: ${projectDetails.location}

CONVERSATION:
${conversationText}

Based on this information, generate a professional quote with:
1. Detailed scope of work
2. Labor cost estimate
3. Material cost estimate
4. Itemized breakdown
5. Total cost

Respond in JSON format:
{
  "title": "Project title",
  "description": "Professional description",
  "scope": "Detailed scope of work",
  "laborCost": number,
  "materialCost": number,
  "totalCost": number,
  "items": [
    {
      "category": "labor|materials|permits|other",
      "description": "Item description",
      "quantity": number,
      "unitPrice": number,
      "totalPrice": number,
      "notes": "Additional notes"
    }
  ],
  "aiAnalysis": "Summary of conversation analysis",
  "extractedRequirements": "Key requirements from conversation",
  "confidenceScore": number (0-1)
}
`;

    try {
      // Call AI service (using the same endpoint as other AI features)
      const aiResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ai-estimate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: analysisPrompt,
          hasVoice: 'false',
          imageCount: '0',
          isQuoteGeneration: true
        })
      });

      if (!aiResponse.ok) {
        throw new Error('AI service failed');
      }

      const aiResult = await aiResponse.json();
      
      // Parse AI response or create fallback quote
      let quoteData;
      try {
        // Try to parse AI response as JSON
        const aiText = aiResult.estimate || aiResult.response || '';
        const jsonMatch = aiText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          quoteData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in AI response');
        }
      } catch (parseError) {
        console.warn('Failed to parse AI response, creating fallback quote:', parseError);
        
        // Create fallback quote based on project details
        const budgetValue = typeof projectDetails.budget === 'string' 
          ? parseFloat((projectDetails.budget as string).replace(/[^0-9.]/g, '') || '0')
          : (projectDetails.budget as number) || 0;
        const estimatedTotal = Math.max(budgetValue * 0.8, 1000);
        const laborCost = estimatedTotal * 0.6;
        const materialCost = estimatedTotal * 0.4;
        
        quoteData = {
          title: `${projectDetails.category} Project - ${projectDetails.title}`,
          description: `Professional ${projectDetails.category.toLowerCase()} services as discussed`,
          scope: `Complete ${projectDetails.category.toLowerCase()} work including: ${projectDetails.description}`,
          laborCost,
          materialCost,
          totalCost: estimatedTotal,
          items: [
            {
              category: "labor",
              description: `Professional ${projectDetails.category.toLowerCase()} labor`,
              quantity: 1,
              unitPrice: laborCost,
              totalPrice: laborCost,
              notes: "Includes all labor and installation"
            },
            {
              category: "materials",
              description: `Materials and supplies for ${projectDetails.category.toLowerCase()}`,
              quantity: 1,
              unitPrice: materialCost,
              totalPrice: materialCost,
              notes: "Quality materials included"
            }
          ],
          aiAnalysis: "Quote generated based on project details and conversation context",
          extractedRequirements: conversationText.substring(0, 500) + "...",
          confidenceScore: 0.75
        };
      }

      // Create quote in database
      const quote = await prisma.quote.create({
        data: {
          conversationId,
          jobId: conversation.job.id,
          contractorId,
          title: quoteData.title,
          description: quoteData.description,
          scope: quoteData.scope,
          laborCost: quoteData.laborCost,
          materialCost: quoteData.materialCost,
          totalCost: quoteData.totalCost,
          aiAnalysis: quoteData.aiAnalysis,
          extractedRequirements: quoteData.extractedRequirements,
          confidenceScore: quoteData.confidenceScore || 0.8,
          status: "draft"
        }
      });

      // Create quote items
      if (quoteData.items && quoteData.items.length > 0) {
        await prisma.quoteItem.createMany({
          data: quoteData.items.map((item: any) => ({
            quoteId: quote.id,
            category: item.category || "other",
            description: item.description,
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice || 0,
            totalPrice: item.totalPrice || 0,
            notes: item.notes
          }))
        });
      }

      // Send notification to contractor
      await prisma.notification.create({
        data: {
          userId: contractorId,
          type: "quote_generated",
          title: "AI Quote Generated",
          message: `AI has generated a quote for "${conversation.job.title}". Review and edit before sending to homeowner.`,
          relatedId: quote.id,
          relatedType: "quote"
        }
      });

      // Get complete quote with items
      const completeQuote = await prisma.quote.findUnique({
        where: { id: quote.id },
        include: {
          items: true,
          conversation: {
            include: {
              job: true,
              homeowner: true,
              contractor: true
            }
          }
        }
      });

      return NextResponse.json({
        success: true,
        quote: completeQuote,
        analysis: {
          conversationLength: conversation.messages.length,
          extractedRequirements: quoteData.extractedRequirements,
          confidenceScore: quoteData.confidenceScore
        }
      });

    } catch (aiError) {
      console.error("AI quote generation failed:", aiError);
      
      // Create basic quote as fallback
      const budgetValue = typeof projectDetails.budget === 'string' 
        ? parseFloat((projectDetails.budget as string).replace(/[^0-9.]/g, '') || '0')
        : (projectDetails.budget as number) || 0;
      const estimatedTotal = Math.max(budgetValue * 0.8, 1000);
      const quote = await prisma.quote.create({
        data: {
          conversationId,
          jobId: conversation.job.id,
          contractorId,
          title: `${projectDetails.category} Project Quote`,
          description: `Professional quote for ${projectDetails.title}`,
          scope: `Complete ${projectDetails.category.toLowerCase()} work as discussed`,
          laborCost: estimatedTotal * 0.6,
          materialCost: estimatedTotal * 0.4,
          totalCost: estimatedTotal,
          aiAnalysis: "Basic quote generated - AI service unavailable",
          extractedRequirements: "Manual review required",
          confidenceScore: 0.5,
          status: "draft"
        }
      });

      return NextResponse.json({
        success: true,
        quote,
        fallback: true,
        message: "Basic quote generated - please review and customize"
      });
    }

  } catch (error) {
    console.error("Error generating AI quote:", error);
    return NextResponse.json(
      { error: "Failed to generate quote" },
      { status: 500 }
    );
  }
}
