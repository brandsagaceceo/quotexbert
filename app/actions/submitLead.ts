"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sendLeadEmail } from "@/lib/email";
import { auth, clerkClient } from "@clerk/nextjs/server";

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
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  
  try {
    console.log(`[submitLead:${requestId}] Starting lead submission`);
    
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

    console.log(`[submitLead:${requestId}] Raw data:`, {
      title: rawData.title,
      category: rawData.projectType,
      photosCount: rawData.photos.length
    });

    // Check honeypot
    if (rawData.website && rawData.website.trim() !== "") {
      console.warn(`[submitLead:${requestId}] Honeypot triggered`);
      return {
        success: false,
        error: "Spam detected",
        blocked: true,
        reason: "honeypot",
      };
    }

    // Rate limiting
    if (!checkRateLimit(ip)) {
      console.warn(`[submitLead:${requestId}] Rate limit exceeded for IP: ${ip}`);
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
      const firstError = validation.error.issues[0];
      console.error(`[submitLead:${requestId}] Validation failed:`, firstError);
      
      return {
        success: false,
        error: firstError?.message || "Validation failed",
        fieldErrors: validation.error.issues.reduce((acc, issue) => {
          const field = issue.path[0];
          if (field) acc[field as string] = issue.message;
          return acc;
        }, {} as Record<string, string>),
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
      try {
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
          console.log(`[submitLead:${requestId}] Affiliate tracked: ${affiliateId}`);
        }
      } catch (affiliateError) {
        console.error(`[submitLead:${requestId}] Affiliate tracking error:`, affiliateError);
        // Don't fail the request if affiliate tracking fails
      }
    }

    // Get authenticated user ID from Clerk
    const { userId } = await auth();
    
    if (!userId) {
      console.error(`[submitLead:${requestId}] User not authenticated`);
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
      console.log(`[submitLead:${requestId}] User not found in database, creating user: ${userId}`);
      
      try {
        // Get user info from Clerk
        const client = await clerkClient();
        const clerkUser = await client.users.getUser(userId);
        
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
        
        console.log(`[submitLead:${requestId}] User created successfully: ${user.id}`);
      } catch (userCreationError) {
        console.error(`[submitLead:${requestId}] Failed to create user:`, userCreationError);
        return {
          success: false,
          error: "Failed to create user account. Please try signing out and signing back in.",
          requestId,
        };
      }
    }

    if (user.role !== 'homeowner') {
      console.error(`[submitLead:${requestId}] User is not a homeowner: ${user.role}`);
      return {
        success: false,
        error: "Only homeowners can create project leads. Please switch to a homeowner account.",
        blocked: true,
        reason: "invalid_role",
      };
    }

    console.log(`[submitLead:${requestId}] Creating lead for user: ${user.id}`);

    // Save lead to database
    let lead;
    try {
      lead = await prisma.lead.create({
        data: {
          title: data.title,
          zipCode: data.postalCode,
          category: data.projectType,
          description: data.description,
          budget: finalBudget,
          photos: JSON.stringify(data.photos || []),
          homeownerId: user.id,
          status: "open",
          published: true,
        },
      });
      
      console.log(`[submitLead:${requestId}] Lead created successfully: ${lead.id}`);
    } catch (dbError) {
      console.error(`[submitLead:${requestId}] Database error creating lead:`, dbError);
      
      // Provide specific error messages
      if (dbError instanceof Error) {
        if (dbError.message.includes('Unique constraint')) {
          return {
            success: false,
            error: "A lead with these details already exists. Please modify your submission.",
            requestId,
          };
        }
        if (dbError.message.includes('Foreign key constraint')) {
          return {
            success: false,
            error: "Database relationship error. Please try again or contact support.",
            requestId,
          };
        }
      }
      
      return {
        success: false,
        error: "Database error while saving your project. Please try again in a moment.",
        requestId,
      };
    }

    // Connect referral to lead if affiliate exists
    if (affiliateId && lead) {
      try {
        await prisma.referral.updateMany({
          where: {
            affiliateId: affiliateId,
            leadId: null,
          },
          data: {
            leadId: lead.id,
          },
        });
      } catch (referralError) {
        console.error(`[submitLead:${requestId}] Referral update error:`, referralError);
        // Don't fail the request if referral update fails
      }
    }

    // Send email notification
    try {
      await sendLeadEmail({
        postalCode: data.postalCode,
        projectType: data.projectType,
        description: data.description,
        estimate,
        source: rawData.affiliateCode ? "affiliate" : "web",
      });
      console.log(`[submitLead:${requestId}] Email notification sent`);
    } catch (emailError) {
      console.error(`[submitLead:${requestId}] Email notification error:`, emailError);
      // Don't fail the request if email fails
    }

    return {
      success: true,
      estimate,
      leadId: lead.id,
      message: "Your project has been posted successfully! Contractors will be notified.",
      requestId,
    };
  } catch (error) {
    console.error(`[submitLead:${requestId}] Unexpected error:`, error);
    
    // Provide helpful error messages
    if (error instanceof Error) {
      if (error.message.includes('User') || error.message.includes('authentication')) {
        return {
          success: false,
          error: "Authentication error. Please sign out and sign back in.",
          requestId,
        };
      }
      if (error.message.includes('network') || error.message.includes('fetch')) {
        return {
          success: false,
          error: "Network error. Please check your connection and try again.",
          requestId,
        };
      }
      if (error.message.includes('timeout')) {
        return {
          success: false,
          error: "Request timed out. Please try again.",
          requestId,
        };
      }
      
      return {
        success: false,
        error: `Failed to create lead: ${error.message}`,
        requestId,
      };
    }
    
    return {
      success: false,
      error: "An unexpected error occurred. Please try again or contact support if the problem persists.",
      requestId,
    };
  }
}
