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

  // Danger / Status  (Fluent v9 convention: Background1 = light wash, Background3 = strong/filled)
  colorPaletteRedForeground1: '#bc2f32', // --danger-foreground1 → readable on light bg
  colorPaletteRedBackground1: '#fdf3f4', // --danger-background1 (light wash, tint-60)
  colorPaletteRedBackground2: '#eeacb2', // --danger-background2 (medium, tint-40)
  colorPaletteRedBackground3: '#c50f1f', // --danger-background3 (strong/filled, primary)
  colorPaletteRedBorder1: '#eeacb2',     // --danger-border1 → --color-danger-tint-40

  colorPaletteGreenForeground1: '#0e700e', // --success-foreground1 → readable on light bg
  colorPaletteGreenBackground1: '#f1faf1', // --success-background1 (light wash, tint-60)
  colorPaletteGreenBackground2: '#9fd89f', // --success-background2 (medium, tint-40)
  colorPaletteGreenBackground3: '#107c10', // --success-background3 (strong/filled, primary)

  // Status tokens — used by MessageBar, Field validation, ProgressBar
  colorStatusDangerBackground1: '#f6d1d5',  // danger tint-50 (more visible wash for banners)
  colorStatusDangerBackground2: '#eeacb2',  // danger tint-40
  colorStatusDangerBackground3: '#c50f1f',  // danger primary (strong/filled)
  colorStatusDangerForeground1: '#b10e1c',  // danger shade-10
  colorStatusDangerForeground3: '#c50f1f',  // danger primary
  colorStatusDangerBorder1: '#eeacb2',      // danger tint-40
  colorStatusDangerBorder2: '#c50f1f',      // danger primary

  colorStatusSuccessBackground1: '#c9eac9', // success tint-50 (more visible wash for banners)
  colorStatusSuccessBackground2: '#9fd89f', // success tint-40
  colorStatusSuccessBackground3: '#107c10', // success primary (strong/filled)
  colorStatusSuccessForeground1: '#0e700e', // success shade-10
  colorStatusSuccessForeground3: '#107c10', // success primary
  colorStatusSuccessBorder1: '#9fd89f',     // success tint-40
  colorStatusSuccessBorder2: '#107c10',     // success primary

  colorStatusWarningBackground1: '#fee5d7', // warning tint-50 (more visible wash for banners)
  colorStatusWarningBackground2: '#fdcfb4', // warning tint-40
  colorStatusWarningBackground3: '#f7630c', // warning primary (strong/filled)
  colorStatusWarningForeground1: '#bc4b09', // warning shade-20
  colorStatusWarningForeground3: '#bc4b09', // warning shade-20
  colorStatusWarningBorder1: '#fdcfb4',     // warning tint-40
  colorStatusWarningBorder2: '#bc4b09',     // warning shade-20

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
