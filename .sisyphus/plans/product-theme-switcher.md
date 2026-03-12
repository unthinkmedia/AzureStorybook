# Product Theme Switcher for Azure Storybook

## TL;DR

> **Quick Summary**: Add a two-axis product theme switching system (Product Theme × Appearance Mode) to the Azure Storybook, enabling designers and AI tools to preview components in different Azure product brand contexts (e.g., Logic Apps, API Management) while maintaining light/dark/HC appearance modes.
>
> **Deliverables**:
>
> - Theme type system with `ProductThemeDefinition` and `ThemeRegistry` interfaces
> - Pure theme resolver: `(product, appearance) → Fluent Theme`
> - Custom Storybook toolbar addon with two dropdowns (Product + Appearance)
> - Refactored FluentProvider decorator using Storybook globals
> - 1 example product theme (Logic Apps) with placeholder tokens
> - Updated package exports for consuming projects
> - Updated LLM context bundle (v2.0.0) with theme registry data
> - Vitest setup + unit tests for theme resolution
> - Chromatic visual regression across product × appearance matrix
>
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 4 waves
> **Critical Path**: Task 1 → Task 2 → Task 5 → Task 6 → Task 9 → Task 12 → Final

---

## Context

### Original Request

Add a project-specific theme toggle to the Storybook that can switch between different Azure product themes (e.g., Logic Apps, API Management, Azure Copilot). The theme switcher should also make theme data consumable for external MCP integration so consuming projects get the correct design tokens for their specific Azure product.

### Interview Summary

**Key Discussions**:

- **MCP is Model Context Protocol**: Not built in this repo — focus on making theme data consumable (JSON exports, llm-context bundle)
- **Product themes = full token overrides**: Each product can override the entire token set, not just brand ramp
- **Two-axis switching**: Product Theme (Logic Apps, Azure base, etc.) × Appearance Mode (Light/Dark/HC) as two independent toolbar dropdowns
- **1 test product theme**: Logic Apps to validate the system — more products added over time via PRs to main
- **All bundled eagerly**: No lazy loading for now; themes are small data objects
- **Manager UI stays Azure branded**: No re-theming of Storybook chrome
- **Broader ecosystem**: HUB + Community where users fork projects; this Storybook is the design system source

**Research Findings**:

- `@storybook/addon-themes` `withThemeByDataAttribute` is the current switching mechanism — uses DOM attribute reading (fragile)
- Storybook 10.2.16 (not 8.5 as README says) — use `storybook/manager-api` import paths
- Fluent v9 `createLightTheme(brand)` / `createDarkTheme(brand)` generate full themes from BrandVariants
- `azureLightTheme` has ~60 Coherence CDN token overrides; `azureDarkTheme` has only 2; HC has zero
- Package published as `@azure-fluent-storybook/components` via tsup — exports must remain compatible
- `docs/cross-workspace-agent-guide.md` has MCP server concept (not built, not in scope)

### Metis Review

**Identified Gaps** (addressed):

- **Storybook version discrepancy**: README says 8.5, lockfile says 10.2.16 — using 10.2.16 (authoritative), noted for README update
- **Dark theme asymmetry**: azureLightTheme has deep overrides, Dark/HC are minimal — product themes will follow this same pattern unless product-specific overrides are provided
- **Data attribute backward compat**: Keep `data-azure-theme` attribute in sync from globals for any external CSS/tooling that depends on it
- **`createHighContrastTheme` signature**: Builder must verify if it accepts BrandVariants — if not, product HC themes may all be identical
- **LLM bundle schema change**: Bumping to v2.0.0 with theme additions
- **Addon API risk**: Builder MUST verify Storybook 10 addon API against installed types, not Storybook 8 docs

---

## Work Objectives

### Core Objective

Build a modular, two-axis theme switching system that lets Storybook users independently select a Product Theme (Azure, Logic Apps, etc.) and an Appearance Mode (Light, Dark, HC), with theme data made consumable for external MCP/AI integration.

### Concrete Deliverables

- `src/themes/types.ts` — TypeScript interfaces for product theme definitions
- `src/themes/themeRegistry.ts` — Theme registry and resolver function
- `src/themes/products/azure.ts` — Azure theme refactored into product format
- `src/themes/products/logic-apps.ts` — Logic Apps product theme (placeholder tokens)
- `src/themes/products/index.ts` — Product theme barrel export
- `.storybook/addons/theme-switcher/` — Custom toolbar addon (manager + preview)
- Updated `.storybook/preview.tsx` — New FluentProvider decorator using globals
- Updated `.storybook/main.ts` — Register custom addon
- Updated `src/themes/index.ts` — Export registry and resolver
- Updated `src/index.ts` — Export theme system for consumers
- `vitest.config.ts` + `src/themes/__tests__/themeRegistry.test.ts` — Unit tests
- Updated `scripts/generate-llm-bundle.ts` — Include theme registry in bundle
- Updated `llm-context/azure-theme.md` — Document theme system

### Definition of Done

- [ ] `npm run dev` launches Storybook with two toolbar dropdowns (Product + Appearance)
- [ ] Default state is Azure + Light (identical to current behavior)
- [ ] Selecting "Logic Apps" + "Light" renders stories with Logic Apps brand tokens
- [ ] Selecting any product + "Dark" renders the dark variant
- [ ] `npx vitest run` passes all theme resolution tests
- [ ] `npm run build` succeeds (Storybook static site)
- [ ] `npm run build:lib` succeeds (tsup package)
- [ ] `npm run build:llm` produces bundle with theme registry data (v2.0.0)
- [ ] `npm run chromatic` detects theme matrix snapshots

### Must Have

- Two independent toolbar dropdowns for Product and Appearance
- Pure `resolveTheme(product, appearance)` function testable without Storybook
- Azure product theme producing identical output to current `azureLightTheme`/`azureDarkTheme`/`azureHighContrastTheme`
- Logic Apps product theme with placeholder tokens clearly marked
- Typed `ProductThemeDefinition` interface that enforces BrandVariants + optional token overrides
- Theme registry JSON in the LLM context bundle
- Backward-compatible `data-azure-theme` attribute on document for external consumers
- All existing stories render without modification

### Must NOT Have (Guardrails)

- ❌ MCP server implementation (belongs to external ecosystem)
- ❌ Manager UI re-theming (stays Azure branded)
- ❌ More than 1 product theme beyond Azure (only Logic Apps for validation)
- ❌ Dynamic/lazy theme loading (all eagerly bundled)
- ❌ Theme editor or interactive token customization UI
- ❌ Theme preview panel or swatch viewer
- ❌ Modifications to any component in `src/components/`
- ❌ Modifications to any story in `src/stories/`
- ❌ Changes to existing Azure theme token values (must be identical)
- ❌ Component-level rendering tests (vitest scope = theme resolution only)
- ❌ `coherenceTokens.ts` refactoring (it's a reference, not runtime code)
- ❌ Product-specific "mini storybooks" (future scope)
- ❌ New MDX documentation pages for the theme system

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision

- **Infrastructure exists**: NO (zero test files, no vitest config)
- **Automated tests**: YES (Tests-after — vitest for theme resolution)
- **Framework**: vitest (project uses Vite)
- **Setup required**: vitest config + React environment + first test file

### QA Policy

Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Theme Resolution**: Use Bash (vitest) — Run tests, assert pass counts
- **Storybook UI**: Use Playwright — Navigate, click dropdowns, assert CSS variables
- **Package Build**: Use Bash — Run build commands, verify output files
- **LLM Bundle**: Use Bash (node) — Parse JSON, assert schema

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — foundation + infrastructure):
├── Task 1: Theme type system (ProductThemeDefinition, ThemeRegistry interfaces)  [quick]
├── Task 2: Vitest setup (config, environment, first test scaffold)              [quick]
├── Task 3: README version fix (8.5 → 10.x)                                     [quick]
└── Task 4: Research Storybook 10 addon API (inspect installed types)            [quick]

Wave 2 (After Wave 1 — core theme system + example theme):
├── Task 5: Theme registry + resolver function (depends: 1)                      [deep]
├── Task 6: Azure product theme file — refactor existing (depends: 1)            [deep]
├── Task 7: Logic Apps product theme — placeholder (depends: 1)                  [quick]
└── Task 8: Theme resolution unit tests (depends: 2, 5, 6, 7)                   [unspecified-high]

Wave 3 (After Wave 2 — Storybook integration + exports):
├── Task 9: Custom Storybook toolbar addon (depends: 4, 5)                       [deep]
├── Task 10: Refactor preview.tsx decorator (depends: 5, 9)                      [unspecified-high]
├── Task 11: Update package exports + src/index.ts (depends: 5, 6)              [quick]
└── Task 12: Update LLM bundle generation (depends: 5)                           [unspecified-high]

Wave 4 (After Wave 3 — verification):
├── Task 13: Full build regression (npm run build + build:lib + build:llm)       [quick]
└── Task 14: Chromatic visual regression setup (depends: 10)                     [unspecified-high]

Wave FINAL (After ALL tasks — independent review, 4 parallel):
├── Task F1: Plan compliance audit                                               [oracle]
├── Task F2: Code quality review                                                 [unspecified-high]
├── Task F3: Real manual QA (Playwright)                                         [unspecified-high]
└── Task F4: Scope fidelity check                                                [deep]

