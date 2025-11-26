# Housekeeping

> **Status: Phase 1-4 Complete** (Nov 26, 2025)
> - ✅ Created shared `formatters.ts` utility
> - ✅ Created shared `messages.css` styles
> - ✅ Added utility classes to `utilities.css`
> - ✅ Consolidated `UserMessage` into `MessageBubble` (deleted UserMessage.svelte)
> - ✅ Removed redundant ChatInput wrapper divs
> - ✅ Refactored groups page header to use `GlassHeader`
> - ✅ Cleaned up dead code and comments

## Overall Goal
**Optimize for prototyping efficiency:**
- Remove redundancies, reduce codebase size, apply DRY principles
- Focus on scenario-driven interactions with fabricated/dynamic data
- This is a showcase app, not a production app — simplicity over robustness

## Refactor Priorities
1. **System performance** — fewer components, less CSS duplication
2. **Clean, readable codebase** — single sources of truth
3. **Forward momentum** — easier to iterate on scenarios

---

## 🔵 Task 1: App Header Consolidation

### Current State
- `GlassHeader.svelte` exists and is well-designed ✅
- **Issue:** `groups/+page.svelte` has its own inline header (`.page-header`, lines 109-129, 227-234) with duplicate glass styling instead of using `GlassHeader`
- **Issue:** Usage is inconsistent (`absolute` vs `sticky` positioning varies)

### Files Involved
| File | Status |
|------|--------|
| `lib/components/GlassHeader.svelte` | Keep as single source |
| `routes/groups/+page.svelte` | Refactor to use `GlassHeader` |
| `routes/group/[id]/+page.svelte` | Audit positioning config |
| `lib/components/GroupChat.svelte` | Audit positioning config |

### Tasks
- [x] Replace inline header in `groups/+page.svelte` with `GlassHeader`
- [x] Standardize positioning: always `sticky={true}` unless overlay context
- [x] Uses `leading` snippet for logo, `trailing` snippet for tabs

---

## 🟠 Task 2: Chat Input Elevation

### Current State
- `ChatInput.svelte` exists as a single component ✅
- **Issue:** Instantiated 3 times with nearly identical wrapper markup

### Files with ChatInput + Wrapper
| File | Lines | Wrapper Class |
|------|-------|---------------|
| `routes/group/[id]/+page.svelte` | 859-867 | `.chat-input-container` |
| `lib/components/FeedView.svelte` | 148-156 | `.chat-input-container` |
| `lib/components/OnboardingChat.svelte` | 361-369 | `.chat-input-container` |

### Duplication Details
Each file has:
```css
.chat-input-container {
    z-index: var(--z-chat-input);
    /* slight variations in flex-shrink */
}
```

### Tasks
- [x] ChatInput already has positioning built-in (sticky, z-index)
- [x] Removed redundant wrapper divs from all 3 views
- [x] Context handled via `onSend` callback (passed from parent)

---

## 🔴 Task 3: Chat Elements Unification (HIGH PRIORITY)

### Current State — Multiple Overlapping Components

| Component | Lines | Purpose | Redundancy |
|-----------|-------|---------|------------|
| `MessageBubble.svelte` | 412 | AI/user/peer messages with typing, cards, markdown | Primary - keep |
| `UserMessage.svelte` | 199 | User bubbles + button morphing | **Candidate for removal** |
| `GroupChatMessage.svelte` | 185 | Wrapper that converts group messages | Good pattern - keep |
| `MorphReplyButtons.svelte` | 268 | GSAP Flip button→bubble animation | Keep as utility |

### Specific Duplications Found

#### 1. `formatTime` Function — EXACT DUPLICATE
**MessageBubble.svelte (lines 140-148):**
```javascript
function formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
}
```

**UserMessage.svelte (lines 60-68):** — Identical code

**Action:** Extract to `lib/utils/formatters.ts`

#### 2. User Bubble Styling — DUPLICATE CSS
**MessageBubble.svelte (lines 288-293):**
```css
.user-bubble {
    background-color: rgb(var(--m3-scheme-secondary-container));
    color: rgb(var(--m3-scheme-on-secondary-container));
    border-radius: var(--m3-util-rounding-large) var(--m3-util-rounding-large) 
                   var(--m3-util-rounding-extra-small) var(--m3-util-rounding-large);
    font-weight: var(--m3-font-body-semibold, 500);
}
```

