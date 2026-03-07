import React from 'react';
import {
  makeStyles,
  tokens,
  mergeClasses,
  Avatar,
  Tooltip,
  Badge,
  Text,
} from '@fluentui/react-components';
import {
  Alert20Regular,
  Settings20Regular,
  Chat20Regular,
} from '@fluentui/react-icons';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

export interface SREGlobalHeaderProps {
  /** Display text next to the SRE logo (default: "Azure SRE Agent") */
  portalName?: string;
  /** Show a badge next to the portal name */
  badge?: string;
  /** User display name shown in the profile avatar */
  userName?: string;
  /** User email */
  userEmail?: string;
  /** Unread notification count */
  notificationCount?: number;
  /** Callback when Docs is clicked */
  onDocsClick?: () => void;
  /** Callback when notifications bell is clicked */
  onNotificationsClick?: () => void;
  /** Callback when chat is clicked */
  onChatClick?: () => void;
  /** Callback when settings is clicked */
  onSettingsClick?: () => void;
  /** Additional className for the root element */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const HEADER_HEIGHT = 48;

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    height: `${HEADER_HEIGHT}px`,
    backgroundColor: '#ffffff',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    paddingLeft: '16px',
    paddingRight: '16px',
    flexShrink: 0,
    zIndex: 1000,
  },

  /* — Left section: logo + branding — */
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexShrink: 0,
  },

  logoIcon: {
    width: '24px',
    height: '24px',
    flexShrink: 0,
  },

  brandingText: {
    fontSize: '16px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    whiteSpace: 'nowrap',
  },

  previewBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: 600,
    color: '#0078d4',
    backgroundColor: '#e6f2fb',
    border: '1px solid #b3d7f2',
    borderRadius: '4px',
    padding: '1px 8px',
    lineHeight: '16px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    letterSpacing: '0.5px',
  },

  /* — Spacer to push right section — */
  spacer: {
    flex: 1,
  },

  /* — Right section: Docs + action icons + profile — */
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    flexShrink: 0,
  },

  docsLink: {
    fontSize: '14px',
    fontWeight: 400,
    color: tokens.colorNeutralForeground1,
    cursor: 'pointer',
    padding: '6px 12px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: 'transparent',
    whiteSpace: 'nowrap',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },

  iconButton: {
    color: tokens.colorNeutralForeground2,
    backgroundColor: 'transparent',
    minWidth: '36px',
    width: '36px',
    height: '36px',
    borderRadius: '4px',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      color: tokens.colorNeutralForeground1,
    },
    ':active': {
      backgroundColor: tokens.colorNeutralBackground1Pressed,
    },
  },

  notificationWrapper: {
    position: 'relative' as const,
  },

  badge: {
    position: 'absolute' as const,
    top: '4px',
    right: '4px',
  },

  profileButton: {
    marginLeft: '4px',
    cursor: 'pointer',
  },
});

/* ------------------------------------------------------------------ */
/*  SRE Agent Logo — gradient S icon                                   */
/* ------------------------------------------------------------------ */

const SRELogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sre-logo-grad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="50%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
    </defs>
    <rect width="24" height="24" rx="6" fill="url(#sre-logo-grad)" />
    <path
      d="M15.5 8.5C15.5 8.5 14.5 7 12 7C9.5 7 8 8.5 8 10C8 13 15.5 11.5 15.5 14.5C15.5 16 14 17 12 17C9.5 17 8.5 15.5 8.5 15.5"
      stroke="white"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const SREGlobalHeader: React.FC<SREGlobalHeaderProps> = ({
  portalName = 'Azure SRE Agent',
  badge = 'PREVIEW',
  userName,
  userEmail = 'user@example.com',
  notificationCount = 0,
  onDocsClick,
  onNotificationsClick,
  onChatClick,
  onSettingsClick,
  className,
}) => {
  const styles = useStyles();

  const initials = userName
    ? userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : userEmail?.[0]?.toUpperCase() ?? '?';

  return (
    <header className={mergeClasses(styles.root, className)} role="banner">
      {/* — Left: logo + branding + badge — */}
      <div className={styles.leftSection}>
        <SRELogo className={styles.logoIcon} />
        <Text className={styles.brandingText}>{portalName}</Text>
        {badge && <span className={styles.previewBadge}>{badge}</span>}
      </div>

      <div className={styles.spacer} />

      {/* — Right: Docs + action icons + profile — */}
      <div className={styles.rightSection}>
        <button
          className={styles.docsLink}
          onClick={onDocsClick}
          aria-label="Documentation"
        >
          Docs
        </button>

        <Tooltip content="Notifications" relationship="label">
          <div className={styles.notificationWrapper}>
            <button
              className={styles.iconButton}
              onClick={onNotificationsClick}
              aria-label="Notifications"
            >
              <Alert20Regular />
            </button>
            {notificationCount > 0 && (
              <Badge
                className={styles.badge}
                size="tiny"
                color="danger"
                appearance="filled"
              />
            )}
          </div>
        </Tooltip>

        <Tooltip content="Chat" relationship="label">
          <button
            className={styles.iconButton}
            onClick={onChatClick}
            aria-label="Chat"
          >
            <Chat20Regular />
          </button>
        </Tooltip>

        <Tooltip content="Settings" relationship="label">
          <button
            className={styles.iconButton}
            onClick={onSettingsClick}
            aria-label="Settings"
          >
            <Settings20Regular />
          </button>
        </Tooltip>

        <Tooltip content={userName ?? userEmail} relationship="label">
          <div className={styles.profileButton}>
            <Avatar
              name={userName ?? userEmail}
              initials={initials}
              size={32}
              color="colorful"
              image={userName ? undefined : { src: '' }}
            />
          </div>
        </Tooltip>
      </div>
    </header>
  );
};
