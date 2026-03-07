import type { Meta, StoryObj } from '@storybook/react';
import { WizardNav } from '../../components/WizardNav';
import type { WizardStep } from '../../components/WizardNav';

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
  title: 'Components/WizardNav',
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
          'A step indicator for multi-step create/deploy wizard flows. Supports both vertical (sidebar) and horizontal (top bar) orientations, matching the Azure Portal wizard blade pattern.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof WizardNav>;

/* -------------------------------------------------------------------------- */
/*  Vertical stories                                                          */
/* -------------------------------------------------------------------------- */

export const Vertical: Story = {
  args: {
    steps: createFlowSteps,
    orientation: 'vertical',
  },
};

export const VerticalMidFlow: Story = {
  name: 'Vertical — Mid-flow',
  args: {
    steps: midFlowSteps,
    orientation: 'vertical',
  },
};

export const VerticalAllComplete: Story = {
  name: 'Vertical — All Complete',
  args: {
    steps: allCompleteSteps,
    orientation: 'vertical',
  },
};

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

export const Horizontal: Story = {
  args: {
    steps: createFlowSteps,
    orientation: 'horizontal',
  },
};

export const HorizontalMidFlow: Story = {
  name: 'Horizontal — Mid-flow',
  args: {
    steps: midFlowSteps,
    orientation: 'horizontal',
  },
};

export const HorizontalAllComplete: Story = {
  name: 'Horizontal — All Complete',
  args: {
    steps: allCompleteSteps,
    orientation: 'horizontal',
  },
};

export const HorizontalWithError: Story = {
  name: 'Horizontal — Error State',
  args: {
    steps: withErrorSteps,
    orientation: 'horizontal',
  },
};
