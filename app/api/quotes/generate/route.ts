import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractQuoteContextFromConversation } from "@/lib/quote-context";
import { normalizeQuoteDraft, sanitizeMoneyValue, RESIDENTIAL_CAP } from "@/lib/quote-validation";

export async function POST(request: NextRequest) {
  try {
    const { conversationId, contractorId } = await request.json();

    if (!conversationId || !contractorId) {
      return NextResponse.json(
        { error: "Conversation ID and contractor ID are required" },
        { status: 400 }
      );
    }

    // Get conversation with job details
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        job: true,
        homeowner: true,
        contractor: true,
      }
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // ── Fetch REAL chat messages from the Thread (where actual conversation lives) ──
    // ConversationMessage table is typically empty because the bridge creates Conversation
    // records on demand, but the live chat uses Thread → Message.
    const thread = await prisma.thread.findFirst({
      where: { leadId: conversation.jobId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 100,
          include: { fromUser: { select: { id: true, role: true } } },
        },
      },
    });

    const threadMessages = (thread?.messages ?? []).map(m => ({
      id: m.id,
      body: m.body,
      fromUserId: m.fromUserId,
      senderRole: m.fromUser?.role === 'contractor' ? 'contractor' : 'homeowner',
      createdAt: m.createdAt,
    }));

    // ── Extract structured context from the conversation ───────────────────
    const quoteContext = extractQuoteContextFromConversation(threadMessages, contractorId);

    // Extract project details from job
    const projectDetails = {
      title: conversation.job.title,
      description: conversation.job.description,
      category: conversation.job.category,
      budget: conversation.job.budget,
      location: conversation.job.zipCode
    };

    // Build conversation text for the AI prompt
    const conversationText = threadMessages
      .map(msg => `${msg.senderRole}: ${msg.body}`)
      .join("\n");

    // AI Analysis prompt — enriched with extracted conversation context
    const priceGuidance = quoteContext.explicitPrice
      ? `\nIMPORTANT: The contractor and homeowner have discussed a price of $${quoteContext.explicitPrice.toLocaleString()} in the conversation. Use this as the total cost basis. Do NOT invent a different price.\n`
      : quoteContext.notes
        ? `\n${quoteContext.notes}\n`
        : '';

    const analysisPrompt = `
Analyze this conversation between a homeowner and contractor about a home improvement project. Extract specific requirements, materials needed, labor estimates, and create a professional quote.

PROJECT DETAILS:
Title: ${projectDetails.title}
Description: ${projectDetails.description}
Category: ${projectDetails.category}
Budget: $${projectDetails.budget}
Location: ${projectDetails.location}
${priceGuidance}
CONVERSATION:
${conversationText || '(No conversation messages yet — use project details and budget to generate a reasonable estimate.)'}

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
      const aiResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://www.quotexbert.com'}/api/ai-estimate`, {
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
        
        // ── Fallback: prefer explicit price from conversation, then budget ──
        let estimatedTotal: number;

        if (quoteContext.explicitPrice) {
          // Use the price discussed in conversation — most reliable source
          estimatedTotal = quoteContext.explicitPrice;
        } else {
          // Fall back to budget parsing
          const budgetStr = typeof projectDetails.budget === 'string' ? projectDetails.budget : String(projectDetails.budget || '0');
          const firstNumberMatch = budgetStr.replace(/[$,\s]/g, '').match(/^(\d+(?:\.\d+)?)/);
          const rawBudgetValue = firstNumberMatch ? parseFloat(firstNumberMatch[1] ?? '0') : 0;
          const budgetValue = Math.min(rawBudgetValue, RESIDENTIAL_CAP);
          estimatedTotal = Math.max(Math.min(budgetValue * 0.9, RESIDENTIAL_CAP), 1000);
        }

        const laborCost = estimatedTotal * 0.6;
        const materialCost = estimatedTotal * 0.4;
        
        quoteData = {
          title: quoteContext.suggestedTitle !== 'Project Quote'
            ? quoteContext.suggestedTitle
            : `${projectDetails.category} Project - ${projectDetails.title}`,
          description: `Professional ${projectDetails.category.toLowerCase()} services as discussed`,
          scope: quoteContext.scopeOfWork || `Complete ${projectDetails.category.toLowerCase()} work including: ${projectDetails.description}`,
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
          aiAnalysis: quoteContext.notes || "Quote generated based on project details and conversation context",
          extractedRequirements: conversationText.substring(0, 500) + "...",
          confidenceScore: quoteContext.confidence,
        };
      }

      // ── Override AI total with explicit conversation price — ALWAYS ──
      // If the contractor said "$900" in chat, the quote must use $900.
      // No confidence gate: the contractor's stated price is the source of truth.
      if (quoteContext.explicitPrice != null) {
        const explicit = quoteContext.explicitPrice;
        quoteData.totalCost = explicit;
        quoteData.laborCost = Math.round(explicit * 0.6 * 100) / 100;
        quoteData.materialCost = Math.round(explicit * 0.4 * 100) / 100;
      }

      // ── Normalize + validate all numeric values via shared utility ──
      const normalized = normalizeQuoteDraft({
        totalCost: quoteData.totalCost,
        laborCost: quoteData.laborCost,
        materialCost: quoteData.materialCost,
        items: quoteData.items,
        scope: quoteData.scope,
      });
      quoteData.totalCost = normalized.totalCost;
      quoteData.laborCost = normalized.laborCost;
      quoteData.materialCost = normalized.materialCost;
      if (normalized.items.length > 0) {
        quoteData.items = normalized.items;
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
          conversationLength: threadMessages.length,
          extractedRequirements: quoteData.extractedRequirements,
          confidenceScore: quoteData.confidenceScore
        }
      });

    } catch (aiError) {
      console.error("AI quote generation failed:", aiError);
      
      // Create basic quote as fallback — prefer explicit conversation price, then budget.
      let estimatedTotal: number;
      if (quoteContext.explicitPrice) {
        estimatedTotal = quoteContext.explicitPrice;
      } else {
        const budgetStr2 = typeof projectDetails.budget === 'string' ? projectDetails.budget : String(projectDetails.budget || '0');
        const firstNum2 = budgetStr2.replace(/[$,\s]/g, '').match(/^(\d+(?:\.\d+)?)/);
        const rawBudget2 = firstNum2 ? parseFloat(firstNum2[1] ?? '0') : 0;
        estimatedTotal = Math.max(Math.min(rawBudget2 * 0.9, RESIDENTIAL_CAP), 1000);
      }

      // Run through normalizeQuoteDraft to prevent absurd values
      const fallbackNorm = normalizeQuoteDraft({
        totalCost: estimatedTotal,
        laborCost: estimatedTotal * 0.6,
        materialCost: estimatedTotal * 0.4,
        items: [],
        scope: projectDetails.description || '',
      });

      const quote = await prisma.quote.create({
        data: {
          conversationId,
          jobId: conversation.job.id,
          contractorId,
          title: `${projectDetails.category} Project Quote`,
          description: `Professional quote for ${projectDetails.title}`,
          scope: quoteContext.scopeOfWork || `Complete ${projectDetails.category.toLowerCase()} work as discussed`,
          laborCost: fallbackNorm.laborCost,
          materialCost: fallbackNorm.materialCost,
          totalCost: fallbackNorm.totalCost,
          aiAnalysis: "Basic quote generated - AI service unavailable",
          extractedRequirements: quoteContext.notes || "Manual review required",
          confidenceScore: quoteContext.confidence,
          status: "draft"
        }
      });

      return NextResponse.json({
        success: true,
        quote: { ...quote, items: [] },
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
