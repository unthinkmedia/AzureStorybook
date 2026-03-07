import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Button,
  Link,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { OpenRegular } from '@fluentui/react-icons';

// ─── Illustration SVGs ───────────────────────────────────────────

/** Isometric illustration: subscription move (key + cube) */
const SubscriptionIllustration: React.FC = () => (
  <svg
    width="200"
    height="140"
    viewBox="0 0 200 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Key shape */}
    <ellipse cx="62" cy="72" rx="18" ry="18" fill="#50E6FF" opacity="0.5" />
    <ellipse cx="62" cy="72" rx="11" ry="11" fill="#50E6FF" />
    <rect x="74" y="68" width="26" height="8" rx="2" fill="#50E6FF" />
    <rect x="92" y="68" width="4" height="14" rx="1" fill="#50E6FF" />
    <rect x="86" y="68" width="4" height="10" rx="1" fill="#50E6FF" />
    {/* Cube 1 */}
    <polygon points="120,42 150,26 180,42 150,58" fill="#0078D4" />
    <polygon points="120,42 120,72 150,88 150,58" fill="#005A9E" />
    <polygon points="180,42 180,72 150,88 150,58" fill="#003D6B" />
    {/* Small cube */}
    <polygon points="100,72 118,62 136,72 118,82" fill="#83BEEC" />
    <polygon points="100,72 100,92 118,102 118,82" fill="#5EA1D8" />
    <polygon points="136,72 136,92 118,102 118,82" fill="#3A7BBF" />
    {/* Arrow */}
    <path d="M92 94 L72 110" stroke="#0078D4" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M72 110 L80 106 L76 114 Z" fill="#0078D4" />
  </svg>
);

/** Isometric illustration: resource group move (cubes) */
const ResourceGroupIllustration: React.FC = () => (
  <svg
    width="200"
    height="140"
    viewBox="0 0 200 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Large cube */}
    <polygon points="100,22 140,4 180,22 140,40" fill="#0078D4" />
    <polygon points="100,22 100,62 140,80 140,40" fill="#005A9E" />
    <polygon points="180,22 180,62 140,80 140,40" fill="#003D6B" />
    {/* Small cube front */}
    <polygon points="60,60 88,46 116,60 88,74" fill="#83BEEC" />
    <polygon points="60,60 60,88 88,102 88,74" fill="#5EA1D8" />
    <polygon points="116,60 116,88 88,102 88,74" fill="#3A7BBF" />
    {/* Document / clipboard */}
    <rect x="120" y="68" width="30" height="38" rx="3" fill="#50E6FF" />
    <rect x="126" y="76" width="18" height="3" rx="1" fill="white" />
    <rect x="126" y="82" width="14" height="3" rx="1" fill="white" />
    <rect x="126" y="88" width="18" height="3" rx="1" fill="white" />
    <rect x="126" y="94" width="10" height="3" rx="1" fill="white" />
    {/* Arrow */}
    <path d="M116 102 L130 116" stroke="#0078D4" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M130 116 L126 108 L134 112 Z" fill="#0078D4" />
  </svg>
);

/** Isometric illustration: region move (cube + map pin) */
const RegionIllustration: React.FC = () => (
  <svg
    width="200"
    height="140"
    viewBox="0 0 200 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Cube */}
    <polygon points="60,44 92,28 124,44 92,60" fill="#0078D4" />
    <polygon points="60,44 60,76 92,92 92,60" fill="#005A9E" />
    <polygon points="124,44 124,76 92,92 92,60" fill="#003D6B" />
    {/* Dashed rectangle (region boundary) */}
    <rect
      x="100"
      y="24"
      width="72"
      height="72"
      rx="4"
      fill="none"
      stroke="#50E6FF"
      strokeWidth="2"
      strokeDasharray="6 4"
    />
    {/* Map pin */}
    <circle cx="148" cy="50" r="10" fill="#50E6FF" />
    <circle cx="148" cy="50" r="5" fill="white" />
    <path d="M148 60 L148 72" stroke="#50E6FF" strokeWidth="2.5" strokeLinecap="round" />
    <ellipse cx="148" cy="74" rx="6" ry="2" fill="#50E6FF" opacity="0.4" />
    {/* Dashed arrow */}
    <path
      d="M78 90 C90 110, 120 115, 140 80"
      stroke="#0078D4"
      strokeWidth="2"
      strokeDasharray="5 3"
      fill="none"
      strokeLinecap="round"
    />
    <path d="M140 80 L136 88 L142 86 Z" fill="#0078D4" />
  </svg>
);

