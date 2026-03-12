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
