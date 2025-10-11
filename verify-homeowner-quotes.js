const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyHomeownerQuotes() {
  try {
    console.log('🔍 Verifying homeowner quote interface...\n');
    
    // Check quotes for demo-homeowner
    const quotes = await prisma.quote.findMany({
      where: {
        job: {
          homeownerId: 'demo-homeowner'
        }
      },
      include: {
        job: {
          select: {
            title: true,
            budget: true
          }
        },
        contractor: {
          select: {
            name: true,
            contractorProfile: {
              select: {
                companyName: true
              }
            }
          }
        },
        items: true
      }
    });
    
    console.log(`✅ Found ${quotes.length} quotes for demo-homeowner:\n`);
    
    quotes.forEach((quote, index) => {
      console.log(`${index + 1}. ${quote.title}`);
      console.log(`   Project: ${quote.job.title}`);
      console.log(`   Contractor: ${quote.contractor.contractorProfile?.companyName || quote.contractor.name}`);
      console.log(`   Total Cost: $${quote.totalCost.toLocaleString()}`);
      console.log(`   Status: ${quote.status.toUpperCase()}`);
      console.log(`   Items: ${quote.items.length} line items`);
      console.log(`   Sent: ${quote.sentAt ? new Date(quote.sentAt).toLocaleDateString() : 'Not sent'}`);
      console.log('');
    });
    
    // Check notifications for homeowner
    const notifications = await prisma.notification.findMany({
      where: {
        userId: 'demo-homeowner',
        type: 'QUOTE_RECEIVED'
      }
    });
    
    console.log(`✅ Found ${notifications.length} quote notifications for homeowner\n`);
    
    console.log('🎯 Expected homeowner experience:');
    console.log('   - Login as demo-homeowner');
    console.log('   - See "My Quotes" link in navigation');
    console.log('   - View 2 quotes: Kitchen Plumbing ($350) and Painting ($2100)');
    console.log('   - Click "View Details" to see full breakdown');
    console.log('   - Accept or reject quotes');
    console.log('   - See status updates and contractor info');
    
    console.log('\n📍 Test URLs:');
    console.log('   - Demo Login: http://localhost:3000/demo-login');
    console.log('   - Homeowner Quotes: http://localhost:3000/homeowner/quotes');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyHomeownerQuotes();