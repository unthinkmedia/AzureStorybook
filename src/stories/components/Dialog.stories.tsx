import type { Meta, StoryObj } from '@storybook/react';
import {
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogContent,
  DialogActions,
  Button,
  Field,
  Input,
  Text,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  tokens,
} from '@fluentui/react-components';
import { Delete24Regular } from '@fluentui/react-icons';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  argTypes: {
    modalType: { control: 'select', options: ['modal', 'non-modal', 'alert'], description: 'Dialog modality type' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Fluent UI Dialog presents a modal overlay for confirmations, forms, or information display. Use this when you need to capture user input (create resource, confirm deletion) or show details that require focused attention. Choose this over inline forms when the action is disruptive or requires explicit user acknowledgment.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

/** Standard form dialog — create a resource with required fields. */
export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger disableButtonEnhancement>
        <Button appearance="primary">Open dialog</Button>
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Create resource group</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalM }}>
              <Field label="Resource group name" required>
                <Input placeholder="my-resource-group" />
              </Field>
              <Field label="Region" required>
                <Input value="East US" />
              </Field>
            </div>
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">Cancel</Button>
            </DialogTrigger>
            <Button appearance="primary">Create</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  ),

  parameters: {
    docs: {
      description: {
        story:
          'Standard create dialog with required form fields (resource group name, region). Demonstrates DialogTitle, DialogContent with Field inputs, and DialogActions with Cancel/Create buttons.',
      },
    },
  },
};

/** Destructive action with a warning message and typed confirmation input. */
export const Destructive: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger disableButtonEnhancement>
        <Button appearance="primary" icon={<Delete24Regular />}>Delete resource</Button>
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Delete resource group?</DialogTitle>
          <DialogContent>
            <MessageBar intent="warning" style={{ marginBottom: tokens.spacingVerticalM }}>
              <MessageBarBody>
                <MessageBarTitle>Warning</MessageBarTitle>
                This action cannot be undone. All resources in this group will be permanently deleted.
              </MessageBarBody>
            </MessageBar>
            <Field label='Type "my-resource-group" to confirm' required>
              <Input placeholder="my-resource-group" />
            </Field>
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">Cancel</Button>
            </DialogTrigger>
            <Button appearance="primary" style={{ backgroundColor: tokens.colorPaletteRedBackground3 }}>
              Delete
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  ),
};

/** Read-only informational dialog displaying key-value resource details. */
export const Info: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger disableButtonEnhancement>
        <Button>View details</Button>
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Resource details</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS }}>
              {[
                ['Name', 'my-web-app'],
                ['Type', 'Microsoft.Web/sites'],
                ['Resource Group', 'my-rg'],
                ['Location', 'East US'],
                ['Status', 'Running'],
                ['Subscription', 'My Subscription'],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text style={{ color: tokens.colorNeutralForeground3 }}>{label}</Text>
                  <Text weight="semibold">{value}</Text>
                </div>
              ))}
            </div>
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="primary">Close</Button>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  ),
};
