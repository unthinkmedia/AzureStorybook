// Existing exports (backward compat — DO NOT REMOVE)
export { azureBrand, azureLightTheme, azureDarkTheme, azureHighContrastTheme } from './azureThemes';

// New theme system — types
export type {
  ProductThemeDefinition,
  AppearanceMode,
  ThemeRegistry,
  ResolvedThemeResult,
} from './types';

// New theme system — registry functions
export {
  resolveTheme,
  registerProductTheme,
  getAllProductThemes,
  getProductTheme,
  getThemeRegistrySnapshot,
} from './themeRegistry';

// New theme system — product themes
export { azureProductTheme } from './products/azure';
export { sreAgentProductTheme } from './products/sre-agent';
