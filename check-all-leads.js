const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAllLeads() {
  try {
    console.log('Checking all leads...');
    
    const leads = await prisma.lead.findMany({
      include: {
        homeowner: true
      }
    });
    
    console.log('All leads:');
    leads.forEach(lead => {
      console.log(`- ${lead.title}: Budget ${lead.budget}, Status: ${lead.status}, Accepted: ${lead.claimed}`);
    });
    
    // Let's also check if there are any notifications
    const notifications = await prisma.notification.findMany();
    console.log('Notifications:', notifications.length);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAllLeads();