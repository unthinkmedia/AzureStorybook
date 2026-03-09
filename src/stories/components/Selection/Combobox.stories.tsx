import type { Meta, StoryObj } from '@storybook/react';
import { Combobox, Option, Field } from '@fluentui/react-components';

const meta: Meta<typeof Combobox> = {
  title: 'Components/Selection/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Fluent UI Combobox combines a text input with a filterable dropdown list. Use this when the user needs to search through a large set of options — subscriptions, resource names, or SKUs. Choose this over Dropdown when the option list is large enough that typing to filter is faster than scrolling.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    appearance: { control: 'select', options: ['outline', 'underline', 'filled-darker', 'filled-lighter'] },
    disabled: { control: 'boolean' },
    freeform: { control: 'boolean' },
    multiselect: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Combobox>;

/** Subscription search — type to filter from a long list. */
export const Default: Story = {
  render: () => (
    <Field label="Subscription">
      <Combobox placeholder="Search subscriptions...">
        <Option>Visual Studio Enterprise</Option>
        <Option>Pay-As-You-Go</Option>
        <Option>My Dev Subscription</Option>
        <Option>Production Subscription</Option>
      </Combobox>
    </Field>
  ),
};

/** Freeform combobox that accepts custom values not in the list. */
export const Freeform: Story = {
  render: () => (
    <Field label="Tag value">
      <Combobox placeholder="Type or select..." freeform>
        <Option>production</Option>
        <Option>staging</Option>
        <Option>development</Option>
      </Combobox>
    </Field>
  ),
};

/** Disabled combobox with a pre-filled value. */
export const Disabled: Story = {
  render: () => (
    <Field label="Subscription (locked)">
      <Combobox defaultValue="Visual Studio Enterprise" disabled>
        <Option>Visual Studio Enterprise</Option>
      </Combobox>
    </Field>
  ),
};
