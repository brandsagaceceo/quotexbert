const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateDemoUserNames() {
  try {
    console.log('Updating demo user names...');
    
    // Update homeowner name
    await prisma.user.update({
      where: { id: 'demo-homeowner' },
      data: { name: 'Demo Homeowner' }
    });
    
    // Update contractor name
    await prisma.user.update({
      where: { id: 'demo-contractor' },
      data: { name: 'Demo Contractor' }
    });
    
    console.log('Updated demo user names');
    
    // Test the API again
    const response = await fetch('http://localhost:3000/api/conversations?userId=demo-contractor');
    const data = await response.json();
    
    if (data.length > 0) {
      console.log('Updated conversation data:');
      console.log('- otherParticipant:', data[0].otherParticipant);
      console.log('- lastMessage sender:', data[0].lastMessage?.sender);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateDemoUserNames();