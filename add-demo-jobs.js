const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function addDemoJobs() {
  try {
    // Get the homeowner we created earlier
    const homeowner = await prisma.user.findFirst({
      where: { role: "homeowner" },
    });

    if (!homeowner) {
      console.log("No homeowner found, creating one...");
      const newHomeowner = await prisma.user.create({
        data: {
          email: "demo@homeowner.com",
          role: "homeowner",
        },
      });
      console.log("Created homeowner:", newHomeowner.email);
    }

    const homeownerId = homeowner?.id || "demo-homeowner";

    // Add demo jobs
    const jobs = [
      {
        title: "Kitchen Cabinet Painting",
        description:
          "Looking to paint kitchen cabinets white. About 20 cabinet doors and drawer fronts. Kitchen is approximately 12x14 feet.",
        city: "Toronto",
        province: "ON",
        trade: "painting",
        budgetMin: 1500,
        budgetMax: 3000,
        status: "open",
        published: true,
        homeownerId: homeownerId,
      },
      {
        title: "Bathroom Plumbing Repair",
        description:
          "Leaky faucet and running toilet need repair. Also need to replace bathroom vanity faucet.",
        city: "Mississauga",
        province: "ON",
        trade: "plumbing",
        budgetMin: 300,
        budgetMax: 800,
        status: "open",
        published: true,
        homeownerId: homeownerId,
      },
      {
        title: "Electrical Outlet Installation",
        description:
          "Need 3 new electrical outlets installed in basement office area. Existing electrical panel has capacity.",
        city: "Brampton",
        province: "ON",
        trade: "electrical",
        budgetMin: 400,
        budgetMax: 700,
        status: "open",
        published: true,
        homeownerId: homeownerId,
      },
      {
        title: "Roof Shingles Replacement",
        description:
          "Small section of roof shingles damaged in storm. About 100 sq ft needs replacement.",
        city: "Hamilton",
        province: "ON",
        trade: "roofing",
        budgetMin: 800,
        budgetMax: 1500,
        status: "open",
        published: true,
        homeownerId: homeownerId,
      },
    ];

    for (const job of jobs) {
      const created = await prisma.lead.create({
        data: job,
      });
      console.log("Created job:", created.title);
    }

    console.log("✅ Demo jobs added successfully!");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

addDemoJobs();
