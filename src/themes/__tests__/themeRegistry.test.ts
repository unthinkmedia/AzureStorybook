import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { azureBrand } from '../azureThemes';
import { getAllProductThemes, getThemeRegistrySnapshot, resolveTheme } from '../themeRegistry';
import type { DesignSystemId } from '../types';

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

  it("resolveTheme('sre-agent', 'light') uses default Fluent structural tokens (no custom overrides)", () => {
    const sreAgentLight = resolveTheme('sre-agent', 'light');

    expect(sreAgentLight.borderRadiusMedium).not.toBe('8px');
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

  describe('3-axis composition', () => {
    it("resolveTheme('azure', 'light', 'fluent2') matches resolveTheme('azure', 'light')", () => {
      const withIdentitySkin = resolveTheme('azure', 'light', 'fluent2');
      const withoutSkin = resolveTheme('azure', 'light');

      expect(withIdentitySkin).toEqual(withoutSkin);
    });

    it('backward-compat: resolveTheme(productId, appearance) 2-arg call still works', () => {
      const theme = resolveTheme('azure', 'light');

      expect(theme.colorNeutralBackground1).toBe('#ffffff');
    });

    it('fluent2 identity: skin is identity pass-through, does not modify theme', () => {
      const baseTheme = resolveTheme('azure', 'light');
      const withSkin = resolveTheme('azure', 'light', 'fluent2');

      expect(withSkin).toEqual(baseTheme);
    });

    it('azure product file contains no structural override tokens', () => {
      const azureSource = readFileSync(new URL('../products/azure.ts', import.meta.url), 'utf8');

      expect(azureSource).not.toMatch(/^\s*borderRadius\w*\s*:/m);
      expect(azureSource).not.toMatch(/^\s*spacing\w*\s*:/m);
      expect(azureSource).not.toMatch(/^\s*strokeWidth\w*\s*:/m);
      expect(azureSource).not.toMatch(/^\s*fontWeight\w*\s*:/m);
    });

    it('resolveTheme throws when designSystem skin is not registered', () => {
      expect(() => resolveTheme('azure', 'light', 'nonexistent' as DesignSystemId)).toThrow(
        'Design system skin not found: nonexistent',
      );
    });

    it('coherence shape: applies coherence era shape overrides (2px border radius)', () => {
      // RED: Enable after Tasks 12-15 deliver era skins
      const theme = resolveTheme('azure', 'light', 'coherence');

      expect(theme.borderRadiusMedium).toBe('2px');
    });

    it('ibiza shape: applies ibiza era shape overrides (no border radius)', () => {
      // RED: Enable after Tasks 12-15 deliver era skins
      const theme = resolveTheme('azure', 'light', 'ibiza');

      expect(theme.borderRadiusMedium).toBe('0px');
    });

    it('product-color-precedence: product overrides always win over skin', () => {
      // RED: Enable after Tasks 12-15 deliver era skins
      const theme = resolveTheme('azure', 'light', 'coherence');

      // Azure product defines colorNeutralBackground1 = '#ffffff' in lightOverrides
      // Even with skin applied, product override should survive
      expect(theme.colorNeutralBackground1).toBe('#ffffff');
    });
  });
});
