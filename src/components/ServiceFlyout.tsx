import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  makeStyles,
  tokens,
  mergeClasses,
  Text,
  Link,
} from '@fluentui/react-components';
import {
  Star24Regular,
  Star24Filled,
  Eye20Regular,
  Add20Regular,
  ChevronDown16Regular,
} from '@fluentui/react-icons';
import { AzureServiceIcon } from './AzureServiceIcon';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ServiceFlyoutAction {
  label: string;
  icon?: 'create' | 'view';
  /** Whether this is a split-button with a dropdown chevron */
  hasMenu?: boolean;
  onClick?: () => void;
}

export interface ServiceFlyoutProps {
  /** Service name displayed in the flyout header */
  name: string;
  /** Icon name matching a file in public/azure-icons/ */
  icon: string;
  /** Short description shown in the Description section */
  description?: string;
  /** Whether the service is favorited */
  favorited?: boolean;
  /** Called when the star is toggled */
  onFavoriteToggle?: (favorited: boolean) => void;
  /** Quick-action links shown below the name (e.g. "Create", "View") */
  actions?: ServiceFlyoutAction[];
  /** Optional training link label */
  trainingLabel?: string;
  /** Links shown in the "Useful links" section */
  links?: { label: string; href?: string }[];
  /** The trigger element that the flyout attaches to. Hover events are managed automatically. */
  children: React.ReactElement;
  /** Delay in ms before showing the flyout (default: 350) */
  showDelay?: number;
  /** Delay in ms before hiding the flyout (default: 200) */
  hideDelay?: number;
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const FLYOUT_WIDTH = 320;
const FLYOUT_GAP = 8;

const useStyles = makeStyles({
  wrapper: {
    position: 'relative',
    display: 'inline-flex',
  },

  flyoutContainer: {
    position: 'fixed',
    zIndex: 100,
    pointerEvents: 'none',
  },

  flyout: {
    width: `${FLYOUT_WIDTH}px`,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.14)',
    overflow: 'hidden',
    pointerEvents: 'auto',
    maxHeight: '0px',
    opacity: 0,
    transition: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease',
  },

  flyoutVisible: {
    maxHeight: '500px',
    opacity: 1,
  },

  header: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px 16px 12px',
  },

  titleArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },

  title: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    lineHeight: tokens.lineHeightBase400,
  },

  starButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    padding: 0,
    border: 'none',
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: 'transparent',
    color: tokens.colorBrandForegroundLink,
    cursor: 'pointer',
    flexShrink: 0,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground3,
    },
  },

  quickActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0 16px 8px',
  },

  quickAction: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorBrandForegroundLink,
    backgroundColor: 'transparent',
    border: 'none',
    padding: '4px 0',
    cursor: 'pointer',
    fontFamily: tokens.fontFamilyBase,
    ':hover': {
      color: tokens.colorBrandForegroundLinkHover,
      textDecoration: 'underline',
    },
  },

  quickActionIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '16px',
    color: tokens.colorBrandForegroundLink,
  },

  chevron: {
    fontSize: '12px',
    color: tokens.colorBrandForegroundLink,
    marginLeft: '-2px',
  },

  divider: {
    height: '1px',
    backgroundColor: tokens.colorNeutralStroke2,
    margin: '0 16px',
  },

  section: {
    padding: '12px 16px',
  },

  sectionTitle: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    lineHeight: tokens.lineHeightBase300,
    marginBottom: '4px',
    display: 'block',
  },

  descriptionText: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase300,
  },

  copilotRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
  },

  copilotText: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },

  linksSection: {
    padding: '12px 16px 16px',
  },

  linksSectionTitle: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    marginBottom: '4px',
    display: 'block',
  },

  linkItem: {
    display: 'block',
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase300,
    marginTop: '2px',
  },

  trainingSection: {
    padding: '12px 16px',
  },

  trainingTitle: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    marginBottom: '4px',
    display: 'block',
  },

  trainingLink: {
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase300,
  },
});

/* ------------------------------------------------------------------ */
/*  Copilot gradient icon (small inline version)                       */
/* ------------------------------------------------------------------ */

const CopilotSmallIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="copilot-grad-flyout" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6264A7" />
        <stop offset="0.5" stopColor="#A45EDB" />
        <stop offset="1" stopColor="#E0588E" />
      </linearGradient>
    </defs>
    <path
      d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8Zm0 14.4A6.4 6.4 0 1 1 10 3.6a6.4 6.4 0 0 1 0 12.8ZM8.5 8a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm3 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM10 14c1.68 0 3.07-1.12 3.46-2.63a.5.5 0 0 0-.96-.27A2.5 2.5 0 0 1 10 13a2.5 2.5 0 0 1-2.5-1.9.5.5 0 0 0-.96.27A3.49 3.49 0 0 0 10 14Z"
      fill="url(#copilot-grad-flyout)"
    />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const ServiceFlyout: React.FC<ServiceFlyoutProps> = ({
  name,
  icon,
  description,
  favorited = false,
  onFavoriteToggle,
  actions = [],
  trainingLabel,
  links,
  children,
  showDelay = 350,
  hideDelay = 200,
}) => {
  const styles = useStyles();
  const [visible, setVisible] = useState(false);
  const [isFavorited, setIsFavorited] = useState(favorited);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsFavorited(favorited);
  }, [favorited]);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const computePosition = useCallback(() => {
    const trigger = wrapperRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Prefer right side; fall back to left if not enough room
    let left: number;
    if (rect.right + FLYOUT_GAP + FLYOUT_WIDTH <= vw) {
      left = rect.right + FLYOUT_GAP;
    } else if (rect.left - FLYOUT_GAP - FLYOUT_WIDTH >= 0) {
      left = rect.left - FLYOUT_GAP - FLYOUT_WIDTH;
    } else {
      // Neither side fits — pin to whichever edge has more room
      left = vw - rect.right > rect.left
        ? Math.min(rect.right + FLYOUT_GAP, vw - FLYOUT_WIDTH - 8)
        : Math.max(rect.left - FLYOUT_GAP - FLYOUT_WIDTH, 8);
    }

    // Default: align flyout top with trigger top.
    // If that would clip the bottom of the viewport, align flyout bottom
    // with trigger bottom instead (anchor to bottom edge of trigger).
    const flyoutHeight = flyoutRef.current?.scrollHeight ?? 400;
    let top: number;
    if (rect.top + flyoutHeight <= vh - 8) {
      // Fits when top-aligned with trigger
      top = rect.top;
    } else {
      // Bottom-align: flyout bottom meets trigger bottom
      top = rect.bottom - flyoutHeight;
    }
    // Final clamp so it never leaves the viewport
    top = Math.max(8, Math.min(top, vh - flyoutHeight - 8));

    setPosition({ top, left });
  }, []);

  const show = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      computePosition();
      setVisible(true);
    }, showDelay);
  }, [showDelay, computePosition]);

  const hide = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setVisible(false), hideDelay);
  }, [hideDelay]);

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isFavorited;
    setIsFavorited(next);
    onFavoriteToggle?.(next);
  };

  const actionIcon = (type?: 'create' | 'view') => {
    if (type === 'create') return <Add20Regular />;
    if (type === 'view') return <Eye20Regular />;
    return null;
  };

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {children}

      <div
        ref={flyoutRef}
        className={styles.flyoutContainer}
        style={{ top: position.top, left: position.left }}
        onMouseEnter={show}
        onMouseLeave={hide}
      >
        <div
          className={mergeClasses(
            styles.flyout,
            visible && styles.flyoutVisible,
          )}
          role="tooltip"
        >
          {/* Header */}
          <div className={styles.header}>
            <AzureServiceIcon name={icon} size={40} />
            <div className={styles.titleArea}>
              <Text className={styles.title}>{name}</Text>
            </div>
            <button
              className={styles.starButton}
              onClick={handleStarClick}
              aria-label={isFavorited ? `Unfavorite ${name}` : `Favorite ${name}`}
            >
              {isFavorited ? <Star24Filled /> : <Star24Regular />}
            </button>
          </div>

          {/* Quick actions */}
          {actions.length > 0 && (
            <div className={styles.quickActions}>
              {actions.map((action) => (
                <button
                  key={action.label}
                  className={styles.quickAction}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick?.();
                  }}
                >
                  {action.icon && (
                    <span className={styles.quickActionIcon}>
                      {actionIcon(action.icon)}
                    </span>
                  )}
                  {action.label}
                  {action.hasMenu && <ChevronDown16Regular className={styles.chevron} />}
                </button>
              ))}
            </div>
          )}

          <div className={styles.divider} />

          {/* Description */}
          {description && (
            <>
              <div className={styles.section}>
                <Text className={styles.sectionTitle}>Description</Text>
                <Text className={styles.descriptionText}>{description}</Text>
              </div>
              <div className={styles.divider} />
            </>
          )}

          {/* Learn more with Copilot */}
          <div className={styles.copilotRow}>
            <CopilotSmallIcon />
            <Text className={styles.copilotText}>Learn more with Copilot</Text>
          </div>

          <div className={styles.divider} />

          {/* Free training */}
          {trainingLabel && (
            <>
              <div className={styles.trainingSection}>
                <Text className={styles.trainingTitle}>Free training from Microsoft</Text>
                <Link className={styles.trainingLink} href="#">
                  {trainingLabel}
                </Link>
              </div>
              <div className={styles.divider} />
            </>
          )}

          {/* Useful links */}
          {links && links.length > 0 && (
            <div className={styles.linksSection}>
              <Text className={styles.linksSectionTitle}>Useful links</Text>
              {links.map((link) => (
                <Link
                  key={link.label}
                  className={styles.linkItem}
                  href={link.href ?? '#'}
                >
                  {link.label} ↗
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
