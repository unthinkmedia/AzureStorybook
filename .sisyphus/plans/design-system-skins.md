# Design System Skins — Third Theming Axis

## TL;DR

> **Quick Summary**: Add "Design System" as a third theming axis alongside Product Theme and Appearance Mode. Five skins (Fluent 2, Coherence, Ibiza, Fluent 1, Azure Fluent) approximate each era's visual style using Fluent v9 token overrides only — no legacy library imports. Full hardcoded value cleanup across 22 component files.
>
> **Deliverables**:
>
> - `DesignSystemSkin` type system with structured sections
> - Skin registry + 5 skin definition files
> - `resolveTheme()` extended to 3-axis composition
> - Third Storybook toolbar dropdown
> - SRE Agent product theme refactored to brand-identity-only
> - Hardcoded px/hex cleanup across 22 component files
> - Chromatic modes updated to curated 6-mode subset
> - TDD tests for layering, validation, completeness
>
> **Estimated Effort**: Large (3d+)
> **Parallel Execution**: YES — 4 waves + final verification
> **Critical Path**: Types+Contracts → Registry+Composer → Skin Authoring → Hardcoded Cleanup → Closure

---

## Context

### Original Request

User wants Azure Storybook to support toggling between design system eras. Not every product uses Fluent 2 — some are on Coherence, Ibiza, Fluent 1, or Azure Fluent. The skins should approximate each era's visual style using only token overrides so devs can "toggle from fluent 1 -> fluent 2 and automagically see the update." All dynamic values must use tokens — "NO HARD VALUES on ANY of the dynamic elements!!!"

### Interview Summary

**Key Discussions**:

- 5 separate skins (not merged) — devs identify with specific era names
- Oracle recommended Option C: true third axis with structured skin sections
- Composition order: `appearance base → design-system skin → product overrides`
- SRE Agent needs refactoring — structural tokens (borderRadius, spacing, strokeWidth, fontWeight) move to skin layer
- Full hardcoded cleanup scope — all 22 component files, 296+ px + 30+ hex values
- TDD approach — Vitest infrastructure already exists
- Must NOT override parallel agentation work (coordinate on `preview.tsx`)
- Layout constants (context pane widths 315/585/855/1125px) exempt from token mandate
- SVG gradient colors are documented exceptions
- Skin fidelity = "recognizable era, not pixel-perfect"

**Research Findings**:

- Oracle confirmed color+radius+shadow alone NOT enough — spacing+typography needed for Ibiza/Coherence fidelity
- 220+ Coherence reference tokens in `coherenceTokens.ts` (manual reference for authoring, not consumed programmatically)
- Historical era characteristics mapped (see reference table below)
- Fluent v9 `Theme` type is flat (all tokens at top level) — spread merge works for composition

### Metis Review

**Identified Gaps** (addressed):

- `azureThemes.ts` exports must not change behavior → snapshot test before any refactoring
- SRE Agent structural token migration must happen before skin authoring (dependency)
- Semantic token naming convention must be defined before token creation
- `preview.css` backgrounds need CSS custom properties, not component tokens
- Chromatic limited to curated 6-mode subset (matching current mode count)
- Product always wins over skin in composition — document explicitly
- `coherenceTokens.ts` stays as reference; skins authored manually using it as guide
- SVG gradient colors in components are exceptions — document them
- `azureThemes.ts` backward-compatible exports must be pinned with snapshots

---

## Work Objectives

### Core Objective

Extend the theme system from 2 axes (Product × Appearance) to 3 axes (Product × Appearance × Design System) with 5 era-specific skins, while cleaning up all hardcoded values to use tokens.

### Concrete Deliverables

- `src/themes/skins/types.ts` — DesignSystemSkin, SkinSections, DesignSystemId types
- `src/themes/skins/fluent2.ts` — Identity skin (passthrough, minimal/no overrides)
- `src/themes/skins/coherence.ts` — Coherence era skin (~40-60 token overrides)
- `src/themes/skins/ibiza.ts` — Ibiza era skin (~40-60 token overrides)
- `src/themes/skins/fluent1.ts` — Fluent 1 era skin (~30-50 token overrides)
- `src/themes/skins/azure-fluent.ts` — Azure Fluent era skin (~30-50 token overrides)
- `src/themes/skins/index.ts` — Skin registry barrel
- Updated `src/themes/types.ts` — Extended with DesignSystemSkin; ResolvedThemeResult gains skinId
- Updated `src/themes/themeRegistry.ts` — resolveTheme gains optional 3rd param
- Updated `src/themes/products/sre-agent.ts` — Brand identity only, structural tokens removed
- Updated `.storybook/addons/theme-switcher/constants.ts` — DESIGN_SYSTEM_GLOBAL + DESIGN_SYSTEMS list
- Updated `.storybook/addons/theme-switcher/manager.tsx` — Third dropdown component
- Updated `.storybook/preview.tsx` — designSystem global + 3-axis resolveTheme call
- Updated `.storybook/preview.css` — CSS custom properties for dark/HC backgrounds
- Updated 22 component files — all hardcoded px/hex replaced with existing Fluent v9 tokens (closest match with comments where inexact)
- TDD tests for resolveTheme layering, skin validation, token completeness
- Updated Chromatic modes (curated 6-mode subset with skin axis)

### Definition of Done

- [ ] `bun run test` passes — all existing + new tests green
- [ ] `bun run build` succeeds — zero TypeScript errors
- [ ] `bun run lint` clean — zero ESLint errors
- [ ] All 5 skins registered and selectable in Storybook toolbar
- [ ] Switching skins produces visibly different component rendering
- [ ] `resolveTheme('azure', 'light')` with no skin param returns identical output to current
- [ ] Zero hardcoded px/hex in dynamic styling across all 22 component files (layout constants exempt)
- [ ] `azureThemes.ts` legacy exports produce identical values (snapshot test)

### Must Have

- Third dropdown in Storybook toolbar for Design System selection
- All 5 skins with visually distinct characteristics per the historical era table
- Token-only dynamic values — no hardcoded px/hex in component styles
- TDD — tests written before implementation
- Backward compatibility — existing 2-arg resolveTheme calls unchanged
- Product overrides always win over skin overrides in composition

### Must NOT Have (Guardrails)

- No actual legacy library imports (Coherence CDN, Fluent v1 packages, etc.)
- No pixel-perfect reproduction — "recognizable era" fidelity only
- No hardcoded px/hex in component makeStyles (layout constants exempt)
- No new custom token definitions — use existing Fluent v9 tokens only (closest match with comments)
- No Chromatic modes beyond curated 6-mode subset
- No skin selector in DocsContainer sidebar — toolbar only
- No breaking changes to `azureThemes.ts` exports
- No override of agentation-integration work (coordinate on `preview.tsx`)
- No monolithic `Partial<Theme>` blobs — use structured SkinSections
- No skin definitions before DesignSystemSkin type is tested and stable

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.
> Acceptance criteria requiring "user manually tests/confirms" are FORBIDDEN.

### Test Decision

- **Infrastructure exists**: YES (Vitest)
- **Automated tests**: TDD (tests first)
- **Framework**: Vitest (`bun run test`)
- **If TDD**: Each task follows RED (failing test) → GREEN (minimal impl) → REFACTOR

### QA Policy

Every task MUST include agent-executed QA scenarios (see TODO template below).
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright (playwright skill) — Navigate, interact, assert DOM, screenshot
- **TUI/CLI**: Use interactive_bash (tmux) — Run command, send keystrokes, validate output
- **API/Backend**: Use Bash (curl) — Send requests, assert status + response fields
- **Library/Module**: Use Bash (bun/node REPL) — Import, call functions, compare output

### Historical Skin Token Targets (Reference)

| Skin               | Brand Blue | Border Radius | Shadows    | Density       | Base Font |
| ------------------ | ---------- | ------------- | ---------- | ------------- | --------- |
| Ibiza (~2014)      | `#0072C6`  | 0px sharp     | None/flat  | Ultra-compact | 12-13px   |
| Coherence (~2018)  | `#0078D4`  | 2px subtle    | Low        | Compact       | 14px      |
| Fluent 1 (~2020)   | `#0078D4`  | 2px subtle    | Low        | Standard      | 14px      |
| Azure Fluent       | `#0078D4`  | 2px subtle    | Low        | Compact       | 14px      |
| Fluent 2 (current) | `#0f6cbd`  | 4px rounded   | High depth | Spacious      | 14px      |

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 — Guardrails and Contracts (5 tasks):
├── Task 1: Freeze azureThemes legacy behavior with snapshots [quick]
├── Task 2: Lock theme type additions + DesignSystemSkin type contract [deep]
├── Task 5: Add design-system globals to Storybook constants [quick]
│   (1, 2, 5 run in PARALLEL — no dependencies)
├── Task 3: Add failing composition tests for 3-layer precedence [deep] (after 2)
└── Task 4: Refactor SRE Agent to brand/identity-only [deep] (after 3)

Wave 2 — Core Composition and Storybook Plumbing (5 tasks):
├── Task 6: Scaffold skin registry + Fluent 2 identity skin [deep] (after 2)
├── Task 9: Add third toolbar dropdown to Storybook manager [quick] (after 5)
│   (6, 9 run in PARALLEL)
├── Task 7: Implement resolveTheme(productId, appearance, designSystem) [deep] (after 3, 6)
├── Task 8: Thread designSystem through preview.tsx + CSS vars [deep] (after 5, 7)
└── Task 10: Replace hardcoded preview backgrounds with CSS custom props [quick] (after 8)

Wave 3 — Product Normalization and Skin Authoring (5 tasks):
├── Task 11: Refactor Azure product theme to brand/identity-only [deep] (after 7)
│   (11 runs first)
├── Task 12: Author Coherence skin overrides [visual-engineering] (after 4, 6, 11)
├── Task 13: Author Azure Fluent skin overrides [visual-engineering] (after 4, 6, 11)
├── Task 14: Author Ibiza skin overrides [visual-engineering] (after 4, 6, 11)
└── Task 15: Author Fluent 1 skin overrides [visual-engineering] (after 4, 6, 11)
    (12, 13, 14, 15 run in PARALLEL)

Wave 4 — Grouped Cleanup and Closure (5 tasks):
├── Task 16: GROUPED — Cleanup navigation/command-surface hardcodes [visual-engineering]
├── Task 17: GROUPED — Cleanup cards/collection surfaces [visual-engineering]
├── Task 18: GROUPED — Cleanup panels/drawers/dialogs [visual-engineering]
├── Task 19: GROUPED — Cleanup indicators/empty states/decorative [visual-engineering]
│   (16, 17, 18, 19 run in PARALLEL)
└── Task 20: Final regression — Chromatic subset + contract docs + exception ledger [unspecified-high] (after 16-19)

Wave FINAL — Verification (4 parallel review agents):
├── F1: Plan Compliance Audit [oracle]
├── F2: Code Quality Review [unspecified-high]
├── F3: Real Manual QA [unspecified-high + playwright]
└── F4: Scope Fidelity Check [deep]

Critical Path: 1 → 2 → 3 → 4 → 6 → 7 → 11 → 12-15 → 16-19 → 20 → F1-F4
Parallel Speedup: ~60% faster than sequential
Max Concurrent: 5 (Waves 3 & 4 fan-outs)
```

### Dependency Matrix

| Task | Blocked By   | Blocks             |
| ---- | ------------ | ------------------ |
| 1    | —            | 20                 |
| 2    | —            | 3, 6               |
| 3    | 2            | 4, 7               |
| 4    | 3            | 12, 13, 14, 15     |
| 5    | —            | 8, 9               |
| 6    | 2            | 7, 12, 13, 14, 15  |
| 7    | 3, 6         | 8, 11              |
| 8    | 5, 7         | 10, 16, 17, 18, 19 |
| 9    | 5            | —                  |
| 10   | 8            | 20                 |
| 11   | 7            | 12, 13, 14, 15     |
| 12   | 4, 6, 11     | 16, 17, 18, 19     |
| 13   | 4, 6, 11     | 16, 17, 18, 19     |
| 14   | 4, 6, 11     | 16, 17, 18, 19     |
| 15   | 4, 6, 11     | 16, 17, 18, 19     |
| 16   | 8, 12-15     | 20                 |
| 17   | 8, 12-15     | 20                 |
| 18   | 8, 12-15     | 20                 |
| 19   | 8, 12-15     | 20                 |
| 20   | 1, 10, 16-19 | F1-F4              |

### Agent Dispatch Summary

| Wave  | Tasks   | Categories                                                           |
| ----- | ------- | -------------------------------------------------------------------- |
| 1     | 5 tasks | T1 → quick, T2 → deep, T3 → deep, T4 → deep, T5 → quick              |
| 2     | 5 tasks | T6 → deep, T7 → deep, T8 → deep, T9 → quick, T10 → quick             |
| 3     | 5 tasks | T11 → deep, T12-15 → visual-engineering                              |
| 4     | 5 tasks | T16-19 → visual-engineering, T20 → unspecified-high                  |
| FINAL | 4 tasks | F1 → oracle, F2 → unspecified-high, F3 → unspecified-high, F4 → deep |

---

## TODOs

> Implementation + Test = ONE Task. Never separate.
> EVERY task MUST have: Recommended Agent Profile + Parallelization info + QA Scenarios.

### Wave 1 — Guardrails and Contracts

- [ ] 1. Freeze azureThemes Legacy Behavior with Snapshots

  **What to do**:
  - Create `src/themes/__tests__/azureThemes.snapshot.test.ts`
  - Import `azureLightTheme`, `azureDarkTheme`, `azureHighContrastTheme` from `../azureThemes`
  - Write 3 snapshot tests: `expect(azureLightTheme).toMatchSnapshot()` for each
  - Run `bun run test` to generate initial `.snap` file — these become the "before" baseline
  - Verify snapshots capture ALL 60+ light overrides, 2 dark overrides, and full HC output

  **Must NOT do**:
  - Do NOT modify `azureThemes.ts` — only create the test file
  - Do NOT snapshot product theme definitions (those are tested separately)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single test file creation, no logic, copy/snapshot pattern
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**:
    - `playwright`: No browser work needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 5)
  - **Blocks**: Task 20 (final regression needs these snapshots as safety net)
  - **Blocked By**: None — can start immediately

  **References**:
  - `src/themes/azureThemes.ts` — The 3 theme exports to snapshot (`azureLightTheme` lines 37-102, `azureDarkTheme` lines 107-111, `azureHighContrastTheme` line 116)
  - `src/themes/__tests__/themeRegistry.test.ts` — Follow existing Vitest test patterns (import structure, `describe`/`it`/`expect` from `vitest`)
  - Vitest snapshot docs: `toMatchSnapshot()` creates `.snap` file in `__snapshots__/` adjacent to test

  **Acceptance Criteria**:
  - [ ] File exists: `src/themes/__tests__/azureThemes.snapshot.test.ts`
  - [ ] `bun run test src/themes/__tests__/azureThemes.snapshot.test.ts` → PASS (3 tests)
  - [ ] Snapshot file exists: `src/themes/__tests__/__snapshots__/azureThemes.snapshot.test.ts.snap`

  **QA Scenarios**:

  ```
  Scenario: Snapshot tests pass on clean state
    Tool: Bash
    Preconditions: No prior snapshot file exists
    Steps:
      1. Run `bun run test src/themes/__tests__/azureThemes.snapshot.test.ts`
      2. Verify exit code 0
      3. Verify output contains "3 passed"
      4. Verify file exists: src/themes/__tests__/__snapshots__/azureThemes.snapshot.test.ts.snap
      5. Grep snap file for "azureLightTheme" — must contain colorNeutralBackground1: "#ffffff"
    Expected Result: 3 tests pass, snap file generated with full theme objects
    Evidence: .sisyphus/evidence/task-1-snapshot-pass.txt

  Scenario: Snapshot detects mutation
    Tool: Bash
    Preconditions: Snapshots generated from previous step
    Steps:
      1. Temporarily edit azureThemes.ts: change colorNeutralBackground1 from '#ffffff' to '#fefefe'
      2. Run `bun run test src/themes/__tests__/azureThemes.snapshot.test.ts`
      3. Verify exit code non-zero (test failure)
      4. Verify output contains "1 failed" or "Snapshot" mismatch
      5. Revert the edit to azureThemes.ts (restore '#ffffff')
      6. Run test again — verify 3 passed
    Expected Result: Mutation detected by snapshot, reverted cleanly
    Evidence: .sisyphus/evidence/task-1-snapshot-mutation-detect.txt
  ```

  **Commit**: YES (group 1)
  - Message: `test(themes): add legacy snapshots, type contracts, and composition precedence tests`
  - Files: `src/themes/__tests__/azureThemes.snapshot.test.ts`
  - Pre-commit: `bun run test`

---

- [ ] 2. Lock Semantic Token Naming Contract + Theme Type Additions

  **What to do**:
  - Define `DesignSystemId` type: `'fluent2' | 'coherence' | 'ibiza' | 'fluent1' | 'azure-fluent'`
  - Define `SkinSections` interface with structured groups:
    ```
    colors: Partial<Theme>       // Brand/neutral color overrides
    shape: Partial<Theme>        // borderRadius tokens
    elevation: Partial<Theme>    // shadow tokens
    density: Partial<Theme>      // spacing tokens
    typography: Partial<Theme>   // font size/weight/family tokens
    ```
  - Define `DesignSystemSkin` interface: `{ id: DesignSystemId; displayName: string; description: string; sections: SkinSections }`
  - Add helper type `FlattenedSkin = Partial<Theme>` (for the merge result)
  - Add `skinId?: DesignSystemId` to `ResolvedThemeResult`
  - Add these types to `src/themes/types.ts` — keep existing types untouched
  - Write a companion test file `src/themes/__tests__/types.test.ts` verifying type contracts compile (use `expectTypeOf` from vitest)

  **Must NOT do**:
  - Do NOT remove or rename existing types (ProductThemeDefinition, AppearanceMode, etc.)
  - Do NOT create skin files yet — only the types
  - Do NOT use monolithic `Partial<Theme>` for skin definition — use SkinSections

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Type design requires understanding Fluent v9 Theme shape and composition semantics
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**:
    - `playwright`: No browser work

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 5)
  - **Blocks**: Tasks 3, 6 (both depend on these types existing)
  - **Blocked By**: None — can start immediately

  **References**:
  - `src/themes/types.ts` — Current types to extend (ProductThemeDefinition lines 17-47, ResolvedThemeResult lines 60-67)
  - `@fluentui/react-components` `Theme` type — flat record of 600+ string tokens (all at top level, no nesting)
  - `src/themes/products/sre-agent.ts:35-57` — Example of structural tokens (borderRadius, spacing, strokeWidth, fontWeight) that will move to skin layer — informs SkinSections grouping
  - `src/themes/__tests__/themeRegistry.test.ts:1` — Vitest import pattern to follow

  **Acceptance Criteria**:
  - [ ] `DesignSystemId`, `SkinSections`, `DesignSystemSkin`, `FlattenedSkin` types exported from `src/themes/types.ts`
  - [ ] `ResolvedThemeResult.skinId` is optional `DesignSystemId`
  - [ ] `bun run test src/themes/__tests__/types.test.ts` → PASS
  - [ ] `bun run build` → zero TypeScript errors (existing code still compiles)

  **QA Scenarios**:

  ```
  Scenario: New types compile and are exported
    Tool: Bash
    Preconditions: types.ts has been updated
    Steps:
      1. Run `bun run build`
      2. Verify exit code 0, no TypeScript errors
      3. Grep types.ts for "export type DesignSystemId"
      4. Grep types.ts for "export interface SkinSections"
      5. Grep types.ts for "export interface DesignSystemSkin"
      6. Grep types.ts for "skinId?: DesignSystemId" inside ResolvedThemeResult
    Expected Result: All 4 types exported, build clean
    Evidence: .sisyphus/evidence/task-2-types-compile.txt

  Scenario: Existing tests still pass (no regressions)
    Tool: Bash
    Preconditions: types.ts updated, no other changes
    Steps:
      1. Run `bun run test src/themes/__tests__/themeRegistry.test.ts`
      2. Verify exit code 0
      3. Verify output contains "10 passed" (all existing tests)
    Expected Result: Zero regressions — all 10 existing tests pass
    Evidence: .sisyphus/evidence/task-2-no-regression.txt
  ```

  **Commit**: YES (group 1)
  - Message: `test(themes): add legacy snapshots, type contracts, and composition precedence tests`
  - Files: `src/themes/types.ts`, `src/themes/__tests__/types.test.ts`
  - Pre-commit: `bun run test`

---

- [ ] 3. Add Failing Composition Tests for 3-Layer Precedence

  **What to do**:
  - In `src/themes/__tests__/themeRegistry.test.ts`, add a new `describe('3-axis composition')` block
  - Write RED tests (they WILL fail until Task 7 implements the composer):
    1. `resolveTheme('azure', 'light', 'coherence')` returns theme with Coherence-era borderRadius (2px)
    2. `resolveTheme('azure', 'light', 'fluent2')` returns IDENTICAL output to `resolveTheme('azure', 'light')` (identity skin)
    3. `resolveTheme('sre-agent', 'light', 'coherence')` — product overrides (SRE borderRadius) WIN over skin overrides (Coherence borderRadius) — product layer precedence
    4. `resolveTheme('azure', 'dark', 'ibiza')` — appearance base + skin + product all composed correctly
    5. `resolveTheme('azure', 'light')` (2-arg) still works identically — backward compat
  - Mark the new tests with `it.skip` initially since they need Task 6+7 infrastructure — but include a comment `// RED: Enable after Task 7 implements 3-axis resolveTheme`
  - The 2-arg backward compat test should NOT be skipped — it must pass immediately

  **Must NOT do**:
  - Do NOT modify `resolveTheme()` implementation yet
  - Do NOT import skin types that don't exist yet (use `// @ts-expect-error` for forward references)
  - Do NOT remove or modify existing test cases

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Requires understanding 3-layer composition semantics and TDD discipline
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1 sequential (after Task 2)
  - **Blocks**: Tasks 4, 7 (both need composition tests as specification)
  - **Blocked By**: Task 2 (needs DesignSystemId type)

  **References**:
  - `src/themes/__tests__/themeRegistry.test.ts` — Extend this file; follow existing patterns (lines 1-98)
  - `src/themes/themeRegistry.ts:51-91` — Current `resolveTheme` 2-arg signature to extend
  - `src/themes/types.ts` — New `DesignSystemId` type (from Task 2)
  - `src/themes/products/sre-agent.ts:38-41` — SRE borderRadius overrides used to test product-wins-over-skin precedence

  **Acceptance Criteria**:
  - [ ] `src/themes/__tests__/themeRegistry.test.ts` contains `describe('3-axis composition')` with 5 new test cases
  - [ ] The backward-compat test (2-arg call) passes: `bun run test` shows it green
  - [ ] 4 new tests are `it.skip` — they show as "skipped" not "failed"
  - [ ] All 10 existing tests still pass

  **QA Scenarios**:

  ```
  Scenario: New test block exists and existing tests unaffected
    Tool: Bash
    Steps:
      1. Run `bun run test src/themes/__tests__/themeRegistry.test.ts`
      2. Verify output: 11 passed (10 existing + 1 backward-compat), 4 skipped
      3. Grep test file for "3-axis composition" — found
      4. Grep test file for "it.skip" — 4 occurrences
    Expected Result: 11 pass, 4 skip, 0 fail
    Evidence: .sisyphus/evidence/task-3-composition-tests.txt
  ```

  **Commit**: YES (group 1)
  - Files: `src/themes/__tests__/themeRegistry.test.ts`
  - Pre-commit: `bun run test`

---

- [ ] 4. Refactor SRE Agent to Brand/Identity-Only

  **What to do**:
  - Remove structural token overrides from `src/themes/products/sre-agent.ts`:
    - Remove `borderRadiusSmall/Medium/Large/XLarge` from both light and dark overrides
    - Remove `strokeWidthThin/Thick` from both
    - Remove `spacingHorizontalS/M/L` and `spacingVerticalS/M/L` from both
    - Remove `fontWeightSemibold` from both
  - Keep brand ramp (`sreAgentBrand`) and `id`/`displayName`/`description` unchanged
  - Light/dark overrides become empty `{}` or `undefined` (no color overrides existed)
  - Document removed tokens in a comment: `// Structural tokens (borderRadius, spacing, strokeWidth, fontWeight) moved to design-system skin layer — see src/themes/skins/`
  - Update `src/themes/__tests__/themeRegistry.test.ts`:
    - The existing test "SRE Agent applies non-color token overrides" (lines 60-71) now needs updating — SRE Agent no longer has those overrides, so remove or invert assertions
    - Add new test: SRE Agent light theme uses default Fluent borderRadius (not custom)

  **Must NOT do**:
  - Do NOT change the `sreAgentBrand` color ramp
  - Do NOT rename the product ID ('sre-agent')
  - Do NOT remove the product theme from the registry

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Refactoring with test updates — requires understanding what to preserve vs remove
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1 sequential (after Task 3)
  - **Blocks**: Tasks 12, 13, 14, 15 (skin authoring needs SRE Agent structural tokens removed first)
  - **Blocked By**: Task 3 (composition tests define expected behavior)

  **References**:
  - `src/themes/products/sre-agent.ts` — Full file (75 lines); lines 35-57 are the structural overrides to remove
  - `src/themes/__tests__/themeRegistry.test.ts:60-71` — Test asserting SRE structural overrides that needs updating
  - `src/themes/products/azure.ts` — Example of a product theme with only color overrides (the target pattern for SRE Agent after refactor)

  **Acceptance Criteria**:
  - [ ] `sre-agent.ts` has NO borderRadius/spacing/strokeWidth/fontWeight overrides
  - [ ] `sre-agent.ts` still exports `sreAgentProductTheme` with correct brand ramp
  - [ ] `bun run test` → all tests pass (existing test updated, new assertion added)
  - [ ] `bun run build` → zero TypeScript errors

  **QA Scenarios**:

  ```
  Scenario: SRE Agent no longer has structural overrides
    Tool: Bash
    Steps:
      1. Grep sre-agent.ts for "borderRadius" — should NOT be found
      2. Grep sre-agent.ts for "spacing" — should NOT be found
      3. Grep sre-agent.ts for "strokeWidth" — should NOT be found
      4. Grep sre-agent.ts for "fontWeight" — should NOT be found
      5. Grep sre-agent.ts for "sreAgentBrand" — MUST be found (brand preserved)
      6. Run `bun run test` — all pass
    Expected Result: Structural tokens removed, brand preserved, tests green
    Evidence: .sisyphus/evidence/task-4-sre-refactor.txt

  Scenario: SRE Agent theme now uses default Fluent values
    Tool: Bash
    Steps:
      1. Run `bun run test src/themes/__tests__/themeRegistry.test.ts`
      2. Verify output contains assertion that sre-agent light theme borderRadiusMedium equals default Fluent value (not '8px')
    Expected Result: SRE Agent uses stock Fluent structural tokens
    Evidence: .sisyphus/evidence/task-4-sre-defaults.txt
  ```

  **Commit**: YES (group 2)
  - Files: `src/themes/products/sre-agent.ts`, `src/themes/__tests__/themeRegistry.test.ts`
  - Pre-commit: `bun run test`

---

- [ ] 5. Add Design-System Globals to Storybook Constants

  **What to do**:
  - In `.storybook/addons/theme-switcher/constants.ts`:
    - Add `export const DESIGN_SYSTEM_GLOBAL = 'designSystem';`
    - Add `export const DEFAULT_DESIGN_SYSTEM = 'fluent2';`
    - Add list:
      ```typescript
      export const DESIGN_SYSTEMS = [
        { id: 'fluent2', displayName: 'Fluent 2' },
        { id: 'coherence', displayName: 'Coherence' },
        { id: 'ibiza', displayName: 'Ibiza' },
        { id: 'fluent1', displayName: 'Fluent 1' },
        { id: 'azure-fluent', displayName: 'Azure Fluent' },
      ] as const;
      ```
  - These IDs must exactly match the `DesignSystemId` type from Task 2

  **Must NOT do**:
  - Do NOT modify existing globals (PRODUCT_THEME_GLOBAL, APPEARANCE_MODE_GLOBAL)
  - Do NOT modify the manager.tsx yet (Task 9)
  - Do NOT modify preview.tsx yet (Task 8)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple constant additions to an existing file
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2)
  - **Blocks**: Tasks 8, 9 (both need these constants)
  - **Blocked By**: None — can start immediately

  **References**:
  - `.storybook/addons/theme-switcher/constants.ts` — Full file (16 lines); add new exports below existing ones
  - `src/themes/types.ts` — DesignSystemId type values must match IDs in DESIGN_SYSTEMS list

  **Acceptance Criteria**:
  - [ ] `constants.ts` exports `DESIGN_SYSTEM_GLOBAL`, `DEFAULT_DESIGN_SYSTEM`, `DESIGN_SYSTEMS`
  - [ ] DESIGN_SYSTEMS has exactly 5 entries with IDs: fluent2, coherence, ibiza, fluent1, azure-fluent
  - [ ] `bun run build` → zero TypeScript errors

  **QA Scenarios**:

  ```
  Scenario: New constants exist and build passes
    Tool: Bash
    Steps:
      1. Grep constants.ts for "DESIGN_SYSTEM_GLOBAL" — found
      2. Grep constants.ts for "DESIGN_SYSTEMS" — found
      3. Grep constants.ts for "'fluent2'" — found
      4. Grep constants.ts for "'ibiza'" — found
      5. Run `bun run build`
      6. Verify exit code 0
    Expected Result: All constants present, build clean
    Evidence: .sisyphus/evidence/task-5-constants.txt
  ```

  **Commit**: YES (group 3)
  - Message: `feat(storybook): add design-system toolbar dropdown and CSS variable backgrounds`
  - Files: `.storybook/addons/theme-switcher/constants.ts`
  - Pre-commit: `bun run build`

### Wave 2 — Core Composition and Storybook Plumbing

- [ ] 6. Scaffold Skin Registry + Fluent 2 Identity Skin

  **What to do**:
  - Create directory `src/themes/skins/`
  - Create `src/themes/skins/types.ts` — re-export `DesignSystemSkin`, `SkinSections`, `DesignSystemId`, `FlattenedSkin` from `../types` (or define a `flattenSkin(sections: SkinSections): FlattenedSkin` utility that spreads all section partials into one)
  - Create `src/themes/skins/fluent2.ts`:
    ```typescript
    export const fluent2Skin: DesignSystemSkin = {
      id: 'fluent2',
      displayName: 'Fluent 2',
      description: 'Current Fluent v9 baseline — identity skin with no overrides',
      sections: { colors: {}, shape: {}, elevation: {}, density: {}, typography: {} },
    };
    ```
  - Create `src/themes/skins/index.ts` — barrel export + skin registry Map:
    ```typescript
    const skinRegistry = new Map<DesignSystemId, DesignSystemSkin>([['fluent2', fluent2Skin]]);
    export function getSkin(id: DesignSystemId): DesignSystemSkin | undefined { ... }
    export function getAllSkins(): DesignSystemSkin[] { ... }
    export function registerSkin(skin: DesignSystemSkin): void { ... }
    ```
  - Create `src/themes/__tests__/skinRegistry.test.ts`:
    - Test: `getSkin('fluent2')` returns identity skin
    - Test: `flattenSkin(fluent2Skin.sections)` returns empty object `{}`
    - Test: `getAllSkins()` has length 1
    - Test: `registerSkin()` with duplicate throws

  **Must NOT do**:
  - Do NOT create other skin files yet (coherence, ibiza, etc.)
  - Do NOT integrate skins into resolveTheme yet (Task 7)

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Registry pattern design + flattenSkin utility + tests
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 9)
  - **Blocks**: Task 7 (needs skin registry), Tasks 12-15 (need to register skins)
  - **Blocked By**: Task 2 (needs DesignSystemSkin/SkinSections types)

  **References**:
  - `src/themes/types.ts` — DesignSystemSkin, SkinSections types (from Task 2)
  - `src/themes/themeRegistry.ts:16-31` — Product registry pattern to mirror (Map, register, get, getAll)
  - `src/themes/products/azure.ts` — Example of how product definitions are structured
  - `src/themes/__tests__/themeRegistry.test.ts` — Test patterns to follow

  **Acceptance Criteria**:
  - [ ] `src/themes/skins/` directory with `types.ts`, `fluent2.ts`, `index.ts`
  - [ ] `getSkin('fluent2')` returns the identity skin
  - [ ] `flattenSkin(fluent2Skin.sections)` returns `{}` (empty — identity passthrough)
  - [ ] `bun run test src/themes/__tests__/skinRegistry.test.ts` → PASS (4+ tests)
  - [ ] `bun run build` → zero errors

  **QA Scenarios**:

  ```
  Scenario: Skin registry works with identity skin
    Tool: Bash
    Steps:
      1. Run `bun run test src/themes/__tests__/skinRegistry.test.ts`
      2. Verify exit code 0
      3. Verify output: 4+ tests passed
    Expected Result: All skin registry tests pass
    Evidence: .sisyphus/evidence/task-6-skin-registry.txt

  Scenario: flattenSkin produces empty object for identity skin
    Tool: Bash
    Steps:
      1. In skinRegistry.test.ts, verify test asserts: `expect(flattenSkin(fluent2Skin.sections)).toEqual({})`
      2. Run the test — passes
    Expected Result: Identity skin flattens to empty (no overrides)
    Evidence: .sisyphus/evidence/task-6-flatten-identity.txt
  ```

  **Commit**: YES (group 2)
  - Message: `feat(themes): add design-system skin registry and 3-axis resolveTheme`
  - Files: `src/themes/skins/types.ts`, `src/themes/skins/fluent2.ts`, `src/themes/skins/index.ts`, `src/themes/__tests__/skinRegistry.test.ts`
  - Pre-commit: `bun run test`

---

- [ ] 7. Implement resolveTheme(productId, appearance, designSystem)

  **What to do**:
  - Extend `resolveTheme` in `src/themes/themeRegistry.ts` to accept optional 3rd param: `designSystem?: DesignSystemId`
  - Composition order (CRITICAL — this is the architectural decision):
    1. Start with appearance base: `createLightTheme(brand)` / `createDarkTheme(brand)` / `createHighContrastTheme()`
    2. Spread design-system skin overrides: `...flattenSkin(skin.sections)`
    3. Spread product overrides: `...(definition.lightOverrides ?? {})` — **product always wins**
  - When `designSystem` is undefined: skip step 2 (backward compat — identical to current behavior)
  - When `designSystem` is provided: look up skin via `getSkin(designSystem)`, throw if not found
  - Update `ResolvedThemeResult` to include `skinId` when skin is applied
  - Import `getSkin` and `flattenSkin` from `./skins`
  - Un-skip ONLY the composition tests that use skins available after Task 6 (i.e. `fluent2`):
    - Un-skip: `resolveTheme('azure', 'light', 'fluent2')` identity test
    - Un-skip: backward-compat 2-arg test (already active from Task 3)
    - Un-skip: invalid skin ID throws test
    - LEAVE SKIPPED: `coherence`, `ibiza`, and SRE-precedence (`resolveTheme('sre-agent', 'light', 'coherence')`) tests — those skins don't exist yet (created in Tasks 12/14). Add a comment: `// RED: Enable after Tasks 12-15 deliver era skins`

  **Must NOT do**:
  - Do NOT change the 2-arg call path behavior at all
  - Do NOT make designSystem a required parameter
  - Do NOT change import paths of existing consumers
  - Do NOT un-skip tests that reference skins not yet created (coherence, ibiza, etc.)

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Core composition logic — the architectural keystone. Must get spread order exactly right.
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 sequential (after Tasks 3, 6)
  - **Blocks**: Tasks 8, 11 (both need 3-axis resolveTheme)
  - **Blocked By**: Task 3 (composition tests), Task 6 (skin registry)

  **References**:
  - `src/themes/themeRegistry.ts:51-91` — Current `resolveTheme` implementation to extend
  - `src/themes/skins/index.ts` — `getSkin()` and `flattenSkin()` from Task 6
  - `src/themes/types.ts` — `DesignSystemId`, `ResolvedThemeResult` with `skinId`
  - `src/themes/__tests__/themeRegistry.test.ts` — Composition tests from Task 3; un-skip only fluent2 identity + invalid-skin tests (leave coherence/ibiza skipped)
  - Plan section "Composition order": `appearance base → design-system skin → product overrides`

  **Acceptance Criteria**:
  - [ ] `resolveTheme('azure', 'light')` returns identical output to before (backward compat)
  - [ ] `resolveTheme('azure', 'light', 'fluent2')` returns identical output (identity skin)
  - [ ] `resolveTheme('azure', 'light', 'nonexistent' as any)` throws descriptive error
  - [ ] Product overrides win over skin overrides in conflicts (tested once era skins exist)
  - [ ] Fluent2 identity test and backward-compat test un-skipped and passing
  - [ ] Coherence/ibiza/SRE-precedence tests remain `it.skip` with comment referencing Tasks 12-15
  - [ ] `bun run test` → all tests pass (existing + newly-unskipped)

  **QA Scenarios**:

  ```
  Scenario: 2-arg backward compatibility preserved
    Tool: Bash
    Steps:
      1. Run `bun run test src/themes/__tests__/themeRegistry.test.ts`
      2. Verify ALL 10 original tests still pass (not just the new ones)
      3. Specifically verify: resolveTheme('azure', 'light') test passes with colorNeutralBackground1 === '#ffffff'
    Expected Result: All original tests pass unchanged
    Evidence: .sisyphus/evidence/task-7-backward-compat.txt

  Scenario: Fluent2 identity skin and invalid-skin tests un-skipped and passing
    Tool: Bash
    Steps:
      1. Run `bun run test src/themes/__tests__/themeRegistry.test.ts`
      2. Grep output for "skipped" — should show 3 skipped (coherence, ibiza, SRE-precedence tests), NOT 4
      3. Verify fluent2 identity test passes: resolveTheme('azure', 'light', 'fluent2') === resolveTheme('azure', 'light')
      4. Verify invalid skin test passes: resolveTheme('azure', 'light', 'nonexistent') throws
    Expected Result: 13+ tests pass, 3 skipped (coherence/ibiza/SRE-precedence), 0 failed
    Evidence: .sisyphus/evidence/task-7-composition-pass.txt

  Scenario: Skin-dependent tests remain skipped with explanatory comment
    Tool: Bash
    Steps:
      1. Grep `src/themes/__tests__/themeRegistry.test.ts` for `it.skip`
      2. Verify exactly 3 occurrences (coherence, ibiza, SRE-precedence tests)
      3. Grep for "Tasks 12-15" or "era skins" in the skip comment
    Expected Result: 3 it.skip calls with comments explaining they await era skin creation (coherence, SRE-precedence, ibiza)
    Evidence: .sisyphus/evidence/task-7-skipped-skins.txt
  ```

  **Commit**: YES (group 2)
  - Files: `src/themes/themeRegistry.ts`, `src/themes/__tests__/themeRegistry.test.ts`
  - Pre-commit: `bun run test`

---

