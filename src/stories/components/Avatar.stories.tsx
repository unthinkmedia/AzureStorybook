import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from '@fluentui/react-components';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Fluent UI Avatar renders a person or entity image with fallback initials and optional presence badge. Use this when you need to display a user photo, initials, or entity icon in headers, lists, comments, or cards. Choose this over a plain image tag to get consistent sizing, fallback behavior, and presence indicators.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: [16, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 96, 120, 128] },
    shape: { control: 'select', options: ['circular', 'square'] },
    active: { control: 'select', options: ['active', 'inactive', 'unset'] },
    color: { control: 'select', options: ['neutral', 'brand', 'colorful', 'dark-red', 'cranberry', 'pumpkin', 'peach', 'marigold', 'gold', 'brass', 'brown', 'forest', 'seafoam', 'dark-green', 'light-teal', 'teal', 'steel', 'blue', 'royal-blue', 'cornflower', 'navy', 'lavender', 'purple', 'grape', 'lilac', 'pink', 'magenta', 'plum', 'beige', 'mink', 'platinum', 'anchor'] },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

/** Default avatar with initials generated from the name prop. */
export const Default: Story = {
  args: {
    name: 'Alex Johnson',
    size: 48,
  },
};

/** Side-by-side comparison of all available avatar sizes. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Avatar name="Alex Johnson" size={24} />
      <Avatar name="Alex Johnson" size={32} />
      <Avatar name="Alex Johnson" size={48} />
      <Avatar name="Alex Johnson" size={64} />
      <Avatar name="Alex Johnson" size={96} />
    </div>
  ),
};

/** Avatars with presence badges showing availability status. */
export const WithPresence: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Avatar name="Alex Johnson" size={48} badge={{ status: 'available' }} />
      <Avatar name="Sarah Chen" size={48} badge={{ status: 'busy' }} />
      <Avatar name="Jordan Lee" size={48} badge={{ status: 'away' }} />
      <Avatar name="Taylor Swift" size={48} badge={{ status: 'offline' }} />
    </div>
  ),
};

/** Fallback avatar when no name or image is provided. */
export const Anonymous: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Avatar size={32} />
      <Avatar size={48} />
    </div>
  ),
};

/** Square shape for non-person entities such as teams, groups, or bots. */
export const SquareShape: Story = {
  args: {
    name: 'Platform Team',
    size: 48,
    shape: 'square',
  },
};

/** Active ring indicator — highlights the currently speaking or selected user. */
export const ActiveState: Story = {
  args: {
    name: 'Alex Johnson',
    size: 56,
    active: 'active',
  },
};
