// DEPRECATED: /contractor/subscription - redirect to live pricing page.
import { redirect } from "next/navigation";
export default function DeprecatedSubscriptionPage() {
  redirect("/contractor/subscriptions");
}
