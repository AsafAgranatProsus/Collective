# Generative Card Framework

## Overview

The generative card framework provides a powerful, flexible system for creating data-rich UI cards from JSON schemas. Cards can be assembled from reusable components either using predefined templates or by composing custom sections.

## Architecture

### Key Components

1. **Card Schema** (`src/lib/types/card-schema.ts`)
   - TypeScript definitions for all card types and sections
   - Template presets: `summary`, `completion`, `trade`, `leaderboard`, `analytics`, `detail`

2. **Card Helpers** (`src/lib/utils/cardHelpers.ts`)
   - Shared utilities: formatting, colors, icons
   - Template-to-sections converter (keeps templates DRY)

3. **Card Renderer** (`src/lib/components/Cards/CardRenderer.svelte`)
   - Main component that renders card schemas
   - Normalizes templates into sections
   - Single rendering loop for all cards

4. **Section Components** (`src/lib/components/Cards/sections/`)
   - 9 reusable section primitives:
     - CardHeader
     - CardStatRow
     - CardProgressIndicator
     - CardListItems
     - CardChart
     - CardComparisonBar
     - CardActions
     - CardDivider
     - CardText

5. **Shared Styles** (`src/styles/card-sections.css`)
   - DRY styling for all sections
   - Consistent spacing, colors, typography
   - Mobile-responsive

## Usage

### Template Mode (Simple)

Use predefined templates with data:

```typescript
{
  ui_elements: {
    card_schema: {
      template: 'summary',
      data: {
        chores: [
          { title: 'Kitchen cleanup', due: 'Wed evening' }
        ],
        money: [
          { title: 'You owe Mike $23.50' }
        ]
      }
    }
  }
}
```

Available templates:
- `summary` - Task/money/shopping overview
- `completion` - Task completion celebration
- `trade` - Before/after trade confirmation
- `leaderboard` - Ranked list with scores
- `analytics` - (placeholder for future)
- `detail` - (placeholder for future)

### Custom Sections Mode (Flexible)

Compose cards from individual sections:

```typescript
{
  ui_elements: {
    card_schema: {
      sections: [
        {
          type: 'header',
          title: 'Weekly Performance',
          subtitle: 'Nov 14-20',
          icon: 'trending'
        },
        {
          type: 'progress',
          value: 85,
          label: 'Completion rate',
          size: 'large'
        },
        {
          type: 'chart',
          chartType: 'line',
          data: [60, 75, 85, 80, 90],
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          color: 'primary'
        },
        {
          type: 'comparison',
          items: [
            { label: 'You', value: '85%', highlight: true },
            { label: 'Avg', value: '78%' }
          ]
        }
      ],
      maxWidth: 480,
      scrollable: true
    }
  }
}
```

## Section Types

### Header
```typescript
{
  type: 'header',
  title: string,
  subtitle?: string,
  icon?: string
}
```

### Stat Row
```typescript
{
  type: 'stat_row',
  label: string,
  value: string | number,
  icon?: string,
  highlight?: boolean,
  metadata?: string
}
```

### Progress Indicator
```typescript
{
  type: 'progress',
  value: number, // 0-100
  label?: string,
  size?: 'small' | 'medium' | 'large',
  variant?: 'circular' | 'linear'
}
```

### List Items
```typescript
{
  type: 'list',
  items: Array<{
    title: string,
    subtitle?: string,
    metadata?: string,
    icon?: string,
    checked?: boolean,
    highlight?: boolean
  }>,
  title?: string,
  style?: 'compact' | 'default' | 'detailed',
  showCheckboxes?: boolean
}
```

### Chart
```typescript
{
  type: 'chart',
  chartType: 'line' | 'bar' | 'area',
  data: number[],
  labels: string[],
  title?: string,
  height?: number,
  color?: 'primary' | 'secondary' | 'tertiary',
  showGrid?: boolean,
  showPoints?: boolean
}
```

### Comparison Bar
```typescript
{
  type: 'comparison',
  items: Array<{
    label: string,
    value: string | number,
    highlight?: boolean
  }>,
  title?: string,
  note?: string
}
```

### Actions
```typescript
{
  type: 'actions',
  buttons: Array<{
    label: string,
    value: string,
    variant?: 'filled' | 'outlined' | 'text',
    primary?: boolean
  }>,
  layout?: 'row' | 'column'
}
```

### Divider
```typescript
{
  type: 'divider',
  spacing?: 'small' | 'medium' | 'large'
}
```

### Text
```typescript
{
  type: 'text',
  content: string,
  size?: 'small' | 'medium' | 'large',
  align?: 'left' | 'center' | 'right',
  color?: 'default' | 'muted' | 'primary'
}
```

## Examples

See `src/lib/types/card-schema-examples.ts` for comprehensive examples.

See scenarios in `src/lib/data/scenarios.ts`:
- `viewMyTasksScenario` - Template mode example
- `weeklyReviewScenario` - Custom sections with mixed content
- `shoppingRequestScenario` - List with checkboxes and actions
- `paymentSummaryScenario` - Stats and comparison bars

## Integration

Cards are automatically rendered in chat messages via `MessageBubble.svelte`:

1. Add `card_schema` to message `ui_elements`
2. CardRenderer detects and renders the schema
3. Template mode: converted to sections via `templateToSections()`
4. Custom mode: sections rendered directly
5. Backwards compatible with existing `card_data` system

## Extending

### Adding New Templates

1. Add template name to `CardTemplate` type in `card-schema.ts`
2. Define data structure interface
3. Implement converter function in `cardHelpers.ts`
4. Add to `templateToSections()` switch statement

### Adding New Sections

1. Define section interface in `card-schema.ts`
2. Add to `CardSection` union type
3. Create component in `sections/` directory
4. Add conditional render in `CardRenderer.svelte`
5. Add shared styles to `card-sections.css`

## Design Principles

1. **DRY** - All formatting, colors, and template logic centralized
2. **Composable** - Mix and match sections freely
3. **Type-safe** - Full TypeScript definitions
4. **Flexible** - Templates for speed, custom sections for power
5. **Consistent** - Shared styles and utilities
6. **Mobile-first** - Responsive by default

## Benefits

- ✅ Rapid prototyping with templates
- ✅ Maximum flexibility with custom sections
- ✅ Maintainable: single source of truth
- ✅ Extensible: easy to add new sections/templates
- ✅ Type-safe: catch errors at compile time
- ✅ Reusable: sections work across all contexts
- ✅ Consistent: shared styling and utilities

