# QuoteXBert — Final Pre-Launch Hardening QA Report

## All Changed Files (This Sprint)

### Security-Critical Changes
| File | Fix |
|------|-----|
| `app/api/threads/[threadId]/messages/route.ts` | **POST auth + sender verification** — Added `resolveAuthUser()` + 403 if sender ≠ caller. Prevents message spoofing. |
| `app/api/threads/[threadId]/route.ts` | **DELETE full participant check** — Removed `take: 1` limit; now verifies caller appears in ANY message, not just the first. |
| `lib/email.ts` | **HTML injection prevention** — Added `escHtml()` utility, `rawHtml` flag on EmailBlock, escaped all user-supplied values across 5+ email templates. |

### Race Condition / Data Integrity Fixes
| File | Fix |
|------|-----|
| `components/Chat.tsx` | **markMessagesRead race fix** — `hasMarkedReadRef.current = true` only set after successful `res.ok`, not before PATCH. |
| `app/api/jobs/[id]/accept/route.ts` | **Contractor lookup** — Replaced 2 sequential `findUnique` calls with single `findFirst({ OR: [{id}, {clerkUserId}] })`. |
| `app/api/jobs/[id]/accept/route.ts` | **Thread upsert** — Replaced find+create with `prisma.thread.upsert()` to prevent race when 2 contractors accept simultaneously. |

### Bug Fixes
| File | Fix |
|------|-----|
| `app/api/notifications/route.ts` | **Unread count accuracy** — Replaced `notifications.filter(!read).length` (capped at take:100) with `prisma.notification.count({ read: false })`. |
| `lib/email.ts` | **Text block escaping bug** — Was rendering `b.content` in both escaped/raw branches instead of using the escaped variable `c`. |
| `lib/email.ts` | **Copyright year** — `© 2025` → `© ${new Date().getFullYear()}`. |
| `app/messages/page.tsx` | **lastMessage index** — `thread.messages[thread.messages.length - 1]` → `thread.messages[0]` (API returns desc order). |

### UX Improvements
| File | Fix |
|------|-----|
| `components/Chat.tsx` | **Delete error handling** — Replaced browser `alert()` with state-based inline error display + cancel button. |
| `components/NotificationBell.tsx` | **Filter-aware empty state** — "All caught up!" when no notifications, "No {filter} notifications" + "View all" button when filtering. |
| `components/NotificationBell.tsx` | **Icon sizing** — Reduced from w-16 to w-12, strokeWidth 2→1.5 for better proportions. |

### Mobile Safe-Area Padding
| File | Fix |
|------|-----|
| `app/contractor/subscriptions/success/page.tsx` | Added `paddingBottom: calc(var(--bottom-nav-height) + safe-area-inset-bottom)` |
| `app/contractor/subscriptions/cancel/page.tsx` | Added `paddingBottom: calc(var(--bottom-nav-height) + safe-area-inset-bottom)` |
| `app/contractor/subscription/success/page.tsx` | Added `paddingBottom: calc(var(--bottom-nav-height) + safe-area-inset-bottom)` |
| `app/contractor/quotes/page.tsx` | Added `paddingBottom: calc(var(--bottom-nav-height) + safe-area-inset-bottom)` |
| `app/contractor/leads-map/page.tsx` | Added `paddingBottom: calc(var(--bottom-nav-height) + safe-area-inset-bottom)` |

---

## Schema / Migration Changes

**None.** No Prisma schema changes were made. No migrations needed.

---

## Verified Working (No Changes Needed)

- **Email URLs**: All use `process.env.NEXT_PUBLIC_BASE_URL || "https://quotexbert.com"` — no localhost references found
- **Profile page**: `/profile` is always the authenticated user's own profile (edit controls correct). `/contractors/profile/[id]` is public view-only (no edit controls).
- **Portfolio display**: Dates use `toLocaleDateString('en-CA', ...)` — human-readable. Like counts display via PortfolioLikeButton. Image fallbacks on error.
- **Performance**: All polling intervals have proper cleanup. No memory leaks found. No excessive re-renders.
- **Notification polling**: 30s interval with `visibilitychange` refetch — working correctly.
- **Chat polling**: 3s interval with proper cleanup — working correctly.
- **Typing indicator**: 5s TTL, stops on unmount — working correctly.

---

## Remaining Edge Cases / Risks

| Risk | Severity | Notes |
|------|----------|-------|
| Thread upsert by `leadId` | Low | If a job has no `leadId`, upsert would fail. Verify all jobs passed to accept route have IDs. |
| Email sends in dev | Low | Resend API will send real emails if `RESEND_API_KEY` is set in dev. Use test key or env guard. |
| Notification count query | Low | Additional DB query per notification GET. Acceptable for production traffic. |
| `escHtml()` coverage | Low | Only covers `& < > "`. Single quotes not escaped (not needed for double-quoted HTML attributes). |

---

## Full QA Checklist

### 🔐 Security Tests
- [ ] **Message spoofing**: POST to `/api/threads/[id]/messages` with a `fromUserId` that doesn't match the logged-in user → should return 403
- [ ] **Thread delete by non-participant**: DELETE `/api/threads/[id]` as a user who is not a participant in ANY message → should return 403
- [ ] **Email HTML injection**: Create a job with `<script>alert('xss')</script>` in the title → email should show escaped text, not run script
- [ ] **Unauthenticated message POST**: POST to `/api/threads/[id]/messages` without auth → should return 401

### 💬 Messaging Tests
- [ ] **Send message**: Homeowner sends message to contractor → appears in real-time (≤3s)
- [ ] **Read receipts**: Open a thread → unread messages marked as read, "Seen" appears on sender's side
- [ ] **Typing indicator**: Type in chat → other party sees "typing..." within 2s, disappears after 5s idle
- [ ] **Delete thread**: Delete a thread → confirm dialog appears, thread removed from list
- [ ] **Delete thread error**: Attempt to delete thread owned by other user → inline error shown (not alert)
- [ ] **Thread list order**: Most recent message thread appears first
- [ ] **Empty state**: No threads → role-appropriate "No conversations yet" message

### 🔔 Notification Tests
- [ ] **Job accepted notification**: Contractor accepts job → homeowner gets notification, NOT contractor
- [ ] **Badge count**: Create 101+ notifications → badge shows accurate count (not capped at 100)
- [ ] **Filter empty state**: Filter by "messages" with no message notifications → shows "No messages notifications" + "View all" button
- [ ] **Deep links**: Click notification → navigates to correct page (jobs, messages, etc.)
- [ ] **Mark all read**: Click "Mark all read" → badge clears, all notifications show as read
- [ ] **Polling**: Leave page idle 30s+ → new notifications appear without refresh
- [ ] **Tab visibility**: Switch away and back → notifications refresh immediately

### 👤 Profile Tests
- [ ] **Edit own profile**: Click "Edit Profile" → fields become editable, save works
- [ ] **Public contractor profile**: Visit `/contractors/profile/[id]` → no edit controls visible
- [ ] **Portfolio dates**: Portfolio items show human-readable dates (e.g., "Jan 15, 2024")
- [ ] **Portfolio likes**: Like button works, count updates

### 📱 Mobile Tests
- [ ] **Bottom nav overlap**: On each contractor page, scroll to bottom → all content/buttons visible above nav
- [ ] **Subscription success**: `/contractor/subscriptions/success` → CTA buttons not hidden by nav
- [ ] **Subscription cancel**: `/contractor/subscriptions/cancel` → all content visible
- [ ] **Quotes page**: Last quote entry fully visible above nav
- [ ] **Leads map**: "Accept" buttons on last job card accessible
- [ ] **Keyboard**: Open chat on iOS → keyboard pushes content up, input stays visible
- [ ] **Safe area**: On iPhone with notch → content respects safe area insets

### 📧 Email Tests
- [ ] **No localhost URLs**: All email links point to `https://quotexbert.com/...`
- [ ] **Job accepted email**: Contractor accepts job → homeowner receives email with correct job details
- [ ] **Message received email**: New message → recipient gets email with escaped preview text
- [ ] **Review received email**: New review → contractor gets email with escaped reviewer name/comment

### ⚡ Performance Tests
- [ ] **No console errors**: Open browser console, navigate all major pages → no errors
- [ ] **Chat scroll**: Open thread with 50+ messages → scrolls to bottom, no flicker
- [ ] **Interval cleanup**: Navigate away from chat/notifications → intervals properly stopped (check Network tab)

### 🔄 End-to-End Flow
- [ ] **Homeowner flow**: Register → Create job → Receive contractor acceptance → Chat → Leave review
- [ ] **Contractor flow**: Register → Subscribe → Browse jobs → Accept job → Chat → View metrics
- [ ] **Dual role**: User with both roles → can switch between homeowner/contractor views

---

## Files Modified (Complete List)

```
components/Chat.tsx
components/NotificationBell.tsx
app/api/threads/[threadId]/messages/route.ts
app/api/threads/[threadId]/route.ts
app/api/notifications/route.ts
app/api/jobs/[id]/accept/route.ts
app/messages/page.tsx
lib/email.ts
app/contractor/subscriptions/success/page.tsx
app/contractor/subscriptions/cancel/page.tsx
app/contractor/subscription/success/page.tsx
app/contractor/quotes/page.tsx
app/contractor/leads-map/page.tsx
```

**Total: 13 files modified, 0 schema changes, 0 new migrations required.**
