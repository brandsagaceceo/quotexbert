const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixPricingIssue() {
  try {
    console.log('Fixing pricing issue...');
    
    // Find the lead with the corrupted budget
    const corruptedLead = await prisma.lead.findFirst({
      where: {
        budget: 624911498
      }
    });
    
    if (corruptedLead) {
      console.log('Found corrupted lead:', corruptedLead.title);
      
      // Update it to a reasonable budget for painting 700 sq ft
      await prisma.lead.update({
        where: { id: corruptedLead.id },
        data: { budget: 2100 } // Reasonable price for 700 sq ft painting
      });
      
      console.log('Fixed budget from 624911498 to 2100');
    }
    
    // Verify the fix
    const allLeads = await prisma.lead.findMany();
    console.log('All leads after fix:');
    allLeads.forEach(lead => {
      console.log(`- ${lead.title}: Budget $${lead.budget}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixPricingIssue();