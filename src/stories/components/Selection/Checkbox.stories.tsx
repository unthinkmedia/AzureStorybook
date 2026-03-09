import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox, Field } from '@fluentui/react-components';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Selection/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Fluent UI Checkbox allows users to toggle a boolean option on or off. Use this when you need multi-select in forms — enabling features, accepting terms, or selecting items from a list. Choose this over Switch when the setting is part of a group of related options or when the label is a noun/phrase rather than an on/off state.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['medium', 'large'] },
    shape: { control: 'select', options: ['square', 'circular'] },
    labelPosition: { control: 'select', options: ['before', 'after'] },
    disabled: { control: 'boolean' },
    checked: { control: 'select', options: [true, false, 'mixed'] },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

/** Single checkbox for toggling a feature. */
export const Default: Story = {
  args: {
    label: 'Enable auto-scaling',
  },
};

/** Group of checkboxes for multi-select settings. */
export const Group: Story = {
  render: () => (
    <Field label="Features">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Checkbox label="Enable auto-scaling" />
        <Checkbox label="Enable diagnostics" defaultChecked />
        <Checkbox label="Enable encryption at rest" defaultChecked disabled />
      </div>
    </Field>
  ),
};

/** Disabled checkbox showing a locked, pre-set value. */
export const Disabled: Story = {
  args: {
    label: 'Encryption at rest (required)',
    defaultChecked: true,
    disabled: true,
  },
};

/** Mixed/indeterminate state for "select all" parent checkboxes. */
export const Mixed: Story = {
  args: {
    label: 'Select all features',
    checked: 'mixed' as const,
  },
};
