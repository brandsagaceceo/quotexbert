// Chat scroll stability regression — typing (composer auto-grow) must not make
// the message list visually jump. Source-assertion style (matches scripts/job-fairness.test.ts).
import assert from "node:assert/strict";
import fs from "node:fs";

const chat = fs.readFileSync("components/Chat.tsx", "utf8");

// 1. Composer auto-grow re-anchors to the bottom instantly (no visible animation),
//    but ONLY when the composer's measured pixel height actually changed (line
//    wrap/unwrap) — NOT on every keystroke. Scrolling on every character typed
//    (the old behavior) was the root cause of the mobile "bounce" while typing.
const composerEffect = chat.slice(
  chat.indexOf("Re-measure whenever the message text changes"),
  chat.indexOf("Guard: parent should prevent rendering without currentUserId"),
);
assert.match(composerEffect, /const measuredHeight = el \? el\.offsetHeight : composerHeightRef\.current;/, "effect measures the composer's actual pixel height after resizing");
assert.match(composerEffect, /if \(measuredHeight !== composerHeightRef\.current\) \{\s*\n\s*composerHeightRef\.current = measuredHeight;\s*\n\s*scrollToBottom\("instant"\);\s*\n\s*\}/, "scrollToBottom only runs when the composer's height actually changed, not on every keystroke");
assert.doesNotMatch(composerEffect.replace(/\/\/.*$/gm, ""), /resizeComposer\(\);\s*\n\s*scrollToBottom\("instant"\);\s*\n\s*\}, \[newMessage/, "regression guard: scrollToBottom must not be called unconditionally on every newMessage change");

// 2. scrollToBottom remains guarded — a user who scrolled up to read history is
//    never yanked back down while typing (or on new messages).
assert.match(chat, /const scrollToBottom = useCallback\(\(behavior: ScrollBehavior = "smooth"\) => \{\s*\n\s*if \(shouldScrollRef\.current\) \{/, "scrollToBottom is a no-op unless the viewer is already near the bottom");

// 3. The new-message scroll effect (instant on first open, smooth afterwards) is unchanged.
assert.match(chat, /const behavior: ScrollBehavior = isFirstRenderRef\.current \? "instant" : "smooth";/, "first-open vs subsequent-message scroll behavior is unchanged");

// 4. Composer bounds (min/max height) and layout are unchanged — no redesign.
assert.match(chat, /const COMPOSER_MIN_HEIGHT = 44;/, "composer min height unchanged");
assert.match(chat, /const COMPOSER_MAX_HEIGHT = 140;/, "composer max height unchanged");

// 5. Mobile Back to Chats and the single-scroll-container layout are unchanged.
assert.match(chat, /aria-label="Back to conversations"/, "mobile back-to-chats control is unchanged");
assert.match(chat, /flex-1 overflow-y-auto[^"]*min-h-0/, "message list remains the single scrollable region");

// 6. Message send/notification/email logic in this file is completely untouched.
assert.match(chat, /fetch\(`\/api\/threads\/\$\{thread\.id\}\/messages`, \{\s*\n\s*method: "POST",/, "message send still posts to the existing plain-message API, unchanged");

console.log("chat-scroll-stability tests passed");
