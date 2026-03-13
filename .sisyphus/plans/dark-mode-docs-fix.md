# Dark Mode Docs Page Fix

## TL;DR

> **Quick Summary**: Wrap the Storybook docs page in a custom DocsContainer that applies both the Fluent v9 theme (via FluentProvider) and the Storybook dark/light docs chrome theme, so dark mode fills the entire docs page — not just individual story canvases.
>
> **Deliverables**:
>
> - Modified `.storybook/preview.tsx` with custom DocsContainer component
> - Dark/HC appearance modes produce a fully dark docs page (background, text, tables, code blocks)
>
> **Estimated Effort**: Quick
> **Parallel Execution**: NO — single file change + verification
> **Critical Path**: Task 1 → Task 2 → F1-F4

---

## Context

### Original Request

The dark mode appearance toggle only themes individual story canvases (wrapped by FluentProvider in the decorator), but the Storybook docs page chrome — title, description, args table, "STORIES" headings — stays white. The dark theme background doesn't fill the entire container.

### Interview Summary

**Key Discussions**:

- User chose the FluentProvider DocsContainer wrapper approach over CSS-only
- Product themes are portable — consumed outside Storybook by an assembled product/prototype with a theme toggle
- This fix is Storybook-specific only; does not affect the portable theme system

**Research Findings**:

- `@storybook/addon-docs/blocks` exports `DocsContainer` with `theme?: ThemeVars` prop — verified in dist types
- `storybook/theming` exports `themes.dark` and `themes.light` — verified
- Globals must be read via `context.storyById()` + `context.getStoryContext(story).globals` — NOT `context.store?.globals?.globals` (that path does not exist on DocsContextProps)
- `context.storyById()` can throw on standalone MDX pages with no attached story — must wrap in try/catch
- High-contrast has no Storybook theme equivalent — map to `themes.dark`

### Metis Review

**Identified Gaps** (addressed):

- **Globals access path was wrong**: Plan originally used `context.store?.globals?.globals` which doesn't exist. Corrected to `context.storyById()` + `context.getStoryContext()`.
- **MDX-only page crash risk**: `storyById()` throws when no story exists. Added try/catch with defaults fallback.
- **High-contrast mapping**: No `themes.highContrast` in Storybook — mapped to `themes.dark`.
- **5 story files with hardcoded `azureLightTheme` decorators**: Known limitation, out of scope (in `src/stories/`).
- **Manager sidebar stays light**: Out of scope — separate iframe, `.storybook/manager.ts` not modified.

---

## Work Objectives

### Core Objective

Make the Storybook docs page fully respect the appearance mode (light/dark/high-contrast) selected via the toolbar dropdown, so dark mode produces a dark docs page — not a white page with dark story canvases.

### Concrete Deliverables

- Modified `.storybook/preview.tsx` with custom DocsContainer wrapping docs in both Storybook theme + FluentProvider

### Definition of Done

- [ ] Docs page in dark mode has dark background and light text across title, description, args table, code blocks
- [ ] Docs page in light mode is unchanged from current behavior
- [ ] Docs page in high-contrast mode uses dark Storybook chrome + Fluent HC theme
- [ ] `tsc --noEmit` passes clean
- [ ] `vitest run` — 10/10 tests pass (regression)
- [ ] `storybook build` succeeds

### Must Have

- Custom DocsContainer reads globals via `context.storyById()` + `context.getStoryContext()`
- Try/catch fallback for MDX-only pages (no story context)
- `themes.dark` for dark and high-contrast appearances, `themes.light` for light
- FluentProvider inside DocsContainer wraps all docs children
- Existing `data-azure-theme` attribute sync in decorator preserved
- `toc: true` preserved in docs parameters

### Must NOT Have (Guardrails)

- ❌ Do NOT modify any file under `src/components/` or `src/stories/`
- ❌ Do NOT modify `src/themes/azureThemes.ts`
- ❌ Do NOT modify `.storybook/manager.ts` (manager sidebar theming is out of scope)
- ❌ Do NOT install new dependencies — all required packages are already installed
- ❌ Do NOT add `storybook-dark-mode` addon or any new addon
- ❌ Do NOT add CSS custom properties, CSS dark mode media queries, or new CSS files
- ❌ Do NOT modify `globalTypes`, `chromatic.modes`, or any other existing parameter/decorator config
- ❌ Do NOT create a separate DocsContainer file — keep inline in `preview.tsx`
- ❌ Do NOT add test files or test infrastructure
- ❌ Do NOT fix the 5 story-level hardcoded `azureLightTheme` decorators (out of scope)

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed.

### Test Decision

