import type { Meta, StoryObj } from '@storybook/react';
import {
  ProgressBar,
  Field,
  Text,
  tokens,
} from '@fluentui/react-components';
import type { ReactNode } from 'react';

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <div style={{ marginBottom: tokens.spacingVerticalXXL }}>
    <Text as="h3" size={400} weight="semibold" block style={{ marginBottom: tokens.spacingVerticalS }}>{title}</Text>
    {children}
  </div>
);

const ProgressBarPage = () => (
  <div style={{ padding: tokens.spacingHorizontalXXL, maxWidth: 800 }}>
    <Text as="h2" size={600} weight="semibold" block style={{ marginBottom: tokens.spacingVerticalXXL }}>ProgressBar</Text>

    <Section title="Determinate">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
        <Field validationMessage="Running (45%)" validationState="none">
          <ProgressBar value={0.45} />
        </Field>
        <Field validationMessage="Almost done (80%)" validationState="none">
          <ProgressBar value={0.8} />
        </Field>
        <Field validationMessage="Complete (100%)" validationState="success">
          <ProgressBar value={1} color="success" />
        </Field>
      </div>
    </Section>

    <Section title="Indeterminate">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
        <Field validationMessage="Deploying..." validationState="none">
          <ProgressBar />
        </Field>
      </div>
    </Section>

    <Section title="Colors">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
        <Field validationMessage="Brand" validationState="none">
          <ProgressBar value={0.6} color="brand" />
        </Field>
        <Field validationMessage="Success" validationState="success">
          <ProgressBar value={1} color="success" />
        </Field>
        <Field validationMessage="Warning" validationState="warning">
          <ProgressBar value={0.3} color="warning" />
        </Field>
        <Field validationMessage="Error" validationState="error">
          <ProgressBar value={0.1} color="error" />
        </Field>
      </div>
    </Section>

    <Section title="Thickness">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
        <Field validationMessage="Medium (default)" validationState="none">
          <ProgressBar value={0.5} thickness="medium" />
        </Field>
        <Field validationMessage="Large" validationState="none">
          <ProgressBar value={0.5} thickness="large" />
        </Field>
      </div>
    </Section>
  </div>
);

const meta: Meta = {
  title: 'Components/ProgressBar',
  component: ProgressBarPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {};
