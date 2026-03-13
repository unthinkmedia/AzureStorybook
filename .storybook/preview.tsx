import type { Preview } from '@storybook/react';
import { useState, useEffect } from 'react';
import { FluentProvider } from '@fluentui/react-components';
import { Agentation } from 'agentation';
import { getProductTheme, resolveTheme } from '../src/themes/themeRegistry';
import type { AppearanceMode, DesignSystemId } from '../src/themes/types';
import {
  PRODUCT_THEME_GLOBAL,
  APPEARANCE_MODE_GLOBAL,
  DESIGN_SYSTEM_GLOBAL,
  DEFAULT_PRODUCT,
  DEFAULT_APPEARANCE,
  DEFAULT_DESIGN_SYSTEM,
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
  designSystem: {
    name: 'Design System',
    defaultValue: DEFAULT_DESIGN_SYSTEM,
  },
};

const CustomDocsContainer = ({ children, context, ...rest }: any) => {
  const getInitialGlobals = (): Record<string, string> => {
    try {
      const ch = context.channel;
      // Channel stores past events in ch.data — read the most recent globals
      const data = ch.data as
        | Record<string, Array<{ globals?: Record<string, string> }>>
        | undefined;
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

  const appearance = ((globals[APPEARANCE_MODE_GLOBAL] as string) ??
    DEFAULT_APPEARANCE) as AppearanceMode;
  const designSystem = ((globals[DESIGN_SYSTEM_GLOBAL] as string) ??
    DEFAULT_DESIGN_SYSTEM) as DesignSystemId;

  // Sync data-azure-theme so preview.css dark-mode CSS rules apply to .docs-story
  document.documentElement.setAttribute('data-azure-theme', appearance);
  document.documentElement.setAttribute('data-design-system', designSystem);

  return (
    <BaseDocsContainer context={context} theme={themes.light} {...rest}>
      {children}
    </BaseDocsContainer>
  );
};

const preview: Preview = {
  parameters: {
    chromatic: {
      modes: {
        'fluent2-light': {
          globals: {
            [PRODUCT_THEME_GLOBAL]: 'azure',
            [APPEARANCE_MODE_GLOBAL]: 'light',
            [DESIGN_SYSTEM_GLOBAL]: 'fluent2',
          },
        },
        'fluent2-hc': {
          globals: {
            [PRODUCT_THEME_GLOBAL]: 'azure',
            [APPEARANCE_MODE_GLOBAL]: 'high-contrast',
            [DESIGN_SYSTEM_GLOBAL]: 'fluent2',
          },
        },
        'coherence-light': {
          globals: {
            [PRODUCT_THEME_GLOBAL]: 'azure',
            [APPEARANCE_MODE_GLOBAL]: 'light',
            [DESIGN_SYSTEM_GLOBAL]: 'coherence',
          },
        },
        'azure-fluent-dark': {
          globals: {
            [PRODUCT_THEME_GLOBAL]: 'azure',
            [APPEARANCE_MODE_GLOBAL]: 'dark',
            [DESIGN_SYSTEM_GLOBAL]: 'azure-fluent',
          },
        },
        'ibiza-light': {
          globals: {
            [PRODUCT_THEME_GLOBAL]: 'azure',
            [APPEARANCE_MODE_GLOBAL]: 'light',
            [DESIGN_SYSTEM_GLOBAL]: 'ibiza',
          },
        },
        'fluent1-dark': {
          globals: {
            [PRODUCT_THEME_GLOBAL]: 'azure',
            [APPEARANCE_MODE_GLOBAL]: 'dark',
            [DESIGN_SYSTEM_GLOBAL]: 'fluent1',
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
      const requestedProductId =
        (context.globals[PRODUCT_THEME_GLOBAL] as string | undefined) ?? DEFAULT_PRODUCT;
      const productId = getProductTheme(requestedProductId) ? requestedProductId : DEFAULT_PRODUCT;
      const appearance = ((context.globals[APPEARANCE_MODE_GLOBAL] as string | undefined) ??
        DEFAULT_APPEARANCE) as AppearanceMode;
      const designSystem = ((context.globals[DESIGN_SYSTEM_GLOBAL] as string | undefined) ??
        DEFAULT_DESIGN_SYSTEM) as DesignSystemId;
      const theme = resolveTheme(productId, appearance, designSystem);

      // Backward compat: sync data-azure-theme attribute for any external CSS/tooling
      document.documentElement.setAttribute('data-azure-theme', appearance);
      document.documentElement.setAttribute('data-design-system', designSystem);

      return (
        <FluentProvider theme={theme}>
          <Story />
          <Agentation webhookUrl="/api/feedback" />
        </FluentProvider>
      );
    },
  ],
};

export default preview;
