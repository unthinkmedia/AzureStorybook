import type { DesignSystemSkin } from '../types';

/**
 * Fluent 2 identity skin — current Fluent v9 baseline.
 * No token overrides: all sections are empty, so this skin is a passthrough.
 */
export const fluent2Skin: DesignSystemSkin = {
  id: 'fluent2',
  displayName: 'Fluent 2',
  description: 'Current Fluent v9 baseline — identity skin with no overrides',
  sections: {
    colors: {},
    shape: {},
    elevation: {},
    density: {},
    typography: {},
  },
};
