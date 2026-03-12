import '../products';

import { describe, expect, it } from 'vitest';
import { azureBrand } from '../azureThemes';
import { getAllProductThemes, getThemeRegistrySnapshot, resolveTheme } from '../themeRegistry';

describe('themeRegistry', () => {
  it('getAllProductThemes returns exactly the registered Azure product themes', () => {
    const themes = getAllProductThemes();

    expect(themes).toHaveLength(2);
    expect(themes.map((theme) => theme.id)).toEqual(['azure', 'sre-agent']);
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

  it("resolveTheme('sre-agent', 'light') differs from Azure light branding", () => {
    const azureLightTheme = resolveTheme('azure', 'light');
    const sreAgentLightTheme = resolveTheme('sre-agent', 'light');

    expect(sreAgentLightTheme.colorBrandBackground).toBeTruthy();
    expect(sreAgentLightTheme.colorBrandBackground).not.toBe(azureLightTheme.colorBrandBackground);
  });

  it("resolveTheme('sre-agent', 'light') applies non-color token overrides", () => {
    const azureLight = resolveTheme('azure', 'light');
    const sreAgentLight = resolveTheme('sre-agent', 'light');

    // SRE Agent has rounder corners
    expect(sreAgentLight.borderRadiusMedium).toBe('6px');
    expect(azureLight.borderRadiusMedium).not.toBe('6px');

    // SRE Agent has thicker strokes
    expect(sreAgentLight.strokeWidthThin).toBe('1.5px');
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
          "description": "SRE Agent — site reliability engineering product theme",
          "displayName": "SRE Agent",
          "id": "sre-agent",
        },
      ]
    `);
  });
});
