import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FluentProvider, makeStyles, tokens } from '@fluentui/react-components';
import { InfoCard } from '../../../components/Cards/InfoCard';
import { azureLightTheme } from '../../../themes';

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
    padding: '32px',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '32px',
    backgroundColor: tokens.colorNeutralBackground2,
  },
});

export default {
  title: 'Components/Cards/Card Content Templates/InfoCard',
  component: InfoCard,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text', description: 'Card title text' },
    description: { control: 'text', description: 'Description text' },
    icon: { control: 'text', description: 'Icon name from the icon registry' },
    ctaText: { control: 'text', description: 'Footer CTA link text — when omitted the title becomes the link' },
    href: { control: 'text', description: 'Link URL' },
    external: { control: 'boolean', description: 'Open link in new tab' },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'An informational card that displays a title, description, and optional icon with an action link. Supports two interaction modes:\n\n' +
          '- **With CTA** — title is plain text, a footer action link provides the call-to-action.\n' +
          '- **Without CTA** — the title itself renders as a clickable link.\n\n' +
          'Use this for feature promotions, onboarding tips, contextual suggestions, or any content block that informs and optionally links.',
      },
    },
  },
  decorators: [
    (Story: React.FC) => (
      <FluentProvider theme={azureLightTheme}>
        <Story />
      </FluentProvider>
    ),
  ],
} satisfies Meta<typeof InfoCard>;

type Story = StoryObj<typeof InfoCard>;

/* ------------------------------------------------------------------ */
/*  With CTA (footer action link)                                      */
/* ------------------------------------------------------------------ */

/** Icon + plain title + description + footer CTA link. */
export const WithCTA: Story = {
  args: {
    title: 'Try Microsoft Entra admin center',
    description:
      'Secure your identity environment with Microsoft Entra ID, permissions management and more.',
    icon: 'entraid',
    ctaText: 'Go to Microsoft Entra',
    href: 'https://entra.microsoft.com',
    external: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'When `ctaText` is provided the title renders as plain text and the CTA link is pinned to the card footer.',
      },
    },
  },
};

/** CTA variant without an icon — title is plain text. */
export const WithCTANoIcon: Story = {
  name: 'With CTA (no icon)',
  args: {
    title: 'Try Microsoft Entra admin center',
    description:
      'Secure your identity environment with Microsoft Entra ID, permissions management and more.',
    ctaText: 'Go to Microsoft Entra',
    href: 'https://entra.microsoft.com',
    external: true,
  },
};

/* ------------------------------------------------------------------ */
/*  Without CTA (title is the link)                                    */
/* ------------------------------------------------------------------ */

/** Icon + linked title + description. No footer CTA. */
export const TitleLink: Story = {
  name: 'Title as link',
  args: {
    title: 'Identity Protection',
    description:
      'View risky users, risky workload identities, and risky sign-ins in your tenant.',
    icon: 'shield',
    href: '#',
  },
  parameters: {
    docs: {
      description: {
        story:
          'When `ctaText` is omitted, the title itself becomes a clickable link. The icon is still shown.',
      },
    },
  },
};

/** Linked title without an icon. */
export const TitleLinkNoIcon: Story = {
  name: 'Title as link (no icon)',
  args: {
    title: 'Identity Protection',
    description:
      'View risky users, risky workload identities, and risky sign-ins in your tenant.',
    href: '#',
  },
};

/* ------------------------------------------------------------------ */
/*  Gallery                                                            */
/* ------------------------------------------------------------------ */

/** All four variants arranged in a grid. */
export const AllVariants: Story = {
  render: () => {
    const styles = useStyles();
    return (
      <div className={styles.grid}>
        <InfoCard
          title="Try Microsoft Entra admin center"
          description="Secure your identity environment with Microsoft Entra ID, permissions management and more."
          icon="entraid"
          ctaText="Go to Microsoft Entra"
          href="https://entra.microsoft.com"
          external
        />
        <InfoCard
          title="Try Microsoft Entra admin center"
          description="Secure your identity environment with Microsoft Entra ID, permissions management and more."
          ctaText="Go to Microsoft Entra"
          href="https://entra.microsoft.com"
          external
        />
        <InfoCard
          title="Identity Protection"
          description="View risky users, risky workload identities, and risky sign-ins in your tenant."
          icon="shield"
          href="#"
        />
        <InfoCard
          title="Identity Protection"
          description="View risky users, risky workload identities, and risky sign-ins in your tenant."
          href="#"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'All four card permutations: with CTA + icon, with CTA no icon, title-link + icon, title-link no icon.',
      },
    },
  },
};
