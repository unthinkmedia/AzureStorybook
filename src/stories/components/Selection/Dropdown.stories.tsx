import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown, Option, Field } from '@fluentui/react-components';

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Form Elements/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Fluent UI Dropdown provides a custom-styled single or multi-select picker with a popover option list. Use this when you need richer option rendering than native Select — icons, descriptions, or grouped options. Choose this over Select when you need custom option templates or multi-select capability.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    appearance: { control: 'select', options: ['outline', 'underline', 'filled-darker', 'filled-lighter'] },
    disabled: { control: 'boolean' },
    multiselect: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

/** Single-select resource group picker. */
export const Default: Story = {
  render: () => (
    <Field label="Resource group">
      <Dropdown placeholder="Select a resource group" defaultValue="prod-rg">
        <Option>prod-rg</Option>
        <Option>dev-rg</Option>
        <Option>staging-rg</Option>
        <Option>test-rg</Option>
      </Dropdown>
    </Field>
  ),
};

/** Multi-select dropdown for selecting multiple tags or regions. */
export const MultiSelect: Story = {
  render: () => (
    <Field label="Regions">
      <Dropdown placeholder="Select regions" multiselect>
        <Option>East US</Option>
        <Option>West US 2</Option>
        <Option>Central US</Option>
        <Option>North Europe</Option>
        <Option>West Europe</Option>
      </Dropdown>
    </Field>
  ),
};

/** Disabled dropdown with a pre-selected value. */
export const Disabled: Story = {
  render: () => (
    <Field label="Resource group (locked)">
      <Dropdown defaultValue="prod-rg" disabled>
        <Option>prod-rg</Option>
        <Option>dev-rg</Option>
      </Dropdown>
    </Field>
  ),
};
