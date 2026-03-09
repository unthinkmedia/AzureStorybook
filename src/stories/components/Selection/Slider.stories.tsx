import type { Meta, StoryObj } from '@storybook/react';
import { Slider, Field } from '@fluentui/react-components';

const meta: Meta<typeof Slider> = {
  title: 'Components/Selection/Slider',
  component: Slider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Fluent UI Slider lets users select a numeric value within a range by dragging a thumb. Use this when the user needs to pick a value from a continuous or stepped range — instance counts, throughput limits, or scaling thresholds. Choose this over SpinButton when the visual position within the range matters more than precise numeric entry.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['small', 'medium'] },
    disabled: { control: 'boolean' },
    vertical: { control: 'boolean' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

/** Instance count selector with step increments. */
export const Default: Story = {
  render: () => (
    <Field label="Instance count">
      <Slider min={1} max={10} defaultValue={3} step={1} />
    </Field>
  ),
};

/** Slider for percentage-based settings. */
export const Percentage: Story = {
  render: () => (
    <Field label="CPU threshold (%)">
      <Slider min={0} max={100} defaultValue={75} step={5} />
    </Field>
  ),
};

/** Disabled slider with a locked value. */
export const Disabled: Story = {
  render: () => (
    <Field label="Throughput (locked)">
      <Slider min={400} max={10000} defaultValue={4000} step={100} disabled />
    </Field>
  ),
};
