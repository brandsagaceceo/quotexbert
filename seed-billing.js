const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedLeadPricing() {
  console.log("Seeding lead pricing...");

  const pricingData = [
    // Default pricing
    { trade: "default", city: "default", priceCents: 900 }, // $9.00

    // Trade-specific pricing
    { trade: "plumbing", city: "default", priceCents: 1200 }, // $12.00
    { trade: "electrical", city: "default", priceCents: 1500 }, // $15.00
    { trade: "roofing", city: "default", priceCents: 2000 }, // $20.00
    { trade: "hvac", city: "default", priceCents: 1800 }, // $18.00
    { trade: "painting", city: "default", priceCents: 800 }, // $8.00
    { trade: "flooring", city: "default", priceCents: 1000 }, // $10.00
    { trade: "landscaping", city: "default", priceCents: 900 }, // $9.00
    { trade: "general", city: "default", priceCents: 900 }, // $9.00
    { trade: "bathroom", city: "default", priceCents: 1500 }, // $15.00
    { trade: "kitchen", city: "default", priceCents: 1800 }, // $18.00

    // City-specific pricing (higher rates for major cities)
    { trade: "plumbing", city: "Toronto", priceCents: 1500 }, // $15.00
    { trade: "electrical", city: "Toronto", priceCents: 1800 }, // $18.00
    { trade: "plumbing", city: "Vancouver", priceCents: 1400 }, // $14.00
    { trade: "electrical", city: "Vancouver", priceCents: 1700 }, // $17.00
  ];

  for (const pricing of pricingData) {
    try {
      await prisma.leadPricing.create({
        data: pricing,
      });
      console.log(
        `  ✓ Created pricing for ${pricing.trade} in ${pricing.city}`,
      );
    } catch (error) {
      if (error.code === "P2002") {
        // Record already exists, update it
        await prisma.leadPricing.updateMany({
          where: {
            trade: pricing.trade,
            city: pricing.city,
          },
          data: {
            priceCents: pricing.priceCents,
          },
        });
        console.log(
          `  ✓ Updated pricing for ${pricing.trade} in ${pricing.city}`,
        );
      } else {
        console.error(`  ❌ Error with ${pricing.trade}:`, error.message);
      }
    }
  }

  console.log(`✅ Seeded ${pricingData.length} lead pricing records`);
}

async function seedContractorBilling() {
  console.log("Creating demo contractor billing...");

  // Create demo contractor billing records
  const contractors = [
    "demo-contractor-1",
    "demo-contractor-2",
    "demo-contractor-3",
  ];

  for (const userId of contractors) {
    try {
      await prisma.contractorBilling.create({
        data: {
          userId,
          monthlyCapCents: 5000, // $50.00
          isPaused: false,
          spendThisMonthCents: 0,
          resetOn: new Date(
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            1,
          ),
        },
      });
      console.log(`  ✓ Created billing for ${userId}`);
    } catch (error) {
      if (error.code === "P2002") {
        console.log(`  ✓ Billing for ${userId} already exists`);
      } else {
        console.error(`  ❌ Error with ${userId}:`, error.message);
      }
    }
  }

  console.log(
    `✅ Created billing records for ${contractors.length} contractors`,
  );
}

async function main() {
  try {
    await seedLeadPricing();
    await seedContractorBilling();
  } catch (error) {
    console.error("Error seeding billing data:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main()
    .then(() => {
      console.log("✅ Billing seed completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Billing seed failed:", error);
      process.exit(1);
    });
}

module.exports = { seedLeadPricing, seedContractorBilling };
