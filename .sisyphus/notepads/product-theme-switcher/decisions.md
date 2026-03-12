# Decisions — product-theme-switcher

## [2026-03-12] Architectural Decisions

### Theme Registration Pattern

- Product theme files call `registerProductTheme()` as a side-effect at module level
- `src/themes/products/index.ts` imports all product files for registration
- Preview imports `../src/themes/products` (side-effect) to trigger registration

### HC Theme Behavior

- `createHighContrastTheme()` takes NO BrandVariants args
- Product differentiation for HC comes entirely from `highContrastOverrides`
- Azure HC: `highContrastOverrides: undefined` (matches existing `createHighContrastTheme()`)

### Globals Keys

- `productTheme` — stores selected product ID (e.g., 'azure', 'logic-apps')
- `appearanceMode` — stores appearance ('light', 'dark', 'high-contrast')
- Default: `productTheme: 'azure'`, `appearanceMode: 'light'`

### Backward Compat

- `data-azure-theme` attribute must remain on `document.documentElement`
- Must be set to appearance value (not product theme)

### LLM Bundle

- Version: 1.0.0 → 2.0.0 (breaking schema change — adds themeRegistry)
- Hardcode theme registry data in script (avoid complex import resolution)