- **Infrastructure exists**: YES (vitest)
- **Automated tests**: Regression only — no new test files
- **Framework**: vitest (existing 10 tests in `themeRegistry.test.ts`)

### QA Policy

Every task includes agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Storybook build**: Use Bash — run `storybook build`, assert exit code 0
- **Visual QA**: Use Playwright skill — navigate to docs page with dark globals, assert background colors, take screenshots

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Implementation + type check):
└── Task 1: Add custom DocsContainer to preview.tsx [quick]

Wave 2 (Verification):
└── Task 2: Visual QA — dark mode docs page [quick] (+ playwright skill)

Wave FINAL (Review):
├── F1: Plan Compliance Audit [oracle]
├── F2: Code Quality Review [unspecified-high]
├── F3: Real Manual QA [unspecified-high] (+ playwright skill)
└── F4: Scope Fidelity Check [deep]

Critical Path: Task 1 → Task 2 → F1-F4
```

### Dependency Matrix

| Task  | Depends On | Blocks   |
| ----- | ---------- | -------- |
| 1     | —          | 2, F1-F4 |
| 2     | 1          | F1-F4    |
| F1-F4 | 2          | —        |

### Agent Dispatch Summary

- **Wave 1**: 1 task — T1 → `quick`
- **Wave 2**: 1 task — T2 → `quick` + `playwright`
- **FINAL**: 4 tasks — F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high` + `playwright`, F4 → `deep`

---

## TODOs

