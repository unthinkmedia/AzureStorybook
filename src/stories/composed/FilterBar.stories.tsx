import type { Meta, StoryObj } from '@storybook/react';
import { FilterBar } from '../../components';

export default {
  title: 'Composed/FilterBar',
  component: FilterBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Azure Portal-style filter bar with search input, filter pills, and an Add filter button. Each pill shows a label, separator, and value — matching the native Azure Portal filter row pattern.',
      },
    },
  },
} satisfies Meta<typeof FilterBar>;

type Story = StoryObj<typeof FilterBar>;

/** Default filter bar matching the Azure Portal pattern. */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Default filter bar with Subscription (selected), Resource Group, Type, and Location pills — the standard Azure Portal all-resources filter layout.',
      },
    },
  },
};

/** Filter bar with popover menus on each pill. */
export const WithOptions: Story = {
  args: {
    filters: [
      {
        label: 'Subscription',
        value: '3 selected',
        selected: true,
        options: [
          { key: 'sub1', label: 'Azure subscription 1' },
          { key: 'sub2', label: 'Azure subscription 2' },
          { key: 'sub3', label: 'Visual Studio Enterprise' },
        ],
        selectedKeys: ['sub1', 'sub2', 'sub3'],
      },
      {
        label: 'Resource Group',
        value: 'all',
        dismissible: true,
        options: [
          { key: 'rg1', label: 'rg-production' },
          { key: 'rg2', label: 'rg-staging' },
          { key: 'rg3', label: 'rg-dev' },
        ],
      },
      {
        label: 'Type',
        value: 'all',
        dismissible: true,
        options: [
          { key: 'vm', label: 'Virtual Machine' },
          { key: 'app', label: 'App Service' },
          { key: 'sql', label: 'SQL Database' },
          { key: 'storage', label: 'Storage Account' },
        ],
      },
      {
        label: 'Location',
        value: 'all',
        dismissible: true,
        options: [
          { key: 'eastus', label: 'East US' },
          { key: 'westus2', label: 'West US 2' },
          { key: 'centralus', label: 'Central US' },
        ],
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Filter pills with popover checkbox menus for selecting values. Click a pill to open its filter options.',
      },
    },
  },
};
