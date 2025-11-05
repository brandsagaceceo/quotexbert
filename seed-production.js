const { PrismaClient } = require("@prisma/client");

// Use production database URL from Vercel environment variable
const DATABASE_URL = "postgresql://neondb_owner:npg_h1DmvsUPiC5G@ep-gentle-shape-a09bdry8-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL
    }
  }
});

async function main() {
  console.log("🌱 Seeding production database...");

  try {
    // Create demo admin
    const admin = await prisma.user.create({
      data: {
        email: "admin@quotexbert.com",
        role: "admin",
      },
    });

    // Create demo homeowner
    const homeowner = await prisma.user.create({
      data: {
        email: "homeowner@quotexbert.com",
        role: "homeowner",
      },
    });

    // Create demo contractor
    const contractor = await prisma.user.create({
      data: {
        email: "contractor@quotexbert.com",
        role: "contractor",
      },
    });

    // Create contractor profile
    await prisma.contractorProfile.create({
      data: {
        userId: contractor.id,
        companyName: "Elite Home Services",
        trade: "plumbing",
        city: "Beverly Hills",
      },
    });

    // Create sample leads
    const lead1 = await prisma.lead.create({
      data: {
        title: "Kitchen Plumbing Repair",
        description: "Need to fix a leaky kitchen sink and install new faucet. Water is dripping constantly and needs immediate attention.",
        budget: "500",
        zipCode: "90210",
        category: "plumbing",
        homeownerId: homeowner.id,
      },
    });

    const lead2 = await prisma.lead.create({
      data: {
        title: "Bathroom Electrical Work",
        description: "Install new light fixtures and outlets in bathroom. Looking for licensed electrician.",
        budget: "800",
        zipCode: "90211",
        category: "electrical",
        homeownerId: homeowner.id,
      },
    });

    const lead3 = await prisma.lead.create({
      data: {
        title: "Kitchen Renovation",
        description: "Full kitchen remodel including cabinets, countertops, and appliances. Modern design preferred.",
        budget: "25000",
        zipCode: "90212",
        category: "remodeling",
        homeownerId: homeowner.id,
      },
    });

    const lead4 = await prisma.lead.create({
      data: {
        title: "Roof Repair",
        description: "Need roof inspection and repair. Some shingles are loose after recent storm.",
        budget: "1500",
        zipCode: "90213",
        category: "roofing",
        homeownerId: homeowner.id,
      },
    });

    const lead5 = await prisma.lead.create({
      data: {
        title: "HVAC Maintenance",
        description: "Annual HVAC system maintenance and cleaning. System is 5 years old.",
        budget: "300",
        zipCode: "90210",
        category: "hvac",
        homeownerId: homeowner.id,
      },
    });

    console.log("✅ Production database seeded successfully!");
    console.log(`Created ${admin.email} (admin)`);
    console.log(`Created ${homeowner.email} (homeowner)`);
    console.log(`Created ${contractor.email} (contractor)`);
    console.log(`Created ${lead1.title} - ${lead1.category}`);
    console.log(`Created ${lead2.title} - ${lead2.category}`);
    console.log(`Created ${lead3.title} - ${lead3.category}`);
    console.log(`Created ${lead4.title} - ${lead4.category}`);
    console.log(`Created ${lead5.title} - ${lead5.category}`);
  } catch (error) {
    console.error("❌ Error seeding:", error.message);
    if (error.code === 'P2002') {
      console.log("⚠️  Database already has data. If you want to re-seed, clear the database first.");
    }
  }
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
