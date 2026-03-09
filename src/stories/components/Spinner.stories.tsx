import type { Meta, StoryObj } from '@storybook/react';
import {
  Spinner,
  tokens,
} from '@fluentui/react-components';

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Fluent UI Spinner shows an indeterminate loading indicator with optional label. Use this when content is loading and you cannot determine a progress percentage — such as fetching resource data, waiting for API responses, or initial page load. Choose this over ProgressBar when completion percentage is unknown.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['tiny', 'extra-small', 'small', 'medium', 'large', 'extra-large', 'huge'] },
    appearance: { control: 'select', options: ['primary', 'inverted'] },
    labelPosition: { control: 'select', options: ['above', 'below', 'before', 'after'] },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

/** Default medium spinner with a loading label. */
export const Default: Story = {
  args: {
    size: 'medium',
    label: 'Loading resources...',
  },
};

/** All spinner sizes from tiny to large. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Spinner size="tiny" label="Tiny" />
      <Spinner size="extra-small" label="Extra Small" />
      <Spinner size="small" label="Small" />
      <Spinner size="medium" label="Medium" />
      <Spinner size="large" label="Large" />
    </div>
  ),
};

/** Spinner with label in different positions. */
export const LabelPositions: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Spinner size="medium" label="Loading..." labelPosition="below" />
      <Spinner size="small" label="Deploying..." labelPosition="after" />
    </div>
  ),
};

/** Inverted appearance for contrast on dark backgrounds. */
export const Inverted: Story = {
  render: () => (
    <div style={{ background: tokens.colorNeutralBackground1, padding: 16, borderRadius: 4 }}>
      <Spinner size="medium" appearance="inverted" label="Inverted" />
    </div>
  ),
};
