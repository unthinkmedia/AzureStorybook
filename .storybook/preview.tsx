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
import { GLOBALS_UPDATED } from 'storybook/internal/core-events';

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
  const parseGlobalsFromUrl = (): Record<string, string> => {
    try {
      const search = window.parent?.location?.search ?? window.location.search;
      const params = new URLSearchParams(search);
      const globalsParam = params.get('globals');
      if (!globalsParam) return {};
      return Object.fromEntries(
        globalsParam.split(/[;,]/).map(pair => {
          const [key, ...rest] = pair.split(':');
          return [key, rest.join(':')];
        })
      );
    } catch {
      return {};
    }
  };

  const [globals, setGlobals] = useState(() => parseGlobalsFromUrl());

  const productId = (globals[PRODUCT_THEME_GLOBAL] as string) ?? DEFAULT_PRODUCT;
  const appearance = ((globals[APPEARANCE_MODE_GLOBAL] as string) ?? DEFAULT_APPEARANCE) as AppearanceMode;
  useEffect(() => {
    const handler = (changed: { globals: Record<string, unknown> }) => {
      setGlobals(changed.globals);
    };
    context.channel.on(GLOBALS_UPDATED, handler);
    return () => context.channel.off(GLOBALS_UPDATED, handler);
  }, [context.channel]);

  useEffect(() => {
    const isDark = appearance === 'dark' || appearance === 'high-contrast';
    const bgColor = isDark ? themes.dark.appContentBg : '';
    const textColor = isDark ? themes.dark.textColor : '';

    const targets = document.querySelectorAll('.sbdocs-wrapper, .sbdocs');
    targets.forEach((el) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.background = bgColor;
      htmlEl.style.color = textColor;
    });
  }, [appearance]);

  const fluentTheme = resolveTheme(productId, appearance);
  const docsTheme = appearance === 'dark' || appearance === 'high-contrast' ? themes.dark : themes.light;

  return (
    <BaseDocsContainer context={context} theme={docsTheme} {...rest}>
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
