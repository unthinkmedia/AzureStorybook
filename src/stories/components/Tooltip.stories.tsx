import type { Meta, StoryObj } from '@storybook/react';
import {
  Tooltip,
  Button,
  Badge,
  Text,
  tokens,
} from '@fluentui/react-components';
import { Info24Regular } from '@fluentui/react-icons';
import type { ReactNode } from 'react';

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <div style={{ marginBottom: tokens.spacingVerticalXXL }}>
    <Text as="h3" size={400} weight="semibold" block style={{ marginBottom: tokens.spacingVerticalS }}>{title}</Text>
    {children}
  </div>
);

const TooltipPage = () => (
  <div style={{ padding: tokens.spacingHorizontalXXL, maxWidth: 800 }}>
    <Text as="h2" size={600} weight="semibold" block style={{ marginBottom: tokens.spacingVerticalXXL }}>Tooltip</Text>

    <Section title="On Badge">
      <div style={{ display: 'flex', gap: 8 }}>
        <Tooltip content="This resource is running in East US" relationship="description">
          <Badge appearance="filled" color="success">Running</Badge>
        </Tooltip>
      </div>
    </Section>

    <Section title="On Button">
      <div style={{ display: 'flex', gap: 8 }}>
        <Tooltip content="View more information" relationship="label">
          <Button icon={<Info24Regular />} appearance="subtle" />
        </Tooltip>
      </div>
    </Section>

    <Section title="Positioning">
      <div style={{ display: 'flex', gap: 16, paddingTop: 40 }}>
        <Tooltip content="Above" relationship="description" positioning="above">
          <Button>Above</Button>
        </Tooltip>
        <Tooltip content="Below" relationship="description" positioning="below">
          <Button>Below</Button>
        </Tooltip>
        <Tooltip content="Before" relationship="description" positioning="before">
          <Button>Before</Button>
        </Tooltip>
        <Tooltip content="After" relationship="description" positioning="after">
          <Button>After</Button>
        </Tooltip>
      </div>
    </Section>
  </div>
);

const meta: Meta = {
  title: 'Components/Tooltip',
  component: TooltipPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {};