- [x] 1. Add custom DocsContainer to `.storybook/preview.tsx`

  **What to do**:
  1. Add two new imports at the top of `.storybook/preview.tsx`:
     ```tsx
     import { DocsContainer as BaseDocsContainer } from '@storybook/addon-docs/blocks';
     import { themes } from 'storybook/theming';
     ```
  2. Define a `CustomDocsContainer` component ABOVE the `preview` const (around line 25, after imports). This component:
     - Accepts `{ children, context, ...rest }` props
     - Reads globals by calling `context.storyById()` then `context.getStoryContext(story).globals`
     - Wraps the `storyById()` call in try/catch — if it throws (MDX-only page), fall back to `DEFAULT_PRODUCT` / `DEFAULT_APPEARANCE`
     - Calls `resolveTheme(productId, appearance)` to get the Fluent v9 theme
     - Maps appearance to Storybook docs theme: `appearance === 'dark' || appearance === 'high-contrast' ? themes.dark : themes.light`
     - Returns `<BaseDocsContainer context={context} theme={docsTheme} {...rest}><FluentProvider theme={fluentTheme}>{children}</FluentProvider></BaseDocsContainer>`
  3. Update `parameters.docs` to include the container:
     ```tsx
     docs: {
       toc: true,
       container: CustomDocsContainer,
     },
     ```
  4. Do NOT change anything else in the file — leave globalTypes, decorator, chromatic.modes, etc. untouched.

  **Must NOT do**:
  - Do NOT use `context.store?.globals?.globals` — that path does not exist
  - Do NOT remove or relocate the `data-azure-theme` attribute sync in the decorator
  - Do NOT create a separate file for the container component
  - Do NOT add CSS files or modify `preview.css`

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single-file change, ~25 lines added, clear implementation shape
  - **Skills**: []
    - No special skills needed — standard TypeScript/React edit
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Not needed — no visual design work, just wiring up existing APIs

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1 (solo)
  - **Blocks**: Task 2, F1-F4
  - **Blocked By**: None

  **References**:

  **Pattern References** (existing code to follow):
  - `.storybook/preview.tsx:93-108` — Existing inline decorator pattern showing how globals are read via `context.globals[PRODUCT_THEME_GLOBAL]` and theme resolved. The DocsContainer should follow the same globals → resolveTheme() → FluentProvider pattern.
  - `.storybook/preview.tsx:6-11` — Existing constant imports from `./addons/theme-switcher/constants` (reuse same constants in DocsContainer)

  **API/Type References** (contracts to implement against):
  - `node_modules/@storybook/addon-docs/dist/blocks.d.ts:415-419` — `DocsContainerProps` type: `{ context: DocsContextProps, theme?: ThemeVars }`. The `theme` prop controls Storybook's docs chrome appearance.
  - `node_modules/@storybook/addon-docs/dist/blocks.d.ts` — `DocsContextProps` has `storyById(id?)` and `getStoryContext(story)` methods. Use these to read globals.
  - `storybook/theming` — exports `themes.dark` (base: 'dark') and `themes.light` (base: 'light'). No high-contrast variant exists.

  **External References**:
  - Storybook Docs theming: The `DocsContainer` component accepts a `theme` ThemeVars prop that sets background, text, and chrome colors for the entire docs page.

  **WHY Each Reference Matters**:
  - `preview.tsx:93-108`: Copy this exact pattern of reading globals and resolving theme — ensures consistency
  - `blocks.d.ts:415-419`: Confirms the DocsContainer signature and that `theme` is optional
  - `storybook/theming`: Provides pre-built dark theme that matches Storybook's design system

  **Acceptance Criteria**:

  **Regression:**
  - [x] `./node_modules/.bin/vitest run` → 10/10 tests PASS (unchanged)
  - [x] `./node_modules/.bin/tsc --noEmit` → clean (no errors)
  - [ ] `npx eslint .storybook/preview.tsx` → 0 errors

  **Build:**
  - [ ] `npm run build` → exits 0, Storybook builds successfully

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Dark mode docs page has dark background (happy path)
    Tool: Playwright (playwright skill)
    Preconditions: Storybook dev server running on localhost:6006
    Steps:
      1. Navigate to http://localhost:6006/?path=/docs/components-buttons-button--docs&globals=productTheme:azure,appearanceMode:dark
      2. Wait for docs page to load (selector: .sbdocs or [id="docs-root"])
      3. Evaluate: window.getComputedStyle(document.querySelector('.sbdocs') || document.querySelector('#storybook-docs')).backgroundColor
      4. Assert: background-color is NOT 'rgb(255, 255, 255)' and NOT 'rgba(0, 0, 0, 0)'
      5. Take screenshot
    Expected Result: Docs page has a dark background color (Storybook dark theme background)
    Failure Indicators: Background is white (rgb(255,255,255)) or transparent
    Evidence: .sisyphus/evidence/task-1-dark-docs-bg.png

  Scenario: Light mode docs page remains unchanged (regression)
    Tool: Playwright (playwright skill)
    Preconditions: Storybook dev server running on localhost:6006
    Steps:
      1. Navigate to http://localhost:6006/?path=/docs/components-buttons-button--docs&globals=productTheme:azure,appearanceMode:light
      2. Wait for docs page to load
      3. Evaluate background-color of docs container
      4. Assert: background-color IS white or near-white
      5. Take screenshot
    Expected Result: Docs page has light/white background — same as before the change
    Failure Indicators: Background is dark when it should be light
    Evidence: .sisyphus/evidence/task-1-light-docs-bg.png

  Scenario: Switching appearance updates docs page (not just story canvas)
    Tool: Playwright (playwright skill)
    Preconditions: Storybook dev server running on localhost:6006, start on light mode
    Steps:
      1. Navigate to docs page in light mode
      2. Take screenshot (light baseline)
      3. Navigate to same page with dark globals
      4. Take screenshot (dark result)
      5. Compare: background colors should differ between screenshots
    Expected Result: Docs page background changes when switching light → dark
    Failure Indicators: Both screenshots show identical white background
    Evidence: .sisyphus/evidence/task-1-switch-light.png, .sisyphus/evidence/task-1-switch-dark.png
  ```

  **Commit**: YES
  - Message: `fix(storybook): apply dark theme to entire docs page via custom DocsContainer`
  - Files: `.storybook/preview.tsx`
  - Pre-commit: `./node_modules/.bin/tsc --noEmit && ./node_modules/.bin/vitest run`

---

- [x] 2. Visual QA — verify all appearance modes render correctly

  **What to do**:
  1. Start Storybook dev server (`npm run dev`)
  2. Test all 6 combinations: Azure × light/dark/HC, SRE Agent × light/dark/HC
  3. For each, verify the docs page background matches the appearance mode
  4. Capture screenshots as evidence
  5. Check that args tables, code blocks, and heading text are readable in dark mode

  **Must NOT do**:
  - Do NOT modify any files — this is a verification-only task
  - Do NOT install Playwright as a project dependency — use the Playwright skill's built-in browser

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Verification-only, no code changes
  - **Skills**: [`playwright`]
    - `playwright`: Required for browser automation to navigate Storybook and capture screenshots
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Not designing anything, just verifying

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (solo, after Task 1)
  - **Blocks**: F1-F4
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `.storybook/addons/theme-switcher/constants.ts` — `PRODUCT_THEMES` array with `azure` and `sre-agent` IDs, `APPEARANCE_MODES` with `light`, `dark`, `high-contrast` — use these to construct all 6 URL combinations

  **WHY Each Reference Matters**:
  - `constants.ts`: Provides the exact product/appearance IDs needed to construct test URLs with correct globals query parameters

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: All 6 theme/appearance combos render correctly
    Tool: Playwright (playwright skill)
    Preconditions: Storybook dev server running on localhost:6006, Task 1 complete
    Steps:
      1. For each combo in [azure×light, azure×dark, azure×hc, sre-agent×light, sre-agent×dark, sre-agent×hc]:
         a. Navigate to http://localhost:6006/?path=/docs/components-buttons-button--docs&globals=productTheme:{product},appearanceMode:{appearance}
         b. Wait for page load
         c. Take screenshot
         d. For dark/hc: assert docs background is NOT white
         e. For light: assert docs background IS white/near-white
         f. For all: assert no console errors
    Expected Result: 6 screenshots captured, dark/hc pages have dark backgrounds, light pages have light backgrounds
    Failure Indicators: Any dark/hc page shows white background, any console errors
    Evidence: .sisyphus/evidence/task-2-azure-light.png, task-2-azure-dark.png, task-2-azure-hc.png, task-2-sreagent-light.png, task-2-sreagent-dark.png, task-2-sreagent-hc.png

  Scenario: Args table is readable in dark mode
    Tool: Playwright (playwright skill)
    Preconditions: On dark mode docs page
    Steps:
      1. Navigate to Button docs page in dark mode
      2. Scroll to args table (selector: table, .docblock-argstable, or similar)
      3. Evaluate text color and background color of table cells
      4. Assert: text has sufficient contrast against background (not black on dark or white on white)
    Expected Result: Table text is readable — light text on dark background
    Failure Indicators: Text color matches background (invisible), or text is dark on dark background
    Evidence: .sisyphus/evidence/task-2-args-table-dark.png
  ```

  **Commit**: NO (verification only, no code changes)

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [ ] F1. **Plan Compliance Audit** — `oracle`
      Read the plan end-to-end. Verify: (1) custom DocsContainer exists in `.storybook/preview.tsx`, (2) reads globals via `storyById()` + `getStoryContext()`, (3) has try/catch for MDX pages, (4) maps dark/HC to `themes.dark`, (5) wraps in `<BaseDocsContainer theme={...}><FluentProvider theme={...}>`, (6) `toc: true` preserved, (7) no forbidden files modified. Check evidence files exist.
      Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
      Run `./node_modules/.bin/tsc --noEmit` + `npx eslint .storybook/preview.tsx` + `./node_modules/.bin/vitest run`. Review `.storybook/preview.tsx` for: `as any` usage (minimize), empty catches (must have fallback logic), console.log in prod code, unused imports, type safety of DocsContainer props. Check no AI slop: no excessive comments, no over-abstraction.
      Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Tests [N pass/N fail] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
      Start from clean state. Open Storybook dev server. Test all 6 combos (azure/sre-agent × light/dark/hc) on the Button docs page. Verify: (1) dark modes have dark docs background, (2) light mode unchanged, (3) args table readable, (4) story canvases still themed correctly, (5) toolbar dropdowns still work, (6) no console errors. Save screenshots.
      Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
      Run `git diff HEAD` to see ALL changes. Verify: (1) ONLY `.storybook/preview.tsx` was modified (+ any .sisyphus files), (2) no files under `src/components/`, `src/stories/`, or `src/themes/azureThemes.ts` were touched, (3) no new dependencies added to `package.json`, (4) no new CSS files, (5) existing decorator/globalTypes/chromatic.modes unchanged.
      Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

