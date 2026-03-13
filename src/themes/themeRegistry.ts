import {
  createDarkTheme,
  createHighContrastTheme,
  createLightTheme,
} from '@fluentui/react-components';
import type { Theme } from '@fluentui/react-components';
import type {
  AppearanceMode,
  ProductThemeDefinition,
  ResolvedThemeResult,
  ThemeRegistry,
} from './types';

const themeRegistry: ThemeRegistry = new Map<string, ProductThemeDefinition>();

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
export function resolveTheme(productId: string, appearance: AppearanceMode): Theme {
  const definition = themeRegistry.get(productId);

  if (!definition) {
    throw new Error(`Product theme not found: ${productId}`);
  }

  let theme: Theme;

  switch (appearance) {
    case 'light': {
      theme = {
        ...createLightTheme(definition.brand),
        ...(definition.lightOverrides ?? {}),
      };
      break;
    }
    case 'dark': {
      theme = {
        ...createDarkTheme(definition.brand),
        ...(definition.darkOverrides ?? {}),
      };
      break;
    }
    case 'high-contrast': {
      theme = {
        ...createHighContrastTheme(),
        ...(definition.highContrastOverrides ?? {}),
      };
      break;
    }
  }

  const resolved: ResolvedThemeResult = {
    theme,
    productId,
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
