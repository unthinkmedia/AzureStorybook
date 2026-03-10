import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NullState } from '../../components/NullState';
import type { NullStateProps } from '../../components/NullState';

// ─── Stories ─────────────────────────────────────────────────────

const meta: Meta<typeof NullState> = {
  title: 'Composed/NullState',
  component: NullState,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Empty / null-state pattern used inside browse blades and data grids when there are no items to display. Two variants: an illustration-centered state with title, description, and action buttons, or a simple inline text message. Use this when a resource list, query result, or data grid has zero items to display.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['illustration', 'text'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof NullState>;

/** Illustration variant — centered graphic with title, description, primary action, and learn-more link. */
export const WithIllustration: Story = {
  args: {
    variant: 'illustration',
    title: 'No resource graph queries to display',
    description: 'Manage your resource graph queries.',
    primaryActionLabel: 'Resource Graph Explorer',
    onLearnMore: () => {},
  },

  parameters: {
    docs: {
      description: {
        story:
          'Centered empty state with illustration, title, description, primary action button, and learn-more link. The full-featured null state for browse blades.',
      },
    },
  },
};

/** Text-only variant — single line of text, no illustration. Used for simple "no items" messages. */
export const TextOnly: Story = {
  args: {
    variant: 'text',
    title: 'You do not have any budgets.',
  },
};

/** Illustration with just a title and learn-more link — no primary action button. */
export const IllustrationMinimal: Story = {
  args: {
    variant: 'illustration',
    title: 'No items to display',
    onLearnMore: () => {},
  },
};
