const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('🧪 Testing Database Connection...');
    
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Check job leads
    const leadCount = await prisma.lead.count();
    console.log(`✅ Job Leads: ${leadCount} found`);
    
    // Check users
    const userCount = await prisma.user.count();
    console.log(`✅ Users: ${userCount} found`);
    
    // Check subscriptions
    const subCount = await prisma.contractorSubscription.count();
    console.log(`✅ Subscriptions: ${subCount} found`);
    
    // Check recent leads
    const recentLeads = await prisma.lead.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        title: true,
        category: true,
        budget: true,
        zipCode: true
      }
    });
    
    console.log('\n📋 Sample Recent Leads:');
    recentLeads.forEach((lead, index) => {
      console.log(`${index + 1}. ${lead.title} - ${lead.category} - ${lead.budget} - ${lead.zipCode}`);
    });
    
    console.log('\n🎉 All systems operational!');
    
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();