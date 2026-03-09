import type { Meta, StoryObj } from '@storybook/react';
import {
  Tag,
  InteractionTag,
  InteractionTagPrimary,
  InteractionTagSecondary,
  TagGroup,
} from '@fluentui/react-components';

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Fluent UI Tag and InteractionTag display labels for categorization, filtering, or metadata. Use this when you need to show Azure resource tags, filter selections, or category labels. Choose this over Badge when the label needs to be dismissible, editable, or part of a TagGroup with add/remove behavior.',
      },
    },
  },
  argTypes: {
    appearance: { control: 'select', options: ['filled', 'outline', 'brand'] },
    size: { control: 'select', options: ['extra-small', 'small', 'medium'] },
    shape: { control: 'select', options: ['rounded', 'circular'] },
    dismissible: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Tag>;

/** Group of tags for Azure resource metadata (key:value pairs). */
export const TagGroupStory: Story = {
  name: 'Tag Group',
  render: () => (
    <TagGroup>
      <Tag>Environment: Production</Tag>
      <Tag>Region: East US</Tag>
      <Tag>Team: Platform</Tag>
    </TagGroup>
  ),
};

/** Dismissible interaction tags with a remove button. */
export const Dismissible: Story = {
  render: () => (
    <TagGroup>
      <InteractionTag>
        <InteractionTagPrimary>Editable tag</InteractionTagPrimary>
        <InteractionTagSecondary aria-label="Remove" />
      </InteractionTag>
      <InteractionTag>
        <InteractionTagPrimary>Another tag</InteractionTagPrimary>
        <InteractionTagSecondary aria-label="Remove" />
      </InteractionTag>
    </TagGroup>
  ),
};

/** All three appearance variants: filled, outline, brand. */
export const Appearances: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Tag appearance="filled">Filled</Tag>
      <Tag appearance="outline">Outline</Tag>
      <Tag appearance="brand">Brand</Tag>
    </div>
  ),
};

/** Size comparison: extra-small, small, and medium. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Tag size="extra-small">Extra Small</Tag>
      <Tag size="small">Small</Tag>
      <Tag size="medium">Medium</Tag>
    </div>
  ),
};
