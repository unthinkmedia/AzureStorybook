import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SideNavigation } from '../../components/SideNavigation';
import type { NavItem } from '../../components/SideNavigation';
import { AzureServiceIcon } from '../../components/AzureServiceIcon';

export default {
  title: 'Composed/SideNavigation',
  component: SideNavigation,
  tags: ['autodocs'],
  argTypes: {
    defaultCollapsed: { control: 'boolean', description: 'Start in collapsed (icon-only) state' },
    searchEnabled: { control: 'boolean', description: 'Show search bar at the top' },
    width: { control: { type: 'number', min: 160, max: 400 }, description: 'Panel width in pixels' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Azure Portal-style collapsible side navigation panel with search, expandable groups, selected state, and keyboard shortcut footer. Use this when building resource detail pages or service blades that have a left-side navigation tree with grouped sub-pages.',
      },
    },
    layout: 'fullscreen',
  },
  decorators: [
    (Story: React.FC) => (
      <div style={{ height: '600px', display: 'flex' }}>
        <Story />
        <div style={{ flex: 1, padding: '24px', color: '#424242' }}>
          Main content area
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof SideNavigation>;

type Story = StoryObj<typeof SideNavigation>;

/** Default Azure Resource Manager side navigation with all groups pre-populated. */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Full Azure Resource Manager side navigation with grouped items (Tools, Deployments, Help), search bar, and keyboard shortcut footer.',
      },
    },
  },
};

/** Starts in collapsed state — only icons visible. Click the expand button to open. */
export const Collapsed: Story = {
  args: {
    defaultCollapsed: true,
  },
};

/** Search bar hidden — useful for shorter navigation lists. */
export const WithoutSearch: Story = {
  args: {
    searchEnabled: false,
  },
};

/** Custom width of 300px for wider labels. */
export const WideNav: Story = {
  args: {
    width: 300,
  },
};

/** Interactive example with selection state tracking. */
export const Interactive: Story = {
  render: () => {
    const [selectedKey, setSelectedKey] = useState('all-resources');

    const items: NavItem[] = [
      { key: 'resource-manager', label: 'Resource Manager', icon: <AzureServiceIcon name="resource-manager" size={18} /> },
      { key: 'all-resources', label: 'All resources', icon: <AzureServiceIcon name="all-resources" size={18} />, selected: selectedKey === 'all-resources' },
      { key: 'favorite-resources', label: 'Favorite resources', icon: <AzureServiceIcon name="favorites" size={18} />, selected: selectedKey === 'favorite-resources' },
      { key: 'recent-resources', label: 'Recent resources', icon: <AzureServiceIcon name="recent" size={18} />, selected: selectedKey === 'recent-resources' },
      { key: 'resource-groups', label: 'Resource groups', icon: <AzureServiceIcon name="resource-groups" size={18} />, selected: selectedKey === 'resource-groups' },
      { key: 'tags', label: 'Tags', icon: <AzureServiceIcon name="tags" size={18} />, selected: selectedKey === 'tags' },
      { key: 'organization', label: 'Organization', icon: <AzureServiceIcon name="organization" size={18} />, children: [] },
      {
        key: 'tools',
        label: 'Tools',
        children: [
          { key: 'resource-graph-explorer', label: 'Resource graph explorer', icon: <AzureServiceIcon name="resource-graph-explorer" size={18} />, selected: selectedKey === 'resource-graph-explorer' },
          { key: 'resource-graph-queries', label: 'Resource graph queries', icon: <AzureServiceIcon name="resource-graph-queries" size={18} />, selected: selectedKey === 'resource-graph-queries' },
          { key: 'resource-visualizer', label: 'Resource visualizer', icon: <AzureServiceIcon name="resource-visualizer" size={18} />, selected: selectedKey === 'resource-visualizer' },
          { key: 'resource-explorer', label: 'Resource explorer', icon: <AzureServiceIcon name="resource-explorer" size={18} />, selected: selectedKey === 'resource-explorer' },
          { key: 'arm-api-playground', label: 'ARM API playground', icon: <AzureServiceIcon name="arm-api-playground" size={18} />, selected: selectedKey === 'arm-api-playground' },
          { key: 'resource-mover', label: 'Resource mover', icon: <AzureServiceIcon name="resource-mover" size={18} />, selected: selectedKey === 'resource-mover' },
        ],
      },
      {
        key: 'deployments',
        label: 'Deployments',
        children: [
          { key: 'templates', label: 'Templates', icon: <AzureServiceIcon name="templates" size={18} />, selected: selectedKey === 'templates' },
          { key: 'template-specs', label: 'Template specs', icon: <AzureServiceIcon name="template-specs" size={18} />, selected: selectedKey === 'template-specs' },
        ],
      },
      {
        key: 'help',
        label: 'Help',
        children: [
          { key: 'support-troubleshooting', label: 'Support + troubleshooting', icon: <AzureServiceIcon name="help-support" size={18} />, selected: selectedKey === 'support-troubleshooting' },
        ],
      },
    ];

    return <SideNavigation items={items} onItemClick={setSelectedKey} />;
  },
};

/** Minimal navigation with just a few flat items — no groups. */
export const Minimal: Story = {
  args: {
    items: [
      { key: 'overview', label: 'Overview', icon: <AzureServiceIcon name="all-resources" size={18} />, selected: true },
      { key: 'activity-log', label: 'Activity log', icon: <AzureServiceIcon name="recent" size={18} /> },
      { key: 'tags', label: 'Tags', icon: <AzureServiceIcon name="tags" size={18} /> },
    ],
    searchEnabled: false,
    footerText: undefined,
  },
};
