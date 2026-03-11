import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { StatusCard } from '../../../components/Cards/StatusCard';

export default {
  title: 'Components/Cards/Card Content Templates/StatusCard',
  component: StatusCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A compact status card showing an icon, message, and optional link. Use this when you need to display a brief status summary — e.g. health checks, system alerts, or inline notifications within a page.',
      },
    },
  },
  argTypes: {
    message: { control: 'text', description: 'Status message text' },
    linkText: { control: 'text', description: 'Optional link text appended after the message' },
  },
} satisfies Meta<typeof StatusCard>;

type Story = StoryObj<typeof StatusCard>;

/** Default: no issues detected. */
export const Default: Story = {
  args: {
    message: 'No health events detected.',
    linkText: 'View service health',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default status card showing no active issues with a link to view details.',
      },
    },
  },
};

/** Active warning — shows event count and details link. */
export const WithWarning: Story = {
  args: {
    message: '2 active service health events in your subscriptions.',
    linkText: 'View details',
  },
};
