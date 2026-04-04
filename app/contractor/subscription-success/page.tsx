// DEPRECATED: /contractor/subscription-success - redirect to subscriptions.
import { redirect } from "next/navigation";
export default function DeprecatedSubscriptionSuccess() {
  redirect("/contractor/subscriptions");
}
