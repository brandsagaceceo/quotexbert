import { prisma } from "@/lib/prisma";
import { getCategoryById } from "@/lib/categories";

/**
 * Check if a contractor has an active subscription for a specific category
 */
export async function hasActiveSubscription(contractorId: string, category: string): Promise<boolean> {
  try {
    const subscription = await prisma.contractorSubscription.findUnique({
      where: {
        contractorId_category: {
          contractorId,
          category
        }
      }
    });

    return subscription ? subscription.canClaimLeads : false;
  } catch (error) {
    console.error('Error checking subscription:', error);
    return false;
  }
}

/**
 * Get all categories that a contractor has active subscriptions for
 */
export async function getActiveSubscriptionCategories(contractorId: string): Promise<string[]> {
  try {
    const subscriptions = await prisma.contractorSubscription.findMany({
      where: {
        contractorId,
        canClaimLeads: true
      },
      select: {
        category: true
      }
    });

    return subscriptions.map(sub => sub.category);
  } catch (error) {
    console.error('Error fetching active subscriptions:', error);
    return [];
  }
}

/**
 * Check if a contractor can access a specific lead based on their subscriptions
 */
export async function canAccessLead(contractorId: string, leadCategory: string): Promise<boolean> {
  return await hasActiveSubscription(contractorId, leadCategory);
}

/**
 * Get leads that a contractor can access based on their active subscriptions
 */
export async function getAccessibleLeads(contractorId: string) {
  try {
    const activeCategories = await getActiveSubscriptionCategories(contractorId);
    
    if (activeCategories.length === 0) {
      return [];
    }

    const leads = await prisma.lead.findMany({
      where: {
        category: {
          in: activeCategories
        },
        status: 'open' // Only show open leads
      },
      orderBy: { createdAt: 'desc' },
      include: {
        homeowner: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    return leads;
  } catch (error) {
    console.error('Error fetching accessible leads:', error);
    return [];
  }
}

/**
 * Get all open leads regardless of subscription status
 * Contractors can view all leads but only apply to subscribed categories
 */
export async function getAllOpenLeads() {
  try {
    const leads = await prisma.lead.findMany({
      where: {
        status: 'open' // Only show open leads
      },
      orderBy: { createdAt: 'desc' },
      include: {
        homeowner: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    return leads;
  } catch (error) {
    console.error('Error fetching all open leads:', error);
    return [];
  }
}

/**
 * Get subscription summary for a contractor
 */
export async function getSubscriptionSummary(contractorId: string) {
  try {
    const subscriptions = await prisma.contractorSubscription.findMany({
      where: { contractorId },
      select: {
        category: true,
        canClaimLeads: true,
        canViewLeads: true,
        leadsThisMonth: true,
        createdAt: true
      }
    });

    const summary = {
      totalSubscriptions: subscriptions.length,
      activeSubscriptions: subscriptions.filter(sub => sub.canClaimLeads).length,
      totalLeadsThisMonth: subscriptions.reduce((sum, sub) => sum + (sub.leadsThisMonth || 0), 0),
      categories: subscriptions.map(sub => {
        const categoryConfig = getCategoryById(sub.category);
        return {
          category: sub.category,
          name: categoryConfig?.name || sub.category,
          active: sub.canClaimLeads,
          leadsThisMonth: sub.leadsThisMonth || 0,
          price: categoryConfig?.monthlyPrice || 0
        };
      })
    };

    return summary;
  } catch (error) {
    console.error('Error getting subscription summary:', error);
    return {
      totalSubscriptions: 0,
      activeSubscriptions: 0,
      totalLeadsThisMonth: 0,
      categories: []
    };
  }
}