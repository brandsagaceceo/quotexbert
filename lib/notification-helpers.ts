import { prisma } from "@/lib/prisma";
import { notifications } from "@/lib/notifications";

/**
 * Send lead notifications to matching contractors based on their profile
 */
export async function notifyMatchingContractors(leadId: string) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        homeowner: true
      }
    });

    if (!lead) {
      console.error("Lead not found for notifications");
      return;
    }

    // Get contractors who might be interested in this lead
    // This is a simple matching algorithm - could be enhanced with ML/AI
    const projectType = determineProjectType(lead.description || lead.title);

    // Find contractors with matching trade
    const matchingContractors = await prisma.contractorProfile.findMany({
      where: {
        OR: [
          { trade: { contains: projectType } },
          { trade: 'general' }, // General contractors get all notifications
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        }
      },
      take: 10 // Limit to 10 contractors to avoid spam
    });

    // Send notifications to matching contractors
    for (const contractor of matchingContractors) {
      await notifications.leadMatched(contractor.user.id, {
        leadId: lead.id,
        title: lead.title || 'New Home Project',
        location: 'Your area'
      });
    }

    console.log(`Sent lead notifications to ${matchingContractors.length} contractors`);
  } catch (error) {
    console.error("Error sending lead notifications:", error);
  }
}

/**
 * Determine project type from description
 */
function determineProjectType(description: string): string {
  const desc = description.toLowerCase();
  
  if (desc.includes('kitchen') || desc.includes('cabinet') || desc.includes('countertop')) {
    return 'kitchen';
  }
  if (desc.includes('bathroom') || desc.includes('shower') || desc.includes('toilet')) {
    return 'bathroom';
  }
  if (desc.includes('electrical') || desc.includes('wiring') || desc.includes('outlet')) {
    return 'electrical';
  }
  if (desc.includes('plumbing') || desc.includes('pipe') || desc.includes('leak')) {
    return 'plumbing';
  }
  if (desc.includes('roof') || desc.includes('shingle')) {
    return 'roofing';
  }
  if (desc.includes('flooring') || desc.includes('tile') || desc.includes('hardwood')) {
    return 'flooring';
  }
  if (desc.includes('paint') || desc.includes('drywall')) {
    return 'painting';
  }
  
  return 'general';
}

/**
 * Send payment failure notifications
 */
export async function notifyPaymentFailure(userId: string, amount: number, reason?: string) {
  await notifications.paymentFailed(userId, {
    amount,
    ...(reason && { reason })
  });
}