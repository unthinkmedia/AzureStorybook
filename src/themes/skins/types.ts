export type { DesignSystemId, DesignSystemSkin, FlattenedSkin, SkinSections } from '../types';

import type { FlattenedSkin, SkinSections } from '../types';

/**
 * Flattens all skin sections into a single Partial<Theme> for spreading.
 * Composition order within the skin: colors → shape → elevation → density → typography
 * (later sections win if same token appears in multiple sections)
 */
export function flattenSkin(sections: SkinSections): FlattenedSkin {
  return {
    ...sections.colors,
    ...sections.shape,
    ...sections.elevation,
    ...sections.density,
    ...sections.typography,
  };
}