- [ ] 8. Thread designSystem Through preview.tsx + CSS Vars

  **What to do**:
  - In `.storybook/preview.tsx`:
    - Import `DESIGN_SYSTEM_GLOBAL`, `DEFAULT_DESIGN_SYSTEM` from constants
    - Add `designSystem` global type definition alongside existing product/appearance globals
    - In the decorator: read `context.globals[DESIGN_SYSTEM_GLOBAL]`, default to `DEFAULT_DESIGN_SYSTEM`
    - Pass as 3rd arg: `resolveTheme(productId, appearance, designSystem)`
    - In `CustomDocsContainer`: also read designSystem global and sync to `data-design-system` attribute
  - Update `globalTypes` export to include `designSystem` with default `'fluent2'`
  - **CRITICAL**: Coordinate with agentation-integration plan — check if `preview.tsx` has been modified by that work. If so, merge carefully. Do NOT overwrite their changes.

  **Must NOT do**:
  - Do NOT modify the decorator's FluentProvider pattern
  - Do NOT change how product/appearance globals work
  - Do NOT add skin-specific CSS here (that's Task 10)

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Storybook internals + coordination with parallel work
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 sequential (after Tasks 5, 7)
  - **Blocks**: Task 10 (needs CSS custom properties context), Tasks 16-19 (need designSystem threaded)
  - **Blocked By**: Task 5 (constants), Task 7 (3-axis resolveTheme)

  **References**:
  - `.storybook/preview.tsx` — Full file (166 lines); decorator at lines 146-163, globalTypes at lines 18-27, DocsContainer at lines 29-76
  - `.storybook/addons/theme-switcher/constants.ts` — `DESIGN_SYSTEM_GLOBAL`, `DEFAULT_DESIGN_SYSTEM` from Task 5
  - `src/themes/themeRegistry.ts` — Updated `resolveTheme` 3-arg signature from Task 7
  - `.sisyphus/plans/agentation-integration.md` — Check for conflicts with parallel work on preview.tsx

  **Acceptance Criteria**:
  - [ ] `preview.tsx` reads `designSystem` from globals
  - [ ] `resolveTheme` called with 3 args in decorator
  - [ ] `globalTypes` includes `designSystem` with default `'fluent2'`
  - [ ] `data-design-system` attribute set on document
  - [ ] `bun run build` → zero errors
  - [ ] No conflicts with agentation-integration changes

  **QA Scenarios**:

  ```
  Scenario: designSystem global is wired through preview.tsx
    Tool: Bash
    Steps:
      1. Grep preview.tsx for "DESIGN_SYSTEM_GLOBAL" — found
      2. Grep preview.tsx for "resolveTheme(productId, appearance, designSystem)" — found (3 args)
      3. Grep preview.tsx for "designSystem:" in globalTypes — found
      4. Grep preview.tsx for "data-design-system" — found in DocsContainer
      5. Run `bun run build` — exit code 0
    Expected Result: Global threaded, 3-arg call, data attribute set, build passes
    Evidence: .sisyphus/evidence/task-8-preview-wired.txt

  Scenario: Storybook builds and starts without errors
    Tool: Bash
    Steps:
      1. Run `bun run build` — verify exit code 0, no TypeScript errors
      2. Run `bun run dev &` — verify Storybook starts on port 6006
      3. Run `curl -s http://localhost:6006 | head -20` — verify HTML returned (not error page)
      4. Kill dev server
    Expected Result: Build succeeds, dev server starts, serves valid HTML
    Evidence: .sisyphus/evidence/task-8-storybook-starts.txt
  ```

  > **NOTE**: Full UI verification with 3 dropdowns visible requires Task 9 (toolbar dropdown). That visual QA is covered in Task 9's QA scenarios and Final Verification F3.

  **Commit**: YES (group 3)
  - Files: `.storybook/preview.tsx`
  - Pre-commit: `bun run build`

---

- [ ] 9. Add Third Toolbar Dropdown to Storybook Manager

  **What to do**:
  - In `.storybook/addons/theme-switcher/manager.tsx`:
    - Import `DESIGN_SYSTEM_GLOBAL`, `DEFAULT_DESIGN_SYSTEM`, `DESIGN_SYSTEMS` from constants
    - Create `DesignSystemToolbar` component — follow exact pattern of `ProductThemeToolbar` (lines 13-36):
      - `useGlobals()` to read/write
      - `<label>` with `<span>Design System</span>` + `<select>` mapping `DESIGN_SYSTEMS`
    - Register it: `addons.add(\`${ADDON_ID}/design-system\`, { type: types.TOOL, title: 'Design System', render: () => React.createElement(DesignSystemToolbar) })`

  **Must NOT do**:
  - Do NOT modify existing `ProductThemeToolbar` or `AppearanceModeToolbar` components
  - Do NOT change the ADDON_ID

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Copy existing dropdown pattern, change variable names — straightforward
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 6)
  - **Blocks**: None directly
  - **Blocked By**: Task 5 (needs DESIGN_SYSTEMS constant)

  **References**:
  - `.storybook/addons/theme-switcher/manager.tsx` — Full file (75 lines); `ProductThemeToolbar` pattern at lines 13-36 to replicate
  - `.storybook/addons/theme-switcher/constants.ts` — New constants from Task 5

  **Acceptance Criteria**:
  - [ ] `manager.tsx` contains `DesignSystemToolbar` component
  - [ ] Third dropdown registered with `addons.add`
  - [ ] `bun run build` → zero errors

  **QA Scenarios**:

  ```
  Scenario: Third dropdown component exists and builds
    Tool: Bash
    Steps:
      1. Grep manager.tsx for "DesignSystemToolbar" — found
      2. Grep manager.tsx for "DESIGN_SYSTEM_GLOBAL" — found
      3. Grep manager.tsx for "design-system" in addons.add call — found
      4. Run `bun run build` — exit code 0
    Expected Result: Component exists, registered, builds
    Evidence: .sisyphus/evidence/task-9-toolbar-dropdown.txt
  ```

  **Commit**: YES (group 3)
  - Files: `.storybook/addons/theme-switcher/manager.tsx`
  - Pre-commit: `bun run build`

---

- [ ] 10. Replace Hardcoded Preview Backgrounds with CSS Custom Properties

  **What to do**:
  - In `.storybook/preview.css`:
    - Replace hardcoded `#1f1f1f` and `#000000` background colors with CSS custom properties
    - Add `:root` block defining `--azure-storybook-bg-dark: #1f1f1f; --azure-storybook-bg-hc: #000000;`
    - Use `var(--azure-storybook-bg-dark)` and `var(--azure-storybook-bg-hc)` in the selectors
    - This allows skins to override background colors by setting these custom properties
  - In the preview.tsx decorator (or a helper), set the CSS custom properties based on the active skin:
    - Fluent 2 dark: `#1f1f1f`, Coherence dark: `#1b1a19`, Ibiza dark: `#000000`, etc.
    - Each skin can define its preferred dark/HC backgrounds

  **Must NOT do**:
  - Do NOT remove the `data-azure-theme` attribute mechanism
  - Do NOT change the transparent FluentProvider rule

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple CSS refactor — extract values to custom properties
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 sequential (after Task 8)
  - **Blocks**: Task 20 (final regression)
  - **Blocked By**: Task 8 (needs designSystem threaded to know which skin is active)

  **References**:
  - `.storybook/preview.css` — Full file (27 lines); hardcoded colors at lines 16 and 20
  - `.storybook/preview.tsx` — Decorator where CSS custom properties would be set dynamically

  **Acceptance Criteria**:
  - [ ] `preview.css` uses `var(--azure-storybook-bg-dark)` instead of `#1f1f1f`
  - [ ] `preview.css` uses `var(--azure-storybook-bg-hc)` instead of `#000000`
  - [ ] Default values preserved (light mode still white, dark still #1f1f1f, HC still #000000)
  - [ ] `bun run build` → zero errors

  **QA Scenarios**:

  ```
  Scenario: No hardcoded background colors in preview.css
    Tool: Bash
    Steps:
      1. Grep preview.css for "#1f1f1f" — should NOT be found (except in var fallback)
      2. Grep preview.css for "#000000" — should NOT be found (except in var fallback)
      3. Grep preview.css for "var(--azure-storybook-bg" — found in both dark and HC selectors
      4. Run `bun run build` — exit code 0
    Expected Result: Custom properties replace hardcoded values
    Evidence: .sisyphus/evidence/task-10-css-custom-props.txt
  ```

  **Commit**: YES (group 3)
  - Files: `.storybook/preview.css`, `.storybook/preview.tsx`
  - Pre-commit: `bun run build`

### Wave 3 — Product Normalization and Skin Authoring

- [ ] 11. Refactor Azure Product Theme to Brand/Identity-Only

  **What to do**:
  - In `src/themes/products/azure.ts`:
    - Move the 40+ color overrides from `lightOverrides` into a shared reference constant (e.g., `const azureColorOverrides = { ... }`)
    - Keep `lightOverrides` pointing to `azureColorOverrides` (product colors stay in product layer)
    - The key insight: Azure's overrides are ALL colors (no structural tokens) — so Azure is already brand/identity-only in practice. This task is about documenting that fact and ensuring the overrides don't conflict with skin structural tokens.
    - Add a JSDoc comment clarifying: "Azure product overrides are color-only. Structural tokens (borderRadius, spacing, shadows) come from the design-system skin layer."
  - Verify: Azure's overrides are ALL colors (no structural tokens like borderRadius, spacing). Document with JSDoc that structural tokens come from the skin layer.
  - Add test in `themeRegistry.test.ts`:
    - Azure product colors survive skin application with `fluent2` identity skin (product wins for colors)
    - Azure has no structural overrides, so `fluent2` identity skin passthrough leaves Fluent defaults intact
    - NOTE: Do NOT test with `coherence` skin here — it doesn't exist yet (created in Task 12). Task 12 will verify composition with Coherence.

  **Must NOT do**:
  - Do NOT change the actual color values in Azure overrides
  - Do NOT remove any existing overrides
  - Do NOT change the product ID or displayName

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Requires understanding composition precedence and verifying no behavioral change
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (runs first, before 12-15)
  - **Blocks**: Tasks 12, 13, 14, 15 (skin authoring needs product normalization complete)
  - **Blocked By**: Task 7 (needs 3-axis resolveTheme)

  **References**:
  - `src/themes/products/azure.ts` — Full file (64 lines); all overrides are colors (lines 9-58)
  - `src/themes/themeRegistry.ts` — 3-axis resolveTheme from Task 7
  - `src/themes/__tests__/themeRegistry.test.ts` — Add tests here

  **Acceptance Criteria**:
  - [ ] Azure product theme still produces identical light/dark/HC output for 2-arg calls
  - [ ] Azure color overrides survive when fluent2 identity skin is applied (product wins)
  - [ ] JSDoc comment on azure.ts clarifying color-only nature
  - [ ] No structural tokens (borderRadius, spacing, strokeWidth, fontWeight) in Azure overrides
  - [ ] `bun run test` → all tests pass

  **QA Scenarios**:

  ```
  Scenario: Azure theme unchanged for 2-arg calls
    Tool: Bash
    Steps:
      1. Run `bun run test src/themes/__tests__/azureThemes.snapshot.test.ts`
      2. All 3 snapshot tests pass (no changes detected)
    Expected Result: Azure theme output identical to Task 1 baseline
    Evidence: .sisyphus/evidence/task-11-azure-unchanged.txt

  Scenario: Azure colors preserved with fluent2 identity skin
    Tool: Bash
    Steps:
      1. Run test: resolveTheme('azure', 'light', 'fluent2')
      2. Assert: colorNeutralBackground1 === '#ffffff' (Azure color preserved)
      3. Assert: output is identical to resolveTheme('azure', 'light') (identity skin = no change)
    Expected Result: Azure product + fluent2 identity = same as Azure product alone
    Evidence: .sisyphus/evidence/task-11-azure-identity.txt

  Scenario: Azure overrides contain only color tokens
    Tool: Bash
    Steps:
      1. Grep azure.ts for "borderRadius|spacing|strokeWidth|fontWeight" in override objects
      2. Expected: 0 matches (Azure is color-only)
      3. Grep azure.ts for JSDoc comment mentioning "color-only" or "skin layer"
      4. Expected: comment found
    Expected Result: No structural tokens in Azure overrides; documentation present
    Evidence: .sisyphus/evidence/task-11-color-only-verify.txt
  ```

  **Commit**: YES (group 4)
  - Message: `feat(themes): add 5 design-system skins with era-specific token overrides`
  - Files: `src/themes/products/azure.ts`, `src/themes/__tests__/themeRegistry.test.ts`
  - Pre-commit: `bun run test`

---

- [ ] 12. Author Coherence Skin Overrides

  **What to do**:
  - Create `src/themes/skins/coherence.ts` implementing `DesignSystemSkin`
  - Use `coherenceTokens.ts` (220+ tokens) as a visual reference guide — do NOT import it programmatically
  - Structured sections (target ~40-60 total overrides):
    - **colors**: Azure-style neutral backgrounds/foregrounds, `#0078D4` brand blue
    - **shape**: `borderRadiusMedium: '2px'`, `borderRadiusLarge: '4px'`, `borderRadiusXLarge: '8px'` (subtle rounding)
    - **elevation**: Minimal shadows — `shadow4: '0 0 2px rgba(0,0,0,0.12)'` etc.
    - **density**: Compact spacing — `spacingHorizontalM: '8px'`, `spacingVerticalM: '8px'`
    - **typography**: `fontSizeBase300: '14px'`, `fontFamilyBase: "'Segoe UI', ..."` (unchanged from Fluent default)
  - Register in `src/themes/skins/index.ts`
  - Add test in `src/themes/__tests__/skinRegistry.test.ts`:
    - `getSkin('coherence')` exists
    - `flattenSkin(coherenceSkin.sections)` has expected key count (~40-60)
    - Key visual tokens match Coherence era (borderRadiusMedium === '2px')
  - **Un-skip the Coherence composition test** in `src/themes/__tests__/themeRegistry.test.ts` — change `it.skip` to `it` for the `resolveTheme('azure', 'light', 'coherence')` test. Verify it passes with real Coherence skin overrides applied (e.g., borderRadiusMedium === '2px').
  - **Un-skip the SRE-precedence composition test** — change `it.skip` to `it` for the `resolveTheme('sre-agent', 'light', 'coherence')` test. This test can now run because the coherence skin exists. Verify product overrides (SRE brand color) WIN over skin overrides.

  **Must NOT do**:
  - Do NOT import `coherenceTokens.ts` — it's a reference, not a runtime dependency
  - Do NOT aim for pixel-perfect Coherence — "recognizable era" fidelity
  - Do NOT add dark-mode-specific overrides in sections (skin tokens are appearance-agnostic — they override structural properties like borderRadius, spacing, shadow that don't change between light/dark; the appearance base already handles light vs dark color semantics before skin overrides are applied per the composition order: `appearance base → skin → product`)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Design-era visual fidelity requires understanding of Coherence's visual language
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 13, 14, 15)
  - **Blocks**: Tasks 16-19 (cleanup needs all skins registered)
  - **Blocked By**: Tasks 4, 6, 11

  **References**:
  - `src/themes/coherenceTokens.ts` — 220+ reference tokens from Coherence CDN extraction (READ ONLY — visual reference)
  - `src/themes/skins/fluent2.ts` — Skin file pattern to follow (from Task 6)
  - `src/themes/skins/index.ts` — Register skin here
  - Plan skin token targets table: Coherence row — `#0078D4` brand, 2px radius, low shadow, compact density, 14px font
  - `src/themes/types.ts` — SkinSections interface for structure

  **Acceptance Criteria**:
  - [ ] `src/themes/skins/coherence.ts` exists with all 5 SkinSections populated
  - [ ] Registered in skins/index.ts
  - [ ] `getSkin('coherence')` returns valid skin
  - [ ] `flattenSkin(coherenceSkin.sections)` has 40-60 keys
  - [ ] Key values: `borderRadiusMedium === '2px'`, brand color `#0078D4`
  - [ ] Coherence composition test in themeRegistry.test.ts un-skipped and passing
  - [ ] `bun run test` → all tests pass

  **QA Scenarios**:

  ```
  Scenario: Coherence skin has correct era characteristics
    Tool: Bash
    Steps:
      1. Run `bun run test src/themes/__tests__/skinRegistry.test.ts`
      2. Verify Coherence tests pass — borderRadiusMedium '2px', compact spacing
      3. Grep coherence.ts for "0078D4" — brand color present
    Expected Result: Coherence skin has era-appropriate visual tokens
    Evidence: .sisyphus/evidence/task-12-coherence-skin.txt

  Scenario: Coherence composition test now passes (was skipped)
    Tool: Bash
    Steps:
      1. Run `bun run test src/themes/__tests__/themeRegistry.test.ts`
      2. Verify "skipped" count decreased from 3 to 1 (coherence + SRE-precedence un-skipped — only ibiza remains)
      3. Verify resolveTheme('azure', 'light', 'coherence') test passes with Coherence-era borderRadius
      4. Verify SRE-precedence test passes (product override beats skin for brand color)
    Expected Result: Coherence + SRE-precedence composition tests pass, 1 test still skipped (ibiza)
    Evidence: .sisyphus/evidence/task-12-coherence-composition.txt
  ```

  **Commit**: YES (group 4)
  - Files: `src/themes/skins/coherence.ts`, `src/themes/skins/index.ts`, `src/themes/__tests__/skinRegistry.test.ts`, `src/themes/__tests__/themeRegistry.test.ts`
  - Pre-commit: `bun run test`

---

- [ ] 13. Author Azure Fluent Skin Overrides

  **What to do**:
  - Create `src/themes/skins/azure-fluent.ts` implementing `DesignSystemSkin`
  - Azure Fluent = transitional era between Coherence and Fluent 2. Characteristics:
    - **colors**: Same `#0078D4` brand as Coherence
    - **shape**: `borderRadiusMedium: '2px'` — same subtle rounding as Coherence
    - **elevation**: Slightly more shadow than Coherence — `shadow4: '0 1px 3px rgba(0,0,0,0.12)'`
    - **density**: Compact (same as Coherence) — `spacingHorizontalM: '8px'`
    - **typography**: Same as Coherence — `fontSizeBase300: '14px'`
  - Register in skins/index.ts
  - Add test asserting key differences from Coherence (slightly different shadows)

  **Must NOT do**:
  - Do NOT duplicate Coherence skin — Azure Fluent has nuanced differences in elevation/shadow

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 12, 14, 15)
  - **Blocks**: Tasks 16-19
  - **Blocked By**: Tasks 4, 6, 11

  **References**:
  - `src/themes/skins/coherence.ts` — Sister skin to compare against (from Task 12)
  - `src/themes/skins/fluent2.ts` — Skin file pattern
  - Plan skin token targets table: Azure Fluent row — `#0078D4`, 2px radius, low shadow, compact, 14px

  **Acceptance Criteria**:
  - [ ] `src/themes/skins/azure-fluent.ts` exists
  - [ ] Registered, `getSkin('azure-fluent')` works
  - [ ] Distinguishable from Coherence (different shadow values)
  - [ ] `bun run test` → all pass

  **QA Scenarios**:

  ```
  Scenario: Azure Fluent skin registered and distinct from Coherence
    Tool: Bash
    Steps:
      1. Run skin registry tests — azure-fluent tests pass
      2. Compare: flattenSkin(azureFluentSkin.sections).shadow4 !== flattenSkin(coherenceSkin.sections).shadow4
    Expected Result: Skins have different shadow values
    Evidence: .sisyphus/evidence/task-13-azure-fluent-skin.txt
  ```

  **Commit**: YES (group 4)
  - Files: `src/themes/skins/azure-fluent.ts`, `src/themes/skins/index.ts`, `src/themes/__tests__/skinRegistry.test.ts`
  - Pre-commit: `bun run test`

---

- [ ] 14. Author Ibiza Skin Overrides

  **What to do**:
  - Create `src/themes/skins/ibiza.ts` implementing `DesignSystemSkin`
  - Ibiza (~2014) = oldest era. Sharp, flat, ultra-compact. Characteristics:
    - **colors**: `#0072C6` brand blue (pre-Fluent), cooler neutrals
    - **shape**: `borderRadiusMedium: '0px'`, `borderRadiusLarge: '0px'` — completely sharp corners
    - **elevation**: `shadow4: 'none'`, `shadow8: 'none'` — flat design, no depth
    - **density**: Ultra-compact — `spacingHorizontalM: '6px'`, `spacingVerticalM: '4px'`, `spacingHorizontalS: '4px'`
    - **typography**: `fontSizeBase300: '13px'`, `fontSizeBase200: '12px'` — smaller base font
  - Register in skins/index.ts
  - Tests: sharp corners (0px), no shadows, brand blue `#0072C6`
  - **Un-skip the Ibiza composition test** in `src/themes/__tests__/themeRegistry.test.ts` — change `it.skip` to `it` for the `resolveTheme('azure', 'dark', 'ibiza')` test. Verify it passes with real Ibiza skin overrides applied (borderRadiusMedium === '0px', shadow === 'none').

  **Must NOT do**:
  - Do NOT use Fluent 2 brand blue (#0f6cbd) — Ibiza had a different blue
  - Do NOT add any shadows — Ibiza was flat design

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 12, 13, 15)
  - **Blocks**: Tasks 16-19
  - **Blocked By**: Tasks 4, 6, 11

  **References**:
  - Plan skin token targets table: Ibiza row — `#0072C6`, 0px sharp, none/flat, ultra-compact, 12-13px
  - `src/themes/skins/fluent2.ts` — Skin file pattern
  - Librarian research: Ibiza used Metro-inspired flat design, no depth, sharp corners, small text

  **Acceptance Criteria**:
  - [ ] `src/themes/skins/ibiza.ts` exists with sharp corners and no shadows
  - [ ] Brand color `#0072C6` (not `#0078D4` or `#0f6cbd`)
  - [ ] `borderRadiusMedium === '0px'`
  - [ ] `shadow4 === 'none'` or equivalent
  - [ ] Ibiza composition test in themeRegistry.test.ts un-skipped and passing
  - [ ] `bun run test` → all pass (0 skipped composition tests remaining)

  **QA Scenarios**:

  ```
  Scenario: Ibiza skin has flat, sharp design characteristics
    Tool: Bash
    Steps:
      1. Run skin registry tests — ibiza tests pass
      2. Grep ibiza.ts for "0072C6" — found (era-correct blue)
      3. Verify borderRadiusMedium '0px' in test
      4. Verify shadow tokens are 'none' in test
    Expected Result: Ibiza skin reflects flat 2014-era design
    Evidence: .sisyphus/evidence/task-14-ibiza-skin.txt

  Scenario: All composition tests now active (zero skipped)
    Tool: Bash
    Steps:
      1. Run `bun run test src/themes/__tests__/themeRegistry.test.ts`
      2. Verify 0 skipped tests (coherence, ibiza, and SRE-precedence all un-skipped)
      3. Grep themeRegistry.test.ts for `it.skip` — 0 occurrences
      4. Verify all 16+ tests pass
    Expected Result: All composition tests active and passing, zero skipped
    Evidence: .sisyphus/evidence/task-14-all-composition-active.txt
  ```

  **Commit**: YES (group 4)
  - Files: `src/themes/skins/ibiza.ts`, `src/themes/skins/index.ts`, `src/themes/__tests__/skinRegistry.test.ts`, `src/themes/__tests__/themeRegistry.test.ts`
  - Pre-commit: `bun run test`

---

- [ ] 15. Author Fluent 1 Skin Overrides

  **What to do**:
  - Create `src/themes/skins/fluent1.ts` implementing `DesignSystemSkin`
  - Fluent 1 (~2020) = bridge between Coherence and Fluent 2. Characteristics:
    - **colors**: `#0078D4` brand blue (same as Coherence era)
    - **shape**: `borderRadiusMedium: '2px'` — same subtle rounding as Coherence
    - **elevation**: Standard Fluent 1 shadows — moderate depth, less than Fluent 2
    - **density**: Standard (not compact, not spacious) — `spacingHorizontalM: '10px'`
    - **typography**: `fontSizeBase300: '14px'` — standard Segoe UI
  - Key difference from Coherence: standard (not compact) density and slightly different shadows
  - Register in skins/index.ts

  **Must NOT do**:
  - Do NOT duplicate Coherence — key diff is density (standard vs compact)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 12, 13, 14)
  - **Blocks**: Tasks 16-19
  - **Blocked By**: Tasks 4, 6, 11

  **References**:
  - Plan skin token targets table: Fluent 1 row — `#0078D4`, 2px, low shadow, standard density, 14px
  - `src/themes/skins/coherence.ts` — Compare: same shape/colors but different density

  **Acceptance Criteria**:
  - [ ] `src/themes/skins/fluent1.ts` exists
  - [ ] Standard density (spacingHorizontalM '10px' vs Coherence '8px')
  - [ ] Registered, tests pass
  - [ ] `bun run test` → all pass

  **QA Scenarios**:

  ```
  Scenario: Fluent 1 has standard density (distinct from Coherence compact)
    Tool: Bash
    Steps:
      1. Run skin registry tests — fluent1 tests pass
      2. Compare: fluent1 spacingHorizontalM ('10px') vs coherence spacingHorizontalM ('8px')
    Expected Result: Fluent 1 is less compact than Coherence
    Evidence: .sisyphus/evidence/task-15-fluent1-skin.txt
  ```

  **Commit**: YES (group 4)
  - Files: `src/themes/skins/fluent1.ts`, `src/themes/skins/index.ts`, `src/themes/__tests__/skinRegistry.test.ts`
  - Pre-commit: `bun run test`

