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
