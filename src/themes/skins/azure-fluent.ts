import type { DesignSystemSkin } from './types';

export const azureFluentSkin: DesignSystemSkin = {
  id: 'azure-fluent',
  displayName: 'Azure Fluent',
  description: 'Transitional Azure Fluent skin bridging Coherence and Fluent 2',
  sections: {
    colors: {
      colorBrandBackground: '#0078D4',
      colorBrandForeground1: '#0078D4',
      colorBrandForeground2: '#0078D4',
      colorBrandStroke1: '#0078D4',
    },
    shape: {
      borderRadiusMedium: '2px',
      borderRadiusLarge: '4px',
    },
    elevation: {
      shadow4: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.14)',
    },
    density: {
      spacingHorizontalM: '8px',
      spacingVerticalM: '8px',
    },
    typography: {
      fontSizeBase300: '14px',
    },
  },
};
