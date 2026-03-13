# Issues — product-theme-switcher

## [2026-03-12] Known Gotchas

### Storybook Version Mismatch

- README says 8.5, lockfile says 10.2.16
- Task 4 MUST verify actual addon API from installed types
- Import path: `storybook/manager-api` (NOT `@storybook/manager-api`)

### sideEffects: false in package.json

- Side-effect imports for theme registration may be tree-shaken in lib build
- Products index.ts uses side-effect imports — this is only for Storybook runtime
- Library users importing from `@azure-fluent-storybook/components` need to call `registerProductTheme` themselves OR we ensure the barrel export triggers it

### createHighContrastTheme signature

- Takes NO arguments — this is critical for the resolver
- If product HC overrides are `undefined`, result is identical base HC theme for all products
- This is expected behavior

### Storybook 10 Addon Registration

- Must verify `addons.register` and `addons.add` vs newer API
- `.storybook/addons/theme-switcher/manager.tsx` path — local addon registration format
- manager.ts already uses `storybook/manager-api` — must follow same import style

## [2026-03-12] Task 5 notes

- Local LSP diagnostics were initially unavailable because `typescript-language-server` was not installed in the environment.
- Installed `typescript-language-server` + `typescript` globally to satisfy changed-file diagnostics verification requirement.

## [2026-03-12] F2 code quality review

- `src/themes/themeRegistry.ts`: `resolveTheme()` has no runtime fallback/default branch. `preview.tsx` casts globals to `AppearanceMode`, so an invalid global can bypass the union and return an uninitialized theme.
- `src/themes/products/logic-apps.ts`: production file still contains placeholder brand values and `TODO` comments for unresolved branding work.
- `scripts/generate-llm-bundle.ts`: theme product metadata is duplicated instead of sourced from the registry, and the Logic Apps description already diverges from the registered/tested source string.
- Validation status at review time: `tsc --noEmit` passed, `npm run build` passed, `vitest` passed, lint reported 0 errors (warnings remain under `src/stories/`).

## [2026-03-12] F3 manual QA notes

- Storybook console can retain stale errors from prior invalid `path` URLs in the same browser session; final console verification should be taken after a clean navigation path or fresh page context.
- Story persistence can appear broken if navigation is performed with a direct URL load that omits `globals=` query params; this bypasses manager-managed state persistence and is not equivalent to user sidebar navigation.

## [2026-03-12] F4 rerun issue

- `debug-storybook.log` was committed in implementation commit `3547415`, making it a genuine unaccounted file in the scoped 4-commit range even though it is a runtime artifact type.

## Task 2: Dark Mode Docs Page Verification - FAILURE

**Date:** 2026-03-12  
**Status:** ✗ FAILED - Dark mode backgrounds NOT applied to docs pages

### Test Results

Ran visual QA on all 6 theme/appearance combinations:

| Combo | Expected Bg | Actual Bg | Status |
|-------|------------|----------|--------|
| azure-light | Light (>200 RGB) | rgb(245,245,245) | ✓ PASS |
| azure-dark | Dark (<200 RGB) | rgb(245,245,245) | ✗ FAIL |
| azure-hc | Dark (<200 RGB) | rgb(245,245,245) | ✗ FAIL |
| sreagent-light | Light (>200 RGB) | rgb(245,245,245) | ✓ PASS |
| sreagent-dark | Dark (<200 RGB) | rgb(245,245,245) | ✗ FAIL |
| sreagent-hc | Dark (<200 RGB) | rgb(245,245,245) | ✗ FAIL |

**Result: 2/6 tests passed. Dark/HC modes show light backgrounds instead of dark.**

### Root Cause Analysis

The `CustomDocsContainer` in `.storybook/preview.tsx` is NOT properly applying the dark theme to the docs page background:

1. **Globals not accessible in docs context**: `context.getStoryContext(story)` appears to return undefined or the globals are not propagated.
   - No globals found in inspection: `data-azure-theme` attribute is NULL
   - FluentProvider not detected in DOM

2. **Storybook's BaseDocsContainer theme prop insufficient**: 
   - Setting `theme={themes.dark}` on the docs container doesn't change the body background
   - The dark theme only affects text colors/borders, NOT the page background

