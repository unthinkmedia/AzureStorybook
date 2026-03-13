# Design System Skins - Learnings

## Task 1: Azure Themes Snapshot Tests

**Completion Date:** 2026-03-13

**What was done:**

- Created `src/themes/__tests__/azureThemes.snapshot.test.ts` with 3 Vitest snapshot tests
- Tests freeze behavior of 3 theme exports: azureLightTheme, azureDarkTheme, azureHighContrastTheme
- Generated 63KB snapshot file with complete theme token definitions

**Key learnings:**

1. Vitest snapshots auto-generate .snap files in `__snapshots__/` directory adjacent to test
2. Theme objects contain 400+ color, border-radius, shadow, and typography tokens
3. azureLightTheme colorNeutralBackground1 is #ffffff (white), confirming light theme base
4. Snapshot approach preserves legacy behavior as regression protection
5. Test pattern: import from `'vitest'` and use standard describe/it/expect

**Pattern used:**

```typescript
import { describe, expect, it } from 'vitest';
import { azureLightTheme, azureDarkTheme, azureHighContrastTheme } from '../azureThemes';

describe('azureThemes snapshots', () => {
  it('azureLightTheme matches snapshot', () => {
    expect(azureLightTheme).toMatchSnapshot();
  });
  // ... more tests
});
```

**Result:** All 3 tests pass, snapshot file locked for regression detection

**Related files:**

- Source: `src/themes/azureThemes.ts`
- Test: `src/themes/__tests__/azureThemes.snapshot.test.ts` (504 bytes)
- Snapshot: `src/themes/__tests__/__snapshots__/azureThemes.snapshot.test.ts.snap` (62KB, 1393 lines)

## Task 2: Theme Type Contract Lock for Design System Skins

**Completion Date:** 2026-03-13

**What was done:**

- Added skin contract types to `src/themes/types.ts`: `DesignSystemId`, `SkinSections`, `DesignSystemSkin`, `FlattenedSkin`
- Updated `ResolvedThemeResult` with optional `skinId?: DesignSystemId`
- Added `src/themes/__tests__/types.test.ts` using `expectTypeOf` for static contract checks

**Key learnings:**

1. Keep skin modeling structured by semantic sections (`colors`, `shape`, `elevation`, `density`, `typography`) rather than a single monolithic skin object to preserve intent boundaries.
2. `Theme` from Fluent v9 remains a flat token record, so each section is still `Partial<Theme>` while organizational semantics are enforced by key grouping.
3. Optional field verification at type level is reliable with `Omit<T, 'k'> extends T` plus direct union checks (`DesignSystemId | undefined`).
4. Existing runtime tests (`themeRegistry.test.ts`) remained stable after pure type-surface additions, confirming backward compatibility.

**Verification summary:**

- `bun run build`: PASS
- `bun run test src/themes/__tests__/types.test.ts`: PASS (4 tests)
- `bun run test src/themes/__tests__/themeRegistry.test.ts`: PASS (10 tests)
- LSP diagnostics clean for changed files

## Task 3: Failing Composition Tests for 3-Layer Precedence

**Completion Date:** 2026-03-13

**What was done:**

- Added `describe('3-axis composition')` block in `src/themes/__tests__/themeRegistry.test.ts`
- 1 non-skipped test (backward-compat): `resolveTheme('azure', 'light')` 2-arg usage still works
- 4 skipped tests (specs for Task 7):
  1. **fluent2 identity**: skin is no-op pass-through
  2. **coherence shape**: applies shape overrides (`borderRadiusMedium = '0px'`)
  3. **ibiza shape**: applies shape overrides (`borderRadiusMedium = '0px'`)
  4. **product-color-precedence**: product overrides survive even with skin applied
- All skipped tests use `// @ts-expect-error` for the 3-arg overload (not yet implemented)

**Key learnings:**

1. `it.skip(...)` is the correct Vitest syntax for skipped tests (not `xit` or `test.skip`)
2. Composition rule (future): `{ ...appearanceBase, ...flattenedSkin, ...productOverrides }` — product ALWAYS wins
3. Fluent2 skin is identity/no-op: returns same output as 2-arg call
4. Coherence and Ibiza eras had NO border radius (sharp corners = `'0px'`)
5. Skipped tests document expected behavior for Task 7 implementation

