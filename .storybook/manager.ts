import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming/create';

const azureTheme = create({
  base: 'light',

  // Brand
  brandTitle: 'Azure Storybook',
  brandUrl: 'https://azure.microsoft.com',
  brandTarget: '_blank',

  // Colors — Azure brand palette
  colorPrimary: '#0f6cbd',
  colorSecondary: '#115ea3',

  // UI
  appBg: '#f5f5f5',
  appContentBg: '#ffffff',
  appPreviewBg: '#ffffff',
  appBorderColor: '#e0e0e0',
  appBorderRadius: 4,

  // Text
  textColor: '#242424',
  textInverseColor: '#ffffff',

  // Toolbar
  barTextColor: '#616161',
  barSelectedColor: '#0f6cbd',
  barHoverColor: '#115ea3',
  barBg: '#ffffff',

  // Form
  inputBg: '#ffffff',
  inputBorder: '#cccccc',
  inputTextColor: '#242424',
  inputBorderRadius: 4,
});

addons.setConfig({
  theme: azureTheme,
});
