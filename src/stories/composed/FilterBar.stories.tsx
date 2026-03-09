import type { Meta, StoryObj } from '@storybook/react';
import { FilterBar } from '../../components';

export default {
  title: 'Composed/FilterBar',
  component: FilterBar,
  tags: ['autodocs'],
  argTypes: {
    activeTags: { control: 'object', description: 'Array of active filter tags with id and label' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Simple filter bar with search input and active tag chips. Use this when you need a lightweight row of active filters above a data grid or list. Choose this over FilterPill when you need a simpler text-search-based filter row without popover menus.',
      },
    },
  },
} satisfies Meta<typeof FilterBar>;

type Story = StoryObj<typeof FilterBar>;

/** Default filter bar with search input and no active filters. */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Empty filter bar with just the search input and no active tags. The minimal starting state before any filters are applied.',
      },
    },
  },
};

/** Filter bar with two active tag filters applied. */
export const WithActiveTags: Story = {
  args: {
    activeTags: [
      { id: '1', label: 'Type: Virtual Machine' },
      { id: '2', label: 'Location: East US' },
    ],
  },
};
