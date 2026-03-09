import type { Meta, StoryObj } from '@storybook/react';
import { coherenceTokens } from '../../themes/coherenceTokens';

const SpacingBlock = ({ label, size }: { label: string; size: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
    <code style={{ fontSize: 12, color: '#616161', width: 120 }}>{label}</code>
    <div
      style={{
        width: size,
        height: 24,
        backgroundColor: '#0f6cbd',
        borderRadius: 2,
        opacity: 0.7,
      }}
    />
    <span style={{ fontSize: 12, color: '#616161' }}>{size}</span>
  </div>
);

const SpacingPage = () => (
  <div style={{ padding: 16 }}>
    <h2 style={{ marginBottom: 24 }}>Azure Design Tokens — Spacing</h2>
    {Object.entries(coherenceTokens.spacing).map(([name, value]) => (
      <SpacingBlock key={name} label={`--spacing-${name}`} size={value} />
    ))}

    <h3 style={{ marginTop: 32, marginBottom: 12 }}>Border Radius</h3>
    {Object.entries(coherenceTokens.borderRadius).map(([name, value]) => (
      <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
        <code style={{ fontSize: 12, color: '#616161', width: 160 }}>{`--border-radius-${name}`}</code>
        <div
          style={{
            width: 48,
            height: 48,
            backgroundColor: '#0f6cbd',
            borderRadius: value,
            opacity: 0.7,
          }}
        />
        <span style={{ fontSize: 12, color: '#616161' }}>{value}</span>
      </div>
    ))}
  </div>
);

const meta: Meta = {
  title: 'Foundations/Spacing',
  component: SpacingPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Azure design token spacing scale and border radius values from the Coherence CDN theme. Use this when you need consistent padding, margins, gaps, or border radius values matching the Azure Portal.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

/** All Azure spacing scale values and border radius tokens with visual previews. */
export const AllSpacing: Story = {};