**Test results:**

- Total test files: 3 passed
- Total tests: 18 passed | 4 skipped (22 total)
- Existing 10 tests in themeRegistry: all still passing
- New 1 backward-compat test: passing
- New 4 skipped tests: properly marked with `it.skip(...)`

**Related files:**

- Modified: `src/themes/__tests__/themeRegistry.test.ts` (137 lines, +39 new)
- Evidence: `.sisyphus/evidence/task-3-composition-tests.txt`

## Task 4: SRE Agent Refactored to Brand/Identity-Only

**Completion Date:** 2026-03-13
**What was done:**

- Removed all structural token overrides (borderRadius, spacing, strokeWidth, fontWeight) from sre-agent.ts
- lightOverrides and darkOverrides set to {} (empty — no color overrides existed either)
- Updated themeRegistry.test.ts: removed old "non-color token overrides" test, added new test asserting default Fluent structural tokens
  **Key learnings:**
- Product themes should carry brand/identity tokens only; structural tokens belong in design-system skin composition.
- When removing product-level structural overrides, assert against removed legacy values (e.g., borderRadiusMedium !== '8px') to prevent regressions.

## Task 9: Third Toolbar Dropdown (Design System)

**Completion Date:** 2026-03-13

**What was done:**

- Added `DESIGN_SYSTEM_GLOBAL`, `DEFAULT_DESIGN_SYSTEM`, `DESIGN_SYSTEMS` to imports in `.storybook/addons/theme-switcher/manager.tsx`
- Created `DesignSystemToolbar` function component following exact pattern of `ProductThemeToolbar` (lines 13-39)
- Registered new dropdown with `addons.add(\`${ADDON_ID}/design-system\`, ...)` inside existing addon registration block
- Used `React.createElement` (NOT JSX) consistent with manager file style
- `bun run build` executed successfully with zero errors

**Key learnings:**

- Manager file patterns are rigid: 3 identical toolbar components sharing same hook/select/map structure. New dropdowns can be copy-pasted reliably.
- Component structure: `useGlobals()` hook → fallback to DEFAULT → React.createElement label+span+select+options
- All 5 DESIGN_SYSTEMS entries (Fluent 2, Coherence, Ibiza, Fluent 1, Azure Fluent) are available from constants.ts (Task 5)
- No JSX allowed in manager files (Storybook internal constraint)
- `types.TOOL` is the correct Storybook type for toolbar dropdowns

**Pattern used:**

```typescript
// Import additions to line 11:
(DESIGN_SYSTEM_GLOBAL,
  DEFAULT_DESIGN_SYSTEM,
  DESIGN_SYSTEMS,
  // New component (lines 67-91):
  function DesignSystemToolbar() {
    const [globals, updateGlobals] = useGlobals();
    const selectedSystem =
      (globals[DESIGN_SYSTEM_GLOBAL] as string | undefined) ?? DEFAULT_DESIGN_SYSTEM;

    return React.createElement(
      'label',
      { title: 'Design System', style: { display: 'inline-flex', alignItems: 'center', gap: 6 } },
      React.createElement('span', { style: { fontSize: 12, opacity: 0.9 } }, 'Design System'),
      React.createElement(
        'select',
        {
          value: selectedSystem,
          onChange: (event) => updateGlobals({ [DESIGN_SYSTEM_GLOBAL]: event.target.value }),
        },
        DESIGN_SYSTEMS.map((system) =>
          React.createElement('option', { key: system.id, value: system.id }, system.displayName),
        ),
      ),
    );
  });

// Registration (lines 106-110):
addons.add(`${ADDON_ID}/design-system`, {
  type: types.TOOL,
  title: 'Design System',
  render: () => React.createElement(DesignSystemToolbar),
});
```

**Result:** manager.tsx now has 111 lines, build succeeds, third toolbar dropdown ready for UI testing

**Related files:**

- Modified: `.storybook/addons/theme-switcher/manager.tsx` (111 lines)
- Constants (Task 5): `.storybook/addons/theme-switcher/constants.ts` (DESIGN_SYSTEM_GLOBAL, etc.)
- Evidence: `.sisyphus/evidence/task-9-toolbar-dropdown.txt`

## Task 6: Skin Registry + Fluent 2 Identity Skin

**Completion Date:** 2026-03-13
**What was done:**

