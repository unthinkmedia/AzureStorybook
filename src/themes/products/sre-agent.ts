import type { ProductThemeDefinition } from '../types';
import type { BrandVariants } from '@fluentui/react-components';

/**
 * SRE Agent brand color ramp for site reliability engineering experiences.
 */
const sreAgentBrand: BrandVariants = {
  10: '#090E1F',
  20: '#101C3D',
  30: '#15295E',
  40: '#1A377F',
  50: '#1F45A0',
  60: '#2554C0',
  70: '#2E60D9',
  80: '#4F6BED', // Primary — SRE Agent brand purple-blue
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
 * SRE Agent product theme — site reliability engineering product.
 * Uses Fluent v9 light/dark themes with SRE Agent brand ramp.
 */
// Structural tokens (borderRadius, spacing, strokeWidth, fontWeight) moved to design-system skin layer — see src/themes/skins/
export const sreAgentProductTheme: ProductThemeDefinition = {
  id: 'sre-agent',
  displayName: 'SRE Agent',
  description: 'SRE Agent — site reliability engineering product theme',
  brand: sreAgentBrand,
  lightOverrides: {},
  darkOverrides: {},
  highContrastOverrides: undefined,
};
