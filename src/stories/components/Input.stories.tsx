import type { Meta, StoryObj } from '@storybook/react';
import {
  Input,
  Label,
  Field,
  SearchBox,
  Textarea,
  SpinButton,
} from '@fluentui/react-components';
import { Search24Regular, Key24Regular } from '@fluentui/react-icons';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    appearance: { control: 'select', options: ['outline', 'underline', 'filled-darker', 'filled-lighter'] },
    type: { control: 'select', options: ['text', 'password', 'email', 'number', 'url', 'tel', 'search'] },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { placeholder: 'Enter resource name...' },
  decorators: [
    (Story) => (
      <Field label="Resource name" required>
        <Story />
      </Field>
    ),
  ],
};

export const WithContentBefore: Story = {
  args: {
    contentBefore: <Key24Regular />,
    placeholder: 'Enter API key',
    type: 'password',
  },
  decorators: [
    (Story) => (
      <Field label="API Key">
        <Story />
      </Field>
    ),
  ],
};

export const Disabled: Story = {
  args: { value: 'my-resource-group', disabled: true },
  decorators: [
    (Story) => (
      <Field label="Resource group">
        <Story />
      </Field>
    ),
  ],
};

export const Validation: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400 }}>
      <Field label="Success" validationState="success" validationMessage="Name is available">
        <Input value="my-unique-name" />
      </Field>
      <Field label="Warning" validationState="warning" validationMessage="Name may conflict">
        <Input value="common-name" />
      </Field>
      <Field label="Error" validationState="error" validationMessage="Name is required">
        <Input value="" />
      </Field>
    </div>
  ),
};

export const Search: Story = {
  render: () => (
    <SearchBox placeholder="Search all resources..." style={{ width: 320 }} />
  ),
};

export const TextArea: Story = {
  render: () => (
    <Field label="Description">
      <Textarea placeholder="Describe this resource..." resize="vertical" rows={4} />
    </Field>
  ),
};

export const Spin: Story = {
  render: () => (
    <Field label="Instance count">
      <SpinButton defaultValue={1} min={1} max={100} />
    </Field>
  ),
};

export const Appearances: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
      {(['outline', 'underline', 'filled-darker', 'filled-lighter'] as const).map((appearance) => (
        <Field key={appearance} label={appearance}>
          <Input appearance={appearance} placeholder="Enter value" />
        </Field>
      ))}
    </div>
  ),
};
