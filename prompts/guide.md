# COLLECTIVE - CURSOR BUILD GUIDE

**SvelteKit 5 Demo Prototype**  
**For: Claude Sonnet in Cursor**  
**Timeline: 5-7 days to polished demo**

## OVERVIEW

This guide provides **high-level build instructions** for creating the Collective demo prototype in Cursor with Claude Sonnet.

**What this is**: - Clear descriptions of what to build - Phase-by-phase structure - No full code snippets (Claude will generate those) - Focus on clarity and intent

**What this isn't**: - Full code implementation - Component-level specs - Line-by-line instructions

**Trust Claude to**: - Generate correct SvelteKit 5 syntax (runes, latest patterns) - Create beautiful components - Implement animations described - Make good technical decisions within constraints

## PREREQUISITE KNOWLEDGE FOR CLAUDE

### Critical Context

**Date**: November 17, 2025 - Use latest SvelteKit 5 syntax, no deprecated patterns

**Framework**: SvelteKit 5 with Svelte 5 runes (\$state, \$derived, \$effect)

**Purpose**: Non-functional demo prototype for CEO pitch, not production app

**Design Aesthetic**: Late 2025 - expressive, designer-crafted, animated, duotone colors, WebGL gradients, glitchy artifacts (subtle), intentional movement

**Animation Philosophy**: Quick (150-400ms), spring-based, purposeful, never waste user time

**Key Files to Reference**: 1. DEMO_PROTOTYPE_SPECIFICATION.docx - Full design spec, colors, typography, components 2. CONVERSATION_SCRIPTS.docx - All dialogue, word-for-word, 9 scenarios

## PROJECT SETUP

### Initial Prompt for Cursor

Create a SvelteKit 5 project for a demo prototype called "Collective" - an AI-mediated group coordination chat app.  
<br/>REQUIREMENTS:  
\- SvelteKit 5 (latest as of Nov 2025)  
\- Svelte 5 with runes (\$state, \$derived, \$effect) - no deprecated syntax  
\- TypeScript enabled  
\- Tailwind CSS for styling  
\- Mobile-first PWA (responsive down to 375px)  
\- Deploy target: Vercel (use @sveltejs/adapter-vercel)  
\- No backend needed - all mock data, local state only  
<br/>PROJECT STRUCTURE:

src/ ├── lib/ │ ├── components/ │ │ ├── Chat/ (message bubbles, input, typing indicator) │ │ ├── Cards/ (task, expense, shopping cards) │ │ ├── UI/ (buttons, icons, gradients) │ │ └── DemoMenu/ (user switcher, scenario triggers) │ ├── data/ │ │ ├── household.ts (mock group & members) │ │ ├── items.ts (chores, expenses, shopping) │ │ └── scenarios.ts (conversation scripts) │ ├── stores/ │ │ └── app.svelte.ts (app state using Svelte 5 runes) │ └── utils/ │ ├── animations.ts (animation configs) │ └── formatters.ts (date, currency formatters) ├── routes/ │ ├── +layout.svelte │ └── +page.svelte (main chat interface) ├── app.css (global styles, gradients, animations) └── app.html

DESIGN SYSTEM (from spec):  
\- \*\*Colors\*\*: Choose duotone (Midnight Coral OR Purple Electric) + Cyber Lime accent  
\- \*\*Fonts\*\*: Inter (AI), Untitled Sans (user), JetBrains Mono (UI data)  
\- \*\*Spacing\*\*: 8px scale (8, 16, 24, 32, 48, 64)  
<br/>Set up the project with proper TypeScript configs, Tailwind, and folder structure.

**Expected**: Full SvelteKit 5 project scaffold with all folders, configs, dependencies

## PHASE 1: DESIGN SYSTEM & FOUNDATION

### Prompt