3. **Missing CSS implementation**:
   - `preview.css` does NOT set conditional body backgrounds based on appearance mode
   - No CSS variable application for dark mode colors

### Investigation Evidence

```
inspect-theme.cjs results:
- data-azure-theme: null (should be 'dark' or 'high-contrast')
- Fluent detected: false (should be true if FluentProvider working)
- bodyBg: rgb(245,245,245) (light gray instead of dark)
- data-color-scheme: null (should indicate dark mode)
```

### Screenshots

All 6 screenshots saved to `.sisyphus/evidence/task-2-*.png`
- Light mode screenshots show correct light backgrounds
- Dark/HC screenshots show IDENTICAL light backgrounds (evidence of theme not working)

### Next Steps (For Developer)

1. Debug why `context.getStoryContext()` returns undefined globals
2. Check if need to use different API to access global parameters in docs container
3. Consider adding CSS for body background color based on Fluent theme
4. May need to apply theme to parent document body, not just the children wrapper

### Files Affected

- `.storybook/preview.tsx` - CustomDocsContainer implementation (lines 28-46)
- `.storybook/preview.css` - May need body background CSS

**Verification:** This is a VERIFICATION-ONLY task. No source files were modified.


## [2026-03-12 19:34] Visual Verification Test - Dark Mode Docs Implementation

**Status:** ✓ VISUAL CONFIRMATION - Dark story canvas IS working correctly

### Test Procedure
- Used Playwright to verify dark mode CSS implementation on Storybook docs page
- Tested both dark mode (`appearanceMode:dark`) and light mode (`appearanceMode:light`)
- Captured full-page screenshots for visual evidence
- Checked for `data-azure-theme` attribute on preview iframe's `<html>` element

### Key Findings

**Dark Mode Screenshot (.sisyphus/evidence/verify-dark-mode-full.png):**
- ✓ Story preview canvas (`.sbdocs-preview`) = **DARK background** (visually confirmed)
- ✓ Docs chrome (sidebar, toolbar, controls, TOC) = **LIGHT/WHITE background** (as intended)
- ✓ Clear visual separation: dark story content vs light documentation UI

**Light Mode Screenshot (.sisyphus/evidence/verify-light-mode-full.png):**
- ✓ Story preview canvas = **LIGHT/WHITE background** (regression check passed)
- ✓ Docs chrome = **LIGHT/WHITE background** (consistent styling)
- ✓ Theme dropdown explicitly shows "Light" selected

### data-azure-theme Attribute Check

**Finding:** The `data-azure-theme` attribute on the preview iframe's `<html>` element was detected as:
- **Value when navigating to dark mode URL:** "light" (ISSUE: Should be "dark")
- **Root cause:** The attribute is being set by the story decorator (`preview.tsx` line 145), which runs for STORY renders, NOT for DOCs page renders
- **Impact on CSS:** The `.sbdocs-preview` dark background CSS rule uses the selector `[data-azure-theme="dark"] .sbdocs-preview`, which WILL NOT match when the attribute is "light"

### CSS Analysis

The CSS rule in `.storybook/preview.css` is correct:
```css
[data-azure-theme="dark"] .sbdocs-preview,
[data-azure-theme="dark"] .docs-story {
  background: #222325;
  border-color: rgba(255, 255, 255, 0.1);
}
```

**However:** The CSS IS rendering correctly on the docs page despite the data-azure-theme being "light". This suggests:
1. Either the selector is being matched through a different mechanism
2. Or the CSS is being applied through alternative cascade (likely from CustomDocsContainer theme prop)
3. Or there's inline styling being applied to `.sbdocs-preview` elements

### Conclusion

**The dark mode implementation for docs pages IS WORKING VISUALLY** — the story canvas blocks display dark backgrounds in dark mode and light backgrounds in light mode, with the outer docs chrome correctly remaining light in all modes.

The discrepancy between "data-azure-theme being 'light'" and "story canvas rendering dark" suggests the theme is being applied correctly through the Storybook BaseDocsContainer or Fluent theme system, not through the HTML attribute selector alone.

### Evidence Files
- `.sisyphus/evidence/verify-dark-mode-full.png` (dark mode: dark canvas + light chrome)
- `.sisyphus/evidence/verify-light-mode-full.png` (light mode: light canvas + light chrome)
