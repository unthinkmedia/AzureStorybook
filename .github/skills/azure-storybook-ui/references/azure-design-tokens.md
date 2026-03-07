# Azure Design Tokens — Complete Reference

Extracted from the Coherence CDN theme CSS and mapped to Fluent UI React v9 tokens.

Source: `https://coherence-ftekb0dcfpcjb3gv.b02.azurefd.net/cdn/latest/themes/cui/theme.css`

## Color Ramps

### Brand (Azure Blue)

| Step | Hex | Coherence CSS | Fluent Token | Usage |
|------|-----|---------------|--------------|-------|
| 10 | #061724 | `--color-brand-10` | `colorBrandBackground10` | Darkest brand |
| 20 | #082338 | `--color-brand-20` | | |
| 30 | #0a2e4a | `--color-brand-30` | | |
| 40 | #0c3b5e | `--color-brand-40` | | Brand pressed states |
| 50 | #0e4775 | `--color-brand-50` | | |
| 60 | #0f548c | `--color-brand-60` | | Brand darker |
| 70 | #115ea3 | `--color-brand-70` | | Brand dark / hover |
| 80 | #0f6cbd | `--color-brand-80` | `colorBrandBackground` | **Primary brand** |
| 90 | #2886de | `--color-brand-90` | | Brand light |
| 100 | #479ef5 | `--color-brand-100` | | |
| 110 | #62abf5 | `--color-brand-110` | | |
| 120 | #77b7f7 | `--color-brand-120` | | |
| 130 | #96c6fa | `--color-brand-130` | | |
| 140 | #b4d6fa | `--color-brand-140` | | Brand lighter |
| 150 | #cfe4fa | `--color-brand-150` | | |
| 160 | #ebf3fc | `--color-brand-160` | `colorBrandBackground2` | Lightest brand tint |

### Neutral (Grayscale)

Key stops used in the Azure Portal theme:

| Coherence CSS | Hex | Semantic Alias | Fluent Token | Usage |
|---|---|---|---|---|
| `--color-neutral-0` | #000000 | | | Black |
| `--color-neutral-14` | #242424 | `--neutral-foreground1` | `colorNeutralForeground1` | Primary text |
| `--color-neutral-26` | #424242 | `--neutral-foreground2` | `colorNeutralForeground2` | Secondary text |
| `--color-neutral-38` | #616161 | `--neutral-foreground3` | `colorNeutralForeground3` | Tertiary text |
| `--color-neutral-44` | #707070 | `--neutral-foreground4` | `colorNeutralForeground4` | Placeholder text |
| `--color-neutral-74` | #bdbdbd | `--neutral-foreground-disabled` | `colorNeutralForegroundDisabled` | Disabled text |
| `--color-neutral-82` | #d1d1d1 | `--neutral-stroke1` | `colorNeutralStroke1` | Primary border |
| `--color-neutral-88` | #e0e0e0 | `--neutral-stroke2` | `colorNeutralStroke2` | Subtle border |
| `--color-neutral-94` | #f0f0f0 | `--neutral-stroke3` | `colorNeutralStroke3` | Faintest border |
| `--color-neutral-92` | #ebebeb | `--neutral-background5` | `colorNeutralBackground5` | |
| `--color-neutral-94` | #f0f0f0 | `--neutral-background4` | `colorNeutralBackground4` | |
| `--color-neutral-96` | #f5f5f5 | `--neutral-background3` | `colorNeutralBackground3` | |
| `--color-neutral-98` | #fafafa | `--neutral-background2` | `colorNeutralBackground2` | Page background |
| `--color-neutral-100` | #ffffff | `--neutral-background1` | `colorNeutralBackground1` | Content background |

### Status Colors

#### Danger (Red)
| Coherence CSS | Hex | Usage |
|---|---|---|
| `--color-danger-primary` | #c50f1f | Core danger |
| `--color-danger-tint-10` | #cc2635 | Danger foreground1 |
| `--color-danger-tint-40` | #eeacb2 | Danger border |
| `--color-danger-tint-60` | #fdf3f4 | Danger background |

#### Success (Green)
| Coherence CSS | Hex | Usage |
|---|---|---|
| `--color-success-primary` | #107c10 | Core success |
| `--color-success-tint-40` | #9fd89f | Success border |
| `--color-success-tint-60` | #f1faf1 | Success background |

#### Warning (Orange)
| Coherence CSS | Hex | Usage |
|---|---|---|
| `--color-warning-primary` | #f7630c | Core warning |
| `--color-warning-tint-40` | #fdcfb4 | Warning border |
| `--color-warning-tint-60` | #fff9f5 | Warning background |