Critical Path: Task 1 → Task 5 → Task 9 → Task 10 → Task 13 → F1-F4
Parallel Speedup: ~60% faster than sequential
Max Concurrent: 4 (Waves 1, 2)
```

### Dependency Matrix

| Task | Depends On | Blocks           | Wave |
| ---- | ---------- | ---------------- | ---- |
| 1    | —          | 5, 6, 7          | 1    |
| 2    | —          | 8                | 1    |
| 3    | —          | —                | 1    |
| 4    | —          | 9                | 1    |
| 5    | 1          | 8, 9, 10, 11, 12 | 2    |
| 6    | 1          | 8, 11            | 2    |
| 7    | 1          | 8                | 2    |
| 8    | 2, 5, 6, 7 | —                | 2    |
| 9    | 4, 5       | 10               | 3    |
| 10   | 5, 9       | 13, 14           | 3    |
| 11   | 5, 6       | 13               | 3    |
| 12   | 5          | 13               | 3    |
| 13   | 10, 11, 12 | F1-F4            | 4    |
| 14   | 10         | F3               | 4    |

### Agent Dispatch Summary

- **Wave 1**: 4 tasks — T1 → `quick`, T2 → `quick`, T3 → `quick`, T4 → `quick`
- **Wave 2**: 4 tasks — T5 → `deep`, T6 → `deep`, T7 → `quick`, T8 → `unspecified-high`
- **Wave 3**: 4 tasks — T9 → `deep`, T10 → `unspecified-high`, T11 → `quick`, T12 → `unspecified-high`
- **Wave 4**: 2 tasks — T13 → `quick`, T14 → `unspecified-high`
- **FINAL**: 4 tasks — F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high`, F4 → `deep`

---

## TODOs

> Implementation + Test = ONE Task. Never separate.
> EVERY task MUST have: Recommended Agent Profile + Parallelization info + QA Scenarios.


- [x] 1. Create Theme Type System (`src/themes/types.ts`)

  **What to do**:
  - Create `src/themes/types.ts` with the following TypeScript interfaces:
    - `ProductThemeDefinition`: `{ id: string; displayName: string; description: string; brand: BrandVariants; lightOverrides?: Partial<Theme>; darkOverrides?: Partial<Theme>; highContrastOverrides?: Partial<Theme> }`
    - `AppearanceMode`: `'light' | 'dark' | 'high-contrast'` literal union type
    - `ThemeRegistry`: `Map<string, ProductThemeDefinition>` type alias
    - `ResolvedThemeResult`: `{ theme: Theme; productId: string; appearance: AppearanceMode }` — return type for resolver
  - Import `BrandVariants` and `Theme` from `@fluentui/react-components`
  - Export all types
  - Add JSDoc comments to each type explaining its role in the theme system

  **Must NOT do**:
  - Do NOT define actual theme values — this is types only
  - Do NOT import from any project files — only `@fluentui/react-components`
  - Do NOT create runtime code — only type definitions and the `AppearanceMode` union

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single file creation with clear type definitions — straightforward TypeScript
  - **Skills**: []
    - No specialized skills needed for type definition

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3, 4)
  - **Blocks**: Tasks 5, 6, 7 (all need these types)
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `src/themes/azureThemes.ts:7-12` — Existing imports of `BrandVariants`, `Theme`, `createLightTheme`, `createDarkTheme`, `createHighContrastTheme` from `@fluentui/react-components`
  - `src/themes/azureThemes.ts:14-31` — `azureBrand: BrandVariants` example showing the 10-160 step structure
  - `src/themes/azureThemes.ts:37-102` — `azureLightTheme: Theme` showing how overrides are spread onto `createLightTheme(brand)`

  **API/Type References**:
  - `@fluentui/react-components` — `BrandVariants` type (10-160 keyed object) and `Theme` type (~600 token keys)

  **WHY Each Reference Matters**:
  - `azureThemes.ts` is the model for what a product theme definition looks like — the types must capture exactly this shape
  - `BrandVariants` is the minimum required input; `lightOverrides`/`darkOverrides` are the optional deep customizations

  **Acceptance Criteria**:
  - [ ] `src/themes/types.ts` exists and exports `ProductThemeDefinition`, `AppearanceMode`, `ThemeRegistry`, `ResolvedThemeResult`
  - [ ] `npx tsc --noEmit` passes with no errors

  **QA Scenarios:**

  ```
  Scenario: Types compile and export correctly
    Tool: Bash
    Preconditions: src/themes/types.ts created
    Steps:
      1. Run: npx tsc --noEmit
      2. Run: node -e "const ts = require('typescript'); const src = require('fs').readFileSync('src/themes/types.ts','utf8'); console.log(src.includes('ProductThemeDefinition') && src.includes('AppearanceMode') && src.includes('ThemeRegistry') && src.includes('ResolvedThemeResult'))"
    Expected Result: tsc exits 0; node script prints 'true'
    Failure Indicators: tsc reports errors; script prints 'false'
    Evidence: .sisyphus/evidence/task-1-types-compile.txt
  ```

  **Commit**: YES (group with self only)
  - Message: `feat(themes): add product theme type system`
  - Files: `src/themes/types.ts`
  - Pre-commit: `npx tsc --noEmit`

- [x] 2. Set Up Vitest Test Infrastructure

  **What to do**:
  - Install `vitest` and `@testing-library/react` as dev dependencies: `npm install -D vitest`
  - Create `vitest.config.ts` at project root:
    - Reference existing `vite.config.ts` for plugin reuse
    - Set `test.environment` to `'node'` (theme resolution is pure functions, no DOM needed)
    - Set `test.include` to `['src/**/*.test.ts']`
  - Create empty test scaffold: `src/themes/__tests__/themeRegistry.test.ts` with a single passing placeholder test
  - Add `"test": "vitest run"` and `"test:watch": "vitest"` scripts to `package.json`
  - Verify: `npx vitest run` passes the placeholder test

  **Must NOT do**:
  - Do NOT install React testing utilities (jsdom, RTL) — theme tests are pure TypeScript, no DOM
  - Do NOT configure for component rendering — vitest scope is theme resolution only
  - Do NOT modify existing scripts (keep `test:storybook` as-is)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Standard vitest setup — config file + package.json script + placeholder test
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3, 4)
  - **Blocks**: Task 8 (needs vitest to run tests)
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `vite.config.ts` — Existing Vite config to reference for plugin compatibility
  - `package.json:29-44` — Existing scripts section (add `test` and `test:watch` alongside)

  **External References**:
  - Vitest docs: https://vitest.dev/config/ — Config options for `vitest.config.ts`

  **WHY Each Reference Matters**:
  - `vite.config.ts` ensures vitest uses the same Vite plugins/resolve config
  - Existing scripts show the naming convention to follow

  **Acceptance Criteria**:
  - [ ] `vitest.config.ts` exists at project root
  - [ ] `npx vitest run` exits 0 with 1 passing placeholder test
  - [ ] `package.json` has `test` and `test:watch` scripts

  **QA Scenarios:**

  ```
  Scenario: Vitest runs and passes placeholder test
    Tool: Bash
    Preconditions: vitest installed, config created, placeholder test exists
    Steps:
      1. Run: npx vitest run --reporter=verbose
      2. Check output for "1 passed"
    Expected Result: Exit code 0, output contains "1 passed" or "Tests  1 passed"
    Failure Indicators: Exit code non-zero, "FAIL" in output
    Evidence: .sisyphus/evidence/task-2-vitest-setup.txt
  ```

  **Commit**: YES
  - Message: `chore(test): set up vitest with node environment`
  - Files: `vitest.config.ts`, `package.json`, `src/themes/__tests__/themeRegistry.test.ts`
  - Pre-commit: `npx vitest run`

- [x] 3. Fix README Storybook Version

  **What to do**:
  - Update `README.md` references from "Storybook 8.5" or "Storybook 8" to match actual installed version (10.x per package-lock.json)
  - Update `.copilot-instructions.md` line 8 from "Storybook 8.5 (CSF3 format)" to "Storybook 10 (CSF3 format)"
  - Verify no other files reference the wrong version

  **Must NOT do**:
  - Do NOT change any other content in README or copilot instructions

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Two-line text change across two files
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 4)
  - **Blocks**: None
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `README.md` — Line referencing "Storybook 8.5"
  - `.copilot-instructions.md:8` — "Storybook 8.5 (CSF3 format)"

  **Acceptance Criteria**:
  - [ ] No file in the project references "Storybook 8" (search: `grep -r "Storybook 8" --include='*.md' --exclude-dir=.sisyphus .`)

  **QA Scenarios:**

  ```
  Scenario: No stale Storybook version references
    Tool: Bash
    Preconditions: Files updated
    Steps:
      1. Run: grep -r "Storybook 8" --include='*.md' --exclude-dir=.sisyphus .
    Expected Result: No matches found (exit code 1)
    Failure Indicators: Any matches found
    Evidence: .sisyphus/evidence/task-3-version-fix.txt
  ```

  **Commit**: YES
  - Message: `docs: fix Storybook version references (8.5 → 10.x)`
  - Files: `README.md`, `.copilot-instructions.md`
  - Pre-commit: —