| Task | Commit Message                                                                  | Files                    | Pre-commit Check             |
| ---- | ------------------------------------------------------------------------------- | ------------------------ | ---------------------------- |
| 1    | `fix(storybook): apply dark theme to entire docs page via custom DocsContainer` | `.storybook/preview.tsx` | `tsc --noEmit && vitest run` |

---

## Success Criteria

### Verification Commands

```bash
./node_modules/.bin/tsc --noEmit           # Expected: clean
./node_modules/.bin/vitest run             # Expected: 10/10 pass
npx eslint .storybook/preview.tsx          # Expected: 0 errors
npm run build                              # Expected: exit 0
```

### Final Checklist

- [ ] Dark mode docs page has dark background and readable text
- [ ] Light mode docs page unchanged
- [ ] High-contrast mode uses dark Storybook chrome + Fluent HC theme
- [ ] Try/catch handles MDX-only pages gracefully
- [ ] All 10 existing tests pass
- [ ] TypeScript compiles clean
- [ ] Storybook builds successfully
- [ ] Only `.storybook/preview.tsx` modified (+ .sisyphus files)

### Known Limitations

1. **5 story files with hardcoded `azureLightTheme` decorators** in `src/stories/` — individual story canvases on those docs pages will still render light regardless of global appearance. Out of scope.
2. **Manager sidebar stays light** — `.storybook/manager.ts` hardcodes a light Azure theme. Sidebar/toolbar won't toggle with docs content. Separate concern.
3. **Standalone MDX pages** — Fall back to default appearance (light) since they have no story context for globals.
