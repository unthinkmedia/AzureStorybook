import type { Meta, StoryObj } from '@storybook/react';
import { Switch, Field } from '@fluentui/react-components';

const meta: Meta<typeof Switch> = {
  title: 'Components/Selection/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Fluent UI Switch toggles a binary setting on or off with immediate effect. Use this when a setting takes effect instantly without requiring a form submit — such as enabling public access, toggling diagnostics, or activating a feature flag. Choose this over Checkbox when the action is an on/off toggle with immediate effect.',
      },
    },
  },
  argTypes: {
    disabled: { control: 'boolean' },
    labelPosition: { control: 'select', options: ['above', 'after', 'before'] },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

/** Enabled switch — the resource setting is active. */
export const Enabled: Story = {
  render: () => (
    <Field label="Public access">
      <Switch defaultChecked label="Enabled" />
    </Field>
  ),
};

/** Disabled switch — the resource setting is off. */
export const Off: Story = {
  render: () => (
    <Field label="Diagnostics">
      <Switch label="Disabled" />
    </Field>
  ),
};

/** Side-by-side switches for comparing on/off states. */
export const Comparison: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      <Field label="Public access">
        <Switch defaultChecked label="Enabled" />
      </Field>
      <Field label="Diagnostics">
        <Switch label="Disabled" />
      </Field>
    </div>
  ),
};

/** Disabled switch that cannot be toggled. */
export const Locked: Story = {
  args: {
    label: 'Managed by policy',
    defaultChecked: true,
    disabled: true,
  },
};
