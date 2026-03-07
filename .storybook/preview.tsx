import React from 'react';
import type { Preview } from '@storybook/react';
import { FluentProvider } from '@fluentui/react-components';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import { azureLightTheme, azureDarkTheme, azureHighContrastTheme } from '../src/themes';

import './preview.css';

const preview: Preview = {
  parameters: {
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
        ],
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    withThemeByDataAttribute({
      themes: {
        'Azure Light': 'light',
        'Azure Dark': 'dark',
        'High Contrast': 'high-contrast',
      },
      defaultTheme: 'Azure Light',
      attributeName: 'data-azure-theme',
    }),
    (Story, context) => {
      const themeMap: Record<string, typeof azureLightTheme> = {
        light: azureLightTheme,
        dark: azureDarkTheme,
        'high-contrast': azureHighContrastTheme,
      };
      const el = document.documentElement;
      const currentTheme = el.getAttribute('data-azure-theme') || 'light';
      const fluentTheme = themeMap[currentTheme] || azureLightTheme;

      return (
        <FluentProvider theme={fluentTheme}>
          <Story />
        </FluentProvider>
      );
    },
  ],
};

export default preview;
