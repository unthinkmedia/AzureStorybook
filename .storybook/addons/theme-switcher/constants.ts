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

export const DESIGN_SYSTEM_GLOBAL = 'designSystem';
export const DEFAULT_DESIGN_SYSTEM = 'fluent2';

export const DESIGN_SYSTEMS = [
  { id: 'fluent2', displayName: 'Fluent 2' },
  { id: 'coherence', displayName: 'Coherence' },
  { id: 'ibiza', displayName: 'Ibiza' },
  { id: 'fluent1', displayName: 'Fluent 1' },
  { id: 'azure-fluent', displayName: 'Azure Fluent' },
] as const;