### Wave 4 — Grouped Cleanup and Closure

- [ ] 16. GROUPED — Cleanup Navigation/Command-Surface Hardcodes

  **What to do**:
  - Replace ALL hardcoded px and hex values in these 7 component files with Fluent v9 tokens:
    - `src/components/AzureBreadcrumb.tsx`
    - `src/components/CommandBar.tsx`
    - `src/components/PageTitleBar.tsx`
    - `src/components/FilterBar.tsx`
    - `src/components/FilterPill.tsx`
    - `src/components/Navigation/PageTabs.tsx`
    - `src/components/SideNavigation.tsx`
  - For each hardcoded value, find the closest Fluent v9 token:
    - `'4px'` padding → `tokens.spacingHorizontalXS` or `tokens.spacingVerticalXS`
    - `'8px'` gap → `tokens.spacingHorizontalS`
    - `'12px'` → `tokens.spacingHorizontalM` (or S depending on context)
    - `'16px'` → `tokens.spacingHorizontalL`
    - `'#ffffff'` → `tokens.colorNeutralBackground1`
    - Font sizes → `tokens.fontSizeBase200/300/400`
    - Border radius → `tokens.borderRadiusSmall/Medium/Large`
  - EXEMPT: Layout constants for context pane widths (315/585/855/1125px) — these stay hardcoded
  - EXEMPT: SVG gradient stop colors — document as exceptions in component comments
  - If a semantic token doesn't exist in Fluent v9 for a specific value, use the closest available token and add a comment: `// closest available token`

  **Must NOT do**:
  - Do NOT change component behavior or visual output — ONLY swap value sources
  - Do NOT create new custom tokens — use existing Fluent v9 tokens only
  - Do NOT tokenize layout constants (context pane widths)
  - Do NOT modify SVG gradient stop colors

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Requires understanding which tokens map to which visual properties
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 17, 18, 19)
  - **Blocks**: Task 20 (final regression)
  - **Blocked By**: Task 8 (designSystem threaded), Tasks 12-15 (skins registered)

  **References**:
  - Each component file listed above — grep for `\d+px` and `#[0-9a-fA-F]` patterns
  - `@fluentui/react-components` tokens documentation — token naming conventions
  - `src/themes/products/azure.ts` — Color token names used in Azure theme overrides
  - Existing component files that already use tokens — use as pattern examples

  **Acceptance Criteria**:
  - [ ] Zero hardcoded px values in the 7 files (except layout constants)
  - [ ] Zero hardcoded hex colors in the 7 files (except SVG gradients, documented)
  - [ ] All values replaced with `tokens.*` from `@fluentui/react-components`
  - [ ] `bun run build` → zero TypeScript errors
  - [ ] `bun run lint` → clean
  - [ ] Visual output unchanged (token values match previous hardcoded values at Fluent 2 defaults)

  **QA Scenarios**:

  ```
  Scenario: No hardcoded values remain in navigation components
    Tool: Bash
    Steps:
      1. For each of the 7 files, grep for pattern `'[0-9]+px'` (quoted px values in makeStyles)
      2. For each of the 7 files, grep for pattern `'#[0-9a-fA-F]'` (hex colors)
      3. Any matches should ONLY be in exempt categories (layout constants, SVG gradients)
      4. Run `bun run build` — exit code 0
      5. Run `bun run lint` — exit code 0
    Expected Result: All dynamic values use tokens, build clean
    Evidence: .sisyphus/evidence/task-16-nav-cleanup.txt

  Scenario: Visual appearance unchanged in Storybook
    Tool: Playwright
    Preconditions: Storybook running, Fluent 2 skin selected
    Steps:
      1. Navigate to CommandBar story
      2. Take screenshot
      3. Compare visually — layout and colors should match pre-cleanup appearance
    Expected Result: No visual regression
    Evidence: .sisyphus/evidence/task-16-nav-visual.png
  ```

  **Commit**: YES (group 5)
  - Message: `refactor(components): replace hardcoded px/hex with tokens in nav and card surfaces`
  - Files: All 7 component files listed above
  - Pre-commit: `bun run test && bun run lint`

