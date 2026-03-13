# Task 2: Storybook Dark Mode Docs Page Verification Report

**Test Date:** 2026-03-12  
**Tester:** Visual QA Automation  
**Status:** ✗ **FAILED** — Dark mode not working on docs pages

---

## Executive Summary

**VERIFICATION FAILURE**: The dark mode fix for Storybook docs pages is **not working**.

- Light mode (azure, sre-agent): ✓ **PASS** (2/2)
- Dark mode (azure, sre-agent): ✗ **FAIL** (0/2) — Shows light background instead
- High Contrast mode (azure, sre-agent): ✗ **FAIL** (0/2) — Shows light background instead

**Overall: 2/6 tests passed (33%)**

---

## Test Methodology

### Test Execution
- Started Storybook dev server (`npm run dev` on port 6006)
- Navigated to docs pages with all 6 theme/appearance combinations via Playwright browser automation
- Waited 2 seconds for full rendering
- Captured computed background color of `body` element
- Took full-page screenshots

### Verification Criteria
- **Light mode** → background color must be light (R, G, B all > 200)
- **Dark/HC mode** → background color must NOT be light (at least one channel < 200)

---

## Test Results

| Theme | Appearance | Expected Bg | Actual Bg | Test Result | Screenshot |
|-------|-----------|-------------|-----------|------------|------------|
| azure | light | Light | rgb(245,245,245) | ✓ PASS | task-2-azure-light.png |
| azure | dark | **Dark** | rgb(245,245,245) | ✗ FAIL | task-2-azure-dark.png |
| azure | high-contrast | **Dark** | rgb(245,245,245) | ✗ FAIL | task-2-azure-hc.png |
| sre-agent | light | Light | rgb(245,245,245) | ✓ PASS | task-2-sreagent-light.png |
| sre-agent | dark | **Dark** | rgb(245,245,245) | ✗ FAIL | task-2-sreagent-dark.png |
| sre-agent | high-contrast | **Dark** | rgb(245,245,245) | ✗ FAIL | task-2-sreagent-hc.png |

### Key Finding
**All 6 screenshots show identical light backgrounds (`rgb(245,245,245)`)** regardless of appearance mode setting. This is definitive evidence that the appearance mode global is not being applied to the docs page.

---

## Root Cause Analysis

### Problem
The `CustomDocsContainer` component in `.storybook/preview.tsx` (lines 28-46) is NOT successfully applying the dark theme to the docs page background.

### Evidence
1. **Globals not propagated**: `data-azure-theme` attribute is NULL (should be 'dark' or 'high-contrast')
2. **FluentProvider not active**: No Fluent v9 theme CSS applied to docs container
3. **Storybook docs theme prop insufficient**: Setting `theme={themes.dark}` on BaseDocsContainer only affects text colors, not backgrounds
4. **No CSS fallback**: `.storybook/preview.css` contains no conditional body background CSS

### Code Issue
```tsx
// .storybook/preview.tsx line 40
const docsTheme = appearance === 'dark' || appearance === 'high-contrast' ? themes.dark : themes.light;
return (
  <BaseDocsContainer context={context} theme={docsTheme} {...rest}>
    <FluentProvider theme={fluentTheme}>{children}</FluentProvider>
  </BaseDocsContainer>
);
```

**Problem**: The `theme` prop is passed but globals appear undefined, suggesting `context.getStoryContext()` fails in the docs container context.

---

## Implementation Status

### What Was Implemented (Task 1)
- ✓ CustomDocsContainer created in preview.tsx
- ✓ Resolver function `resolveTheme(productId, appearance)` exists
- ✓ FluentProvider wrapped around children

### What Is NOT Working
- ✗ Globals not accessible in docs context
- ✗ Dark theme not applied to docs page backgrounds
- ✗ Body element remains light background in dark mode

---

## Screenshots
All 6 test screenshots captured and saved:
- `task-2-azure-light.png` — ✓ Correct (light background)
- `task-2-azure-dark.png` — ✗ Wrong (shows light, should be dark)
- `task-2-azure-hc.png` — ✗ Wrong (shows light, should be dark)
- `task-2-sreagent-light.png` — ✓ Correct (light background)
- `task-2-sreagent-dark.png` — ✗ Wrong (shows light, should be dark)
- `task-2-sreagent-hc.png` — ✗ Wrong (shows light, should be dark)

---

## Recommendations for Fix

1. **Debug globals access**: Verify if `context.getStoryContext()` is the correct API in Storybook 10 for docs containers
2. **Alternative approach**: Use `context.store?.globals` directly instead of `storyById()` / `getStoryContext()`
3. **CSS fallback**: Add body background CSS based on data attributes
4. **Test in isolation**: Verify FluentProvider is mounting in docs container by checking DOM

---

## Conclusion

**The dark mode fix for Storybook docs pages is incomplete and not functional.** While light mode works correctly, dark and high-contrast modes fail to apply dark backgrounds to the docs page. This requires developer investigation and source code modifications to resolve.

**This task is a verification-only exercise — no source files were modified during testing.**

