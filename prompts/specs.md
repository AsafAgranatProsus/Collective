# COLLECTIVE - DEMO PROTOTYPE SPECIFICATION

**Experience-Focused SvelteKit PWA for Investment Pitch**  
**Target**: CEO Presentation, Late 2025 Aesthetic  
**Build Time**: 1 week (polished, multi-domain, animated)  
**Deploy**: Vercel (one-click)

## EXECUTIVE SUMMARY

This document specifies a **non-functional, experience-focused prototype** designed to secure investment by demonstrating the potential of an AI-mediated group coordination platform.

**What this is**: - A theatrical demonstration of intelligence, not actual intelligence - Scripted scenarios with pre-written AI responses - Beautiful, polished UI with intentional animations - CEO-ready pitch tool

**What this is NOT**: - A working app with real backend - Connected to any AI service - Handling real data or user input beyond scripted scenarios - Production-quality codebase

**Goal**: Show the CEO what coordination could feel like in late 2025, get buy-in, secure investment.

## THE MOCK HOUSEHOLD

### Brooklyn Apartment 4B

**4 Roommates** with distinct personalities:

**You** (27, Product Designer) - Organized, detail-oriented, pays attention to fairness - Usually completes her tasks on time - Asks good questions about how the system works - **Role in demo**: Primary protagonist, most scenarios from her POV

**Mike Rodriguez** (29, Software Engineer) - Easygoing, sometimes forgets tasks - Responsive when reminded - Doesn't complain much - **Role in demo**: The one who needs reminders, drives "proactive AI" scenarios

**Jessica Taylor** (26, Marketing Manager) - Very on top of things - Gets annoyed when others don't pull their weight - Vocal about fairness - **Role in demo**: Drives fairness/transparency scenarios

**Bob Kim** (28, Graphic Designer) - Flexible, helpful, accommodating - Often volunteers to help others - Doesn't mind trading tasks - **Role in demo**: Drives trade/swap scenarios

## THE AI PERSONALITY

### Name & Identity

