import '../products';

import { describe, expect, it } from 'vitest';
import { azureBrand } from '../azureThemes';
import { getAllProductThemes, getThemeRegistrySnapshot, resolveTheme } from '../themeRegistry';

describe('themeRegistry', () => {
  it('getAllProductThemes returns exactly the registered Azure product themes', () => {
    const themes = getAllProductThemes();

    expect(themes).toHaveLength(2);
    expect(themes.map((theme) => theme.id)).toEqual(['azure', 'logic-apps']);
  });

  it("resolveTheme('azure', 'light') uses the Azure light background override", () => {
    const theme = resolveTheme('azure', 'light');

    expect(theme.colorNeutralBackground1).toBe('#ffffff');
  });

  it("resolveTheme('azure', 'light') uses the Azure red background override", () => {
    const theme = resolveTheme('azure', 'light');

    expect(theme.colorPaletteRedBackground3).toBe('#c50f1f');
  });

  it("resolveTheme('azure', 'light') uses the Azure focus stroke override", () => {
    const theme = resolveTheme('azure', 'light');

    expect(theme.colorStrokeFocus2).toBe('#000000');
  });

  it("resolveTheme('azure', 'dark') uses the Azure dark brand foreground override", () => {
    const theme = resolveTheme('azure', 'dark');

    expect(theme.colorBrandForeground1).toBe(azureBrand[110]);
  });

  it("resolveTheme('azure', 'high-contrast') returns a valid high-contrast theme", () => {
    const theme = resolveTheme('azure', 'high-contrast');

    expect(theme).toEqual(
      expect.objectContaining({
        colorNeutralBackground1: expect.any(String),
        colorNeutralForeground1: expect.any(String),
        colorStrokeFocus2: expect.any(String),
      }),
    );
    expect(theme.colorNeutralBackground1).toBeTruthy();
    expect(theme.colorNeutralForeground1).toBeTruthy();
    expect(theme.colorStrokeFocus2).toBeTruthy();
  });

  it("resolveTheme('logic-apps', 'light') differs from Azure light branding", () => {
    const azureLightTheme = resolveTheme('azure', 'light');
    const logicAppsLightTheme = resolveTheme('logic-apps', 'light');

    expect(logicAppsLightTheme.colorBrandBackground).toBeTruthy();
    expect(logicAppsLightTheme.colorBrandBackground).not.toBe(azureLightTheme.colorBrandBackground);
  });

  it("resolveTheme('nonexistent', 'light') throws an error", () => {
    expect(() => resolveTheme('nonexistent', 'light')).toThrow(
      'Product theme not found: nonexistent',
    );
  });

  it('getThemeRegistrySnapshot returns the registered product metadata snapshot', () => {
    const snapshot = getThemeRegistrySnapshot();

    expect(snapshot).toHaveLength(2);
    expect(snapshot).toMatchInlineSnapshot(`
      [
        {
          "description": "Default Azure Portal theme — Coherence design system tokens",
          "displayName": "Azure",
          "id": "azure",
        },
        {
          "description": "Azure Logic Apps — workflow automation product theme (placeholder tokens)",
          "displayName": "Logic Apps",
          "id": "logic-apps",
        },
      ]
    `);
  });
});
