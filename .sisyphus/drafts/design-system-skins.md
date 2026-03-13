# Draft: Design System Skin Toggle

## Requirements (confirmed)

- Add a **third theming axis** to Storybook: Design System (alongside existing Product Theme × Appearance Mode)
- Five skins: **Fluent 2** (current baseline), **Coherence**, **Ibiza**, **Fluent 1**, **Azure Fluent**
- These are NOT actual library imports — they are **token overrides** that approximate each era's visual style
- **"NO HARD VALUES on ANY of the dynamic elements!!!"** — everything must use tokens
- Toggle should produce **instant visual updates** ("automagically see the update")
- Goal: "meet devs where they are" — show them what their product looks like in each design era

## Technical Decisions

### Architecture: Option C — True Third Axis (Oracle Recommendation)

- **Composition order**: `appearance base → design-system skin → product overrides`
- Product = identity (brand ramp, product-specific customizations)
- Appearance = mode (light/dark/high-contrast)
- Design System = era/style (structural tokens: radius, shadow, spacing, density, typography)
- `resolveTheme(productId, appearance, designSystem)` composes all three layers
- Rationale: Stays clean as products grow; avoids combinatorial explosion in product registry

### Token Override Scope (per skin)

Oracle confirmed: **color + radius + shadow alone is NOT enough** for Ibiza/Coherence.
Minimum viable skin needs:

1. Brand/semantic colors (brand ramp + semantic overrides)
2. Border radius scale (4 values: small/medium/large/xlarge)
3. Shadow system (7 values)
4. Spacing scale (~12 values)
5. Stroke widths (4 values)
6. Typography (font weights, potentially font sizes)

### Skin Type Design (Oracle-recommended structure)

Structured sections (NOT monolithic `Partial<Theme>` blobs):

```ts
type SkinSections = {
  colors?: Partial<Pick<Theme, SkinColorTokens>>;
  borderRadius?: Partial<Pick<Theme, SkinRadiusTokens>>;
  shadows?: Partial<Pick<Theme, SkinShadowTokens>>;
  spacing?: Partial<Pick<Theme, SkinSpacingTokens>>;
  strokeWidths?: Partial<Pick<Theme, SkinStrokeTokens>>;
  typography?: Partial<Pick<Theme, SkinTypographyTokens>>;
  semantic?: Partial<Record<SemanticTokenName, string>>;
};

interface DesignSystemSkin {
  id: DesignSystemId;
  label: string;
  byAppearance: Partial<Record<AppearanceMode, SkinSections>>;
}
```

### Hardcoded Values Problem

- 296 hardcoded px values across 22 component files
- 30 hardcoded hex colors in 4 component files
- Oracle recommendation: **Option (c) — staged parallel cleanup**
  - Skin plumbing + targeted component cleanup first
  - Broader cleanup tracked as explicitly non-compliant surfaces
  - Introduce **project semantic-token layer** for values Fluent Theme doesn't model

### Chromatic/Testing Strategy

- Expose all **30 combinations** in Storybook toolbar (interactive)
- **Do NOT** run Chromatic across all 30 for every story
- Exhaustive matrix testing limited to foundations/core stories
- Curated subset for other stories

## Research Findings

### Historical Design System Visual Characteristics

| System             | Brand Color | Border Radius | Shadows     | Density       | Base Font |
| ------------------ | ----------- | ------------- | ----------- | ------------- | --------- |
| Ibiza (~2014)      | `#0072C6`   | 0px (sharp)   | None (flat) | Ultra-compact | 12-13px   |
| Coherence (~2018)  | `#0078D4`   | 2px (subtle)  | Low depth   | Compact       | 14px      |
| Fluent 1 (~2020)   | `#0078D4`   | 2px (subtle)  | Low depth   | Standard      | 14px      |
| Azure Fluent       | `#0078D4`   | 2px (subtle)  | Low depth   | Compact       | 14px      |
| Fluent 2 (current) | `#0f6cbd`   | 4px (rounded) | High depth  | Spacious      | 14px      |

### Current Codebase State

- Two-axis system working well (Product × Appearance)
- 2 products registered: Azure, SRE Agent
- Griffel CSS-in-JS with tokens.\* consumption
- Custom Storybook addon with `<select>` dropdowns
- Fluent v9 (^9.56.0) as styling engine
- Vitest for testing

## Oracle Warnings

1. Product overrides can accidentally wipe out skin changes if they still own radius/spacing/shadow tokens → Move those concerns into skin layer
2. High contrast should stay accessibility-first → Historical styling there should be minimal
3. Some values won't fit into Fluent Theme → Use semantic tokens, never literals
4. If products need different brand ramps per skin → Add `brandBySkin` on product definition

## Open Questions

1. Should we keep Coherence AND Azure Fluent as separate skins, or are they visually similar enough to merge?
2. Which Fluent 2 tokens should remain in product overrides vs. move to skin layer? (SRE Agent currently overrides borderRadius/spacing — those belong in skin layer)
3. Test strategy: TDD or tests-after? Vitest infrastructure exists.
4. Priority order for hardcoded cleanup — which components first?

## Scope Boundaries

- INCLUDE: Third axis toggle, 5 skin definitions, token architecture, Storybook addon update, targeted hardcoded cleanup
- EXCLUDE: Actual legacy library imports, pixel-perfect reproduction, new component creation
