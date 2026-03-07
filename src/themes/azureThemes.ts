/**
 * Azure brand color ramp — extracted from Coherence CDN theme.css
 * Source: https://coherence-ftekb0dcfpcjb3gv.b02.azurefd.net/cdn/latest/themes/cui/theme.css
 *
 * These are the exact --color-brand-{step} values used in the Azure Portal.
 */
import type { BrandVariants, Theme } from '@fluentui/react-components';
import {
  createLightTheme,
  createDarkTheme,
  createHighContrastTheme,
} from '@fluentui/react-components';

export const azureBrand: BrandVariants = {
  10: '#061724',
  20: '#082338',
  30: '#0a2e4a',
  40: '#0c3b5e',
  50: '#0e4775',
  60: '#0f548c',
  70: '#115ea3',
  80: '#0f6cbd', // Primary — Azure brand blue
  90: '#2886de',
  100: '#479ef5',
  110: '#62abf5',
  120: '#77b7f7',
  130: '#96c6fa',
  140: '#b4d6fa',
  150: '#cfe4fa',
  160: '#ebf3fc',
};

/**
 * Azure Light Theme
 * Maps Coherence CDN tokens onto Fluent v9's theme shape.
 */
export const azureLightTheme: Theme = {
  ...createLightTheme(azureBrand),

  // Body
  colorNeutralBackground1: '#ffffff',   // --neutral-background1 → --color-neutral-100
  colorNeutralBackground2: '#fafafa',   // --neutral-background2 → --color-neutral-98
  colorNeutralBackground3: '#f5f5f5',   // --neutral-background3 → --color-neutral-96
  colorNeutralBackground4: '#f0f0f0',   // --neutral-background4 → --color-neutral-94
  colorNeutralBackground5: '#ebebeb',   // --neutral-background5 → --color-neutral-92
  colorNeutralBackground6: '#e6e6e6',   // --neutral-background6 → --color-neutral-90

  // Foreground
  colorNeutralForeground1: '#242424',   // --neutral-foreground1 → --color-neutral-14
  colorNeutralForeground2: '#424242',   // --neutral-foreground2 → --color-neutral-26
  colorNeutralForeground3: '#616161',   // --neutral-foreground3 → --color-neutral-38
  colorNeutralForeground4: '#707070',   // --neutral-foreground4 → --color-neutral-44
  colorNeutralForegroundDisabled: '#bdbdbd', // --neutral-foreground-disabled → --color-neutral-74

  // Strokes
  colorNeutralStroke1: '#d1d1d1',       // --neutral-stroke1 → --color-neutral-82
  colorNeutralStroke2: '#e0e0e0',       // --neutral-stroke2 → --color-neutral-88
  colorNeutralStroke3: '#f0f0f0',       // --neutral-stroke3 → --color-neutral-94
  colorNeutralStrokeAccessible: '#616161', // --neutral-stroke-accessible → --color-neutral-38
  colorNeutralStrokeDisabled: '#e0e0e0',   // --neutral-stroke-disabled → --color-neutral-88

  // Danger / Status
  colorPaletteRedForeground1: '#cc2635', // --danger-foreground1 → --color-danger-tint-10
  colorPaletteRedBackground1: '#cc2635', // --danger-background1
  colorPaletteRedBackground3: '#fdf3f4', // --danger-background3 → --color-danger-tint-60
  colorPaletteRedBorder1: '#eeacb2',     // --danger-border1 → --color-danger-tint-40

  colorPaletteGreenForeground1: '#107c10', // --success-foreground1
  colorPaletteGreenBackground1: '#107c10', // --success-background1
  colorPaletteGreenBackground3: '#f1faf1', // --success-background3 → --color-success-tint-60

  // Focus
  colorStrokeFocus1: '#ffffff',          // --stroke-focus1 → --color-neutral-100
  colorStrokeFocus2: '#000000',          // --stroke-focus2 → --color-neutral-0
};

/**
 * Azure Dark Theme
 */
export const azureDarkTheme: Theme = {
  ...createDarkTheme(azureBrand),
  colorBrandForeground1: azureBrand[110],
  colorBrandForeground2: azureBrand[120],
};

/**
 * Azure High Contrast Theme
 */
export const azureHighContrastTheme: Theme = createHighContrastTheme();
