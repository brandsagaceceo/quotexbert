import { z } from "zod";

// Common validation patterns
export const emailSchema = z.string().email("Invalid email address");
export const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s\-\(\)]+$/, "Invalid phone number");
export const postalCodeSchema = z
  .string()
  .regex(/^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/, "Invalid Canadian postal code");

// User validation
export const userRoleSchema = z.enum(["admin", "contractor", "homeowner"]);

// Lead/Job validation
export const leadStatusSchema = z.enum([
  "open",
  "claimed",
  "assigned",
  "closed",
]);
export const tradeTypeSchema = z.enum([
  "general",
  "plumbing",
  "electrical",
  "hvac",
  "roofing",
  "landscaping",
  "painting",
  "flooring",
  "kitchen",
  "bathroom",
]);

export const createLeadSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description too long"),
  budget: z
    .number()
    .min(100, "Budget must be at least $100")
    .max(1000000, "Budget too high"),
  zipCode: postalCodeSchema,
  category: tradeTypeSchema,
  homeownerId: z.string().cuid("Invalid homeowner ID"),
});

export const updateLeadSchema = createLeadSchema.partial().extend({
  id: z.string().cuid("Invalid lead ID"),
  status: leadStatusSchema.optional(),
  contractorId: z.string().cuid("Invalid contractor ID").optional(),
  acceptedById: z.string().cuid("Invalid accepter ID").optional(),
});

// Message validation
export const createMessageSchema = z.object({
  threadId: z.string().cuid("Invalid thread ID"),
  fromUserId: z.string().cuid("Invalid sender ID"),
  toUserId: z.string().cuid("Invalid recipient ID"),
  body: z
    .string()
    .min(1, "Message cannot be empty")
    .max(5000, "Message too long"),
});

// Thread validation
export const createThreadSchema = z.object({
  leadId: z.string().cuid("Invalid lead ID"),
});

// Billing validation
export const updateBillingSchema = z.object({
  monthlyCapCents: z
    .number()
    .min(0, "Monthly cap cannot be negative")
    .max(10000000, "Monthly cap too high"),
  isActive: z.boolean(),
});

// Contract validation
export const contractStatusSchema = z.enum([
  "draft",
  "sent",
  "accepted", // Updated from "signed"
  "completed",
  "cancelled", // Added
]);

export const contractItemSchema = z.object({
  description: z.string().min(1, "Description is required").max(500),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Unit price must be non-negative"),
  totalPrice: z.number().min(0, "Total price must be non-negative"),
});

export const createContractSchema = z.object({
  leadId: z.string().cuid("Invalid lead ID"),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required").max(2000),
  scope: z.string().min(1, "Scope is required").max(5000),
  totalAmountCents: z.number().min(1, "Total amount must be greater than 0"),
  items: z.array(contractItemSchema).min(1, "At least one item is required"),
});

export const sendContractSchema = z.object({
  contractId: z.string().cuid("Invalid contract ID"),
});

export const acceptContractSchema = z.object({
  contractId: z.string().cuid("Invalid contract ID"),
  userId: z.string().cuid("Invalid user ID"),
});

export const updateContractSchema = createContractSchema.partial().extend({
  id: z.string().cuid("Invalid contract ID"),
  status: contractStatusSchema.optional(),
});

// Query parameter validation
export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .default("1")
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1)),
  limit: z
    .string()
    .optional()
    .default("10")
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1).max(100)),
});

export const leadFiltersSchema = z
  .object({
    status: leadStatusSchema.optional(),
    category: tradeTypeSchema.optional(),
    zipCode: z.string().optional(),
    minBudget: z
      .string()
      .optional()
      .transform((val) => (val ? parseFloat(val) : undefined))
      .pipe(z.number().min(0).optional()),
    maxBudget: z
      .string()
      .optional()
      .transform((val) => (val ? parseFloat(val) : undefined))
      .pipe(z.number().min(0).optional()),
  })
  .merge(paginationSchema);

// API response validation
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    message: z.string().optional(),
  });

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T,
) =>
  apiResponseSchema(z.array(dataSchema)).extend({
    pagination: z
      .object({
        page: z.number(),
        limit: z.number(),
        total: z.number(),
        totalPages: z.number(),
      })
      .optional(),
  });

// Additional validation schemas for new features

// PDF generation schema
export const generatePdfSchema = z.object({
  contractId: z.string().cuid("Invalid contract ID"),
});

// Comment validation schema (for job comments)
export const createCommentSchema = z.object({
  jobId: z.string().cuid("Invalid job ID"),
  userId: z.string().cuid("Invalid user ID"),
  content: z.string().min(1, "Comment content is required").max(1000),
});

// Profile validation schemas
export const contractorProfileSchema = z.object({
  companyName: z.string().min(1, "Company name is required").max(100),
  trade: z.string().min(1, "Trade is required"),
  bio: z.string().max(1000).optional(),
  city: z.string().max(100).optional(),
  serviceRadiusKm: z.number().min(1).max(500).default(25),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  phone: z.string().max(20).optional(),
});

export const homeownerProfileSchema = z.object({
  name: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
});

export const portfolioItemSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  caption: z.string().max(500).optional(),
  imageUrl: z.string().url("Invalid image URL"),
});

export const reviewSchema = z.object({
  leadId: z.string().cuid("Invalid lead ID"),
  contractorId: z.string().cuid("Invalid contractor ID"),
  rating: z.number().min(1).max(5),
  text: z.string().max(1000).optional(),
});