Let's establish the visual design system for Collective.  
<br/>REFERENCE: See "Visual Design Specification" section in the spec doc for full details.  
<br/>TASK 1 - Color Palette:  
Choose one duotone option:  
\- Option A: Midnight Coral (#0F172A → #FF6B6B)  
\- Option B: Purple Electric (#1A0B2E → #4158D0)  
<br/>Add these to Tailwind config as custom colors:  
\- primary-dark, primary-light (duotone pair)  
\- accent (Cyber Lime #BFFF00)  
\- neutrals (white, gray variants, black)  
<br/>TASK 2 - Typography:  
Set up font loading (Google Fonts or similar):  
\- Inter (AI messages, UI)  
\- A humanist sans for user messages (Untitled Sans or substitute)  
\- JetBrains Mono (data, timestamps)  
<br/>Configure in app.css with proper font stacks and fallbacks.  
<br/>TASK 3 - Global Styles (app.css):  
Create:  
\- CSS custom properties for colors  
\- Animated gradient backgrounds (mesh gradient effect, subtle)  
\- Base typography styles  
\- Animation keyframes for:  
\- Message entrance (slide + fade)  
\- Typing indicator (bounce dots)  
\- Confetti particles  
\- Subtle glitch effect  
<br/>TASK 4 - Utility Classes:  
Create Tailwind utilities for:  
\- Gradient backgrounds (duotone)  
\- Glassmorphism (for demo menu)  
\- Message bubble shapes (rounded corners as specified)  
\- Spring animation classes  
<br/>Make it visually stunning - this is late 2025 design aesthetic.

**Expected**: - tailwind.config.js with custom theme - app.css with gradients, animations, typography - Beautiful foundation ready for components

## PHASE 2: MOCK DATA & STATE MANAGEMENT

### Prompt

Now let's set up the mock data and state management.  
<br/>REFERENCE: See "Mock Data" section in spec doc for exact data structure.  
<br/>TASK 1 - Mock Data Files:  
<br/>CREATE: src/lib/data/household.ts  
Define the group and 4 members (Sarah, Mike, Jessica, Bob) with:  
\- IDs, names, avatars (emoji), roles  
\- Group settings (enabled domains: chores, expenses, shopping)  
<br/>CREATE: src/lib/data/items.ts  
Define all coordinated items (use the CoordinatedItem interface from spec):  
\- 5-6 chores (various statuses: pending, completed, overdue)  
\- 3-4 expenses (different categories, paid_by, amounts)  
\- 3-4 shopping items (with urgency, stores)  
<br/>Use the exact data structure from spec - it's future-proof for trips, etc.  
<br/>CREATE: src/lib/data/scenarios.ts  
For each of the 9 scenarios (from CONVERSATION_SCRIPTS.docx):  
\- Define the conversation flow  
\- Pre-written AI responses  
\- Quick-reply button options  
\- UI elements to show (cards, animations)  
<br/>Structure like:  
\`\`\`typescript  
export const scenarios = {  
viewMyTasks: {  
id: 'scenario-1',  
title: 'View My Tasks',  
initialUser: 'sarah',  
messages: \[ /\* all dialogue \*/ \],  
triggerConditions: { /\* when to show \*/ }  
},  
// ... all 9 scenarios  
}

TASK 2 - State Management:

CREATE: src/lib/stores/app.svelte.ts Using Svelte 5 runes, create reactive state for: - Current user (sarah/mike/jessica/bob) - Current scenario (if any active) - Conversations (per user, array of messages) - Demo menu state (open/closed, position)

Example structure:

export const appState = \$state({  
currentUser: 'sarah',  
activeScenario: null,  
conversations: {  
sarah: \[\],  
mike: \[\],  
jessica: \[\],  
bob: \[\]  
},  
demoMenu: {  
isOpen: false,  
position: { x: 20, y: 20 }  
}  
})  
<br/>export const currentConversation = \$derived(  
appState.conversations\[appState.currentUser\]  
)

Add helper functions: - addMessage(user, message) - switchUser(userId) - loadScenario(scenarioId) - resetDemo()

All data is hardcoded, no persistence needed.

\*\*Expected\*\*:  
\- Complete mock data matching spec  
\- Reactive state management with runes  
\- Clean TypeScript interfaces  
<br/>\---  
<br/>\## PHASE 3: CORE CHAT COMPONENTS  
<br/>\### Prompt

Let's build the core chat interface components.

REFERENCE: See "Component Design" section in spec for appearance details.

COMPONENT 1: MessageBubble.svelte Props: message (object with sender, content, timestamp, ui_elements)

Behavior: - User messages: right-aligned, accent color background, rounded corners (16px top, 4px bottom-right) - AI messages: left-aligned, white/light background, rounded corners (16px top, 4px bottom-left) - Show timestamp below (monospace, small, muted) - Animate entrance: slide from direction + fade (200ms, overshoot easing) - Drop shadow (colored, subtle)

If message has ui_elements.cards, render them below message. If message has ui_elements.quick_replies, render button group below.

COMPONENT 2: QuickReplyButtons.svelte Props: buttons (array of { label, value })

Behavior: - Pill-shaped buttons, arranged horizontally (wrap if needed) - Border: 1px accent color, transparent background - Hover: fill with accent, text inverts (150ms) - Tap: scale 0.95, bounce back (100ms) - When clicked: - Fade out all buttons - Morph clicked button into user message - Trigger callback with value

Animate entrance: slide up from bottom, stagger 50ms per button

COMPONENT 3: TypingIndicator.svelte Behavior: - 3 dots - Bounce animation (each dot staggered) - Appears in AI message position - Auto-shows for 0.8-1.5s before AI message appears

COMPONENT 4: ChatInput.svelte Behavior: - Text input at bottom of screen - Rounded border, subtle shadow - Send button (icon or text) - On submit: - Create user message bubble - Trigger scenario logic (if applicable) - Clear input with animation

For demo: Input can trigger pre-defined responses if text matches scenario triggers. Otherwise show fallback: "I'm not sure I understand. Try…"

Style all components per spec - beautiful, modern, intentional.

\*\*Expected\*\*:  
\- Working chat components  
\- Smooth animations  
\- Ready to compose into full interface  
<br/>\---  
<br/>\## PHASE 4: CARD COMPONENTS  
<br/>\### Prompt

Build the card components for displaying tasks, expenses, and shopping items.

REFERENCE: See "Component Design" in spec for structure.

COMPONENT: TaskCard.svelte Props: item (CoordinatedItem with type='chore')

Layout: - Icon (left): Chore emoji in colored circle (40x40px) - Title (center): Item title, 16px bold - Status badge (right): Pill-shaped, color-coded - Pending: amber background - Completed: lime background - Overdue: red background - Details row: Due date, assigned person (smaller text, muted) - Action buttons (bottom): "Mark Complete", "Trade"

For completed items: show checkmark, strikethrough title

COMPONENT: ExpenseCard.svelte Props: item (CoordinatedItem with type='expense')

Layout: - Icon (left): 💰 in colored circle - Title (center): Item title - Amount (right): \$XX.XX in monospace, bold - Details: Paid by, category, split method - Status: "Settled" or "You owe \$XX"

COMPONENT: ShoppingCard.svelte Props: item (CoordinatedItem with type='shopping_item')

Layout: - Icon (left): 🛒 in colored circle - Title (center): Item name - Urgency badge (right): High/Medium/Low - Details: Quantity, store, requested by

ALL CARDS: - White surface, rounded 12px - Subtle drop shadow or gradient border - Animate entrance: slide up + fade - Swipeable (swipe right: complete, swipe left: options) - optional for demo - Tap: show details (can be modal or expand inline)

Make them visually cohesive but clearly differentiated by type.

\*\*Expected\*\*:  
\- 3 card components (chore, expense, shopping)  
\- Beautiful, functional, animated  
\- Ready to embed in chat messages  
<br/>\---  
<br/>\## PHASE 5: MAIN CHAT INTERFACE  
<br/>\### Prompt

Build the main chat interface page.

FILE: src/routes/+page.svelte

LAYOUT: Top to bottom: 1. Header (fixed top): - Logo "Collective" (left) - tappable to open demo menu - Current user indicator (right) - shows avatar + name - Background: Subtle gradient

- Chat messages area (scrollable):
  - Display current conversation (from appState)
  - Messages render with MessageBubble component
  - Auto-scroll to bottom on new message
  - Stagger animate message entrance (if multiple loaded)
- Input area (fixed bottom):
  - ChatInput component
  - Always visible
  - Subtle shadow to separate from messages

BEHAVIOR: - On mount: Load last few messages from current user's conversation - On user switch: Fade out old conversation, fade in new (300ms) - On new message: Add to conversation, animate in, scroll to bottom - Background: Animated gradient (subtle parallax on scroll)

INTERACTIONS: - Tap logo 3x: Open demo menu - Keyboard: Alt+D opens demo menu - Messages with quick replies: Show buttons below - Messages with cards: Render cards inline

Make it feel polished, smooth, engaging.

\*\*Expected\*\*:  
\- Complete working chat interface  
\- Smooth user experience  
\- Ready for scenario implementation  
<br/>\---  
<br/>\## PHASE 6: DEMO META-MENU  
<br/>\### Prompt

Build the demo menu for switching users and triggering scenarios.

COMPONENT: DemoMenu.svelte

APPEARANCE: - Floating panel (300x400px) - Glassmorphism: blurred background, semi-transparent, border - Rounded corners 16px - Drop shadow (elevated) - Draggable anywhere on screen

SECTIONS:

- User Switcher:
  - 4 buttons (Sarah, Mike, Jessica, Bob)
  - Show current user highlighted (accent background)
  - Avatar + name for each
  - Tap to switch user (calls switchUser from store)
- Scenario Jumper:
  - List of 9 scenarios
  - Title for each (from scenarios.ts)
  - Tap to trigger scenario (calls loadScenario)
  - Current scenario highlighted if active
- Quick Actions:
  - Reset demo button (clear all conversations, reset to start)
  - Toggle animations (for debugging)
  - Close menu button

ACCESS: - Triple-tap logo in header - Keyboard shortcut: Alt+D - Close: Click outside or Esc key

KEYBOARD SHORTCUTS: - Alt+1/2/3/4: Switch to user (Sarah/Mike/Jessica/Bob) - Alt+S1-S9: Load scenario 1-9 - Alt+R: Reset demo - Esc: Close menu

BEHAVIOR: - When user switches: - Animate view transition (scale down old, scale up new) - Background gradient shifts color slightly - Load that user's conversation - When scenario loads: - Reset conversation (or append scenario messages) - Start scenario flow - Close menu automatically

Style beautifully - this is a demo tool but should be polished.

\*\*Expected\*\*:  
\- Functional demo menu  
\- User switching works smoothly  
\- Scenario triggering ready for implementation  
<br/>\---  
<br/>\## PHASE 7: IMPLEMENT SCENARIOS 1-3  
<br/>\### Prompt

Implement the first 3 core scenarios using the conversation scripts.

REFERENCE: CONVERSATION_SCRIPTS.docx for exact dialogue.

SCENARIO 1 - View My Tasks: - User: Sarah - Trigger: On app open or user asks "What's on my plate?" - Flow: 1. AI greets with quick-reply buttons 2. User taps "What's on my plate?" 3. AI shows card with chores, expenses, shopping (from items.ts, filtered for Sarah) 4. Quick-reply: "Send me reminders" 5. AI confirms with updated reminder times

Implementation: - When scenario loads, add AI greeting to Sarah's conversation - On button tap, add user message + AI response with card - Card should show TaskCard, ExpenseCard, ShoppingCard components - Use exact dialogue from script

SCENARIO 2 - Fairness Breakdown: - User: Jessica - Trigger: User asks "Am I doing my fair share?" - Flow: 1. User message 2. AI responds with animated fairness card 3. Shows Jessica's stats (from mock fairness data) 4. Shows household comparison 5. Encouraging message

Implementation: - Create FairnessCard component (if not exists) - Animate sections appearing in sequence (stagger) - Use progress bars or circular progress - Color-code by performance (green >85%, yellow 70-85%)

SCENARIO 3 - Trade a Chore: - Users: Sarah (initiates), Bob (responds) - Trigger: Sarah asks to trade - Multi-user: Switches between Sarah and Bob's views - Flow: 1. Sarah asks to trade kitchen chore 2. AI offers to check with others 3. Sarah chooses Bob 4. \[Switch to Bob's view\] AI asks Bob 5. Bob agrees 6. \[Switch to Sarah's view\] AI confirms swap

Implementation: - When scenario reaches "switch to Bob", show UI indicator (or auto-switch if demo menu open) - Update both conversations with appropriate messages - Show trade visualization (before/after or crossed-out items) - Celebrate completion with animation

Test each scenario thoroughly - dialogue should match scripts exactly.

\*\*Expected\*\*:  
\- 3 working scenarios  
\- Smooth multi-user switching (Scenario 3)  
\- Beautiful cards and animations  
<br/>\---  
<br/>\## PHASE 8: IMPLEMENT SCENARIOS 4-7  
<br/>\### Prompt

Implement the next 4 scenarios.

REFERENCE: CONVERSATION_SCRIPTS.docx

SCENARIO 4 - Proactive Reminder: - User: Mike - Trigger: Time-based or manual trigger - Flow: AI sends gentle reminder about overdue dishes - Implementation: Message appears as notification (animate in from top or side) - Show updated task card with new due date when postponed

SCENARIO 5 - Transparency on Request: - User: Sarah - Trigger: "What's everyone doing this week?" - Flow: AI shows breakdown of all 4 users' tasks - Implementation: - Create list with 4 sections (one per user) - Each section shows their tasks (chores, expenses, shopping) - Stagger animate sections (100ms delay each) - Completed items marked with checkmark

SCENARIO 6 - Complete a Task: - User: Sarah - Trigger: "Done with trash" - Flow: AI marks complete, celebrates - Implementation: - Checkbox animation (draw checkmark) - Card background flash (lime color) - Small confetti animation (particles fade out) - Show mini leaderboard card - Card slides out, list reflows

SCENARIO 7 - AI Optimization Suggestion: - Users: Sarah, Bob - Trigger: AI detects overlap in errands - Multi-user scenario - Flow: 1. AI suggests coordination to Sarah 2. Sarah agrees 3. \[Switch to Bob\] AI asks Bob 4. Bob agrees to grab both items 5. \[Switch to Sarah\] AI confirms - Implementation: - Show "Coordinating…" animation when AI is "talking" to Bob - Update shopping assignments - Show before/after clearly

Each scenario should feel polished and complete.

\*\*Expected\*\*:  
\- 4 more working scenarios  
\- Notification-style messages  
\- Celebration animations  
\- Multi-user coordination smooth  
<br/>\---  
<br/>\## PHASE 9: ADVANCED SCENARIOS (OPTIONAL)  
<br/>\### Prompt

If time permits, implement the 2 advanced scenarios.

SCENARIO 8 - Handle Conflict: - Users: Jessica (complains), Mike (nudged) - Shows AI mediating without direct confrontation - Gentle tone, empathetic to both parties - Status updates visible to Jessica

SCENARIO 9 - Adjust Preferences: - User: Bob - Bob expresses preference (wants fewer trash days) - AI updates preferences, offers immediate swap - Show preference interface (visual, icons) - Demonstrate AI learning and adapting

These are "wow" scenarios that show sophistication. Only implement if time allows and core scenarios are polished.

\---  
<br/>\## PHASE 10: ANIMATIONS & POLISH  
<br/>\### Prompt

Polish all animations and micro-interactions.

REFERENCE: "Animation Specification" section in spec doc.

AREAS TO POLISH:

- Message Animations:
  - Entrance: Slide from direction + fade (200ms, cubic-bezier overshoot)
  - Ensure smooth spring physics feel
  - Typing indicator bounce is delightful
- List Animations:
  - Stagger cards (50ms delay per item)
  - Smooth entrance (slide + fade)
  - When item completes: slide out + fade, remaining items reflow (200ms)
- User Switch Animation:
  - Current view scales down + fades (200ms)
  - Background gradient shifts to new color (300ms)
  - New view scales up + fades in (250ms)
  - Messages in new view stagger in
- Confetti Effect:
  - Small burst from checkbox
  - Particles are lime colored
  - Fade out over 500ms
  - Not overwhelming, just celebratory
- Button Interactions:
  - Hover: border glow, shadow grows (150ms)
  - Tap: scale 0.95, bounce back (100ms overshoot)
  - Haptic feedback if supported
- Background Gradient:
  - Subtle animated mesh gradient
  - Shifts on scroll (parallax, very subtle)
  - Color shifts when user switches
- Glitch Effects (very subtle):
  - AI avatar has micro-glitch on first appearance (50ms)
  - Message send has brief RGB split (30ms)
  - Don't overdo - just hints of generative aesthetic
- Micro-interactions:
  - Card hover: subtle lift + shadow (200ms)
  - Input focus: border glow
  - Logo tap: subtle bounce
  - Everything should feel responsive and alive

Make sure all animations are: - Quick (150-400ms max) - Smooth (spring physics or overshoot easing) - Purposeful (direct attention, show relationships) - Never waste time (fleeting, not forced to watch)

Test on mobile - ensure 60fps performance.

\*\*Expected\*\*:  
\- Every interaction polished  
\- Smooth, delightful, intentional movement  
\- Late 2025 aesthetic achieved  
<br/>\---  
<br/>\## PHASE 11: RESPONSIVE & MOBILE OPTIMIZATION  
<br/>\### Prompt

Ensure the app is perfectly responsive and mobile-optimized.

REQUIREMENTS:

- Mobile-first (base: 375px width):
  - Test on iPhone SE size
  - All touch targets minimum 44x44px
  - Comfortable thumb zones
- Breakpoints:
  - Small: 375px - 640px (mobile)
  - Medium: 640px - 1024px (tablet)
  - Large: 1024px+ (desktop)
- Layout adjustments:
  - Demo menu: Smaller on mobile, can drag to reposition
  - Chat bubbles: Max 80% width on mobile, 60% on desktop
  - Cards: Stack on mobile, can be grid on desktop
  - Font sizes: Scale appropriately (clamp if needed)
- Touch interactions:
  - Swipe gestures (card swipe to complete)
  - Pull to refresh (optional, nice to have)
  - Pinch to zoom (disable if not needed)
- Keyboard handling (mobile):
  - Input fixed bottom
  - Chat area adjusts when keyboard opens
  - Auto-scroll to keep input visible
- Performance:
  - Lazy load scenario data if needed
  - Optimize animations for 60fps
  - Reduce motion if user prefers (media query)

Test on: - Chrome DevTools mobile emulation - Real device if possible - Landscape and portrait

\*\*Expected\*\*:  
\- Perfectly responsive  
\- Great mobile experience  
\- Smooth performance  
<br/>\---  
<br/>\## PHASE 12: FINAL POLISH & VERCEL DEPLOYMENT  
<br/>\### Prompt

Final polish and prepare for Vercel deployment.

TASKS:

- Visual Polish:
  - Review all colors, ensure contrast accessibility
  - Check all typography is consistent
  - Ensure spacing follows 8px scale
  - Fix any visual bugs or inconsistencies
- Interaction Polish:
  - Test all scenarios end-to-end
  - Ensure user switching works perfectly
  - Verify demo menu keyboard shortcuts
  - Check all animations are smooth
- Content Review:
  - Ensure AI dialogue matches scripts exactly
  - Check for typos in messages
  - Verify data (dates, amounts, names) is consistent
- Demo Menu Enhancements:
  - Add tooltips or labels if needed
  - Ensure it's discoverable (subtle hint on first load?)
  - Make shortcuts obvious in menu
- Loading State:
  - Add subtle loading on app open (gradient fade-in)
  - Ensure smooth transition to first view
- PWA Setup (if time):
  - Add manifest.json
  - Add icons
  - Service worker for offline (optional, nice-to-have)
- Vercel Deployment:
  - Ensure @sveltejs/adapter-vercel is configured
  - Test build locally: npm run build && npm run preview
  - Fix any build errors
  - Deploy to Vercel
  - Test deployed version on mobile device
- CEO Walkthrough Prep:
  - Create simple instructions document:
    - How to open app (share URL)
    - How to navigate (just use it naturally)
    - Demo menu access (triple-tap logo or Alt+D)
    - Scenarios to try (suggest 3-4 key ones)
  - Test run-through yourself

Make it CEO-ready: polished, impressive, bug-free. \`\`\`

**Expected**: - Production-ready demo - Deployed to Vercel - URL shareable on mobile - CEO can experience it seamlessly

## TROUBLESHOOTING GUIDANCE

### If Animations Are Janky

- Reduce animation duration (make faster)
- Use CSS transforms (not margin/padding)
- Will-change property for animated elements
- Check Chrome DevTools Performance tab

### If Build Fails

- Check SvelteKit 5 syntax (no deprecated patterns)
- Ensure all imports are correct
- Verify adapter-vercel is latest version
- Check for TypeScript errors

### If Scenarios Don't Flow

- Review conversation scripts exactly
- Ensure state updates trigger re-renders
- Check conditional logic in scenario handling
- Add console.logs to debug flow

### If Mobile Experience Is Off

- Test on real device (not just emulator)
- Check viewport meta tag
- Ensure touch targets are large enough
- Test with slow 3G to check performance

## FINAL CHECKLIST

Before showing to CEO:

✅ All 7 core scenarios work perfectly  
✅ User switching is smooth  
✅ Animations are delightful (not janky)  
✅ Mobile responsive (test on real device)  
✅ No console errors  
✅ Demo menu works (keyboard shortcuts + UI)  
✅ Visual design matches spec (colors, typography, spacing)  
✅ Deployed to Vercel, URL works  
✅ Walkthrough tested successfully

**If all checked**: Ready for CEO presentation.

## TIPS FOR WORKING WITH CLAUDE IN CURSOR

### Best Practices

- **Break work into phases**: Don't ask Claude to build everything at once
- **Reference the spec docs**: Point Claude to specific sections when needed
- **Iterate**: Build, review, refine - don't expect perfection first try
- **Trust Claude's judgment**: For implementation details, let Claude make good decisions
- **Test frequently**: After each phase, test in browser
- **Use Cursor's composer**: For multi-file changes (e.g., components + styles)

### Example Interaction

**You**: "Build the MessageBubble component per the spec. User messages right-aligned with accent color, AI messages left-aligned. Animate entrance with slide + fade."

**Claude**: _generates component with proper animations_

**You**: "Great! Now make the animation faster (200ms instead of 300ms) and add a subtle drop shadow."

**Claude**: _refines component_

### When to Ask for Help

- If animations don't feel right: Describe the issue, ask Claude to adjust
- If layout breaks on mobile: Show screenshot, ask for fix
- If scenario logic is confusing: Break it down step-by-step
- If colors look off: Reference the spec, ask Claude to match exactly

**You're ready to build! Start with Phase 1 and work forward.**

_The demo will be impressive, polished, and CEO-ready in 5-7 days of focused work._

_This build guide was created by the Collective Think Tank Council for efficient demo prototype development._