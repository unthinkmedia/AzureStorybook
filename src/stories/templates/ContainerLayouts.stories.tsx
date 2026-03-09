import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  makeStyles,
  tokens,
  Text,
} from '@fluentui/react-components';
import {
  AzureBreadcrumb,
  AzureGlobalHeader,
  PageHeader,
  SideNavigation,
  AzureServiceIcon,
  CommandBar,
} from '../../components';
import type { NavItem } from '../../components';
import type { CommandBarGroup } from '../../components';

// ─── Styles ──────────────────────────────────────────────────────

const useStyles = makeStyles({
  /* Full-page shell — always fills the viewport */
  page: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: tokens.colorNeutralBackground1,
  },

  /* Body area below header chrome */
  body: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },

  /* Header section — breadcrumb + page title, no flex growth */
  headerSection: {
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
  },

  /* Main content — expands to fill remaining space */
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    minWidth: 0,
  },

  /* Constrained inner wrapper — centres content with a max-width */
  contentInner: {
    maxWidth: '1200px',
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: '24px',
    paddingRight: '24px',
    boxSizing: 'border-box' as const,
  },

  /* Placeholder content area to visualize the container */
  contentPlaceholder: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '16px',
    borderRadius: '8px',
    border: `2px dashed ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground3,
  },
});

// ─── Shared Data ─────────────────────────────────────────────────

const resourceManagerNavItems: NavItem[] = [
  { key: 'resource-manager', label: 'Resource Manager', icon: <AzureServiceIcon name="resource-manager" size={18} /> },
  { key: 'all-resources', label: 'All resources', icon: <AzureServiceIcon name="all-resources" size={18} />, selected: true },
  { key: 'favorite-resources', label: 'Favorite resources', icon: <AzureServiceIcon name="favorites" size={18} /> },
  { key: 'recent-resources', label: 'Recent resources', icon: <AzureServiceIcon name="recent" size={18} /> },
  { key: 'resource-groups', label: 'Resource groups', icon: <AzureServiceIcon name="resource-groups" size={18} /> },
  { key: 'tags', label: 'Tags', icon: <AzureServiceIcon name="tags" size={18} /> },
  { key: 'organization', label: 'Organization', icon: <AzureServiceIcon name="organization" size={18} />, children: [] },
  {
    key: 'tools',
    label: 'Tools',
    children: [
      { key: 'resource-graph-explorer', label: 'Resource graph explorer', icon: <AzureServiceIcon name="resource-graph-explorer" size={18} /> },
      { key: 'resource-graph-queries', label: 'Resource graph queries', icon: <AzureServiceIcon name="resource-graph-queries" size={18} /> },
      { key: 'resource-visualizer', label: 'Resource visualizer', icon: <AzureServiceIcon name="resource-visualizer" size={18} /> },
      { key: 'resource-explorer', label: 'Resource explorer', icon: <AzureServiceIcon name="resource-explorer" size={18} /> },
      { key: 'arm-api-playground', label: 'ARM API playground', icon: <AzureServiceIcon name="arm-api-playground" size={18} /> },
      { key: 'resource-mover', label: 'Resource mover', icon: <AzureServiceIcon name="resource-mover" size={18} /> },
    ],
  },
  {
    key: 'deployments',
    label: 'Deployments',
    children: [
      { key: 'templates', label: 'Templates', icon: <AzureServiceIcon name="templates" size={18} /> },
      { key: 'template-specs', label: 'Template specs', icon: <AzureServiceIcon name="template-specs" size={18} /> },
    ],
  },
  {
    key: 'help',
    label: 'Help',
    children: [
      { key: 'support', label: 'Support + troubleshooting', icon: <AzureServiceIcon name="support" size={18} /> },
    ],
  },
];

// ─── Meta ────────────────────────────────────────────────────────

const ContentPlaceholder: React.FC<{ label: string }> = ({ label }) => {
  const styles = useStyles();
  return (
    <div className={styles.contentPlaceholder}>
      <Text size={400} weight="semibold">{label}</Text>
    </div>
  );
};

const meta: Meta = {
  title: 'Container/Azure Container',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `The main application container has several layout configurations depending on the page context.
