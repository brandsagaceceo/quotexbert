const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log("🔍 Checking database...");

    // Check threads
    const threads = await prisma.thread.findMany({
      include: {
        lead: {
          include: {
            homeowner: true,
            contractor: true,
          },
        },
        messages: {
          include: {
            fromUser: true,
            toUser: true,
          },
        },
      },
    });

    console.log("🧵 THREADS FOUND:", threads.length);
    threads.forEach((thread, i) => {
      console.log(`Thread ${i + 1}:`);
      console.log(`  - ID: ${thread.id}`);
      console.log(`  - Lead: ${thread.lead.title}`);
      console.log(`  - Homeowner: ${thread.lead.homeowner.email}`);
      console.log(`  - Contractor: ${thread.lead.contractor?.email || "None"}`);
      console.log(`  - Messages: ${thread.messages.length}`);

      if (thread.messages.length > 0) {
        console.log("  - Recent messages:");
        thread.messages.slice(0, 3).forEach((msg) => {
          console.log(`    * ${msg.fromUser.email}: ${msg.body}`);
        });
      }
      console.log("");
    });

    // Check users
    const users = await prisma.user.findMany();
    console.log("👥 USERS:");
    users.forEach((user) => {
      console.log(`  - ${user.email} (${user.role}) - ID: ${user.id}`);
    });
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
