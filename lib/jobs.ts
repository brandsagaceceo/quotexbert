import { prisma } from './prisma'

export interface ListPublishedLeadsParams {
  q?: string
  trade?: string
  minBudget?: number
  maxBudget?: number
  province?: string
  city?: string
  beforeId?: string
  limit?: number
}

export async function listPublishedLeads(params: ListPublishedLeadsParams) {
  const {
    q,
    trade,
    minBudget,
    maxBudget,
    province,
    city,
    beforeId,
    limit = 20
  } = params

  const where: any = {
    status: 'PUBLISHED'
  }

  // Search query
  if (q) {
    where.OR = [
      { projectType: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { city: { contains: q, mode: 'insensitive' } },
      { province: { contains: q, mode: 'insensitive' } },
      { tags: { contains: q, mode: 'insensitive' } }
    ]
  }

  // Trade filter
  if (trade) {
    where.OR = where.OR || []
    where.OR.push(
      { projectType: { contains: trade, mode: 'insensitive' } },
      { tags: { contains: trade, mode: 'insensitive' } }
    )
  }

  // Budget filters
  if (minBudget) {
    where.budgetMin = { gte: minBudget }
  }
  if (maxBudget) {
    where.budgetMax = { lte: maxBudget }
  }

  // Location filters
  if (province) {
    where.province = { equals: province, mode: 'insensitive' }
  }
  if (city) {
    where.city = { contains: city, mode: 'insensitive' }
  }

  // Cursor pagination
  if (beforeId) {
    where.id = { lt: beforeId }
  }

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit + 1 // Take one extra to check if there are more
  })

  const hasMore = leads.length > limit
  const actualLeads = hasMore ? leads.slice(0, limit) : leads
  const nextCursor = hasMore ? actualLeads[actualLeads.length - 1].id : null

  return {
    leads: actualLeads,
    nextCursor
  }
}

export async function getLeadById(id: string) {
  return await prisma.lead.findUnique({
    where: { id }
  })
}

export async function saveInterest(params: {
  contractorId: string
  leadId: string
  type: 'SAVED' | 'APPLIED'
  message?: string
}) {
  const { contractorId, leadId, type, message } = params

  return await prisma.contractorInterest.upsert({
    where: {
      contractorId_leadId_type: {
        contractorId,
        leadId,
        type
      }
    },
    update: {
      message
    },
    create: {
      contractorId,
      leadId,
      type,
      message
    }
  })
}

export async function claimLead(params: {
  leadId: string
  contractorId: string
}) {
  const { leadId, contractorId } = params

  try {
    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx: any) => {
      // Check current status
      const lead = await tx.lead.findUnique({
        where: { id: leadId }
      })

      if (!lead) {
        return { claimed: false, reason: 'LEAD_NOT_FOUND' }
      }

      if (lead.status !== 'PUBLISHED') {
        return { claimed: false, reason: 'NOT_PUBLISHED' }
      }

      if (lead.claimedById) {
        return { claimed: false, reason: 'ALREADY_CLAIMED' }
      }

      // Claim the lead
      await tx.lead.update({
        where: { id: leadId },
        data: {
          status: 'CLAIMED',
          claimedById: contractorId
        }
      })

      return { claimed: true, lead }
    })

    return result
  } catch (error) {
    console.error('Error claiming lead:', error)
    return { claimed: false, reason: 'TRANSACTION_FAILED' }
  }
}

export function canSeeLead(user: { role?: string } | null): boolean {
  return user?.role === 'contractor'
}

export async function getContractorInterests(contractorId: string, type?: 'SAVED' | 'APPLIED') {
  const where: any = { contractorId }
  if (type) {
    where.type = type
  }

  return await prisma.contractorInterest.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  })
}

// Helper function to parse tags from JSON string
export function parseTags(tagsJson?: string | null): string[] {
  if (!tagsJson) return []
  try {
    return JSON.parse(tagsJson) || []
  } catch {
    return []
  }
}

// Helper function to stringify tags to JSON
export function stringifyTags(tags: string[]): string {
  return JSON.stringify(tags)
}