- [x] 4. Research Storybook 10 Addon API

  **What to do**:
  - Inspect `node_modules/storybook/dist/manager-api/index.d.ts` and related type files to understand the Storybook 10 addon API
  - Document in `.sisyphus/evidence/task-4-addon-api-research.md`:
    - How to register a custom toolbar addon in Storybook 10
    - The correct import paths (`storybook/manager-api` vs `@storybook/manager-api`)
    - How `addons.register`, `addons.add`, `types.TOOL` work in SB10
    - How `useGlobals()` hook works in both manager and preview contexts
    - How toolbar items render (React components in manager context)
    - The API for adding a toolbar dropdown (`Addon_TypesEnum`, toolbar item types)
  - Verify by checking existing `.storybook/manager.ts` imports work with SB10
  - Check if `@storybook/addon-themes` can coexist with custom globals or should be removed

  **Must NOT do**:
  - Do NOT modify source files — evidence file creation is expected
  - Do NOT rely on Storybook 8 documentation — verify everything against installed types

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Read-only research task — inspect types and document findings
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3)
  - **Blocks**: Task 9 (needs API knowledge to build addon)
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `.storybook/manager.ts:1-2` — Existing SB10-style imports: `storybook/manager-api` and `storybook/theming/create`
  - `.storybook/preview.tsx:4` — `withThemeByDataAttribute` from `@storybook/addon-themes` (to understand what it does for replacement)

  **API/Type References**:
  - `node_modules/storybook/dist/manager-api/index.d.ts` — The authoritative SB10 addon API types
  - `node_modules/@storybook/addon-themes/dist/index.d.ts` — Current addon-themes API to understand what to replace

  **WHY Each Reference Matters**:
  - `manager.ts` proves the import convention this project uses for SB10
  - The installed type definitions are the ONLY reliable source for the addon API — do NOT use external docs for SB8

  **Acceptance Criteria**:
  - [ ] `.sisyphus/evidence/task-4-addon-api-research.md` exists with documented API findings
  - [ ] Document covers: registration, globals, toolbar items, import paths

  **QA Scenarios:**

  ```
  Scenario: Research document is comprehensive
    Tool: Bash
    Preconditions: Research file created
    Steps:
      1. Check file exists: ls -la .sisyphus/evidence/task-4-addon-api-research.md
      2. Verify key topics covered: grep -c "useGlobals\|addons.register\|addons.add\|types.TOOL\|toolbar" .sisyphus/evidence/task-4-addon-api-research.md
    Expected Result: File exists, grep count >= 5 (all key topics present)
    Failure Indicators: File missing, key topics not documented
    Evidence: .sisyphus/evidence/task-4-addon-api-research.md
  ```

  **Commit**: NO (research artifact, not source code)

---

- [x] 5. Build Theme Registry and Resolver Function (`src/themes/themeRegistry.ts`)

  **What to do**:
  - Create `src/themes/themeRegistry.ts` implementing:
    - `themeRegistry: Map<string, ProductThemeDefinition>` — internal mutable map holding all registered product themes
    - `registerProductTheme(definition: ProductThemeDefinition): void` — adds a product theme to the registry; throws if `id` already exists
    - `getProductTheme(id: string): ProductThemeDefinition | undefined` — retrieves a registered definition
    - `getAllProductThemes(): ProductThemeDefinition[]` — returns all registered product themes as an array
    - `resolveTheme(productId: string, appearance: AppearanceMode): Theme` — the core pure function:
      1. Look up `ProductThemeDefinition` from registry by `productId` (throw if not found)
      2. Generate base theme: `createLightTheme(brand)` / `createDarkTheme(brand)` / `createHighContrastTheme()` depending on `appearance`
      3. Spread the appropriate overrides: `{ ...baseTheme, ...definition.lightOverrides }` (or dark/HC)
      4. Return the final `Theme` object
    - `getThemeRegistrySnapshot(): { id: string; displayName: string; description: string }[]` — serializable summary for LLM bundle consumption
  - Import types from `./types` and theme creators from `@fluentui/react-components`
  - Export all public functions
  - **IMPORTANT**: `createHighContrastTheme()` takes NO arguments (no BrandVariants). The resolver must handle this — HC base is always the same, but product-specific `highContrastOverrides` are still spread on top

  **Must NOT do**:
  - Do NOT import any product theme files — the registry is populated by theme files calling `registerProductTheme`
  - Do NOT hardcode any product theme data — the registry is generic
  - Do NOT add side effects at module level (no auto-registration)

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Core architecture piece — requires careful design of the resolver function, error handling, and HC edge case
  - **Skills**: []
    - No specialized skills needed; pure TypeScript module
  - **Skills Evaluated but Omitted**:
    - `playwright`: No browser interaction
    - `frontend-ui-ux`: No visual component

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 6, 7)
  - **Blocks**: Tasks 8, 9, 10, 11, 12 (nearly everything downstream)
  - **Blocked By**: Task 1 (needs type definitions)

  **References**:

  **Pattern References** (existing code to follow):
  - `src/themes/azureThemes.ts:37-102` — How `createLightTheme(azureBrand)` is spread with overrides to produce `azureLightTheme`. The resolver must replicate this exact pattern: `{ ...createLightTheme(brand), ...lightOverrides }`
  - `src/themes/azureThemes.ts:107-111` — How `createDarkTheme(azureBrand)` has minimal overrides (`colorBrandForeground1`, `colorBrandForeground2`). Shows that dark overrides can be very sparse
  - `src/themes/azureThemes.ts:116` — `createHighContrastTheme()` called with NO arguments. This is critical: HC base doesn't accept a brand ramp, so product differentiation for HC comes entirely from overrides

  **API/Type References** (contracts to implement against):
  - `src/themes/types.ts` — `ProductThemeDefinition`, `AppearanceMode`, `ThemeRegistry`, `ResolvedThemeResult` (created in Task 1)
  - `@fluentui/react-components` — `createLightTheme`, `createDarkTheme`, `createHighContrastTheme`, `Theme`, `BrandVariants`

  **External References**:
  - Fluent v9 theming docs: themes are flat objects (~600 keys), safe to spread/merge

  **WHY Each Reference Matters**:
  - `azureThemes.ts` is the canonical example of exactly what `resolveTheme` needs to reproduce programmatically — the executor must verify their resolver output matches the hand-written themes
  - The HC edge case (no BrandVariants) is the most likely source of bugs — the executor must test this specifically
  - Type imports from Task 1 define the contract; deviation = type errors

  **Acceptance Criteria**:
  - [ ] `src/themes/themeRegistry.ts` exists and exports: `registerProductTheme`, `getProductTheme`, `getAllProductThemes`, `resolveTheme`, `getThemeRegistrySnapshot`
  - [ ] `npx tsc --noEmit` passes
  - [ ] `resolveTheme('azure', 'light')` returns a valid Theme object (tested in Task 8)

  **QA Scenarios:**

  ```
  Scenario: Module exports all required functions
    Tool: Bash
    Preconditions: src/themes/themeRegistry.ts created
    Steps:
      1. Run: npx tsc --noEmit
      2. Run: node -e "const ts = require('fs').readFileSync('src/themes/themeRegistry.ts','utf8'); const exports = ['registerProductTheme','getProductTheme','getAllProductThemes','resolveTheme','getThemeRegistrySnapshot']; const missing = exports.filter(e => !ts.includes(e)); console.log(missing.length === 0 ? 'PASS' : 'FAIL: missing ' + missing.join(', '))"
    Expected Result: tsc exits 0; script prints 'PASS'
    Failure Indicators: tsc errors; script prints 'FAIL' with missing exports
    Evidence: .sisyphus/evidence/task-5-registry-exports.txt

  Scenario: Resolver throws for unregistered product
    Tool: Bash
    Preconditions: themeRegistry.ts created, no themes registered
    Steps:
      1. Run: node -e "import('./src/themes/themeRegistry.ts').catch(() => {}); /* verify throw behavior in unit test Task 8 */"
    Expected Result: Verified via unit tests in Task 8 (this is a pure function, full testing deferred to test task)
    Evidence: .sisyphus/evidence/task-5-resolver-throw.txt
  ```

  **Commit**: YES (group with Tasks 6, 7)
  - Message: `feat(themes): add theme registry with Azure + Logic Apps products`
  - Files: `src/themes/themeRegistry.ts`, `src/themes/products/azure.ts`, `src/themes/products/logic-apps.ts`, `src/themes/products/index.ts`
  - Pre-commit: `npx tsc --noEmit`

