import type { Meta, StoryObj } from '@storybook/react';
import { InfoTable } from '../../components/InfoTable';

export default {
  title: 'Composed/InfoTable',
  component: InfoTable,
  tags: ['autodocs'],
  argTypes: {
    columns: {
      control: { type: 'select' },
      options: [1, 2, 3],
      description: 'Number of label-value columns at wide widths',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A responsive multi-column information table for displaying key-value property pairs. Automatically stacks to a single column on narrow viewports. Commonly used in Azure Portal resource overview pages, Entra ID tenant info panels, and any context where structured metadata needs to be displayed at a glance.',
      },
    },
  },
} satisfies Meta<typeof InfoTable>;

type Story = StoryObj<typeof InfoTable>;

/** Microsoft Entra ID tenant overview — two-column responsive layout. */
export const TenantOverview: Story = {
  args: {
    columns: 2,
    items: [
      { label: 'Name', value: 'Microsoft' },
      { label: 'Users', value: '988,830', isLink: true },
      {
        label: 'Tenant ID',
        value: '72f988bf-86f1-41af-91ab-2d7cd011db47',
        copyable: true,
      },
      { label: 'Groups', value: '1,035,595', isLink: true },
      { label: 'Primary domain', value: 'microsoft.onmicrosoft.com' },
      { label: 'Applications', value: '298,420', isLink: true },
      { label: 'License', value: 'Microsoft Entra ID P2' },
      { label: 'Devices', value: '2,562,265', isLink: true },
    ],
  },
};

/** Single-column stacked layout. */
export const SingleColumn: Story = {
  args: {
    columns: 1,
    items: [
      { label: 'Name', value: 'Microsoft' },
      {
        label: 'Tenant ID',
        value: '72f988bf-86f1-41af-91ab-2d7cd011db47',
        copyable: true,
      },
      { label: 'Primary domain', value: 'microsoft.onmicrosoft.com' },
      { label: 'License', value: 'Microsoft Entra ID P2' },
      { label: 'Users', value: '988,830', isLink: true },
      { label: 'Groups', value: '1,035,595', isLink: true },
      { label: 'Applications', value: '298,420', isLink: true },
      { label: 'Devices', value: '2,562,265', isLink: true },
    ],
  },
};

/** Resource-level metadata example. */
export const ResourceInfo: Story = {
  args: {
    columns: 2,
    items: [
      { label: 'Resource group', value: 'rg-production-eastus', isLink: true },
      { label: 'Location', value: 'East US' },
      {
        label: 'Subscription ID',
        value: 'fbd8f8d0-f72e-4ab2-9add-d4e065e99213',
        copyable: true,
      },
      { label: 'Status', value: 'Active' },
      { label: 'Subscription', value: 'PXT Staging Cloud', isLink: true },
      { label: 'Tags', value: 'env: production' },
    ],
  },
};

/** Three-column layout for dense info panels. */
export const ThreeColumns: Story = {
  args: {
    columns: 3,
    items: [
      { label: 'Name', value: 'my-app-service' },
      { label: 'Status', value: 'Running' },
      { label: 'Region', value: 'West US 2' },
      { label: 'Plan', value: 'Premium v3 P1' },
      { label: 'OS', value: 'Linux' },
      { label: 'Runtime', value: 'Node 20 LTS' },
      { label: 'URL', value: 'https://my-app.azurewebsites.net', isLink: true },
      { label: 'Resource group', value: 'rg-production', isLink: true },
      { label: 'Subscription', value: 'Enterprise Prod', isLink: true },
    ],
  },
};
