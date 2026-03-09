import type { Meta, StoryObj } from '@storybook/react';
import {
  Tooltip,
  Button,
  Badge,
} from '@fluentui/react-components';
import { Info24Regular } from '@fluentui/react-icons';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Fluent UI Tooltip provides supplementary text on hover or focus for icons, badges, and buttons. Use this when a UI element needs additional explanation that should not take up permanent space. Choose this over MessageBar when the information is contextual to a single element and should only appear on demand.',
      },
    },
  },
  argTypes: {
    positioning: { control: 'select', options: ['above', 'above-start', 'above-end', 'below', 'below-start', 'below-end', 'before', 'before-top', 'before-bottom', 'after', 'after-top', 'after-bottom'] },
    relationship: { control: 'select', options: ['label', 'description', 'inaccessible'] },
    appearance: { control: 'select', options: ['normal', 'inverted'] },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

/** Tooltip on a status badge — adds context about a resource's state. */
export const OnBadge: Story = {
  render: () => (
    <Tooltip content="This resource is running in East US" relationship="description">
      <Badge appearance="filled" color="success">Running</Badge>
    </Tooltip>
  ),
};

/** Tooltip on an icon-only button — provides an accessible label. */
export const OnButton: Story = {
  render: () => (
    <Tooltip content="View more information" relationship="label">
      <Button icon={<Info24Regular />} appearance="subtle" />
    </Tooltip>
  ),
};

/** All four positioning options: above, below, before, after. */
export const Positioning: Story = {
  render: () => (
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
  ),
};

/** Inverted appearance for high-contrast tooltip on dark backgrounds. */
export const Inverted: Story = {
  render: () => (
    <Tooltip content="Inverted tooltip" relationship="description" appearance="inverted">
      <Button>Hover me</Button>
    </Tooltip>
  ),
};
