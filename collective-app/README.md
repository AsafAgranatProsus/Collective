# Collective - AI Group Coordination Demo

A beautiful, interactive demo prototype for an AI-mediated group coordination platform. Built with SvelteKit 5 and designed for CEO presentations.

## 🎯 What's Been Built

### ✅ Completed Features

#### 1. **Project Foundation**
- SvelteKit 5 with latest Svelte 5 syntax (runes: `$state`, `$derived`, `$effect`)
- TypeScript configuration
- Vercel adapter for deployment
- Complete folder structure

#### 2. **Advanced Theming System**
- **Multiple Themes**: Midnight Coral (default) and Purple Electric
- **Mode Support**: Light, Dark, and System (auto-detects OS preference)
- **Live Switching**: Change themes instantly without reload
- **CSS Custom Properties**: All colors, spacing, shadows themeable

#### 3. **Dynamic Font System**
- **20 Google Fonts**: 10 sans-serif + 10 serif options
- **Hot-Swapping**: Change fonts instantly without reload
- **Font Families**:
  - Sans: Inter, DM Sans, Plus Jakarta Sans, Poppins, Work Sans, Manrope, Outfit, Space Grotesk, Public Sans, Sora
  - Serif: Playfair Display, Lora, Merriweather, Crimson Pro, Source Serif Pro, Libre Baskerville, Spectral, Cormorant, Newsreader, Fraunces
  - Mono: JetBrains Mono (fixed)

#### 4. **CSS Architecture**
- **Global Styles**: Comprehensive design system
- **Domain Stylesheets**:
  - `typography.css` - Font scales, weights, text utilities
  - `colors.css` - Semantic color mappings
  - `spacing.css` - 8px scale spacing utilities
  - `animations.css` - Keyframes and animation utilities
  - `containers.css` - Card, panel, button components
  - `utilities.css` - Ad-hoc styling helpers
- **Theme Files**: Base + two complete themes with light/dark variants

#### 5. **Core Components** (Svelte 5 with runes)
- **MessageBubble**: User and AI message displays with animations
- **QuickReplyButtons**: Pill-shaped action buttons with morph effects
- **TypingIndicator**: Animated 3-dot bounce indicator
- **ChatInput**: Full-featured input with submit handling
- **TaskCard**: Chore display with status badges and actions
- **ExpenseCard**: Expense tracking with split calculations
- **ShoppingCard**: Shopping items with urgency indicators

#### 6. **MetaMenu** (Prototype Settings)
- **Access**: Alt + / keyboard shortcut OR triple-tap screen
- **Features**:
  - Font selection dropdowns (sans + serif)
  - Theme switcher (Midnight Coral / Purple Electric)
  - Mode toggle (Light / Dark / System)
  - User switcher (4 roommates with keyboard shortcuts Alt+1-4)
  - Scenario jumper (4 scripted scenarios)
  - Demo controls (reset, toggle animations)
- **UI**: Glassmorphism, draggable, collapsible sections

#### 7. **Main Interface**
- Animated gradient background with parallax
- Fixed header with logo and current user indicator
- Scrollable messages area with auto-scroll
- Fixed chat input at bottom
- Integrated MetaMenu overlay

#### 8. **Mock Data**
- **4 Roommates**: Sarah (designer), Mike (engineer), Jessica (marketing), Bob (graphic designer)
- **Items**: Chores, expenses, and shopping items with full metadata
- **4 Core Scenarios**: View Tasks, Fairness Breakdown, Trade Chore, Complete Task
- **Fairness Stats**: Pre-calculated statistics for demo

#### 9. **State Management**
- **App Store**: User switching, conversations, demo menu state
- **Theme Store**: Theme and mode persistence with localStorage
- **Fonts Store**: Font selection with dynamic loading
- All using Svelte 5 `$state()` runes

## 🚀 Getting Started

### Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit: http://localhost:5173

### Build for Production

