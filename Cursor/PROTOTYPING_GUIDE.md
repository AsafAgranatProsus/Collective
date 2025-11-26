# Prototyping Guide

> **Purpose**: Conventions and guidelines for extending the Collective prototype.
> This document ensures consistent, maintainable scenario development.

---

## Data Architecture Overview

```
lib/data/
├── types.ts          # Unified type exports (import types from here)
├── fragments.ts      # Reusable content pieces (quick replies, card patterns)
├── scenarios.ts      # AI conversation scenarios
├── groups.ts         # Group definitions and metadata
├── household.ts      # Member data for Brooklyn Apt demo
├── items.ts          # Chores, expenses, shopping items
├── groupChat.ts      # Peer-to-peer chat messages
└── analytics.ts      # Auto-calculated from items.ts (read-only)

lib/config/
└── prototypeModes.ts # UX mode configurations
```

### Dependency Flow

```
types.ts ← (re-exports from all data files)
     ↑
scenarios.ts → fragments.ts (uses content pieces)
     ↓
items.ts ← analytics.ts (auto-calculates)
     ↓
household.ts (member data)
     ↓
groups.ts (group metadata)
```

---

## Scenario Development Rules

### 1. Check Fragments First

Before creating new quick replies or card patterns:
```typescript
// ✅ DO: Import from fragments
import { QUICK_REPLIES, CARD_SECTIONS } from './fragments';

ui_elements: {
  quick_replies: QUICK_REPLIES.confirmation
}

// ❌ DON'T: Duplicate common patterns inline
ui_elements: {
  quick_replies: [
    { label: 'Sounds good', value: 'confirm' },
    { label: 'Thanks!', value: 'thanks' }
  ]
}
```

### 2. Extend, Don't Duplicate

When adding variations to existing scenarios:
```typescript
// ✅ DO: Add messages to existing scenario
viewMyTasksScenario.messages.push(newMessage);

// ✅ DO: Create branching scenarios that reference base
export const viewMyTasksVariant = {
  ...viewMyTasksScenario,
  id: 'scenario-1-variant',
  messages: [...viewMyTasksScenario.messages.slice(0, 3), customBranch]
};

// ❌ DON'T: Copy entire scenario and modify
```

### 3. Use Content Fragments by Reference

```typescript
// ✅ DO: Reference fragment functions
card_schema: {
  sections: [
    CARD_SECTIONS.moneyHeader,
    CARD_SECTIONS.choresList(myItems)
  ]
}

// ❌ DON'T: Copy-paste card section definitions
```

---

## When to Create New vs Extend

### Create a NEW Scenario When:
- Fundamentally different user journey (e.g., new user vs returning user)
- Different starting context (different user, different group state)
- Demonstrating a completely different feature area

### EXTEND an Existing Scenario When:
- Adding an alternative path in existing flow
- Adding more messages to existing conversation
- Creating a variant for different demo purposes
- Adding new quick reply options to existing messages

---

## Naming Conventions

### Scenario IDs
```
scenario-{number}           # Main scenarios: scenario-1, scenario-2
scenario-{number}-variant   # Variants: scenario-1-variant
onboarding                  # Special flows use descriptive names
post-onboarding-group       # Compound names with hyphens
```

### Message IDs
```
msg-{scenario}-{sequence}   # msg-1-1, msg-1-2 (scenario 1, message 1, 2)
onboard-{sequence}          # onboard-1, onboard-2 (onboarding flow)
```

### Fragment Keys
```
QUICK_REPLIES.camelCase     # confirmation, yesNo, showDetails
CARD_SECTIONS.camelCase     # moneyHeader, choresList
MESSAGE_TEMPLATES.camelCase # taskComplete, welcomeMessage
```

---

## Code Size Guidelines

### File Size Limits
| File | Max Lines | Action if Exceeded |
|------|-----------|-------------------|
| scenarios.ts | 1500 | Split into scenario-groups/ folder |
| fragments.ts | 500 | Split by category (quickReplies.ts, cardPatterns.ts) |
| Any data file | 300 | Consider splitting by domain |

### Scenario Size
- **Target**: 50-100 lines per scenario
- **Max**: 200 lines per scenario
- If larger: Consider breaking into sub-scenarios with shared references

---

## Presentation Mode

### Development vs Presentation

