const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createCompleteTestData() {
  try {
    console.log("🚀 Creating complete test data for messaging...");

    // Create test users
    const homeowner = await prisma.user.upsert({
      where: { email: "homeowner@demo.com" },
      create: {
        id: "homeowner-test-123",
        email: "homeowner@demo.com",
        role: "homeowner"
      },
      update: {}
    });

    const contractor = await prisma.user.upsert({
      where: { email: "contractor@demo.com" },
      create: {
        id: "contractor-test-456", 
        email: "contractor@demo.com",
        role: "contractor"
      },
      update: {}
    });

    console.log("✅ Users created");

    // Create a test lead
    const lead = await prisma.lead.create({
      data: {
        id: "lead-test-789",
        title: "Kitchen Renovation",
        description: "Looking for a contractor to renovate my kitchen",
        budget: 15000,
        zipCode: "90210",
        category: "Kitchen",
        homeownerId: homeowner.id,
        contractorId: contractor.id,
        status: "claimed",
        isSeeded: true,
      }
    });

    console.log("✅ Lead created");

    // Create a thread
    const thread = await prisma.thread.create({
      data: {
        id: "thread-test-999",
        leadId: lead.id
      }
    });

    console.log("✅ Thread created");

    // Create test messages
    const messages = [
      {
        threadId: thread.id,
        fromUserId: homeowner.id,
        toUserId: contractor.id,
        body: "Hi! I'm interested in discussing my kitchen renovation project. Are you available to chat?",
      },
      {
        threadId: thread.id,
        fromUserId: contractor.id,
        toUserId: homeowner.id,
        body: "Hello! Yes, I'd be happy to help with your kitchen renovation. Can you tell me more about what you're looking for?",
      },
      {
        threadId: thread.id,
        fromUserId: homeowner.id,
        toUserId: contractor.id,
        body: "Great! I want to completely remodel the kitchen - new cabinets, countertops, appliances, and flooring. My budget is around $15,000.",
      },
      {
        threadId: thread.id,
        fromUserId: contractor.id,
        toUserId: homeowner.id,
        body: "That sounds like a wonderful project! With a $15,000 budget, we can definitely make some great improvements. When would be a good time to schedule a consultation?",
      },
      {
        threadId: thread.id,
        fromUserId: homeowner.id,
        toUserId: contractor.id,
        body: "Perfect! I'm available this weekend or next week after 6 PM. What works best for you?",
      }
    ];

    for (const messageData of messages) {
      await prisma.message.create({
        data: messageData
      });
    }

    console.log("✅ Messages created");

    // Verify what we created
    const threadCount = await prisma.thread.count();
    const messageCount = await prisma.message.count();
    const userCount = await prisma.user.count();
    const leadCount = await prisma.lead.count();

    console.log("\n🎉 Test data created successfully!");
    console.log(`📊 Users: ${userCount}`);
    console.log(`📊 Leads: ${leadCount}`);
    console.log(`📊 Threads: ${threadCount}`);
    console.log(`📊 Messages: ${messageCount}`);

    console.log("\n💬 Now you can test the messaging system!");
    
  } catch (error) {
    console.error("❌ Error creating test data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createCompleteTestData();
