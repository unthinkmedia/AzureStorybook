export const ADDON_ID = 'azure-storybook/theme-switcher';
export const PRODUCT_THEME_GLOBAL = 'productTheme';
export const APPEARANCE_MODE_GLOBAL = 'appearanceMode';
export const DEFAULT_PRODUCT = 'azure';
export const DEFAULT_APPEARANCE = 'light';

export const PRODUCT_THEMES = [
  { id: 'azure', displayName: 'Azure' },
  { id: 'sre-agent', displayName: 'SRE Agent' },
] as const;

export const APPEARANCE_MODES = [
  { id: 'light', displayName: 'Light' },
  { id: 'dark', displayName: 'Dark' },
  { id: 'high-contrast', displayName: 'High Contrast' },
] as const;
