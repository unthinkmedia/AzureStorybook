import type { DesignSystemId, DesignSystemSkin } from '../types';
import { fluent2Skin } from './fluent2';
import { coherenceSkin } from './coherence';
import { azureFluentSkin } from './azure-fluent';
import { fluent1Skin } from './fluent1';

export { flattenSkin, flattenSkinStructural } from './types';
export type { DesignSystemId, DesignSystemSkin, FlattenedSkin, SkinSections } from './types';

const skinRegistry = new Map<DesignSystemId, DesignSystemSkin>();

/**
 * Retrieves a registered design system skin by ID.
 * Returns undefined when the skin is not registered.
 */
export function getSkin(id: DesignSystemId): DesignSystemSkin | undefined {
  return skinRegistry.get(id);
}

/**
 * Returns all registered design system skins.
 */
export function getAllSkins(): DesignSystemSkin[] {
  return Array.from(skinRegistry.values());
}

/**
 * Registers a new design system skin.
 * Throws when a skin with the same ID is already registered.
 */
export function registerSkin(skin: DesignSystemSkin): void {
  if (skinRegistry.has(skin.id)) {
    throw new Error(`Design system skin already registered: ${skin.id}`);
  }
  skinRegistry.set(skin.id, skin);
}

// Register initial skins
registerSkin(fluent2Skin);
registerSkin(coherenceSkin);
registerSkin(azureFluentSkin);
registerSkin(fluent1Skin);

import { ibizaSkin } from './ibiza';
registerSkin(ibizaSkin);
