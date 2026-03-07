import type { Meta, StoryObj } from '@storybook/react';
import { AzureBreadcrumb } from '../../components';

export default {
  title: 'Composed/AzureBreadcrumb',
  component: AzureBreadcrumb,
  tags: ['autodocs'],
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
};

/** A single breadcrumb item — used when there is no parent hierarchy. */
export const SingleLevel: Story = {
  args: {
    items: [{ label: 'Home', current: true }],
  },
};
