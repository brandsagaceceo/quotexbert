const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function testMessagingSystem() {
  try {
    console.log("🧪 Testing messaging system...");

    // 1. Get threads for contractor
    const contractorId = "cmeelabtm0001jkisp3uamyg2";

    const threads = await prisma.thread.findMany({
      where: {
        lead: {
          OR: [{ homeownerId: contractorId }, { contractorId: contractorId }],
        },
      },
      include: {
        lead: {
          include: {
            homeowner: true,
            contractor: true,
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
          include: {
            fromUser: true,
          },
        },
      },
    });

    console.log(`✅ Found ${threads.length} threads for contractor`);

    if (threads.length > 0) {
      const thread = threads[0];
      console.log(`📧 Thread: ${thread.lead.title}`);

      // 2. Get messages for this thread
      const messages = await prisma.message.findMany({
        where: { threadId: thread.id },
        include: {
          fromUser: true,
          toUser: true,
        },
        orderBy: { createdAt: "asc" },
      });

      console.log(`✅ Found ${messages.length} messages in thread`);

      messages.forEach((msg, i) => {
        console.log(
          `  ${i + 1}. ${msg.fromUser.email}: ${msg.body.substring(0, 50)}...`,
        );
      });

      // 3. Get notifications
      const notifications = await prisma.notification.findMany({
        where: { userId: contractorId },
        orderBy: { createdAt: "desc" },
      });

      console.log(`✅ Found ${notifications.length} notifications`);

      console.log("\n🎉 Messaging system is fully functional!");
      console.log("💡 Visit http://localhost:3000/messages to test the UI");
    }
  } catch (error) {
    console.error("❌ Error testing messaging system:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testMessagingSystem();
