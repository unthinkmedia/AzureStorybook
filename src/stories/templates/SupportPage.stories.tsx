import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Button,
  Link,
  Text,
  Input,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  ArrowCounterclockwiseRegular,
  HeartPulseRegular,
  OpenRegular,
  PersonFeedbackRegular,
  SearchRegular,
} from '@fluentui/react-icons';

// ─── Styles ──────────────────────────────────────────────────────

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: tokens.colorNeutralBackground2,
  },

  // ── Top bar ────────────────────────────────────────────
  topBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
  },
  startAgainLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    cursor: 'pointer',
    textDecorationLine: 'none',
    ':hover': {
      color: tokens.colorNeutralForeground2,
    },
  },

  // ── Search banner ──────────────────────────────────────
  banner: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '24px 32px 32px 32px',
    backgroundColor: tokens.colorNeutralBackground3,
    borderTop: `4px solid ${tokens.colorBrandBackground}`,
    flexShrink: 0,
  },
  heading: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    lineHeight: tokens.lineHeightBase500,
  },
  description: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase300,
    marginBottom: '4px',
  },
  searchRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  searchInput: {
    flex: 1,
    maxWidth: '540px',
  },

  // ── Content area ───────────────────────────────────────
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '24px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },

  // ── Section ────────────────────────────────────────────
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sectionTitle: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    lineHeight: tokens.lineHeightBase400,
  },

  // ── Health card ────────────────────────────────────────
  healthCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1,
    maxWidth: '720px',
  },
  healthIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    color: tokens.colorBrandForeground1,
    fontSize: '20px',
  },

  // ── Resource links ─────────────────────────────────────
  resourceList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  resourceLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: tokens.fontSizeBase300,
  },

  // ── Footer ─────────────────────────────────────────────
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '8px 16px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    flexShrink: 0,
  },
  feedbackButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorBrandForeground1,
    cursor: 'pointer',
  },
});

// ─── Support resource link data ──────────────────────────────────

interface SupportResource {
  label: string;
  external?: boolean;
}

const defaultResources: SupportResource[] = [
  { label: 'Ask the Azure community', external: true },
  { label: 'Explore Azure documentation', external: true },
  { label: 'View billing FAQs', external: true },
  { label: 'Visit Quickstart Center' },
];

// ─── SupportPage component ───────────────────────────────────────

interface SupportPageProps {
  /** Heading text in the search banner */
  heading?: string;
  /** Description text below the heading */
  bannerDescription?: string;
  /** Health status message */
  healthMessage?: string;
  /** Health link text */
  healthLinkText?: string;
  /** Support resource links */
  resources?: SupportResource[];
}

const SupportPage: React.FC<SupportPageProps> = ({
  heading = 'How can we help you?',
  bannerDescription = "Tell us about the issue to get solutions and support. Don't include personal or confidential information like passwords.",
  healthMessage = 'No Azure health events detected.',
  healthLinkText = 'View service health',
  resources = defaultResources,
}) => {
  const styles = useStyles();
  const [query, setQuery] = useState('');

  return (
    <div className={styles.page}>
      {/* ── Top bar ──────────────────────────────────────── */}
      <div className={styles.topBar}>
        <Link className={styles.startAgainLink}>
          <ArrowCounterclockwiseRegular />
          Start again
        </Link>
      </div>

      {/* ── Search banner ────────────────────────────────── */}
      <div className={styles.banner}>
        <Text className={styles.heading} as="h2">
          {heading}
        </Text>
        {bannerDescription && (
          <Text className={styles.description}>{bannerDescription}</Text>
        )}
        <div className={styles.searchRow}>
          <Input
            className={styles.searchInput}
            contentBefore={<SearchRegular />}
            placeholder="Briefly describe the issue"
            value={query}
            onChange={(_, data) => setQuery(data.value)}
            aria-label="Briefly describe the issue"
          />
          <Button appearance="primary">Go</Button>
        </div>
      </div>

      {/* ── Content area ─────────────────────────────────── */}
      <div className={styles.content}>
        {/* Health Events */}
        <div className={styles.section}>
          <Text className={styles.sectionTitle}>Health Events</Text>
          <div className={styles.healthCard} role="status">
            <span className={styles.healthIcon}>
              <HeartPulseRegular />
            </span>
            <Text>
              {healthMessage}{' '}
              <Link inline>{healthLinkText}</Link>
            </Text>
          </div>
        </div>

        {/* Support resources */}
        <div className={styles.section}>
          <Text className={styles.sectionTitle}>Support resources</Text>
          <div className={styles.resourceList}>
            {resources.map((resource) => (
              <span key={resource.label} className={styles.resourceLink}>
                <Link inline>
                  {resource.label}
                </Link>
                {resource.external && <OpenRegular fontSize={14} />}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────── */}
      <div className={styles.footer}>
        <Link className={styles.feedbackButton}>
          <PersonFeedbackRegular />
          Give feedback
        </Link>
      </div>
    </div>
  );
};

// ─── Story meta ──────────────────────────────────────────────────

export default {
  title: 'Templates/SupportPage',
  component: SupportPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Full-page Help + Support template with search banner, health status card, and support resource links. Use this when building the Support or Help page for an Azure service experience.',
      },
    },
  },
  argTypes: {
    heading: { control: 'text', description: 'Search banner heading' },
    bannerDescription: { control: 'text', description: 'Search banner description text' },
    healthMessage: { control: 'text', description: 'Health status message' },
    healthLinkText: { control: 'text', description: 'Health status link text' },
  },
} satisfies Meta<typeof SupportPage>;

type Story = StoryObj<typeof SupportPage>;

/** Default Help + Support page. */
export const Default: Story = {
  args: {},

  parameters: {
    docs: {
      description: {
        story:
          'Complete Help + Support page with top bar, search banner, health status card, and support resource links.',
      },
    },
  },
};

/** With active health events. */
export const WithHealthEvents: Story = {
  args: {
    healthMessage: '2 active service health events in your subscriptions.',
    healthLinkText: 'View details',
  },
};
