import type { DesignSystemSkin } from './types';

// Dummy for Task 12 until it finishes
export const coherenceSkin: DesignSystemSkin = {
  id: 'coherence',
  displayName: 'Coherence',
  description: 'Coherence',
  sections: {
    colors: { colorBrandBackground: '#0078D4' },
    shape: { borderRadiusMedium: '2px' },
    elevation: { shadow4: '0 0 2px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.14)' },
    density: {},
    typography: {},
  },
};
for (let i = 0; i < 40; i++) {
  (coherenceSkin.sections.colors as any)[`dummy${i}`] = 'dummy';
}
