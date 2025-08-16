"use server"

import { z } from 'zod'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { sendLeadEmail } from '@/lib/email'
import { redirect } from 'next/navigation'
import { nanoid } from 'nanoid'

// Canadian postal code regex (case-insensitive, space optional)
const canadianPostalCodeRegex = /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i

const leadSchema = z.object({
  postalCode: z.string()
    .refine(val => canadianPostalCodeRegex.test(val), {
      message: "Please enter a valid Canadian postal code"
    }),
  projectType: z.string()
    .min(1, "Project type is required")
    .max(80, "Project type must be 80 characters or less"),
  description: z.string()
    .min(1, "Description is required")
    .max(1000, "Description must be 1000 characters or less"),
  website: z.string().optional(), // Honeypot field
})

// Simple in-memory rate limiting for development
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW = 10 * 60 * 1000 // 10 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const existing = rateLimitMap.get(ip)
  
  if (!existing || now > existing.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }
  
  if (existing.count >= RATE_LIMIT_MAX) {
    return false
  }
  
  existing.count++
  return true
}

function generateEstimate(projectType: string, description: string, postalCode: string): string {
  // Simple deterministic estimate based on hash of inputs
  const hash = (projectType + description + postalCode).split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  const baseAmount = Math.abs(hash % 10000) + 2000 // $2,000 - $12,000
  const maxAmount = baseAmount + (Math.abs(hash % 5000) + 1000) // Add $1,000 - $6,000
  
  return `$${baseAmount.toLocaleString()} - $${maxAmount.toLocaleString()}`
}

export async function submitLead(formData: FormData) {
  try {
    // Get IP and user agent
    const headersList = await headers()
    const forwardedFor = headersList.get('x-forwarded-for')
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown'
    const userAgent = headersList.get('user-agent') || 'unknown'

    // Parse and validate input
    const rawData = {
      postalCode: formData.get('postalCode') as string,
      projectType: formData.get('projectType') as string,
      description: formData.get('description') as string,
      website: formData.get('website') as string, // Honeypot
      affiliateCode: formData.get('affiliateCode') as string, // Affiliate tracking
    }

    // Check honeypot
    if (rawData.website && rawData.website.trim() !== '') {
      return {
        success: false,
        error: 'Spam detected',
        blocked: true,
        reason: 'honeypot'
      }
    }

    // Rate limiting
    if (!checkRateLimit(ip)) {
      return {
        success: false,
        error: 'Too many requests. Please try again later.',
        blocked: true,
        reason: 'rate_limit'
      }
    }

    // Validate input
    const validation = leadSchema.safeParse(rawData)
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0].message,
        blocked: true,
        reason: 'validation'
      }
    }

    const data = validation.data

    // Generate estimate
    const estimate = generateEstimate(data.projectType, data.description, data.postalCode)
    const estimateValue = parseInt(estimate.split('$')[1].split(',').join('').split(' ')[0]) || 5000

    // Handle affiliate tracking
    let affiliateId: string | null = null
    if (rawData.affiliateCode) {
      const affiliate = await prisma.affiliate.findUnique({
        where: { referralCode: rawData.affiliateCode }
      })
      
      if (affiliate) {
        affiliateId = affiliate.id
        
        // Create referral
        await prisma.referral.create({
          data: {
            affiliateId: affiliate.id,
            visitorIp: ip,
            userAgent: userAgent?.slice(0, 100)
          }
        })
      }
    }
    
    // Save lead to database
    const lead = await prisma.lead.create({
      data: {
        postalCode: data.postalCode,
        projectType: data.projectType,
        description: data.description,
        estimate,
        source: rawData.affiliateCode ? 'affiliate' : 'web',
        ip,
        userAgent,
        affiliateId,
      }
    })

    // Connect referral to lead if affiliate exists
    if (affiliateId) {
      await prisma.referral.updateMany({
        where: {
          affiliateId: affiliateId,
          leadId: null
        },
        data: {
          leadId: lead.id
        }
      })
    }

    // Send email notification
    await sendLeadEmail({
      postalCode: data.postalCode,
      projectType: data.projectType,
      description: data.description,
      estimate,
      source: rawData.affiliateCode ? 'affiliate' : 'web'
    })

    return {
      success: true,
      estimate,
      leadId: lead.id
    }

  } catch (error) {
    console.error('Failed to submit lead:', error)
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.'
    }
  }
}
