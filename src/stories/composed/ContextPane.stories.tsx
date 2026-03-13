import type { Meta, StoryObj } from '@storybook/react';
import { useState, type ReactNode } from 'react';
import {
  Button,
  Field,
  Input,
  Text,
  Dropdown,
  Option,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  tokens,
  makeStyles,
} from '@fluentui/react-components';
import { ContextPane, ContextPaneWidth } from '../../components/ContextPane';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const useFormStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  kvRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 0',
    borderBottom: `1px solid ${tokens.colorNeutralStroke3}`,
  },
});

/** Reusable wrapper that manages open state for a given width */
const ContextPaneDemo = ({
  width,
  title,
  subtitle,
  footer,
  children,
}: {
  width: ContextPaneWidth;
  title: string;
  subtitle?: string;
  footer?: ReactNode;
  children: ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button appearance="primary" onClick={() => setOpen(true)}>
        Open context pane
      </Button>
      <ContextPane
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        subtitle={subtitle}
        width={width}
        footer={footer}
      >
        {children}
      </ContextPane>
    </>
  );
};

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof ContextPane> = {
  title: 'Components/Context Pane',
  component: ContextPane,
  tags: ['autodocs'],
  argTypes: {
    width: {
      control: 'select',
      options: ['narrow', 'medium', 'wide', 'extra-wide'],
      description:
        'Width preset: narrow (315px), medium (585px), wide (855px), extra-wide (1125px)',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      story: {
        inline: false,
        height: '700px',
      },
      description: {
        component:
          'A side panel (context pane) that slides in from the right side of the screen. Context panes are displayed in front of the current content, allowing the user to interact with the pane while retaining the context of the previous experience. Choose a width preset based on content complexity: narrow for simple details, medium for forms, wide for data-heavy views, and extra-wide for complex layouts.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ContextPane>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Narrow (315px) — ideal for quick details or simple property lists. */
export const Narrow: Story = {
  render: () => {
    const styles = useFormStyles();
    return (
      <ContextPaneDemo width="narrow" title="Resource details" subtitle="Quick view">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {[
            ['Name', 'my-web-app'],
            ['Type', 'Microsoft.Web/sites'],
            ['Resource Group', 'my-rg'],
            ['Location', 'East US'],
            ['Status', 'Running'],
            ['Subscription', 'My Subscription'],
          ].map(([label, value]) => (
            <div key={label} className={styles.kvRow}>
              <Text style={{ color: tokens.colorNeutralForeground3 }}>{label}</Text>
              <Text weight="semibold">{value}</Text>
            </div>
          ))}
        </div>
      </ContextPaneDemo>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Narrow context pane (315px) displaying a simple key-value property list. Best for quick details or status views.',
      },
    },
  },
};

/** Medium (585px) — default size, suitable for forms and moderate content. */
export const Medium: Story = {
  render: () => {
    const styles = useFormStyles();
    return (
      <ContextPaneDemo
        width="medium"
        title="Create resource group"
        subtitle="Add a new resource group to your subscription"
        footer={
          <>
            <Button appearance="primary">Create</Button>
            <Button appearance="secondary">Cancel</Button>
          </>
        }
      >
        <div className={styles.form}>
          <Field label="Subscription" required>
            <Dropdown placeholder="Select a subscription">
              <Option>My Subscription</Option>
              <Option>Development</Option>
              <Option>Production</Option>
            </Dropdown>
          </Field>
          <Field label="Resource group name" required>
            <Input placeholder="my-resource-group" />
          </Field>
          <Field label="Region" required>
            <Dropdown placeholder="Select a region">
              <Option>East US</Option>
              <Option>West US 2</Option>
              <Option>West Europe</Option>
              <Option>Southeast Asia</Option>
            </Dropdown>
          </Field>
        </div>
      </ContextPaneDemo>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Medium context pane (585px) with a create form and footer actions. This is the default width, suitable for forms, settings, and moderate content.',
      },
    },
  },
};

/** Wide (855px) — for data tables, detailed views, or multi-column layouts. */
export const Wide: Story = {
  render: () => {
    const styles = useFormStyles();
    return (
      <ContextPaneDemo
        width="wide"
        title="Access control (IAM)"
        subtitle="Manage role assignments for this resource"
        footer={
          <>
            <Button appearance="primary">Save</Button>
            <Button appearance="secondary">Cancel</Button>
          </>
        }
      >
        <div className={styles.form}>
          <MessageBar intent="info">
            <MessageBarBody>
              <MessageBarTitle>Role assignments</MessageBarTitle>
              Assign roles to users, groups, or service principals to grant access to this resource.
            </MessageBarBody>
          </MessageBar>
          <Field label="Role" required>
            <Dropdown placeholder="Select a role">
              <Option>Reader</Option>
              <Option>Contributor</Option>
              <Option>Owner</Option>
              <Option>User Access Administrator</Option>
            </Dropdown>
          </Field>
          <Field label="Assign access to" required>
            <Dropdown placeholder="Select type">
              <Option>User, group, or service principal</Option>
              <Option>Managed identity</Option>
            </Dropdown>
          </Field>
          <Field label="Members" required>
            <Input placeholder="Search by name or email" />
          </Field>
          <Field label="Description">
            <Input placeholder="Optional description for this role assignment" />
          </Field>
        </div>
      </ContextPaneDemo>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Wide context pane (855px) for data-heavy views like IAM role assignments. Provides space for complex forms, tables, and multi-column layouts.',
      },
    },
  },
};

/** Extra-wide (1125px) — for complex layouts with side-by-side content. */
export const ExtraWide: Story = {
  render: () => {
    const styles = useFormStyles();
    return (
      <ContextPaneDemo
        width="extra-wide"
        title="Deployment details"
        subtitle="Microsoft.Resources/deployments/my-deployment-20250313"
        footer={
          <>
            <Button appearance="primary">Redeploy</Button>
            <Button appearance="secondary">Close</Button>
          </>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <Text weight="semibold" size={400} style={{ display: 'block', marginBottom: '12px' }}>
              Deployment summary
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                ['Status', 'Succeeded'],
                ['Start time', '3/13/2026, 10:15:00 AM'],
                ['Duration', '2m 34s'],
                ['Correlation ID', 'a1b2c3d4-e5f6-7890'],
                ['Deployment name', 'my-deployment-20250313'],
                ['Resource group', 'my-rg'],
              ].map(([label, value]) => (
                <div key={label} className={styles.kvRow}>
                  <Text style={{ color: tokens.colorNeutralForeground3 }}>{label}</Text>
                  <Text weight="semibold">{value}</Text>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Text weight="semibold" size={400} style={{ display: 'block', marginBottom: '12px' }}>
              Operation details
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                ['Resource', 'my-web-app'],
                ['Type', 'Microsoft.Web/sites'],
                ['Operation', 'Create or Update'],
                ['Status', 'Succeeded'],
                ['API version', '2024-04-01'],
                ['Provisioning state', 'Succeeded'],
              ].map(([label, value]) => (
                <div key={label} className={styles.kvRow}>
                  <Text style={{ color: tokens.colorNeutralForeground3 }}>{label}</Text>
                  <Text weight="semibold">{value}</Text>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ContextPaneDemo>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Extra-wide context pane (1125px) for complex side-by-side layouts. This example shows deployment details with a two-column grid.',
      },
    },
  },
};
