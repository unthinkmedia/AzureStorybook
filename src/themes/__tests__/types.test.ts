import { describe, expectTypeOf, it } from 'vitest';

import type { DesignSystemId, DesignSystemSkin, ResolvedThemeResult, SkinSections } from '../types';

describe('theme types contract', () => {
  it('DesignSystemId includes all supported design systems', () => {
    expectTypeOf<DesignSystemId>().toEqualTypeOf<
      'fluent2' | 'coherence' | 'ibiza' | 'fluent1' | 'azure-fluent'
    >();
  });

  it('SkinSections has all required section keys', () => {
    expectTypeOf<SkinSections>().toHaveProperty('colors');
    expectTypeOf<SkinSections>().toHaveProperty('shape');
    expectTypeOf<SkinSections>().toHaveProperty('elevation');
    expectTypeOf<SkinSections>().toHaveProperty('density');
    expectTypeOf<SkinSections>().toHaveProperty('typography');
  });

  it('DesignSystemSkin has the required metadata and sections shape', () => {
    expectTypeOf<DesignSystemSkin>().toHaveProperty('id');
    expectTypeOf<DesignSystemSkin>().toHaveProperty('displayName');
    expectTypeOf<DesignSystemSkin>().toHaveProperty('description');
    expectTypeOf<DesignSystemSkin>().toHaveProperty('sections');

    expectTypeOf<DesignSystemSkin['id']>().toEqualTypeOf<DesignSystemId>();
    expectTypeOf<DesignSystemSkin['sections']>().toEqualTypeOf<SkinSections>();
  });

  it('ResolvedThemeResult.skinId is optional', () => {
    type HasOptionalSkinId =
      Omit<ResolvedThemeResult, 'skinId'> extends ResolvedThemeResult ? true : false;

    expectTypeOf<HasOptionalSkinId>().toEqualTypeOf<true>();
    expectTypeOf<ResolvedThemeResult['skinId']>().toEqualTypeOf<DesignSystemId | undefined>();
  });
});