- [x] 6. Create Azure Product Theme File (`src/themes/products/azure.ts`)

  **What to do**:
  - Create `src/themes/products/azure.ts` that:
    - Imports `ProductThemeDefinition` from `../types`
    - Imports `registerProductTheme` from `../themeRegistry`
    - Imports `azureBrand` from `../azureThemes`
    - Defines `azureProductTheme: ProductThemeDefinition` with:
      - `id: 'azure'`
      - `displayName: 'Azure'`
      - `description: 'Default Azure Portal theme — Coherence design system tokens'`
      - `brand: azureBrand` (reuse existing brand ramp)
      - `lightOverrides`: Copy the exact override object from `azureLightTheme` (lines 40-102 of azureThemes.ts) — all the Coherence token mappings
      - `darkOverrides`: Copy the exact override object from `azureDarkTheme` (lines 109-111) — `colorBrandForeground1` and `colorBrandForeground2`
      - `highContrastOverrides`: `undefined` (no HC overrides, matching current `createHighContrastTheme()` behavior)
    - Calls `registerProductTheme(azureProductTheme)` as a side effect at module level
    - Exports `azureProductTheme` for direct access
  - Create `src/themes/products/index.ts` barrel that imports (side-effect) both product files:
    - `import './azure';`
    - `import './logic-apps';`
    - Also re-exports: `export { azureProductTheme } from './azure';` and `export { logicAppsProductTheme } from './logic-apps';`
  - **CRITICAL VERIFICATION**: After this task, `resolveTheme('azure', 'light')` MUST produce a Theme object with byte-identical token values to the current `azureLightTheme`. Verify by comparing key tokens:
    - `colorNeutralBackground1` must be `'#ffffff'`
    - `colorBrandForeground1` must match `azureBrand[110]` in dark mode
    - `colorPaletteRedBackground3` must be `'#c50f1f'` in light mode

  **Must NOT do**:
  - Do NOT modify `src/themes/azureThemes.ts` — the original file stays as-is for backward compatibility
  - Do NOT change any token values — they must be exact copies
  - Do NOT add new tokens that don't exist in the current themes

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Must carefully extract overrides from existing theme, ensure byte-identical output — high correctness requirement
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: No visual work, pure data extraction

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 5, 7)
  - **Blocks**: Tasks 8, 11
  - **Blocked By**: Task 1 (needs type definitions)

  **References**:

  **Pattern References** (existing code to follow):
  - `src/themes/azureThemes.ts:14-31` — `azureBrand: BrandVariants` — reuse this directly (import it, don't copy)
  - `src/themes/azureThemes.ts:37-102` — The EXACT override object to copy into `lightOverrides`. Everything after the spread (`...createLightTheme(azureBrand)`) on line 38 is the override set: `colorNeutralBackground1` through `colorStrokeFocus2`
  - `src/themes/azureThemes.ts:107-111` — The EXACT override object for `darkOverrides`: `{ colorBrandForeground1: azureBrand[110], colorBrandForeground2: azureBrand[120] }`
  - `src/themes/azureThemes.ts:116` — HC theme has no overrides — `highContrastOverrides` should be `undefined`

  **API/Type References**:
  - `src/themes/types.ts:ProductThemeDefinition` — The shape this file must produce (from Task 1)
  - `src/themes/themeRegistry.ts:registerProductTheme` — The function to call for registration (from Task 5)

  **WHY Each Reference Matters**:
  - Lines 37-102 are the EXACT source of truth for light overrides — missing even one token means Azure product theme diverges from current behavior
  - The dark overrides are just 2 lines but critical: `azureBrand[110]` and `azureBrand[120]` — executor must verify these specific indices
  - HC having no overrides is a deliberate choice, not an omission

  **Acceptance Criteria**:
  - [ ] `src/themes/products/azure.ts` exists with `azureProductTheme` export
  - [ ] `src/themes/products/index.ts` exists with side-effect imports + re-exports
  - [ ] `npx tsc --noEmit` passes
  - [ ] Light overrides contain all ~60 Coherence tokens from `azureLightTheme`
  - [ ] Dark overrides contain exactly 2 tokens: `colorBrandForeground1`, `colorBrandForeground2`
  - [ ] `highContrastOverrides` is `undefined`

  **QA Scenarios:**

  ```
  Scenario: Azure product theme has correct override counts
    Tool: Bash
    Preconditions: src/themes/products/azure.ts created
    Steps:
      1. Run: npx tsc --noEmit
      2. Run: grep -c 'color' src/themes/products/azure.ts
    Expected Result: tsc exits 0; grep count approximately 60+ (all Coherence light tokens + 2 dark tokens)
    Failure Indicators: tsc errors; significantly fewer color tokens than in azureThemes.ts
    Evidence: .sisyphus/evidence/task-6-azure-product-overrides.txt

  Scenario: Products barrel exports both themes
    Tool: Bash
    Preconditions: src/themes/products/index.ts created
    Steps:
      1. Run: grep -c "import '" src/themes/products/index.ts
      2. Run: grep 'azureProductTheme\|logicAppsProductTheme' src/themes/products/index.ts
    Expected Result: 2 side-effect imports; both product theme names present in re-exports
    Failure Indicators: Missing imports or exports
    Evidence: .sisyphus/evidence/task-6-barrel-exports.txt
  ```

  **Commit**: YES (group with Tasks 5, 7)
  - Message: `feat(themes): add theme registry with Azure + Logic Apps products`
  - Files: `src/themes/products/azure.ts`, `src/themes/products/index.ts`
  - Pre-commit: `npx tsc --noEmit`

- [x] 7. Create Logic Apps Product Theme (`src/themes/products/logic-apps.ts`)

  **What to do**:
  - Create `src/themes/products/logic-apps.ts` that:
    - Imports `ProductThemeDefinition` from `../types`
    - Imports `registerProductTheme` from `../themeRegistry`
    - Defines `logicAppsBrand: BrandVariants` with a DISTINCT brand ramp (Logic Apps uses a purple/blue palette — use `#4F6BED` as primary at step 80):
      ```
      10: '#090E1F', 20: '#101C3D', 30: '#15295E', 40: '#1A377F', 50: '#1F45A0',
      60: '#2554C0', 70: '#2E60D9', 80: '#4F6BED', 90: '#6B83F0', 100: '#879BF3',
      110: '#9DAFFA', 120: '#B0C0FC', 130: '#C4D1FD', 140: '#D8E1FE', 150: '#E8EDFE', 160: '#F4F6FF'
      ```
    - Defines `logicAppsProductTheme: ProductThemeDefinition` with:
      - `id: 'logic-apps'`
      - `displayName: 'Logic Apps'`
      - `description: 'Azure Logic Apps — workflow automation product theme (placeholder tokens)'`
      - `brand: logicAppsBrand`
      - `lightOverrides: undefined` — placeholder; Logic Apps uses stock `createLightTheme` output for now
      - `darkOverrides: undefined` — placeholder
      - `highContrastOverrides: undefined` — placeholder
    - Calls `registerProductTheme(logicAppsProductTheme)` as a side effect
    - Exports `logicAppsProductTheme`
    - Add a `// TODO: Add Logic Apps-specific token overrides when brand guidelines are finalized` comment

  **Must NOT do**:
  - Do NOT invent elaborate token overrides — this is a PLACEHOLDER theme to validate the architecture
  - Do NOT copy Azure's Coherence overrides — Logic Apps should use stock Fluent output to prove the system works without overrides

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple file creation following an established pattern (Task 6). Only difference is brand ramp values and no overrides
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 5, 6)
  - **Blocks**: Task 8
  - **Blocked By**: Task 1 (needs type definitions)

  **References**:

  **Pattern References** (existing code to follow):
  - `src/themes/products/azure.ts` (created in Task 6) — Follow the exact same file structure: imports, definition, registration call, export. Only change: different brand ramp values and no overrides
  - `src/themes/azureThemes.ts:14-31` — BrandVariants shape reference (10-160 step structure). Logic Apps brand ramp must follow the same 16-step pattern

  **API/Type References**:
  - `src/themes/types.ts:ProductThemeDefinition` — Shape to implement
  - `@fluentui/react-components:BrandVariants` — Must be a 10-160 keyed object

  **WHY Each Reference Matters**:
  - Azure product theme (Task 6) is the template — following it exactly ensures consistency
  - BrandVariants must have all 16 steps (10-160) or Fluent will throw at runtime

  **Acceptance Criteria**:
  - [ ] `src/themes/products/logic-apps.ts` exists with `logicAppsProductTheme` export
  - [ ] `logicAppsBrand` has all 16 BrandVariants steps (10-160)
  - [ ] `npx tsc --noEmit` passes
  - [ ] All overrides are `undefined` (placeholder)
  - [ ] File includes a TODO comment about future token overrides

  **QA Scenarios:**

  ```
  Scenario: Logic Apps theme is a valid placeholder
    Tool: Bash
    Preconditions: src/themes/products/logic-apps.ts created
    Steps:
      1. Run: npx tsc --noEmit
      2. Run: grep -c 'undefined' src/themes/products/logic-apps.ts
      3. Run: grep 'TODO' src/themes/products/logic-apps.ts
    Expected Result: tsc exits 0; multiple undefined values (overrides are placeholder); TODO comment present
    Failure Indicators: tsc errors; overrides are defined (should be undefined); no TODO comment
    Evidence: .sisyphus/evidence/task-7-logic-apps-placeholder.txt

  Scenario: Brand ramp has all 16 steps
    Tool: Bash
    Preconditions: logic-apps.ts created
    Steps:
      1. Run: grep -oE '(10|20|30|40|50|60|70|80|90|100|110|120|130|140|150|160):' src/themes/products/logic-apps.ts | wc -l
    Expected Result: Count = 16 (all steps present)
    Failure Indicators: Count < 16 (missing steps)
    Evidence: .sisyphus/evidence/task-7-brand-steps.txt
  ```

  **Commit**: YES (group with Tasks 5, 6)
  - Message: `feat(themes): add theme registry with Azure + Logic Apps products`
  - Files: `src/themes/products/logic-apps.ts`
  - Pre-commit: `npx tsc --noEmit`

