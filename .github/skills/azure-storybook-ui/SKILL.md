---
name: azure-storybook-ui
description: >
  Create production-quality Storybook stories and UI components styled to match the Azure Portal design system.
  Use this skill whenever the user wants to build, add, update, or create a new component, story, page template,
  or UI element in the Azure Storybook project. Also use when the user asks about Azure Portal styling, Fluent v9
  component patterns, Azure design tokens, Coherence theme usage, or wants help making UI look like the Azure Portal.
  Triggers include: "create a story", "add a component", "build a page", "make this look like Azure Portal",
  "Azure styling", "new template", "dashboard UI", "resource page", "Fluent v9 component", any mentions of
  specific Azure Portal UI patterns (breadcrumb, command bar, filter bar, data grid, resource card, KPI card),
  and requests to "match Azure Portal" or "use Azure theme".
---

# Azure Storybook UI Skill

Build Storybook stories and components that faithfully reproduce the Azure Portal's visual language using Fluent UI React v9, Griffel CSS-in-JS, and the Coherence/Azure design token system.

## Before You Start

1. **Read the component registry** at `src/component-registry.json` — know what already exists before creating something new.
2. **Check existing stories** in `src/stories/` — don't duplicate work.
3. **Check existing composed components** in `src/components/` — reuse `AzureBreadcrumb`, `PageTitleBar`, `CommandBar`, `FilterBar` whenever building page-level templates.
4. **Review the existing llm-context docs** if you need a quick refresher on tokens, patterns, or styling conventions:
   - `llm-context/azure-theme.md` — token quick-reference
   - `llm-context/component-patterns.md` — composed component API
   - `llm-context/styling-guide.md` — Griffel + token conventions

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + TypeScript 5.7 |
| Component Library | `@fluentui/react-components` v9 (Fluent UI React v9) |
| Icons | `@fluentui/react-icons` |
| Styling | Griffel (`makeStyles` / `mergeClasses` from Fluent v9) |
| Storybook | 8.5 — CSF3 format with `autodocs` tag |
| Bundler | Vite 6 |
| Theme | Custom Azure themes in `src/themes/azureThemes.ts` |

## Step-by-Step Workflow

### 1. Classify the Request

| Request Type | Where It Goes | Example |
|---|---|---|
| **Foundation story** | `src/stories/foundations/` | Color swatches, typography scale, spacing demos |
| **Component story** | `src/stories/components/` | Button variants, Card layouts, DataGrid configs |
| **Composed component** | `src/components/` + `src/stories/composed/` | New reusable Azure-specific component |
| **Page template** | `src/stories/templates/` | Full-page Azure Portal layouts like ResourceListPage |
| **Guideline page** | `src/stories/guidelines/` | Usage best practices, conventions, MDX docs |

### 2. Write the Story (CSF3 Format)

Every story MUST follow this structure:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { makeStyles, tokens } from '@fluentui/react-components';
// Import component(s)...

const meta: Meta<typeof Component> = {
  title: 'Category/ComponentName',    // Category = Foundations | Components | Composed | Templates
  component: Component,               // or omit for render-only stories
  tags: ['autodocs'],                  // Always include for auto-docs
  parameters: {
    layout: 'fullscreen',             // Use for page templates; omit for isolated components
  },
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: { /* default props */ },
};

// Additional variants as named exports
export const WithCustomProps: Story = {
  args: { /* variant props */ },
};
```

### 3. Apply Azure Styling

Follow these rules strictly — they ensure visual accuracy to the Azure Portal:

#### Color: Always Use Tokens

```tsx
import { tokens } from '@fluentui/react-components';

// CORRECT
backgroundColor: tokens.colorNeutralBackground1,   // #ffffff (light)
color: tokens.colorNeutralForeground1,              // #242424 (text)
borderColor: tokens.colorNeutralStroke2,             // #e0e0e0

