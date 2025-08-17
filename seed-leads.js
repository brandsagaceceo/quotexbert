const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedLeads() {
  try {
    // Create sample leads with different statuses
    const leads = [
      {
        projectType: "Plumbing",
        description:
          "Need urgent repair for kitchen sink leak. Water is dripping constantly and getting worse. Looking for licensed plumber to fix ASAP.",
        estimate: "$500-$1,000",
        postalCode: "M5V 2A8",
        source: "web",
        status: "DRAFT",
        city: "Toronto",
        province: "ON",
        budgetMin: 500,
        budgetMax: 1000,
        tags: "urgent, kitchen, sink, leak",
      },
      {
        projectType: "Electrical",
        description:
          "Install ceiling fan in master bedroom. Room is approximately 12x14 feet. Need electrical wiring run from existing switch.",
        estimate: "$200-$500",
        postalCode: "V6B 1A1",
        source: "web",
        status: "PUBLISHED",
        city: "Vancouver",
        province: "BC",
        budgetMin: 200,
        budgetMax: 500,
        tags: "ceiling fan, bedroom, wiring",
      },
      {
        projectType: "Roofing",
        description:
          "Roof inspection and minor shingle repair. A few shingles came loose during recent storm. Need assessment and repair quote.",
        estimate: "$300-$800",
        postalCode: "T2P 1J9",
        source: "web",
        status: "PUBLISHED",
        city: "Calgary",
        province: "AB",
        budgetMin: 300,
        budgetMax: 800,
        tags: "roof inspection, shingles, storm damage",
      },
      {
        projectType: "HVAC",
        description:
          "Annual furnace maintenance and cleaning. System is 8 years old and needs routine service before winter season.",
        estimate: "$150-$300",
        postalCode: "K1A 0A6",
        source: "web",
        status: "CLOSED",
        city: "Ottawa",
        province: "ON",
        budgetMin: 150,
        budgetMax: 300,
        tags: "furnace, maintenance, cleaning, winter prep",
      },
    ];

    console.log("Creating sample leads...");

    for (const leadData of leads) {
      const lead = await prisma.lead.create({
        data: leadData,
      });
      console.log(
        `Created lead: ${lead.id} - ${lead.projectType} in ${lead.city}`,
      );
    }

    console.log("Sample leads created successfully!");
  } catch (error) {
    console.error("Error creating sample leads:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedLeads();
