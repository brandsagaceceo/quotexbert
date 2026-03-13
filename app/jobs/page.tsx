import { redirect } from 'next/navigation';

/**
 * Legacy public /jobs route redirect
 * 
 * This route is preserved for backward compatibility.
 * Historically, /jobs was used as a public job board entry point.
 * Now redirects to /for-contractors (public contractor landing page).
 * 
 * Protected contractor job board is at /contractor/jobs (requires authentication).
 * 
 * Last updated: March 10, 2026
 */
export default function JobsRedirect() {
  redirect('/contractors/join');
}