---

- [ ] 17. GROUPED — Cleanup Cards/Collection Surface Hardcodes

  **What to do**:
  - Replace ALL hardcoded px and hex values in these 5 component files:
    - `src/components/Buttons/CardButton.tsx`
    - `src/components/Cards/CardButton.tsx`
    - `src/components/Cards/StatusCard.tsx`
    - `src/components/Cards/InfoCard.tsx`
    - `src/components/InfoTable.tsx`
  - Same token-mapping strategy as Task 16
  - Same exemptions (layout constants, SVG gradients)

  **Must NOT do**:
  - Same constraints as Task 16

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 16, 18, 19)
  - **Blocks**: Task 20
  - **Blocked By**: Task 8, Tasks 12-15

  **References**:
  - Each component file listed above
  - `@fluentui/react-components` tokens
  - Task 16 as pattern example for the cleanup approach

  **Acceptance Criteria**:
  - [ ] Zero hardcoded px/hex in the 5 files (exempt categories documented)
  - [ ] `bun run build` → zero errors
  - [ ] `bun run lint` → clean

  **QA Scenarios**:

  ```
  Scenario: No hardcoded values remain in card components
    Tool: Bash
    Steps:
      1. Grep each of 5 files for quoted px values and hex colors
      2. Only exempt matches should remain
      3. Run `bun run build && bun run lint`
    Expected Result: All dynamic values tokenized, build clean
    Evidence: .sisyphus/evidence/task-17-cards-cleanup.txt
  ```

  **Commit**: YES (group 5)
  - Files: All 5 component files listed above
  - Pre-commit: `bun run test && bun run lint`

---

- [ ] 18. GROUPED — Cleanup Panels/Drawers/Dialog Hardcodes

  **What to do**:
  - Replace ALL hardcoded px and hex values in these 5 component files:
    - `src/components/ContextPane.tsx`
    - `src/components/EssentialsPanel.tsx`
    - `src/components/ServiceFlyout.tsx`
    - `src/components/SearchBanner.tsx`
    - `src/components/PageHeader.tsx`
  - Same token-mapping strategy as Task 16
  - **Special attention**: `ContextPane.tsx` has layout constants (315/585/855/1125px) — these are EXEMPT
  - `ServiceFlyout.tsx` and `SearchBanner.tsx` have hex colors — replace with tokens

  **Must NOT do**:
  - Do NOT tokenize ContextPane width constants (315, 585, 855, 1125px)
  - Same constraints as Task 16

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 16, 17, 19)
  - **Blocks**: Task 20
  - **Blocked By**: Task 8, Tasks 12-15

  **References**:
  - Each component file listed above
  - `src/components/ContextPane.tsx` — Width constants to leave untouched
  - Task 16 as pattern example

  **Acceptance Criteria**:
  - [ ] Zero hardcoded px/hex in the 5 files (except ContextPane widths and SVG gradients)
  - [ ] ContextPane width constants (315/585/855/1125px) preserved as-is
  - [ ] `bun run build` → zero errors

  **QA Scenarios**:

  ```
  Scenario: Panels cleaned up with exemptions preserved
    Tool: Bash
    Steps:
      1. Grep each of 5 files for quoted px values and hex colors
      2. ContextPane.tsx: verify 315/585/855/1125 still present (exempt)
      3. ServiceFlyout.tsx: verify no hex colors remain
      4. Run `bun run build && bun run lint`
    Expected Result: Cleaned up with documented exemptions
    Evidence: .sisyphus/evidence/task-18-panels-cleanup.txt
  ```

  **Commit**: YES (group 6)
  - Message: `refactor(components): complete hardcoded cleanup, add Chromatic modes and exception docs`
  - Files: All 5 component files listed above
  - Pre-commit: `bun run test && bun run lint`

---

- [ ] 19. GROUPED — Cleanup Indicators/Empty States/Decorative Hardcodes

  **What to do**:
  - Replace ALL hardcoded px and hex values in these 5 component files:
    - `src/components/NullState.tsx`
    - `src/components/CopilotSuggestionsBar.tsx`
    - `src/components/Navigation/WizardNav.tsx`
    - `src/components/GlobalHeader/AzureGlobalHeader.tsx`
    - `src/components/GlobalHeader/SREGlobalHeader.tsx`
  - Same token-mapping strategy as Task 16
  - **Special attention**: `CopilotSuggestionsBar.tsx` and `WizardNav.tsx` have hex colors — replace with tokens
  - `SREGlobalHeader.tsx` has hex colors — replace with tokens
  - SVG gradient stop colors in any of these files are documented exceptions

  **Must NOT do**:
  - Same constraints as Task 16
  - Do NOT modify SVG gradient stop colors — document as exceptions

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 16, 17, 18)
  - **Blocks**: Task 20
  - **Blocked By**: Task 8, Tasks 12-15

  **References**:
  - Each component file listed above
  - Task 16 as pattern example
  - SVG gradient exemption policy from plan guardrails

  **Acceptance Criteria**:
  - [ ] Zero hardcoded px/hex in the 5 files (except SVG gradients, documented)
  - [ ] SVG gradient exceptions documented with inline comments
  - [ ] `bun run build` → zero errors

  **QA Scenarios**:

  ```
  Scenario: Indicators cleaned up with SVG exemptions documented
    Tool: Bash
    Steps:
      1. Grep each of 5 files for quoted px values and hex colors
      2. Any remaining hex MUST be inside SVG gradient stops with documenting comment
      3. Run `bun run build && bun run lint`
    Expected Result: Cleaned up, SVG exceptions documented
    Evidence: .sisyphus/evidence/task-19-indicators-cleanup.txt
  ```

  **Commit**: YES (group 6)
  - Files: All 5 component files listed above
  - Pre-commit: `bun run test && bun run lint`

---

