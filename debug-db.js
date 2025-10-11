const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('Checking database...');
    
    const leads = await prisma.lead.findMany({
      include: {
        homeowner: true
      }
    });
    console.log('Leads:', JSON.stringify(leads, null, 2));
    
    const conversations = await prisma.conversation.findMany({
      include: {
        messages: true,
        homeowner: true,
        contractor: true
      }
    });
    console.log('Conversations:', JSON.stringify(conversations, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();