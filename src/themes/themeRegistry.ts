import {
  createDarkTheme,
  createHighContrastTheme,
  createLightTheme,
} from '@fluentui/react-components';
import type { Theme } from '@fluentui/react-components';
import type {
  AppearanceMode,
  DesignSystemId,
  ProductThemeDefinition,
  ResolvedThemeResult,
  ThemeRegistry,
} from './types';
import { flattenSkin, getSkin } from './skins';
import { azureProductTheme } from './products/azure';
import { sreAgentProductTheme } from './products/sre-agent';

const themeRegistry: ThemeRegistry = new Map<string, ProductThemeDefinition>([
  [azureProductTheme.id, azureProductTheme],
  [sreAgentProductTheme.id, sreAgentProductTheme],
]);

/**
 * Registers a product theme definition in the in-memory theme registry.
 * Throws when a duplicate product ID is provided.
 */
export function registerProductTheme(definition: ProductThemeDefinition): void {
  if (themeRegistry.has(definition.id)) {
    throw new Error(`Product theme already registered: ${definition.id}`);
  }

  themeRegistry.set(definition.id, definition);
}

/**
 * Retrieves a previously registered product theme definition by product ID.
 */
export function getProductTheme(id: string): ProductThemeDefinition | undefined {
  return themeRegistry.get(id);
}

/**
 * Returns all registered product theme definitions.
 */
export function getAllProductThemes(): ProductThemeDefinition[] {
  return Array.from(themeRegistry.values());
}

/**
 * Resolves a Fluent v9 Theme for a product ID and appearance mode.
 * Throws when the product ID is not registered.
 */
export function resolveTheme(
  productId: string,
  appearance: AppearanceMode,
  designSystem?: DesignSystemId,
): Theme {
  const definition = themeRegistry.get(productId);

  if (!definition) {
    throw new Error(`Product theme not found: ${productId}`);
  }

  let baseTheme: Theme;

  switch (appearance) {
    case 'light': {
      baseTheme = createLightTheme(definition.brand);
      break;
    }
    case 'dark': {
      baseTheme = createDarkTheme(definition.brand);
      break;
    }
    case 'high-contrast': {
      baseTheme = createHighContrastTheme();
      break;
    }
  }

  let skinOverrides: Partial<Theme> = {};

  if (designSystem !== undefined) {
    const skin = getSkin(designSystem);

    if (!skin) {
      throw new Error(`Design system skin not found: ${designSystem}`);
    }

    skinOverrides = flattenSkin(skin.sections);
  }

  let productOverrides: Partial<Theme> = {};

  switch (appearance) {
    case 'light': {
      productOverrides = definition.lightOverrides ?? {};
      break;
    }
    case 'dark': {
      productOverrides = definition.darkOverrides ?? {};
      break;
    }
    case 'high-contrast': {
      productOverrides = definition.highContrastOverrides ?? {};
      break;
    }
  }

  const theme: Theme = {
    ...baseTheme,
    ...skinOverrides,
    ...productOverrides,
  };

  const resolved: ResolvedThemeResult = {
    theme,
    productId,
    skinId: designSystem,
    appearance,
  };

  return resolved.theme;
}

/**
 * Returns a serializable snapshot of registered products for diagnostics/UI.
 */
export function getThemeRegistrySnapshot(): {
  id: string;
  displayName: string;
  description: string;
}[] {
  return Array.from(themeRegistry.values()).map((definition) => ({
    id: definition.id,
    displayName: definition.displayName,
    description: definition.description,
  }));
}
