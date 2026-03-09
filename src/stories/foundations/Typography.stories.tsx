import type { Meta, StoryObj } from '@storybook/react';
import { coherenceTokens } from '../../themes/coherenceTokens';

const TypographySample = ({
  label,
  size,
  weight,
  lineHeight,
}: {
  label: string;
  size: string;
  weight: string;
  lineHeight: string;
}) => (
  <div style={{ marginBottom: 16, display: 'flex', alignItems: 'baseline', gap: 24 }}>
    <code style={{ fontSize: 12, color: '#616161', width: 160, flexShrink: 0 }}>{label}</code>
    <span
      style={{
        fontSize: size,
        fontWeight: Number(weight),
        lineHeight,
        fontFamily: coherenceTokens.typography.fontFamilyBase,
      }}
    >
      The quick brown fox jumps over the lazy dog
    </span>
  </div>
);

const TypographyPage = () => {
  const sizes = [
    { label: 'base100 (10px)', size: '10px' },
    { label: 'base200 (12px)', size: '12px' },
    { label: 'base300 (14px)', size: '14px' },
    { label: 'base400 (16px)', size: '16px' },
    { label: 'base500 (20px)', size: '20px' },
    { label: 'base600 (24px)', size: '24px' },
    { label: 'hero700 (28px)', size: '28px' },
    { label: 'hero800 (32px)', size: '32px' },
    { label: 'hero900 (40px)', size: '40px' },
    { label: 'hero1000 (68px)', size: '68px' },
  ];

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ marginBottom: 24 }}>Azure Design Tokens — Typography</h2>

      <h3 style={{ marginBottom: 12 }}>Font Sizes × Regular (400)</h3>
      {sizes.map((s) => (
        <TypographySample key={s.label} label={s.label} size={s.size} weight="400" lineHeight="1.5" />
      ))}

      <h3 style={{ marginTop: 32, marginBottom: 12 }}>Font Weights</h3>
      {['400 Regular', '500 Medium', '600 Semibold', '700 Bold'].map((w) => {
        const weight = w.split(' ')[0];
        return (
          <TypographySample key={w} label={w} size="16px" weight={weight} lineHeight="1.5" />
        );
      })}

      <h3 style={{ marginTop: 32, marginBottom: 12 }}>Font Families</h3>
      <div style={{ marginBottom: 8 }}>
        <code style={{ fontSize: 12, color: '#616161' }}>Base</code>
        <p style={{ fontFamily: coherenceTokens.typography.fontFamilyBase, fontSize: 16 }}>
          Segoe UI — ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
        </p>
      </div>
      <div style={{ marginBottom: 8 }}>
        <code style={{ fontSize: 12, color: '#616161' }}>Numeric</code>
        <p style={{ fontFamily: coherenceTokens.typography.fontFamilyNumeric, fontSize: 16 }}>
          Bahnschrift — 0123456789 $1,234.56 99.9%
        </p>
      </div>
      <div>
        <code style={{ fontSize: 12, color: '#616161' }}>Monospace</code>
        <p style={{ fontFamily: coherenceTokens.typography.fontFamilyMonospace, fontSize: 16 }}>
          Consolas — const x = 42; console.log(x);
        </p>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: 'Foundations/Typography',
  component: TypographyPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Azure design token typography reference — font sizes, weights, line heights, and font families (Segoe UI, Bahnschrift, Consolas). Use this when you need to verify the correct font specifications for Azure Portal text rendering.',
      },
    } },
};

export default meta;
type Story = StoryObj;

/** All font sizes, weights, and font families used in the Azure Portal. */
export const AllTypography: Story = {};
