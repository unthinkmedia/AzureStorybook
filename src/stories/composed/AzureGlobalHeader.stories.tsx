import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FluentProvider } from '@fluentui/react-components';
import { AzureGlobalHeader } from '../../components/GlobalHeader';
import { azureLightTheme } from '../../themes';

export default {
  title: 'Composed/Global Header/AzureGlobalHeader',
  component: AzureGlobalHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The persistent global header bar that sits at the top of every Azure Portal page. Includes the waffle menu, hamburger, branding, search, Copilot button, action icons, and user profile. Use this when building any full-page Azure Portal layout — this header must appear at the top of every page.',
      },
    },
  },
  decorators: [
    (Story) => (
      <FluentProvider theme={azureLightTheme}>
        <Story />
      </FluentProvider>
    ),
  ],
  argTypes: {
    portalName: { control: 'text' },
    userName: { control: 'text' },
    userEmail: { control: 'text' },
    organization: { control: 'text' },
    notificationCount: { control: { type: 'number', min: 0, max: 99 } },
    searchPlaceholder: { control: 'text' },
  },
} satisfies Meta<typeof AzureGlobalHeader>;

type Story = StoryObj<typeof AzureGlobalHeader>;

/** Default header matching the Azure Portal appearance. */
export const Default: Story = {
  args: {
    portalName: 'Microsoft Azure',
    userEmail: 'alexbritez@microsoft.com',
    organization: 'MICROSOFT (MICROSOFT.ONMICROSOFT.COM)',
    userName: 'Alex Britez',
    notificationCount: 1,
  },

  parameters: {
    docs: {
      description: {
        story:
          'Default Azure Portal header bar with branding, search, Copilot, notifications, and user profile. This is the top-level chrome that appears on every page.',
      },
    },
  },
};

/** Header with no notifications. */
export const NoNotifications: Story = {
  args: {
    ...Default.args,
    notificationCount: 0,
  },
};

/** Full page simulation showing the header pinned at the top. */
export const WithPageContent: Story = {
  args: { ...Default.args },
  render: (args) => (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AzureGlobalHeader {...args} />
      <div
        style={{
          flex: 1,
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#616161',
          fontSize: 14,
        }}
      >
        Page content area
      </div>
    </div>
  ),
};
