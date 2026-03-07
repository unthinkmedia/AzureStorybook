import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import {
  Badge,
  CounterBadge,
  PresenceBadge,
  Avatar,
  Tag,
  InteractionTag,
  InteractionTagPrimary,
  InteractionTagSecondary,
  TagGroup,
  Tooltip,
  Spinner,
  ProgressBar,
  Field,
  Divider,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  MessageBarActions,
  Button,
  Text,
  tokens,
} from '@fluentui/react-components';
import { Dismiss24Regular, Info24Regular } from '@fluentui/react-icons';

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <div style={{ marginBottom: tokens.spacingVerticalXXL }}>
    <Text as="h3" size={400} weight="semibold" block style={{ marginBottom: tokens.spacingVerticalS }}>{title}</Text>
    {children}
  </div>
);

const DataDisplayPage = () => (
  <div style={{ padding: tokens.spacingHorizontalXXL, maxWidth: 800 }}>
    <Text as="h2" size={600} weight="semibold" block style={{ marginBottom: tokens.spacingVerticalXXL }}>Data Display Components</Text>

    <Section title="Badge">
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <Badge appearance="filled" color="success">Running</Badge>
        <Badge appearance="filled" color="danger">Stopped</Badge>
        <Badge appearance="filled" color="warning">Degraded</Badge>
        <Badge appearance="filled" color="informative">Creating</Badge>
        <Badge appearance="filled" color="brand">Preview</Badge>
        <Badge appearance="tint" color="success">Healthy</Badge>
        <Badge appearance="ghost" color="danger">Error</Badge>
      </div>
    </Section>

    <Section title="Counter Badge">
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <CounterBadge count={5} />
        <CounterBadge count={42} appearance="filled" color="danger" />
        <CounterBadge count={1000} overflowCount={999} />
        <CounterBadge count={0} dot />
      </div>
    </Section>

    <Section title="Presence Badge">
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <PresenceBadge status="available" />
        <PresenceBadge status="busy" />
        <PresenceBadge status="away" />
        <PresenceBadge status="offline" />
        <PresenceBadge status="do-not-disturb" />
      </div>
    </Section>

    <Section title="Avatar">
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Avatar name="Alex Johnson" size={24} />
        <Avatar name="Alex Johnson" size={32} />
        <Avatar name="Alex Johnson" size={48} badge={{ status: 'available' }} />
        <Avatar name="Sarah Chen" size={48} badge={{ status: 'busy' }} />
        <Avatar size={48} />
      </div>
    </Section>

    <Section title="Tags">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <TagGroup>
          <Tag>Environment: Production</Tag>
          <Tag>Region: East US</Tag>
          <Tag>Team: Platform</Tag>
        </TagGroup>
        <TagGroup>
          <InteractionTag>
            <InteractionTagPrimary>Editable tag</InteractionTagPrimary>
            <InteractionTagSecondary aria-label="Remove" />
          </InteractionTag>
        </TagGroup>
      </div>
    </Section>

    <Divider style={{ margin: '24px 0' }} />

    <Section title="Tooltip">
      <div style={{ display: 'flex', gap: 8 }}>
        <Tooltip content="This resource is running in East US" relationship="description">
          <Badge appearance="filled" color="success">Running</Badge>
        </Tooltip>
      </div>
    </Section>

    <Section title="Spinner">
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <Spinner size="tiny" />
        <Spinner size="extra-small" />
        <Spinner size="small" />
        <Spinner size="medium" label="Loading resources..." />
        <Spinner size="large" />
      </div>
    </Section>

    <Section title="ProgressBar">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
        <Field validationMessage="Running (45%)" validationState="none">
          <ProgressBar value={0.45} />
        </Field>
        <Field validationMessage="Success (100%)" validationState="success">
          <ProgressBar value={1} color="success" />
        </Field>
        <Field validationMessage="Deploying..." validationState="none">
          <ProgressBar />
        </Field>
      </div>
    </Section>

    <Section title="MessageBar">
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
          <MessageBarActions containerAction={<Button appearance="transparent" icon={<Dismiss24Regular />} aria-label="Dismiss" />} />
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
  </div>
);

const meta: Meta = {
  title: 'Components/DataDisplay',
  component: DataDisplayPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {};
