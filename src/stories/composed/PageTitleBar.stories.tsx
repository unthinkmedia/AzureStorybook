import type { Meta, StoryObj } from '@storybook/react';
import { PageHeader, AzureServiceIcon } from '../../components';
import {
  Database24Regular,
} from '@fluentui/react-icons';

export default {
  title: 'Composed/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text', description: 'Page title — use pipe (|) to separate service name from section' },
    subtitle: { control: 'text', description: 'Subtitle text below the title' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Azure Portal PageHeader — icon, title with pipe separator, subtitle, pin/more actions, and Copilot suggestion pills. Use this when building the top section of any Azure Portal blade. Combines branding, navigation context, and AI suggestions in a single row.',
      },
    },
  },
} satisfies Meta<typeof PageHeader>;

type Story = StoryObj<typeof PageHeader>;

/** Pipe-separated title with subtitle, pin, ellipsis, Copilot suggestions with overflow, and dismiss. */
/** Full-featured header: icon, pipe-separated title, subtitle, pin, more, and Copilot pills. */
export const WithPipeTitleAndSuggestions: Story = {
  args: {
    title: 'Service name | Section',
    subtitle: 'Contoso',
    icon: <AzureServiceIcon name="management-groups" />,
    onPin: () => {},
    onMore: () => {},
    copilotSuggestions: {
      suggestions: [
        { label: 'Summarize recent activity' },
        { label: 'Show usage trends across groups' },
        { label: 'List recent failed deployments' },
      ],
      maxVisible: 2,
      onDismiss: () => {},
    },
  },

  parameters: {
    docs: {
      description: {
        story:
          'Full-featured header with service icon, pipe-separated title, subtitle, pin/more action buttons, and Copilot suggestion pills with +N overflow.',
      },
    },
  },
};

/** All Copilot suggestion pills visible (no overflow). */
export const WithAllSuggestions: Story = {
  args: {
    title: 'Service name | Items',
    subtitle: 'Contoso',
    icon: <AzureServiceIcon name="subscriptions" />,
    onPin: () => {},
    onMore: () => {},
    copilotSuggestions: {
      suggestions: [
        { label: 'Forecast next billing period' },
        { label: 'Compare plan types' },
        { label: 'Summarize costs this month' },
      ],
      onDismiss: () => {},
    },
  },
};

/** Many suggestions collapsed into a "+N" overflow indicator. */
export const WithOverflow: Story = {
  args: {
    title: 'Service name | Workbooks | Gallery',
    subtitle: 'Contoso',
    icon: <AzureServiceIcon name="monitor" />,
    onPin: () => {},
    onMore: () => {},
    copilotSuggestions: {
      suggestions: [
        { label: 'Show templates for VMs' },
        { label: 'Analyze failure trends' },
        { label: 'Compare performance metrics' },
        { label: 'Export data to CSV' },
        { label: 'Create a new workbook' },
      ],
      maxVisible: 2,
      onDismiss: () => {},
    },
  },
};

/** Title with subtitle, no Copilot suggestions. */
export const WithSubtitle: Story = {
  args: {
    title: 'Service name | Activity log',
    subtitle: 'Contoso',
    icon: <AzureServiceIcon name="monitor" />,
    onPin: () => {},
    onMore: () => {},
  },
};

/** Minimal — just icon and title, no actions or suggestions. */
export const Default: Story = {
  args: {
    title: 'Page title',
    icon: <Database24Regular />,
  },
};