- [x] 8. Write Theme Resolution Unit Tests (`src/themes/__tests__/themeRegistry.test.ts`)

  **What to do**:
  - Replace the placeholder test created in Task 2 with comprehensive tests in `src/themes/__tests__/themeRegistry.test.ts`:
  - Import the theme system: `import '../products'` (side-effect: registers all product themes)
  - Import `resolveTheme`, `getAllProductThemes`, `getProductTheme`, `getThemeRegistrySnapshot` from `../themeRegistry`
  - Import `azureLightTheme`, `azureDarkTheme`, `azureHighContrastTheme` from `../azureThemes` (for comparison)
  - Test suites to write:
    - **Registry population**: `getAllProductThemes()` returns 2 themes (azure, logic-apps)
    - **Azure light resolution**: `resolveTheme('azure', 'light')` returns a Theme where key tokens match `azureLightTheme`:
      - `colorNeutralBackground1 === '#ffffff'`
      - `colorPaletteRedBackground3 === '#c50f1f'`
      - `colorStrokeFocus2 === '#000000'`
    - **Azure dark resolution**: `resolveTheme('azure', 'dark')` returns a Theme where:
      - `colorBrandForeground1 === azureLightTheme` comparison fails (dark is different)
      - `colorBrandForeground1` matches `azureBrand[110]`
    - **Azure HC resolution**: `resolveTheme('azure', 'high-contrast')` returns a valid Theme
    - **Logic Apps light resolution**: `resolveTheme('logic-apps', 'light')` returns a Theme with different brand tokens than Azure
    - **Logic Apps brand differentiation**: Logic Apps theme `colorBrandBackground` !== Azure theme `colorBrandBackground`
    - **Unknown product throws**: `resolveTheme('nonexistent', 'light')` throws an error
    - **Registry snapshot**: `getThemeRegistrySnapshot()` returns array with `{ id, displayName, description }` for each theme
  - Target: 8-10 tests covering all 6 product×appearance combinations + error case + snapshot

  **Must NOT do**:
  - Do NOT test DOM rendering, Storybook integration, or React components
  - Do NOT import Storybook packages — tests are pure TypeScript
  - Do NOT test internal implementation details (private registry map)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Multi-scenario test file requiring careful comparison assertions — more complex than a `quick` task
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `playwright`: These are unit tests, not browser tests

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (runs after Tasks 5, 6, 7 complete)
  - **Blocks**: None directly (but tests validate Waves 1-2 correctness)
  - **Blocked By**: Tasks 2, 5, 6, 7 (needs vitest setup + all theme files)

  **References**:

  **Pattern References** (existing code to follow):
  - `src/themes/__tests__/themeRegistry.test.ts` — The placeholder test created in Task 2. Replace its contents entirely with the real tests
  - `vitest.config.ts` — Created in Task 2; defines `test.environment: 'node'` and `test.include` patterns

  **API/Type References** (contracts to test against):
  - `src/themes/themeRegistry.ts` — `resolveTheme`, `getAllProductThemes`, `getProductTheme`, `getThemeRegistrySnapshot` (from Task 5)
  - `src/themes/azureThemes.ts:37-102` — `azureLightTheme` token values to compare against resolver output. Key values: `colorNeutralBackground1: '#ffffff'`, `colorPaletteRedBackground3: '#c50f1f'`, `colorStrokeFocus2: '#000000'`
  - `src/themes/azureThemes.ts:107-111` — `azureDarkTheme` with `azureBrand[110]` and `azureBrand[120]` overrides
  - `src/themes/products/` — Side-effect imports that register themes in the registry

  **WHY Each Reference Matters**:
  - The `azureLightTheme` comparison is the MOST CRITICAL test — it proves the resolver+registry produce identical output to the hand-written theme
  - Testing Logic Apps brand differentiation proves the two-axis system actually works (different products → different tokens)
  - The throw test for unknown products ensures fail-fast behavior

  **Acceptance Criteria**:
  - [ ] `npx vitest run` passes with 8+ tests, 0 failures
  - [ ] Tests cover: 6 product×appearance combinations, 1 error case, 1 snapshot test
  - [ ] Azure light resolver output matches `azureLightTheme` key tokens exactly

  **QA Scenarios:**

  ```
  Scenario: All unit tests pass
    Tool: Bash
    Preconditions: All Wave 1-2 files created (types, registry, products, vitest config)
    Steps:
      1. Run: npx vitest run --reporter=verbose 2>&1
      2. Count "✓" or "passed" lines
    Expected Result: Exit code 0; 8+ tests pass; 0 failures
    Failure Indicators: Non-zero exit code; any FAIL line; fewer than 8 tests
    Evidence: .sisyphus/evidence/task-8-vitest-results.txt

  Scenario: Azure light token fidelity
    Tool: Bash
    Preconditions: Tests pass
    Steps:
      1. Check vitest output for specific test name: grep 'azure.*light\|light.*resolution' in evidence file
    Expected Result: Azure light resolution test is present and passes
    Failure Indicators: Test missing or failing
    Evidence: .sisyphus/evidence/task-8-vitest-results.txt
  ```

  **Commit**: YES
  - Message: `test(themes): add theme resolution unit tests`
  - Files: `src/themes/__tests__/themeRegistry.test.ts`
  - Pre-commit: `npx vitest run`

- [x] 9. Build Custom Storybook Toolbar Addon (`.storybook/addons/theme-switcher/`)

  **What to do**:
  - Create `.storybook/addons/theme-switcher/manager.tsx` — the toolbar addon registered in the Storybook manager UI:
    - Register addon with `addons.register('azure-storybook/theme-switcher', ...)` using `storybook/manager-api`
    - Add two toolbar items using `addons.add` with `types.TOOL`:
      1. **Product Theme Dropdown** (`azure-storybook/product-theme`):
         - Label: "Product"
         - Icon: grid or apps icon (use a simple inline SVG or Storybook icon)
         - Dropdown listing all registered product themes from registry snapshot
         - Reads/writes `globals.productTheme` via `useGlobals()` hook
         - Default value: `'azure'`
      2. **Appearance Mode Dropdown** (`azure-storybook/appearance-mode`):
         - Label: "Appearance"
         - Icon: sun/moon or theme icon
         - Three options: Light, Dark, High Contrast
         - Reads/writes `globals.appearanceMode` via `useGlobals()` hook
         - Default value: `'light'`
    - Use React components for toolbar rendering (manager runs in React context)
    - Import product theme list: either hardcode `[{id: 'azure', name: 'Azure'}, {id: 'logic-apps', name: 'Logic Apps'}]` OR import from a shared constants file
    - **CRITICAL**: Use the Task 4 research document (`.sisyphus/evidence/task-4-addon-api-research.md`) as the API guide — do NOT rely on Storybook 8 documentation
  - Create `.storybook/addons/theme-switcher/constants.ts` — shared addon ID and global key names:
    - `ADDON_ID = 'azure-storybook/theme-switcher'`
    - `PRODUCT_THEME_GLOBAL = 'productTheme'`
    - `APPEARANCE_MODE_GLOBAL = 'appearanceMode'`
    - Default values: `DEFAULT_PRODUCT = 'azure'`, `DEFAULT_APPEARANCE = 'light'`
    - Product list for toolbar: `PRODUCT_THEMES = [{ id: 'azure', displayName: 'Azure' }, { id: 'logic-apps', displayName: 'Logic Apps' }]`
    - Appearance list: `APPEARANCE_MODES = [{ id: 'light', displayName: 'Light' }, { id: 'dark', displayName: 'Dark' }, { id: 'high-contrast', displayName: 'High Contrast' }]`
  - Update `.storybook/main.ts` to register the addon:
    - Add `'./addons/theme-switcher/manager'` to `addons` array (local addon path — relative to `.storybook/` config directory)
    - Keep `@storybook/addon-docs` and `@storybook/addon-a11y`
    - **REMOVE** `@storybook/addon-themes` from addons — it is replaced by our custom addon
  - Set Storybook `globalTypes` for the two globals in `.storybook/preview.tsx` (or a separate preview params file):
    - `productTheme: { defaultValue: 'azure' }`
    - `appearanceMode: { defaultValue: 'light' }`

  **Must NOT do**:
  - Do NOT re-theme the Manager UI — only add toolbar dropdowns
  - Do NOT use `@storybook/addon-themes` or `withThemeByDataAttribute` — we're replacing it
  - Do NOT use Storybook 8 API patterns — verify against Task 4 research
  - Do NOT create a panel or tab — toolbar dropdown items only

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Storybook addon API is complex and version-sensitive. Must use SB10 API correctly, implement React toolbar components, wire globals properly
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: The addon is functional dropdowns, not a visual design task
    - `playwright`: No browser testing in this task (deferred to Task 10 QA and Final QA)

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 10, 11, 12 — but 10 depends on 9)
  - **Blocks**: Task 10 (preview decorator needs globals from addon)
  - **Blocked By**: Tasks 4 (addon API research), 5 (theme registry for resolver import)

  **References**:

  **Pattern References** (existing code to follow):
  - `.storybook/manager.ts:1-2` — Existing SB10 import paths: `storybook/manager-api` and `storybook/theming/create`. The addon MUST use these same import paths, NOT `@storybook/manager-api`
  - `.storybook/manager.ts:40-42` — `addons.setConfig({ theme })` — shows how addons are configured in this project. Keep this existing config; the new addon registration is separate
  - `.storybook/preview.tsx:36-44` — Current `withThemeByDataAttribute` usage being REPLACED. Understand what it does (sets `data-azure-theme` on `<html>`) to ensure new globals approach replicates the behavior
  - `.storybook/main.ts:5-9` — Addons array to modify: remove `@storybook/addon-themes`, add local addon path

  **API/Type References**:
  - `.sisyphus/evidence/task-4-addon-api-research.md` — **PRIMARY API REFERENCE**. Contains verified SB10 addon API: `addons.register`, `addons.add`, `types.TOOL`, `useGlobals()`, toolbar item types. USE THIS, not external docs
  - `src/themes/themeRegistry.ts:getThemeRegistrySnapshot` — Optional: could import to dynamically build product list (but hardcoded list in constants.ts is simpler and avoids cross-context import issues)

  **External References**:
  - Storybook 10 addon docs (verify against installed types, not docs): `https://storybook.js.org/docs/addons/writing-addons`

  **WHY Each Reference Matters**:
  - `manager.ts` import paths are AUTHORITATIVE — the addon must match these exact patterns or imports will fail
  - The `withThemeByDataAttribute` code shows what behavior must be preserved (attribute setting) — the new system replaces HOW but not WHAT
  - Task 4 research is the ground truth for API usage — external docs may describe SB7/8 APIs

  **Acceptance Criteria**:
  - [ ] `.storybook/addons/theme-switcher/manager.tsx` exists
  - [ ] `.storybook/addons/theme-switcher/constants.ts` exists
  - [ ] `.storybook/main.ts` has the local addon registered and `@storybook/addon-themes` removed
  - [ ] `npm run dev` starts without errors (Storybook boots)
  - [ ] Two dropdowns visible in the toolbar

  **QA Scenarios:**

  ```
  Scenario: Storybook boots with custom addon
    Tool: Bash
    Preconditions: Addon files created, main.ts updated
    Steps:
      1. Run: npx storybook dev --port 6099 --no-open &
      2. Wait 15s for build completion
      3. Run: curl -s http://localhost:6099 | head -20
      4. Kill the background process
    Expected Result: Storybook responds with HTML (no crash); no "addon registration failed" errors in build output
    Failure Indicators: Build errors mentioning addon; 404 or connection refused
    Evidence: .sisyphus/evidence/task-9-storybook-boot.txt

  Scenario: Toolbar dropdowns render (visual verification deferred to F3)
    Tool: Bash
    Preconditions: Storybook running
    Steps:
      1. Run: grep -r 'addons.register' .storybook/addons/theme-switcher/manager.tsx
      2. Run: grep -r 'addons.add' .storybook/addons/theme-switcher/manager.tsx | wc -l
      3. Run: grep -c 'addon-themes' .storybook/main.ts
    Expected Result: register call exists; 2 addons.add calls (one per dropdown); 0 addon-themes references in main.ts
    Failure Indicators: Missing register/add calls; addon-themes still referenced
    Evidence: .sisyphus/evidence/task-9-addon-structure.txt
  ```

  **Commit**: YES (group with Task 10)
  - Message: `feat(storybook): add two-axis theme switcher toolbar addon`
  - Files: `.storybook/addons/theme-switcher/manager.tsx`, `.storybook/addons/theme-switcher/constants.ts`, `.storybook/main.ts`
  - Pre-commit: `npm run build`

