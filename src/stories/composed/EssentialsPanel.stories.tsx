import type { Meta, StoryObj } from '@storybook/react';
import { EssentialsPanel } from '../../components/EssentialsPanel';

export default {
  title: 'Composed/EssentialsPanel',
  component: EssentialsPanel,
  tags: ['autodocs'],
  argTypes: {
    defaultExpanded: { control: 'boolean', description: 'Whether the panel starts expanded' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Azure Portal Essentials panel — a collapsible two-column summary of key resource properties (subscription, location, status, tags). Use this when displaying a resource overview page to show the most important metadata at a glance, matching the Azure Portal resource blade pattern.',
      },
    },
  },
} satisfies Meta<typeof EssentialsPanel>;

type Story = StoryObj<typeof EssentialsPanel>;

/** Resource group essentials — matches Azure Portal screenshot. */
export const ResourceGroup: Story = {
  args: {
    leftItems: [
      {
        label: 'Subscription',
        value: 'PXT Staging Cloud',
        isLink: true,
        labelAction: { text: 'move' },
      },
      {
        label: 'Subscription ID',
        value: 'fbd8f8d0-f72e-4ab2-9add-d4e065e99213',
      },
      {
        label: 'Tags',
        value: 'Add tags',
        isLink: true,
        labelAction: { text: 'edit' },
      },
    ],
    rightItems: [
      {
        label: 'Deployments',
        value: '4 Succeeded',
        isLink: true,
      },
      {
        label: 'Location',
        value: 'West US 2',
      },
    ],
    actions: [
      { label: 'View Cost' },
      { label: 'JSON View' },
    ],
  },

  parameters: {
    docs: {
      description: {
        story:
          'Two-column Essentials panel for a resource group — Subscription, Subscription ID, Tags on the left; Deployments, Location on the right. Includes View Cost and JSON View actions.',
      },
    },
  },
};

/** Virtual machine essentials panel. */
export const VirtualMachine: Story = {
  args: {
    leftItems: [
      {
        label: 'Resource group',
        value: 'rg-production',
        isLink: true,
        labelAction: { text: 'move' },
      },
      {
        label: 'Status',
        value: 'Running',
      },
      {
        label: 'Location',
        value: 'East US 2',
      },
      {
        label: 'Subscription',
        value: 'Production Subscription',
        isLink: true,
      },
      {
        label: 'Subscription ID',
        value: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      },
    ],
    rightItems: [
      {
        label: 'Computer name',
        value: 'vm-web-prod-01',
      },
      {
        label: 'Operating system',
        value: 'Linux (Ubuntu 22.04)',
      },
      {
        label: 'Size',
        value: 'Standard_D4s_v3',
      },
      {
        label: 'Public IP address',
        value: '20.42.19.104',
        isLink: true,
      },
      {
        label: 'Tags',
        value: 'env: production, team: platform',
        labelAction: { text: 'edit' },
      },
    ],
    actions: [
      { label: 'View Cost' },
      { label: 'JSON View' },
    ],
  },
};

/** Collapsed by default. */
export const Collapsed: Story = {
  args: {
    defaultExpanded: false,
    leftItems: [
      {
        label: 'Subscription',
        value: 'PXT Staging Cloud',
        isLink: true,
      },
      {
        label: 'Location',
        value: 'West US 2',
      },
    ],
    rightItems: [
      {
        label: 'Deployments',
        value: '4 Succeeded',
        isLink: true,
      },
    ],
    actions: [
      { label: 'JSON View' },
    ],
  },
};

/** Minimal essentials — left column only, no actions. */
export const Minimal: Story = {
  args: {
    leftItems: [
      {
        label: 'Subscription',
        value: 'My Subscription',
        isLink: true,
      },
      {
        label: 'Location',
        value: 'Central US',
      },
    ],
  },
};
