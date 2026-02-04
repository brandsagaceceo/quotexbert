"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sendLeadEmail } from "@/lib/email";
import { auth } from "@clerk/nextjs/server";

// Canadian postal code regex (case-insensitive, space optional)
const canadianPostalCodeRegex =
  /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i;

const leadSchema = z.object({
  postalCode: z.string().refine((val) => canadianPostalCodeRegex.test(val), {
    message: "Please enter a valid Canadian postal code",
  }),
  projectType: z
    .string()
    .min(1, "Project type is required")
    .max(80, "Project type must be 80 characters or less"),
  title: z
    .string()
    .min(1, "Project title is required")
    .max(100, "Project title must be 100 characters or less"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description must be 1000 characters or less"),
  budget: z.string().optional(), // Optional budget from form
  photos: z.array(z.string()).optional().default([]), // Array of photo URLs
  website: z.string().optional(), // Honeypot field
});

// Simple in-memory rate limiting for development
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const existing = rateLimitMap.get(ip);

  if (!existing || now > existing.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (existing.count >= RATE_LIMIT_MAX) {
    return false;
  }

  existing.count++;
  return true;
}

function generateEstimate(
  projectType: string,
  description: string,
  postalCode: string,
): string {
  // Simple deterministic estimate based on hash of inputs
  const hash = (projectType + description + postalCode)
    .split("")
    .reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

  const baseAmount = Math.abs(hash % 10000) + 2000; // $2,000 - $12,000
  const maxAmount = baseAmount + (Math.abs(hash % 5000) + 1000); // Add $1,000 - $6,000

  return `$${baseAmount.toLocaleString()} - $${maxAmount.toLocaleString()}`;
}

export async function submitLead(formData: FormData) {
  try {
    // Get IP and user agent
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const ip = forwardedFor
      ? (forwardedFor.split(",")[0]?.trim() ?? "unknown")
      : "unknown";
    const userAgent = headersList.get("user-agent") || "unknown";

    // Parse and validate input
    const rawData = {
      postalCode: formData.get("postalCode") as string,
      projectType: formData.get("projectType") as string,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      budget: formData.get("budget") as string,
      photos: formData.get("photos") ? JSON.parse(formData.get("photos") as string) : [],
      website: formData.get("website") as string, // Honeypot
      affiliateCode: formData.get("affiliateCode") as string, // Affiliate tracking
    };

    // Check honeypot
    if (rawData.website && rawData.website.trim() !== "") {
      return {
        success: false,
        error: "Spam detected",
        blocked: true,
        reason: "honeypot",
      };
    }

    // Rate limiting
    if (!checkRateLimit(ip)) {
      return {
        success: false,
        error: "Too many requests. Please try again later.",
        blocked: true,
        reason: "rate_limit",
      };
    }

    // Validate input
    const validation = leadSchema.safeParse(rawData);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || "Validation failed",
        blocked: true,
        reason: "validation",
      };
    }

    const data = validation.data;

    // Generate estimate
    const estimate = generateEstimate(
      data.projectType,
      data.description,
      data.postalCode,
    );
    
    // Use provided budget if available and valid, otherwise use generated estimate
    const finalBudget = data.budget && data.budget.trim() !== "" ? data.budget : estimate;

    // Handle affiliate tracking
    let affiliateId: string | null = null;
    if (rawData.affiliateCode) {
      const affiliate = await prisma.affiliate.findUnique({
        where: { referralCode: rawData.affiliateCode },
      });

      if (affiliate) {
        affiliateId = affiliate.id;

        // Create referral
        await prisma.referral.create({
          data: {
            affiliateId: affiliate.id,
            visitorIp: ip,
            userAgent: userAgent?.slice(0, 100),
          },
        });
      }
    }

    // Get authenticated user ID from Clerk
    const { userId } = await auth();
    
    if (!userId) {
      console.error('[submitLead] User not authenticated');
      return {
        success: false,
        error: "You must be signed in to create a lead. Please sign in and try again.",
        blocked: true,
        reason: "authentication",
      };
    }

    // Verify user exists in database, create if not
    let user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { role: true, id: true, email: true, name: true }
    });

    if (!user) {
      console.log('[submitLead] User not found in database, creating user:', userId);
      
      // Get user info from Clerk
      const { clerkClient } = await import('@clerk/nextjs/server');
      const clerkUser = await clerkClient().users.getUser(userId);
      
      // Create user in database
      user = await prisma.user.create({
        data: {
          clerkUserId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
          role: 'homeowner', // Default to homeowner for lead creation
        },
        select: { role: true, id: true, email: true, name: true }
      });
      
      console.log('[submitLead] User created successfully:', user.id);
    }

    if (user.role !== 'homeowner') {
      console.error('[submitLead] User is not a homeowner:', user.role);
      return {
        success: false,
        error: "Only homeowners can create project leads. Please switch to a homeowner account.",
        blocked: true,
        reason: "invalid_role",
      };
    }

    console.log('[submitLead] Creating lead for user:', user.id, 'with data:', {
      title: data.title,
      category: data.projectType,
      budget: finalBudget
    });

    // Save lead to database
    const lead = await prisma.lead.create({
      data: {
        title: data.title, // Use the actual title from the form
        zipCode: data.postalCode,
        category: data.projectType,
        description: data.description,
        budget: finalBudget, // Store the budget range or user input as string
        photos: JSON.stringify(data.photos || []),
        homeownerId: user.id, // Use database user ID, not Clerk ID
        status: "open", // Set initial status to lowercase
        published: true, // Make the lead available to contractors immediately
      },
    });

    console.log('[submitLead] Lead created successfully:', lead.id);

    // Connect referral to lead if affiliate exists
    if (affiliateId) {
      await prisma.referral.updateMany({
        where: {
          affiliateId: affiliateId,
          leadId: null,
        },
        data: {
          leadId: lead.id,
        },
      });
    }

    // Send email notification
    await sendLeadEmail({
      postalCode: data.postalCode,
      projectType: data.projectType,
      description: data.description,
      estimate,
      source: rawData.affiliateCode ? "affiliate" : "web",
    });

    return {
      success: true,
      estimate,
      leadId: lead.id,
      message: "Your project has been posted successfully! Contractors will be notified.",
    };
  } catch (error) {
    console.error("[submitLead] Error submitting lead:", error);
    
    // Provide helpful error messages
    if (error instanceof Error) {
      if (error.message.includes('User') || error.message.includes('authentication')) {
        return {
          success: false,
          error: "Authentication error. Please sign out and sign back in.",
        };
      }
      if (error.message.includes('database') || error.message.includes('prisma')) {
        return {
          success: false,
          error: "Database error. Please try again in a moment.",
        };
      }
      return {
        success: false,
        error: `Failed to create lead: ${error.message}`,
      };
    }
    
    return {
      success: false,
      error: "An unexpected error occurred. Please try again or contact support if the problem persists.",
    };
  }
}
