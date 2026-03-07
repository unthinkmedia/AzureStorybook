import type { Meta, StoryObj } from '@storybook/react';
import {
  Badge,
  Avatar,
  Tag,
  TagGroup,
  Tooltip,
  Spinner,
  ProgressBar,
  Field,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Text,
  tokens,
} from '@fluentui/react-components';

const DataDisplayIndex = () => (
  <div style={{ padding: tokens.spacingHorizontalXXL, maxWidth: 800 }}>
    <Text as="h2" size={600} weight="semibold" block style={{ marginBottom: tokens.spacingVerticalS }}>Data Display Components</Text>
    <Text block style={{ marginBottom: tokens.spacingVerticalXXL, color: tokens.colorNeutralForeground2 }}>
      Components for presenting data, status, and feedback. Each component has its own dedicated page — see the sidebar.
    </Text>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <Badge appearance="filled" color="success">Badge</Badge>
        <Avatar name="Alex Johnson" size={32} />
        <TagGroup>
          <Tag>Tag</Tag>
        </TagGroup>
        <Tooltip content="Tooltip example" relationship="description">
          <Badge appearance="filled" color="brand">Tooltip</Badge>
        </Tooltip>
        <Spinner size="small" />
        <div style={{ width: 120 }}>
          <Field validationState="none">
            <ProgressBar value={0.6} />
          </Field>
        </div>
      </div>

      <MessageBar intent="info">
        <MessageBarBody>
          <MessageBarTitle>MessageBar</MessageBarTitle>
          Each component above has its own story page under Components.
        </MessageBarBody>
      </MessageBar>
    </div>
  </div>
);

const meta: Meta = {
  title: 'Components/DataDisplay',
  component: DataDisplayIndex,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {};
