import type { Preview } from '@storybook/react';
import { useState, useEffect } from 'react';
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
import { DocsContainer as BaseDocsContainer } from '@storybook/addon-docs/blocks';
import { themes } from 'storybook/theming';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';

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

const CustomDocsContainer = ({ children, context, ...rest }: any) => {
  const getInitialGlobals = (): Record<string, string> => {
    try {
      const ch = context.channel;
      // Channel stores past events in ch.data — read the most recent globals
      const data = ch.data as Record<string, Array<{ globals?: Record<string, string> }>> | undefined;
      const globalsUpdated = data?.['globalsUpdated'];
      if (globalsUpdated?.length) {
        return globalsUpdated[globalsUpdated.length - 1].globals ?? {};
      }
      const setGlobalsData = data?.['setGlobals'];
      if (setGlobalsData?.length) {
        return setGlobalsData[setGlobalsData.length - 1].globals ?? {};
      }
      return {};
    } catch {
      return {};
    }
  };

  const [globals, setGlobals] = useState(() => getInitialGlobals());

  useEffect(() => {
    const handler = (changed: { globals: Record<string, unknown> }) => {
      setGlobals(changed.globals as Record<string, string>);
    };
    context.channel.on(GLOBALS_UPDATED, handler);
    context.channel.on(SET_GLOBALS, handler);
    return () => {
      context.channel.off(GLOBALS_UPDATED, handler);
      context.channel.off(SET_GLOBALS, handler);
    };
  }, [context.channel]);

  const productId = (globals[PRODUCT_THEME_GLOBAL] as string) ?? DEFAULT_PRODUCT;
  const appearance = ((globals[APPEARANCE_MODE_GLOBAL] as string) ?? DEFAULT_APPEARANCE) as AppearanceMode;
  const fluentTheme = resolveTheme(productId, appearance);

  // Sync data-azure-theme so preview.css dark-mode CSS rules apply to .sbdocs-preview
  document.documentElement.setAttribute('data-azure-theme', appearance);

  return (
    <BaseDocsContainer context={context} theme={themes.light} {...rest}>
      <FluentProvider theme={fluentTheme}>{children}</FluentProvider>
    </BaseDocsContainer>
  );
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
        'sreagent-light': {
          globals: {
            [PRODUCT_THEME_GLOBAL]: 'sre-agent',
            [APPEARANCE_MODE_GLOBAL]: 'light',
          },
        },
        'sreagent-dark': {
          globals: {
            [PRODUCT_THEME_GLOBAL]: 'sre-agent',
            [APPEARANCE_MODE_GLOBAL]: 'dark',
          },
        },
        'sreagent-hc': {
          globals: {
            [PRODUCT_THEME_GLOBAL]: 'sre-agent',
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
      container: CustomDocsContainer,
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
