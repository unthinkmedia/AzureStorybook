import type { Meta, StoryObj } from '@storybook/react';
import {
  Tag,
  InteractionTag,
  InteractionTagPrimary,
  InteractionTagSecondary,
  TagGroup,
  Text,
  tokens,
} from '@fluentui/react-components';
import type { ReactNode } from 'react';

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <div style={{ marginBottom: tokens.spacingVerticalXXL }}>
    <Text as="h3" size={400} weight="semibold" block style={{ marginBottom: tokens.spacingVerticalS }}>{title}</Text>
    {children}
  </div>
);

const TagPage = () => (
  <div style={{ padding: tokens.spacingHorizontalXXL, maxWidth: 800 }}>
    <Text as="h2" size={600} weight="semibold" block style={{ marginBottom: tokens.spacingVerticalXXL }}>Tag</Text>

    <Section title="Tag Group">
      <TagGroup>
        <Tag>Environment: Production</Tag>
        <Tag>Region: East US</Tag>
        <Tag>Team: Platform</Tag>
      </TagGroup>
    </Section>

    <Section title="Interaction Tag (Dismissible)">
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
    </Section>

    <Section title="Appearances">
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Tag appearance="filled">Filled</Tag>
        <Tag appearance="outline">Outline</Tag>
        <Tag appearance="brand">Brand</Tag>
      </div>
    </Section>

    <Section title="Sizes">
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Tag size="small">Small</Tag>
        <Tag size="medium">Medium</Tag>
        <Tag size="extra-small">Extra Small</Tag>
      </div>
    </Section>
  </div>
);

const meta: Meta = {
  title: 'Components/Tag',
  component: TagPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {};