Each layout shares the same global header but differs in which chrome elements (breadcrumb, page title, side navigation) are shown.

## Layout States

| State | Breadcrumb | Page Title + Copilot | Side Nav | When to use |
|-------|-----------|---------------------|----------|-------------|
| **Side Panel** | ✅ | ✅ | ✅ | Resource Manager, specific service with sub-pages |
| **Full Width + Header** | ✅ | ✅ | ❌ | Service browse pages (Load Balancers, VMs, etc.) |
| **Content Only** | ❌ | ❌ | ❌ | Maximized view, embedded experiences, dashboards |
`,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

// ─── Story 1: Side Panel Layout ──────────────────────────────────

export const SidePanelLayout: Story = {
  name: 'Side Panel',
  parameters: {
    docs: {
      description: {
        story: 'Full chrome with breadcrumb, page title bar, Copilot suggestions, and side navigation panel. Used for Resource Manager and service pages with sub-navigation.',
      },
    },
  },
  render: () => {
    const styles = useStyles();
    return (
      <div className={styles.page}>
        <AzureGlobalHeader />
        <div className={styles.headerSection}>
          <AzureBreadcrumb items={[{ label: 'Resource Manager', current: true }]} />
          <PageHeader
            title="Resource Manager | All resources"
            subtitle="Microsoft"
            icon={<AzureServiceIcon name="all-resources" size={28} />}
            onPin={() => {}}
            onMore={() => {}}
            copilotSuggestions={{
              suggestions: [
                { label: 'List supported metrics for these resources' },
                { label: 'Generate PowerShell commands to list these resources' },
                { label: 'Generate a CLI script to identify resource dependencies' },
              ],
            }}
          />
        </div>
        <div className={styles.body}>
          <SideNavigation items={resourceManagerNavItems} />
          <ContentPlaceholder label="Main Content Area" />
        </div>
      </div>
    );
  },
};

// ─── Story 2: Full Width + Header Layout ─────────────────────────

export const FullWidthWithHeader: Story = {
  name: 'Full Width + Header',
  parameters: {
    docs: {
      description: {
        story: 'Breadcrumb and page title bar with Copilot suggestions but no side navigation. Used for service browse pages like Load Balancers, Virtual Machines, etc.',
      },
    },
  },
  render: () => {
    const styles = useStyles();
    return (
      <div className={styles.page}>
        <AzureGlobalHeader />
        <div className={styles.content}>
          <AzureBreadcrumb items={[
            { label: 'Load balancing and content delivery' },
            { label: 'Load balancers', current: true },
          ]} />
          <PageHeader
            title="Load balancing and content delivery | Load balancers"
            subtitle="Preview"
            icon={<AzureServiceIcon name="load-balancers" size={28} />}
            onMore={() => {}}
            copilotSuggestions={{
              suggestions: [
                { label: 'Analyze alerts across load balancers' },
                { label: 'List all alerts for load balancers' },
                { label: 'Find load balancers with routing issues' },
              ],
            }}
          />
          <ContentPlaceholder label="Main Content Area (Full Width)" />
        </div>
      </div>
    );
  },
};

// ─── Story 3: Content Only Layout ────────────────────────────────

export const ContentOnly: Story = {
  name: 'Content Only',
  parameters: {
    docs: {
      description: {
        story: 'Global header only — no breadcrumb, no page title, no side navigation. Content is centred within a `max-width: 1200px` container. Used for home pages, dashboards, or portal-style landing views.',
      },
    },
  },
  render: () => {
    const styles = useStyles();
    return (
      <div className={styles.page}>
        <AzureGlobalHeader />
        <div className={styles.content}>
          <div className={styles.contentInner}>
            <ContentPlaceholder label="Content Area (max-width: 1200px, centred)" />
          </div>
        </div>
      </div>
    );
  },
};