- Created src/themes/skins/ directory with types.ts, fluent2.ts, index.ts
- flattenSkin() spreads sections in order: colors → shape → elevation → density → typography
- fluent2 is identity/no-op — all sections empty → flattenSkin returns {}
- skinRegistry is a Map<DesignSystemId, DesignSystemSkin>
- registerSkin() throws on duplicate IDs (same pattern as product registry)
  **Key learnings:**
- Mirroring the existing product registry structure keeps behavior and error semantics consistent across product/skin layers.
- Keeping fluent2 as an explicit identity skin establishes a stable baseline for future skin composition without changing current theme output.

## Task 7: resolveTheme Extended to 3-Axis

**Completion Date:** 2026-03-13
**What was done:**

- Extended resolveTheme to accept optional designSystem?: DesignSystemId
- Composition order: { ...appearanceBase, ...skinOverrides, ...productOverrides }
- When designSystem undefined: skinOverrides = {} (backward compat, zero overhead)
- getSkin() returns undefined for unregistered IDs → throws descriptive error
- fluent2 identity test un-skipped and passing
- Added invalid-skin throw test
- Removed @ts-expect-error from all 4 skipped tests (3rd arg now typed)
- Remaining 3 it.skip tests annotated: RED: Enable after Tasks 12-15
  **Key learnings:**
- Applying skin composition only when a designSystem is provided preserves exact 2-arg runtime behavior and avoids unnecessary registry lookups.
- Keeping product overrides as the final spread reliably enforces product precedence regardless of skin token content.

## Task 8: Thread designSystem Through preview.tsx + CSS Vars

**Completion Date:** 2026-03-13

**What was done:**

- Updated `.storybook/preview.tsx` imports to include `DESIGN_SYSTEM_GLOBAL`, `DEFAULT_DESIGN_SYSTEM`, and `DesignSystemId`
- Added `designSystem` to `globalTypes` with default value `DEFAULT_DESIGN_SYSTEM` (`'fluent2'`)
- Extended preview decorator to read `context.globals[DESIGN_SYSTEM_GLOBAL]` (with fallback), cast to `DesignSystemId`, and call `resolveTheme(productId, appearance, designSystem)`
- Synced `data-design-system` on `document.documentElement` in both decorator and `CustomDocsContainer`
- Extended `CustomDocsContainer` channel-driven globals tracking to include `DESIGN_SYSTEM_GLOBAL` alongside existing appearance sync

**Key learnings:**

1. Storybook docs pages need independent global syncing via channel events (`GLOBALS_UPDATED`/`SET_GLOBALS`) to keep root `data-*` attributes aligned outside normal story decorator rendering.
2. Keeping both `data-azure-theme` and `data-design-system` in sync preserves existing dark/HC CSS behavior while enabling design-system-specific CSS vars.
3. Typing toolbar global reads with concrete unions (`DesignSystemId`) avoids unsafe string propagation into theme resolution.

**Verification summary:**

- `lsp_diagnostics` clean for `.storybook/preview.tsx`
- `bun run build`: PASS (`BUILD_EXIT_CODE=0`)
- Evidence saved: `.sisyphus/evidence/task-8-preview-wired.txt`

## Task 11: Refactor Azure Product Theme to Brand/Identity-Only

**Completion Date:** 2026-03-13

**What was done:**

- Extracted Azure light color overrides into `azureColorOverrides` in `src/themes/products/azure.ts`
- Updated product definition to reference `lightOverrides: azureColorOverrides`
- Added required JSDoc clarifying Azure overrides are color-only and structural tokens come from the skin layer
- Added test coverage in `src/themes/__tests__/themeRegistry.test.ts`:
  - explicit equality check for `resolveTheme('azure', 'light', 'fluent2')` vs `resolveTheme('azure', 'light')`
  - assertion that `azure.ts` contains no structural token assignments (`borderRadius*`, `spacing*`, `strokeWidth*`, `fontWeight*`)

**Key learnings:**

1. Naming color override blocks (instead of inline object literals) improves auditability without changing runtime composition output.
2. Structural token absence is safest to enforce with assignment-pattern assertions, avoiding false positives from documentation text.
3. The Fluent2 identity skin contract is best protected by an explicit deep-equality regression test, even if similar tests already exist.

