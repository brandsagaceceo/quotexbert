import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create demo admin
  const admin = await prisma.user.create({
    data: {
      email: "admin@demo.com",
      role: "admin",
    },
  });

  // Create demo homeowner
  const homeowner = await prisma.user.create({
    data: {
      email: "homeowner@demo.com",
      role: "homeowner",
    },
  });

  // Create demo contractor
  const contractor = await prisma.user.create({
    data: {
      email: "contractor@demo.com",
      role: "contractor",
    },
  });

  // Create contractor profile
  await prisma.contractorProfile.create({
    data: {
      userId: contractor.id,
      companyName: "Demo Contracting LLC",
      trade: "plumbing",
      city: "Beverly Hills",
    },
  });

  // Create sample leads
  const lead1 = await prisma.lead.create({
    data: {
      title: "Kitchen Plumbing Repair",
      description: "Need to fix a leaky kitchen sink and install new faucet",
      budget: 500,
      zipCode: "90210",
      category: "plumbing",
      homeownerId: homeowner.id,
    },
  });

  const lead2 = await prisma.lead.create({
    data: {
      title: "Bathroom Electrical Work",
      description: "Install new light fixtures and outlets in bathroom",
      budget: 800,
      zipCode: "90211",
      category: "electrical",
      homeownerId: homeowner.id,
    },
  });

  console.log("✅ Database seeded successfully!");
  console.log(`Created ${admin.email} (admin)`);
  console.log(`Created ${homeowner.email} (homeowner)`);
  console.log(`Created ${contractor.email} (contractor)`);
  console.log(`Created ${lead1.title} - ${lead1.category}`);
  console.log(`Created ${lead2.title} - ${lead2.category}`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