#### Caution (Yellow)
| Coherence CSS | Hex | Usage |
|---|---|---|
| `--color-caution-primary` | #eaa300 | Core caution |
| `--color-caution-tint-40` | #f9e2ae | Caution border |
| `--color-caution-tint-60` | #fefbf4 | Caution background |

### Semantic Foreground Aliases

| Coherence CSS | Resolves To | Fluent Token | Usage |
|---|---|---|---|
| `--neutral-foreground1` | `--color-neutral-14` (#242424) | `tokens.colorNeutralForeground1` | Primary text |
| `--neutral-foreground2` | `--color-neutral-26` (#424242) | `tokens.colorNeutralForeground2` | Secondary text |
| `--neutral-foreground3` | `--color-neutral-38` (#616161) | `tokens.colorNeutralForeground3` | Tertiary / captions |
| `--neutral-foreground4` | `--color-neutral-44` (#707070) | `tokens.colorNeutralForeground4` | Placeholder |
| `--neutral-foreground-disabled` | `--color-neutral-74` (#bdbdbd) | `tokens.colorNeutralForegroundDisabled` | Disabled |
| `--brand-foreground-link` | `--color-brand-70` (#115ea3) | `tokens.colorBrandForegroundLink` | Links |
| `--brand-foreground1` | `--color-brand-80` (#0f6cbd) | `tokens.colorBrandForeground1` | Brand foreground |
| `--neutral-foreground-on-brand` | `--color-neutral-100` (#ffffff) | `tokens.colorNeutralForegroundOnBrand` | Text on brand bg |

### Semantic Background Aliases

| Coherence CSS | Resolves To | Fluent Token | Usage |
|---|---|---|---|
| `--neutral-background1` | `--color-neutral-100` (#ffffff) | `tokens.colorNeutralBackground1` | Content surface |
| `--neutral-background2` | `--color-neutral-98` (#fafafa) | `tokens.colorNeutralBackground2` | Page background |
| `--neutral-background3` | `--color-neutral-96` (#f5f5f5) | `tokens.colorNeutralBackground3` | Subtle surface |
| `--neutral-background4` | `--color-neutral-94` (#f0f0f0) | `tokens.colorNeutralBackground4` | Disabled bg |
| `--neutral-background-disabled` | `--color-neutral-94` (#f0f0f0) | `tokens.colorNeutralBackgroundDisabled` | Disabled |
| `--brand-background` | `--color-brand-80` (#0f6cbd) | `tokens.colorBrandBackground` | Primary buttons |
| `--brand-background2` | `--color-brand-160` (#ebf3fc) | `tokens.colorBrandBackground2` | Info banners |
| `--subtle-background-hover` | `--color-neutral-96` (#f5f5f5) | `tokens.colorSubtleBackgroundHover` | Subtle hover |
| `--subtle-background-pressed` | `--color-neutral-88` (#e0e0e0) | `tokens.colorSubtleBackgroundPressed` | Subtle pressed |

### Semantic Stroke Aliases

| Coherence CSS | Resolves To | Fluent Token | Usage |
|---|---|---|---|
| `--neutral-stroke1` | `--color-neutral-82` (#d1d1d1) | `tokens.colorNeutralStroke1` | Primary border |
| `--neutral-stroke2` | `--color-neutral-88` (#e0e0e0) | `tokens.colorNeutralStroke2` | Subtle border |
| `--neutral-stroke3` | `--color-neutral-94` (#f0f0f0) | `tokens.colorNeutralStroke3` | Faintest border |
| `--neutral-stroke-accessible` | `--color-neutral-38` (#616161) | `tokens.colorNeutralStrokeAccessible` | High-contrast border |
| `--neutral-stroke-disabled` | `--color-neutral-88` (#e0e0e0) | `tokens.colorNeutralStrokeDisabled` | Disabled border |
| `--brand-stroke1` | `--color-brand-80` (#0f6cbd) | `tokens.colorBrandStroke1` | Brand border |
| `--brand-stroke2` | `--color-brand-140` (#b4d6fa) | `tokens.colorBrandStroke2` | Subtle brand border |
| `--compound-brand-stroke` | `--color-brand-80` (#0f6cbd) | `tokens.colorCompoundBrandStroke` | Compound brand line |

## Typography

### Font Families

| Coherence CSS | Value | Fluent Token |
|---|---|---|
| `--font-family-base` | `"Segoe UI", "Segoe UI Web (West European)", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif` | `tokens.fontFamilyBase` |
| `--font-family-numeric` | `Bahnschrift, "Segoe UI", ...` | `tokens.fontFamilyNumeric` |
| `--font-family-monospace` | `Consolas, "Courier New", Courier, monospace` | `tokens.fontFamilyMonospace` |

### Font Sizes

| Coherence CSS | Value | Fluent Token | Usage |
|---|---|---|---|
| `--font-size-base100` | 10px | `tokens.fontSizeBase100` | Tiny labels |
| `--font-size-base200` | 12px | `tokens.fontSizeBase200` | Captions, badges |
| `--font-size-base300` | 14px | `tokens.fontSizeBase300` | **Body text (default)** |
| `--font-size-base400` | 16px | `tokens.fontSizeBase400` | Subtitle |
| `--font-size-base500` | 20px | `tokens.fontSizeBase500` | Page title |
| `--font-size-base600` | 24px | `tokens.fontSizeBase600` | Section heading |
| `--font-size-hero700` | 28px | `tokens.fontSizeHero700` | Hero text |
| `--font-size-hero800` | 32px | `tokens.fontSizeHero800` | Large hero |
| `--font-size-hero900` | 40px | `tokens.fontSizeHero900` | Display |
| `--font-size-hero1000` | 68px | `tokens.fontSizeHero1000` | XL display |

### Font Weights

| Coherence CSS | Value | Fluent Token | Usage |
|---|---|---|---|
| `--font-weight-regular` | 400 | `tokens.fontWeightRegular` | Body text |
| `--font-weight-medium` | 500 | `tokens.fontWeightMedium` | Emphasis |
| `--font-weight-semi-bold` | 600 | `tokens.fontWeightSemibold` | Headings, titles |
| `--font-weight-bold` | 700 | `tokens.fontWeightBold` | Strong emphasis |

### Line Heights

| Coherence CSS | Value | Fluent Token |
|---|---|---|
| `--line-height-xs` | 1 | `tokens.lineHeightBase100` |
| `--line-height-sm` | 1.25 | `tokens.lineHeightBase200` |
| `--line-height-md` | 1.5 | `tokens.lineHeightBase300` |
| `--line-height-lg` | 2 | `tokens.lineHeightBase400` |

## Spacing

| Coherence CSS | Value | Common Usage |
|---|---|---|
| `--spacing-none` | 0px | No spacing |
| `--spacing-xxs` | 2px | Tight gaps, focus offset |
| `--spacing-xs` | 4px | Icon-to-text gap |
| `--spacing-s-nudge` | 6px | Button vertical padding |
| `--spacing-sm` | 8px | Default gap, compact padding |
| `--spacing-m-nudge` | 10px | Form control horizontal padding |
| `--spacing-md` | 12px | Button horizontal padding |
| `--spacing-lg` | 16px | Section padding, card padding |
| `--spacing-xl` | 20px | Generous padding |
| `--spacing-xxl` | 24px | Large section spacing |
| `--spacing-xxxl` | 32px | Page-level spacing |

## Border Radius

| Coherence CSS | Value | Fluent Token | Usage |
|---|---|---|---|
| `--border-radius-none` | 0 | `tokens.borderRadiusNone` | No rounding |
| `--border-radius-sm` | 2px | `tokens.borderRadiusSmall` | Badges, tags |
| `--border-radius-md` | 4px | `tokens.borderRadiusMedium` | Buttons, inputs, cards |
| `--border-radius-lg` | 6px | `tokens.borderRadiusLarge` | Panels |
| `--border-radius-xl` | 8px | `tokens.borderRadiusXLarge` | Dialogs |
| `--border-radius-circular` | 10000px | `tokens.borderRadiusCircular` | Avatars, pills |

## Border Widths

| Coherence CSS | Value | Fluent Token |
|---|---|---|
| `--border-width-none` | 0 | |
| `--border-width-thin` | 1px | `tokens.strokeWidthThin` |
| `--border-width-thick` | 2px | `tokens.strokeWidthThick` |
| `--border-width-thicker` | 3px | `tokens.strokeWidthThicker` |
| `--border-width-thickest` | 4px | `tokens.strokeWidthThickest` |

## Shadows

| Coherence CSS | Value | Fluent Token | Usage |
|---|---|---|---|
| `--shadow-0` | none | | No shadow |
| `--shadow-2` | `0 0 2px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.14)` | `tokens.shadow2` | Subtle resting |
| `--shadow-4` | `0 0 2px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.14)` | `tokens.shadow4` | Raised cards |
| `--shadow-8` | `0 0 2px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.14)` | `tokens.shadow8` | Dropdowns, popovers |
| `--shadow-16` | `0 0 2px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.14)` | `tokens.shadow16` | Dialogs |
| `--shadow-28` | `0 0 8px rgba(0,0,0,0.12), 0 14px 28px rgba(0,0,0,0.14)` | `tokens.shadow28` | Modals, overlays |
| `--shadow-64` | `0 0 8px rgba(0,0,0,0.12), 0 32px 64px rgba(0,0,0,0.14)` | `tokens.shadow64` | Teaching callouts |

## Animation / Transitions

| Coherence CSS | Value | Usage |
|---|---|---|
| `--duration-ultra-fast` | 50ms | Micro-interactions (focus rings) |
| `--duration-faster` | 100ms | Hover states |
| `--duration-fast` | 150ms | Tooltips appearing |
| `--duration-normal` | 200ms | Standard transitions |
| `--duration-gentle` | 250ms | Panel slides |
| `--duration-slow` | 300ms | Page transitions |
| `--duration-slower` | 400ms | Complex animations |
| `--duration-ultra-slow` | 500ms | Dramatic reveals |

### Easing Curves

| Coherence CSS | Value | Usage |
|---|---|---|
| `--timing-function-decelerate-mid` | `cubic-bezier(0, 0, 0, 1)` | Elements entering |
| `--timing-function-accelerate-mid` | `cubic-bezier(1, 0, 1, 1)` | Elements exiting |
| `--timing-function-easy-ease-max` | `cubic-bezier(0.8, 0, 0.2, 1)` | Significant motion |
| `--timing-function-linear` | `cubic-bezier(0, 0, 1, 1)` | Progress bars |

## Component-Level Tokens (from Coherence CSS)

These component-scoped custom properties show how the Coherence system styles its components:

### Button
| CSS Property | Value |
|---|---|
| `--button-bg-color` | `var(--neutral-background1)` |
| `--button-border-color` | `var(--neutral-stroke1)` |
| `--button-border-radius` | `var(--border-radius-md)` (4px) |
| `--button-fg-color` | `var(--neutral-foreground1)` |
| `--button-font-weight` | `var(--font-weight-regular)` |
| `--button-padding-x` | `var(--spacing-md)` (12px) |
| `--button-padding-y` | `var(--spacing-s-nudge)` (6px) |
| `--button-hover-bg-color` | `var(--neutral-background1hover)` (#f5f5f5) |
| `--button-active-bg-color` | `var(--neutral-background1pressed)` (#e0e0e0) |
| `--button-disabled-bg-color` | `var(--neutral-background-disabled)` (#f0f0f0) |
| `--button-disabled-fg-color` | `var(--neutral-foreground-disabled)` (#bdbdbd) |

### Form Controls (Input, Select, Textarea)
| CSS Property | Value |
|---|---|
| `--form-control-bg-color` | `var(--neutral-background1)` |
| `--form-control-border-color` | `var(--neutral-stroke1)` |
| `--form-control-border-radius` | `var(--border-radius-md)` (4px) |
| `--form-control-fg-color` | `var(--neutral-foreground1)` |
| `--form-control-font-size` | `var(--font-size-base300)` (14px) |
| `--form-control-input-height` | 32px |
| `--form-control-padding-x` | `var(--spacing-m-nudge)` (10px) |
| `--form-control-placeholder-color` | `var(--neutral-foreground4)` (#707070) |
| `--form-control-disabled-fg-color` | `var(--neutral-foreground-disabled)` |
| `--form-control-invalid-message-fg-color` | `var(--color-danger-primary)` |

### Links
| CSS Property | Value |
|---|---|
| `--link-fg-color` | `var(--brand-foreground-link)` (#115ea3) |
| `--link-decoration` | none |
| `--link-hover-fg-color` | `var(--brand-foreground-link-hover)` (#0f548c) |
| `--link-hover-decoration` | underline |
| `--link-active-fg-color` | `var(--brand-foreground-link-pressed)` (#0c3b5e) |
| `--link-disabled-fg-color` | `var(--neutral-foreground-disabled)` |

### Headings
| CSS Property | Value |
|---|---|
| `--heading-fg-color` | inherit |
| `--heading-font-weight` | `var(--font-weight-semi-bold)` (600) |
| `--heading-line-height` | `var(--line-height-sm)` (1.25) |

### Focus
| CSS Property | Value |
|---|---|
| `--focus-outline-color` | `var(--stroke-focus2)` (#000000) |
| `--focus-outline-size` | `var(--border-width-thick)` (2px) |
| `--focus-outline-style` | solid |
| `--focus-outline-offset` | `var(--spacing-xxs)` (2px) |

### Body (Global)
| CSS Property | Value |
|---|---|
| `--body-bg-color` | `var(--color-neutral-100)` (#ffffff) |
| `--body-fg-color` | `var(--color-neutral-14)` (#242424) |
| `--body-font-family` | `var(--font-family-base)` (Segoe UI stack) |
| `--body-font-size` | `var(--font-size-base300)` (14px) |
| `--body-font-weight` | `var(--font-weight-regular)` (400) |
| `--body-line-height` | `var(--line-height-md)` (1.5) |
