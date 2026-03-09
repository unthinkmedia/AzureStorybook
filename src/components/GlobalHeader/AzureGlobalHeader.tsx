import React from 'react';
import {
  makeStyles,
  tokens,
  mergeClasses,
  Input,
  Avatar,
  Tooltip,
  Badge,
} from '@fluentui/react-components';
import {
  Search20Regular,
  Alert20Regular,
  Settings20Regular,
  QuestionCircle20Regular,
  PersonFeedback20Regular,
} from '@fluentui/react-icons';
import { CopilotIcon } from '../CopilotSuggestionsBar';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

export interface AzureGlobalHeaderProps {
  /** Display text next to the Azure logo (default: "Microsoft Azure") */
  portalName?: string;
  /** User display name shown in the profile area */
  userName?: string;
  /** User email */
  userEmail?: string;
  /** Organization / tenant label */
  organization?: string;
  /** Unread notification count */
  notificationCount?: number;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Callback when the hamburger menu is clicked */
  onMenuClick?: () => void;
  /** Callback when the waffle (app launcher) is clicked */
  onWaffleClick?: () => void;
  /** Callback when Copilot button is clicked */
  onCopilotClick?: () => void;
  /** Callback when search is submitted */
  onSearch?: (query: string) => void;
  /** Additional className for the root element */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const HEADER_HEIGHT = 40;

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    height: `${HEADER_HEIGHT}px`,
    backgroundColor: '#0f6cbd',
    color: '#ffffff',
    paddingLeft: '8px',
    paddingRight: '12px',
    flexShrink: 0,
    gap: '2px',
    zIndex: 1000,
    // The Azure Portal header uses a blue-brand bar
  },

  /* — Left section: waffle + hamburger + branding — */
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    flexShrink: 0,
  },

  iconButton: {
    color: '#ffffff',
    backgroundColor: 'transparent',
    minWidth: '32px',
    width: '32px',
    height: '32px',
    borderRadius: '4px',
    border: 'none',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      color: '#ffffff',
    },
    ':active': {
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      color: '#ffffff',
    },
  },

  branding: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginLeft: '4px',
    marginRight: '8px',
    flexShrink: 0,
    userSelect: 'none',
  },

  portalName: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#ffffff',
    whiteSpace: 'nowrap',
  },



  /* — Center: search bar — */
  centerSection: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    minWidth: 0,
    paddingLeft: '8px',
    paddingRight: '8px',
  },

  searchWrapper: {
    width: '100%',
    maxWidth: '580px',
  },

  searchInput: {
    width: '100%',
    '& input': {
      fontSize: '13px',
    },
    '& input::placeholder': {
      color: tokens.colorNeutralForeground4,
    },
  },

  /* — Right section: Copilot + actions + profile — */
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    flexShrink: 0,
  },

  copilotButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#ffffff',
    color: '#242424',
    border: 'none',
    borderRadius: '16px',
    padding: '4px 14px 4px 10px',
    height: '28px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    marginRight: '4px',
    ':hover': {
      backgroundColor: '#f0f0f0',
    },
  },

  notificationBadge: {
    position: 'relative' as const,
  },

  badge: {
    position: 'absolute' as const,
    top: '2px',
    right: '2px',
  },

  divider: {
    width: '1px',
    height: '24px',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginLeft: '6px',
    marginRight: '6px',
    flexShrink: 0,
  },

  profileSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginLeft: '4px',
    cursor: 'pointer',
    borderRadius: '4px',
    padding: '2px 8px',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
  },

  profileText: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    lineHeight: 1.2,
  },

  profileEmail: {
    fontSize: '12px',
    color: '#ffffff',
    whiteSpace: 'nowrap',
    maxWidth: '180px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  profileOrg: {
    fontSize: '10px',
    color: 'rgba(255, 255, 255, 0.85)',
    whiteSpace: 'nowrap',
    maxWidth: '180px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textTransform: 'uppercase',
  },
});

/* ------------------------------------------------------------------ */
/*  Lightweight SVG icons matching Azure Portal header                 */
/* ------------------------------------------------------------------ */

/** Thin waffle grid — small circles, matching Azure Portal */
const WaffleIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <circle cx="4" cy="4" r="1.5" />
    <circle cx="10" cy="4" r="1.5" />
    <circle cx="16" cy="4" r="1.5" />
    <circle cx="4" cy="10" r="1.5" />
    <circle cx="10" cy="10" r="1.5" />
    <circle cx="16" cy="10" r="1.5" />
    <circle cx="4" cy="16" r="1.5" />
    <circle cx="10" cy="16" r="1.5" />
    <circle cx="16" cy="16" r="1.5" />
  </svg>
);

