import type { Meta, StoryObj } from '@storybook/react';
import { Select, Field } from '@fluentui/react-components';

const meta: Meta<typeof Select> = {
  title: 'Components/Selection/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Fluent UI Select renders a native HTML select element with Fluent styling. Use this when you need a simple single-choice picker for a known set of options — regions, subscription names, or resource types. Choose this over Dropdown when you want the browser-native select behavior and don\'t need custom option rendering.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    appearance: { control: 'select', options: ['outline', 'underline', 'filled-darker', 'filled-lighter'] },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

/** Region picker — the most common Select pattern in Azure. */
export const Default: Story = {
  render: () => (
    <Field label="Region">
      <Select defaultValue="eastus">
        <option value="eastus">East US</option>
        <option value="westus2">West US 2</option>
        <option value="centralus">Central US</option>
        <option value="northeurope">North Europe</option>
        <option value="westeurope">West Europe</option>
      </Select>
    </Field>
  ),
};

/** Disabled select with a pre-set value. */
export const Disabled: Story = {
  render: () => (
    <Field label="Region (locked)">
      <Select defaultValue="eastus" disabled>
        <option value="eastus">East US</option>
        <option value="westus2">West US 2</option>
      </Select>
    </Field>
  ),
};
