const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testConversationsAPI() {
  try {
    console.log('Testing conversations API...');
    
    // Test the API endpoint
    const response = await fetch('http://localhost:3000/api/conversations?userId=demo-contractor');
    
    if (!response.ok) {
      console.log('API Response not OK:', response.status, response.statusText);
      const text = await response.text();
      console.log('Response text:', text);
      return;
    }
    
    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
    
    // Also test the message endpoint
    if (data.length > 0) {
      const conversationId = data[0].id;
      console.log('Testing messages for conversation:', conversationId);
      
      const messageResponse = await fetch(`http://localhost:3000/api/conversations/${conversationId}/messages`);
      const messageData = await messageResponse.json();
      console.log('Messages:', JSON.stringify(messageData, null, 2));
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConversationsAPI();