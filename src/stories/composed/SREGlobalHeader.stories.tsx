import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SREGlobalHeader } from '../../components/GlobalHeader';

export default {
  title: 'Composed/Global Header/SREGlobalHeader',
  component: SREGlobalHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The global header bar for the Azure SRE Agent experience. Features a light background, SRE Agent branding with a PREVIEW badge, Docs link, notification/chat/settings icons, and user avatar. Use this when building SRE Agent pages — this header replaces AzureGlobalHeader for the SRE-specific experience.',
      },
    },
  },
  argTypes: {
    portalName: { control: 'text' },
    badge: { control: 'text' },
    userName: { control: 'text' },
    userEmail: { control: 'text' },
    notificationCount: { control: { type: 'number', min: 0, max: 99 } },
  },
} satisfies Meta<typeof SREGlobalHeader>;

type Story = StoryObj<typeof SREGlobalHeader>;

/** Default SRE Agent header. */
export const Default: Story = {
  args: {
    portalName: 'Azure SRE Agent',
    badge: 'PREVIEW',
    userEmail: 'alexbritez@microsoft.com',
    userName: 'Alex Britez',
    notificationCount: 0,
  },

  parameters: {
    docs: {
      description: {
        story:
          'SRE Agent header with PREVIEW badge, Docs link, notification/chat/settings icons, and user avatar on a light background.',
      },
    },
  },
};

/** Header with active notifications. */
export const WithNotifications: Story = {
  args: {
    ...Default.args,
    notificationCount: 3,
  },
};

/** Header without the preview badge. */
export const NoBadge: Story = {
  args: {
    ...Default.args,
    badge: undefined,
  },
};

/** Full page simulation showing the SRE header pinned at the top. */
export const WithPageContent: Story = {
  args: { ...Default.args },
  render: (args) => (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SREGlobalHeader {...args} />
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
