-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "displayName" TEXT,
    "role" TEXT,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "subscriptionPlan" TEXT,
    "subscriptionStatus" TEXT,
    "subscriptionInterval" TEXT,
    "subscriptionCurrentPeriodStart" TIMESTAMP(3),
    "subscriptionCurrentPeriodEnd" TIMESTAMP(3),
    "selectedCategories" TEXT DEFAULT '[]',
    "proOverrideEnabled" BOOLEAN DEFAULT false,
    "proOverrideTier" TEXT,
    "proOverrideExpiresAt" TIMESTAMP(3),
    "proOverrideReason" TEXT,
    "proOverrideSetBy" TEXT,
    "proOverrideSetAt" TIMESTAMP(3),
    "clerkUserId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notifyJobEmail" BOOLEAN NOT NULL DEFAULT true,
    "notifyJobInApp" BOOLEAN NOT NULL DEFAULT true,
    "notifyMessageEmail" BOOLEAN NOT NULL DEFAULT true,
    "notifyMessageInApp" BOOLEAN NOT NULL DEFAULT true,
    "notifyMarketingEmail" BOOLEAN NOT NULL DEFAULT false,
    "digestFrequency" TEXT NOT NULL DEFAULT 'daily',
    "lastContractorDigestAt" TIMESTAMP(3),
    "lastHomeownerDigestAt" TIMESTAMP(3),
    "referredByAffiliateId" TEXT,
    "avgHomeownerRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "homeownerRatingCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contractor_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "slug" TEXT,
    "trade" TEXT NOT NULL,
    "bio" TEXT,
    "city" TEXT,
    "serviceRadiusKm" INTEGER NOT NULL DEFAULT 25,
    "website" TEXT,
    "phone" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "avgRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "completedJobs" INTEGER NOT NULL DEFAULT 0,
    "categories" TEXT NOT NULL DEFAULT '[]',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "profilePhoto" TEXT,
    "coverPhoto" TEXT,
    "businessLogo" TEXT,
    "avgResponseTimeMinutes" INTEGER,
    "responseTimeLabel" TEXT,
    "totalResponses" INTEGER NOT NULL DEFAULT 0,
    "lastResponseCalculated" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contractor_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."leads" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "budget" TEXT,
    "city" TEXT,
    "province" TEXT,
    "zipCode" TEXT,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "claimed" BOOLEAN NOT NULL DEFAULT false,
    "claimedBy" TEXT,
    "claimedAt" TIMESTAMP(3),
    "published" BOOLEAN NOT NULL DEFAULT false,
    "isSeeded" BOOLEAN NOT NULL DEFAULT false,
    "photos" TEXT NOT NULL DEFAULT '[]',
    "userId" TEXT,
    "maxContractors" INTEGER NOT NULL DEFAULT 3,
    "acceptedContractors" TEXT NOT NULL DEFAULT '[]',
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "followUpSent" BOOLEAN NOT NULL DEFAULT false,
    "viewedNoBidFollowUpSent" BOOLEAN NOT NULL DEFAULT false,
    "homeownerId" TEXT NOT NULL,
    "contractorId" TEXT,
    "completedAt" TIMESTAMP(3),
    "contractorCompletedAt" TIMESTAMP(3),
    "homeownerConfirmedAt" TIMESTAMP(3),
    "acceptedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."job_applications" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "contractorId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "message" TEXT,
    "proposedPrice" TEXT,
    "estimatedDays" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."job_acceptances" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "contractorId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'accepted',
    "message" TEXT,
    "quoteAmount" TEXT,
    "estimatedDays" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_acceptances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."saved_jobs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."threads" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "threads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."messages" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."typing_indicators" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "typing_indicators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "payload" JSONB,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "relatedId" TEXT,
    "relatedType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."affiliates" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "email" TEXT,
    "referralCode" TEXT NOT NULL,
    "payoutPercent" INTEGER NOT NULL DEFAULT 20,
    "notes" TEXT,

    CONSTRAINT "affiliates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."referrals" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "affiliateId" TEXT NOT NULL,
    "leadId" TEXT,
    "visitorIp" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."affiliate_commissions" (
    "id" TEXT NOT NULL,
    "affiliateId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "stripeInvoiceId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL DEFAULT 0.20,
    "period" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "affiliate_commissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pro_memberships" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "stripeId" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pro_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contractor_billing" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeCustomerId" TEXT,
    "monthlyCapCents" INTEGER NOT NULL DEFAULT 5000,
    "isPaused" BOOLEAN NOT NULL DEFAULT false,
    "spendThisMonthCents" INTEGER NOT NULL DEFAULT 0,
    "resetOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contractor_billing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."charges" (
    "id" TEXT NOT NULL,
    "contractorId" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "stripePaymentIntentId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "charges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."lead_pricing" (
    "id" TEXT NOT NULL,
    "trade" TEXT NOT NULL,
    "city" TEXT NOT NULL DEFAULT 'default',
    "priceCents" INTEGER NOT NULL DEFAULT 900,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lead_pricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contracts" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "homeownerId" TEXT NOT NULL,
    "contractorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "scope" TEXT NOT NULL DEFAULT '',
    "totalAmountCents" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "homeownerAccepted" BOOLEAN NOT NULL DEFAULT false,
    "contractorAccepted" BOOLEAN NOT NULL DEFAULT false,
    "pdfUrl" TEXT,
    "sentAt" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contract_items" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contract_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."homeowner_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT,
    "city" TEXT,
    "phone" TEXT,
    "profilePhoto" TEXT,
    "coverPhoto" TEXT,
    "bio" TEXT,
    "homeType" TEXT,
    "preferredRenovationTypes" TEXT NOT NULL DEFAULT '[]',
    "budgetRange" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homeowner_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."portfolio_items" (
    "id" TEXT NOT NULL,
    "contractorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "caption" TEXT,
    "projectType" TEXT NOT NULL DEFAULT 'general',
    "beforeImages" TEXT NOT NULL DEFAULT '[]',
    "afterImages" TEXT NOT NULL DEFAULT '[]',
    "imageUrl" TEXT,
    "projectCost" TEXT,
    "duration" TEXT,
    "materials" TEXT,
    "location" TEXT,
    "clientStory" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portfolio_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."portfolio_likes" (
    "id" TEXT NOT NULL,
    "portfolioItemId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "portfolio_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reviews" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "contractorId" TEXT NOT NULL,
    "homeownerId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "text" TEXT,
    "qualityRating" INTEGER,
    "timelinessRating" INTEGER,
    "communicationRating" INTEGER,
    "cleanlinessRating" INTEGER,
    "valueRating" INTEGER,
    "projectType" TEXT,
    "projectCost" DOUBLE PRECISION,
    "projectDuration" TEXT,
    "status" TEXT NOT NULL DEFAULT 'published',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "helpfulCount" INTEGER NOT NULL DEFAULT 0,
    "responseText" TEXT,
    "responseDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contractor_notifications" (
    "id" TEXT NOT NULL,
    "contractorId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "jobId" TEXT,
    "leadId" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contractor_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."conversations" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "homeownerId" TEXT NOT NULL,
    "contractorId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "lastMessageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."conversation_messages" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "senderRole" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "receiverRole" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'text',
    "attachments" TEXT NOT NULL DEFAULT '[]',
    "readAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversation_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."quotes" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "contractorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "laborCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "materialCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalCost" DOUBLE PRECISION NOT NULL,
    "aiAnalysis" TEXT,
    "extractedRequirements" TEXT,
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "version" INTEGER NOT NULL DEFAULT 1,
    "parentQuoteId" TEXT,
    "revisionNote" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "sentAt" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."quote_items" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quote_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contractor_subscriptions" (
    "id" TEXT NOT NULL,
    "contractorId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "monthlyPrice" DOUBLE PRECISION NOT NULL DEFAULT 29.99,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "stripeSubscriptionId" TEXT,
    "stripeCustomerId" TEXT,
    "stripePriceId" TEXT,
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "nextBillingDate" TIMESTAMP(3),
    "trialStart" TIMESTAMP(3),
    "trialEnd" TIMESTAMP(3),
    "canceledAt" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "canClaimLeads" BOOLEAN NOT NULL DEFAULT true,
    "canViewLeads" BOOLEAN NOT NULL DEFAULT true,
    "leadsThisMonth" INTEGER NOT NULL DEFAULT 0,
    "monthlyLeadLimit" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contractor_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payment_methods" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripePaymentMethodId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "last4" TEXT,
    "brand" TEXT,
    "expMonth" INTEGER,
    "expYear" INTEGER,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."transactions" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT,
    "stripeTransactionId" TEXT,
    "stripeInvoiceId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "periodStart" TIMESTAMP(3),
    "periodEnd" TIMESTAMP(3),
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."quote_learning_signals" (
    "id" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "quoteId" TEXT,
    "conversationId" TEXT,
    "leadId" TEXT,
    "category" TEXT,
    "city" TEXT,
    "aiEstimateLow" DOUBLE PRECISION,
    "aiEstimateHigh" DOUBLE PRECISION,
    "quoteTotalCost" DOUBLE PRECISION,
    "version" INTEGER,
    "isRevision" BOOLEAN NOT NULL DEFAULT false,
    "outcome" TEXT,
    "createdByRole" TEXT,
    "priceDelta" DOUBLE PRECISION,
    "isAcceptedVersion" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quote_learning_signals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."analytics" (
    "id" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "eventData" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "sessionId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ai_estimates" (
    "id" TEXT NOT NULL,
    "homeownerId" TEXT,
    "description" TEXT NOT NULL,
    "minCost" DOUBLE PRECISION NOT NULL,
    "maxCost" DOUBLE PRECISION NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "aiPowered" BOOLEAN NOT NULL DEFAULT true,
    "enhancedDescription" TEXT,
    "factors" TEXT NOT NULL DEFAULT '[]',
    "reasoning" TEXT,
    "hasVoice" BOOLEAN NOT NULL DEFAULT false,
    "imageCount" INTEGER NOT NULL DEFAULT 0,
    "images" TEXT NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "leadId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_estimates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."estimate_items" (
    "id" TEXT NOT NULL,
    "estimateId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "minCost" DOUBLE PRECISION NOT NULL,
    "maxCost" DOUBLE PRECISION NOT NULL,
    "selected" BOOLEAN NOT NULL DEFAULT true,
    "quantity" DOUBLE PRECISION,
    "unit" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "estimate_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."saved_projects" (
    "id" TEXT NOT NULL,
    "homeownerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "city" TEXT,
    "province" TEXT,
    "zipCode" TEXT,
    "location" TEXT,
    "budget" TEXT,
    "photos" TEXT NOT NULL DEFAULT '[]',
    "visualizerImages" TEXT NOT NULL DEFAULT '[]',
    "aiEstimateId" TEXT,
    "estimateSummary" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "postedAsLeadId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "saved_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."visualizer_subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "stripeSubscriptionId" TEXT,
    "monthlyGenerationsUsed" INTEGER NOT NULL DEFAULT 0,
    "lastResetDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "freeMonthlyLimit" INTEGER NOT NULL DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visualizer_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."visualizer_generations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "beforeImageUrl" TEXT NOT NULL,
    "afterImageUrl" TEXT NOT NULL,
    "roomType" TEXT,
    "flooringStyle" TEXT,
    "flooringColor" TEXT,
    "wallColor" TEXT,
    "designStyle" TEXT,
    "customRequest" TEXT,
    "aiModel" TEXT,
    "promptUsed" TEXT,
    "processingTime" INTEGER,
    "wasSentToQuote" BOOLEAN NOT NULL DEFAULT false,
    "quoteId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visualizer_generations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."email_events" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "userId" TEXT,
    "relatedJobId" TEXT,
    "relatedMessageId" TEXT,
    "status" TEXT NOT NULL,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."homeowner_ratings" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "contractorId" TEXT NOT NULL,
    "homeownerId" TEXT NOT NULL,
    "overallRating" INTEGER NOT NULL,
    "communicationRating" INTEGER,
    "clarityRating" INTEGER,
    "responsivenessRating" INTEGER,
    "paymentRating" INTEGER,
    "accessReadinessRating" INTEGER,
    "professionalismRating" INTEGER,
    "privateNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homeowner_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."affiliate_leads" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "refCode" TEXT,
    "landingUrl" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "affiliate_leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."stripe_webhook_logs" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "data" TEXT,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stripe_webhook_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contractor_referrals" (
    "id" TEXT NOT NULL,
    "referrerId" TEXT NOT NULL,
    "referredEmail" TEXT NOT NULL,
    "referredUserId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "rewardEarned" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contractor_referrals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."homeowner_referrals" (
    "id" TEXT NOT NULL,
    "referrerId" TEXT NOT NULL,
    "referredEmail" TEXT,
    "referredUserId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "estimateCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homeowner_referrals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."activity_feed_events" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT,
    "city" TEXT NOT NULL,
    "estimate" INTEGER,
    "contractorName" TEXT,
    "rating" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_feed_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripeCustomerId_key" ON "public"."users"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripeSubscriptionId_key" ON "public"."users"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "users_clerkUserId_key" ON "public"."users"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "contractor_profiles_userId_key" ON "public"."contractor_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "contractor_profiles_slug_key" ON "public"."contractor_profiles"("slug");

-- CreateIndex
CREATE INDEX "leads_category_idx" ON "public"."leads"("category");

-- CreateIndex
CREATE INDEX "leads_zipCode_idx" ON "public"."leads"("zipCode");

-- CreateIndex
CREATE INDEX "leads_status_idx" ON "public"."leads"("status");

-- CreateIndex
CREATE INDEX "leads_published_idx" ON "public"."leads"("published");

-- CreateIndex
CREATE INDEX "job_applications_contractorId_idx" ON "public"."job_applications"("contractorId");

-- CreateIndex
CREATE INDEX "job_applications_leadId_idx" ON "public"."job_applications"("leadId");

-- CreateIndex
CREATE INDEX "job_applications_status_idx" ON "public"."job_applications"("status");

-- CreateIndex
CREATE UNIQUE INDEX "job_applications_leadId_contractorId_key" ON "public"."job_applications"("leadId", "contractorId");

-- CreateIndex
CREATE INDEX "job_acceptances_contractorId_idx" ON "public"."job_acceptances"("contractorId");

-- CreateIndex
CREATE INDEX "job_acceptances_leadId_idx" ON "public"."job_acceptances"("leadId");

-- CreateIndex
CREATE INDEX "job_acceptances_status_idx" ON "public"."job_acceptances"("status");

-- CreateIndex
CREATE UNIQUE INDEX "job_acceptances_leadId_contractorId_key" ON "public"."job_acceptances"("leadId", "contractorId");

-- CreateIndex
CREATE UNIQUE INDEX "saved_jobs_userId_jobId_key" ON "public"."saved_jobs"("userId", "jobId");

-- CreateIndex
CREATE UNIQUE INDEX "threads_leadId_key" ON "public"."threads"("leadId");

-- CreateIndex
CREATE INDEX "messages_threadId_createdAt_idx" ON "public"."messages"("threadId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "typing_indicators_threadId_userId_key" ON "public"."typing_indicators"("threadId", "userId");

-- CreateIndex
CREATE INDEX "notifications_userId_read_createdAt_idx" ON "public"."notifications"("userId", "read", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "affiliates_email_key" ON "public"."affiliates"("email");

-- CreateIndex
CREATE UNIQUE INDEX "affiliates_referralCode_key" ON "public"."affiliates"("referralCode");

-- CreateIndex
CREATE UNIQUE INDEX "affiliate_commissions_stripeInvoiceId_key" ON "public"."affiliate_commissions"("stripeInvoiceId");

-- CreateIndex
CREATE INDEX "affiliate_commissions_affiliateId_status_idx" ON "public"."affiliate_commissions"("affiliateId", "status");

-- CreateIndex
CREATE INDEX "affiliate_commissions_userId_idx" ON "public"."affiliate_commissions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "pro_memberships_email_key" ON "public"."pro_memberships"("email");

-- CreateIndex
CREATE UNIQUE INDEX "contractor_billing_userId_key" ON "public"."contractor_billing"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "contractor_billing_stripeCustomerId_key" ON "public"."contractor_billing"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "charges_stripePaymentIntentId_key" ON "public"."charges"("stripePaymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "lead_pricing_trade_key" ON "public"."lead_pricing"("trade");

-- CreateIndex
CREATE UNIQUE INDEX "lead_pricing_trade_city_key" ON "public"."lead_pricing"("trade", "city");

-- CreateIndex
CREATE UNIQUE INDEX "contracts_leadId_key" ON "public"."contracts"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "homeowner_profiles_userId_key" ON "public"."homeowner_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "portfolio_likes_portfolioItemId_userId_key" ON "public"."portfolio_likes"("portfolioItemId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_leadId_homeownerId_key" ON "public"."reviews"("leadId", "homeownerId");

-- CreateIndex
CREATE INDEX "contractor_notifications_contractorId_read_idx" ON "public"."contractor_notifications"("contractorId", "read");

-- CreateIndex
CREATE INDEX "contractor_notifications_createdAt_idx" ON "public"."contractor_notifications"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "conversations_jobId_homeownerId_contractorId_key" ON "public"."conversations"("jobId", "homeownerId", "contractorId");

-- CreateIndex
CREATE INDEX "conversation_messages_conversationId_createdAt_idx" ON "public"."conversation_messages"("conversationId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "contractor_subscriptions_contractorId_category_key" ON "public"."contractor_subscriptions"("contractorId", "category");

-- CreateIndex
CREATE UNIQUE INDEX "payment_methods_stripePaymentMethodId_key" ON "public"."payment_methods"("stripePaymentMethodId");

-- CreateIndex
CREATE INDEX "quote_learning_signals_event_createdAt_idx" ON "public"."quote_learning_signals"("event", "createdAt");

-- CreateIndex
CREATE INDEX "quote_learning_signals_quoteId_idx" ON "public"."quote_learning_signals"("quoteId");

-- CreateIndex
CREATE INDEX "quote_learning_signals_conversationId_idx" ON "public"."quote_learning_signals"("conversationId");

-- CreateIndex
CREATE INDEX "quote_learning_signals_category_createdAt_idx" ON "public"."quote_learning_signals"("category", "createdAt");

-- CreateIndex
CREATE INDEX "quote_learning_signals_city_createdAt_idx" ON "public"."quote_learning_signals"("city", "createdAt");

-- CreateIndex
CREATE INDEX "analytics_eventName_timestamp_idx" ON "public"."analytics"("eventName", "timestamp");

-- CreateIndex
CREATE INDEX "analytics_userId_timestamp_idx" ON "public"."analytics"("userId", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "ai_estimates_leadId_key" ON "public"."ai_estimates"("leadId");

-- CreateIndex
CREATE INDEX "ai_estimates_homeownerId_idx" ON "public"."ai_estimates"("homeownerId");

-- CreateIndex
CREATE INDEX "ai_estimates_status_idx" ON "public"."ai_estimates"("status");

-- CreateIndex
CREATE INDEX "ai_estimates_isPublic_idx" ON "public"."ai_estimates"("isPublic");

-- CreateIndex
CREATE INDEX "ai_estimates_createdAt_idx" ON "public"."ai_estimates"("createdAt");

-- CreateIndex
CREATE INDEX "estimate_items_estimateId_idx" ON "public"."estimate_items"("estimateId");

-- CreateIndex
CREATE UNIQUE INDEX "saved_projects_aiEstimateId_key" ON "public"."saved_projects"("aiEstimateId");

-- CreateIndex
CREATE UNIQUE INDEX "saved_projects_postedAsLeadId_key" ON "public"."saved_projects"("postedAsLeadId");

-- CreateIndex
CREATE INDEX "saved_projects_homeownerId_idx" ON "public"."saved_projects"("homeownerId");

-- CreateIndex
CREATE INDEX "saved_projects_status_idx" ON "public"."saved_projects"("status");

-- CreateIndex
CREATE INDEX "saved_projects_category_idx" ON "public"."saved_projects"("category");

-- CreateIndex
CREATE INDEX "saved_projects_createdAt_idx" ON "public"."saved_projects"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "visualizer_subscriptions_userId_key" ON "public"."visualizer_subscriptions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "visualizer_subscriptions_stripeSubscriptionId_key" ON "public"."visualizer_subscriptions"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "visualizer_generations_userId_idx" ON "public"."visualizer_generations"("userId");

-- CreateIndex
CREATE INDEX "visualizer_generations_createdAt_idx" ON "public"."visualizer_generations"("createdAt");

-- CreateIndex
CREATE INDEX "email_events_userId_idx" ON "public"."email_events"("userId");

-- CreateIndex
CREATE INDEX "email_events_type_idx" ON "public"."email_events"("type");

-- CreateIndex
CREATE INDEX "email_events_createdAt_idx" ON "public"."email_events"("createdAt");

-- CreateIndex
CREATE INDEX "homeowner_ratings_homeownerId_idx" ON "public"."homeowner_ratings"("homeownerId");

-- CreateIndex
CREATE INDEX "homeowner_ratings_contractorId_idx" ON "public"."homeowner_ratings"("contractorId");

-- CreateIndex
CREATE UNIQUE INDEX "homeowner_ratings_leadId_contractorId_key" ON "public"."homeowner_ratings"("leadId", "contractorId");

-- CreateIndex
CREATE UNIQUE INDEX "affiliate_leads_email_key" ON "public"."affiliate_leads"("email");

-- CreateIndex
CREATE INDEX "affiliate_leads_email_idx" ON "public"."affiliate_leads"("email");

-- CreateIndex
CREATE INDEX "affiliate_leads_refCode_idx" ON "public"."affiliate_leads"("refCode");

-- CreateIndex
CREATE INDEX "affiliate_leads_createdAt_idx" ON "public"."affiliate_leads"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "stripe_webhook_logs_eventId_key" ON "public"."stripe_webhook_logs"("eventId");

-- CreateIndex
CREATE INDEX "stripe_webhook_logs_type_idx" ON "public"."stripe_webhook_logs"("type");

-- CreateIndex
CREATE INDEX "stripe_webhook_logs_createdAt_idx" ON "public"."stripe_webhook_logs"("createdAt");

-- CreateIndex
CREATE INDEX "stripe_webhook_logs_processed_idx" ON "public"."stripe_webhook_logs"("processed");

-- CreateIndex
CREATE INDEX "contractor_referrals_referrerId_idx" ON "public"."contractor_referrals"("referrerId");

-- CreateIndex
CREATE INDEX "contractor_referrals_referredEmail_idx" ON "public"."contractor_referrals"("referredEmail");

-- CreateIndex
CREATE INDEX "contractor_referrals_status_idx" ON "public"."contractor_referrals"("status");

-- CreateIndex
CREATE INDEX "homeowner_referrals_referrerId_idx" ON "public"."homeowner_referrals"("referrerId");

-- CreateIndex
CREATE INDEX "homeowner_referrals_status_idx" ON "public"."homeowner_referrals"("status");

-- CreateIndex
CREATE INDEX "activity_feed_events_type_idx" ON "public"."activity_feed_events"("type");

-- CreateIndex
CREATE INDEX "activity_feed_events_createdAt_idx" ON "public"."activity_feed_events"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."contractor_profiles" ADD CONSTRAINT "contractor_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."leads" ADD CONSTRAINT "leads_homeownerId_fkey" FOREIGN KEY ("homeownerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."leads" ADD CONSTRAINT "leads_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."leads" ADD CONSTRAINT "leads_acceptedById_fkey" FOREIGN KEY ("acceptedById") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."job_applications" ADD CONSTRAINT "job_applications_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."job_applications" ADD CONSTRAINT "job_applications_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."job_acceptances" ADD CONSTRAINT "job_acceptances_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."job_acceptances" ADD CONSTRAINT "job_acceptances_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."saved_jobs" ADD CONSTRAINT "saved_jobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."saved_jobs" ADD CONSTRAINT "saved_jobs_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."threads" ADD CONSTRAINT "threads_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "public"."threads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."typing_indicators" ADD CONSTRAINT "typing_indicators_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."affiliate_commissions" ADD CONSTRAINT "affiliate_commissions_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "public"."affiliates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contractor_billing" ADD CONSTRAINT "contractor_billing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."charges" ADD CONSTRAINT "charges_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "public"."contractor_billing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."charges" ADD CONSTRAINT "charges_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contracts" ADD CONSTRAINT "contracts_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contracts" ADD CONSTRAINT "contracts_homeownerId_fkey" FOREIGN KEY ("homeownerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contracts" ADD CONSTRAINT "contracts_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contract_items" ADD CONSTRAINT "contract_items_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "public"."contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."homeowner_profiles" ADD CONSTRAINT "homeowner_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."portfolio_items" ADD CONSTRAINT "portfolio_items_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "public"."contractor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."portfolio_likes" ADD CONSTRAINT "portfolio_likes_portfolioItemId_fkey" FOREIGN KEY ("portfolioItemId") REFERENCES "public"."portfolio_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."portfolio_likes" ADD CONSTRAINT "portfolio_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_homeownerId_fkey" FOREIGN KEY ("homeownerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contractor_notifications" ADD CONSTRAINT "contractor_notifications_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "public"."contractor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."conversations" ADD CONSTRAINT "conversations_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."conversations" ADD CONSTRAINT "conversations_homeownerId_fkey" FOREIGN KEY ("homeownerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."conversations" ADD CONSTRAINT "conversations_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."conversation_messages" ADD CONSTRAINT "conversation_messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."conversation_messages" ADD CONSTRAINT "conversation_messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."conversation_messages" ADD CONSTRAINT "conversation_messages_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quotes" ADD CONSTRAINT "quotes_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quotes" ADD CONSTRAINT "quotes_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quotes" ADD CONSTRAINT "quotes_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quote_items" ADD CONSTRAINT "quote_items_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "public"."quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contractor_subscriptions" ADD CONSTRAINT "contractor_subscriptions_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payment_methods" ADD CONSTRAINT "payment_methods_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "public"."contractor_subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ai_estimates" ADD CONSTRAINT "ai_estimates_homeownerId_fkey" FOREIGN KEY ("homeownerId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ai_estimates" ADD CONSTRAINT "ai_estimates_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."estimate_items" ADD CONSTRAINT "estimate_items_estimateId_fkey" FOREIGN KEY ("estimateId") REFERENCES "public"."ai_estimates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."saved_projects" ADD CONSTRAINT "saved_projects_homeownerId_fkey" FOREIGN KEY ("homeownerId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."saved_projects" ADD CONSTRAINT "saved_projects_aiEstimateId_fkey" FOREIGN KEY ("aiEstimateId") REFERENCES "public"."ai_estimates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."saved_projects" ADD CONSTRAINT "saved_projects_postedAsLeadId_fkey" FOREIGN KEY ("postedAsLeadId") REFERENCES "public"."leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."visualizer_subscriptions" ADD CONSTRAINT "visualizer_subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."visualizer_generations" ADD CONSTRAINT "visualizer_generations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."homeowner_ratings" ADD CONSTRAINT "homeowner_ratings_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."homeowner_ratings" ADD CONSTRAINT "homeowner_ratings_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."homeowner_ratings" ADD CONSTRAINT "homeowner_ratings_homeownerId_fkey" FOREIGN KEY ("homeownerId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

