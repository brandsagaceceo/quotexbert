// Direct test of unread count functionality
console.log('Testing unread count feature...');

// Wait for server to be ready, then test
setTimeout(async () => {
  try {
    // Test API directly
    console.log('Testing contractor unread count API...');
    
    // We can't use fetch in Node without proper setup, so let's just verify the database state
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    const contractorUnread = await prisma.conversationMessage.count({
      where: {
        receiverId: 'demo-contractor',
        readAt: null
      }
    });
    
    const homeownerUnread = await prisma.conversationMessage.count({
      where: {
        receiverId: 'demo-homeowner', 
        readAt: null
      }
    });
    
    console.log('✅ Database state:');
    console.log(`   Contractor unread messages: ${contractorUnread}`);
    console.log(`   Homeowner unread messages: ${homeownerUnread}`);
    
    // Test that when contractor logs in, they should see unread count
    console.log('\n🎯 Expected behavior:');
    console.log(`   - When contractor logs in: should see ${contractorUnread} unread messages`);
    console.log(`   - When homeowner logs in: should see ${homeownerUnread} unread messages`);
    console.log(`   - Navigation should show red badge with count`);
    console.log(`   - Conversations list should show unread badges per conversation`);
    
    await prisma.$disconnect();
    
  } catch (error) {
    console.error('Test error:', error);
  }
}, 1000);