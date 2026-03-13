import React from 'react';
import { addons, types, useGlobals } from 'storybook/manager-api';
import {
  ADDON_ID,
  APPEARANCE_MODE_GLOBAL,
  APPEARANCE_MODES,
  DEFAULT_APPEARANCE,
  DEFAULT_DESIGN_SYSTEM,
  DEFAULT_PRODUCT,
  DESIGN_SYSTEM_GLOBAL,
  DESIGN_SYSTEMS,
  PRODUCT_THEME_GLOBAL,
  PRODUCT_THEMES,
} from './constants';

function ProductThemeToolbar() {
  const [globals, updateGlobals] = useGlobals();
  const selectedTheme = (globals[PRODUCT_THEME_GLOBAL] as string | undefined) ?? DEFAULT_PRODUCT;

  return React.createElement(
    'label',
    {
      title: 'Product Theme',
      style: { display: 'inline-flex', alignItems: 'center', gap: 6 },
    },
    React.createElement('span', { style: { fontSize: 12, opacity: 0.9 } }, 'Product'),
    React.createElement(
      'select',
      {
        value: selectedTheme,
        onChange: (event: React.ChangeEvent<HTMLSelectElement>) =>
          updateGlobals({ [PRODUCT_THEME_GLOBAL]: event.target.value }),
      },
      PRODUCT_THEMES.map((theme) =>
        React.createElement('option', { key: theme.id, value: theme.id }, theme.displayName),
      ),
    ),
  );
}

function AppearanceModeToolbar() {
  const [globals, updateGlobals] = useGlobals();
  const selectedMode =
    (globals[APPEARANCE_MODE_GLOBAL] as string | undefined) ?? DEFAULT_APPEARANCE;

  return React.createElement(
    'label',
    {
      title: 'Appearance Mode',
      style: { display: 'inline-flex', alignItems: 'center', gap: 6 },
    },
    React.createElement('span', { style: { fontSize: 12, opacity: 0.9 } }, 'Appearance'),
    React.createElement(
      'select',
      {
        value: selectedMode,
        onChange: (event: React.ChangeEvent<HTMLSelectElement>) =>
          updateGlobals({ [APPEARANCE_MODE_GLOBAL]: event.target.value }),
      },
      APPEARANCE_MODES.map((mode) =>
        React.createElement('option', { key: mode.id, value: mode.id }, mode.displayName),
      ),
    ),
  );
}

function DesignSystemToolbar() {
  const [globals, updateGlobals] = useGlobals();
  const selectedSystem =
    (globals[DESIGN_SYSTEM_GLOBAL] as string | undefined) ?? DEFAULT_DESIGN_SYSTEM;

  return React.createElement(
    'label',
    {
      title: 'Design System',
      style: { display: 'inline-flex', alignItems: 'center', gap: 6 },
    },
    React.createElement('span', { style: { fontSize: 12, opacity: 0.9 } }, 'Design System'),
    React.createElement(
      'select',
      {
        value: selectedSystem,
        onChange: (event: React.ChangeEvent<HTMLSelectElement>) =>
          updateGlobals({ [DESIGN_SYSTEM_GLOBAL]: event.target.value }),
      },
      DESIGN_SYSTEMS.map((system) =>
        React.createElement('option', { key: system.id, value: system.id }, system.displayName),
      ),
    ),
  );
}

addons.register(ADDON_ID, () => {
  addons.add(`${ADDON_ID}/product-theme`, {
    type: types.TOOL,
    title: 'Product Theme',
    render: () => React.createElement(ProductThemeToolbar),
  });

  addons.add(`${ADDON_ID}/appearance-mode`, {
    type: types.TOOL,
    title: 'Appearance',
    render: () => React.createElement(AppearanceModeToolbar),
  });

  addons.add(`${ADDON_ID}/design-system`, {
    type: types.TOOL,
    title: 'Design System',
    render: () => React.createElement(DesignSystemToolbar),
  });
});
