import type { ProductThemeDefinition } from '../types';
import { registerProductTheme } from '../themeRegistry';
import type { BrandVariants } from '@fluentui/react-components';

/**
 * Logic Apps brand color ramp — placeholder values for system validation.
 * TODO: Replace with official Logic Apps brand guidelines when finalized.
 */
const logicAppsBrand: BrandVariants = {
  10: '#090E1F',
  20: '#101C3D',
  30: '#15295E',
  40: '#1A377F',
  50: '#1F45A0',
  60: '#2554C0',
  70: '#2E60D9',
  80: '#4F6BED', // Primary — Logic Apps brand purple-blue
  90: '#6B83F0',
  100: '#879BF3',
  110: '#9DAFFA',
  120: '#B0C0FC',
  130: '#C4D1FD',
  140: '#D8E1FE',
  150: '#E8EDFE',
  160: '#F4F6FF',
};

/**
 * Logic Apps product theme — workflow automation product.
 * Uses stock Fluent v9 light/dark themes with Logic Apps brand ramp.
 * TODO: Add Logic Apps-specific token overrides when brand guidelines are finalized.
 */
export const logicAppsProductTheme: ProductThemeDefinition = {
  id: 'logic-apps',
  displayName: 'Logic Apps',
  description: 'Azure Logic Apps — workflow automation product theme (placeholder tokens)',
  brand: logicAppsBrand,
  lightOverrides: undefined,
  darkOverrides: undefined,
  highContrastOverrides: undefined,
};

registerProductTheme(logicAppsProductTheme);
