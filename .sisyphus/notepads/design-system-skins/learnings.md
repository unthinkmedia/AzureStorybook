# Learnings — design-system-skins

## 2026-03-13 Session Start

### Project Setup

- Worktree: `/tmp/design-system-skins` (branch: `feat/design-system-skins`)
- Test command: `bun run test`
- Build command: `bun run build`
- Lint command: `bun run lint`
- Dev command: `bun run dev` (Storybook on port 6006)

### Existing Code Patterns

- `src/themes/types.ts` — Existing types: `AppearanceMode`, `ProductThemeDefinition`, `ResolvedThemeResult`, `ThemeRegistry`
- `src/themes/themeRegistry.ts` — Product registry + `resolveTheme(productId, appearance)` 2-arg function
- `src/themes/products/azure.ts` — Azure product with color overrides only (all are colors, no structural tokens)
- `src/themes/products/sre-agent.ts` — SRE Agent with structural token overrides (borderRadius, spacing, etc.) - must be removed
- `.storybook/addons/theme-switcher/constants.ts` — ADDON_ID, PRODUCT_THEME_GLOBAL, APPEARANCE_MODE_GLOBAL, DEFAULT_PRODUCT, DEFAULT_APPEARANCE, PRODUCT_THEMES, APPEARANCE_MODES
- Test file pattern: Vitest with `describe`/`it`/`expect` from `vitest`, `expectTypeOf` for type tests
- `src/themes/__tests__/themeRegistry.test.ts` — existing test file (10 tests) to extend

### Technology Stack

- TypeScript 5.7 + React 18
- Fluent UI React v9 (`@fluentui/react-components`)
- Storybook 10 + Vite 6
- Vitest for testing
- Griffel CSS-in-JS (`makeStyles`, `tokens`)
- Bun package manager

### Known LSP Issues (Pre-existing — NOT to fix in this plan)

- `.storybook/main.ts` has pre-existing TS errors (autodocs type mismatch, react-docgenx-typescript typo) — these are NOT introduced by this work

### Fluent v9 Theme Shape

- `Theme` type is flat — all 600+ tokens at top level (no nesting)
- Spread merge works for composition: `{ ...base, ...skinOverrides, ...productOverrides }`
- Composition order: `appearance base → design-system skin → product overrides`
- `createLightTheme(brand)`, `createDarkTheme(brand)`, `createHighContrastTheme()` for base generation

### Design System Eras (Reference)

| Skin | Brand Blue | Border Radius | Shadows | Density | Base Font |
| Ibiza (~2014) | `#0072C6` | 0px sharp | None/flat | Ultra-compact | 12-13px |
| Coherence (~2018) | `#0078D4` | 2px subtle | Low | Compact | 14px |
| Fluent 1 (~2020) | `#0078D4` | 2px subtle | Low | Standard | 14px |
| Azure Fluent | `#0078D4` | 2px subtle | Low | Compact | 14px |
| Fluent 2 (current) | `#0f6cbd` | 4px rounded | High depth | Spacious | 14px |
