import type { Meta, StoryObj } from '@storybook/react';
import {
  Avatar,
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

const AvatarPage = () => (
  <div style={{ padding: tokens.spacingHorizontalXXL, maxWidth: 800 }}>
    <Text as="h2" size={600} weight="semibold" block style={{ marginBottom: tokens.spacingVerticalXXL }}>Avatar</Text>

    <Section title="Sizes">
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Avatar name="Alex Johnson" size={24} />
        <Avatar name="Alex Johnson" size={32} />
        <Avatar name="Alex Johnson" size={48} />
        <Avatar name="Alex Johnson" size={64} />
        <Avatar name="Alex Johnson" size={96} />
      </div>
    </Section>

    <Section title="With Presence">
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Avatar name="Alex Johnson" size={48} badge={{ status: 'available' }} />
        <Avatar name="Sarah Chen" size={48} badge={{ status: 'busy' }} />
        <Avatar name="Jordan Lee" size={48} badge={{ status: 'away' }} />
        <Avatar name="Taylor Swift" size={48} badge={{ status: 'offline' }} />
      </div>
    </Section>

    <Section title="Default (No Name)">
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Avatar size={32} />
        <Avatar size={48} />
      </div>
    </Section>
  </div>
);

const meta: Meta = {
  title: 'Components/Avatar',
  component: AvatarPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {};
