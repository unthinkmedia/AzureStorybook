import type { Meta, StoryObj } from '@storybook/react';
import {
  Checkbox,
  RadioGroup,
  Radio,
  Switch,
  Select,
  Dropdown,
  Option,
  Combobox,
  Field,
  Slider,
  Text,
  tokens,
} from '@fluentui/react-components';

const SelectionPage = () => (
  <div style={{ padding: tokens.spacingHorizontalXXL, maxWidth: 480 }}>
    <Text as="h2" size={600} weight="semibold" block style={{ marginBottom: tokens.spacingVerticalXXL }}>Selection & Choice Controls</Text>

    <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalXXL }}>
      <Field label="Checkbox">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Checkbox label="Enable auto-scaling" />
          <Checkbox label="Enable diagnostics" defaultChecked />
          <Checkbox label="Enable encryption at rest" defaultChecked disabled />
        </div>
      </Field>

      <Field label="Pricing tier">
        <RadioGroup defaultValue="standard">
          <Radio value="free" label="Free — $0/month" />
          <Radio value="basic" label="Basic — $54.75/month" />
          <Radio value="standard" label="Standard — $146/month" />
          <Radio value="premium" label="Premium — $438/month" />
        </RadioGroup>
      </Field>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <Field label="Public access">
          <Switch defaultChecked label="Enabled" />
        </Field>
        <Field label="Diagnostics">
          <Switch label="Disabled" />
        </Field>
      </div>

      <Field label="Region (Select)">
        <Select defaultValue="eastus">
          <option value="eastus">East US</option>
          <option value="westus2">West US 2</option>
          <option value="centralus">Central US</option>
          <option value="northeurope">North Europe</option>
          <option value="westeurope">West Europe</option>
        </Select>
      </Field>

      <Field label="Resource group (Dropdown)">
        <Dropdown placeholder="Select a resource group" defaultValue="prod-rg">
          <Option>prod-rg</Option>
          <Option>dev-rg</Option>
          <Option>staging-rg</Option>
          <Option>test-rg</Option>
        </Dropdown>
      </Field>

      <Field label="Subscription (Combobox)">
        <Combobox placeholder="Search subscriptions...">
          <Option>Visual Studio Enterprise</Option>
          <Option>Pay-As-You-Go</Option>
          <Option>My Dev Subscription</Option>
          <Option>Production Subscription</Option>
        </Combobox>
      </Field>

      <Field label="Instance count">
        <Slider min={1} max={10} defaultValue={3} step={1} />
      </Field>
    </div>
  </div>
);

const meta: Meta = {
  title: 'Components/Selection',
  component: SelectionPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {};