// WRONG — never hardcode colors
backgroundColor: '#ffffff',
color: '#242424',
```

The only exception: Azure brand hex values not available as Fluent tokens (rare — use `references/azure-design-tokens.md` to verify first).

#### Typography

| Purpose | Token | Resolves To |
|---------|-------|-------------|
| Body text | `tokens.fontSizeBase300` | 14px |
| Small / caption | `tokens.fontSizeBase200` | 12px |
| Subtitle | `tokens.fontSizeBase400` | 16px |
| Page title | `tokens.fontSizeBase500` | 20px |
| Hero / large heading | `tokens.fontSizeBase600` | 24px |
| Font family | `tokens.fontFamilyBase` | Segoe UI stack |
| Regular weight | `tokens.fontWeightRegular` | 400 |
| Semibold | `tokens.fontWeightSemibold` | 600 |

#### Spacing

Use 4px-based increments. Prefer these standard values:

| Use Case | Value |
|----------|-------|
| Tight internal padding | 4px |
| Default padding, gaps | 8px |
| Comfortable padding | 12px |
| Standard section padding | 16px |
| Generous section padding | 24px |
| Large section spacing | 32px |

The Coherence CSS maps these to tokens: `--spacing-xxs` (2px), `--spacing-xs` (4px), `--spacing-sm` (8px), `--spacing-md` (12px), `--spacing-lg` (16px), `--spacing-xl` (20px), `--spacing-xxl` (24px), `--spacing-xxxl` (32px).

#### Borders & Radius

```tsx
// Standard borders
border: `1px solid ${tokens.colorNeutralStroke2}`,

// Border radius
borderRadius: tokens.borderRadiusSmall,   // 2px — badges, tags
borderRadius: tokens.borderRadiusMedium,  // 4px — cards, inputs, buttons
borderRadius: tokens.borderRadiusLarge,   // 8px — panels, dialogs
```

Coherence equivalents: `--border-radius-sm` (2px), `--border-radius-md` (4px), `--border-radius-lg` (6px), `--border-radius-xl` (8px).

#### Shadows (Elevation)

| Level | Token | Usage |
|-------|-------|-------|
| Rest | `tokens.shadow2` | Subtle card resting state |
| Raised | `tokens.shadow4` | Elevated cards, panels |
| High | `tokens.shadow8` | Dropdowns, popovers |
| Overlay | `tokens.shadow16` | Dialogs |
| Modal | `tokens.shadow28` | Full-screen overlays |
| Extreme | `tokens.shadow64` | Teaching callouts |

Coherence equivalents: `--shadow-2`, `--shadow-4`, `--shadow-8`, `--shadow-16`, `--shadow-28`, `--shadow-64`.

#### Icons

```tsx
import { Add24Regular, Delete24Regular, Edit24Regular } from '@fluentui/react-icons';

// Default: 24px Regular variants
// Small/compact UI: 20px Regular variants
// Active/selected state: 24px Filled variants
```

### 4. Use the Composed Components

For page-level templates, always compose from the existing building blocks:

```tsx
import { AzureBreadcrumb } from '@/components/AzureBreadcrumb';
import { PageTitleBar } from '@/components/PageTitleBar';
import { CommandBar } from '@/components/CommandBar';
import { FilterBar } from '@/components/FilterBar';
```

**Page template structure** (top to bottom):
```
┌─ AzureBreadcrumb ─────────────────────────────────────────┐
├─ PageTitleBar (icon + title + star + more + AI suggestions)├
├─ CommandBar (primary actions ‖ secondary actions) ─────────├
├─ FilterBar (search + filters + active tags) ───────────────├
├─ Content area (DataGrid / Cards / Dashboard etc.) ─────────├
└────────────────────────────────────────────────────────────┘
```

### 5. Common Azure Portal Patterns

#### Resource Status Badges
```tsx
import { Badge } from '@fluentui/react-components';

<Badge appearance="filled" color="success">Running</Badge>
<Badge appearance="filled" color="danger">Stopped</Badge>
<Badge appearance="filled" color="warning">Deallocated</Badge>
<Badge appearance="filled" color="informative">Creating</Badge>
```

#### Resource Name Links
Resource names in grids should use brand-colored text to indicate interactivity:
```tsx
color: tokens.colorBrandForeground1,  // #0f6cbd
cursor: 'pointer',
':hover': { textDecorationLine: 'underline' },
```

#### KPI / Hero Cards
```tsx
// Large number + label + trend
<Card>
  <Text size={600} weight="semibold">1,247</Text>
  <Text size={200}>Active Resources</Text>
  <Badge color="success" appearance="outline">↑ 12%</Badge>
