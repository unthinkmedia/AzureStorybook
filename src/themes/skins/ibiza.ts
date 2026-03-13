import type { DesignSystemSkin } from './types';

export const ibizaSkin: DesignSystemSkin = {
  id: 'ibiza',
  displayName: 'Ibiza',
  description:
    'The Ibiza era (~2014) design language characterized by flat design, sharp corners, and high density.',
  sections: {
    colors: {
      colorBrandBackground: '#0072C6',
      colorBrandBackgroundHover: '#0072C6',
      colorBrandBackgroundPressed: '#0072C6',
      colorBrandBackgroundSelected: '#0072C6',
      colorCompoundBrandBackground: '#0072C6',
      colorCompoundBrandBackgroundHover: '#0072C6',
      colorCompoundBrandBackgroundPressed: '#0072C6',
      colorBrandForeground1: '#0072C6',
      colorBrandForeground2: '#0072C6',
      colorBrandForegroundLink: '#0072C6',
      colorBrandForegroundLinkHover: '#0072C6',
      colorBrandForegroundLinkPressed: '#0072C6',
      colorBrandForegroundLinkSelected: '#0072C6',
    },
    shape: {
      borderRadiusSmall: '0px',
      borderRadiusMedium: '0px',
      borderRadiusLarge: '0px',
      borderRadiusXLarge: '0px',
    },
    elevation: {
      shadow4: 'none',
      shadow8: 'none',
      shadow16: 'none',
      shadow28: 'none',
    },
    density: {
      spacingHorizontalM: '6px',
      spacingVerticalM: '4px',
      spacingHorizontalS: '4px',
      spacingVerticalS: '2px',
    },
    typography: {
      fontSizeBase300: '13px',
      fontSizeBase200: '12px',
    },
  },
};
