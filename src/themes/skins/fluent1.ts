import type { DesignSystemSkin } from '../types';

/**
 * Fluent 1 skin (~2020)
 * Pre-Fluent 2 era. Standard density, moderate shadows, subtle border radius.
 */
export const fluent1Skin: DesignSystemSkin = {
  id: 'fluent1',
  displayName: 'Fluent 1',
  description: 'Pre-Fluent 2 era. Standard density, moderate shadows, subtle border radius.',
  sections: {
    colors: {
      colorBrandBackground: '#0078D4',
      colorBrandBackgroundHover: '#106EBE',
      colorBrandBackgroundPressed: '#005A9E',
    },
    shape: {
      borderRadiusMedium: '2px',
    },
    elevation: {
      shadow4: '0 1px 2px rgba(0,0,0,0.14), 0 0 2px rgba(0,0,0,0.12)',
    },
    density: {
      spacingHorizontalM: '10px',
    },
    typography: {
      fontSizeBase300: '14px',
    },
  },
};
