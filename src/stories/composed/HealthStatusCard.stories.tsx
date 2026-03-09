import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Link,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { HeartPulseRegular } from '@fluentui/react-icons';

// ─── Styles ──────────────────────────────────────────────────────

const useStyles = makeStyles({
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    color: tokens.colorBrandForeground1,
    fontSize: '20px',
  },
  message: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground1,
  },
});

// ─── HealthStatusCard component ──────────────────────────────────

export interface HealthStatusCardProps {
  /** Icon element to display */
  icon?: React.ReactNode;
  /** Status message text */
  message: string;
  /** Optional link text appended after the message */
  linkText?: string;
  /** Callback when the link is clicked */
  onLinkClick?: () => void;
}

const HealthStatusCard: React.FC<HealthStatusCardProps> = ({
  icon = <HeartPulseRegular />,
  message,
  linkText,
  onLinkClick,
}) => {
  const styles = useStyles();

  return (
    <div className={styles.card} role="status">
      <span className={styles.icon}>{icon}</span>
      <Text className={styles.message}>
        {message}
        {linkText && (
          <>
            {' '}
            <Link inline onClick={onLinkClick}>
              {linkText}
            </Link>
          </>
        )}
      </Text>
    </div>
  );
};

// ─── Story meta ──────────────────────────────────────────────────

export default {
  title: 'Composed/HealthStatusCard',
  component: HealthStatusCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A compact status card showing Azure service health events with an icon, message, and optional link. Use this when you need to display health or service status summaries at the top of a Support page or dashboard.',
      },
    },
  },
  argTypes: {
    message: { control: 'text', description: 'Status message text' },
    linkText: { control: 'text', description: 'Optional link text appended after the message' },
  },
} satisfies Meta<typeof HealthStatusCard>;

type Story = StoryObj<typeof HealthStatusCard>;

/** No health events detected (default state). */
export const Default: Story = {
  args: {
    message: 'No Azure health events detected.',
    linkText: 'View service health',
  },

  parameters: {
    docs: {
      description: {
        story:
          'Default health status card showing no active Azure health events with a link to view service health.',
      },
    },
  },
};

/** Health event with active warnings — shows event count and details link. */
export const WithWarning: Story = {
  args: {
    message: '2 active service health events in your subscriptions.',
    linkText: 'View details',
  },
};
