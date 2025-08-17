import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Test all the messaging system components
    const users = await prisma.user.findMany();
    const leads = await prisma.lead.findMany();
    const threads = await prisma.thread.findMany();
    const messages = await prisma.message.findMany();

    const contractorId = "cmeelabtm0001jkisp3uamyg2";

    // Test the threads query that the UI uses
    const contractorThreads = await prisma.thread.findMany({
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

    return NextResponse.json({
      status: "success",
      counts: {
        users: users.length,
        leads: leads.length,
        threads: threads.length,
        messages: messages.length,
      },
      users,
      leads,
      threads,
      messages,
      contractorThreads,
      contractorId,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 },
    );
  }
}