- [x] 10. Refactor Preview Decorator to Use Globals (`.storybook/preview.tsx`)

  **What to do**:
  - Rewrite `.storybook/preview.tsx` to replace the fragile DOM-attribute-based theme selection with Storybook globals:
  - **Remove**:
    - `import { withThemeByDataAttribute } from '@storybook/addon-themes'`
    - The `withThemeByDataAttribute({...})` decorator call
  - **Add imports**:
    - `import './addons/theme-switcher/constants'` or inline the global key names
    - `import { resolveTheme } from '../src/themes/themeRegistry'`
    - `import '../src/themes/products'` (side-effect: registers themes)
    - `import type { AppearanceMode } from '../src/themes/types'`
  - **New decorator** (replaces both the `withThemeByDataAttribute` and the FluentProvider decorator):
    ```tsx
    (Story, context) => {
      const productId = context.globals.productTheme || 'azure';
      const appearance = (context.globals.appearanceMode || 'light') as AppearanceMode;
      const theme = resolveTheme(productId, appearance);
      
      // Backward compat: sync data-azure-theme attribute
      document.documentElement.setAttribute('data-azure-theme', appearance);
      
      return (
        <FluentProvider theme={theme}>
          <Story />
        </FluentProvider>
      );
    }
    ```
  - **Add `globalTypes`** to the preview config to set defaults:
    ```tsx
    globalTypes: {
      productTheme: { defaultValue: 'azure' },
      appearanceMode: { defaultValue: 'light' },
    },
    ```
  - **Keep** all existing `parameters` (controls, docs, options, storySort)
  - **Keep** `tags: ['autodocs']`
  - **Keep** `import './preview.css'`
  - **CRITICAL**: After this change, default state (Azure + Light) MUST produce identical rendering to the current behavior. The `data-azure-theme` attribute must still be set for backward compatibility.

  **Must NOT do**:
  - Do NOT remove `data-azure-theme` attribute — maintain backward compat
  - Do NOT change story sort order, autodocs, or any non-theme parameters
  - Do NOT import from `@storybook/addon-themes` (it's being removed)
  - Do NOT change the FluentProvider wrapper — only change how the `theme` prop is derived

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Careful refactoring of a critical file — must preserve all existing behavior while changing the theme resolution mechanism
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Not a design task
    - `playwright`: Browser verification is in Final QA

  **Parallelization**:
  - **Can Run In Parallel**: NO (sequential after Task 9)
  - **Parallel Group**: Wave 3 (after Task 9 completes)
  - **Blocks**: Tasks 13, 14
  - **Blocked By**: Tasks 5 (resolver), 9 (addon globals)

  **References**:

  **Pattern References** (existing code to follow):
  - `.storybook/preview.tsx` (FULL FILE) — This is the file being modified. The executor must preserve ALL existing config (parameters, tags, storySort, css import) while replacing only the decorator and adding globalTypes. Current file is 64 lines.
  - `.storybook/preview.tsx:36-44` — Current `withThemeByDataAttribute` decorator to REMOVE
  - `.storybook/preview.tsx:45-61` — Current FluentProvider decorator to REPLACE with globals-based version
  - `.storybook/addons/theme-switcher/constants.ts` — Global key names (`productTheme`, `appearanceMode`) and defaults (from Task 9)

  **API/Type References**:
  - `src/themes/themeRegistry.ts:resolveTheme` — The function to call: `resolveTheme(productId, appearance) → Theme`
  - `src/themes/types.ts:AppearanceMode` — Type for the appearance parameter
  - `context.globals` — Storybook's globals object, set by useGlobals in the toolbar addon

  **WHY Each Reference Matters**:
  - The FULL preview.tsx must be understood because partial edits can break story sort or autodocs
  - The current decorators show exactly what behavior to preserve (FluentProvider wrapping, theme selection)
  - Constants from Task 9 ensure global key names match between manager and preview

  **Acceptance Criteria**:
  - [ ] `withThemeByDataAttribute` removed from decorators and imports
  - [ ] `@storybook/addon-themes` not imported anywhere in preview.tsx
  - [ ] New decorator reads from `context.globals.productTheme` and `context.globals.appearanceMode`
  - [ ] `data-azure-theme` attribute still set on document element
  - [ ] `globalTypes` with defaults defined in preview config
  - [ ] `npm run dev` starts and stories render correctly

  **QA Scenarios:**

  ```
  Scenario: Preview no longer uses addon-themes
    Tool: Bash
    Preconditions: preview.tsx refactored
    Steps:
      1. Run: grep 'addon-themes' .storybook/preview.tsx
      2. Run: grep 'withThemeByDataAttribute' .storybook/preview.tsx
    Expected Result: Both greps return no matches (exit code 1)
    Failure Indicators: Either pattern still present
    Evidence: .sisyphus/evidence/task-10-no-addon-themes.txt

  Scenario: Globals and resolver integrated
    Tool: Bash
    Preconditions: preview.tsx refactored
    Steps:
      1. Run: grep 'resolveTheme' .storybook/preview.tsx
      2. Run: grep 'context.globals' .storybook/preview.tsx
      3. Run: grep 'data-azure-theme' .storybook/preview.tsx
      4. Run: grep 'globalTypes' .storybook/preview.tsx
    Expected Result: All 4 patterns present
    Failure Indicators: Any pattern missing
    Evidence: .sisyphus/evidence/task-10-globals-integration.txt
  ```

  **Commit**: YES (group with Task 9)
  - Message: `feat(storybook): add two-axis theme switcher toolbar addon`
  - Files: `.storybook/preview.tsx`
  - Pre-commit: `npm run build`

- [x] 11. Update Package Exports (`src/themes/index.ts`, `src/index.ts`)

  **What to do**:
  - Update `src/themes/index.ts` to export the new theme system:
    ```ts
    // Existing exports (keep for backward compat)
    export { azureBrand, azureLightTheme, azureDarkTheme, azureHighContrastTheme } from './azureThemes';
    
    // New theme system exports
    export type { ProductThemeDefinition, AppearanceMode, ThemeRegistry, ResolvedThemeResult } from './types';
    export { resolveTheme, registerProductTheme, getAllProductThemes, getProductTheme, getThemeRegistrySnapshot } from './themeRegistry';
    export { azureProductTheme } from './products/azure';
    export { logicAppsProductTheme } from './products/logic-apps';
    ```
  - Verify `src/index.ts` already re-exports via `export * from './themes'` (it does — no changes needed there)
  - Run `npm run build:lib` to verify tsup packages the new exports correctly
  - Check that `dist/index.js` or `dist/index.mjs` includes the new exports

  **Must NOT do**:
  - Do NOT remove existing exports (azureBrand, azureLightTheme, etc.) — they are the public API
  - Do NOT modify `src/index.ts` unless the barrel re-export doesn't cover the new additions
  - Do NOT change tsup.config.ts

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single file update adding export lines to an existing barrel file
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 9, 12)
  - **Blocks**: Task 13 (build verification)
  - **Blocked By**: Tasks 5 (themeRegistry), 6 (azure product theme)

  **References**:

  **Pattern References** (existing code to follow):
  - `src/themes/index.ts` — Current single-line barrel: `export { azureBrand, azureLightTheme, azureDarkTheme, azureHighContrastTheme } from './azureThemes'`. New exports are APPENDED, existing line stays
  - `src/index.ts:10-11` — `export * from './themes'` — confirms themes barrel is already re-exported. No changes needed here
  - `tsup.config.ts` — Build config determining what gets packaged. Verify entry point includes themes

  **API/Type References**:
  - `src/themes/types.ts` — Types to re-export
  - `src/themes/themeRegistry.ts` — Functions to re-export
  - `src/themes/products/azure.ts` — `azureProductTheme` to re-export
  - `src/themes/products/logic-apps.ts` — `logicAppsProductTheme` to re-export

  **WHY Each Reference Matters**:
  - The existing export line MUST be preserved verbatim — consumers depend on `azureLightTheme` etc.
  - The `export *` in `src/index.ts` means adding to `src/themes/index.ts` automatically exposes to package consumers

  **Acceptance Criteria**:
  - [ ] `src/themes/index.ts` exports all new types and functions
  - [ ] Existing `azureBrand`, `azureLightTheme`, `azureDarkTheme`, `azureHighContrastTheme` exports preserved
  - [ ] `npx tsc --noEmit` passes
  - [ ] `npm run build:lib` succeeds

  **QA Scenarios:**

  ```
  Scenario: All exports present in barrel file
    Tool: Bash
    Preconditions: src/themes/index.ts updated
    Steps:
      1. Run: grep -c 'export' src/themes/index.ts
      2. Run: grep 'resolveTheme\|registerProductTheme\|ProductThemeDefinition\|AppearanceMode' src/themes/index.ts
      3. Run: grep 'azureLightTheme' src/themes/index.ts
    Expected Result: Multiple export lines; all new names present; existing azureLightTheme preserved
    Failure Indicators: Missing exports; existing exports removed
    Evidence: .sisyphus/evidence/task-11-exports.txt

  Scenario: Library builds with new exports
    Tool: Bash
    Preconditions: exports updated
    Steps:
      1. Run: npm run build:lib
    Expected Result: Exit code 0; dist/ directory updated
    Failure Indicators: Build error; missing dist/ files
    Evidence: .sisyphus/evidence/task-11-build-lib.txt
  ```

  **Commit**: YES
  - Message: `feat(exports): expose theme registry and resolver in package`
  - Files: `src/themes/index.ts`
  - Pre-commit: `npm run build:lib`

