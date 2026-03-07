import type { Meta, StoryObj } from '@storybook/react';
import {
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  MessageBarActions,
  Button,
  Text,
  tokens,
} from '@fluentui/react-components';
import { Dismiss24Regular } from '@fluentui/react-icons';
import type { ReactNode } from 'react';

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <div style={{ marginBottom: tokens.spacingVerticalXXL }}>
    <Text as="h3" size={400} weight="semibold" block style={{ marginBottom: tokens.spacingVerticalS }}>{title}</Text>
    {children}
  </div>
);

const MessageBarPage = () => (
  <div style={{ padding: tokens.spacingHorizontalXXL, maxWidth: 800 }}>
    <Text as="h2" size={600} weight="semibold" block style={{ marginBottom: tokens.spacingVerticalXXL }}>MessageBar</Text>

    <Section title="Intents">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <MessageBar intent="info">
          <MessageBarBody>
            <MessageBarTitle>Info</MessageBarTitle>
            Your deployment is in progress.
          </MessageBarBody>
        </MessageBar>
        <MessageBar intent="success">
          <MessageBarBody>
            <MessageBarTitle>Success</MessageBarTitle>
            Resource created successfully.
          </MessageBarBody>
        </MessageBar>
        <MessageBar intent="warning">
          <MessageBarBody>
            <MessageBarTitle>Warning</MessageBarTitle>
            This resource will incur charges.
          </MessageBarBody>
        </MessageBar>
        <MessageBar intent="error">
          <MessageBarBody>
            <MessageBarTitle>Error</MessageBarTitle>
            Deployment failed. Check activity log for details.
          </MessageBarBody>
        </MessageBar>
      </div>
    </Section>

    <Section title="With Dismiss Action">
      <MessageBar intent="success">
        <MessageBarBody>
          <MessageBarTitle>Success</MessageBarTitle>
          Resource created successfully.
        </MessageBarBody>
        <MessageBarActions containerAction={<Button appearance="transparent" icon={<Dismiss24Regular />} aria-label="Dismiss" />} />
      </MessageBar>
    </Section>

    <Section title="With Actions">
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
    </Section>

    <Section title="Shapes">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <MessageBar intent="info" shape="rounded">
          <MessageBarBody>Rounded shape (default)</MessageBarBody>
        </MessageBar>
        <MessageBar intent="info" shape="square">
          <MessageBarBody>Square shape — useful for page-level banners</MessageBarBody>
        </MessageBar>
      </div>
    </Section>
  </div>
);

const meta: Meta = {
  title: 'Components/MessageBar',
  component: MessageBarPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {};
