# Learnings — product-theme-switcher

## [2026-03-12] Session Start

### Codebase Conventions

- Project root: `/Users/erikdrouhard/Library/CloudStorage/OneDrive-Microsoft/Documents/dev/mini-azure/portal-playground/AzureStorybook`
- TypeScript strict mode, ESNext modules, bundler resolution
- Storybook version: 10.2.16 (NOT 8.5 as README says)
- Manager API: `storybook/manager-api` (NOT `@storybook/manager-api`)
- Package type: "module" (ESM)
- tsconfig includes `src`, `scripts`, `.storybook`
- vitest NOT yet installed
- No test files exist yet

### Key File Paths

- `src/themes/azureThemes.ts` — Azure brand ramp + 3 themes
- `src/themes/index.ts` — Single line barrel export
- `src/index.ts` — Likely exports via `export * from './themes'`
- `.storybook/preview.tsx` — Uses `withThemeByDataAttribute` + FluentProvider decorator (64 lines)
- `.storybook/main.ts` — Has `@storybook/addon-themes` in addons array
- `.storybook/manager.ts` — Uses `storybook/manager-api` + `storybook/theming/create`

### azureLightTheme Override Values (critical for Task 6)

- `colorNeutralBackground1: '#ffffff'`
- `colorPaletteRedBackground3: '#c50f1f'`
- `colorStrokeFocus2: '#000000'`
- lightOverrides span lines 40-102 (all Coherence tokens)
- darkOverrides: only `colorBrandForeground1: azureBrand[110]`, `colorBrandForeground2: azureBrand[120]`
- HC: NO overrides — `createHighContrastTheme()` called with NO arguments

### Scripts Available

- `npm run dev` — Storybook dev server
- `npm run build` — Storybook static build
- `npm run build:lib` — tsup library build
- `npm run build:llm` — LLM bundle generation
- `npm run build:all` — registry + llm + build (NO build:lib in this combo)
- `npm run lint` — ESLint

### Important Constraints

- `sideEffects: false` in package.json — may affect side-effect imports for theme registration
- `createHighContrastTheme()` takes NO arguments (no BrandVariants)
- Must keep `data-azure-theme` attribute for backward compat
- Must NOT modify `src/components/` or `src/stories/`

## [2026-03-12] Task 6 — Azure product theme overrides

- Created `src/themes/products/azure.ts` with `azureProductTheme` registration wired to `registerProductTheme`.
- Copied Azure light override token values directly from `azureThemes.ts` light block (start `colorNeutralBackground1`, end `colorStrokeFocus2`) with byte-identical values.
- Dark overrides set to exactly two tokens: `colorBrandForeground1: azureBrand[110]` and `colorBrandForeground2: azureBrand[120]`.
- Set `highContrastOverrides: undefined` to preserve stock `createHighContrastTheme()` behavior.
- Created `src/themes/products/index.ts` barrel with side-effect imports (`./azure`, `./logic-apps`) and named exports for both product themes.
- Evidence files written:
  - `.sisyphus/evidence/task-6-azure-product-overrides.txt`
  - `.sisyphus/evidence/task-6-barrel-exports.txt`

## [2026-03-12] Task 5 — Theme registry/resolver implementation

- Added `src/themes/themeRegistry.ts` as a generic, side-effect-free registry module.
- Resolver merge pattern uses null-safe spread in all modes:
  - light: `{ ...createLightTheme(def.brand), ...(def.lightOverrides ?? {}) }`
  - dark: `{ ...createDarkTheme(def.brand), ...(def.darkOverrides ?? {}) }`
  - high-contrast: `{ ...createHighContrastTheme(), ...(def.highContrastOverrides ?? {}) }`
- Kept high contrast base creator argument-less, matching Fluent API contract.

## [2026-03-12] Task 8 — Theme registry tests

