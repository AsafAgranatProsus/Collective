# Material Design 3 Component Migration Plan

## Overview
This document outlines the complete migration of all custom UI components to proper Material Design 3 (M3) components from the `m3-svelte` library.

## ✅ Completed (Phase 1)

### 1. QuickReplyButtons Component
- **File**: `src/lib/components/QuickReplyButtons.svelte`
- **Changes**: 
  - Replaced custom `<button>` with M3 `<Button variant="outlined">`
  - Removed all custom button styling
  - Kept transition animations
- **Status**: ✅ Complete & Verified

### 2. ChatInput Component
- **File**: `src/lib/components/ChatInput.svelte`
- **Changes**:
  - Replaced custom `<input>` with M3 `<TextField type="filled" />`
  - Replaced custom send button with M3 `<Button variant="filled" iconType="full">`
  - Imported Material Symbols `iconSend`
  - Simplified styling to layout only
- **Status**: ✅ Complete & Verified

---

## 🔄 Remaining Work (Phase 2-5)

## Phase 2: Buttons Replacement

### 2.1 GroupChat Component
**File**: `src/lib/components/GroupChat.svelte`

**Current Implementation**:
```svelte
<!-- Line 106: Back button -->
<button class="back-button" onclick={onClose}>
  <Icon icon={iconArrowBack} />
</button>

<!-- Line 131-138: Send button -->
<button type="submit" class="send-button" disabled={!inputValue.trim()}>
  <Icon icon={iconSend} />
</button>

<!-- Line 123-130: Text input -->
<input bind:value={inputValue} class="chat-input" />
```

**Required Changes**:
1. Import: `import { Button, TextField } from 'm3-svelte';`
2. Replace back button:
   ```svelte
   <Button variant="text" iconType="full" onclick={onClose} aria-label="Close group chat">
     <Icon icon={iconArrowBack} />
   </Button>
   ```
3. Replace send button:
   ```svelte
   <Button variant="filled" iconType="full" type="submit" disabled={!inputValue.trim()}>
     <Icon icon={iconSend} />
   </Button>
   ```
4. Replace input:
   ```svelte
   <TextField bind:value={inputValue} label="Type a message..." type="filled" onkeydown={handleKeydown} />
   ```
5. Update CSS to remove all button/input styling, keep only layout

**Lines to modify**: 106-108, 123-138, styles section

---

### 2.2 Route: group/[id]/+page.svelte
**File**: `src/routes/group/[id]/+page.svelte`

**Current Implementation**:
```svelte
<!-- Back button (around line 50-55) -->
<button class="back-button" onclick={handleBack}>
  <Icon icon={iconArrowBack} />
</button>

<!-- Group chat toggle button (around line 60-65) -->
<button class="icon-button" onclick={toggleGroupChat}>
  <Icon icon={iconGroup} />
</button>
```

**Required Changes**:
1. Import: `import { Button } from 'm3-svelte';`
2. Replace back button:
   ```svelte
   <Button variant="text" iconType="full" onclick={handleBack} aria-label="Back to groups">
     <Icon icon={iconArrowBack} />
   </Button>
   ```
3. Replace group chat button:
   ```svelte
   <Button variant="text" iconType="full" onclick={toggleGroupChat} aria-label="Open group chat">
     <Icon icon={iconGroup} />
   </Button>
   ```
4. Remove custom button styles from `<style>` section

---

### 2.3 MetaMenu Component
**File**: `src/lib/components/MetaMenu.svelte`

**Current Implementation**:
```svelte
<!-- Theme toggle buttons (around line 150-160) -->
<button class="theme-btn" class:active={$themeStore.mode === 'light'} onclick={...}>
  Light
</button>
<button class="theme-btn" class:active={$themeStore.mode === 'dark'} onclick={...}>
  Dark
</button>
```

**Required Changes**:
1. Import: `import { Button } from 'm3-svelte';`
2. Consider using M3 `SegmentedButton` for theme toggles (better UX)
3. Replace all `<button>` elements with appropriate M3 Button variants
4. For dropdowns, consider M3 `Select` component if available
5. Remove all custom button styling

**Note**: This component has multiple button types - review each for appropriate M3 variant:
- Theme toggles → `SegmentedButton` or `Button variant="tonal"`
- Mode toggles → `SegmentedButton`
- Action buttons → `Button variant="filled"` or `variant="text"`

---

### 2.4 GroupCard Component
**File**: `src/lib/components/GroupCard.svelte`

**Current Implementation**:
```svelte
<button class="group-card" onclick={onClick}>
  <!-- Card content -->
</button>
```

**Required Changes**:
This is a special case - the entire card is clickable. Options:

**Option A: Use M3 Card with onclick**
```svelte
<Card type="filled" onclick={onClick} style="cursor: pointer;">
  <!-- Card content -->
</Card>
```

