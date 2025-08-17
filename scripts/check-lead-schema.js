const { PrismaClient } = require("@prisma/client");

async function checkLeadSchema() {
  const prisma = new PrismaClient();

  try {
    // Get the first lead to see the actual structure
    const lead = await prisma.lead.findFirst({
      include: {
        homeowner: true,
        // Try to include potential relations
        Thread: true,
      },
    });

    if (lead) {
      console.log("Lead structure:", Object.keys(lead));
      console.log("Sample lead:", JSON.stringify(lead, null, 2));
    } else {
      console.log("No leads found in database");
    }
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkLeadSchema();
