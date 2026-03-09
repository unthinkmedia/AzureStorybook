import type { Meta, StoryObj } from '@storybook/react';
import { AzureBreadcrumb } from '../../components';

export default {
  title: 'Composed/AzureBreadcrumb',
  component: AzureBreadcrumb,
  tags: ['autodocs'],
  argTypes: {
    items: { control: 'object', description: 'Array of breadcrumb items with label and optional current flag' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Azure Portal-style breadcrumb trail showing the current navigation hierarchy. Use this when you need to show the user where they are in the portal navigation tree — from root service down to sub-resource. Place above the PageHeader in every detail or browse blade.',
      },
    },
  },
} satisfies Meta<typeof AzureBreadcrumb>;

type Story = StoryObj<typeof AzureBreadcrumb>;

/** Multiple breadcrumb segments showing a deep navigation path. */
export const WithMultipleLevels: Story = {
  args: {
    items: [
      { label: 'Root' },
      { label: 'Category' },
      { label: 'Current item', current: true },
    ],
  },

  parameters: {
    docs: {
      description: {
        story:
          'Three-level breadcrumb trail: Root > Category > Current item. The last item is marked as current and rendered without a link.',
      },
    },
  },
};

/** A single breadcrumb item — used when there is no parent hierarchy. */
export const SingleLevel: Story = {
  args: {
    items: [{ label: 'Home', current: true }],
  },
};
