const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create demo users
  const homeowner = await prisma.user.create({
    data: {
      email: "homeowner@demo.com",
      role: "homeowner",
    },
  });

  const contractor = await prisma.user.create({
    data: {
      email: "contractor@demo.com",
      role: "contractor",
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: "admin@demo.com",
      role: "admin",
    },
  });

  // Create contractor profile
  await prisma.contractorProfile.create({
    data: {
      userId: contractor.id,
      companyName: "Demo Contracting LLC",
      trade: "plumbing",
      city: "Beverly Hills",
      province: "CA",
    },
  });

  // Create demo leads
  const lead1 = await prisma.lead.create({
    data: {
      title: "Kitchen Sink Repair",
      description: "Need to fix leaking kitchen sink ASAP",
      budget: 500.0,
      zipCode: "90210",
      category: "plumbing",
      homeownerId: homeowner.id,
    },
  });

  const lead2 = await prisma.lead.create({
    data: {
      title: "Bathroom Renovation",
      description: "Complete bathroom renovation project",
      budget: 8000.0,
      zipCode: "90211",
      category: "general",
      homeownerId: homeowner.id,
    },
  });

  // Create lead pricing
  await prisma.leadPricing.create({
    data: {
      trade: "plumbing",
      priceCents: 900,
    },
  });

  await prisma.leadPricing.create({
    data: {
      trade: "electrical",
      priceCents: 850,
    },
  });

  console.log("✅ Database seeded successfully!");
  console.log(
    `Created users: ${homeowner.email}, ${contractor.email}, ${admin.email}`,
  );
  console.log(`Created leads: ${lead1.title}, ${lead2.title}`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
