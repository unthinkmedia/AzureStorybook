import { describe, expect, it } from 'vitest';
import { azureLightTheme, azureDarkTheme, azureHighContrastTheme } from '../azureThemes';

describe('azureThemes snapshots', () => {
  it('azureLightTheme matches snapshot', () => {
    expect(azureLightTheme).toMatchSnapshot();
  });

  it('azureDarkTheme matches snapshot', () => {
    expect(azureDarkTheme).toMatchSnapshot();
  });

  it('azureHighContrastTheme matches snapshot', () => {
    expect(azureHighContrastTheme).toMatchSnapshot();
  });
});
