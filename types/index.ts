import type { User, Lead, Thread, Message, Notification } from "@prisma/client";

// Domain Models
export interface Job extends Lead {
  homeowner: User;
  contractor?: User | null;
  acceptedBy?: User | null;
}

export interface JobWithDetails extends Job {
  savedBy: SavedJob[];
  charges: Charge[];
  Thread?: Thread | null;
}

export interface JobComment {
  id: string;
  jobId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

export interface ThreadWithMessages extends Thread {
  messages: Message[];
  homeowner: User;
  contractor: User;
}

export interface MessageWithUsers extends Message {
  fromUser: User;
  toUser: User;
}

export interface NotificationWithUser extends Notification {
  user: User;
}

// Contract types
export interface Contract {
  id: string;
  leadId: string;
  contractorId: string;
  homeownerId: string;
  content: string;
  status: "draft" | "sent" | "signed" | "completed";
  aiGenerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Billing types
export interface Billing {
  id: string;
  userId: string;
  spendThisMonthCents: number;
  monthlyCapCents: number;
  stripeCustomerId?: string | null;
  stripePaymentMethodId?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Charge {
  id: string;
  userId: string;
  leadId: string;
  amountCents: number;
  status: "pending" | "succeeded" | "failed";
  stripePaymentIntentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  contractor: {
    userId: string;
  };
}

// Additional types from existing models
export interface SavedJob {
  id: string;
  userId: string;
  leadId: string;
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User role types
export type UserRole = "admin" | "contractor" | "homeowner";

// Lead/Job status types
export type LeadStatus = "open" | "claimed" | "assigned" | "closed";

// Trade types for contractors
export type TradeType =
  | "general"
  | "plumbing"
  | "electrical"
  | "hvac"
  | "roofing"
  | "landscaping"
  | "painting"
  | "flooring"
  | "kitchen"
  | "bathroom";
