const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestQuote() {
  try {
    console.log('Creating test quote for homeowner...');
    
    // Find the conversation and job
    const conversation = await prisma.conversation.findFirst({
      where: {
        homeownerId: 'demo-homeowner',
        contractorId: 'demo-contractor'
      },
      include: {
        job: true
      }
    });
    
    if (!conversation) {
      console.log('No conversation found');
      return;
    }
    
    console.log('Found conversation for job:', conversation.job.title);
    
    // Create a comprehensive quote
    const quote = await prisma.quote.create({
      data: {
        conversationId: conversation.id,
        jobId: conversation.jobId,
        contractorId: 'demo-contractor',
        title: 'Professional Kitchen Plumbing Service',
        description: 'Complete kitchen sink repair and faucet replacement with high-quality materials and professional installation.',
        scope: `Detailed Scope of Work:

1. Kitchen Sink Repair:
   - Inspect and diagnose existing plumbing issues
   - Replace worn gaskets and seals
   - Fix any leaks in supply lines
   - Test water pressure and flow

2. Faucet Replacement:
   - Remove old faucet completely
   - Install new high-quality faucet with modern features
   - Connect hot and cold water lines
   - Test all functions including spray nozzle

3. Additional Services:
   - Clean up all work areas
   - Dispose of old materials properly
   - Provide 1-year warranty on installation
   - Final inspection and testing

Materials included: Premium faucet, new supply lines, gaskets, mounting hardware, and all necessary fittings.`,
        laborCost: 200,
        materialCost: 150,
        totalCost: 350,
        status: 'sent',
        sentAt: new Date(),
        aiAnalysis: 'Based on the conversation, the homeowner needs a reliable solution for their kitchen plumbing. The scope includes both repair work and a complete faucet upgrade. The pricing is competitive for the local market and includes quality materials.',
        confidenceScore: 0.92,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      }
    });
    
    // Create detailed quote items
    const items = await prisma.quoteItem.createMany({
      data: [
        {
          quoteId: quote.id,
          category: 'labor',
          description: 'Plumbing repair and installation services',
          quantity: 4,
          unitPrice: 50,
          totalPrice: 200,
          notes: 'Includes diagnostic, repair, and installation time'
        },
        {
          quoteId: quote.id,
          category: 'materials',
          description: 'Premium kitchen faucet with spray function',
          quantity: 1,
          unitPrice: 120,
          totalPrice: 120,
          notes: 'Moen or Kohler brand, brushed nickel finish'
        },
        {
          quoteId: quote.id,
          category: 'materials',
          description: 'Supply lines and installation hardware',
          quantity: 1,
          unitPrice: 30,
          totalPrice: 30,
          notes: 'Braided stainless steel lines, mounting kit'
        }
      ]
    });
    
    console.log('✅ Created test quote:');
    console.log(`   Quote ID: ${quote.id}`);
    console.log(`   Title: ${quote.title}`);
    console.log(`   Total Cost: $${quote.totalCost}`);
    console.log(`   Status: ${quote.status}`);
    console.log(`   Items created: ${items.count}`);
    
    // Create notification for homeowner
    await prisma.notification.create({
      data: {
        userId: 'demo-homeowner',
        type: 'QUOTE_RECEIVED',
        title: 'New Quote Received!',
        message: `You've received a quote for "${conversation.job.title}" from Demo Contractor. Total: $${quote.totalCost}`,
        relatedId: quote.id,
        relatedType: 'quote'
      }
    });
    
    console.log('✅ Created notification for homeowner');
    
  } catch (error) {
    console.error('Error creating test quote:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestQuote();