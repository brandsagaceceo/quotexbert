import { redirect } from "next/navigation";

export default function SubscriptionSuccess({ searchParams }: { searchParams: { session_id?: string | string[] } }) {
  const query = new URLSearchParams({ success: "true" });
  if (typeof searchParams.session_id === "string") query.set("session_id", searchParams.session_id);
  redirect(`/contractor/subscriptions?${query}`);
}