**Option B: Use M3 List Item (recommended for lists)**
```svelte
<ListItem onclick={onClick} leadingIcon={iconGroup}>
  <div slot="headline">{group.name}</div>
  <div slot="supporting">{group.lastMessage}</div>
  <div slot="trailing">{group.unreadCount}</div>
</ListItem>
```

**Recommendation**: Option B (List Item) is more semantically correct for a groups list.

---

## Phase 3: Cards & Containers Replacement

### 3.1 AnalyticsSummaryCard Component
**File**: `src/lib/components/Cards/AnalyticsSummaryCard.svelte`

**Current Implementation**:
```svelte
<div class="analytics-summary-card" class:success={...}>
  <!-- Card content -->
</div>
```

**Required Changes**:
1. Import: `import { Card } from 'm3-svelte';`
2. Replace outer div:
   ```svelte
   <Card type="filled" class="analytics-summary-card" class:success={...}>
     <!-- Card content -->
   </Card>
   ```
3. Update CSS:
   - Remove `background-color`, `border-radius`, `padding` (M3 Card handles this)
   - Keep only custom layout and content styling
   - Use `:global(.card)` selector if needed to override M3 defaults

---

### 3.2 AnalyticsDetailCard Component
**File**: `src/lib/components/Cards/AnalyticsDetailCard.svelte`

**Current Implementation**:
```svelte
<div class="analytics-detail-card">
  <!-- Card content -->
</div>
```

**Required Changes**:
1. Import: `import { Card } from 'm3-svelte';`
2. Replace outer div:
   ```svelte
   <Card type="filled" class="analytics-detail-card">
     <!-- Card content -->
   </Card>
   ```
3. Update CSS similarly to AnalyticsSummaryCard

---

### 3.3 MessageBubble Component
**File**: `src/lib/components/MessageBubble.svelte`

**Current Implementation**:
```svelte
<div class="message-bubble" class:user-bubble={...} class:ai-bubble={...}>
  <!-- Message content -->
</div>
```

**Required Changes**:
**⚠️ SPECIAL CONSIDERATION**: Chat bubbles have unique styling requirements.

**Option A: Use M3 Card**
```svelte
<Card type="filled" class="message-bubble" class:user-bubble={...}>
  <!-- Message content -->
</Card>
```

**Option B: Keep custom implementation**
- Chat bubbles often need custom shapes (speech bubble tails, asymmetric borders)
- M3 Cards might be too rigid for this use case
- **Recommendation**: Keep custom implementation but ensure it uses M3 tokens:
  - Use `rgb(var(--m3-scheme-*))` for colors
  - Use `var(--m3-util-rounding-*)` for border radius
  - Use `var(--m3-util-elevation-*)` for shadows

---

### 3.4 GroupChatMessage Component
**File**: `src/lib/components/GroupChatMessage.svelte`

**Current Implementation**:
```svelte
<div class="message" class:own-message={...}>
  <!-- Message content -->
</div>
```

**Required Changes**:
Same considerations as MessageBubble (3.3). Likely keep custom but use M3 tokens.

---

### 3.5 TaskCard Component (if exists)
**File**: `src/lib/components/Cards/TaskCard.svelte` (check if exists)

**Required Changes**:
1. Replace with M3 `<Card type="filled">`
2. If has action buttons, replace with M3 `<Button>`
3. Update styling to use M3 tokens only

---

## Phase 4: Additional Components Review

### 4.1 Navigation Components
**Files to check**:
- `src/routes/groups/+page.svelte`
- Any navigation bars or drawers

**Look for**:
- Custom navigation elements → Replace with M3 `NavigationBar`, `NavigationDrawer`, or `TopAppBar`
- Tab implementations → Replace with M3 `Tabs`

---

### 4.2 Selection Components
**Files to check**: All components

**Look for**:
- Custom checkboxes → M3 `Checkbox`
- Custom radio buttons → M3 `Radio`
- Custom switches → M3 `Switch`
- Custom sliders → M3 `Slider`
- Custom chips → M3 `Chip`

---

### 4.3 Feedback Components
**Files to check**: All components

**Look for**:
- Custom progress indicators → M3 `CircularProgress` (already exists) or `LinearProgress`
- Custom snackbars/toasts → M3 `Snackbar`
- Custom badges → M3 `Badge` (or keep custom `StatusBadge` if more flexible)

---

### 4.4 Dialog/Modal Components
**Files to check**: All components

**Look for**:
- Custom modals → M3 `Dialog`
- Custom bottom sheets → M3 `BottomSheet`
- Custom tooltips → M3 `Tooltip`

---

## Phase 5: Global Styles Cleanup

### 5.1 Remove Redundant Custom Styles
**Files to update**:
- `src/styles/global.css`
- `src/styles/containers.css`
- Component-specific style blocks

**Actions**:
1. Remove any button reset styles (M3 handles this)
2. Remove any card/container base styles (M3 handles this)
3. Remove any input reset styles (M3 handles this)
4. Keep only:
   - Layout utilities
   - Custom animations
   - Typography overrides (for custom fonts)
   - Theme-specific customizations

---

### 5.2 Verify M3 Token Usage
**Files to check**: All component styles