| Aspect | Development Mode | Presentation Mode |
|--------|-----------------|-------------------|
| Purpose | Iterate, test, explore | Demo to users/stakeholders |
| Data state | Can be inconsistent | Must be pristine |
| Debug info | Visible (MetaMenu) | Hidden |
| Scenarios | All available | Curated subset |
| Reset | Manual | One-click reset |

### Marking Scenarios as Presentation-Ready

In `lib/config/prototypeModes.ts`:
```typescript
export const PRESENTATION_SCENARIOS = [
  'scenario-1',      // View My Tasks - tested, polished
  'onboarding',      // New user flow - tested, polished
  // Add scenarios here only after verification
];
```

### Presentation Readiness Checklist

Before adding a scenario to `PRESENTATION_SCENARIOS`:

- [ ] All messages display correctly (no cut-off text)
- [ ] Cards render without errors
- [ ] Quick replies all have working handlers
- [ ] Timestamps are realistic (not all "just now")
- [ ] Member names consistent with household.ts
- [ ] No console errors during flow
- [ ] Flow has clear beginning and end
- [ ] Reset to initial state works correctly

### State Reset Pattern

For user testing sessions:
```typescript
// In app.svelte.ts or dedicated reset module
export function resetToPresentation() {
  // Clear conversation state
  clearAllConversations();
  // Reset to known group state
  resetGroupState();
  // Navigate to entry point
  goto('/groups');
}
```

---

## Adding New Content

### Adding Quick Replies

1. Check if similar exists in `fragments.ts`
2. If new, add to appropriate category in `fragments.ts`
3. Use in scenario via import

```typescript
// fragments.ts
export const QUICK_REPLIES = {
  // ... existing
  newCategory: [
    { label: 'Option A', value: 'option_a' },
    { label: 'Option B', value: 'option_b' }
  ]
};
```

### Adding Card Patterns

1. Check `CARD_SECTIONS` in `fragments.ts`
2. For static patterns, add as object
3. For dynamic patterns, add as function

```typescript
// Static pattern
export const CARD_SECTIONS = {
  successHeader: { type: 'header', title: 'Success!', icon: 'success' }
};

// Dynamic pattern
export const CARD_SECTIONS = {
  expenseRow: (label: string, amount: number) => ({
    type: 'stat_row',
    label,
    value: `$${amount}`,
    icon: 'money'
  })
};
```

### Adding Members

1. Add to `household.ts` members array
2. Ensure ID is unique and lowercase
3. Update `groups.ts` if member belongs to a group

### Adding Items (Chores/Expenses)

1. Add to `items.ts` array
2. Follow existing pattern with all required fields
3. Analytics will auto-calculate from items

---

## Common Mistakes to Avoid

### ❌ Hardcoding Data in Scenarios
```typescript
// BAD: Hardcoded member name
content: "Mike owes you $23"

// GOOD: Reference from data or use template
content: MESSAGE_TEMPLATES.owesYou('Mike', 23)
```

### ❌ Inconsistent Timestamps
```typescript
// BAD: All messages have same timestamp
timestamp: new Date().toISOString()

// GOOD: Staggered timestamps for realism
timestamp: new Date(Date.now() - 60000).toISOString() // 1 min ago
```

### ❌ Orphaned Handlers
```typescript
// BAD: Quick reply with no handler in group/[id]/+page.svelte
{ label: 'New option', value: 'new_option' }

// GOOD: Always add corresponding handler
// In handleQuickReply(): case 'new_option': ...
```

### ❌ Modifying analytics.ts Directly
```typescript
// BAD: Hardcoding analytics data
export const weekData = { completion_rate: 0.85 };

// GOOD: Analytics auto-calculates from items.ts
// Modify items.ts to change analytics output
```

---

## File Reference

| When you need... | Look in... |
|-----------------|------------|
| Type definitions | `lib/data/types.ts` |
| Reusable content | `lib/data/fragments.ts` |
| Conversation flows | `lib/data/scenarios.ts` |
| Group metadata | `lib/data/groups.ts` |
| Member info | `lib/data/household.ts` |
| Chores/expenses/shopping | `lib/data/items.ts` |
| Peer chat messages | `lib/data/groupChat.ts` |
| Performance stats | `lib/data/analytics.ts` (read-only) |
| UX mode config | `lib/config/prototypeModes.ts` |

