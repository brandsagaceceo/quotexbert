const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testUnreadMessageCount() {
  try {
    console.log('Testing unread message count...');
    
    // First, check current message status
    const messages = await prisma.conversationMessage.findMany({
      where: {
        receiverId: 'demo-homeowner'
      },
      select: {
        id: true,
        content: true,
        senderId: true,
        receiverId: true,
        readAt: true,
        createdAt: true
      }
    });
    
    console.log('Messages for demo-homeowner:');
    messages.forEach(msg => {
      console.log(`- From ${msg.senderId}: "${msg.content.substring(0, 50)}..." - Read: ${msg.readAt ? 'Yes' : 'No'}`);
    });
    
    // Test the API
    const response = await fetch('http://localhost:3000/api/messages/unread-count?userId=demo-homeowner');
    const data = await response.json();
    console.log('API Response:', data);
    
    // Also test for contractor
    const contractorResponse = await fetch('http://localhost:3000/api/messages/unread-count?userId=demo-contractor');
    const contractorData = await contractorResponse.json();
    console.log('Contractor API Response:', contractorData);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testUnreadMessageCount();