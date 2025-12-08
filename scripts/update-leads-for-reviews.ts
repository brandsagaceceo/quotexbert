import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateLeadsForReviews() {
  console.log('📝 Assigning leads to contractors and marking as ACCEPTED...');

  try {
    // Get all contractors
    const contractors = await prisma.user.findMany({
      where: { role: 'contractor' }
    });

    // Get all open leads
    const leads = await prisma.lead.findMany({
      where: { status: { in: ['open', 'OPEN', 'draft'] } }
    });

    let updatedCount = 0;

    // Randomly assign leads to contractors
    for (const lead of leads) {
      if (Math.random() > 0.3) { // 70% chance to assign
        const randomContractor = contractors[Math.floor(Math.random() * contractors.length)];
        
        await prisma.lead.update({
          where: { id: lead.id },
          data: { 
            status: 'ACCEPTED',
            acceptedById: randomContractor!.id
          }
        });
        updatedCount++;
        console.log(`✅ Assigned lead "${lead.title}" to contractor`);
      }
    }

    console.log(`\n✅ Updated ${updatedCount} leads to ACCEPTED status`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateLeadsForReviews();
