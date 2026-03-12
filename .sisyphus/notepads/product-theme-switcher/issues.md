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