**Ensure all custom styles use M3 tokens**:
- ✅ Colors: `rgb(var(--m3-scheme-*))`
- ✅ Rounding: `var(--m3-util-rounding-*)`
- ✅ Elevation: `var(--m3-util-elevation-*)`
- ✅ Typography: M3 utility classes or custom font variables

---

## Implementation Guidelines

### General Principles
1. **Always import from m3-svelte**: `import { Button, Card, TextField } from 'm3-svelte';`
2. **Use correct prop names**:
   - Button: `variant` (not `type`), `iconType`, `onclick`, `disabled`
   - TextField: `label` (required), `type`, `value`, `onkeydown`
   - Card: `type` (filled, outlined, elevated)
3. **Keep transitions**: M3 components support Svelte transitions
4. **Test incrementally**: After each component, run `npm run check`
5. **Preserve accessibility**: Ensure `aria-label`, `role`, etc. are maintained

### Button Variants Guide
- **filled**: Primary actions (CTA, submit)
- **tonal**: Secondary actions
- **outlined**: Medium emphasis actions (quick replies)
- **text**: Low emphasis actions (back, cancel)
- **elevated**: Floating actions (FAB)

### TextField Types Guide
- **filled**: Default, most common (chat inputs)
- **outlined**: Forms, settings

### Card Types Guide
- **filled**: Default, most common (analytics, messages)
- **outlined**: Less emphasis
- **elevated**: Floating cards

---

## Testing Checklist

After each phase:
- [ ] Run `npm run check` - no TypeScript errors
- [ ] Run `npm run dev` - app loads without console errors
- [ ] Test in browser:
  - [ ] All buttons are clickable and have ripple effect
  - [ ] All text inputs are focusable and typeable
  - [ ] All cards render correctly
  - [ ] Transitions still work
  - [ ] Accessibility (keyboard navigation, screen readers)
  - [ ] Light/dark mode switching
  - [ ] Font changes apply correctly
  - [ ] Mobile responsive

---

## Priority Order

1. **HIGH PRIORITY** (User-facing, frequently used):
   - ChatInput ✅ DONE
   - QuickReplyButtons ✅ DONE
   - GroupChat buttons & input
   - Route page buttons
   - GroupCard (groups list)

2. **MEDIUM PRIORITY** (Visible but less frequent):
   - MessageBubble cards
   - AnalyticsCards
   - MetaMenu buttons

3. **LOW PRIORITY** (Polish):
   - Global styles cleanup
   - Additional component review
   - Documentation updates

---

## Known Issues & Considerations

### 1. M3 TextField Label Behavior
- M3 TextField requires a `label` prop (not `placeholder`)
- The label floats when focused/filled
- If you need placeholder-only behavior, may need custom styling

### 2. Icon Buttons
- Use `iconType="full"` for icon-only buttons
- Must wrap `<Icon>` component as child
- Size controlled by M3, may need custom sizing

### 3. Card Padding
- M3 Cards have default padding
- May need to override with custom CSS if content requires different spacing
- Use `:global(.card)` selector to target M3 Card internals

### 4. Transitions
- M3 components support Svelte transitions
- Wrap in `<div>` with transition if needed
- Some M3 components have built-in transitions

### 5. Custom Fonts
- M3 uses Roboto by default
- Override with `font-family: var(--font-sans)` in component styles
- May need `!important` to override M3 typography classes

---

## Resources

- **m3-svelte Documentation**: https://ktibow.github.io/m3-svelte/
- **Material Design 3 Guidelines**: https://m3.material.io/
- **Material Symbols Icons**: https://fonts.google.com/icons
- **Current Codebase**: All components in `src/lib/components/`

---

## Next Steps for New Chat Session

1. **Start with Phase 2**: Replace all remaining buttons
2. **Test after each component**: Ensure no regressions
3. **Move to Phase 3**: Replace cards and containers
4. **Complete Phase 4**: Review and replace additional components
5. **Finish with Phase 5**: Clean up global styles

**Estimated Time**: 2-4 hours of focused work

**Estimated Changes**: 15-20 files modified

---

## Quick Reference: M3 Component Props

### Button
```svelte
<Button
  variant="filled|tonal|outlined|text|elevated"
  iconType="none|left|full"
  disabled={boolean}
  onclick={function}
  type="button|submit"
>
  Content or <Icon>
</Button>
```

### TextField
```svelte
<TextField
  bind:value={string}
  label={string}  // Required
  type="filled|outlined"
  disabled={boolean}
  onkeydown={function}
  leadingIcon={IconifyIcon}
  trailing={{ icon: IconifyIcon, onclick: function }}
/>
```

### Card
```svelte
<Card
  type="filled|outlined|elevated"
  onclick={function}  // Makes card clickable
>
  Content
</Card>
```

### Icon
```svelte
<Icon icon={iconName} />
```

---

**Document Version**: 1.0
**Last Updated**: Current session
**Status**: Ready for implementation in fresh chat

