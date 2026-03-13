import React from 'react';
import { Link, Text, makeStyles, tokens } from '@fluentui/react-components';
import { HeartPulseRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    padding: tokens.spacingHorizontalL,
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
    fontSize: tokens.fontSizeBase500,
  },
  message: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground1,
  },
});

export interface StatusCardProps {
  /** Icon element to display */
  icon?: React.ReactNode;
  /** Status message text */
  message: string;
  /** Optional link text appended after the message */
  linkText?: string;
  /** Callback when the link is clicked */
  onLinkClick?: () => void;
}

/**
 * A compact status card showing an icon, message, and optional link.
 * Use this when you need to display a brief status summary — e.g. health
 * checks, system alerts, or inline notifications within a page.
 */
export const StatusCard: React.FC<StatusCardProps> = ({
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
