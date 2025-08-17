const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function fixContractor() {
  try {
    console.log("🔧 Fixing contractor assignment...");

    // Get the contractor user
    const contractor = await prisma.user.findFirst({
      where: { email: "contractor@demo.com" },
    });

    // Get the lead
    const lead = await prisma.lead.findFirst({
      where: { title: "Kitchen Sink Repair" },
    });

    if (!contractor || !lead) {
      console.log("❌ Could not find contractor or lead");
      return;
    }

    console.log(`👷 Contractor: ${contractor.email} (${contractor.id})`);
    console.log(`🏠 Lead: ${lead.title} (${lead.id})`);

    // Update the lead to assign the contractor
    const updatedLead = await prisma.lead.update({
      where: { id: lead.id },
      data: { contractorId: contractor.id },
    });

    console.log("✅ Lead updated with contractor!");

    // Verify the fix
    const thread = await prisma.thread.findFirst({
      include: {
        lead: {
          include: {
            homeowner: true,
            contractor: true,
          },
        },
      },
    });

    console.log("🧵 Thread now shows:");
    console.log(`  - Homeowner: ${thread.lead.homeowner.email}`);
    console.log(`  - Contractor: ${thread.lead.contractor?.email || "None"}`);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixContractor();
