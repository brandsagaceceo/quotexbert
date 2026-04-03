// DEPRECATED — /contractor/subscription-success
// This route is no longer used. Stripe redirects to /contractor/subscriptions/success instead.
// Kept as a redirect so any old bookmarks still land correctly.
import { redirect } from "next/navigation";
export default function DeprecatedSubscriptionSuccess() {
  redirect("/contractor/subscriptions");
}
