import type { DesignSystemSkin } from './types';

export const coherenceSkin: DesignSystemSkin = {
  id: 'coherence',
  displayName: 'Coherence',
  description: 'Coherence era (~2019) design language with compact density and sharp corners.',
  sections: {
    colors: {
      colorBrandBackground: '#0078D4',
      colorBrandBackgroundHover: '#106EBE',
      colorBrandBackgroundPressed: '#005A9E',
      colorBrandForeground1: '#0078D4',
      colorBrandForeground2: '#0078D4',
      colorBrandStroke1: '#0078D4',
    },
    shape: {
      borderRadiusMedium: '2px',
      borderRadiusSmall: '2px',
      borderRadiusLarge: '4px',
    },
    elevation: {
      shadow4: '0 0 2px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.14)',
      shadow8: '0 0 2px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.14)',
    },
    density: {
      spacingHorizontalM: '8px',
      spacingVerticalM: '6px',
      spacingHorizontalS: '4px',
    },
    typography: {
      fontSizeBase300: '14px',
    },
  },
};
