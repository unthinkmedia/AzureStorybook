import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { makeStyles, tokens, Text } from '@fluentui/react-components';
import {
  AzureBreadcrumb,
  PageHeader,
  AzureServiceIcon,
  CommandBar,
  SideNavigation,
} from '../../components';
import type { NavItem } from '../../components';
import { SREGlobalHeader } from '../../components/GlobalHeader';

// ─── Styles ──────────────────────────────────────────────────────

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: tokens.colorNeutralBackground1,
  },

  headerSection: {
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
  },

  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    minWidth: 0,
  },

  body: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },

  contentInner: {
    maxWidth: '1200px',
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: '24px',
    paddingRight: '24px',
    boxSizing: 'border-box' as const,
  },

  contentPlaceholder: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '16px',
    borderRadius: tokens.borderRadiusLarge,
    border: `2px dashed ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground3,
  },
});

// ─── Helpers ─────────────────────────────────────────────────────

const ContentPlaceholder: React.FC<{ label: string }> = ({ label }) => {
  const styles = useStyles();
  return (
    <div className={styles.contentPlaceholder}>
      <Text size={400} weight="semibold">
        {label}
      </Text>
    </div>
  );
};

// ─── Shared Data ─────────────────────────────────────────────────

const sreAgentNavItems: NavItem[] = [
  {
    key: 'overview',
    label: 'Overview',
    icon: <AzureServiceIcon name="copilot" size={18} />,
    selected: true,
  },
  { key: 'agents', label: 'Agents', icon: <AzureServiceIcon name="all-resources" size={18} /> },
  { key: 'incidents', label: 'Incidents', icon: <AzureServiceIcon name="recent" size={18} /> },
  { key: 'runbooks', label: 'Runbooks', icon: <AzureServiceIcon name="templates" size={18} /> },
  {
    key: 'agent-spaces',
    label: 'Agent spaces',
    icon: <AzureServiceIcon name="resource-groups" size={18} />,
  },
  {
    key: 'monitoring',
    label: 'Monitoring',
    children: [
      {
        key: 'dashboards',
        label: 'Dashboards',
        icon: <AzureServiceIcon name="resource-visualizer" size={18} />,
      },
      { key: 'alerts', label: 'Alerts', icon: <AzureServiceIcon name="favorites" size={18} /> },
      {
        key: 'logs',
        label: 'Logs',
        icon: <AzureServiceIcon name="resource-graph-queries" size={18} />,
      },
    ],
  },
  {
    key: 'settings',
    label: 'Settings',
    children: [
      {
        key: 'configuration',
        label: 'Configuration',
        icon: <AzureServiceIcon name="tags" size={18} />,
      },
      {
        key: 'permissions',
        label: 'Permissions',
        icon: <AzureServiceIcon name="organization" size={18} />,
      },
    ],
  },
  {
    key: 'help',
    label: 'Help',
    children: [
      {
        key: 'support',
        label: 'Support + troubleshooting',
        icon: <AzureServiceIcon name="support" size={18} />,
      },
    ],
  },
];

// ─── Meta ────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Container/SRE Container',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `The SRE Agent container uses a light-themed global header with the SRE Agent branding and PREVIEW badge.
It shares the same layout patterns as the Azure Container but with SRE-specific chrome.

## Layout States

| State | Breadcrumb | Page Title + Copilot | Side Nav | When to use |
|-------|-----------|---------------------|----------|-------------|
| **Side Panel** | ✅ | ✅ | ✅ | Agent detail with sub-navigation |
| **Full Width + Header** | ✅ | ✅ | ❌ | Agent list, agent spaces browse |
| **Content Only** | ❌ | ❌ | ❌ | Agent detail view, dashboards |
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
        story:
          'Full chrome with breadcrumb, page header, and side navigation panel. Used for agent detail pages with sub-navigation (monitoring, runbooks, settings).',
      },
    },
  },
  render: () => {
    const styles = useStyles();
    return (
      <div className={styles.page}>
        <SREGlobalHeader userName="Alex Britez" userEmail="alexbritez@microsoft.com" />
        <div className={styles.headerSection}>
          <AzureBreadcrumb
            items={[{ label: 'Azure SRE Agent' }, { label: 'Agents', current: true }]}
          />
          <PageHeader
            title="Azure SRE Agent | Agents"
            subtitle="Preview"
            icon={<AzureServiceIcon name="copilot" size={28} />}
            onMore={() => {}}
          />
        </div>
        <div className={styles.body}>
          <SideNavigation items={sreAgentNavItems} />
          <ContentPlaceholder label="Agent Detail Content Area" />
        </div>
      </div>
    );
  },
};

// ─── Story 2: Full Width + Header ────────────────────────────────

export const FullWidthWithHeader: Story = {
  name: 'Full Width + Header',
  parameters: {
    docs: {
      description: {
        story:
          'SRE Agent with breadcrumb and page header. Used for agent listing and management pages.',
      },
    },
  },
  render: () => {
    const styles = useStyles();
    return (
      <div className={styles.page}>
        <SREGlobalHeader userName="Alex Britez" userEmail="alexbritez@microsoft.com" />
        <div className={styles.content}>
          <AzureBreadcrumb items={[{ label: 'Azure SRE Agent', current: true }]} />
          <PageHeader
            title="Azure SRE Agent | Agents"
            subtitle="Preview"
            icon={<AzureServiceIcon name="copilot" size={28} />}
            onMore={() => {}}
          />
          <ContentPlaceholder label="Agent List Content Area" />
        </div>
      </div>
    );
  },
};

// ─── Story 3: Content Only ───────────────────────────────────────

export const ContentOnly: Story = {
  name: 'Content Only',
  parameters: {
    docs: {
      description: {
        story:
          'SRE header only — no breadcrumb, no page title. Content is centred within a `max-width: 1200px` container. Used for agent detail views or embedded dashboards.',
      },
    },
  },
  render: () => {
    const styles = useStyles();
    return (
      <div className={styles.page}>
        <SREGlobalHeader
          userName="Alex Britez"
          userEmail="alexbritez@microsoft.com"
          notificationCount={2}
        />
        <div className={styles.content}>
          <div className={styles.contentInner}>
            <ContentPlaceholder label="Content Area (max-width: 1200px, centred)" />
          </div>
        </div>
      </div>
    );
  },
};
