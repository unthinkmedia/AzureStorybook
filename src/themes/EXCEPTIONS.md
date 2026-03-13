# Tokenization Exceptions Ledger

This document lists all values in the codebase that are **intentionally not mapped** to Fluent v9 design tokens.
Each exception has a rationale. If you remove the exception justification, also remove the comment in source.

---

## 1. Layout Constants (Structural / Non-Theming)

These are functional layout measurements that define component geometry, not visual styling.
They must not vary by design-system skin or product theme.

| File                                  | Value                               | Comment in source              | Rationale                                                                                                       |
| ------------------------------------- | ----------------------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| `src/components/ContextPane.tsx`      | `315px`, `585px`, `855px`, `1125px` | `// layout constant`           | ContextPane width breakpoints: multiples of 315px defining panel width tiers. Must remain stable across themes. |
| `src/components/SideNavigation.tsx`   | `48px`, `260px`                     | `// layout constant`           | Collapsed / expanded nav widths. Functional boundary, not a visual token.                                       |
| `src/components/SearchBanner.tsx`     | `480px`                             | `// functional layout minimum` | Search bar max-width. Caps input width for readability.                                                         |
| `src/components/Cards/CardButton.tsx` | `104px`                             | `// layout constant`           | Fixed card tile size for grid layout alignment.                                                                 |
| `src/components/NullState.tsx`        | `120px`                             | `// layout constant`           | Illustration container size. Fixed for consistent artwork display.                                              |
| `src/components/ServiceFlyout.tsx`    | `540px`, `28px`                     | `// functional layout`         | Flyout panel width and icon frame. Structural boundaries, not visual tokens.                                    |
| `src/components/EssentialsPanel.tsx`  | `180px`                             | `// functional layout`         | Label column width in essentials grid. Fixed for alignment stability.                                           |

---

## 2. Animation Boundaries

CSS animation start/end states that represent transition boundaries (not measured spacing).

| File                               | Value           | Comment in source       | Rationale                                                                                  |
| ---------------------------------- | --------------- | ----------------------- | ------------------------------------------------------------------------------------------ |
| `src/components/ServiceFlyout.tsx` | `0px` → `500px` | `// animation boundary` | max-height expand animation. `0px` = collapsed, `500px` = fully open. Not a spacing value. |

---

## 3. SVG Gradient Stop Colors

SVG `<stop>` elements require inline `stopColor` / `stop-color` attributes.
CSS custom properties cannot be applied to SVG gradient stops without `@property` declarations
(which would require adding custom token infrastructure). These are documented and exempt.

| File                                                | Colors                | Comment in source          | Rationale                                                                           |
| --------------------------------------------------- | --------------------- | -------------------------- | ----------------------------------------------------------------------------------- |
| `src/components/GlobalHeader/AzureGlobalHeader.tsx` | `#0078D4` → `#50E6FF` | `// SVG gradient — exempt` | Azure brand gradient in SVG defs. Cannot be replaced by CSS vars without @property. |
| `src/components/GlobalHeader/SREGlobalHeader.tsx`   | `#6B69D6` → `#C4B9FE` | `// SVG gradient — exempt` | SRE Agent brand gradient in SVG defs. Same constraint.                              |

---

## 4. Skin Fidelity Policy

Design-system skins aim for **recognizable era, not pixel-perfect reproduction**.

The goal is that a developer familiar with Azure Portal's history can look at a story rendered in "Ibiza" skin
and immediately recognize the flat, sharp-cornered, high-density aesthetic — not that it matches every pixel
of the original Ibiza portal circa 2016.

**This means:**

- Token mappings use the _closest Fluent v9 token_ to the original value, with a comment explaining the approximation.
- We do NOT import legacy libraries (Coherence CDN, Fluent v1 packages, Ibiza CSS, etc.).
- We do NOT define new custom tokens — all skins use existing `@fluentui/react-components` tokens.

---

## 5. Composition Rule

`resolveTheme(productId, appearance, designSystem?)` applies layers in this order:

```
appearance base (Fluent v9 light/dark/hc)
  → design-system skin overrides (structural: shape, elevation, density, typography)
    → product color overrides (brand colors, identity)
```

**Product overrides always win.** This means:

- A skin can change border-radius, shadows, spacing, and typography tokens.
- A skin cannot change brand color tokens if a product override sets them.
- High-contrast appearance tokens are never overridden by skins (HC accessibility is non-negotiable).

---

## 6. Zero-Value Exemptions

`0` / `0px` values are used for explicit zero states (no border, no shadow, no radius).
These are intentional design choices for the Ibiza skin (flat Metro aesthetic) and are not "magic numbers."

| Skin    | Token                                       | Value    | Meaning                               |
| ------- | ------------------------------------------- | -------- | ------------------------------------- |
| `ibiza` | `borderRadiusNone`                          | `'0px'`  | Sharp corners — Metro/flat design era |
| `ibiza` | `shadow2`, `shadow4`, `shadow8`, `shadow16` | `'none'` | No elevation depth                    |

---

_Last updated: Task 20 — Final Regression / Closure_
