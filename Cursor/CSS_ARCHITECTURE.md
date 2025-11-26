# CSS Architecture - Collective App

## Overview
This document describes the CSS architecture after migrating to Material Design 3 (M3).

## File Structure

```
src/styles/
├── themes/
│   ├── m3-theme.css                    # M3 Cyan & Yellow theme
│   ├── m3-theme-neutral-purple.css     # M3 Neutral/Purple theme
│   ├── m3-theme-blue.css               # M3 Blue theme
│   ├── m3-theme-green.css              # M3 Green theme
│   └── m3-theme-red.css                # M3 Red theme
├── custom-tokens.css                    # Custom design tokens
├── typography.css                       # Custom typography utilities
├── colors.css                           # M3 color utilities
├── spacing.css                          # Spacing utilities
├── animations.css                       # Custom animations & keyframes
├── containers.css                       # Container utilities
├── utilities.css                        # General utilities
└── global.css                           # Main entry point (imports all)
```

## Design Token Sources

### Material Design 3 Tokens (from M3 themes)
- **Colors**: `--m3-scheme-*` (primary, surface, on-surface, etc.)
- **Elevation**: `--m3-util-elevation-{0-5}`
- **Rounding**: `--m3-util-rounding-{none|extra-small|small|medium|large|extra-large|full}`
- **Typography**: `m3-font-{display|headline|title|body|label}-{large|medium|small}` (utility classes)

### Custom Tokens (from custom-tokens.css)
- **Font Families**: `--font-sans`, `--font-serif`, `--font-mono`, `--font-logo`
- **Spacing**: `--space-{1-8}` (4px to 64px scale)
- **Card Padding**: `--card-padding-{sm|md|lg}`
- **Tint Opacity**: `--tint-{subtle|light|medium}`
- **Transitions**: `--transition-{fast|base|slow|bounce}`
- **Z-Index**: `--z-{base|dropdown|sticky|fixed|modal-backdrop|modal|popover|tooltip}`

## Usage Guidelines

### Colors
**Prefer M3 tokens:**
```css
background-color: rgb(var(--m3-scheme-surface));
color: rgb(var(--m3-scheme-on-surface));
border-color: rgb(var(--m3-scheme-outline));
```

**Or use utility classes:**
```html
<div class="bg-surface text-on-surface">...</div>
```

### Typography
**Use M3 utility classes:**
```html
<h1 class="m3-font-headline-large">Headline</h1>
<p class="m3-font-body-medium">Body text</p>
```

**For custom fonts:**
```html
<div class="font-sans">Custom font family</div>
```

### Spacing
**Use custom spacing scale:**
```css
padding: var(--space-4);
margin-bottom: var(--space-5);
gap: var(--space-3);
```

**Or use utility classes:**
```html
<div class="p-4 mb-5 gap-3">...</div>
```

### Border Radius
**Use M3 rounding tokens:**
```css
border-radius: var(--m3-util-rounding-large);
border-radius: var(--m3-util-rounding-extra-large);
```

### Elevation (Shadows)
**Use M3 elevation tokens:**
```css
box-shadow: var(--m3-util-elevation-2);
box-shadow: var(--m3-util-elevation-3);
```

### Transitions
**Use custom transition tokens:**
```css
transition: all var(--transition-base);
transition: transform var(--transition-fast);
```

### Z-Index
**Use custom z-index tokens:**
```css
z-index: var(--z-modal);
z-index: var(--z-tooltip);
```

## Removed/Deprecated

### ❌ Removed Files
- `theme-base.css` → Merged into `custom-tokens.css`

### ❌ Removed Tokens
The following tokens were removed as M3 provides equivalents:

- **Font sizes** (`--text-xs`, `--text-sm`, etc.)
  - Use M3 typography classes instead
  
- **Font weights** (`--weight-regular`, `--weight-bold`, etc.)
  - Use M3 typography classes instead
  
- **Border radius** (`--radius-sm`, `--radius-lg`, etc.)
  - Use `--m3-util-rounding-*` instead
  
- **Shadows** (`--shadow-sm`, `--shadow-lg`, etc.)
  - Use `--m3-util-elevation-*` instead

### ❌ Removed Utility Classes
- `.text-xs`, `.text-sm`, `.text-lg`, etc. → Use M3 typography classes
- `.font-regular`, `.font-bold`, etc. → Use M3 typography classes
- `.bg-accent`, `.bg-elevated` → Use M3 surface tokens
- `.bg-success`, `.bg-warning`, `.bg-info` → M3 only has error (define custom if needed)

## Migration Notes

### Typography Migration
**Before:**
```html
<h1 class="text-2xl font-bold">Title</h1>
```

**After:**
```html
<h1 class="m3-font-headline-large">Title</h1>
```

### Color Migration
**Before:**
```css
background-color: var(--bg-primary);
color: var(--text-primary);
```

**After:**
```css
background-color: rgb(var(--m3-scheme-primary));
color: rgb(var(--m3-scheme-on-primary));
```

### Border Radius Migration
**Before:**
```css
border-radius: var(--radius-lg);
```

**After:**
```css
border-radius: var(--m3-util-rounding-large);
```

## Best Practices

1. **Use M3 tokens first** - Leverage M3's design system whenever possible
2. **Custom tokens for gaps** - Use custom tokens only for what M3 doesn't provide
3. **Utility classes for common patterns** - Create utilities for frequently used combinations
4. **Component-specific styles** - Keep component-specific styles in component files
5. **Consistent naming** - Follow M3 naming conventions for custom tokens

## Theme Switching

Themes are controlled via `data-theme` and `data-mode` attributes on the `<html>` element:

```html
<!-- Light mode with Cyan & Yellow theme -->
<html data-theme="m3-cyan-yellow" data-mode="light">

<!-- Dark mode with Neutral Purple theme -->
<html data-theme="m3-neutral-purple" data-mode="dark">
```

Managed by `src/lib/stores/theme.svelte.ts`.

## Resources

- **M3 Design System**: https://m3.material.io/
- **m3-svelte Library**: https://ktibow.github.io/m3-svelte/
- **Material Symbols Icons**: https://fonts.google.com/icons

---

**Last Updated**: Current session
**Migration Status**: Complete
**M3 Version**: Latest (via m3-svelte)

