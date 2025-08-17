const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log("🔍 Checking database...");

    const leads = await prisma.lead.findMany();
    console.log(`📋 Found ${leads.length} leads`);

    const threads = await prisma.thread.findMany();
    console.log(`💬 Found ${threads.length} threads`);

    const messages = await prisma.message.findMany();
    console.log(`📝 Found ${messages.length} messages`);

    if (threads.length === 0) {
      console.log("⚠️ No threads found - creating a new one...");

      if (leads.length > 0) {
        const thread = await prisma.thread.create({
          data: {
            leadId: leads[0].id,
          },
        });
        console.log("✅ Created thread:", thread.id);

        // Create a test message
        const users = await prisma.user.findMany();
        if (users.length >= 2) {
          const message = await prisma.message.create({
            data: {
              threadId: thread.id,
              fromUserId: users[0].id,
              toUserId: users[1].id,
              body: "Hello! Can we discuss this project?",
            },
          });
          console.log("✅ Created test message:", message.id);
        }
      }
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