- Replaced the placeholder registry test file with 9 unit tests covering registration enumeration, Azure light overrides, Azure dark override, Azure high-contrast validity, Logic Apps light divergence, missing-theme error handling, and registry snapshot metadata.
- Side-effect import `import '../products'` must execute before registry assertions so Azure and Logic Apps register themselves in the in-memory registry.
- Fluent light themes expose `colorBrandBackground` (not `colorBrandBackground1`), so the Logic Apps-vs-Azure light comparison must use `colorBrandBackground`.
- Verified the updated test file is diagnostics-clean and `./node_modules/.bin/vitest run` passes; full output saved to `.sisyphus/evidence/task-8-vitest-results.txt`.

## [2026-03-12] Task 9 — Storybook two-axis toolbar addon scaffold

- Added `.storybook/addons/theme-switcher/constants.ts` with canonical addon id, globals keys, defaults, and `PRODUCT_THEMES` / `APPEARANCE_MODES` arrays.
- Added `.storybook/addons/theme-switcher/manager.tsx` using SB10 manager imports from `storybook/manager-api`, with module-level `addons.register` and two `types.TOOL` toolbar registrations.
- Removed `@storybook/addon-themes` from `.storybook/main.ts` and replaced with local addon entry `./addons/theme-switcher/manager`.
- Storybook local addon loading required a resolvable preset module at `.storybook/addons/theme-switcher/manager.js`; it now exports `managerEntries` pointing to `manager.tsx`.
- Verification passed: `./node_modules/.bin/tsc --noEmit` succeeded and Storybook boot check on port 6099 returned HTTP 200.

## [2026-03-12] Task 12 — LLM bundle theme registry

- `scripts/generate-llm-bundle.ts` now hardcodes a stable `themeRegistry` payload in the bundle generator instead of importing runtime theme modules.
- LLM bundle version bumped to `2.0.0` and summary output now reports theme product count and appearance count.
- `llm-context/azure-theme.md` now documents the two-axis theme model: `resolveTheme(productId, appearanceMode)`, available products, and supported appearances.
- Build verification and bundle assertions saved to `.sisyphus/evidence/task-12-llm-bundle.txt`; doc keyword count saved to `.sisyphus/evidence/task-12-theme-docs.txt`.

## [2026-03-12] Task 11 — Theme registry exports (main barrel index.ts)

- Updated `src/themes/index.ts` from single-line barrel to structured multi-line export groups.
- Preserved backward compatibility: kept existing `export { azureBrand, azureLightTheme, azureDarkTheme, azureHighContrastTheme } from './azureThemes'` on first line.
- Added 3 export groups:
  1. **New theme system — types**: `ProductThemeDefinition`, `AppearanceMode`, `ThemeRegistry`, `ResolvedThemeResult` (type exports)
  2. **New theme system — registry functions**: `resolveTheme`, `registerProductTheme`, `getAllProductThemes`, `getProductTheme`, `getThemeRegistrySnapshot` (function exports)
  3. **New theme system — product themes**: `azureProductTheme` from `./products/azure`, `logicAppsProductTheme` from `./products/logic-apps`
- No side-effect imports added to main barrel (product themes self-register via their own modules).
- `./node_modules/.bin/tsc --noEmit` passes with zero errors.
- `npm run build:lib` exits 0 with all build targets (ESM, CJS, DTS) succeeding.
- Evidence files created:
  - `.sisyphus/evidence/task-11-exports.txt` — 6 export statements verified
  - `.sisyphus/evidence/task-11-build-lib.txt` — full build output showing success

## [2026-03-12] Task 10 — preview globals-based theme decorator

- Rewrote `.storybook/preview.tsx` to remove `withThemeByDataAttribute` and derive FluentProvider theme from `context.globals[PRODUCT_THEME_GLOBAL]` + `context.globals[APPEARANCE_MODE_GLOBAL]`.
- Added `globalTypes` defaults wired to `DEFAULT_PRODUCT` and `DEFAULT_APPEARANCE`, while preserving existing parameters, tags, story sort, and `import './preview.css'`.
- Kept backward compatibility by continuing to sync `document.documentElement.setAttribute('data-azure-theme', appearance)` before rendering `FluentProvider`.
- Verified `.storybook/preview.tsx` is diagnostics-clean and `./node_modules/.bin/tsc --noEmit` passes; evidence saved to task-10 preview files.
