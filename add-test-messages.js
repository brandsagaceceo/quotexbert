const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addTestMessages() {
  try {
    console.log('Adding test messages...');
    
    // Find the conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        homeownerId: 'demo-homeowner',
        contractorId: 'demo-contractor'
      }
    });
    
    if (!conversation) {
      console.log('No conversation found');
      return;
    }
    
    // Add a message from homeowner to contractor (so contractor has unread)
    await prisma.conversationMessage.create({
      data: {
        conversationId: conversation.id,
        senderId: 'demo-homeowner',
        senderRole: 'homeowner',
        receiverId: 'demo-contractor',
        receiverRole: 'contractor',
        content: 'Hi! I saw you accepted my project. When can you start?',
        type: 'text'
      }
    });
    
    // Add another message from homeowner
    await prisma.conversationMessage.create({
      data: {
        conversationId: conversation.id,
        senderId: 'demo-homeowner',
        senderRole: 'homeowner',
        receiverId: 'demo-contractor',
        receiverRole: 'contractor',
        content: 'Also, do you need any specific access to the kitchen area?',
        type: 'text'
      }
    });
    
    console.log('Added test messages');
    
    // Check unread counts for both users
    const homeownerUnread = await prisma.conversationMessage.count({
      where: {
        receiverId: 'demo-homeowner',
        readAt: null
      }
    });
    
    const contractorUnread = await prisma.conversationMessage.count({
      where: {
        receiverId: 'demo-contractor',
        readAt: null
      }
    });
    
    console.log(`Homeowner unread: ${homeownerUnread}`);
    console.log(`Contractor unread: ${contractorUnread}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addTestMessages();