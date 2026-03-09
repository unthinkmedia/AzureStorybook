import type { Meta, StoryObj } from '@storybook/react';
import {
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  MessageBarActions,
  Button,
  tokens,
} from '@fluentui/react-components';
import { Dismiss24Regular } from '@fluentui/react-icons';

const meta: Meta<typeof MessageBar> = {
  title: 'Components/MessageBar',
  component: MessageBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Fluent UI MessageBar shows inline status messages with intent-based styling (info, success, warning, error). Use this when you need to communicate status, alerts, or guidance within a page section. Choose this over Tooltip or Dialog when the message should be persistent and visible without user interaction.',
      },
    },
  },
  argTypes: {
    intent: { control: 'select', options: ['info', 'success', 'warning', 'error'] },
    shape: { control: 'select', options: ['rounded', 'square'] },
    layout: { control: 'select', options: ['singleline', 'multiline'] },
  },
};

export default meta;
type Story = StoryObj<typeof MessageBar>;

/** Info intent — deployment or operation status updates. */
export const Info: Story = {
  render: () => (
    <MessageBar intent="info">
      <MessageBarBody>
        <MessageBarTitle>Info</MessageBarTitle>
        Your deployment is in progress.
      </MessageBarBody>
    </MessageBar>
  ),
};

/** Success intent — confirmation of completed operations. */
export const Success: Story = {
  render: () => (
    <MessageBar intent="success">
      <MessageBarBody>
        <MessageBarTitle>Success</MessageBarTitle>
        Resource created successfully.
      </MessageBarBody>
    </MessageBar>
  ),
};

/** Warning intent — alerts about charges or impactful changes. */
export const Warning: Story = {
  render: () => (
    <MessageBar intent="warning">
      <MessageBarBody>
        <MessageBarTitle>Warning</MessageBarTitle>
        This resource will incur charges.
      </MessageBarBody>
    </MessageBar>
  ),
};

/** Error intent — deployment failures or configuration problems. */
export const Error: Story = {
  render: () => (
    <MessageBar intent="error">
      <MessageBarBody>
        <MessageBarTitle>Error</MessageBarTitle>
        Deployment failed. Check activity log for details.
      </MessageBarBody>
    </MessageBar>
  ),
};

/** Dismissible message bar with a close button. */
export const WithDismiss: Story = {
  render: () => (
    <MessageBar intent="success">
      <MessageBarBody>
        <MessageBarTitle>Success</MessageBarTitle>
        Resource created successfully.
      </MessageBarBody>
      <MessageBarActions containerAction={<Button appearance="transparent" icon={<Dismiss24Regular />} aria-label="Dismiss" />} />
    </MessageBar>
  ),
};

/** Message bar with inline action buttons for quick responses. */
export const WithActions: Story = {
  render: () => (
    <MessageBar intent="warning">
      <MessageBarBody>
        <MessageBarTitle>Expiring soon</MessageBarTitle>
        Your subscription will expire in 7 days.
      </MessageBarBody>
      <MessageBarActions containerAction={<Button appearance="transparent" icon={<Dismiss24Regular />} aria-label="Dismiss" />}>
        <Button appearance="transparent" size="small">Renew</Button>
        <Button appearance="transparent" size="small">Learn more</Button>
      </MessageBarActions>
    </MessageBar>
  ),
};

/** Square shape for page-level banners spanning full container width. */
export const SquareShape: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <MessageBar intent="info" shape="rounded">
        <MessageBarBody>Rounded shape (default)</MessageBarBody>
      </MessageBar>
      <MessageBar intent="info" shape="square">
        <MessageBarBody>Square shape — useful for page-level banners</MessageBarBody>
      </MessageBar>
    </div>
  ),
};
