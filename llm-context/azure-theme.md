# Azure Theme Reference for LLMs

## Brand Ramp

| Step | Hex     | Usage               |
| ---- | ------- | ------------------- |
| 10   | #061724 | Darkest brand shade |
| 20   | #082338 |                     |
| 30   | #0a2e4a |                     |
| 40   | #0c3b5e |                     |
| 50   | #0e4775 |                     |
| 60   | #0f548c | Brand darker        |
| 70   | #115ea3 | Brand dark (hover)  |
| 80   | #0f6cbd | **Primary brand**   |
| 90   | #2886de | Brand light         |
| 100  | #479ef5 |                     |
| 110  | #62abf5 |                     |
| 120  | #77b7f7 |                     |
| 130  | #96c6fa |                     |
| 140  | #b4d6fa | Brand lighter       |
| 150  | #cfe4fa |                     |
| 160  | #ebf3fc | Lightest brand tint |

## Key Semantic Tokens

- Background: `colorNeutralBackground1` (#ffffff)
- Foreground: `colorNeutralForeground1` (#242424)
- Subtle bg: `colorNeutralBackground2` (#fafafa)
- Border: `colorNeutralStroke2` (#e0e0e0)
- Brand foreground: `colorBrandForeground1` (#0f6cbd)
- Success: `colorPaletteGreenForeground1`
- Danger: `colorPaletteRedForeground1` (#d13438)
- Warning: `colorPaletteYellowForeground1`

## Typography

- Font family: `'Segoe UI', 'Segoe UI Web (West European)', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif`
- Base size: 14px
- Scale: 10 / 12 / 14 / 16 / 20 / 24 / 28 / 32 / 40 / 68

## Spacing Scale

2px / 4px / 6px / 8px / 10px / 12px / 16px / 20px / 24px / 32px / 40px

## Border Radius

none (0) / small (2px) / medium (4px) / large (8px) / xLarge (12px) / circular (10000px)

## Shadow Elevation

shadow2, shadow4, shadow8, shadow16, shadow28, shadow64, shadow2brand

---

## Two-Axis Theme System (v2.0.0)

The theme system supports independent selection of **Product Theme** and **Appearance Mode**.

### Usage

```typescript
import { resolveTheme } from '@azure-fluent-storybook/components';
import type { AppearanceMode } from '@azure-fluent-storybook/components';

// Resolve a theme for any product × appearance combination
const theme = resolveTheme('azure', 'light'); // → Fluent Theme object
const theme = resolveTheme('sre-agent', 'dark'); // → SRE Agent dark theme
const theme = resolveTheme('azure', 'high-contrast'); // → High contrast theme
```

### Available Products

| ID           | Display Name | Description                                                 |
| ------------ | ------------ | ----------------------------------------------------------- |
| `azure`      | Azure        | Default Azure Portal theme — Coherence design system tokens |
| `sre-agent` | SRE Agent   | SRE Agent site reliability engineering product theme |

### Available Appearances

| ID              | Description                      |
| --------------- | -------------------------------- |
| `light`         | Light mode                       |
| `dark`          | Dark mode                        |
| `high-contrast` | WCAG AAA compliant high contrast |

### Adding a New Product Theme

1. Create `src/themes/products/my-product.ts` following the pattern in `products/azure.ts`
2. Register it: `registerProductTheme({ id: 'my-product', displayName: 'My Product', brand: myBrand, ... })`
3. Add import to `src/themes/products/index.ts`
4. Add to `PRODUCT_THEMES` in `.storybook/addons/theme-switcher/constants.ts`

### LLM Context Bundle

The `themeRegistry` field in `llm-context-bundle.json` lists all registered products and appearances for MCP/AI consumption.
