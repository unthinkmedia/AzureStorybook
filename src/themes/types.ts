import type { BrandVariants, Theme } from '@fluentui/react-components';

/**
 * The appearance mode for a product theme.
 * Controls which base theme variant is generated (light, dark, or high contrast).
 */
export type AppearanceMode = 'light' | 'dark' | 'high-contrast';

/**
 * Defines a product-specific theme in the Azure Storybook theme system.
 *
 * Each product (e.g., Azure Portal, Logic Apps) provides a brand ramp and optional
 * token overrides that are spread on top of the Fluent v9 base theme for each
 * appearance mode. This allows products to fully customize the token set while
 * sharing the same component library.
 */
export interface ProductThemeDefinition {
  /** Unique identifier for this product theme (e.g., 'azure', 'logic-apps'). */
  id: string;
  /** Human-readable name shown in the Storybook toolbar dropdown. */
  displayName: string;
  /** Short description of the product and its theme (shown in LLM context bundle). */
  description: string;
  /**
   * The brand color ramp for this product.
   * Used as input to `createLightTheme(brand)` and `createDarkTheme(brand)`.
   * Note: `createHighContrastTheme()` does not accept brand variants.
   */
  brand: BrandVariants;
  /**
   * Optional Fluent v9 token overrides applied on top of `createLightTheme(brand)`.
   * Omit to use the stock Fluent light theme output for this product.
   */
  lightOverrides?: Partial<Theme>;
  /**
   * Optional Fluent v9 token overrides applied on top of `createDarkTheme(brand)`.
   * Omit to use the stock Fluent dark theme output for this product.
   */
  darkOverrides?: Partial<Theme>;
  /**
   * Optional Fluent v9 token overrides applied on top of `createHighContrastTheme()`.
   * Note: HC base theme does not use brand variants, so product differentiation
   * for high contrast comes entirely from these overrides.
   * Omit to use the stock Fluent high contrast theme for this product.
   */
  highContrastOverrides?: Partial<Theme>;
}

/**
 * Internal registry mapping product IDs to their theme definitions.
 * Populated at runtime by `registerProductTheme()` calls in each product file.
 */
export type ThemeRegistry = Map<string, ProductThemeDefinition>;

/**
 * The result returned by `resolveTheme()`.
 * Contains the fully resolved Fluent v9 Theme object along with metadata
 * identifying which product and appearance mode were used.
 */
export interface ResolvedThemeResult {
  /** The fully resolved Fluent v9 Theme object, ready for use in FluentProvider. */
  theme: Theme;
  /** The product ID that was resolved (e.g., 'azure', 'logic-apps'). */
  productId: string;
  /** The appearance mode that was resolved. */
  appearance: AppearanceMode;
}
