import type { Meta, StoryObj } from '@storybook/react';
import {
  Badge,
  CounterBadge,
  PresenceBadge,
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

const BadgePage = () => (
  <div style={{ padding: tokens.spacingHorizontalXXL, maxWidth: 800 }}>
    <Text as="h2" size={600} weight="semibold" block style={{ marginBottom: tokens.spacingVerticalXXL }}>Badge</Text>

    <Section title="Status Badges">
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <Badge appearance="filled" color="success">Running</Badge>
        <Badge appearance="filled" color="danger">Stopped</Badge>
        <Badge appearance="filled" color="warning">Degraded</Badge>
        <Badge appearance="filled" color="informative">Creating</Badge>
        <Badge appearance="filled" color="brand">Preview</Badge>
      </div>
    </Section>

    <Section title="Appearances">
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <Badge appearance="filled" color="success">Filled</Badge>
        <Badge appearance="tint" color="success">Tint</Badge>
        <Badge appearance="ghost" color="success">Ghost</Badge>
        <Badge appearance="outline" color="success">Outline</Badge>
      </div>
    </Section>

    <Section title="Counter Badge">
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <CounterBadge count={5} />
        <CounterBadge count={42} appearance="filled" color="danger" />
        <CounterBadge count={1000} overflowCount={999} />
        <CounterBadge count={0} dot />
      </div>
    </Section>

    <Section title="Presence Badge">
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <PresenceBadge status="available" />
        <PresenceBadge status="busy" />
        <PresenceBadge status="away" />
        <PresenceBadge status="offline" />
        <PresenceBadge status="do-not-disturb" />
      </div>
    </Section>
  </div>
);

const meta: Meta = {
  title: 'Components/Badge',
  component: BadgePage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {};
