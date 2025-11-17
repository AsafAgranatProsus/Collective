# COLLECTIVE - FINAL APP STRUCTURE & NAVIGATION

**Multi-Group Architecture with AI Chat + Group Chat**  
**Updated Demo Specification**

## EXECUTIVE SUMMARY

This document specifies the final app structure incorporating:

✅ **Multi-group list** (WhatsApp-style, 1 active + 2 fake groups)  
✅ **AI chat scoped per group** (main interface)  
✅ **Group chat as secondary feature** (icon, not toggle)  
✅ **AI observes group chat** (passive integration)  
✅ **Clean navigation hierarchy** (list → AI chat → group chat)

## ARCHITECTURAL DECISIONS

### 1\. Multi-Group Structure

**Decision**: App opens to a group list showing all groups user belongs to.

**For Demo**: - **1 working group**: Brooklyn Apartment 4B (fully functional) - **2 fake groups**: Tokyo Trip 2026, Q1 Marketing Campaign (grayed out, not clickable)

**Purpose**: Demonstrates platform scalability without building multiple full groups.

**CEO Takeaway**: "This isn't just a household app - it's a coordination platform that scales to trips, projects, teams."

### 2\. AI Chat is Group-Scoped

**Decision**: Each group has its own AI conversation context.

**Implementation**: - AI only knows about the current group (Brooklyn Apt) - "What are my tasks?" → Shows Brooklyn Apt tasks only - "How's everyone doing?" → Brooklyn Apt members only - Switching groups would load different AI conversation (not built in demo)

**No cross-group analytics**: Mixing household chores with trip planning with work tasks = chaos.

**Future consideration**: Separate "All Tasks" view across groups, but NOT for demo.

### 3\. Group Chat as Secondary Feature

**Decision**: Group chat accessed via icon (👥), not toggle.

**Why not toggle**: - Toggle implies equal priority - AI should be primary, group chat secondary - Icon placement makes hierarchy clear

**Visual Hierarchy**:

AI Chat (Main View)  
↓  
Group Chat Icon (Top-Right)  
↓  
Group Chat Overlay (Secondary)

### 4\. AI Observes, Doesn't Post

**Decision**: AI reads group chat but doesn't participate in it.

**Passive Integration**: - AI monitors group chat messages - Learns context (Mike traveling, bathroom cleaning discussion) - Responds in 1:1 AI chat, not in group chat - Proposes actions based on group discussion