</Card>
```

#### Card Grids
```tsx
const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
    padding: '16px',
  },
});
```

#### Full Page Layout
```tsx
const useStyles = makeStyles({
  page: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: tokens.colorNeutralBackground2,  // #fafafa
  },
  content: {
    flex: '1',
    overflowY: 'auto',
    margin: '0 16px 16px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
});
```

### 6. Add Usage Guidelines

When creating a **new composed component** or introducing a **new pattern**, add or update the corresponding guideline MDX page in `src/stories/guidelines/`:

- **Token usage** → update `TokenUsage.mdx`
- **Styling conventions** → update `StylingBestPractices.mdx`
- **Page layout patterns** → update `PagePatterns.mdx`
- **New component with non-obvious usage** → add a section to the relevant guideline or create a new `.mdx` file

Guideline pages use this structure:

```mdx
import { Meta } from '@storybook/blocks';

<Meta title="Guidelines/Page Name" />

# Page Name

Content here...
```

These pages appear under **Guidelines** in the Storybook sidebar and serve as the single source of truth for best practices.

### 7. After Creating

1. **Format** — ensure the file follows project conventions (no hardcoded colors, proper token usage, Griffel styling).
2. **Regenerate registry** — run `npm run build:registry` after adding new stories or components.
3. **Verify in Storybook** — run `npm run dev` and check the new story renders correctly.

## Naming Convention — LLM-Friendly, Descriptive Names

Every name you create (story exports, components, props, CSS classes, files) must describe **what it does**, not where it's used. This lets an LLM (or any reader) instantly understand the purpose and decide whether to reuse it.

| Layer | Good (functional) | Bad (context-specific) |
|---|---|---|
| Story export | `WithDivider`, `WithOverflow`, `WithFarItems` | `ResourceList`, `CostManagement` |
| Component | `FilterBar`, `CommandBar` | `ResourceFilterBar`, `CostCommandBar` |
| Props / args | `farItems`, `overflowItems`, `disabled` | `resourceGroupItems`, `costMenuItems` |
| CSS class | `leftSection`, `bladeContent`, `gridCell` | `vmList`, `subscriptionPanel` |
| File name | `CommandBar.stories.tsx` | `CostManagementCommandBar.stories.tsx` |

**Why:** Stories and components exist as a pattern library. When names are abstract and functional, an LLM scanning `component-registry.json` or story titles can match a pattern to *any* page without needing domain knowledge. Context-specific names mislead the LLM into thinking a component only applies to one scenario.

## Anti-Patterns to Avoid

| Don't | Do Instead |
|-------|-----------|
| Hardcode hex colors like `#ffffff` | Use `tokens.colorNeutralBackground1` |
| Use plain CSS or CSS Modules | Use Griffel `makeStyles` |
| Import from `@fluentui/react` (v8) | Import from `@fluentui/react-components` (v9) |
| Create custom button/input/card primitives | Use Fluent v9 `Button`, `Input`, `Card` |
| Use `px` font sizes without tokens | Use `tokens.fontSizeBase300` etc. |
| Skip `tags: ['autodocs']` | Always include for auto-generated docs |
| Mix FluentProvider themes | Use `azureLightTheme` from `src/themes/` |
| Put composed component stories in `components/` | Stories go in `src/stories/composed/` |
| Create page templates without Breadcrumb | Always include `AzureBreadcrumb` at top |

## Reference Files

For deep dives into specific topics, read these bundled references:

| When You Need | Read |
|---|---|
| Complete token values (colors, spacing, shadows, typography) | `references/azure-design-tokens.md` |
| Full Fluent v9 component catalog and usage guidance | `references/component-catalog.md` |
| Azure Portal page layout patterns and conventions | `references/page-patterns.md` |
| Storybook usage best practices (visible to end users) | `src/stories/guidelines/*.mdx` |
