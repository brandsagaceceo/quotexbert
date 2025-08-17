const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function createMoreMessages() {
  try {
    // Get the thread
    const thread = await prisma.thread.findFirst();
    const homeowner = await prisma.user.findFirst({
      where: { role: "homeowner" },
    });
    const contractor = await prisma.user.findFirst({
      where: { role: "contractor" },
    });

    if (!thread || !homeowner || !contractor) {
      console.log("Missing data:", {
        thread: !!thread,
        homeowner: !!homeowner,
        contractor: !!contractor,
      });
      return;
    }

    // Create contractor reply
    const reply1 = await prisma.message.create({
      data: {
        threadId: thread.id,
        fromUserId: contractor.id,
        toUserId: homeowner.id,
        body: "Hi! Thanks for reaching out. I'm available for a call tomorrow afternoon or this weekend. What works best for you?",
      },
    });

    // Create notification for homeowner
    await prisma.notification.create({
      data: {
        userId: homeowner.id,
        type: "NEW_MESSAGE",
        payload: JSON.stringify({
          messageId: reply1.id,
          fromUserName: contractor.email,
          preview: reply1.body.substring(0, 100),
        }),
      },
    });

    console.log("✅ Created contractor reply and notification");

    // Create homeowner response
    const reply2 = await prisma.message.create({
      data: {
        threadId: thread.id,
        fromUserId: homeowner.id,
        toUserId: contractor.id,
        body: "Perfect! Tomorrow afternoon around 2 PM would work great. Should I call you or would you prefer to call me?",
      },
    });

    // Create notification for contractor
    await prisma.notification.create({
      data: {
        userId: contractor.id,
        type: "NEW_MESSAGE",
        payload: JSON.stringify({
          messageId: reply2.id,
          fromUserName: homeowner.email,
          preview: reply2.body.substring(0, 100),
        }),
      },
    });

    console.log("✅ Created homeowner response and notification");
    console.log("✅ Messaging system is fully functional!");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createMoreMessages();
