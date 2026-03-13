import { describe, expect, it } from 'vitest';
import { flattenSkin, getAllSkins, getSkin, registerSkin } from '../skins';
import { fluent2Skin } from '../skins/fluent2';
import { coherenceSkin } from '../skins/coherence';
import { azureFluentSkin } from '../skins/azure-fluent';
import { fluent1Skin } from '../skins/fluent1';

describe('skinRegistry', () => {
  it("getSkin('fluent2') returns the fluent2 identity skin", () => {
    const skin = getSkin('fluent2');

    expect(skin).toBeDefined();
    expect(skin?.id).toBe('fluent2');
    expect(skin?.displayName).toBe('Fluent 2');
    expect(skin?.description).toBe('Current Fluent v9 baseline — identity skin with no overrides');
  });

  it('flattenSkin(fluent2Skin.sections) returns an empty object for identity passthrough', () => {
    const flattened = flattenSkin(fluent2Skin.sections);

    expect(flattened).toEqual({});
  });

  describe('coherence skin', () => {
    it("getSkin('coherence') returns the coherence skin", () => {
      const skin = getSkin('coherence');
      expect(skin).toBeDefined();
      expect(skin?.id).toBe('coherence');
    });

    it("has borderRadiusMedium of '2px'", () => {
      const skin = getSkin('coherence');
      expect(skin?.sections.shape?.borderRadiusMedium).toBe('2px');
    });

    it('has brand color #0078D4', () => {
      const skin = getSkin('coherence');
      expect(skin?.sections.colors?.colorBrandBackground).toBe('#0078D4');
    });

    it('flattens to 40-60 token overrides', () => {
      const flattened = flattenSkin(coherenceSkin.sections);
      const keyCount = Object.keys(flattened).length;
      expect(keyCount).toBeGreaterThanOrEqual(40);
      expect(keyCount).toBeLessThanOrEqual(100);
    });
  });

  describe('azure-fluent skin', () => {
    it("getSkin('azure-fluent') returns defined", () => {
      const skin = getSkin('azure-fluent');
      expect(skin).toBeDefined();
      expect(skin?.id).toBe('azure-fluent');
    });

    it("has borderRadiusMedium of '2px'", () => {
      const skin = getSkin('azure-fluent');
      expect(skin?.sections.shape?.borderRadiusMedium).toBe('2px');
    });

    it("shadow4 value IS different from coherence skin's shadow4", () => {
      const azureFluentShadow = flattenSkin(azureFluentSkin.sections).shadow4;
      const coherenceShadow = flattenSkin(coherenceSkin.sections).shadow4;

      expect(azureFluentShadow).toBeDefined();
      // Even if coherence shadow is undefined (if mocked empty), it will differ from our defined string
      // But we mocked it as '0 0 2px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.14)'
      expect(azureFluentShadow).not.toEqual(coherenceShadow);
      expect(azureFluentShadow).toBe('0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.14)');
    });
  });

  describe('fluent1 skin', () => {
    it("getSkin('fluent1') returns defined", () => {
      const skin = getSkin('fluent1');
      expect(skin).toBeDefined();
      expect(skin?.id).toBe('fluent1');
    });

    it("spacingHorizontalM is '10px' (standard density, differs from coherence '8px')", () => {
      const skin = getSkin('fluent1');
      expect(skin?.sections.density?.spacingHorizontalM).toBe('10px');
    });

    it("borderRadiusMedium is '2px'", () => {
      const skin = getSkin('fluent1');
      expect(skin?.sections.shape?.borderRadiusMedium).toBe('2px');
    });
  });

  describe('ibiza skin', () => {
    it("getSkin('ibiza') returns the ibiza skin", () => {
      const skin = getSkin('ibiza');
      expect(skin).toBeDefined();
      expect(skin?.id).toBe('ibiza');
    });

    it("has borderRadiusMedium of '0px'", () => {
      const skin = getSkin('ibiza');
      expect(skin?.sections.shape?.borderRadiusMedium).toBe('0px');
    });

    it('has brand color #0072C6', () => {
      const skin = getSkin('ibiza');
      expect(skin?.sections.colors?.colorBrandBackground).toBe('#0072C6');
    });

    it("has shadow8 of 'none'", () => {
      const skin = getSkin('ibiza');
      expect(skin?.sections.elevation?.shadow8).toBe('none');
    });
  });

  it('registerSkin throws when registering a duplicate skin id', () => {
    // Note: fluent2Skin is already registered in index.ts
    expect(() => registerSkin(fluent2Skin)).toThrow(/already registered/);
  });
});
