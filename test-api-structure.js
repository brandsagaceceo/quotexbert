const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testAPIResponseStructure() {
  try {
    console.log('Testing API response structure...');
    
    // Test what the API actually returns
    const response = await fetch('http://localhost:3000/api/conversations?userId=demo-contractor');
    const data = await response.json();
    
    if (data.length > 0) {
      const firstConversation = data[0];
      console.log('First conversation structure:');
      console.log('- id:', firstConversation.id);
      console.log('- jobId:', firstConversation.jobId);
      console.log('- job:', firstConversation.job);
      console.log('- otherParticipant:', firstConversation.otherParticipant);
      console.log('- lastMessage structure:');
      if (firstConversation.lastMessage) {
        console.log('  - id:', firstConversation.lastMessage.id);
        console.log('  - content:', firstConversation.lastMessage.content.substring(0, 50) + '...');
        console.log('  - createdAt:', firstConversation.lastMessage.createdAt);
        console.log('  - sender:', firstConversation.lastMessage.sender);
        console.log('  - senderId:', firstConversation.lastMessage.senderId);
        console.log('  - senderRole:', firstConversation.lastMessage.senderRole);
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAPIResponseStructure();