# QuoteXbert Mobile UX/UI Modernization - QA Checklist

## Test Devices
- iPhone 13 Mini (360px width)
- iPhone 14/15 (390px width)  
- iPhone 14/15 Pro Max (430px width)
- Test in Safari (primary) and Chrome iOS

## Global Mobile Shell - PART A

### Header & Content Spacing
- [ ] Fixed header doesn't cover page content
- [ ] Content has proper top padding (64px + safe area)
- [ ] No content hidden behind header on scroll
- [ ] Safe area insets working on notched devices

### Bottom Navigation
- [ ] Bottom nav remains tappable at all times
- [ ] Bottom nav respects safe-area-inset-bottom
- [ ] Floating action buttons sit above bottom nav
- [ ] No overlap between bottom nav and page content

### Horizontal Overflow
- [ ] No horizontal scrolling on any page
- [ ] All containers fit within viewport width
- [ ] Long text truncates with ellipsis
- [ ] Images/cards don't cause overflow
- [ ] Form inputs respect container width

### Floating Actions (FloatingActionStack)
- [ ] Help button visible on appropriate pages
- [ ] Edit button visible on profile (when not editing)
- [ ] Buttons positioned correctly (12px from right, above bottom nav)
- [ ] Buttons hide when keyboard opens
- [ ] Touch targets >= 44px
- [ ] Buttons don't overlap CTAs or content

### Help Dialog Behavior
- [ ] Auto-opens max once per session
- [ ] Auto-opens max once per 24h
- [ ] Respects dismissal (helpDismissedAt in localStorage)
- [ ] Manual open still works
- [ ] Doesn't spam on navigation

---

## Profile Page - PART B

### Profile Header
- [ ] Avatar displays correctly (80x80 mobile, 96x96 tablet)
- [ ] Edit button inline with header (not floating)
- [ ] Name truncates if too long
- [ ] Role badge visible and styled
- [ ] Verified badge shows for contractors
- [ ] Contact info never overflows
- [ ] Email truncates with ellipsis
- [ ] Phone number formatted correctly
- [ ] Website link truncates properly

### Profile Completion Meter (for incomplete profiles)
- [ ] Shows on profiles < 100% complete
- [ ] Progress bar animates smoothly
- [ ] Lists missing items clearly
- [ ] Hides when profile is 100% complete
- [ ] Contractor requirements: photo, company, trade, city, bio, phone
- [ ] Homeowner requirements: photo, city, phone

### Tabs/Sections
- [ ] Tab bar sticky under header
- [ ] Tab bar doesn't overlap content
- [ ] Active tab clearly indicated (blue underline)
- [ ] Tabs scrollable horizontally if needed
- [ ] Touch targets >= 44px for tabs
- [ ] Content loads correctly per tab

### Profile Content
- [ ] Overview tab: bio, stats, completion meter
- [ ] Portfolio tab: grid layout, no overflow
- [ ] Jobs tab: list view, status badges
- [ ] Contact tab: editable fields
- [ ] Forms have proper spacing on mobile
- [ ] Input fields use 16px font (prevent iOS zoom)
- [ ] Save/Cancel buttons accessible

### Edit Mode
- [ ] Toggle to edit mode works
- [ ] Save button changes to green
- [ ] Cancel button visible
- [ ] Photo upload works (shows preview)
- [ ] Form validation shows inline errors
- [ ] Save success shows feedback
- [ ] Save error shows clear message with requestId

### Accessibility
- [ ] All buttons >= 44x44px touch target
- [ ] Form labels associated with inputs
- [ ] Focus states visible
- [ ] Error messages readable
- [ ] Color contrast meets WCAG AA

---

## Chat/Messaging - PART C

### Layout & Navigation
- [ ] Conversation list visible on mobile
- [ ] Selected conversation opens full-screen
- [ ] Back button returns to conversation list
- [ ] Header shows participant name and job context
- [ ] Action buttons (phone/video) accessible but optional

### Message Bubbles
- [ ] Own messages align right (blue/purple gradient)
- [ ] Received messages align left (white with border)
- [ ] Consecutive messages from same sender grouped
- [ ] Avatar shows for received messages
- [ ] Timestamps relative ("5m ago", "Just now")
- [ ] Read receipts show on own messages (checkmark)
- [ ] Long messages wrap correctly
- [ ] No horizontal overflow in bubbles

### Image Attachments
- [ ] Photo icon button visible
- [ ] File picker opens on button tap
- [ ] Image preview shows before send
- [ ] Preview has cancel button (X)
- [ ] Preview max dimensions: 200x200px
- [ ] Send button enabled with image only (no text required)
- [ ] Images render in chat after sending
- [ ] Tap image to expand (modal - future enhancement)

### Composer/Input
- [ ] Input field auto-focuses on conversation select
- [ ] Input field expands with text (multi-line)
- [ ] Keyboard pushes composer up (not overlapping)
- [ ] Send button disabled when empty
- [ ] Send button shows spinner when sending
- [ ] Touch targets >= 44px for buttons
- [ ] Photo button and send button clear

### Message Sending
- [ ] Optimistic UI: message appears immediately
- [ ] Message updates after server confirms
- [ ] Failed messages show error inline
- [ ] Error message: "Network error. Please check your connection..."
- [ ] Retry option on failure (future enhancement)
- [ ] No generic "Failed to send" alerts

### Empty States
- [ ] No conversations: "No conversations yet" with icon
- [ ] No messages: "No messages yet — ask a quick question"
- [ ] Loading state: spinner with "Loading..."
- [ ] Error state: helpful message + retry button

### Mobile Keyboard
- [ ] Keyboard opens smoothly
- [ ] Composer stays above keyboard
- [ ] Messages list stays scrollable
- [ ] Auto-scroll to newest message on keyboard open
- [ ] Keyboard closes on send
- [ ] Keyboard closes on back navigation

---

## Estimate & Job Posting Flows - PART D

### AI Estimate Results
- [ ] Quote summary card clearly visible
- [ ] Line items formatted properly
- [ ] Total cost prominent and readable
- [ ] "Download PDF" button accessible
- [ ] "Share" button works
- [ ] No horizontal clipping of content
- [ ] Mobile-friendly card spacing

### Photo Upload (Job Posting)
- [ ] File picker opens on "Add Photo" button
- [ ] Preview uses local URL (URL.createObjectURL)
- [ ] Multiple photos show as grid
- [ ] Each preview has remove button
- [ ] Upload progress shows "Uploading 1/8..."
- [ ] Progress bar visible and accurate
- [ ] Failed uploads show error inline
- [ ] Can retry failed uploads

### Form Validation
- [ ] Required fields marked clearly
- [ ] Inline errors show on blur
- [ ] Error message: specific ("Title is required", not "Invalid input")
- [ ] Submit button disabled until valid
- [ ] Success message after save
- [ ] Error message includes requestId for debugging

### Tooltips & Help
- [ ] "How it works" tooltip shows max once per session
- [ ] Tooltip doesn't auto-open repeatedly
- [ ] Tooltip closeable with X button
- [ ] Help button in FloatingActionStack available
- [ ] Help content readable on mobile

---

## Cross-Page Tests

### Navigation
- [ ] Bottom nav works on all pages
- [ ] Back buttons function correctly
- [ ] Breadcrumbs visible where appropriate
- [ ] Deep links work (open specific job, conversation, etc.)

### Performance
- [ ] Pages load < 3s on 3G
- [ ] Images lazy-load
- [ ] No layout shift (CLS)
- [ ] Smooth scrolling
- [ ] No janky animations

### Offline Behavior
- [ ] Graceful degradation when offline
- [ ] Clear "You're offline" message
- [ ] Retry button when connection restored
- [ ] Cached data shows when possible

---

## Browser-Specific Tests

### Safari iOS
- [ ] 100vh doesn't cause bottom cut-off
- [ ] Input zoom doesn't occur (16px font)
- [ ] Touch gestures work (swipe, pinch)
- [ ] Safe area insets respected
- [ ] Auto-fill works for forms

### Chrome iOS
- [ ] Same tests as Safari
- [ ] Address bar behavior consistent
- [ ] No weird scrolling issues

---

## Accessibility Tests

### Screen Reader
- [ ] All images have alt text
- [ ] Buttons have aria-labels
- [ ] Form inputs have labels
- [ ] Error messages announced
- [ ] Navigation landmarks present

### Keyboard Navigation
- [ ] Can tab through all interactive elements
- [ ] Focus visible on all elements
- [ ] Can submit forms with Enter
- [ ] Can close modals with Escape

### Color Contrast
- [ ] Text meets WCAG AA (4.5:1)
- [ ] Buttons meet WCAG AA
- [ ] Error states clearly visible
- [ ] Links distinguishable from text

---

## Regression Tests

### Existing Features
- [ ] Sign in/sign up still works
- [ ] Contractor subscription flow works
- [ ] Job board filtering works
- [ ] Estimate generation works
- [ ] Profile editing saves correctly
- [ ] Portfolio items can be added/edited/deleted
- [ ] Messages send and receive
- [ ] Notifications work

---

## Performance Metrics

### Load Times (3G)
- [ ] Homepage < 3s
- [ ] Profile page < 3s
- [ ] Chat page < 2s
- [ ] Job board < 3s

### Bundle Size
- [ ] No significant increase from modernization
- [ ] Code splitting working
- [ ] Images optimized

---

## Files Changed Summary

### New Components
1. `components/FloatingActionStack.tsx` - Floating action buttons with keyboard awareness
2. `components/ProfileCompletionMeter.tsx` - Profile completion progress indicator
3. `components/ProfileHeader.tsx` - Modern, compact profile header

### Modified Files
1. `app/layout.tsx` - Added content padding for header
2. `styles/mobile.css` - Added CSS variables, overflow fixes
3. `app/conversations/page.tsx` - Added image attachments, optimistic UI, error handling
4. `app/profile/page.tsx` - Will integrate new header component (in progress)

### Configuration
1. CSS variables: `--header-height`, `--bottom-nav-height`
2. localStorage keys: `helpAutoOpenedAt`, `helpDismissedAt`, `assistantDismissedAt`

---

## Test Procedure

1. **Install on physical device** (not just simulator)
2. **Test in Safari first** (primary iOS browser)
3. **Test each viewport width** (360px, 390px, 430px)
4. **Test in portrait and landscape**
5. **Test with slow 3G** to catch loading issues
6. **Test with VoiceOver** for accessibility
7. **Record any issues** with screenshots + device info

---

## Issue Reporting Template

```
Device: iPhone 14 Pro
OS: iOS 17.2
Browser: Safari
Viewport: 390px
Issue: [Description]
Steps to Reproduce:
1. 
2. 
3. 
Expected: [What should happen]
Actual: [What actually happened]
Screenshot: [Attach if possible]
```

---

## Sign-Off Checklist

- [ ] All critical flows tested (sign up, post job, send message)
- [ ] No horizontal overflow on any page
- [ ] All touch targets >= 44px
- [ ] Forms don't zoom on iOS
- [ ] Keyboard handling works correctly
- [ ] Floating actions don't overlap content
- [ ] Help dialog doesn't spam
- [ ] Profile completion meter works
- [ ] Image attachments work in chat
- [ ] Optimistic UI provides good feedback
- [ ] Error messages are helpful, not generic
- [ ] Performance acceptable on 3G
- [ ] Accessibility tested with VoiceOver

---

**Test Date:** _________
**Tester:** _________
**Build:** _________
**Status:** ☐ Pass ☐ Fail ☐ Pass with notes

**Notes:**
