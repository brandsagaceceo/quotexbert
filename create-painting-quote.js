const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createSecondQuote() {
  try {
    console.log('Creating second test quote...');
    
    // Check if we have the painting job
    const paintingJob = await prisma.lead.findFirst({
      where: {
        title: 'Painting',
        homeownerId: 'demo-homeowner'
      }
    });
    
    if (!paintingJob) {
      console.log('Painting job not found');
      return;
    }
    
    // Create conversation for painting job if it doesn't exist
    let conversation = await prisma.conversation.findFirst({
      where: {
        jobId: paintingJob.id,
        homeownerId: 'demo-homeowner',
        contractorId: 'demo-contractor'
      }
    });
    
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          jobId: paintingJob.id,
          homeownerId: 'demo-homeowner',
          contractorId: 'demo-contractor',
          status: 'active'
        }
      });
      console.log('Created conversation for painting job');
    }
    
    // Create a painting quote
    const quote = await prisma.quote.create({
      data: {
        conversationId: conversation.id,
        jobId: paintingJob.id,
        contractorId: 'demo-contractor',
        title: 'Professional Interior Painting Service',
        description: 'Complete interior painting for 700 square feet including preparation, premium paint, and clean-up.',
        scope: `Comprehensive Painting Package:

1. Surface Preparation:
   - Fill holes and cracks with high-quality filler
   - Sand rough surfaces smooth
   - Prime all surfaces for optimal paint adhesion
   - Protect floors and furniture with drop cloths

2. Professional Painting:
   - Apply two coats of premium interior paint
   - Use high-quality brushes and rollers for smooth finish
   - Careful cutting around trim and fixtures
   - Color-matched paint for consistent coverage

3. Clean-Up & Final Touches:
   - Remove all masking tape and protective materials
   - Clean all tools and work areas
   - Final walkthrough and touch-ups
   - Dispose of paint cans responsibly

All work includes a 2-year warranty on labor and paint quality.`,
        laborCost: 1400,
        materialCost: 700,
        totalCost: 2100,
        status: 'sent',
        sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        aiAnalysis: 'Large painting project requiring extensive preparation and premium materials. Pricing reflects the size and complexity of the work. Customer emphasized quality over speed.',
        confidenceScore: 0.89,
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
      }
    });
    
    // Create detailed quote items for painting
    await prisma.quoteItem.createMany({
      data: [
        {
          quoteId: quote.id,
          category: 'labor',
          description: 'Surface preparation and priming',
          quantity: 700,
          unitPrice: 1.50,
          totalPrice: 1050,
          notes: 'Includes filling, sanding, and primer application'
        },
        {
          quoteId: quote.id,
          category: 'labor',
          description: 'Professional painting application',
          quantity: 700,
          unitPrice: 0.50,
          totalPrice: 350,
          notes: 'Two coats of premium paint, cutting and rolling'
        },
        {
          quoteId: quote.id,
          category: 'materials',
          description: 'Premium interior paint',
          quantity: 3,
          unitPrice: 75,
          totalPrice: 225,
          notes: 'Sherwin Williams ProClassic, eggshell finish'
        },
        {
          quoteId: quote.id,
          category: 'materials',
          description: 'Primer and prep materials',
          quantity: 1,
          unitPrice: 150,
          totalPrice: 150,
          notes: 'Primer, filler, sandpaper, brushes, rollers'
        },
        {
          quoteId: quote.id,
          category: 'materials',
          description: 'Drop cloths and protective materials',
          quantity: 1,
          unitPrice: 75,
          totalPrice: 75,
          notes: 'Canvas drop cloths, plastic sheeting, tape'
        },
        {
          quoteId: quote.id,
          category: 'other',
          description: 'Cleanup and disposal',
          quantity: 1,
          unitPrice: 250,
          totalPrice: 250,
          notes: 'Complete cleanup and material disposal'
        }
      ]
    });
    
    console.log('✅ Created painting quote:');
    console.log(`   Quote ID: ${quote.id}`);
    console.log(`   Title: ${quote.title}`);
    console.log(`   Total Cost: $${quote.totalCost}`);
    console.log(`   Status: ${quote.status}`);
    
  } catch (error) {
    console.error('Error creating painting quote:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSecondQuote();