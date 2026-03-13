# Decisions — product-theme-switcher

## [2026-03-12] Architectural Decisions

### Theme Registration Pattern

- Product theme files call `registerProductTheme()` as a side-effect at module level
- `src/themes/products/index.ts` imports all product files for registration
- Preview imports `../src/themes/products` (side-effect) to trigger registration

### HC Theme Behavior

- `createHighContrastTheme()` takes NO BrandVariants args
- Product differentiation for HC comes entirely from `highContrastOverrides`
- Azure HC: `highContrastOverrides: undefined` (matches existing `createHighContrastTheme()`)

### Globals Keys

- `productTheme` — stores selected product ID (e.g., 'azure', 'logic-apps')
- `appearanceMode` — stores appearance ('light', 'dark', 'high-contrast')
- Default: `productTheme: 'azure'`, `appearanceMode: 'light'`

### Backward Compat

- `data-azure-theme` attribute must remain on `document.documentElement`
- Must be set to appearance value (not product theme)

### LLM Bundle

- Version: 1.0.0 → 2.0.0 (breaking schema change — adds themeRegistry)
- Hardcode theme registry data in script (avoid complex import resolution)

## [2026-03-12] F4 rerun decision

- For scope verdict accounting: exclude `.sisyphus/*` from contamination and unaccounted counts (orchestrator metadata), but include any non-`.sisyphus` committed files from `git diff HEAD~4..HEAD --name-only`.
- Final F4 rerun verdict stays `REJECT` until `debug-storybook.log` is removed from implementation commit range or explicitly justified in plan scope.

## [2026-03-12] Dark Mode Docs Page Implementation - Verified Working

### Decision: Storybook BaseDocsContainer Theme Approach is Correct

**Context:** The dark mode implementation for docs pages uses Storybook's `BaseDocsContainer` with a theme prop, not the `data-azure-theme` HTML attribute.

**Rationale:**
1. The `data-azure-theme` attribute is set by the story decorator (runs during story render), not during docs page render
2. Storybook docs pages need the container-level theme, not individual story decorators
3. The implementation correctly passes `theme={themes.dark}` to BaseDocsContainer when in dark mode

**Verification:** Playwright visual test on 2026-03-12 confirmed:
- Dark story canvas: Background renders dark (#222325)
- Light docs chrome: Background renders light (white)
- Light mode regression: No side effects

**Files to Reference:**
- `.storybook/preview.tsx` lines 28-46 (CustomDocsContainer implementation)
- `.storybook/preview.css` (CSS rules for preview blocks)

**Note:** The HTML attribute selector `[data-azure-theme="dark"]` in the CSS may not be the active path for docs pages, but the styling is being applied correctly through the Storybook theme system. This is working as intended.
