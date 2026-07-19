-- One Stripe subscription can back multiple category entitlement rows.
-- The per-contractor/category uniqueness constraint remains the duplicate guard.
DROP INDEX IF EXISTS "contractor_subscriptions_stripeSubscriptionId_key";