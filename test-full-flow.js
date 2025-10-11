const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestJob() {
  try {
    console.log('Creating test job...');
    
    // Create a new test job
    const newLead = await prisma.lead.create({
      data: {
        title: "Test Kitchen Plumbing",
        description: "Need to fix kitchen sink and replace faucet. Budget around $300-400.",
        budget: 350,
        zipCode: "90210",
        category: "plumbing",
        homeownerId: "demo-homeowner",
        status: "open",
        claimed: false,
        published: true
      }
    });
    
    console.log('Created test job:', newLead);
    
    // Now test accepting it
    const response = await fetch('http://localhost:3000/api/jobs/' + newLead.id + '/accept', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contractorId: 'demo-contractor' })
    });
    
    const result = await response.json();
    console.log('Acceptance result:', result);
    
    // Check conversations after acceptance
    const conversations = await prisma.conversation.findMany({
      include: {
        messages: true,
        homeowner: true,
        contractor: true
      }
    });
    console.log('Conversations after acceptance:', JSON.stringify(conversations, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestJob();