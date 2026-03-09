import type { Meta, StoryObj } from '@storybook/react';
import {
  Badge,
  CounterBadge,
  PresenceBadge,
} from '@fluentui/react-components';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Fluent UI Badge displays a small visual indicator for status, count, or category. Use this when you need to show notification counts, status labels (Running, Stopped, Error), or category tags. Choose this over plain text or custom spans for consistent color, size, and rounded-pill styling.',
      },
    },
  },
  argTypes: {
    appearance: { control: 'select', options: ['filled', 'ghost', 'outline', 'tint'] },
    color: { control: 'select', options: ['brand', 'danger', 'important', 'informative', 'severe', 'subtle', 'success', 'warning'] },
    size: { control: 'select', options: ['tiny', 'extra-small', 'small', 'medium', 'large', 'extra-large'] },
    shape: { control: 'select', options: ['circular', 'rounded', 'square'] },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

/** Status badges for Azure resource states: Running, Stopped, Degraded. */
export const StatusBadges: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge appearance="filled" color="success">Running</Badge>
      <Badge appearance="filled" color="danger">Stopped</Badge>
      <Badge appearance="filled" color="warning">Degraded</Badge>
      <Badge appearance="filled" color="informative">Creating</Badge>
      <Badge appearance="filled" color="brand">Preview</Badge>
    </div>
  ),
};

/** Side-by-side comparison of all Badge appearance variants. */
export const Appearances: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge appearance="filled" color="success">Filled</Badge>
      <Badge appearance="tint" color="success">Tint</Badge>
      <Badge appearance="ghost" color="success">Ghost</Badge>
      <Badge appearance="outline" color="success">Outline</Badge>
    </div>
  ),
};

/** Counter badges for numeric notifications and overflow. */
export const Counter: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <CounterBadge count={5} />
      <CounterBadge count={42} appearance="filled" color="danger" />
      <CounterBadge count={1000} overflowCount={999} />
      <CounterBadge count={0} dot />
    </div>
  ),
};

/** Presence badges for user availability status indicators. */
export const Presence: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <PresenceBadge status="available" />
      <PresenceBadge status="busy" />
      <PresenceBadge status="away" />
      <PresenceBadge status="offline" />
      <PresenceBadge status="do-not-disturb" />
    </div>
  ),
};
