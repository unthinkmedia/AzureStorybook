import type { Meta, StoryObj } from '@storybook/react';
import { coherenceTokens } from '../../themes/coherenceTokens';

const ColorSwatch = ({ color, name }: { color: string; name: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: 4,
        backgroundColor: color,
        border: '1px solid #e0e0e0',
        flexShrink: 0,
      }}
    />
    <div>
      <div style={{ fontWeight: 600, fontSize: 14 }}>{name}</div>
      <code style={{ fontSize: 12, color: '#616161' }}>{color}</code>
    </div>
  </div>
);

const ColorRamp = ({ title, colors }: { title: string; colors: Record<string, string> }) => (
  <div style={{ marginBottom: 32 }}>
    <h3 style={{ marginBottom: 12, fontSize: 16, fontWeight: 600 }}>{title}</h3>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
      {Object.entries(colors).map(([step, hex]) => (
        <ColorSwatch key={step} color={hex} name={`${step}`} />
      ))}
    </div>
  </div>
);

const ColorsPage = () => (
  <div style={{ padding: 16 }}>
    <h2 style={{ marginBottom: 24 }}>Azure Design Tokens — Colors</h2>
    <p style={{ marginBottom: 24, color: '#616161', maxWidth: 640 }}>
      Extracted from the Coherence CDN theme.css. These are the exact colors used in the Azure Portal.
    </p>
    <ColorRamp title="Brand" colors={coherenceTokens.brand} />
    <ColorRamp title="Danger" colors={coherenceTokens.danger} />
    <ColorRamp title="Success" colors={coherenceTokens.success} />
    <ColorRamp title="Warning" colors={coherenceTokens.warning} />
    <ColorRamp title="Caution" colors={coherenceTokens.caution} />
    <ColorRamp title="Neutral (subset)" colors={Object.fromEntries(
      Object.entries(coherenceTokens.neutral).filter(([k]) => Number(k) % 10 === 0)
    )} />
  </div>
);

const meta: Meta = {
  title: 'Foundations/Colors',
  component: ColorsPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const AllColors: Story = {};
