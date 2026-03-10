import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { HealthStatusCard } from '../../components/HealthStatusCard';
import type { HealthStatusCardProps } from '../../components/HealthStatusCard';

// ─── Story meta ──────────────────────────────────────────────────

export default {
  title: 'Composed/HealthStatusCard',
  component: HealthStatusCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A compact status card showing Azure service health events with an icon, message, and optional link. Use this when you need to display health or service status summaries at the top of a Support page or dashboard.',
      },
    },
  },
  argTypes: {
    message: { control: 'text', description: 'Status message text' },
    linkText: { control: 'text', description: 'Optional link text appended after the message' },
  },
} satisfies Meta<typeof HealthStatusCard>;

type Story = StoryObj<typeof HealthStatusCard>;

/** No health events detected (default state). */
export const Default: Story = {
  args: {
    message: 'No Azure health events detected.',
    linkText: 'View service health',
  },

  parameters: {
    docs: {
      description: {
        story:
          'Default health status card showing no active Azure health events with a link to view service health.',
      },
    },
  },
};

/** Health event with active warnings — shows event count and details link. */
export const WithWarning: Story = {
  args: {
    message: '2 active service health events in your subscriptions.',
    linkText: 'View details',
  },
};