/** Thin hamburger menu — 3 lines, matching Azure Portal */
const HamburgerIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <rect x="2" y="4" width="16" height="1.5" rx="0.75" />
    <rect x="2" y="9.25" width="16" height="1.5" rx="0.75" />
    <rect x="2" y="14.5" width="16" height="1.5" rx="0.75" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const AzureGlobalHeader: React.FC<AzureGlobalHeaderProps> = ({
  portalName = 'Microsoft Azure',
  userName,
  userEmail = 'user@example.com',
  organization = 'CONTOSO',
  notificationCount = 0,
  searchPlaceholder = 'Search resources, services, and docs (G+/)',
  onMenuClick,
  onWaffleClick,
  onCopilotClick,
  onSearch,
  className,
}) => {
  const styles = useStyles();
  const [searchValue, setSearchValue] = React.useState('');

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(searchValue);
    }
  };

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
      {/* — Left: waffle + hamburger + brand — */}
      <div className={styles.leftSection}>
        <Tooltip content="Microsoft apps" relationship="label">
          <button
            className={styles.iconButton}
            onClick={onWaffleClick}
            aria-label="Microsoft apps"
            style={{ border: 'none' }}
          >
            <WaffleIcon />
          </button>
        </Tooltip>

        <Tooltip content="Portal menu" relationship="label">
          <button
            className={styles.iconButton}
            onClick={onMenuClick}
            aria-label="Portal menu"
            style={{ border: 'none' }}
          >
            <HamburgerIcon />
          </button>
        </Tooltip>

        <div className={styles.branding}>
          <span className={styles.portalName}>{portalName}</span>
        </div>
      </div>

      {/* — Center: search — */}
      <div className={styles.centerSection}>
        <div className={styles.searchWrapper}>
          <Input
            className={styles.searchInput}
            contentBefore={<Search20Regular />}
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(_, data) => setSearchValue(data.value)}
            onKeyDown={handleSearchKeyDown}
            appearance="filled-lighter"
            size="small"
            aria-label="Search resources, services, and docs"
          />
        </div>
      </div>

      {/* — Right: Copilot + action icons + profile — */}
      <div className={styles.rightSection}>
        <button className={styles.copilotButton} onClick={onCopilotClick} aria-label="Copilot">
          <CopilotIcon size={18} />
          <span>Copilot</span>
        </button>

        <Tooltip content="Cloud Shell" relationship="label">
          <button className={styles.iconButton} aria-label="Cloud Shell" style={{ border: 'none' }}>
            {/* Terminal-like icon */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 4.5A2.5 2.5 0 0 1 4.5 2h11A2.5 2.5 0 0 1 18 4.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 2 15.5v-11ZM4.5 3A1.5 1.5 0 0 0 3 4.5v11A1.5 1.5 0 0 0 4.5 17h11a1.5 1.5 0 0 0 1.5-1.5v-11A1.5 1.5 0 0 0 15.5 3h-11Zm1.85 3.15a.5.5 0 0 1 .7 0l3 3a.5.5 0 0 1 0 .7l-3 3a.5.5 0 0 1-.7-.7L9 9.5 6.35 6.85a.5.5 0 0 1 0-.7ZM10 13a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5Z" />
            </svg>
          </button>
        </Tooltip>

        <Tooltip content="Notifications" relationship="label">
          <div className={styles.notificationBadge}>
            <button className={styles.iconButton} aria-label="Notifications" style={{ border: 'none' }}>
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

        <Tooltip content="Settings" relationship="label">
          <button className={styles.iconButton} aria-label="Settings" style={{ border: 'none' }}>
            <Settings20Regular />
          </button>
        </Tooltip>

        <Tooltip content="Help" relationship="label">
          <button className={styles.iconButton} aria-label="Help" style={{ border: 'none' }}>
            <QuestionCircle20Regular />
          </button>
        </Tooltip>

        <Tooltip content="Feedback" relationship="label">
          <button className={styles.iconButton} aria-label="Feedback" style={{ border: 'none' }}>
            <PersonFeedback20Regular />
          </button>
        </Tooltip>

        <div className={styles.divider} />

        {/* Profile */}
        <div className={styles.profileSection} role="button" tabIndex={0} aria-label="Account manager">
          <div className={styles.profileText}>
            <span className={styles.profileEmail}>{userEmail}</span>
            <span className={styles.profileOrg}>{organization}</span>
          </div>
          <Avatar
            name={userName ?? userEmail}
            initials={initials}
            size={28}
            color="brand"
          />
        </div>
      </div>
    </header>
  );
};