// ─── Styles ──────────────────────────────────────────────────────

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground1,
    padding: '48px 32px',
  },
  heading: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    lineHeight: tokens.lineHeightBase600,
    textAlign: 'center',
  },
  headerLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: tokens.fontSizeBase300,
    marginTop: '4px',
  },
  subtitle: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase300,
    textAlign: 'center',
    marginTop: '4px',
  },
  headerSpacer: {
    marginBottom: '32px',
  },
  cardRow: {
    display: 'flex',
    gap: '24px',
    justifyContent: 'center',
    maxWidth: '1200px',
    width: '100%',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 300px',
    maxWidth: '460px',
    minWidth: '260px',
  },
  illustrationArea: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '180px',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusMedium,
    marginBottom: '16px',
  },
  cardTitle: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    lineHeight: tokens.lineHeightBase400,
    marginBottom: '4px',
  },
  cardDescription: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase300,
    marginBottom: '12px',
    flex: 1,
  },
  learnMoreLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: tokens.fontSizeBase300,
    marginBottom: '16px',
  },
  cardActions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '8px',
  },
});

// ─── Card data ───────────────────────────────────────────────────

interface CardAction {
  /** Button label */
  label: string;
  /** Button appearance — defaults to 'primary' */
  appearance?: 'primary' | 'outline';
}

interface FeatureCard {
  /** Illustration element */
  illustration: React.ReactNode;
  /** Card heading */
  title: string;
  /** Description — plain string or ReactNode (for inline links) */
  description: React.ReactNode;
  /** Optional standalone learn-more link text below description */
  linkText?: string;
  /** Action buttons rendered below description/link */
  actions: CardAction[];
}

const defaultCards: FeatureCard[] = [
  {
    illustration: <SubscriptionIllustration />,
    title: 'Move resources to another subscription',
    description:
      "We'll identify any pending dependencies that need to be resolved. Resources moved to a different subscription might have billing, scripting, and access control implications.",
    linkText: 'Learn more',
    actions: [{ label: 'Move across subscriptions' }],
  },
  {
    illustration: <ResourceGroupIllustration />,
    title: 'Move resources to another resource group',
    description:
      "We'll identify any pending dependencies that need to be resolved. Resources moved to a different resource group within the same subscription might have access control implications.",
    linkText: 'Learn more',
    actions: [{ label: 'Move across resource groups' }],
  },
  {
    illustration: <RegionIllustration />,
    title: 'Move resources to another region',
    description:
      "We'll identify any pending dependencies that need to be resolved. You can commit or discard and reinitiate the move.",
    linkText: 'Steps to move resources across regions',
    actions: [{ label: 'Move across regions' }],
  },
];

// ─── FeatureCardsPage component ──────────────────────────────────

interface FeatureCardsPageProps {
  /** Page heading */
  heading?: string;
  /** Subtitle text below the heading */
  subtitle?: string;
  /** Optional top-level link displayed under the heading / subtitle */
  headerLinkText?: string;
  /** Feature option cards */
  cards?: FeatureCard[];
}

const FeatureCardsPage: React.FC<FeatureCardsPageProps> = ({
  heading = 'Move your Azure resources, seamlessly.',
  subtitle = 'Move your resources across subscriptions, resource groups, or regions.',
  headerLinkText,
  cards = defaultCards,
}) => {
  const styles = useStyles();

  return (
    <div className={styles.page}>
      <Text className={styles.heading} as="h1">
        {heading}
      </Text>
      {subtitle && (
        <Text className={styles.subtitle}>{subtitle}</Text>
      )}
      {headerLinkText && (
        <Link
          className={styles.headerLink}
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          {headerLinkText}
          <OpenRegular fontSize={14} />
        </Link>
      )}
      <div className={styles.headerSpacer} />

      <div className={styles.cardRow}>
        {cards.map((card) => (
          <div key={card.title} className={styles.card}>
            <div className={styles.illustrationArea}>{card.illustration}</div>
            <Text className={styles.cardTitle} as="h2">
              {card.title}
            </Text>
            <Text className={styles.cardDescription}>{card.description}</Text>
            {card.linkText && (
              <Link
                className={styles.learnMoreLink}
                href="#"
                target="_blank"
                rel="noopener noreferrer"
              >
                {card.linkText}
                <OpenRegular fontSize={14} />
              </Link>
            )}
            <div className={styles.cardActions}>
              {card.actions.map((action) => (
                <Button
                  key={action.label}
                  appearance={action.appearance ?? 'primary'}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Story meta ──────────────────────────────────────────────────

export default {
  title: 'Templates/FeatureCardsPage',
  component: FeatureCardsPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A centered landing page template that presents a set of illustrated feature cards, each with a title, description, external link, and primary call-to-action button. Use this for hub pages that guide users to choose between several top-level actions or workflows — for example, moving resources, selecting a deployment option, or picking a getting-started path.',
      },
    },
  },
} satisfies Meta<typeof FeatureCardsPage>;

type Story = StoryObj<typeof FeatureCardsPage>;

/** Default feature cards landing page (Move Resources example). */
export const Default: Story = {
  args: {},
};

/** Custom heading and subtitle. */
export const CustomHeading: Story = {
  args: {
    heading: 'Relocate your resources',
    subtitle: 'Choose where you want to move your Azure resources.',
  },
};
