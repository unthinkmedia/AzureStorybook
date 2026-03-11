import type { Meta, StoryObj } from '@storybook/react';
import { WizardNav } from '../../components/Navigation/WizardNav';
import type { WizardStep } from '../../components/Navigation/WizardNav';

/* -------------------------------------------------------------------------- */
/*  Shared step data                                                          */
/* -------------------------------------------------------------------------- */

const createFlowSteps: WizardStep[] = [
  { key: 'basics', label: 'Basics', status: 'completed' },
  { key: 'managed-rg', label: 'Managed resource groups', status: 'current' },
  { key: 'permissions', label: 'Agent permissions', status: 'not-started' },
  { key: 'review', label: 'Review', status: 'not-started' },
  { key: 'deploy', label: 'Deploy', status: 'not-started' },
];

const midFlowSteps: WizardStep[] = [
  { key: 'basics', label: 'Basics', status: 'completed' },
  { key: 'networking', label: 'Networking', status: 'completed' },
  {
    key: 'security',
    label: 'Security',
    status: 'current',
    description: 'Configure encryption & access',
  },
  { key: 'tags', label: 'Tags', status: 'not-started' },
  { key: 'review', label: 'Review + create', status: 'not-started' },
];

const allCompleteSteps: WizardStep[] = [
  { key: 'basics', label: 'Basics', status: 'completed' },
  { key: 'config', label: 'Configuration', status: 'completed' },
  { key: 'review', label: 'Review', status: 'completed' },
  { key: 'deploy', label: 'Deploy', status: 'completed' },
];

const withErrorSteps: WizardStep[] = [
  { key: 'basics', label: 'Basics', status: 'completed' },
  {
    key: 'config',
    label: 'Configuration',
    status: 'error',
    description: 'Validation failed',
  },
  { key: 'review', label: 'Review', status: 'not-started' },
  { key: 'deploy', label: 'Deploy', status: 'not-started' },
];

/* -------------------------------------------------------------------------- */
/*  Meta                                                                      */
/* -------------------------------------------------------------------------- */

const meta: Meta<typeof WizardNav> = {
  title: 'Components/Navigation/WizardNav',
  component: WizardNav,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A step indicator for multi-step create/deploy wizard flows. Supports both vertical (sidebar) and horizontal (top bar) orientations, matching the Azure Portal wizard blade pattern. Use this when building create, deploy, or configuration wizards that guide users through sequential steps.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof WizardNav>;

/* -------------------------------------------------------------------------- */
/*  Vertical stories                                                          */
/* -------------------------------------------------------------------------- */

/** Vertical wizard in a create flow — second step is current. */
export const Vertical: Story = {
  args: {
    steps: createFlowSteps,
    orientation: 'vertical',
  },

  parameters: {
    docs: {
      description: {
        story:
          'Vertical wizard in a five-step create flow with the second step as current. Use vertical orientation for sidebar placement in create blades.',
      },
    },
  },
};

/** Vertical wizard mid-flow with step description text. */
export const VerticalMidFlow: Story = {
  name: 'Vertical — Mid-flow',
  args: {
    steps: midFlowSteps,
    orientation: 'vertical',
  },
};

/** All steps completed — shows check marks on every step. */
export const VerticalAllComplete: Story = {
  name: 'Vertical — All Complete',
  args: {
    steps: allCompleteSteps,
    orientation: 'vertical',
  },
};

/** Error state on the second step with validation message. */
export const VerticalWithError: Story = {
  name: 'Vertical — Error State',
  args: {
    steps: withErrorSteps,
    orientation: 'vertical',
  },
};

/* -------------------------------------------------------------------------- */
/*  Horizontal stories                                                        */
/* -------------------------------------------------------------------------- */

/** Horizontal wizard layout — same create flow as a top bar. */
export const Horizontal: Story = {
  args: {
    steps: createFlowSteps,
    orientation: 'horizontal',
  },
};

/** Horizontal mid-flow with step description. */
export const HorizontalMidFlow: Story = {
  name: 'Horizontal — Mid-flow',
  args: {
    steps: midFlowSteps,
    orientation: 'horizontal',
  },
};

/** Horizontal layout with all steps completed. */
export const HorizontalAllComplete: Story = {
  name: 'Horizontal — All Complete',
  args: {
    steps: allCompleteSteps,
    orientation: 'horizontal',
  },
};

/** Horizontal layout with error state on second step. */
export const HorizontalWithError: Story = {
  name: 'Horizontal — Error State',
  args: {
    steps: withErrorSteps,
    orientation: 'horizontal',
  },
};
