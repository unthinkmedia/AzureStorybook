import type { Meta, StoryObj } from '@storybook/react';
import {
  Spinner,
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

const SpinnerPage = () => (
  <div style={{ padding: tokens.spacingHorizontalXXL, maxWidth: 800 }}>
    <Text as="h2" size={600} weight="semibold" block style={{ marginBottom: tokens.spacingVerticalXXL }}>Spinner</Text>

    <Section title="Sizes">
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <Spinner size="tiny" label="Tiny" />
        <Spinner size="extra-small" label="Extra Small" />
        <Spinner size="small" label="Small" />
        <Spinner size="medium" label="Medium" />
        <Spinner size="large" label="Large" />
      </div>
    </Section>

    <Section title="With Label">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Spinner size="medium" label="Loading resources..." />
        <Spinner size="small" label="Deploying..." labelPosition="after" />
      </div>
    </Section>

    <Section title="Appearances">
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <Spinner size="medium" appearance="primary" label="Primary" />
        <div style={{ background: tokens.colorNeutralBackground1, padding: 16, borderRadius: 4 }}>
          <Spinner size="medium" appearance="inverted" label="Inverted" />
        </div>
      </div>
    </Section>
  </div>
);

const meta: Meta = {
  title: 'Components/Spinner',
  component: SpinnerPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {};
