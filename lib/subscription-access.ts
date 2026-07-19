import { prisma } from "@/lib/prisma";
import { ALL_CATEGORIES, getCategoryById, normalizeCategory } from "@/lib/categories";
import { canAccessLead as canAccessLeadGod, isGodUser } from "@/lib/god-access";

const ACCESS_STATUSES = new Set(["active", "trialing"]);

export function uniqueNormalizedCategories(categories: Array<string | null | undefined>): string[] {
  return Array.from(
    new Set(
      categories
        .filter((category): category is string => typeof category === "string" && category.trim().length > 0)
        .map((category) => normalizeCategory(category))
    )
  );
}

export function categoryMatchesEntitlement(leadCategory: string, entitlementCategory: string): boolean {
  return normalizeCategory(leadCategory) === normalizeCategory(entitlementCategory);
}

function getCategoryQueryValues(activeCategories: string[]): string[] {
  return Array.from(
    new Set([
      ...activeCategories,
      ...ALL_CATEGORIES
        .filter((category) => activeCategories.includes(normalizeCategory(category.id)))
        .map((category) => category.id),
    ])
  );
}

function hasCurrentAccessWindow(currentPeriodEnd: Date | null): boolean {
  return !currentPeriodEnd || currentPeriodEnd.getTime() >= Date.now();
}

function isClaimableSubscription(subscription: { status: string; canClaimLeads: boolean; currentPeriodEnd: Date | null }): boolean {
  return subscription.canClaimLeads && ACCESS_STATUSES.has(subscription.status) && hasCurrentAccessWindow(subscription.currentPeriodEnd);
}

export async function resolveContractorDbId(contractorId: string): Promise<string | null> {
  const user = await prisma.user.findFirst({
    where: { OR: [{ id: contractorId }, { clerkUserId: contractorId }] },
    select: { id: true }
  });

  return user?.id ?? null;
}

/**
 * Check if a contractor has an active subscription for a specific category
 */
export async function hasActiveSubscription(contractorId: string, category: string): Promise<boolean> {
  try {
    const dbContractorId = await resolveContractorDbId(contractorId);
    if (!dbContractorId) return false;

    const subscriptions = await prisma.contractorSubscription.findMany({
      where: { contractorId: dbContractorId },
      select: { category: true, status: true, canClaimLeads: true, currentPeriodEnd: true }
    });

    return subscriptions.some(
      (subscription) => isClaimableSubscription(subscription) && categoryMatchesEntitlement(category, subscription.category)
    );
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
    const dbContractorId = await resolveContractorDbId(contractorId);
    if (!dbContractorId) return [];

    const subscriptions = await prisma.contractorSubscription.findMany({
      where: { contractorId: dbContractorId },
      select: {
        category: true,
        status: true,
        canClaimLeads: true,
        currentPeriodEnd: true
      }
    });

    return uniqueNormalizedCategories(
      subscriptions
        .filter((subscription) => isClaimableSubscription(subscription))
        .map(sub => sub.category)
    );
  } catch (error) {
    console.error('Error fetching active subscriptions:', error);
    return [];
  }
}

/**
 * Check if a contractor can access a specific lead based on their subscriptions
 */
export async function canAccessLead(contractorId: string, leadCategory: string): Promise<boolean> {
  // Check if user is God user (admin override)
  // Try by DB id first, then by Clerk user id
  let user = await prisma.user.findUnique({
    where: { id: contractorId },
    select: { id: true, email: true }
  });
  
  if (!user) {
    user = await prisma.user.findUnique({
      where: { clerkUserId: contractorId },
      select: { id: true, email: true }
    });
  }
  
  if (canAccessLeadGod(user?.email)) {
    return true; // God users can access ANY lead
  }

  // Use the actual DB id for subscription lookup
  const dbId = user?.id || contractorId;
  return await hasActiveSubscription(dbId, leadCategory);
}

/**
 * Get leads that a contractor can access based on their active subscriptions
 */
export async function getAccessibleLeads(contractorId: string) {
  try {
    const dbContractorId = await resolveContractorDbId(contractorId);
    if (!dbContractorId) return [];

    const activeCategories = await getActiveSubscriptionCategories(dbContractorId);
    
    if (activeCategories.length === 0) {
      return [];
    }

    const categoryQueryValues = getCategoryQueryValues(activeCategories);

    const candidateLeads = await prisma.lead.findMany({
      where: {
        category: { in: categoryQueryValues },
        status: 'open',     // Only show open leads
        published: true,    // Only show published leads
        isSeeded: false,    // Never show demo/seed data
      },
      orderBy: { createdAt: 'desc' },
      include: {
        homeowner: {
          select: {
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            applications: true
          }
        }
      }
    });

    return candidateLeads.filter((lead) => {
      const acceptedContractors = JSON.parse(lead.acceptedContractors || '[]');
      return acceptedContractors.length < 3 && activeCategories.includes(normalizeCategory(lead.category));
    });
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
        status: 'open',    // Only show open leads
        published: true,   // Only show published leads
        isSeeded: false,   // Never show demo/seed data in production
      },
      orderBy: { createdAt: 'desc' },
      include: {
        homeowner: {
          select: {
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            applications: true
          }
        }
      }
    });

    // Filter out jobs that have reached maximum contractors (3)
    const availableLeads = leads.filter(lead => {
      const acceptedContractors = JSON.parse(lead.acceptedContractors || '[]');
      return acceptedContractors.length < 3;
    });

    return availableLeads;
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