- [ ] 20. Final Regression — Chromatic Subset + Contract Docs + Exception Ledger

  **What to do**:
  - Update `.storybook/preview.tsx` chromatic modes (lines 80-118):
    - Replace current 6 modes with curated 6-mode subset covering skin axis:
      ```
      'fluent2-light':    { productTheme: 'azure', appearanceMode: 'light', designSystem: 'fluent2' }
      'fluent2-hc':       { productTheme: 'azure', appearanceMode: 'high-contrast', designSystem: 'fluent2' }
      'coherence-light':  { productTheme: 'azure', appearanceMode: 'light', designSystem: 'coherence' }
      'azure-fluent-dark':{ productTheme: 'azure', appearanceMode: 'dark', designSystem: 'azure-fluent' }
      'ibiza-light':      { productTheme: 'azure', appearanceMode: 'light', designSystem: 'ibiza' }
      'fluent1-dark':     { productTheme: 'azure', appearanceMode: 'dark', designSystem: 'fluent1' }
      ```
  - Create `src/themes/EXCEPTIONS.md` documenting:
    - Layout constants exempt from tokenization (ContextPane widths: 315/585/855/1125px)
    - SVG gradient stop colors that remain hardcoded (list file:line for each)
    - Skin fidelity policy ("recognizable era, not pixel-perfect")
    - Product-wins-over-skin composition rule
  - Run full regression:
    - `bun run test` — all tests pass
    - `bun run build` — zero errors
    - `bun run lint` — clean
    - Snapshot tests from Task 1 still pass (azureThemes unchanged)
  - Verify all 5 skins are selectable and produce visibly different output

  **Must NOT do**:
  - Do NOT add more than 6 Chromatic modes (matching current count)
  - Do NOT remove SRE Agent product from registry (it's still a valid product)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Mixed concerns — Chromatic config, documentation, full regression
  - **Skills**: `['playwright']`
    - `playwright`: Needed to visually verify all 5 skins in Storybook

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4 sequential (after Tasks 16-19)
  - **Blocks**: F1-F4 (final verification wave)
  - **Blocked By**: Tasks 1, 10, 16, 17, 18, 19

  **References**:
  - `.storybook/preview.tsx:80-118` — Current chromatic modes to replace
  - Task 1 snapshot tests — verify they still pass
  - All skin files from Tasks 6, 12-15
  - `.storybook/addons/theme-switcher/constants.ts` — DESIGN_SYSTEM_GLOBAL for chromatic mode globals

  **Acceptance Criteria**:
  - [ ] Chromatic modes updated to 6-mode subset with skin axis
  - [ ] `src/themes/EXCEPTIONS.md` exists with all exemptions documented
  - [ ] `bun run test` → all pass (including snapshot tests)
  - [ ] `bun run build` → zero errors
  - [ ] `bun run lint` → clean
  - [ ] All 5 skins produce visibly different rendering in Storybook

  **QA Scenarios**:

  ```
  Scenario: Full regression passes
    Tool: Bash
    Steps:
      1. Run `bun run test` — verify all pass (zero failures)
      2. Run `bun run build` — verify exit code 0
      3. Run `bun run lint` — verify exit code 0
      4. Verify snapshot tests: `bun run test src/themes/__tests__/azureThemes.snapshot.test.ts` — 3 pass
    Expected Result: Complete green across test/build/lint
    Evidence: .sisyphus/evidence/task-20-full-regression.txt

  Scenario: All 5 skins visually distinct in Storybook
    Tool: Playwright
    Preconditions: Storybook running (`bun run dev`)
    Steps:
      1. Navigate to http://localhost:6006 — load a Button story
      2. For each skin (Fluent 2, Coherence, Ibiza, Fluent 1, Azure Fluent):
         a. Select skin from Design System dropdown
         b. Wait 2s for theme to apply
         c. Take screenshot: .sisyphus/evidence/task-20-skin-{id}.png
      3. Compare screenshots — each should look visibly different:
         - Ibiza: sharp corners, no shadows, smaller text
         - Coherence: subtle rounding, compact
         - Fluent 2: rounded corners, deeper shadows, spacious
    Expected Result: 5 distinct screenshots showing era-appropriate styling
    Evidence: .sisyphus/evidence/task-20-skin-*.png

  Scenario: Chromatic modes include design-system axis
    Tool: Bash
    Steps:
      1. Grep preview.tsx for "designSystem" inside chromatic modes section
      2. Count mode entries — should be exactly 6
      3. Verify at least 3 different designSystem values across modes
    Expected Result: 6 modes with skin axis coverage
    Evidence: .sisyphus/evidence/task-20-chromatic-modes.txt

  Scenario: Exceptions documented
    Tool: Bash
    Steps:
      1. Verify file exists: src/themes/EXCEPTIONS.md
      2. Grep for "ContextPane" — layout constant exemption documented
      3. Grep for "SVG" — gradient exception documented
      4. Grep for "product-wins" or "product overrides" — composition rule documented
    Expected Result: All exceptions clearly documented
    Evidence: .sisyphus/evidence/task-20-exceptions-doc.txt
  ```

  **Commit**: YES (group 6)
  - Message: `refactor(components): complete hardcoded cleanup, add Chromatic modes and exception docs`
  - Files: `.storybook/preview.tsx`, `src/themes/EXCEPTIONS.md`
  - Pre-commit: `bun run test && bun run build && bun run lint`

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [ ] F1. **Plan Compliance Audit** — `oracle`
      Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in `.sisyphus/evidence/`. Compare deliverables against plan.
      Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

  **QA Scenarios**:

  ```
  Scenario: Must Have deliverables present
    Tool: Bash
    Preconditions: All 20 tasks complete
    Steps:
      1. Verify `src/themes/skins/` directory exists with files: types.ts, fluent2.ts, coherence.ts, ibiza.ts, fluent1.ts, azure-fluent.ts, index.ts
      2. Run `bun run test` — all pass
      3. Run `bun run build` — zero errors
      4. Grep `src/themes/themeRegistry.ts` for `designSystem` parameter — found
      5. Grep `.storybook/addons/theme-switcher/manager.tsx` for third dropdown — found
      6. Grep `.storybook/preview.tsx` for 3-arg resolveTheme call — found
      7. Verify `src/themes/EXCEPTIONS.md` exists
      8. Count evidence files in `.sisyphus/evidence/` — at least 20 files present
    Expected Result: All Must Have items verified present
    Evidence: .sisyphus/evidence/f1-must-have-audit.txt

  Scenario: Must NOT Have violations absent
    Tool: Bash
    Preconditions: All 20 tasks complete
    Steps:
      1. Grep all `src/components/**/*.tsx` for hardcoded hex patterns (`#[0-9a-fA-F]{3,8}`) — zero matches outside SVG gradients and documented exceptions
      2. Grep `src/themes/products/sre-agent.ts` for `borderRadius|spacing|strokeWidth|fontWeight` — zero matches in override objects
      3. Grep `src/themes/skins/*.ts` for `import.*@fluentui/react-northstar|@coherence` — zero matches (no legacy library imports)
      4. Verify `azureThemes.ts` snapshot test passes: `bun run test src/themes/__tests__/azureThemes.snapshot.test.ts`
    Expected Result: Zero forbidden patterns found; snapshot unchanged
    Evidence: .sisyphus/evidence/f1-must-not-have-audit.txt
  ```

- [ ] F2. **Code Quality Review** — `unspecified-high`
      Run `tsc --noEmit` + linter + `bun run test`. Review all changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names (data/result/item/temp).
      Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Tests [N pass/N fail] | Files [N clean/N issues] | VERDICT`

  **QA Scenarios**:

  ```
  Scenario: Build, lint, and tests all pass
    Tool: Bash
    Preconditions: All 20 tasks complete
    Steps:
      1. Run `npx tsc --noEmit` — expect exit code 0
      2. Run `bun run lint` — expect exit code 0
      3. Run `bun run test` — expect all tests pass, 0 failures
    Expected Result: tsc exit 0, lint exit 0, test exit 0
    Evidence: .sisyphus/evidence/f2-build-lint-test.txt

  Scenario: No code quality anti-patterns in changed files
    Tool: Bash
    Preconditions: All 20 tasks complete
    Steps:
      1. Get list of changed files: `git diff --name-only HEAD~6` (6 commit groups)
      2. For each file, grep for `as any` — count occurrences
      3. Grep for `@ts-ignore` — expect 0 (only `@ts-expect-error` allowed, and only with explanation)
      4. Grep for `console.log` in `src/` files (not test files) — expect 0
      5. Grep for `// TODO` without a task reference — flag as potential incomplete work
      6. Check for empty catch blocks: grep `catch.*{[\s]*}` — expect 0
    Expected Result: Zero `@ts-ignore`, zero `console.log` in prod, zero empty catches
    Evidence: .sisyphus/evidence/f2-code-quality.txt
  ```

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill if UI)
      Start from clean state. Execute EVERY QA scenario from EVERY task — follow exact steps, capture evidence. Test cross-task integration (features working together, not isolation). Test edge cases: empty state, invalid input, rapid actions. Save to `.sisyphus/evidence/final-qa/`.
      Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

  **QA Scenarios**:

  ```
  Scenario: Storybook launches with 3 dropdowns and all 5 skins work
    Tool: Playwright (playwright skill)
    Preconditions: Clean state, no dev server running
    Steps:
      1. Run `bun run dev` in background, wait for port 6006
      2. Navigate to `http://localhost:6006`
      3. Verify toolbar contains 3 dropdowns: Product Theme, Appearance, Design System
      4. For each of the 5 skins (Fluent 2, Coherence, Ibiza, Fluent 1, Azure Fluent):
         a. Select the skin from the Design System dropdown
         b. Navigate to a component story (e.g., Button)
         c. Take screenshot: `.sisyphus/evidence/final-qa/skin-{name}-button.png`
         d. Verify the component renders (no error overlay, no blank screen)
      5. Compare screenshots — all 5 must be visually distinct from each other
    Expected Result: 3 dropdowns visible, 5 skins render distinct component appearances, zero error overlays
    Evidence: .sisyphus/evidence/final-qa/all-skins-toolbar.png + per-skin screenshots

  Scenario: Cross-axis integration — skin + product + appearance combinations
    Tool: Playwright (playwright skill)
    Preconditions: Storybook running on port 6006
    Steps:
      1. Select: Azure + Light + Coherence — screenshot
      2. Select: Azure + Dark + Coherence — screenshot, verify dark background
      3. Select: SRE Agent + Light + Ibiza — screenshot, verify SRE brand colors present
      4. Select: Azure + High Contrast + Fluent 1 — screenshot, verify HC accessibility colors dominate
      5. Rapidly toggle between all 5 skins — verify no flash of unstyled content, no console errors
    Expected Result: All combinations render correctly; HC appearance base provides accessibility colors first, then skin structural overrides (shape/spacing) apply on top, then product colors win last
    Evidence: .sisyphus/evidence/final-qa/cross-axis-{combo}.png

  Scenario: Edge case — rapid toggling and default state
    Tool: Playwright (playwright skill)
    Preconditions: Storybook running on port 6006
    Steps:
      1. Navigate to component story
      2. Toggle skin dropdown rapidly 10 times between different skins
      3. Open browser console — verify zero errors/warnings related to theme
      4. Refresh page — verify default state is Fluent 2 + Azure + Light
      5. Take screenshot of default state
    Expected Result: No console errors after rapid toggling; defaults restore correctly on refresh
    Evidence: .sisyphus/evidence/final-qa/rapid-toggle-console.png
  ```

- [ ] F4. **Scope Fidelity Check** — `deep`
      For each task: read "What to do", read actual diff (git log/diff). Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance. Detect cross-task contamination: Task N touching Task M's files. Flag unaccounted changes.
      Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

  **QA Scenarios**:

  ```
  Scenario: Each commit group matches its task scope
    Tool: Bash
    Preconditions: All 6 commit groups landed
    Steps:
      1. For each of the 6 commits (identified by commit message pattern):
         a. Run `git show --stat <commit-hash>` to list changed files
         b. Compare against the "Files" list in the Commit Strategy table
         c. Flag any file that appears in a commit but is NOT listed in that commit's task scope
         d. Flag any file listed in the task scope but NOT appearing in the commit
      2. Aggregate: count compliant vs non-compliant tasks
    Expected Result: All 20 tasks have 1:1 scope match between plan and implementation
    Evidence: .sisyphus/evidence/f4-scope-fidelity.txt

  Scenario: No cross-task contamination
    Tool: Bash
    Preconditions: All 6 commit groups landed
    Steps:
      1. Build a map: task → expected files from plan
      2. For each commit, verify no file belongs to a LATER task's scope
      3. Specifically check: Tasks 16-19 (cleanup groups) don't touch each other's file lists
      4. Check that `preview.tsx` changes appear ONLY in commit groups 3 and 6 (group 3: Tasks 5, 8, 9, 10 for theme plumbing; group 6: Task 20 for Chromatic modes) — these are the two known multi-group files
      5. Check that skin files only appear in commit group 4 (Tasks 11-15)
    Expected Result: Zero cross-task file contamination
    Evidence: .sisyphus/evidence/f4-contamination-check.txt
  ```

---

## Commit Strategy

| Commit Group                        | Tasks              | Message                                                                                    | Pre-commit Check                                |
| ----------------------------------- | ------------------ | ------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| 1. Guardrails + contract            | 1, 2, 3            | `test(themes): add legacy snapshots, type contracts, and composition precedence tests`     | `bun run test`                                  |
| 2. Composer foundation              | 4, 6, 7            | `feat(themes): add design-system skin registry and 3-axis resolveTheme`                    | `bun run test`                                  |
| 3. Storybook plumbing               | 5, 8, 9, 10        | `feat(storybook): add design-system toolbar dropdown and CSS variable backgrounds`         | `bun run test && bun run build`                 |
| 4. Skin authoring + Azure alignment | 11, 12, 13, 14, 15 | `feat(themes): add 5 design-system skins with era-specific token overrides`                | `bun run test`                                  |
| 5. Cleanup pass A                   | 16, 17             | `refactor(components): replace hardcoded px/hex with tokens in nav and card surfaces`      | `bun run test && bun run lint`                  |
| 6. Cleanup pass B + closure         | 18, 19, 20         | `refactor(components): complete hardcoded cleanup, add Chromatic modes and exception docs` | `bun run test && bun run build && bun run lint` |

---

## Success Criteria

### Verification Commands

```bash
bun run test                    # Expected: all tests pass (existing + new)
bun run build                   # Expected: zero TypeScript errors
bun run lint                    # Expected: zero ESLint errors
bun run dev                     # Expected: Storybook starts, 3 dropdowns visible in toolbar
```

### Final Checklist

- [ ] All "Must Have" items present and verified
- [ ] All "Must NOT Have" items absent — verified by grep/search
- [ ] All tests pass (existing + new)
- [ ] All 5 skins produce visually distinct rendering
- [ ] Backward compat — `resolveTheme` 2-arg calls work identically
- [ ] `azureThemes.ts` exports unchanged (snapshot verified)
- [ ] Zero hardcoded px/hex in component styles (layout constants exempt, SVG gradients documented)
- [ ] Chromatic modes updated to curated 6-mode subset
- [ ] No conflicts with agentation-integration plan
