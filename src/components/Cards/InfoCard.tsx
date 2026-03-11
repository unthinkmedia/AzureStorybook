import React, { useState } from 'react';
import {
  makeStyles,
  mergeClasses,
  shorthands,
  tokens,
} from '@fluentui/react-components';
import { Open16Regular } from '@fluentui/react-icons';
import { AzureServiceIcon } from '../AzureServiceIcon';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface InfoCardProps {
  /** Card title text */
  title: string;
  /** Description text displayed below the title */
  description: string;
  /** Icon name matching a file in public/azure-icons/ */
  icon?: string;
  /** Icon size in px (default: 36) */
  iconSize?: number;
  /**
   * Footer call-to-action link text.
   * When provided, the title renders as plain text and the CTA appears at the bottom.
   * When omitted, the title itself renders as a link.
   */
  ctaText?: string;
  /** URL the card links to (either via footer CTA or title link) */
  href?: string;
  /** Opens link in a new tab (default: true) */
  external?: boolean;
  /** Called when the card or CTA is clicked */
  onClick?: () => void;
  /** Additional className */
  className?: string;
  /** aria-label override (defaults to title) */
  'aria-label'?: string;
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: '20px',
    minWidth: '260px',
    maxWidth: '400px',
    fontFamily: tokens.fontFamilyBase,
    transitionProperty: 'box-shadow, border-color',
    transitionDuration: '0.15s',
    transitionTimingFunction: 'ease',
  },

  hovered: {
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.14)',
    ...shorthands.borderColor(tokens.colorNeutralStroke1Hover),
  },

  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: '12px',
  },

  iconWrapper: {
    flexShrink: 0,
    paddingTop: '2px',
  },

  textContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    minWidth: 0,
    flex: 1,
  },

  titlePlain: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    lineHeight: tokens.lineHeightBase300,
    margin: 0,
  },

  titleLink: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandForegroundLink,
    lineHeight: tokens.lineHeightBase300,
    textDecoration: 'none',
    margin: 0,
    cursor: 'pointer',
    ':hover': {
      textDecoration: 'underline',
      color: tokens.colorBrandForegroundLinkHover,
    },
    ':focus-visible': {
      outlineWidth: '2px',
      outlineStyle: 'solid',
      outlineColor: tokens.colorBrandStroke1,
      outlineOffset: '2px',
      borderRadius: tokens.borderRadiusSmall,
    },
  },

  description: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase300,
    margin: 0,
  },

  footer: {
    marginTop: '16px',
    paddingTop: '0',
  },

  ctaLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightRegular,
    color: tokens.colorBrandForegroundLink,
    textDecoration: 'none',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0,
    fontFamily: tokens.fontFamilyBase,
    ':hover': {
      textDecoration: 'underline',
      color: tokens.colorBrandForegroundLinkHover,
    },
    ':focus-visible': {
      outlineWidth: '2px',
      outlineStyle: 'solid',
      outlineColor: tokens.colorBrandStroke1,
      outlineOffset: '2px',
      borderRadius: tokens.borderRadiusSmall,
    },
  },

  externalIcon: {
    fontSize: '14px',
    flexShrink: 0,
  },
});

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * An informational card that displays a title, description, and optional icon
 * with either a linked title or a footer call-to-action. Use this when you need
 * to present a content block that informs and optionally links — e.g. feature
 * promotions, onboarding tips, or contextual suggestions.
 */
export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  description,
  icon,
  iconSize = 36,
  ctaText,
  href,
  external = true,
  onClick,
  className,
  'aria-label': ariaLabel,
}) => {
  const styles = useStyles();
  const [hovered, setHovered] = useState(false);

  const hasCta = Boolean(ctaText);
  const linkTarget = external ? '_blank' : undefined;
  const linkRel = external ? 'noopener noreferrer' : undefined;

  const titleElement = hasCta ? (
    <h3 className={styles.titlePlain}>{title}</h3>
  ) : href ? (
    <a
      href={href}
      className={styles.titleLink}
      target={linkTarget}
      rel={linkRel}
      aria-label={ariaLabel ?? title}
      onClick={onClick}
    >
      {title}
    </a>
  ) : (
    <button
      className={styles.titleLink}
      onClick={onClick}
      aria-label={ariaLabel ?? title}
      type="button"
    >
      {title}
    </button>
  );

  return (
    <div
      className={mergeClasses(
        styles.card,
        hovered && styles.hovered,
        className,
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={styles.header}>
        {icon && (
          <div className={styles.iconWrapper}>
            <AzureServiceIcon name={icon} size={iconSize} />
          </div>
        )}
        <div className={styles.textContent}>
          {titleElement}
          <p className={styles.description}>{description}</p>

          {hasCta && (
            <div className={styles.footer}>
              {href ? (
                <a
                  href={href}
                  className={styles.ctaLink}
                  target={linkTarget}
                  rel={linkRel}
                  aria-label={ariaLabel ?? ctaText}
                  onClick={onClick}
                >
                  {ctaText}
                  {external && <Open16Regular className={styles.externalIcon} />}
                </a>
              ) : (
                <button
                  className={styles.ctaLink}
                  onClick={onClick}
                  aria-label={ariaLabel ?? ctaText}
                  type="button"
                >
                  {ctaText}
                  {external && <Open16Regular className={styles.externalIcon} />}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