\`\`\`bash
npm run build
npm run preview
\`\`\`

### Deploy to Vercel

\`\`\`bash
npm run build
# Then push to GitHub and connect to Vercel
# Or use: vercel --prod
\`\`\`

## 🎨 Using the Demo

### Accessing Prototype Settings

- **Keyboard**: Press `Alt + /`
- **Touch**: Triple-tap anywhere on the screen

### User Switching

- Open MetaMenu
- Click user avatar OR use `Alt + 1/2/3/4` shortcuts

### Changing Themes

1. Open MetaMenu (Alt + /)
2. Expand "Theme" section
3. Select color scheme and mode

### Changing Fonts

1. Open MetaMenu (Alt + /)
2. Expand "Fonts" section
3. Select from 10 sans-serif and 10 serif options

## 📱 Features

### Theming
- 2 color schemes (Midnight Coral, Purple Electric)
- 3 modes per theme (Light, Dark, System)
- Instant switching without reload

### Typography
- 20 Google Fonts to choose from
- Separate fonts for AI vs. user messages
- Monospace font for data/timestamps

### Animations
- Message entrance (slide + fade)
- Button interactions (scale, bounce)
- Typing indicator
- Smooth transitions

### Responsive
- Mobile-first design (375px base)
- Touch-friendly (44x44px minimum targets)
- Adaptive layouts

## 🗂️ Project Structure

\`\`\`
src/
├── styles/
│   ├── global.css                    # Main stylesheet, imports all
│   ├── themes/
│   │   ├── theme-base.css           # CSS variables structure
│   │   ├── midnight-coral.css       # Default theme (light/dark)
│   │   └── purple-electric.css      # Alt theme (light/dark)
│   ├── typography.css               # Font system
│   ├── colors.css                   # Color utilities
│   ├── spacing.css                  # Spacing scale
│   ├── animations.css               # Keyframes
│   ├── containers.css               # Card/panel styles
│   └── utilities.css                # Helper classes
├── lib/
│   ├── components/
│   │   ├── MessageBubble.svelte
│   │   ├── QuickReplyButtons.svelte
│   │   ├── TypingIndicator.svelte
│   │   ├── ChatInput.svelte
│   │   ├── TaskCard.svelte
│   │   ├── ExpenseCard.svelte
│   │   ├── ShoppingCard.svelte
│   │   └── MetaMenu.svelte
│   ├── stores/
│   │   ├── app.svelte.ts            # Main app state
│   │   ├── theme.svelte.ts          # Theme management
│   │   └── fonts.svelte.ts          # Font selection
│   ├── data/
│   │   ├── household.ts             # Mock roommates data
│   │   ├── items.ts                 # Chores/expenses/shopping
│   │   └── scenarios.ts             # Scripted conversations
│   └── utils/
│       └── fontLoader.ts            # Dynamic font loading
└── routes/
    ├── +layout.svelte               # Root layout
    └── +page.svelte                 # Main chat interface
\`\`\`

## 🛠️ Tech Stack

- **Framework**: SvelteKit 5
- **Language**: TypeScript
- **Styling**: Custom CSS (no Tailwind)
- **Fonts**: Google Fonts (dynamic loading)
- **State**: Svelte 5 runes ($state, $derived, $effect)
- **Deployment**: Vercel

## ⚡ Performance

- Fast page loads with minimal JavaScript
- CSS-only animations where possible
- Optimized font loading
- Smooth 60fps animations

## 📋 Remaining Tasks

### To Complete:
1. **Scenario Implementation**: Wire up full scenario logic with user switching
2. **Animation Polish**: Add confetti, user switch transitions, micro-interactions
3. **Mobile Testing**: Test on real devices, optimize touch interactions
4. **Production Build**: Final optimizations and Vercel deployment

## 🎯 Design Philosophy

- **Late 2025 Aesthetic**: Modern, expressive, designer-crafted
- **No Tailwind**: Custom CSS architecture for flexibility
- **Component Styles**: Per-component scoped styles + global design system
- **Theme-First**: Everything respects theme variables
- **Animation-Rich**: Smooth, purposeful, delightful interactions

## 📝 Notes

- This is a **demo prototype** for presentations, not production code
- All scenarios are **pre-scripted** (no real AI backend)
- Focus is on **visual design and UX**, not functionality
- Built for **CEO pitch** to demonstrate potential

## 🚀 Next Steps

1. Complete scenario logic implementation
2. Add celebration animations (confetti, etc.)
3. Test on mobile devices
4. Deploy to Vercel
5. Prepare CEO walkthrough guide

---

**Built with Svelte 5 and ❤️ for the Collective demo**