**Name**: "Collective" (the AI doesn't have a separate name - it IS Collective)

**Voice**: Witty, efficient, warm, proactive

### Personality Pillars

- **Witty but not annoying**
  - One joke per conversation max
  - Humor is gentle, not sarcastic
  - Example: "You're officially the most reliable this month. Just saying. 😎"
- **Efficient**
  - Gets to the point quickly
  - Doesn't ramble or over-explain
  - Uses bullet points for clarity
- **Warm**
  - Uses emojis sparingly (1-2 per message)
  - Encouraging ("You're crushing it!")
  - Empathetic ("I hear you")
- **Proactive**
  - Suggests optimizations
  - Reminds before things are overdue
  - Offers to help before being asked
- **Transparent**
  - Explains decisions when asked
  - Shows data/breakdowns
  - Honest about what it can/can't do
- **Human-like**
  - Says "I" not "the system"
  - Admits when it makes mistakes
  - Has personality, not corporate speak

### Language Guidelines

**DO**: - "Let me check…" - "You're crushing it" - "No worries!" - "Just a heads up" - "Want me to…" - "I noticed…"

**DON'T**: - "Processing request…" - "Task completed successfully" - "You must…" - "Error: …" - "Please wait…" - Too many emojis (max 2 per message)

## VISUAL DESIGN SPECIFICATION

### Color Palette

**Primary Duotone** (choose one):

**Option A - Midnight Coral**: - Deep navy: #0F172A - Bright coral: #FF6B6B - Gradient: linear-gradient(135deg, #0F172A 0%, #FF6B6B 100%)

**Option B - Purple Electric**: - Deep purple: #1A0B2E - Electric blue: #4158D0 - Gradient: linear-gradient(135deg, #1A0B2E 0%, #4158D0 100%)

**Accent Color**: - Cyber lime: #BFFF00 (for completed items, success states, highlights)

**Neutrals**: - Pure white: #FFFFFF (surfaces, cards) - Soft gray: #F8F9FA (backgrounds) - Medium gray: #6B7280 (secondary text) - Deep black: #0A0A0A (primary text)

**Semantic Colors**: - Success/Complete: Lime #BFFF00 - Warning/Pending: Amber #FFA500 - Error/Overdue: Red #FF4444 - Info: Blue from duotone

### Typography

**Font Pairing: Human-Machine**

**AI Messages**: - Font: Inter or similar (geometric, machine precision) - Weight: 400-500 - Size: 15px - Letter-spacing: -0.01em - Line-height: 1.5

**User Messages**: - Font: Untitled Sans or similar (warmer, humanist) - Weight: 400-600 - Size: 16px - Letter-spacing: 0 - Line-height: 1.4

**UI Labels & Data**: - Font: JetBrains Mono (monospace) - Use for: timestamps, numbers, status tags, buttons - Weight: 400-500 - Size: 12-14px

**Hierarchy Example**:

Chat Message (user): 16px, Untitled Sans, 400  
Chat Message (AI): 15px, Inter, 400  
Timestamp: 12px, JetBrains Mono, 400, muted  
Button: 14px, Inter, 500  
Task Title: 16px, Inter, 600  
Task Detail: 14px, Inter, 400, muted

### Layout Principles

**Mobile-First** (base: 375px width): - Edge margins: 24px (generous whitespace) - Between messages: 16px - Card padding: 16px - Button padding: 12px × 20px

**Information Hierarchy**: - Most important (current/active): Top, largest, animated entrance - Context (upcoming): Below, slightly smaller, subtle - Historical (completed): Muted colors, collapsed by default

**Spacing Scale**: - 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

### WebGL Gradients

**Animated Mesh Gradients** (like Stripe, Vercel): - Use behind AI messages (subtle, low opacity) - App background (very subtle, shifts on scroll) - Card backgrounds for key moments

**Implementation note**: Use CSS gradients that animate, or simple canvas-based gradients. Don't over-engineer - effect should be subtle.

### Glitchy Artifacts

**Very Subtle Digital Aesthetic**: - AI avatar: Subtle noise/glitch on first appearance (50ms) - Message send: Brief RGB split effect (30ms) - Transitions: Occasional micro "data corruption" aesthetic - **Critical**: Extremely subtle - enhances, doesn't distract

## COMPONENT DESIGN (DESCRIPTIONS, NOT CODE)

### Message Bubbles

**User Messages** (right-aligned): - Background: Accent color (lime) or duotone primary - Text: Dark or white (contrast dependent) - Padding: 12px × 16px - Border-radius: 16px 16px 4px 16px (rounded top, sharp bottom-right) - Drop shadow: Colored (matches background), subtle - Max-width: 75% of screen

**AI Messages** (left-aligned): - Background: White or very light gray - Optional: Subtle gradient border (animated glow) - Text: Dark - Padding: 12px × 16px - Border-radius: 16px 16px 16px 4px (rounded top, sharp bottom-left) - Drop shadow: Subtle, colored - Max-width: 80% of screen

**Timestamp**: - Below bubble, monospace, 12px, muted - Format: "Today 9:42 AM" or "Yesterday 3:15 PM"

### Quick Reply Buttons

**Appearance**: - Pill-shaped (fully rounded corners) - Border: 1px solid accent color - Background: Transparent initially - Padding: 8px × 16px - Text: 14px, medium weight - Arranged horizontally, wrap if needed - Spacing: 8px between buttons

**Interaction**: - Hover: Fill with accent color, text inverts - Tap: Scale down to 0.95, then bounce back - After selection: Fade out (200ms), slide up to become user message

### Task/Expense/Shopping Cards

**Structure**: - White surface (or very light) - Border-radius: 12px - Padding: 16px - Border: 1px solid (muted) OR subtle gradient border - Drop shadow: Subtle, elevated

**Layout**:

\[Icon\] \[Title\] \[Status Badge\]  
\[Details - smaller text\]  
\[Action Buttons\]

**Icon** (left): - Domain-specific (chore, expense, shopping) - Colored circle background - 40px × 40px

**Title** (center): - 16px, bold - Primary text color

**Details** (below title): - 14px, regular - Secondary text color - Due date, assigned person, amount, etc.

**Status Badge** (right): - Pill shape - Small: 12px text, 6px × 12px padding - Color-coded: Pending (amber), Complete (lime), Overdue (red)

**Action Buttons** (bottom): - Small, text-only or icon buttons - Examples: "Mark Complete", "Trade", "Details"

### Lists (Tasks, Assignments)

**Behavior**: - Staggered entrance animation (50ms delay per item) - Swipeable (swipe right: complete, swipe left: more options) - Checkbox or tap to complete - Reorder when item completes (completed items move to bottom)

**Checkbox Design**: - Custom, not default HTML - Empty: Circle outline - Checked: Filled circle with animated checkmark (path draws in) - Animation: 200ms, easing with slight overshoot

### Typing Indicator

**AI is "typing"**: - 3 dots - Bounce animation (staggered) - Appears in AI message position (left-aligned) - Duration: 800ms - 1500ms (varies to feel natural)

### Demo Meta-Menu

**Appearance**: - Floating panel - Glassmorphism (blurred background, semi-transparent) - Border-radius: 16px - Drop shadow: Strong (elevated) - Size: ~300px × 400px (compact but readable) - Draggable anywhere on screen

**Sections**: 1. **User Switcher**: 4 buttons, show current user highlighted 2. **Scenario Jumper**: List of scenarios, tap to trigger 3. **Quick Actions**: Reset, toggle animations, etc.

**Access**: - Keyboard: Alt + D - UI: Triple-tap logo in top-left - Shows only in demo mode (not for CEO unless they explore)

## ANIMATION SPECIFICATION

### Philosophy

**"Organic, intentional, fleeting"**

Animations should feel like the UI is: - **Growing** from elements (scale up from origin) - **Breathing** (subtle movement on idle) - **Responding** to input (immediate, satisfying feedback)

Animations should be: - **Quick**: Never waste user time (150-400ms max) - **Smooth**: Gentle spring physics, no harsh linear - **Purposeful**: Direct attention, show relationships, provide feedback

### Timing Guidelines

| Action | Duration | Notes |
| --- | --- | --- |
| Micro-interaction (button tap) | 100-150ms | Instant feedback |
| Message entrance | 200-250ms | Quick but noticeable |
| View transition | 300-400ms | Smooth, not slow |
| List item stagger | 50ms delay | Per item |
| Exit animation | 150-200ms | Faster than entrance |

### Easing Functions

**Spring Physics** (use Svelte's built-in spring):

Stiffness: 0.3 (gentle, not bouncy)  
Damping: 0.7 (settles quickly)

**Cubic Bezier** (when springs don't fit):

Entrance: cubic-bezier(0.34, 1.56, 0.64, 1) \[slight overshoot\]  
Exit: cubic-bezier(0.4, 0, 1, 1) \[fast acceleration\]  
General: cubic-bezier(0.4, 0, 0.2, 1) \[standard smooth\]

### Specific Animation Behaviors

**App Open / Page Load**: 1. Background gradient fades in (300ms) 2. Last 3 messages in conversation stagger in from bottom (200ms each, 50ms delay) 3. Input field slides up from bottom edge (250ms) 4. Logo/header fades in (200ms)

**New AI Message**: 1. Typing indicator appears (bounce animation, 3 dots) 2. After 800-1500ms (randomized), typing indicator fades out 3. Message bubble scales from 0.9 → 1.0 with slight overshoot (200ms) 4. Text fades in simultaneously (150ms) 5. If message has quick-reply buttons, they slide in from bottom with 50ms stagger

**New User Message**: 1. Text input scales slightly (0.95 → 1.05 → 1.0, 300ms) on submit 2. Message bubble slides in from right + fade (200ms) 3. Quick-reply buttons (if tapped) morph into the message bubble 4. Input clears with subtle animation

**Task List Entrance**: 1. List container fades in (200ms) 2. Each item: - Slides from left (translate -20px → 0) - Fades in (opacity 0 → 1) - 50ms delay per item (staggered) - Duration: 200ms each

**Task Completion**: 1. User taps checkbox 2. Checkmark path draws in (200ms, smooth curve) 3. Card background flashes accent color briefly (100ms pulse) 4. Small confetti burst from checkbox (particles fade out over 500ms) 5. Card slides left + fades out (300ms) 6. Remaining cards reflow to fill space (200ms)

**User Switch (Demo Menu)**: 1. Current view scales down (0.95) + fades (50% opacity) - 200ms 2. Background gradient shifts to new color (300ms) 3. Current view fades out completely (100ms) 4. New user's view fades in (250ms) + scales up (0.95 → 1.0) 5. Messages stagger in (50ms each)

**Swipe Actions**: 1. Card follows finger with subtle resistance (spring physics) 2. When threshold reached (40% swipe), action icon appears 3. Release: Card snaps to action or returns (250ms spring) 4. If action triggered, card animates out (same as task completion)

**Modal/Sheet Entrance**: 1. Overlay fades in (200ms) 2. Sheet slides up from bottom (300ms, overshoot easing) 3. Content inside sheet fades in after (100ms delay)

**Modal/Sheet Exit**: 1. Sheet slides down (250ms) 2. Overlay fades out simultaneously (200ms)

### Micro-Interactions

**Button Hover** (desktop): - Border glow intensifies (150ms) - Subtle shadow grows (150ms) - Text color slightly brightens (150ms)

**Button Tap** (mobile): - Scale down to 0.95 (100ms) - Background darkens slightly (100ms) - Haptic feedback (if supported) - Scale back to 1.0 on release (150ms with overshoot)

**Card Hover** (desktop): - Subtle lift (translate Y: -2px, 200ms) - Shadow intensifies (200ms)

**Scroll Effects**: - Background gradient shifts parallax (very subtle) - Cards have subtle scroll-triggered animations (appear as they enter viewport)

**Pull to Refresh**: - Custom loader (not standard spinner) - Generative/organic feel (pulsing gradient circle or similar) - Appears while pulling, triggers at threshold

## DATA SCHEMA (FUTURE-PROOF)

### Core Entities

**Group** (replaces "Household" for future flexibility):

interface Group {  
id: string  
name: string  
group_type: 'household' | 'trip' | 'project' | 'event' | 'team'  
created_at: Date  
settings: {  
timezone: string  
enabled_domains: Array&lt;'chores' | 'expenses' | 'shopping' | 'trips' | 'activities'&gt;  
}  
}

**Member**:

interface Member {  
id: string  
group_id: string  
name: string  
avatar?: string // URL or emoji  
role: 'creator' | 'member'  
joined_at: Date  
}

**Coordinated Item** (universal):

interface CoordinatedItem {  
id: string  
group_id: string  
<br/>// Universal type system  
item_type:  
| 'chore'  
| 'expense'  
| 'shopping_item'  
| 'trip_activity'  
| 'trip_planning_task'  
| 'bill'  
| 'maintenance'  
| 'event'  
<br/>// Core properties (all types have these)  
title: string  
description?: string  
status: 'pending' | 'active' | 'completed' | 'overdue' | 'cancelled'  
<br/>// Assignment  
assigned_to?: string\[\] // Can be multiple people  
<br/>// Timing  
due_date?: Date  
recurrence?: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'one-time'  
<br/>// Type-specific metadata (flexible)  
metadata: {  
// === CHORES ===  
difficulty?: number // 1-5  
estimated_minutes?: number  
location?: string // "kitchen", "bathroom"  
<br/>// === EXPENSES ===  
amount?: number  
currency?: string  
paid_by?: string // member_id  
split_method?: 'equal' | 'percentage' | 'custom'  
category?: string // "groceries", "utilities"  
receipt_url?: string  
<br/>// === SHOPPING ===  
quantity?: number  
store?: string  
urgency?: 'low' | 'medium' | 'high'  
requested_by?: string // member_id  
<br/>// === TRIP ACTIVITIES (future) ===  
activity_type?: string // "museum", "restaurant", "transport"  
destination?: string  
time_slot?: string  
cost_per_person?: number  
booking_required?: boolean  
<br/>// === TRIP PLANNING (future) ===  
planning_category?: string // "accommodation", "flights", "research"  
deadline?: Date  
<br/>// === BILLS (future) ===  
bill_type?: string // "recurring", "one-time"  
due_day?: number // Day of month  
auto_pay?: boolean  
<br/>// Extensible - any future domain  
\[key: string\]: any  
}  
<br/>created_at: Date  
created_by: string  
completed_at?: Date  
completed_by?: string  
}

**Conversation**:

interface Conversation {  
id: string  
user_id: string // which member this conversation belongs to  
group_id: string  
messages: Message\[\]  
context: {  
active_item_id?: string // Currently discussing this item  
active_scenario?: string // For demo: which scenario is running  
last_interaction: Date  
}  
}  
<br/>interface Message {  
id: string  
sender: 'user' | 'ai'  
content: string  
timestamp: Date  
<br/>// For actions (when AI creates/updates items)  
action?: {  
type: 'create_item' | 'update_item' | 'complete_item' | 'trade_item' | 'reminder'  
item_id?: string  
details?: any  
}  
<br/>// UI elements to display with message  
ui_elements?: {  
quick_replies?: Array&lt;{ label: string, value: string }&gt;  
cards?: Array&lt;CoordinatedItem&gt; // Show items inline  
animation?: string // "confetti", "celebration"  
}  
}

### Why This Schema Works for Everything

**Household Chores** (current): - Group: { type: 'household', name: 'Brooklyn Apt 4B' } - Items: { item_type: 'chore', title: 'Clean kitchen', metadata: { difficulty: 3 } }

**Trip Planning** (future): - Group: { type: 'trip', name: 'Tokyo 2026' } - Items: - { item_type: 'trip_planning_task', title: 'Book flights', metadata: { deadline: '2026-01-15' } } - { item_type: 'trip_activity', title: 'Visit teamLab', metadata: { time_slot: '3pm', cost_per_person: 35 } } - { item_type: 'expense', title: 'Hotel deposit', metadata: { amount: 800, paid_by: 'sarah' } }

**Project Team** (future): - Group: { type: 'project', name: 'Q1 Marketing Campaign' } - Items: { item_type: 'task', title: 'Design landing page', metadata: { priority: 'high' } }

**The key**: metadata is flexible JSONB that holds domain-specific data.

## MOCK DATA

### The Group

const brooklynApt = {  
id: 'group-001',  
name: 'Brooklyn Apartment 4B',  
group_type: 'household',  
created_at: '2024-11-01T10:00:00Z',  
settings: {  
timezone: 'America/New_York',  
enabled_domains: \['chores', 'expenses', 'shopping'\]  
}  
}

### The Members

const members = \[  
{  
id: 'sarah',  
group_id: 'group-001',  
name: 'You',  
avatar: '👩🏻‍💼',  
role: 'creator'  
},  
{  
id: 'mike',  
group_id: 'group-001',  
name: 'Mike Rodriguez',  
avatar: '👨🏽‍💻',  
role: 'member'  
},  
{  
id: 'jessica',  
group_id: 'group-001',  
name: 'Jessica Taylor',  
avatar: '👩🏼‍💼',  
role: 'member'  
},  
{  
id: 'bob',  
group_id: 'group-001',  
name: 'Bob Kim',  
avatar: '👨🏻‍🎨',  
role: 'member'  
}  
\]

### Coordinated Items (Chores, Expenses, Shopping)

const items = \[  
// === CHORES ===  
{  
id: 'chore-001',  
group_id: 'group-001',  
item_type: 'chore',  
title: 'Clean kitchen',  
status: 'pending',  
assigned_to: \['sarah'\],  
due_date: '2024-11-20T20:00:00Z',  
recurrence: 'weekly',  
metadata: {  
difficulty: 3,  
estimated_minutes: 30,  
location: 'kitchen'  
}  
},  
{  
id: 'chore-002',  
group_id: 'group-001',  
item_type: 'chore',  
title: 'Take out trash',  
status: 'pending',  
assigned_to: \['sarah'\],  
due_date: '2024-11-23T09:00:00Z',  
recurrence: 'weekly',  
metadata: {  
difficulty: 2,  
estimated_minutes: 10  
}  
},  
{  
id: 'chore-003',  
group_id: 'group-001',  
item_type: 'chore',  
title: 'Clean bathroom',  
status: 'pending',  
assigned_to: \['mike'\],  
due_date: '2024-11-21T20:00:00Z',  
recurrence: 'weekly',  
metadata: {  
difficulty: 4,  
estimated_minutes: 45,  
location: 'bathroom'  
}  
},  
{  
id: 'chore-004',  
group_id: 'group-001',  
item_type: 'chore',  
title: 'Vacuum living room',  
status: 'completed',  
assigned_to: \['jessica'\],  
due_date: '2024-11-22T18:00:00Z',  
completed_at: '2024-11-22T17:30:00Z',  
completed_by: 'jessica',  
metadata: {  
difficulty: 2,  
estimated_minutes: 20  
}  
},  
{  
id: 'chore-005',  
group_id: 'group-001',  
item_type: 'chore',  
title: 'Do dishes',  
status: 'overdue',  
assigned_to: \['mike'\],  
due_date: '2024-11-19T23:00:00Z',  
recurrence: 'daily',  
metadata: {  
difficulty: 2,  
estimated_minutes: 15  
}  
},  
<br/>// === EXPENSES ===  
{  
id: 'expense-001',  
group_id: 'group-001',  
item_type: 'expense',  
title: 'Groceries (Trader Joe\\'s)',  
status: 'pending',  
metadata: {  
amount: 94.50,  
currency: 'USD',  
paid_by: 'mike',  
split_method: 'equal',  
category: 'groceries',  
date: '2024-11-18'  
}  
},  
{  
id: 'expense-002',  
group_id: 'group-001',  
item_type: 'expense',  
title: 'November utilities',  
status: 'pending',  
metadata: {  
amount: 168.00,  
currency: 'USD',  
paid_by: 'jessica',  
split_method: 'equal',  
category: 'utilities',  
date: '2024-11-15'  
}  
},  
{  
id: 'expense-003',  
group_id: 'group-001',  
item_type: 'expense',  
title: 'WiFi & streaming',  
status: 'completed',  
completed_at: '2024-11-10T12:00:00Z',  
metadata: {  
amount: 89.99,  
currency: 'USD',  
paid_by: 'bob',  
split_method: 'equal',  
category: 'subscriptions',  
date: '2024-11-01'  
}  
},  
<br/>// === SHOPPING ===  
{  
id: 'shopping-001',  
group_id: 'group-001',  
item_type: 'shopping_item',  
title: 'Milk (whole)',  
status: 'pending',  
assigned_to: \['sarah'\],  
metadata: {  
quantity: 1,  
store: 'bodega on corner',  
urgency: 'medium',  
requested_by: 'bob'  
}  
},  
{  
id: 'shopping-002',  
group_id: 'group-001',  
item_type: 'shopping_item',  
title: 'Toilet paper',  
status: 'pending',  
metadata: {  
quantity: 2,  
urgency: 'high',  
requested_by: 'jessica'  
}  
},  
{  
id: 'shopping-003',  
group_id: 'group-001',  
item_type: 'shopping_item',  
title: 'Dish soap',  
status: 'pending',  
assigned_to: \['bob'\],  
metadata: {  
quantity: 1,  
store: 'Target',  
urgency: 'low',  
requested_by: 'mike'  
}  
}  
\]

### Fairness Data (Pre-calculated for Demo)

const fairnessStats = {  
period: 'last_30_days',  
members: \[  
{  
member_id: 'sarah',  
chores: { completed: 11, assigned: 12, rate: 0.92 },  
expenses: { paid: 2, owed: 1, net_balance: -23.50 },  
shopping: { completed: 4, assigned: 5 }  
},  
{  
member_id: 'mike',  
chores: { completed: 10, assigned: 13, rate: 0.77 },  
expenses: { paid: 3, owed: 2, net_balance: 23.50 },  
shopping: { completed: 2, assigned: 3 }  
},  
{  
member_id: 'jessica',  
chores: { completed: 12, assigned: 13, rate: 0.92 },  
expenses: { paid: 3, owed: 1, net_balance: 42.00 },  
shopping: { completed: 3, assigned: 3 }  
},  
{  
member_id: 'bob',  
chores: { completed: 11, assigned: 12, rate: 0.92 },  
expenses: { paid: 2, owed: 3, net_balance: -42.00 },  
shopping: { completed: 5, assigned: 5 }  
}  
\]  
}

## CONVERSATION SCRIPTS

\[See separate document: CONVERSATION_SCRIPTS.docx\]

Each scenario includes: - Trigger condition - Word-for-word dialogue - Quick-reply button text - UI elements to display - Animation cues - User switching notes (for multi-user scenarios)

## TECHNICAL NOTES FOR CURSOR

### SvelteKit 5 + Runes

Use latest syntax (as of Nov 2025): - \$state() for reactive state - \$derived() for computed values - \$effect() for side effects - No more let for reactive variables in components

### Project Structure

src/  
├── lib/  
│ ├── components/ (UI components)  
│ ├── data/ (mock data files)  
│ ├── stores/ (app state using runes)  
│ └── utils/ (helpers, formatters)  
├── routes/  
│ └── +page.svelte (main app)  
└── app.css (global styles, animations)

### State Management

Use Svelte 5 runes for all state:

// stores/app.svelte.ts  
export const appState = \$state({  
currentUser: 'sarah',  
conversations: { /\* ... \*/ }  
})

### Animations

Use Svelte's built-in: - transition: directives (fade, slide, fly) - animate:flip for list reordering - spring() from svelte/motion - CSS animations for complex effects

### Vercel Deployment

- Use @sveltejs/adapter-vercel
- Should deploy with zero config
- Static assets in /static
- No server-side rendering needed (can be static if preferred)

## BUILD PHASES (HIGH-LEVEL)

### Phase 1: Foundation (Day 1)

- SvelteKit project setup
- Design system (colors, typography, global styles)
- Basic chat UI shell
- Demo meta-menu

### Phase 2: Core Components (Day 2)

- Message bubbles (user/AI)
- Quick-reply buttons
- Card components (task, expense, shopping)
- Typing indicator

### Phase 3: Data & Scenarios (Day 3)

- Mock data setup
- Conversation state management
- First 3 scenarios (View Tasks, Fairness, Trade)
- User switching

### Phase 4: Remaining Scenarios (Day 4)

- Scenarios 4-7 (Reminder, Transparency, Complete, Optimization)
- Advanced scenarios if time (Conflict, Preferences)

### Phase 5: Animations & Polish (Day 5-6)

- All entrance/exit animations
- Micro-interactions
- Staggered lists
- Gradient backgrounds
- Transitions

### Phase 6: Final Polish (Day 7)

- Demo menu refinements
- Keyboard shortcuts
- Mobile responsive checks
- Deploy to Vercel
- CEO walkthrough prep

## SUCCESS CRITERIA

**This demo is successful if**:

✅ CEO can open on their phone and immediately engage  
✅ Conversations feel natural and witty  
✅ UI is visually stunning (late 2025 aesthetic)  
✅ Animations delight without slowing down  
✅ Demonstrates value across 3 domains (chores, expenses, shopping)  
✅ Shows AI mediation clearly (user switching demonstrates this)  
✅ Leaves CEO saying "I want this to exist"

**Not success criteria**: - Code quality (it's throwaway) - Real AI integration - Scalability - Data persistence

## FINAL NOTES

**Remember**: This is theater, not engineering.

Focus on: - Beautiful visuals - Smooth animations - Convincing AI personality - Clear value demonstration

Don't worry about: - Backend architecture - Real AI - Edge cases - Production readiness

**The goal**: Get investment to build the real thing.

_This specification was developed by the Collective Think Tank Council for a CEO investment pitch prototype._

_"The prototype is the pitch." - The Council_