const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function addTestMessages() {
  try {
    console.log("💬 Adding test messages...");

    // Get users and thread
    const homeowner = await prisma.user.findFirst({
      where: { email: "homeowner@demo.com" },
    });

    const contractor = await prisma.user.findFirst({
      where: { email: "contractor@demo.com" },
    });

    const thread = await prisma.thread.findFirst();

    if (!homeowner || !contractor || !thread) {
      console.log("❌ Missing required data");
      return;
    }

    // Add some fresh messages
    const messages = [
      {
        threadId: thread.id,
        fromUserId: homeowner.id,
        toUserId: contractor.id,
        body: "Great! I'll be available at 2 PM tomorrow. My phone number is 555-0123.",
      },
      {
        threadId: thread.id,
        fromUserId: contractor.id,
        toUserId: homeowner.id,
        body: "Perfect! I'll call you at 2 PM sharp. I'll also bring some material samples to show you different options for the repair.",
      },
      {
        threadId: thread.id,
        fromUserId: homeowner.id,
        toUserId: contractor.id,
        body: "That sounds excellent. Looking forward to seeing the options. Should I prepare anything specific for our call?",
      },
    ];

    for (const messageData of messages) {
      await prisma.message.create({ data: messageData });
      console.log(`✅ Added message: ${messageData.body.substring(0, 50)}...`);
    }

    console.log("🎉 Test messages added successfully!");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

addTestMessages();