**Why passive**: - Simpler to implement - Less intrusive (AI isn't "spying" visibly) - Preserves group chat as human space - Still demonstrates intelligence

**Future**: Could add active AI participation, but not for demo.

## THREE-LEVEL STRUCTURE

### Level 1: Group List (Entry Point)

**What It Is**: WhatsApp-style list of all groups user belongs to.

**Purpose**: - Show platform scalability - Let user select which group to coordinate - Entry point to app

**Content**: - Brooklyn Apartment 4B (active, tappable) - Tokyo Trip 2026 (fake, grayed out) - Q1 Marketing Campaign (fake, grayed out) - "+ Create New Group" button (non-functional)

### Level 2: AI Chat (Main Interface)

**What It Is**: 1:1 conversation with AI about the selected group.

**Purpose**: - Primary coordination interface - All scenarios happen here - User's main interaction

**Navigation**: - Back arrow → Returns to group list - Group name (center) → Shows current context - Group chat icon 👥 (right) → Opens group chat

### Level 3: Group Chat (Secondary)

**What It Is**: Peer-to-peer chat for group discussions.

**Purpose**: - Discuss things that need group input - Social bonding - Decisions that AI can't make

**Navigation**: - Back arrow → Returns to AI chat

## DETAILED SPECIFICATIONS

### LEVEL 1: GROUP LIST

**Visual Design**:

┌─────────────────────────────────────┐  
│ │  
│ ☰ Collective │  
│ │  
│ My Groups │  
│ │  
│ ┌─────────────────────────────┐ │  
│ │ 🏠 Brooklyn Apartment 4B │ │ ← ACTIVE  
│ │ 4 members • 3 pending tasks │ │ Full color  
│ └─────────────────────────────┘ │ Shadow  
│ │ Tappable  
│ ┌─────────────────────────────┐ │  
│ │ ✈️ Tokyo Trip 2026 │ │ ← FAKE  
│ │ 3 members • Coming soon │ │ 50% opacity  
│ └─────────────────────────────┘ │ Not tappable  
│ │  
│ ┌─────────────────────────────┐ │  
│ │ 💼 Q1 Marketing Campaign │ │ ← FAKE  
│ │ 5 members • Coming soon │ │ 50% opacity  
│ └─────────────────────────────┘ │ Not tappable  
│ │  
│ + Create New Group │  
│ │  
└─────────────────────────────────────┘

**Components**:

**GroupCard.svelte**: - Props: group (object), isActive (boolean) - Layout: - Icon (emoji, large): Left side - Name: Top, bold, 18px - Metadata: Bottom, muted, 14px (members count, status) - Styling: - Active: White background, shadow, full opacity - Inactive: 50% opacity, "Coming soon" badge, no shadow - Interaction: - Active: Tap → Navigate to /group/\[id\] - Inactive: Tap → No action (or toast: "Coming in full version")

**Design Specs**: - **Background**: Light gradient or solid color - **Cards**: - Width: 90% of screen, max 400px - Height: 80px - Padding: 16px - Border-radius: 12px - Margin between cards: 12px - **Typography**: - Name: Inter 18px, semibold - Metadata: Inter 14px, regular, muted - **Colors**: - Active: White #FFFFFF, shadow - Inactive: White #FFFFFF at 50% opacity - **Animation**: - List loads: Cards stagger in from bottom (50ms delay each) - Tap active card: Scale to 0.98, then navigate

### LEVEL 2: AI CHAT (MAIN VIEW)

**Visual Design**:

┌─────────────────────────────────────┐  
│ ← Collective Brooklyn Apt 4B 👥 │ ← Header  
├─────────────────────────────────────┤  
│ │  
│ \[AI Conversation\] │  
│ │  
│ AI: Morning Sarah! Got your week │  
│ sorted out. Want the rundown? │  
│ │  
│ \[What's on my plate?\] │  
│ \[Just chores\] │  
│ \[Everything\] │  
│ │  
│ │  
│ │  
├─────────────────────────────────────┤  
│ \[Chat Input\] │  
└─────────────────────────────────────┘

**Header Components**:

**Left: Back Button** - Icon: ← or chevron-left - Tap: Navigate to /groups (group list) - Size: 24px - Color: Primary text color

**Center: Group Name** - Text: Current group name ("Brooklyn Apartment 4B") - Font: Inter 16px, semibold - Truncate if too long

**Right: Group Chat Icon** - Icon: 👥 or chat-bubble-group - Tap: Open group chat overlay - Size: 24px - Color: Primary text color - Badge: Optional red dot if unread messages (nice-to-have)

**Header Styling**: - Height: 60px - Background: White or subtle gradient - Border-bottom: 1px #E5E7EB - Padding: 16px horizontal - Fixed position (doesn't scroll)

**Body**: - Same as current AI chat design - All scenarios work here - Scrollable - Background: Duotone gradient (as designed)

**Footer**: - Same as current chat input - Fixed position bottom

**Changes from Current Design**: - ✅ Add header with back button and group name - ✅ Add group chat icon (👥) to header - ✅ Ensure AI conversation is scoped to this group - ✅ Everything else stays the same

### LEVEL 3: GROUP CHAT (OVERLAY)

**Visual Design**:

┌─────────────────────────────────────┐  
│ ← Group Chat │ ← Header (simple)  
├─────────────────────────────────────┤  
│ │  
│ Bob Kim 👨🏻‍🎨 │  
│ Anyone else think we need to clean │  
│ the bathroom more often? Getting │  
│ kinda gross │  
│ 2:23 PM │  
│ │  
│ Jessica Taylor 👩🏼‍💼 │  
│ Yeah agree │  
│ 2:25 PM │  
│ │  
│ Sarah Chen 👩🏻‍💼 (You) │  
│ I'm down for weekly instead of │  
│ bi-weekly │  
│ 2:26 PM │  
│ │  
│ Mike Rodriguez 👨🏽‍💻 │  
│ Same │  
│ 2:27 PM │  
│ │  
├─────────────────────────────────────┤  
│ \[Message Input\] │  
└─────────────────────────────────────┘

**Appearance**: - **Desktop**: Slides in from right, 400px width, full height - **Mobile**: Slides up from bottom, full width, full height - **Background**: White or very light gray #F8F9FA - **Different from AI chat**: Lighter, more casual, traditional chat UI

**Header**: - Back button (←) + "Group Chat" title - Simple, minimal - Same height as AI chat header (60px)

**Message Layout**: - All messages left-aligned (not split like AI chat) - Each message shows: - **Sender name** + **avatar** (emoji) at top - **Message content** in bubble - **Timestamp** below (right-aligned, small, muted) - Spacing: 16px between messages

**Message Bubble Styling**: - Background: Light gray #F3F4F6 for others - Background: Accent color for user's messages (light lime #E8FFD0) - Padding: 12px - Border-radius: 12px (all corners rounded) - Max-width: 75% of container

**Typography**: - Sender name: Inter 14px, semibold - Message: Inter 15px, regular - Timestamp: Inter 12px, muted

**Messages**: - Scroll to bottom on open - No typing indicator (static messages for demo) - No read receipts

**Input**: - Same design as AI chat input - For demo: Can type and add message to list (local only, not saved) - Functional but ephemeral

**Animation**: - Entrance: Slide from right (desktop) or bottom (mobile), 300ms ease-out - Exit: Slide back, 250ms - Messages: Fade in on load (100ms each)

## MOCK DATA STRUCTURE

### Group List Data

// src/lib/data/groups.ts  
<br/>export interface Group {  
id: string  
name: string  
icon: string // emoji  
type: 'household' | 'trip' | 'project' | 'event' | 'team'  
member_count: number  
pending_count?: number  
is_active: boolean // true = clickable, false = grayed out  
members?: string\[\] // member IDs  
}  
<br/>export const groups: Group\[\] = \[  
{  
id: 'brooklyn-apt',  
name: 'Brooklyn Apartment 4B',  
icon: '🏠',  
type: 'household',  
member_count: 4,  
pending_count: 3,  
is_active: true,  
members: \['sarah', 'mike', 'jessica', 'bob'\]  
},  
{  
id: 'tokyo-trip',  
name: 'Tokyo Trip 2026',  
icon: '✈️',  
type: 'trip',  
member_count: 3,  
pending_count: 0,  
is_active: false,  
members: \['sarah', 'alex', 'jordan'\]  
},  
{  
id: 'q1-marketing',  
name: 'Q1 Marketing Campaign',  
icon: '💼',  
type: 'project',  
member_count: 5,  
pending_count: 0,  
is_active: false,  
members: \['sarah', 'team1', 'team2', 'team3', 'team4'\]  
}  
\]

### Group Chat Messages

// src/lib/data/groupChat.ts  
<br/>export interface GroupChatMessage {  
id: string  
sender: string // member ID  
sender_name: string  
avatar: string // emoji  
content: string  
timestamp: string // ISO date  
}  
<br/>export const groupChatMessages: Record&lt;string, GroupChatMessage\[\]&gt; = {  
'brooklyn-apt': \[  
{  
id: 'gc-001',  
sender: 'bob',  
sender_name: 'Bob Kim',  
avatar: '👨🏻‍🎨',  
content: 'Anyone else think we need to clean the bathroom more often? Getting kinda gross',  
timestamp: '2024-11-17T14:23:00Z'  
},  
{  
id: 'gc-002',  
sender: 'jessica',  
sender_name: 'Jessica Taylor',  
avatar: '👩🏼‍💼',  
content: 'Yeah agree',  
timestamp: '2024-11-17T14:25:00Z'  
},  
{  
id: 'gc-003',  
sender: 'sarah',  
sender_name: 'Sarah Chen',  
avatar: '👩🏻‍💼',  
content: "I'm down for weekly instead of bi-weekly",  
timestamp: '2024-11-17T14:26:00Z'  
},  
{  
id: 'gc-004',  
sender: 'mike',  
sender_name: 'Mike Rodriguez',  
avatar: '👨🏽‍💻',  
content: 'Same',  
timestamp: '2024-11-17T14:27:00Z'  
},  
{  
id: 'gc-005',  
sender: 'mike',  
sender_name: 'Mike Rodriguez',  
avatar: '👨🏽‍💻',  
content: "Also FYI I'm traveling next week",  
timestamp: '2024-11-17T16:30:00Z'  
},  
{  
id: 'gc-006',  
sender: 'sarah',  
sender_name: 'Sarah Chen',  
avatar: '👩🏻‍💼',  
content: 'No worries! Have fun',  
timestamp: '2024-11-17T16:32:00Z'  
},  
{  
id: 'gc-007',  
sender: 'jessica',  
sender_name: 'Jessica Taylor',  
avatar: '👩🏼‍💼',  
content: 'Pizza tonight?',  
timestamp: '2024-11-17T18:15:00Z'  
},  
{  
id: 'gc-008',  
sender: 'bob',  
sender_name: 'Bob Kim',  
avatar: '👨🏻‍🎨',  
content: "I'm in!",  
timestamp: '2024-11-17T18:16:00Z'  
}  
\]  
}

**Note**: Mix coordination talk (bathroom cleaning, traveling) with casual chat (pizza) to show AI can differentiate.

## NEW SCENARIO: AI OBSERVES GROUP CHAT

### Scenario 8: "AI Learns from Group Conversation"

**Purpose**: Demonstrate AI reading group chat and acting on it.

**Setup**: - User (Sarah) is in AI chat - Switches to group chat (taps 👥) - Sees bathroom cleaning discussion - Returns to AI chat (taps ← Back)

**Flow**:

STEP 1: User Opens Group Chat  
<br/>\[User is in AI Chat view\]  
<br/>\[User taps 👥 icon in header\]  
<br/>\[Group chat slides in from right\]  
<br/>\[Shows messages:\]  
<br/>Bob: Anyone else think we need to clean  
the bathroom more often? Getting kinda gross  
<br/>Jessica: Yeah agree  
<br/>Sarah: I'm down for weekly instead of bi-weekly  
<br/>Mike: Same  
<br/>\[User reads messages\]

STEP 2: User Returns to AI Chat  
<br/>\[User taps ← Back button\]  
<br/>\[Group chat slides out\]  
<br/>\[Back in AI Chat view\]  
<br/>\[After 1.5 second delay, typing indicator appears\]  
<br/>\[AI sends proactive message:\]  
<br/>AI: Hey Sarah, I noticed you all discussed  
bathroom cleaning in the group chat.  
<br/>Want me to update it to weekly starting  
this week?  
<br/>\[Buttons appear:\]  
\[Yeah, do it\] \[Let me check with everyone first\]

STEP 3: User Confirms Action  
<br/>\[User taps: "Yeah, do it"\]  
<br/>\[User message appears: "Yeah, do it"\]  
<br/>\[Typing indicator: 0.8s\]  
<br/>AI: Done! Changed bathroom cleaning to weekly.  
I redistributed assignments to keep things balanced.  
<br/>\[Card appears showing updated schedule:\]  
<br/>┌─────────────────────────────────┐  
│ Updated: Bathroom Cleaning │  
│ │  
│ New frequency: Weekly │  
│ Was: Bi-weekly │  
│ │  
│ Next assignments: │  
│ • This week: Mike │  
│ • Next week: Jessica │  
│ • Following week: Bob │  
│ │  
│ Since it's more frequent now, I │  
│ lowered the difficulty weight. │  
└─────────────────────────────────┘  
<br/>\[AI continues:\]  
<br/>AI: I also adjusted fairness calculations  
so the increased frequency doesn't throw  
things off. Everyone's still balanced.  
<br/>\[End Scenario\]

**Key Moments**: 1. User sees group discussion about coordination 2. Returns to AI chat 3. AI proactively mentions it (shows awareness) 4. User confirms 5. AI takes action immediately 6. Shows clear results

**What This Demonstrates**: - ✅ AI reads group chat - ✅ AI understands context from group discussion - ✅ AI doesn't interrupt group conversation - ✅ AI acts in 1:1 context (respectful of group space) - ✅ Group decisions → AI execution (efficiency) - ✅ Synergy between group chat and AI chat

## ROUTING & NAVIGATION

### URL Structure

/ → Redirects to /groups  
/groups → Group list (Level 1)  
/group/\[id\] → AI chat for specific group (Level 2)  
/group/\[id\]?chat=open → AI chat with group chat overlay open

**For Demo**: - Only /group/brooklyn-apt is functional - /group/tokyo-trip and /group/q1-marketing → Show "Coming soon" or return to list

### Navigation Flows

**Flow 1: Browse Groups → Chat with AI**

Open app  
↓  
/groups (group list)  
↓  
Tap "Brooklyn Apartment 4B"  
↓  
/group/brooklyn-apt (AI chat)

**Flow 2: View Group Chat → Return**

In /group/brooklyn-apt (AI chat)  
↓  
Tap 👥 (group chat icon)  
↓  
Group chat overlay opens  
↓  
Tap ← Back  
↓  
Group chat closes, back to AI chat

**Flow 3: Return to Group List**

In /group/brooklyn-apt (AI chat)  
↓  
Tap ← Back (top-left)  
↓  
/groups (group list)

**Navigation State Management**: - Use browser history (back button works) - Or use SvelteKit navigation with proper state - Group chat overlay can be URL param (?chat=open) or just component state

## COMPONENT ARCHITECTURE

### New Components Needed

**1\. GroupList.svelte** - Location: src/routes/groups/+page.svelte or src/lib/components/GroupList.svelte - Props: None (loads from groups data) - Renders: List of GroupCard components - Handles: Navigation to group on card tap

**2\. GroupCard.svelte** - Location: src/lib/components/GroupCard.svelte - Props: group (Group object), isActive (boolean) - Renders: Single group card with icon, name, metadata - Handles: Click navigation (if active), disabled state (if fake)

**3\. GroupChat.svelte** - Location: src/lib/components/GroupChat.svelte - Props: groupId (string), isOpen (boolean), onClose (function) - Renders: Overlay/modal with messages and input - Handles: Display messages, input (demo only), close

**4\. GroupChatMessage.svelte** - Location: src/lib/components/GroupChatMessage.svelte - Props: message (GroupChatMessage object), isCurrentUser (boolean) - Renders: Single message bubble with sender, content, timestamp - Styling: Different for current user vs others

### Updated Components

**5\. Update: +page.svelte for AI Chat** - Location: src/routes/group/\[id\]/+page.svelte - Changes: - Add header with back button, group name, group chat icon - Load conversations scoped to group ID - Open/close GroupChat overlay - Existing chat functionality unchanged

**6\. Update: MessageBubble.svelte (if needed)** - Ensure it can still render all card types - No major changes needed

## IMPLEMENTATION STEPS FOR CURSOR

### Step 1: Create Group List View

CREATE: src/routes/groups/+page.svelte  
<br/>This is the new entry point.  
<br/>Task:  
1\. Import groups from src/lib/data/groups.ts  
2\. Render GroupList component with groups  
3\. Handle navigation to /group/\[id\] on active group tap  
4\. Show "Coming soon" or disable tap for inactive groups  
<br/>CREATE: src/lib/components/GroupCard.svelte  
<br/>Task:  
1\. Receive group as prop  
2\. Render card with icon, name, member count, status  
3\. Style active vs inactive (opacity, shadow)  
4\. Handle tap (navigate if active, nothing if inactive)  
<br/>Design per specifications above:  
\- WhatsApp-style cards  
\- Full color for active, 50% opacity for fake  
\- Stagger animation on mount

### Step 2: Update AI Chat with Header

UPDATE: src/routes/group/\[id\]/+page.svelte  
<br/>Changes:  
1\. Add header component above chat  
2\. Header has three parts:  
\- Left: Back button (← navigate to /groups)  
\- Center: Group name (from route param)  
\- Right: Group chat icon (👥 opens overlay)  
3\. Load data scoped to \[id\] param  
4\. All existing chat functionality stays the same  
<br/>CREATE: ChatHeader.svelte (optional, or inline)  
<br/>Task:  
1\. Render back button, group name, group chat icon  
2\. Handle back navigation  
3\. Handle group chat toggle  
4\. Style per spec (60px height, fixed position)

### Step 3: Create Group Chat Overlay

CREATE: src/lib/components/GroupChat.svelte  
<br/>Task:  
1\. Receive groupId, isOpen, onClose as props  
2\. Load messages from groupChatMessages\[groupId\]  
3\. Render as overlay (slide-in from right/bottom)  
4\. Show header with back button  
5\. Render message list (use GroupChatMessage component)  
6\. Add input field (functional for demo, adds to local state)  
7\. Handle close (tap back button or outside overlay)  
<br/>Design per specifications:  
\- Lighter background than AI chat  
\- Different message styling (all left-aligned)  
\- Sender names + avatars  
\- Casual feel  
<br/>CREATE: src/lib/components/GroupChatMessage.svelte  
<br/>Task:  
1\. Receive message as prop  
2\. Render sender name, avatar, content, timestamp  
3\. Style differently for current user  
4\. Simple, clean design  
<br/>Animation:  
\- Overlay slides in from right (300ms)  
\- Messages fade in on load

### Step 4: Implement Scenario 8 (AI Observes Group Chat)

ADD TO: src/lib/data/scenarios.ts  
<br/>New scenario: "AI Observes Group Chat"  
<br/>Trigger:  
1\. User opens group chat (sees bathroom discussion)  
2\. User closes group chat (returns to AI)  
3\. After 1.5s delay, AI sends proactive message  
<br/>Flow:  
1\. AI: "I noticed you all discussed bathroom cleaning..."  
2\. \[Buttons: Yeah do it | Let me check with everyone\]  
3\. If "Yeah do it":  
AI: "Done! Changed to weekly..."  
\[Show updated schedule card\]  
<br/>Implementation:  
\- Track when user views group chat  
\- When they return, check if they saw coordination messages  
\- Trigger scenario with delay  
\- Follow script exactly as written  
<br/>This demonstrates AI awareness of group chat.

### Step 5: Visual Polish

Ensure all three views are visually distinct:  
<br/>GROUP LIST:  
\- Light background  
\- Cards with shadows  
\- Clean, organized  
\- WhatsApp-style  
<br/>AI CHAT:  
\- Duotone gradient background  
\- Existing design (as already built)  
\- Polished, modern  
<br/>GROUP CHAT:  
\- Light/white background  
\- Traditional chat UI  
\- More casual than AI chat  
\- Multiple sender avatars  
<br/>Typography:  
\- Consistent across all views  
\- Inter for all text  
\- JetBrains Mono for data/numbers  
<br/>Animations:  
\- Smooth transitions between views  
\- Group list: cards stagger in  
\- Group chat: slides in/out  
\- All animations 200-300ms

### Step 6: Navigation & State

Implement navigation:  
<br/>Use SvelteKit routing:  
\- /groups → Group list  
\- /group/\[id\] → AI chat  
<br/>Navigation actions:  
\- From group list: click card → navigate to /group/\[id\]  
\- From AI chat: back button → navigate to /groups  
\- Group chat: overlay (component state, not route)  
<br/>State management:  
\- Current group ID from route param  
\- Group chat open/closed: local state  
\- Conversations scoped to group ID  
<br/>Test:  
\- Can navigate from list to chat  
\- Can open/close group chat  
\- Back button works correctly  
\- Browser back/forward works

## DEMO WALKTHROUGH SCRIPT

### For CEO Presentation

**Opening (15 seconds)**:

"So this is Collective. Sarah opens the app and sees all her groups - her household, a trip she's planning with friends, a work project. Same AI, different contexts."

\[Show group list, point to each\]

**Main Demo (3 minutes)**:

"For today, we'll focus on her household."

\[Tap Brooklyn Apartment\]

"Now she's in a 1:1 conversation with the AI just for this household. Watch…"

\[Run Scenario 1: What's on my plate?\]

"The AI shows her everything - chores, expenses, shopping - all in one view across domains."

\[Show quick-reply buttons, task cards\]

"She can dig deeper…"

\[Run Scenario 2 or 6: Show analytics or complete task\]

**Group Chat Integration (1.5 minutes)**:

"But sometimes you need to discuss things as a group."

\[Tap 👥 icon\]

"There's group chat for that. See, they're talking about bathroom cleaning."

\[Show group messages\]

"Sarah goes back to the AI…"

\[Tap back, wait for AI message\]

\[AI: "I noticed you all discussed…"\]

"The AI reads the group chat and acts on it. Sarah doesn't have to manually update anything - the AI handles it based on the group decision."

\[Complete scenario\]

**Closing (30 seconds)**:

"So what you're seeing is: - One AI platform that works across all your groups - Private coordination with the AI when you need efficiency - Group discussions when you need input - AI learns from both and handles the coordination

It scales from households to trips to teams - same intelligence, different contexts."

**Total Time**: ~5 minutes

## BUILD TIME ESTIMATE

### Additional Work Beyond Current Build

**Group List**: - GroupList page + GroupCard component - Mock data - Navigation - **Time**: 3-4 hours

**AI Chat Header**: - Update existing chat with header - Back button + group name + group chat icon - Navigation handling - **Time**: 2-3 hours

**Group Chat Overlay**: - GroupChat component + GroupChatMessage component - Mock messages - Slide-in/out animation - Input field - **Time**: 5-6 hours

**Scenario 8 (AI Observes)**: - New scenario script - Trigger logic - Card for updated schedule - **Time**: 2-3 hours

**Polish & Integration**: - Visual consistency - Smooth transitions - Bug fixes - **Time**: 3-4 hours

**Total Additional Time**: 15-20 hours (2-2.5 days)

**Total Demo Build Time**: 5-7 days (including original scenarios)

## FINAL CHECKLIST

Before showing to CEO:

✅ Group list loads with 3 groups (1 active, 2 fake)  
✅ Tapping Brooklyn Apt navigates to AI chat  
✅ AI chat has header with back button and group name  
✅ All 7-9 original scenarios work  
✅ Group chat icon (👥) opens group chat overlay  
✅ Group chat shows mock messages  
✅ Back button from group chat returns to AI chat  
✅ Scenario 8 works (AI observes group chat)  
✅ Fake groups are grayed out and not clickable  
✅ Navigation flows smoothly (list → chat → group chat → back)  
✅ All views visually distinct  
✅ Mobile responsive  
✅ No console errors  
✅ Animations are smooth

## SUCCESS CRITERIA

**This structure is successful if**:

✅ CEO understands this is a platform (multi-group list shows scale)  
✅ AI coordination feels primary (not buried under group chat)  
✅ Group chat + AI synergy is clear (Scenario 8 demonstrates)  
✅ Navigation feels natural (WhatsApp-familiar)  
✅ Demo is polished and bug-free

**CEO walks away thinking**: "This isn't just a household app - it's an AI coordination platform that works for any group. And the group chat integration is smart - they work together, not against each other."

## SUMMARY

**What Changed from Previous Spec**: - Added multi-group list (entry point) - Scoped AI chat to specific group - Added group chat as overlay (not toggle) - Added Scenario 8 (AI observes group chat) - Updated navigation hierarchy

**What Stayed the Same**: - All original scenarios still work - AI chat design unchanged - Analytics system (progressive disclosure) - Visual aesthetic (late 2025, duotone, animations) - Core value prop (AI-mediated coordination)

**Key Innovation**: The synergy between group chat and AI chat - they're complementary, not competitive. Group discusses, AI executes.

_This specification incorporates all final architectural decisions for the Collective demo prototype._