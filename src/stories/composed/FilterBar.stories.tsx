import type { Meta, StoryObj } from '@storybook/react';
import { FilterBar } from '../../components';

export default {
  title: 'Composed/FilterBar',
  component: FilterBar,
  tags: ['autodocs'],
} satisfies Meta<typeof FilterBar>;

type Story = StoryObj<typeof FilterBar>;

export const Default: Story = {};

export const WithActiveTags: Story = {
  args: {
    activeTags: [
      { id: '1', label: 'Type: Virtual Machine' },
      { id: '2', label: 'Location: East US' },
    ],
  },
};