- [x] 12. Update LLM Bundle Generation (`scripts/generate-llm-bundle.ts`, `llm-context/azure-theme.md`)

  **What to do**:
  - **Update `scripts/generate-llm-bundle.ts`**:
    - Add a new section (section 6) after the bundle build (around line 82) that adds theme registry data to the bundle:
      ```ts
      // 6. Theme registry
      const themeRegistry = {
        products: [
          { id: 'azure', displayName: 'Azure', description: 'Default Azure Portal theme' },
          { id: 'logic-apps', displayName: 'Logic Apps', description: 'Azure Logic Apps workflow automation product theme (placeholder tokens)' },
        ],
        appearances: ['light', 'dark', 'high-contrast'],
        resolver: 'resolveTheme(productId, appearanceMode) → Theme',
        note: 'Import from @azure-fluent-storybook/components: { resolveTheme, registerProductTheme }',
      };
      ```
    - Add `themeRegistry` to the bundle object
    - Bump `version` from `'1.0.0'` to `'2.0.0'`
    - Add theme registry stats to the summary output
    - **Alternative approach**: Instead of hardcoding, import `getThemeRegistrySnapshot` from the theme system — BUT this requires tsx to resolve project source. If import is complex, hardcode the data (it changes infrequently)
  - **Update `llm-context/azure-theme.md`**:
    - Add a section documenting the new two-axis theme system:
      - How to use `resolveTheme(productId, appearance)`
      - Available products and appearances
      - How to add a new product theme (create file in `src/themes/products/`, follow pattern)
      - Note about MCP consumption via `llm-context-bundle.json` theme registry
  - Run `npm run build:llm` to verify bundle generates correctly

  **Must NOT do**:
  - Do NOT restructure the existing bundle format — only ADD the `themeRegistry` field
  - Do NOT remove or modify existing sections (registry, componentDocs, context, guidelines)
  - Do NOT create a new `llm-context/` markdown file — update the existing `azure-theme.md`

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Two files to modify with different concerns (script logic + markdown documentation). Must understand existing bundle format
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `writing`: The markdown update is small and technical, not prose-heavy

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 9, 11)
  - **Blocks**: Task 13 (build verification)
  - **Blocked By**: Task 5 (needs theme registry to exist for accurate data)

  **References**:

  **Pattern References** (existing code to follow):
  - `scripts/generate-llm-bundle.ts:82-90` — The bundle object construction. Add `themeRegistry` alongside existing `registry`, `componentDocs`, `context`, `guidelines` fields
  - `scripts/generate-llm-bundle.ts:84-85` — `version: '1.0.0'` — bump to `'2.0.0'`
  - `scripts/generate-llm-bundle.ts:92-102` — Output and summary print statements. Add theme registry stats
  - `llm-context/azure-theme.md` — Current theme documentation. Append new section at end

  **API/Type References**:
  - `src/themes/themeRegistry.ts:getThemeRegistrySnapshot` — If importing dynamically, this returns `{ id, displayName, description }[]`. If hardcoding, match this shape
  - Bundle JSON schema: `{ generatedAt, version, registry, componentDocs, context, guidelines, themeRegistry }` — the new field

  **WHY Each Reference Matters**:
  - Lines 82-90 show the exact insertion point and object shape to extend
  - The version bump (1.0.0 → 2.0.0) signals breaking schema change to consumers
  - `azure-theme.md` is read by LLMs via the bundle — it must document the new system for AI consumption

  **Acceptance Criteria**:
  - [ ] `scripts/generate-llm-bundle.ts` includes `themeRegistry` in bundle object
  - [ ] Bundle version bumped to `'2.0.0'`
  - [ ] `npm run build:llm` exits 0
  - [ ] Generated `public/llm-context-bundle.json` contains `themeRegistry` field
  - [ ] `llm-context/azure-theme.md` documents the two-axis theme system

  **QA Scenarios:**

  ```
  Scenario: Bundle generates with theme registry
    Tool: Bash
    Preconditions: generate-llm-bundle.ts updated
    Steps:
      1. Run: npm run build:llm
      2. Run: node -e "const b = JSON.parse(require('fs').readFileSync('public/llm-context-bundle.json','utf8')); console.log('version:', b.version); console.log('hasThemeRegistry:', !!b.themeRegistry); console.log('products:', b.themeRegistry?.products?.length ?? 0)"
    Expected Result: Exit 0; version: 2.0.0; hasThemeRegistry: true; products: 2
    Failure Indicators: Build error; version still 1.0.0; themeRegistry missing; products count wrong
    Evidence: .sisyphus/evidence/task-12-llm-bundle.txt

  Scenario: Theme docs updated
    Tool: Bash
    Preconditions: azure-theme.md updated
    Steps:
      1. Run: grep -c 'resolveTheme\|productTheme\|AppearanceMode' llm-context/azure-theme.md
    Expected Result: 3+ matches (new system documented)
    Failure Indicators: 0 matches (docs not updated)
    Evidence: .sisyphus/evidence/task-12-theme-docs.txt
  ```

  **Commit**: YES
  - Message: `feat(llm): add theme registry to LLM context bundle v2.0.0`
  - Files: `scripts/generate-llm-bundle.ts`, `llm-context/azure-theme.md`
  - Pre-commit: `npm run build:llm`

- [ ] 13. Full Build Regression Verification

  **What to do**:
  - Run ALL build commands in sequence and verify each succeeds:
    1. `npx tsc --noEmit` — Full TypeScript type check
    2. `npm run lint` — ESLint check (no new errors introduced)
    3. `npx vitest run` — All unit tests pass
    4. `npm run build` — Storybook static site builds (creates `storybook-static/`)
    5. `npm run build:lib` — tsup library package builds (creates `dist/`)
    6. `npm run build:llm` — LLM context bundle generates (creates `public/llm-context-bundle.json`)
  - Verify outputs:
    - `storybook-static/` directory exists and contains `index.html`
    - `dist/` directory contains `.js` and/or `.mjs` files with theme exports
    - `public/llm-context-bundle.json` exists and has `version: '2.0.0'`
  - If ANY build fails, diagnose and fix the issue (may require coordination with the task that introduced the break)

  **Must NOT do**:
  - Do NOT change any source files unless fixing a genuine build regression
  - Do NOT skip any build command — ALL must pass

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Running commands and verifying output — no creative work
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (runs after all Wave 3 tasks)
  - **Parallel Group**: Wave 4 (with Task 14)
  - **Blocks**: F1-F4 (Final Verification)
  - **Blocked By**: Tasks 10, 11, 12 (all integration complete)

  **References**:

  **Pattern References**:
  - `package.json:29-44` — All build scripts defined here. Execute each one
  - `tsup.config.ts` — Library build config; verify dist output includes theme registry exports

  **WHY Each Reference Matters**:
  - package.json defines the exact script names and what they run
  - tsup.config.ts determines what gets packaged — if theme exports don't appear in dist, this config needs checking

  **Acceptance Criteria**:
  - [ ] `npx tsc --noEmit` exits 0
  - [ ] `npm run lint` exits 0 (or only pre-existing warnings)
  - [ ] `npx vitest run` exits 0 with all tests passing
  - [ ] `npm run build` exits 0, `storybook-static/index.html` exists
  - [ ] `npm run build:lib` exits 0, `dist/` contains output files
  - [ ] `npm run build:llm` exits 0, `public/llm-context-bundle.json` has version 2.0.0

  **QA Scenarios:**

  ```
  Scenario: All builds pass
    Tool: Bash
    Preconditions: All implementation tasks complete (Wave 1-3)
    Steps:
      1. Run: npx tsc --noEmit && echo 'TSC_OK'
      2. Run: npx vitest run && echo 'VITEST_OK'
      3. Run: npm run build && echo 'BUILD_OK'
      4. Run: npm run build:lib && echo 'BUILDLIB_OK'
      5. Run: npm run build:llm && echo 'BUILDLLM_OK'
    Expected Result: All 5 commands exit 0; all OK markers printed
    Failure Indicators: Any non-zero exit code; error output
    Evidence: .sisyphus/evidence/task-13-build-regression.txt

  Scenario: Output artifacts exist
    Tool: Bash
    Preconditions: All builds passed
    Steps:
      1. Run: ls storybook-static/index.html
      2. Run: ls dist/
      3. Run: node -e "const b = JSON.parse(require('fs').readFileSync('public/llm-context-bundle.json','utf8')); console.log(b.version)"
    Expected Result: index.html exists; dist/ has files; version prints '2.0.0'
    Failure Indicators: File not found; empty dist; wrong version
    Evidence: .sisyphus/evidence/task-13-artifacts.txt
  ```

  **Commit**: YES (group with Task 14 if both pass)
  - Message: `chore: verify full build + Chromatic regression`
  - Files: — (no source changes unless fix needed)
  - Pre-commit: `npm run build:all`

