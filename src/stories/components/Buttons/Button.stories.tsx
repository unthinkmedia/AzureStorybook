import type { Meta, StoryObj } from '@storybook/react';
import {
  Button,
  CompoundButton,
  SplitButton,
  ToggleButton,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
} from '@fluentui/react-components';
import {
  Add24Regular,
  Delete24Regular,
  Edit24Regular,
  ArrowDownload24Regular,
} from '@fluentui/react-icons';

const meta: Meta<typeof Button> = {
  title: 'Components/Buttons/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Fluent UI Button handles user actions with multiple appearances (primary, secondary, outline, subtle, transparent) and sizes. Use this when you need clickable actions in toolbars, dialogs, forms, or inline flows. Choose this over native HTML buttons to ensure consistent Azure Portal styling and accessibility.',
      },
    },
  },
  argTypes: {
    appearance: {
      control: 'select',
      options: ['secondary', 'primary', 'outline', 'subtle', 'transparent'],
    },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    shape: { control: 'select', options: ['rounded', 'circular', 'square'] },
    disabled: { control: 'boolean' },
    disabledFocusable: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

/** Primary button — the main call-to-action on a page or dialog. */
export const Primary: Story = {
  args: {
    appearance: 'primary',
    children: 'Create resource',
    icon: <Add24Regular />,
  },

  parameters: {
    docs: {
      description: {
        story:
          'Primary appearance button — the highest emphasis call-to-action. Use primary for the single most important action on a page, dialog, or command bar.',
      },
    },
  },
};

/** Secondary button — lower emphasis action alongside a primary button. */
export const Secondary: Story = {
  args: {
    appearance: 'secondary',
    children: 'Cancel',
  },
};

/** Outline button — bordered with transparent background. */
export const Outline: Story = {
  args: {
    appearance: 'outline',
    children: 'Export',
    icon: <ArrowDownload24Regular />,
  },
};

/** Subtle button — minimal chrome, blends with surrounding content. */
export const Subtle: Story = {
  args: {
    appearance: 'subtle',
    children: 'Edit',
    icon: <Edit24Regular />,
  },
};

/** Icon-only button — compact action trigger with aria-label for accessibility. */
export const IconOnly: Story = {
  args: {
    appearance: 'subtle',
    icon: <Delete24Regular />,
    'aria-label': 'Delete',
  },
};

/** Disabled state — visually muted and non-interactive. */
export const Disabled: Story = {
  args: {
    appearance: 'primary',
    children: 'Disabled',
    disabled: true,
  },
};

/** Side-by-side comparison of small, medium, and large button sizes. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Button size="small" appearance="primary">Small</Button>
      <Button size="medium" appearance="primary">Medium</Button>
      <Button size="large" appearance="primary">Large</Button>
    </div>
  ),
};

export const Compound: Story = {
  render: () => (
    <CompoundButton secondaryContent="Creates a new Azure resource" icon={<Add24Regular />}>
      Create resource
    </CompoundButton>
  ),
};

export const Split: Story = {
  render: () => (
    <Menu positioning="below-end">
      <MenuTrigger disableButtonEnhancement>
        {(triggerProps) => (
          <SplitButton menuButton={triggerProps} appearance="primary" icon={<Add24Regular />}>
            Create
          </SplitButton>
        )}
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuItem>Virtual machine</MenuItem>
          <MenuItem>Web App</MenuItem>
          <MenuItem>Function App</MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  ),
};

export const Toggle: Story = {
  render: () => (
    <ToggleButton icon={<Edit24Regular />}>Edit mode</ToggleButton>
  ),
};
