import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FluentProvider, makeStyles, tokens } from '@fluentui/react-components';
import { CardButton } from '../../components/CardButton';
import { azureLightTheme } from '../../themes';

const useStyles = makeStyles({
  row: {
    display: 'flex',
    gap: '16px',
    padding: '32px',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '32px',
    backgroundColor: tokens.colorNeutralBackground2,
  },
});

export default {
  title: 'Components/CardButton',
  component: CardButton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['square', 'horizontal'], description: 'Layout variant — square for service tiles, horizontal for resource links' },
    label: { control: 'text', description: 'Button label text' },
    icon: { control: 'text', description: 'Azure service icon name from the icon registry' },
    description: { control: 'text', description: 'Description text (horizontal variant only)' },
    external: { control: 'boolean', description: 'Show external-link icon' },
    tooltip: { control: 'text', description: 'Tooltip text on hover' },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A card-style button combining card and button attributes. Supports a **square** variant (icon-on-top, 104×104) for service shortcuts and a **horizontal** variant (icon-left, text-right) for resource links. Gains a shadow on hover and a brand-colored ring on focus. Use this when you need clickable square tiles for Azure Portal home-page service shortcuts or horizontal cards for resource link lists.',
      },
    },
  },
  decorators: [
    (Story: React.FC) => (
      <FluentProvider theme={azureLightTheme}>
        <Story />
      </FluentProvider>
    ),
  ],
} satisfies Meta<typeof CardButton>;

type Story = StoryObj<typeof CardButton>;

/** Square variant — default. Hover to see the shadow. */
export const Square: Story = {
  args: {
    label: 'Monitor',
    icon: 'monitor',
  },

  parameters: {
    docs: {
      description: {
        story:
          'Square 104×104 card button showing a service icon centered above a label. Hover reveals box-shadow elevation; focus shows a brand-colored ring.',
      },
    },
  },
};

/** Horizontal variant with description and external-link icon. */
export const Horizontal: Story = {
  args: {
    label: 'Microsoft Learn',
    icon: 'help-support',
    variant: 'horizontal',
    description: 'Get started with self-paced learning',
    external: true,
    tooltip: 'Microsoft Learn',
  },
};

/** Row of square buttons — service shortcut style. */
export const SquareRow: Story = {
  render: () => {
    const styles = useStyles();
    const items = [
      { label: 'Resource groups', icon: 'resource-groups' },
      { label: 'All resources', icon: 'all-resources' },
      { label: 'Monitor', icon: 'monitor' },
      { label: 'Subscriptions', icon: 'subscriptions' },
      { label: 'Key vaults', icon: 'key-vaults' },
    ];
    return (
      <div className={styles.row}>
        {items.map((item) => (
          <CardButton key={item.label} label={item.label} icon={item.icon} />
        ))}
      </div>
    );
  },
};

/** Column of horizontal buttons — resource link style. */
export const HorizontalColumn: Story = {
  render: () => {
    const styles = useStyles();
    const items = [
      {
        label: 'Microsoft Learn',
        icon: 'help-support',
        description: 'Get started with self-paced learning',
        external: true,
        tooltip: 'Microsoft Learn',
      },
      {
        label: 'Resource Explorer',
        icon: 'resource-explorer',
        description: 'Browse and manage your Azure resources',
      },
      {
        label: 'ARM API Playground',
        icon: 'arm-api-playground',
        description: 'Try Azure Resource Manager APIs',
        external: true,
      },
    ];
    return (
      <div className={styles.column}>
        {items.map((item) => (
          <CardButton
            key={item.label}
            label={item.label}
            icon={item.icon}
            variant="horizontal"
            description={item.description}
            external={item.external}
            tooltip={item.tooltip}
          />
        ))}
      </div>
    );
  },
};
