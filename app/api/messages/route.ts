import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifications } from "@/lib/notifications";
import { resolveAuthUser } from "@/lib/server-auth";
import {
  isLegacyMessagePair,
  isLegacyThreadParticipant,
  legacyMessageVisibilityWhere,
} from "@/lib/messaging-access";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authResult = await resolveAuthUser();
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }
  const { dbUserId, clerkUserId } = authResult.user;
  const authenticatedIds = new Set([dbUserId, clerkUserId]);
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const threadId = searchParams.get("threadId");

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }
  if (!authenticatedIds.has(userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    if (threadId) {
      const thread = await prisma.thread.findUnique({
        where: { id: threadId },
        select: {
          lead: {
            select: {
              homeownerId: true,
              contractorId: true,
              acceptances: {
                where: { status: { in: ["accepted", "quoted", "selected"] } },
                select: { contractorId: true },
              },
              applications: {
                where: { status: { in: ["accepted", "in_progress", "completed"] } },
                select: { contractorId: true },
              },
              conversations: { select: { id: true } },
            },
          },
        },
      });
      const isParticipant = thread && (
        thread.lead.homeownerId === dbUserId ||
        thread.lead.contractorId === dbUserId ||
        thread.lead.acceptances.some(({ contractorId }) => contractorId === dbUserId) ||
        thread.lead.applications.some(({ contractorId }) => contractorId === dbUserId)
      );
      if (thread?.lead.conversations.length && thread.lead.homeownerId !== dbUserId) {
        return NextResponse.json({ error: "Legacy shared thread access is archived" }, { status: 403 });
      }
      if (!isParticipant) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      // Get messages for a specific thread
      const messages = await prisma.message.findMany({
        where: {
          threadId,
          ...legacyMessageVisibilityWhere(dbUserId, thread.lead.homeownerId),
        },
        include: {
          fromUser: {
            select: {
              id: true,
              email: true,
              role: true
            }
          },
          toUser: {
            select: {
              id: true,
              email: true,
              role: true
            }
          },
          thread: {
            include: {
              lead: {
                select: {
                  id: true,
                  title: true,
                  description: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: "asc"
        }
      });

      return NextResponse.json(messages);
    } else {
      // Get all threads for user
      const currentUser = await prisma.user.findUnique({
        where: { id: dbUserId },
        select: { role: true },
      });
      const threads = await prisma.thread.findMany({
        where: {
          lead: {
            AND: [
              {
                OR: [
                  { homeownerId: dbUserId },
                  { contractorId: dbUserId },
                  { acceptances: { some: { contractorId: dbUserId, status: { in: ["accepted", "quoted", "selected"] } } } },
                  { applications: { some: { contractorId: dbUserId, status: { in: ["accepted", "in_progress", "completed"] } } } },
                ],
              },
              { conversations: { none: {} } },
            ],
          }
        },
        include: {
          lead: {
            select: {
              id: true,
              title: true,
              description: true,
              homeownerId: true,
              contractorId: true,
              acceptedById: true
            }
          },
          messages: {
            ...(currentUser?.role === "contractor"
              ? { where: { OR: [{ fromUserId: dbUserId }, { toUserId: dbUserId }] } }
              : {}),
            orderBy: {
              createdAt: "desc"
            },
            take: 1,
            include: {
              fromUser: {
                select: {
                  id: true,
                  email: true,
                  role: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      });

      return NextResponse.json(threads);
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await resolveAuthUser();
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const { dbUserId } = authResult.user;
    const body = await request.json();
    const { fromUserId, toUserId, leadId, threadId, content } = body;

    if (!fromUserId || !toUserId || typeof content !== "string" || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const [requestedSender, requestedRecipient] = await Promise.all([
      prisma.user.findFirst({
        where: { OR: [{ id: fromUserId }, { clerkUserId: fromUserId }] },
        select: { id: true },
      }),
      prisma.user.findFirst({
        where: { OR: [{ id: toUserId }, { clerkUserId: toUserId }] },
        select: { id: true },
      }),
    ]);
    if (!requestedSender || requestedSender.id !== dbUserId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (!requestedRecipient) {
      return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
    }

    if (!threadId && !leadId) {
      return NextResponse.json({ error: "Thread ID or Lead ID required" }, { status: 400 });
    }

    const existingThread = threadId
      ? await prisma.thread.findUnique({
          where: { id: threadId },
          select: { id: true, leadId: true },
        })
      : await prisma.thread.findUnique({
          where: { leadId },
          select: { id: true, leadId: true },
        });
    if (threadId && !existingThread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }
    if (existingThread && leadId && existingThread.leadId !== leadId) {
      return NextResponse.json({ error: "Thread does not match lead" }, { status: 400 });
    }

    const actualLeadId = existingThread?.leadId ?? leadId;
    if (!actualLeadId) {
      return NextResponse.json({ error: "Thread ID or Lead ID required" }, { status: 400 });
    }
    const lead = await prisma.lead.findUnique({
      where: { id: actualLeadId },
      select: {
        id: true,
        homeownerId: true,
        contractorId: true,
        acceptances: {
          where: { status: { in: ["accepted", "quoted", "selected"] } },
          select: { contractorId: true },
        },
        applications: {
          where: { status: { in: ["accepted", "in_progress", "completed"] } },
          select: { contractorId: true },
        },
        conversations: { select: { id: true } },
      },
    });
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }
    if (lead.conversations.length) {
      return NextResponse.json(
        { error: "This legacy shared thread is archived. Select a contractor-specific conversation." },
        { status: 409 },
      );
    }
    const contractorIds = [
      ...(lead.contractorId ? [lead.contractorId] : []),
      ...lead.acceptances.map(({ contractorId }) => contractorId),
      ...lead.applications.map(({ contractorId }) => contractorId),
    ];
    if (!isLegacyThreadParticipant(dbUserId, lead.homeownerId, contractorIds) ||
        !isLegacyMessagePair(dbUserId, requestedRecipient.id, lead.homeownerId, contractorIds)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const actualThreadId = existingThread?.id ?? (await prisma.thread.create({
      data: { leadId: lead.id },
    })).id;

    // Create the message
    const newMessage = await prisma.message.create({
      data: {
        threadId: actualThreadId,
        fromUserId: dbUserId,
        toUserId: requestedRecipient.id,
        body: content
      },
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            contractorProfile: {
              select: {
                companyName: true
              }
            },
            homeownerProfile: {
              select: {
                name: true
              }
            }
          }
        },
        toUser: {
          select: {
            id: true,
            email: true,
            role: true
          }
        },
        thread: {
          include: {
            lead: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      }
    });

    // Send notification to recipient using our new service
    const senderName = newMessage.fromUser.contractorProfile?.companyName || 
                      newMessage.fromUser.homeownerProfile?.name || 
                      newMessage.fromUser.name ||
                      'User';

    // Create in-app and email notification
    await notifications.newMessage(requestedRecipient.id, {
      messageId: newMessage.id,
      title: newMessage.thread.lead?.title || 'Message',
      message: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
      senderName,
      threadId: actualThreadId
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json({ error: "Failed to create message" }, { status: 500 });
  }
}