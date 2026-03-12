# Task 4: Storybook 10 Addon API Research

## Date: 2026-03-12

## Summary

Full investigation of the Storybook 10.2.16 addon API via installed type definitions at
`node_modules/storybook/dist/manager-api/index.d.ts`.

---

## 1. Correct Import Paths (SB10)

```typescript
// Manager context (toolbar addon registration):
import { addons, types, useGlobals, useAddonState } from 'storybook/manager-api';

// Preview context (decorator globals):
import { useGlobals } from '@storybook/preview-api';
```

**CONFIRMED**: This project already uses `storybook/manager-api` in `.storybook/manager.ts`.

---

## 2. `addons` — AddonStore API

```typescript
declare class AddonStore {
  add(id: string, addon: Addon_BaseType | ...): void;
  register(id: string, callback: (api: API) => void): void;
  getElements<T extends Addon_Types>(type: T): Addon_Collection<Addon_TypesMapping[T]>;
  setConfig(value: Addon_Config): void;
  getConfig(): Addon_Config;
}
declare const addons: AddonStore;
```

- `addons.register(id, callback)` — registers an addon loader; called at manager load time
- `addons.add(id, addonDef)` — adds a toolbar/panel item to the addon store

---

## 3. `types` — Addon type constants

```typescript
// Exported as:
export { typesX as types };
// where typesX = typeof Addon_TypesEnum

// Addon_TypesEnum values include:
// types.TOOL        → toolbar item
// types.PANEL       → panel (bottom tab)
// types.PREVIEW     → preview wrapper
// types.experimental_PAGE
// types.experimental_TEST_PROVIDER
```

**Usage**: `addons.add('my-addon/toolbar', { type: types.TOOL, ... })`

---

## 4. `useGlobals()` Hook (manager context)

```typescript
declare function useGlobals(): [
  globals: Globals,
  updateGlobals: (newGlobals: Globals) => void,
  storyGlobals: Globals,
  userGlobals: Globals,
];
```

- **Return[0]** `globals` — merged globals (user + story)
- **Return[1]** `updateGlobals` — setter, call with partial object e.g. `updateGlobals({ productTheme: 'logic-apps' })`
- **Return[2]** `storyGlobals` — story-level globals
- **Return[3]** `userGlobals` — user-set globals (persisted)

---

## 5. Toolbar Addon Registration Pattern

```typescript
// .storybook/addons/theme-switcher/manager.tsx
import { addons, types, useGlobals } from 'storybook/manager-api';
import React from 'react';

const ADDON_ID = 'azure-storybook/theme-switcher';
const PRODUCT_THEME_ID = `${ADDON_ID}/product-theme`;
const APPEARANCE_ID = `${ADDON_ID}/appearance`;

addons.register(ADDON_ID, () => {
  addons.add(PRODUCT_THEME_ID, {
    type: types.TOOL,
    title: 'Product Theme',
    render: () => <ProductThemeToolbar />,
  });
  addons.add(APPEARANCE_ID, {
    type: types.TOOL,
    title: 'Appearance',
    render: () => <AppearanceToolbar />,
  });
});

function ProductThemeToolbar() {
  const [globals, updateGlobals] = useGlobals();
  const current = globals.productTheme ?? 'azure';
  return (
    <select value={current} onChange={e => updateGlobals({ productTheme: e.target.value })}>
      <option value="azure">Azure</option>
      <option value="logic-apps">Logic Apps</option>
    </select>
  );
}
```

---

## 6. Preview Globals (decorator side)

In `.storybook/preview.tsx`, the decorator reads globals using:

```typescript
// preview-api provides useGlobals for the canvas/preview context
import { useGlobals } from '@storybook/preview-api';
// OR in the decorator function signature:
const withThemeDecorator = (Story, context) => {
  const { globals } = context;
  const productTheme = globals.productTheme ?? 'azure';
  const appearance = globals.appearance ?? 'light';
  // ...
};
```

Global types are declared in `preview.ts` (or `preview.tsx`) exports:

```typescript
export const globalTypes = {
  productTheme: {
    name: 'Product Theme',
    defaultValue: 'azure',
  },
  appearance: {
    name: 'Appearance',
    defaultValue: 'light',
  },
};
```

---

## 7. Registering the addon in `main.ts`

Local addons can be registered by adding the path to `addons` array in `.storybook/main.ts`:

```typescript
addons: [
  './.storybook/addons/theme-switcher/manager', // local addon
  // remove '@storybook/addon-themes' since we're replacing it
],
```

---

## 8. `@storybook/addon-themes` — Can it coexist?

`@storybook/addon-themes` uses `withThemeByDataAttribute` which applies `data-theme` attributes.
Our custom addon will use globals + FluentProvider — a different mechanism.

**Recommendation**: REMOVE `@storybook/addon-themes` from `main.ts` addons when Task 9 lands,
to avoid duplicate toolbar items and conflicting globals. The `withThemeByDataAttribute` decorator
in `preview.tsx` must also be removed (Task 10).

---

## Verification

```
$ grep -c "useGlobals\|addons.register\|addons.add\|types.TOOL\|toolbar" .sisyphus/evidence/task-4-addon-api-research.md
```

Expected: count >= 5 ✅ (all key topics present)
