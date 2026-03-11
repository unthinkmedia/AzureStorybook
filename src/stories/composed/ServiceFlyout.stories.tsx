import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FluentProvider, Button, makeStyles, tokens } from '@fluentui/react-components';
import { ServiceFlyout } from '../../components/ServiceFlyout';
import { CardButton } from '../../components/Buttons/CardButton';
import { azureLightTheme } from '../../themes';

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const useStyles = makeStyles({
  row: {
    display: 'flex',
    gap: '16px',
    padding: '48px 32px',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    backgroundColor: tokens.colorNeutralBackground2,
    minHeight: '400px',
  },
});

/* ------------------------------------------------------------------ */
/*  Sample data matching the Azure Portal home page                    */
/* ------------------------------------------------------------------ */

const services = [
  {
    name: 'Monitor',
    icon: 'monitor',
    description:
      'Azure Monitor is a comprehensive monitoring solution for collecting, analyzing, and responding to monitoring data from your cloud and on-premises environments.',
    actions: [{ label: 'View', icon: 'view' as const }],
    favorited: true,
    trainingLabel: 'Analyze your Azure infrastructure by using Azu… 5 units · 34 min',
    links: [
      { label: 'Overview' },
      { label: 'Get started' },
    ],
  },
  {
    name: 'Resource groups',
    icon: 'resource-groups',
    description:
      'A resource group is a container that holds related resources for an Azure solution.',
    actions: [
      { label: 'Create', icon: 'create' as const, hasMenu: true },
      { label: 'View', icon: 'view' as const },
    ],
    favorited: false,
    trainingLabel: 'Control and organize Azure resources with ARM…  6 units · 45 min',
    links: [
      { label: 'Overview' },
      { label: 'Manage resource groups' },
    ],
  },
  {
    name: 'Subscriptions',
    icon: 'subscriptions',
    description:
      'Manage your Azure subscriptions, billing, and access control.',
    actions: [{ label: 'View', icon: 'view' as const }],
    favorited: false,
    links: [
      { label: 'Overview' },
      { label: 'Cost Management' },
    ],
  },
  {
    name: 'All resources',
    icon: 'all-resources',
    description:
      'View and manage all your Azure resources across subscriptions and resource groups.',
    actions: [{ label: 'View', icon: 'view' as const }],
    favorited: false,
  },
  {
    name: 'Key vaults',
    icon: 'key-vaults',
    description:
      'Azure Key Vault helps safeguard cryptographic keys and secrets used by cloud applications and services.',
    actions: [
      { label: 'Create', icon: 'create' as const },
      { label: 'View', icon: 'view' as const },
    ],
    favorited: false,
    trainingLabel: 'Manage secrets in your server apps with Key Vault…  7 units · 44 min',
    links: [
      { label: 'Overview' },
      { label: 'Quickstart' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Stories                                                             */
/* ------------------------------------------------------------------ */

export default {
  title: 'Composed/ServiceFlyout',
  component: ServiceFlyout,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text', description: 'Service name displayed in flyout header' },
    icon: { control: 'text', description: 'Azure service icon name' },
    description: { control: 'text', description: 'Service description text' },
    favorited: { control: 'boolean', description: 'Whether the service is favorited' },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A hover-activated flyout panel that displays service details — name, quick actions, description, Copilot prompt, training links, and useful links. Wraps any trigger element (CardButton, Button, etc.). Use this when you need a hover-reveal info panel for service tiles on the Azure Portal home page or service directory.',
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
} satisfies Meta<typeof ServiceFlyout>;

type Story = StoryObj<typeof ServiceFlyout>;

/** Flyout wrapping a CardButton (square variant). Hover to reveal the flyout. */
export const WithCardButton: Story = {
  render: () => (
    <div style={{ padding: '48px 32px' }}>
      <ServiceFlyout
        name="Monitor"
        icon="monitor"
        description="Azure Monitor is a comprehensive monitoring solution for collecting, analyzing, and responding to monitoring data from your cloud and on-premises environments."
        favorited
        actions={[{ label: 'View', icon: 'view' }]}
        trainingLabel="Analyze your Azure infrastructure by using Azu… 5 units · 34 min"
        links={[{ label: 'Overview' }, { label: 'Get started' }]}
      >
        <CardButton label="Monitor" icon="monitor" />
      </ServiceFlyout>
    </div>
  ),

  parameters: {
    docs: {
      description: {
        story:
          'ServiceFlyout wrapping a square CardButton. Hover over the card to see the flyout panel with service name, quick actions, description, Copilot prompt, and links.',
      },
    },
  },
};

/** Flyout wrapping a standard Fluent Button. Works with any trigger element. */
export const WithButton: Story = {
  render: () => (
    <div style={{ padding: '48px 32px' }}>
      <ServiceFlyout
        name="Monitor"
        icon="monitor"
        description="Azure Monitor is a comprehensive monitoring solution for collecting, analyzing, and responding to monitoring data from your cloud and on-premises environments."
        favorited
        actions={[{ label: 'View', icon: 'view' }]}
        trainingLabel="Analyze your Azure infrastructure by using Azu… 5 units · 34 min"
        links={[{ label: 'Overview' }, { label: 'Get started' }]}
      >
        <Button appearance="primary">Hover me for Monitor info</Button>
      </ServiceFlyout>
    </div>
  ),
};

/** A card with both Create (split) and View quick actions. */
export const WithCreateAction: Story = {
  render: () => (
    <div style={{ padding: '48px 32px' }}>
      <ServiceFlyout
        name="Resource groups"
        icon="resource-groups"
        description="A resource group is a container that holds related resources for an Azure solution."
        actions={[
          { label: 'Create', icon: 'create', hasMenu: true },
          { label: 'View', icon: 'view' },
        ]}
        trainingLabel="Control and organize Azure resources with ARM…  6 units · 45 min"
        links={[{ label: 'Overview' }, { label: 'Manage resource groups' }]}
      >
        <CardButton label="Resource groups" icon="resource-groups" />
      </ServiceFlyout>
    </div>
  ),
};

/** A row of service cards with flyouts, matching the Azure Portal home page layout. */
export const ServiceRow: Story = {
  render: () => {
    const styles = useStyles();
    return (
      <div className={styles.row}>
        {services.map((svc) => (
          <ServiceFlyout
            key={svc.name}
            name={svc.name}
            icon={svc.icon}
            description={svc.description}
            favorited={svc.favorited}
            actions={svc.actions}
            trainingLabel={svc.trainingLabel}
            links={svc.links}
          >
            <CardButton label={svc.name} icon={svc.icon} />
          </ServiceFlyout>
        ))}
      </div>
    );
  },
};

/** Flyout wrapping a horizontal CardButton variant. */
export const WithHorizontalCard: Story = {
  render: () => (
    <div style={{ padding: '48px 32px' }}>
      <ServiceFlyout
        name="Key vaults"
        icon="key-vaults"
        description="Azure Key Vault helps safeguard cryptographic keys and secrets used by cloud applications and services."
        actions={[
          { label: 'Create', icon: 'create' },
          { label: 'View', icon: 'view' },
        ]}
        trainingLabel="Manage secrets in your server apps with Key Vault…  7 units · 44 min"
        links={[{ label: 'Overview' }, { label: 'Quickstart' }]}
      >
        <CardButton
          label="Key vaults"
          icon="key-vaults"
          variant="horizontal"
          description="Safeguard cryptographic keys and secrets"
        />
      </ServiceFlyout>
    </div>
  ),
};
