import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup, Radio, Field } from '@fluentui/react-components';

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/Selection/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Fluent UI RadioGroup presents a set of mutually exclusive options. Use this when the user must choose exactly one value from a small set (2–6 options) — such as pricing tiers, regions, or replication modes. Choose this over Dropdown when all options should be visible at once without requiring a click to expand.',
      },
    },
  },
  argTypes: {
    layout: { control: 'select', options: ['vertical', 'horizontal', 'horizontal-stacked'] },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

/** Vertical radio group for selecting a pricing tier. */
export const Default: Story = {
  render: () => (
    <Field label="Pricing tier">
      <RadioGroup defaultValue="standard">
        <Radio value="free" label="Free — $0/month" />
        <Radio value="basic" label="Basic — $54.75/month" />
        <Radio value="standard" label="Standard — $146/month" />
        <Radio value="premium" label="Premium — $438/month" />
      </RadioGroup>
    </Field>
  ),
};

/** Horizontal layout for compact option sets. */
export const Horizontal: Story = {
  render: () => (
    <Field label="Redundancy">
      <RadioGroup layout="horizontal" defaultValue="lrs">
        <Radio value="lrs" label="LRS" />
        <Radio value="zrs" label="ZRS" />
        <Radio value="grs" label="GRS" />
        <Radio value="ragrs" label="RA-GRS" />
      </RadioGroup>
    </Field>
  ),
};

/** Disabled radio group with a pre-selected locked value. */
export const Disabled: Story = {
  render: () => (
    <Field label="Plan (locked)">
      <RadioGroup defaultValue="enterprise" disabled>
        <Radio value="basic" label="Basic" />
        <Radio value="enterprise" label="Enterprise" />
      </RadioGroup>
    </Field>
  ),
};
