import React, { useCallback, useEffect, useRef } from 'react';
import { makeStyles, tokens, mergeClasses, Text, Button } from '@fluentui/react-components';
import { Dismiss24Regular } from '@fluentui/react-icons';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type ContextPaneWidth = 'narrow' | 'medium' | 'wide' | 'extra-wide';

export interface ContextPaneProps {
  /** Whether the pane is open */
  open: boolean;
  /** Called when the pane requests to close (overlay click, close button, Escape key) */
  onClose: () => void;
  /** Pane title displayed in the header */
  title: string;
  /** Subtitle displayed below the title in the header */
  subtitle?: string;
  /** Width preset: narrow (315px), medium (585px), wide (855px), extra-wide (1125px) */
  width?: ContextPaneWidth;
  /** Content rendered inside the pane body */
  children: React.ReactNode;
  /** Footer content (e.g. action buttons) rendered at the bottom of the pane */
  footer?: React.ReactNode;
  /** Whether clicking the overlay backdrop closes the pane (default: true) */
  dismissOnOverlayClick?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const WIDTH_MAP: Record<ContextPaneWidth, string> = {
  narrow: '315px',
  medium: '585px',
  wide: '855px',
  'extra-wide': '1125px',
};

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const useStyles = makeStyles({
  overlay: {
    position: 'fixed',
    inset: '0',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'flex-end',
    opacity: 0,
    pointerEvents: 'none',
    transitionProperty: 'opacity',
    transitionDuration: '200ms',
    transitionTimingFunction: 'ease',
  },

  overlayOpen: {
    opacity: 1,
    pointerEvents: 'auto',
  },

  backdrop: {
    position: 'absolute',
    inset: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },

  pane: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    maxWidth: '100vw',
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow16,
    transform: 'translateX(100%)',
    transitionProperty: 'transform',
    transitionDuration: '300ms',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  paneOpen: {
    transform: 'translateX(0)',
  },

  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalL} ${tokens.spacingVerticalM} ${tokens.spacingHorizontalXXL}`,
    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
  },

  headerText: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS,
    minWidth: 0,
    flex: 1,
  },

  title: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase500,
    color: tokens.colorNeutralForeground1,
    margin: 0,
  },

  subtitle: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },

  body: {
    flex: 1,
    overflowY: 'auto',
    padding: `${tokens.spacingVerticalXL} ${tokens.spacingHorizontalXXL}`,
  },

  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalXXL}`,
    borderTop: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
  },
});

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const ContextPane: React.FC<ContextPaneProps> = ({
  open,
  onClose,
  title,
  subtitle,
  width = 'medium',
  children,
  footer,
  dismissOnOverlayClick = true,
}) => {
  const styles = useStyles();
  const paneRef = useRef<HTMLDivElement>(null);

  // Trap focus: focus the pane when it opens
  useEffect(() => {
    if (open && paneRef.current) {
      paneRef.current.focus();
    }
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Prevent body scroll when pane is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  const handleBackdropClick = useCallback(() => {
    if (dismissOnOverlayClick) {
      onClose();
    }
  }, [dismissOnOverlayClick, onClose]);

  return (
    <div
      className={mergeClasses(styles.overlay, open && styles.overlayOpen)}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className={styles.backdrop} onClick={handleBackdropClick} />
      <div
        ref={paneRef}
        className={mergeClasses(styles.pane, open && styles.paneOpen)}
        style={{ width: WIDTH_MAP[width] }}
        tabIndex={-1}
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h2 className={styles.title}>{title}</h2>
            {subtitle && <Text className={styles.subtitle}>{subtitle}</Text>}
          </div>
          <Button
            appearance="subtle"
            icon={<Dismiss24Regular />}
            onClick={onClose}
            aria-label="Close"
            size="small"
          />
        </div>

        {/* Body */}
        <div className={styles.body}>{children}</div>

        {/* Footer */}
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
};
