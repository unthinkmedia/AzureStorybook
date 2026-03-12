import type { Preview } from '@storybook/react';
import { FluentProvider } from '@fluentui/react-components';
import { resolveTheme } from '../src/themes/themeRegistry';
import '../src/themes/products';
import type { AppearanceMode } from '../src/themes/types';
import {
  PRODUCT_THEME_GLOBAL,
  APPEARANCE_MODE_GLOBAL,
  DEFAULT_PRODUCT,
  DEFAULT_APPEARANCE,
} from './addons/theme-switcher/constants';

import './preview.css';

export const globalTypes = {
  productTheme: {
    name: 'Product Theme',
    defaultValue: DEFAULT_PRODUCT,
  },
  appearanceMode: {
    name: 'Appearance',
    defaultValue: DEFAULT_APPEARANCE,
  },
};

const preview: Preview = {
  parameters: {
    chromatic: {
      modes: {
        'azure-light': {
          globals: {
            [PRODUCT_THEME_GLOBAL]: 'azure',
            [APPEARANCE_MODE_GLOBAL]: 'light',
          },
        },
        'azure-dark': {
          globals: {
            [PRODUCT_THEME_GLOBAL]: 'azure',
            [APPEARANCE_MODE_GLOBAL]: 'dark',
          },
        },
        'azure-hc': {
          globals: {
            [PRODUCT_THEME_GLOBAL]: 'azure',
            [APPEARANCE_MODE_GLOBAL]: 'high-contrast',
          },
        },
        'logicapps-light': {
          globals: {
            [PRODUCT_THEME_GLOBAL]: 'logic-apps',
            [APPEARANCE_MODE_GLOBAL]: 'light',
          },
        },
        'logicapps-dark': {
          globals: {
            [PRODUCT_THEME_GLOBAL]: 'logic-apps',
            [APPEARANCE_MODE_GLOBAL]: 'dark',
          },
        },
        'logicapps-hc': {
          globals: {
            [PRODUCT_THEME_GLOBAL]: 'logic-apps',
            [APPEARANCE_MODE_GLOBAL]: 'high-contrast',
          },
        },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
    options: {
      storySort: {
        order: [
          'Foundations',
          ['Colors', 'Typography', 'Spacing', 'Icons', 'Shadows'],
          'Components',
          'Composed',
          'Cards',
          'Templates',
          'Container',
        ],
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story, context) => {
      const productId =
        (context.globals[PRODUCT_THEME_GLOBAL] as string | undefined) ?? DEFAULT_PRODUCT;
      const appearance = ((context.globals[APPEARANCE_MODE_GLOBAL] as string | undefined) ??
        DEFAULT_APPEARANCE) as AppearanceMode;
      const theme = resolveTheme(productId, appearance);

      // Backward compat: sync data-azure-theme attribute for any external CSS/tooling
      document.documentElement.setAttribute('data-azure-theme', appearance);

      return (
        <FluentProvider theme={theme}>
          <Story />
        </FluentProvider>
      );
    },
  ],
};

export default preview;
