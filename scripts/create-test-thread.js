const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function createTestThread() {
  try {
    // Get the first lead
    const lead = await prisma.lead.findFirst();

    if (!lead) {
      console.log("No leads found");
      return;
    }

    // Create thread for this lead
    const thread = await prisma.thread.create({
      data: {
        leadId: lead.id,
      },
    });

    console.log("✅ Created thread:", thread);

    // Get users for demo message
    const homeowner = await prisma.user.findFirst({
      where: { role: "homeowner" },
    });
    const contractor = await prisma.user.findFirst({
      where: { role: "contractor" },
    });

    // Create demo message
    const message = await prisma.message.create({
      data: {
        threadId: thread.id,
        fromUserId: homeowner.id,
        toUserId: contractor.id,
        body: "Hi! I have a question about this project. When would be a good time to discuss?",
      },
    });

    console.log("✅ Created demo message:", message);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestThread();