- [ ] 14. Chromatic Visual Regression Setup for Theme Matrix

  **What to do**:
  - Configure Chromatic to capture visual snapshots across the product × appearance matrix (6 combinations):
    - Azure + Light, Azure + Dark, Azure + High Contrast
    - Logic Apps + Light, Logic Apps + Dark, Logic Apps + High Contrast
  - **Approach**: Use Storybook's `globalTypes` + Chromatic's `modes` feature:
    - In `.storybook/preview.tsx` (or a new `.storybook/modes.ts`), define Chromatic modes:
      ```ts
      parameters: {
        chromatic: {
          modes: {
            'azure-light': { globals: { productTheme: 'azure', appearanceMode: 'light' } },
            'azure-dark': { globals: { productTheme: 'azure', appearanceMode: 'dark' } },
            'azure-hc': { globals: { productTheme: 'azure', appearanceMode: 'high-contrast' } },
            'logicapps-light': { globals: { productTheme: 'logic-apps', appearanceMode: 'light' } },
            'logicapps-dark': { globals: { productTheme: 'logic-apps', appearanceMode: 'dark' } },
            'logicapps-hc': { globals: { productTheme: 'logic-apps', appearanceMode: 'high-contrast' } },
          },
        },
      },
      ```
  - **IMPORTANT**: Adding 6 modes multiplies snapshot count by 6. This may exceed Chromatic plan limits.
    - If plan limits are a concern, limit to a subset of stories (e.g., only Foundations/Colors + 1 component)
    - Use `chromatic: { modes: ... }` at the story level instead of global level if selective
  - Verify with a dry run: `npm run chromatic -- --dry-run` (if supported) or check build output
  - **Alternative if Chromatic modes not supported in this version**: Create a script that generates story variants per theme combination, or use Storybook's `play` function approach. Research the Chromatic docs for the correct approach for the installed version.

  **Must NOT do**:
  - Do NOT modify any story files in `src/stories/`
  - Do NOT create duplicate stories for each theme — use Chromatic modes or globals
  - Do NOT run the actual `npm run chromatic` against the service (costs money) — verify the CONFIG is correct

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Chromatic modes API may be version-specific; requires research + careful config that affects CI costs
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `playwright`: Not browser testing; Chromatic is a separate service

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Task 13)
  - **Blocks**: F3 (Final QA needs theme matrix to work)
  - **Blocked By**: Task 10 (preview decorator must use globals for modes to work)

  **References**:

  **Pattern References** (existing code to follow):
  - `.storybook/preview.tsx` — Where `parameters` object lives. Chromatic modes are added to `parameters.chromatic.modes`
  - `package.json` — `chromatic` script: `npx chromatic --project-token=...`. Check Chromatic version installed

  **External References**:
  - Chromatic modes docs: `https://www.chromatic.com/docs/modes/` — How to configure global modes for multi-theme snapshots
  - Chromatic pricing: Be aware that 6× snapshot multiplication affects costs

  **WHY Each Reference Matters**:
  - `preview.tsx` parameters section is where Chromatic modes MUST be configured — wrong location = modes ignored
  - Chromatic version determines which modes API is available

  **Acceptance Criteria**:
  - [ ] Chromatic modes configured for all 6 product × appearance combinations
  - [ ] Configuration is in `.storybook/preview.tsx` parameters
  - [ ] `npm run build` still succeeds (Storybook builds with modes config)
  - [ ] No story files modified

  **QA Scenarios:**

  ```
  Scenario: Chromatic modes configured
    Tool: Bash
    Preconditions: preview.tsx updated with chromatic modes
    Steps:
      1. Run: grep -c 'modes' .storybook/preview.tsx
      2. Run: grep 'azure-light\|azure-dark\|azure-hc\|logicapps-light\|logicapps-dark\|logicapps-hc' .storybook/preview.tsx | wc -l
    Expected Result: modes key present; 6 mode definitions found
    Failure Indicators: modes missing; fewer than 6 modes
    Evidence: .sisyphus/evidence/task-14-chromatic-modes.txt

  Scenario: Storybook still builds with modes config
    Tool: Bash
    Preconditions: Chromatic modes added
    Steps:
      1. Run: npm run build
    Expected Result: Exit code 0
    Failure Indicators: Build error
    Evidence: .sisyphus/evidence/task-14-build-check.txt
  ```

  **Commit**: YES (group with Task 13)
  - Message: `chore: verify full build + Chromatic regression`
  - Files: `.storybook/preview.tsx` (chromatic modes only)
  - Pre-commit: `npm run build`

---

## Final Verification Wave

> 4 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [ ] F1. **Plan Compliance Audit** — `oracle`
      Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in `.sisyphus/evidence/`. Compare deliverables against plan.
      Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
      Run `npx tsc --noEmit` + `npm run lint` + `npx vitest run`. Review all changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names.
      Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Tests [N pass/N fail] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
      Start Storybook from clean state. Verify: both dropdowns render, default is Azure+Light, switching Product updates preview, switching Appearance updates preview, all 6 combinations work (Azure×3 + LogicApps×3), existing stories render without errors, theme persists across story navigation. Save screenshots to `.sisyphus/evidence/final-qa/`.
      Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
      For each task: read "What to do", read actual diff (git log/diff). Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance. Detect cross-task contamination. Flag unaccounted changes.
      Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

| Task(s) | Commit Message                                                      | Files                                                                | Pre-commit Check    |
| ------- | ------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------- |
| 1       | `feat(themes): add product theme type system`                       | `src/themes/types.ts`                                                | `npx tsc --noEmit`  |
| 2       | `chore(test): set up vitest with React environment`                 | `vitest.config.ts`, `package.json`                                   | `npx vitest run`    |
| 3       | `docs: fix Storybook version references (8.5 → 10.x)`               | `README.md`, `.copilot-instructions.md`                              | —                   |
| 5, 6, 7 | `feat(themes): add theme registry with Azure + Logic Apps products` | `src/themes/themeRegistry.ts`, `src/themes/products/`                | `npx tsc --noEmit`  |
| 8       | `test(themes): add theme resolution unit tests`                     | `src/themes/__tests__/`                                              | `npx vitest run`    |
| 9, 10   | `feat(storybook): add two-axis theme switcher toolbar addon`        | `.storybook/addons/`, `.storybook/preview.tsx`, `.storybook/main.ts` | `npm run build`     |
| 11      | `feat(exports): expose theme registry and resolver in package`      | `src/themes/index.ts`, `src/index.ts`                                | `npm run build:lib` |
| 12      | `feat(llm): add theme registry to LLM context bundle v2.0.0`        | `scripts/generate-llm-bundle.ts`, `llm-context/azure-theme.md`       | `npm run build:llm` |
| 13, 14  | `chore: verify full build + Chromatic regression`                   | —                                                                    | `npm run build:all` |

---

## Success Criteria

### Verification Commands

```bash
npx vitest run                    # Expected: All tests pass (theme resolution: 6+ tests)
npm run build                     # Expected: Exit 0, storybook-static/ created
npm run build:lib                 # Expected: Exit 0, dist/ with theme exports
npm run build:llm                 # Expected: Exit 0, bundle v2.0.0 with themes
npm run lint                      # Expected: No new errors
npx tsc --noEmit                  # Expected: No type errors
```

### Final Checklist

- [ ] Two toolbar dropdowns render (Product + Appearance)
- [ ] Default state = Azure + Light (identical to pre-change behavior)
- [ ] All 6 theme combinations produce correct FluentProvider themes
- [ ] Azure product themes produce byte-identical tokens to existing themes
- [ ] Logic Apps theme has clearly marked placeholder tokens
- [ ] `data-azure-theme` attribute maintained for backward compat
- [ ] No stories modified
- [ ] No components modified
- [ ] LLM bundle v2.0.0 includes theme registry
- [ ] vitest passes all tests
- [ ] All builds succeed
- [ ] Chromatic detects new theme snapshots

---

## Future Considerations (Out of Scope — Architectural Intent Only)

> **Do NOT implement any of this in the current plan.** This section exists so future
> developers and agents understand the extensibility vision behind the architecture choices.

### Product-Specific Component Extensions

The theme system is designed as the **anchor point for a product's identity** in this ecosystem.
In the future, certain products may need **custom components** on top of the shared base set —
for example, a workflow canvas for Logic Apps or a policy editor for API Management.

The envisioned model is **layered extensibility**:

1. **Layer 1 (this plan)**: Product themes as developer-built token sets. Every product gets the
   same shared component library, re-skinned via its product theme. Themes are .ts files checked
   into main and bundled eagerly.

2. **Layer 2 (future)**: Products that need bespoke components could get a "mini storybook" or
   component extension module that builds on top of the shared base + their product theme. This
   might manifest as product-scoped story directories, additional component packages, or a
   product registration that includes `customComponents` alongside its `ProductThemeDefinition`.

The `ProductThemeDefinition` type and registry pattern were chosen with this in mind — the
registry can be extended with additional metadata (component manifests, story paths, etc.)
without breaking the token-only theme system built in this plan.

**Key constraint**: Product themes are always developer/designer-created artifacts merged via PR.
End-users select themes from the toolbar but never create them. If a consuming team needs
further customization on top of a product theme, that's a separate concern (potentially their
own mini storybook) — not handled by this base system.
