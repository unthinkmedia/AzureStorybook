import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SearchBanner } from '../../components/SearchBanner';
import type { SearchBannerProps } from '../../components/SearchBanner';

// ─── Story meta ──────────────────────────────────────────────────

export default {
  title: 'Composed/SearchBanner',
  component: SearchBanner,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A branded search banner with heading, description, and input field. Use this when you need a prominent search area at the top of support, help, or documentation hub pages.',
      },
    },
  },
  argTypes: {
    heading: { control: 'text', description: 'Banner heading text' },
    description: { control: 'text', description: 'Descriptive text below the heading' },
    placeholder: { control: 'text', description: 'Search input placeholder text' },
    buttonLabel: { control: 'text', description: 'Label for the submit button' },
  },
} satisfies Meta<typeof SearchBanner>;

type Story = StoryObj<typeof SearchBanner>;

/** Default support search banner. */
export const Default: Story = {
  args: {
    heading: 'How can we help you?',
    description:
      "Tell us about the issue to get solutions and support. Don't include personal or confidential information like passwords.",
    placeholder: 'Briefly describe the issue',
    buttonLabel: 'Go',
  },

  parameters: {
    docs: {
      description: {
        story:
          'Full search banner with heading, description text, search input, and Go button. Pre-styled with brand-colored top border.',
      },
    },
  },
};

/** Minimal search banner without description text. */
export const Minimal: Story = {
  args: {
    heading: 'Search for help',
    placeholder: 'Type your question…',
    buttonLabel: 'Search',
  },
};
