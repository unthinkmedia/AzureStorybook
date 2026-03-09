import type { Meta, StoryObj } from '@storybook/react';
import { coherenceTokens } from '../../themes/coherenceTokens';

const ShadowCard = ({ label, shadow }: { label: string; shadow: string }) => (
  <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', margin: 16 }}>
    <div
      style={{
        width: 120,
        height: 80,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        boxShadow: shadow,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span style={{ fontSize: 12, color: '#616161' }}>{label}</span>
    </div>
  </div>
);

const ShadowsPage = () => (
  <div style={{ padding: 16, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
    <h2 style={{ marginBottom: 24 }}>Azure Design Tokens — Shadows</h2>
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {Object.entries(coherenceTokens.shadows).map(([name, value]) => (
        <ShadowCard key={name} label={name} shadow={value} />
      ))}
    </div>
  </div>
);

const meta: Meta = {
  title: 'Foundations/Shadows',
  component: ShadowsPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Azure design token shadow values extracted from the Coherence CDN theme. Use this when you need to reference the exact box-shadow values for elevation levels in the Azure Portal.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

/** All Azure elevation shadow tokens with visual previews. */
export const AllShadows: Story = {};