**Verification summary:**

- `bun run test src/themes/__tests__/azureThemes.snapshot.test.ts`: PASS (3/3)
- `bun run test`: PASS (26 passed, 3 skipped)
- LSP diagnostics clean for changed files:
  - `src/themes/products/azure.ts`
  - `src/themes/__tests__/themeRegistry.test.ts`
- Evidence saved: `.sisyphus/evidence/task-11-azure-unchanged.txt`

- Task 13: Added azure-fluent transitional skin. The key distinction from Coherence is in the `shadow4` elevation token. Coherence has a very subtle flatter shadow, whereas azure-fluent uses `'0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.14)'` to indicate slightly more depth while retaining the compact `8px` density and `2px` border-radius.
- Created fluent1 skin with '10px' density, '2px' border radius, and standard #0078D4 color.

### Task 14: Ibiza Skin implementation
* When implementing the Ibiza era skin, overriding all `borderRadius` variables to `0px` works perfectly to ensure the flat, Metro-style aesthetic.
* Setting shadows to `none` effectively flattens the UI depth hierarchy as well.
* We must be cautious of concurrently running tests editing shared files like `themeRegistry.test.ts` and `skinRegistry.test.ts`. Using AST matching or robust diff tools is necessary, or alternatively `sed` to insert changes. Appending to test files at the end using `sed` or raw text blocks bypasses strict index/offset races when multiple agents modify a test block.
- Coherence skin created with ~41 token overrides including 2px border radius, tight spacing, and #0078D4 brand colors. Added tests, all passing.

### Task 17: Cards & Collection Surface Tokenization
- Mapped specific hardcoded px values (like `16px`, `8px`, `20px`) to layout spacing tokens (e.g. `spacingHorizontalL`, `spacingVerticalS`, `spacingHorizontalXL`).
- Outlines for focus states in elements (`outlineOffset: '2px'`) do not have direct Fluent token mappings for offset, but `outlineWidth: '2px'` safely maps to `tokens.strokeWidthThick`.
- Certain measurements naturally function as structural boundaries (`minWidth`, `maxWidth`) and fixed component frames (fixed card height/width), so they were intentionally excluded from spacing token mappings.

## Navigation/Command-Surface Cleanup (Task 16)
- When converting components to be tokenized, layout properties like `minWidth` and `maxWidth` used for actual layout stability (e.g. side nav width or search max-width) often don't have suitable tokens and should remain explicitly set and commented (e.g., `// layout constant`, `// functional layout minimum`).
- Using spacing tokens for non-spacing dimensions (like fixed `width`/`height` of icons and interactive elements where size tokens aren't available) with `// closest available token` helps maintain system consistency while acknowledging the token compromise.
- `0px` values are effectively zero and don't require unit removal in CSS, but converting them to `0` or omitting the unit is cleaner practice.
- The `makeStyles` (GriffEL) system works seamlessly with Fluent v9 `tokens.*` interpolations inside template literals or directly referencing the strings.

### Task 18 - Panels/Drawers/Dialog Token Cleanup
- Added exemptions (`// functional layout`) to complex structural values like widths (`180px`, `540px`, `28px` icons) that shouldn't conform to Fluent tokens directly.
- Preserved animation transition boundaries (e.g., `0px` to `500px` max-height expansion) as they are visual states rather than thematic spacing tokens.
- SVG gradients require internal linearGradient `stop` color codes to be explicitly ignored, as styling SVG `<stop>` tags with CSS variables requires a different configuration context not yet available here.

### Task 19: Indicators & Headers Hardcode Cleanup
- Replacing arbitrary pixel spacing/sizing values using fluent `tokens.*` mappings ensures better scalable design configurations across headers and wizards.
- We handled SVG gradients correctly by leaving the raw hexes in `<stop>` inline styles but properly documented them as Exempt layout elements (so they won't flag regex analyzers).
- Functional layouts and strict component container metrics (like max sizes or icon boundaries) were kept as `px` strings with strict explanatory comments so components don't degrade.
- The `WizardNav` components successfully transitioned from custom hex states (`#107c10`, `#d13438`) to Fluent UI semantic Status Backgrounds (`tokens.colorStatusSuccessBackground3`, `tokens.colorStatusDangerBackground3`) which better integrates wizard semantics into light/dark token structures.
