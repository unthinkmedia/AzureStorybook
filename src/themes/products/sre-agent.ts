import type { ProductThemeDefinition } from '../types';
import { registerProductTheme } from '../themeRegistry';
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
 * Uses Fluent v9 light/dark themes with SRE Agent brand ramp and structural token overrides.
 */
export const sreAgentProductTheme: ProductThemeDefinition = {
  id: 'sre-agent',
  displayName: 'SRE Agent',
  description: 'SRE Agent — site reliability engineering product theme',
  brand: sreAgentBrand,
  lightOverrides: {
    // Rounder corners — SRE Agent page containers use borderRadius: 24px
    // Scale: 4 → 8 → 16 → 24 (vs Fluent default 2 → 4 → 8 → 12)
    borderRadiusSmall: '4px',
    borderRadiusMedium: '8px',
    borderRadiusLarge: '16px',
    borderRadiusXLarge: '24px',

    // Slightly thicker strokes for a bolder feel
    strokeWidthThin: '1.5px',
    strokeWidthThick: '2.5px',

    // Tighter spacing — toolbar/filter bars use gap: 10px
    spacingHorizontalS: '6px',
    spacingHorizontalM: '10px',
    spacingHorizontalL: '14px',
    spacingVerticalS: '6px',
    spacingVerticalM: '10px',
    spacingVerticalL: '14px',

    // Heavier semibold for page titles (Text weight="semibold")
    fontWeightSemibold: 650,
  },
  darkOverrides: {
    // Same structural overrides as light
    borderRadiusSmall: '4px',
    borderRadiusMedium: '8px',
    borderRadiusLarge: '16px',
    borderRadiusXLarge: '24px',
    strokeWidthThin: '1.5px',
    strokeWidthThick: '2.5px',
    spacingHorizontalS: '6px',
    spacingHorizontalM: '10px',
    spacingHorizontalL: '14px',
    spacingVerticalS: '6px',
    spacingVerticalM: '10px',
    spacingVerticalL: '14px',
    fontWeightSemibold: 650,
  },
  highContrastOverrides: undefined,
};

registerProductTheme(sreAgentProductTheme);
