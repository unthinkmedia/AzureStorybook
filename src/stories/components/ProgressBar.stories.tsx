import type { Meta, StoryObj } from '@storybook/react';
import {
  ProgressBar,
  Field,
} from '@fluentui/react-components';

const meta: Meta<typeof ProgressBar> = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Fluent UI ProgressBar shows determinate or indeterminate progress with color-coded states. Use this when you need to indicate operation progress — deployment status, upload completion, or background task tracking. Choose this over Spinner when you can report a specific completion percentage.',
      },
    },
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    color: { control: 'select', options: ['brand', 'success', 'warning', 'error'] },
    thickness: { control: 'select', options: ['medium', 'large'] },
    shape: { control: 'select', options: ['rounded', 'square'] },
  },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

/** Determinate progress — shows a specific completion percentage. */
export const Determinate: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
      <Field validationMessage="Running (45%)" validationState="none">
        <ProgressBar value={0.45} />
      </Field>
      <Field validationMessage="Almost done (80%)" validationState="none">
        <ProgressBar value={0.8} />
      </Field>
      <Field validationMessage="Complete (100%)" validationState="success">
        <ProgressBar value={1} color="success" />
      </Field>
    </div>
  ),
};

/** Indeterminate progress — for operations without a known completion time. */
export const Indeterminate: Story = {
  render: () => (
    <div style={{ maxWidth: 400 }}>
      <Field validationMessage="Deploying..." validationState="none">
        <ProgressBar />
      </Field>
    </div>
  ),
};

/** Color variants: brand, success, warning, error. */
export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
      <Field validationMessage="Brand" validationState="none">
        <ProgressBar value={0.6} color="brand" />
      </Field>
      <Field validationMessage="Success" validationState="success">
        <ProgressBar value={1} color="success" />
      </Field>
      <Field validationMessage="Warning" validationState="warning">
        <ProgressBar value={0.3} color="warning" />
      </Field>
      <Field validationMessage="Error" validationState="error">
        <ProgressBar value={0.1} color="error" />
      </Field>
    </div>
  ),
};

/** Thickness comparison: medium (default) and large. */
export const Thickness: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
      <Field validationMessage="Medium (default)" validationState="none">
        <ProgressBar value={0.5} thickness="medium" />
      </Field>
      <Field validationMessage="Large" validationState="none">
        <ProgressBar value={0.5} thickness="large" />
      </Field>
    </div>
  ),
};