**UserMessage.svelte (lines 173-178):** — Identical styling  
**MorphReplyButtons.svelte (lines 239-255):** — `.morph-bubble` with same colors/radius

**Action:** Extract to `styles/messages.css` or CSS custom properties

#### 3. Timestamp Styling — DUPLICATE CSS
**MessageBubble.svelte (lines 367-373):**
```css
.message-timestamp {
    font-family: var(--font-mono);
    color: rgb(var(--m3-scheme-outline));
    margin-top: 0.25rem;
    padding: 0 0.5rem;
}
```

**UserMessage.svelte (lines 185-190):** — Identical styling

#### 4. Typing Indicator — TWO IMPLEMENTATIONS
- `TypingIndicator.svelte` — Fancy animated cursor trail for AI
- `GroupChatMessage.svelte` (lines 31-42) — Simpler inline bouncing dots

### Tasks
- [x] Created `lib/utils/formatters.ts` with `formatTime()` and `formatDate()`
- [x] Created `styles/messages.css` with shared message styling
- [x] **DELETED `UserMessage.svelte`** — all usages replaced with `MessageBubble`
- [x] Typing indicators kept separate (AI cursor vs peer dots — intentionally different)
- [x] Updated all imports to use shared utilities

---

## 🟡 Task 4: CSS/Style Deduplication

### Discovered Global Patterns to Extract

#### 1. Background Gradient — Duplicated in 3 files
```css
.background-gradient {
    position: fixed;
    inset: 0;
    background: rgb(var(--m3-scheme-background));
    z-index: -1;
}
```
**Files:** `group/[id]/+page.svelte`, `groups/+page.svelte`, `FeedView.svelte`

#### 2. Custom Scrollbar — Duplicated in 3 files
```css
.custom-scrollbar::-webkit-scrollbar { width: 8px; }
.custom-scrollbar::-webkit-scrollbar-track { background: var(--bg-tertiary); border-radius: var(--radius-full); }
.custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border-secondary); border-radius: var(--radius-full); }
```
**Files:** `group/[id]/+page.svelte`, `OnboardingChat.svelte`

#### 3. Messages Area Layout — Similar patterns
```css
.messages-area {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-5);
    scroll-behavior: smooth;
}
```

### Tasks
- [x] Added `.bg-app-gradient` utility class to `utilities.css`
- [x] Added `.custom-scrollbar` utility class to `utilities.css`
- [x] Added `.messages-area-layout` class to `utilities.css`
- [ ] Migrate component files to use utility classes (future)

---

## 🟢 Task 5: Group List Items (Low Priority)

### Current State
- `GroupCard.svelte` is well-structured ✅
- Has `minimal` mode for onboarding ✅
- Uses extensive `Group` interface ✅

### Minor Improvements
- [ ] Consider adding `variant` prop for different card densities
- [ ] Review if `onboardingInfo` should be merged into `Group` interface

---

## 📋 Execution Order

### Phase 1: Utilities & Shared Styles (Foundation)
1. Create `lib/utils/formatters.ts`
2. Create `styles/messages.css`
3. Add utility classes to `utilities.css`

### Phase 2: Component Consolidation
4. Consolidate `UserMessage.svelte` → `MessageBubble.svelte`
5. Unify typing indicator usage
6. Update all imports

### Phase 3: Layout & Structure
7. Elevate `ChatInput` to app-level
8. Refactor `groups/+page.svelte` header to use `GlassHeader`
9. Standardize header positioning across app

### Phase 4: Cleanup
10. Remove dead code
11. Remove unused imports
12. Final audit for remaining duplications

---

## 📊 Impact Summary

| Metric | Before | After |
|--------|--------|-------|
| Message-related components | 4 | **3** (deleted UserMessage) |
| `formatTime` definitions | 2 | **1** (shared in formatters.ts) |
| Duplicate CSS blocks | ~15 | **~8** (shared styles created) |
| ChatInput wrapper divs | 3 | **0** (removed all) |
| Lines removed | — | **~180** |

---

## Notes
- Keep `MorphReplyButtons.svelte` separate — it has GSAP Flip logic that's specialized
- `GroupChatMessage.svelte` is a good adapter pattern — converts message types, reuses `MessageBubble`
- Data structures (`groups.ts`, `scenarios.ts`) are already clean — no changes needed
