import React, { useState } from 'react';
import {
  makeStyles,
  mergeClasses,
  shorthands,
  tokens,
  Tooltip,
} from '@fluentui/react-components';
import { Open16Regular } from '@fluentui/react-icons';
import { AzureServiceIcon } from './AzureServiceIcon';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CardButtonProps {
  /** Primary label */
  label: string;
  /** Icon name matching a file in public/azure-icons/ */
  icon: string;
  /** Icon size in px (default: 48 for square, 40 for horizontal) */
  iconSize?: number;
  /**
   * Visual variant:
   *  - `"square"` — icon on top, label below (service shortcut style)
   *  - `"horizontal"` — icon left, title + description right (resource card style)
   */
  variant?: 'square' | 'horizontal';
  /** Secondary description text (horizontal variant only) */
  description?: string;
  /** Show an external-link icon after the label (horizontal variant only) */
  external?: boolean;
  /** Tooltip text shown on hover (if provided) */
  tooltip?: string;
  /** Called when the button is clicked */
  onClick?: () => void;
  /** Additional className */
  className?: string;
  /** aria-label override (defaults to label) */
  'aria-label'?: string;
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const useStyles = makeStyles({
  /* — Shared — */
  base: {
    border: `1px solid transparent`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1,
    cursor: 'pointer',
    transitionProperty: 'box-shadow, border-color',
    transitionDuration: '0.15s',
    transitionTimingFunction: 'ease',
    outline: 'none',
    fontFamily: tokens.fontFamilyBase,
  },

  hovered: {
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.14)',
    ...shorthands.borderColor(tokens.colorNeutralStroke1Hover),
  },

  focused: {
    boxShadow: `0 0 0 2px ${tokens.colorBrandStroke1}`,
    ...shorthands.borderColor(tokens.colorBrandStroke1),
  },

  /* — Square variant — */
  square: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '104px',
    height: '104px',
    padding: '16px 8px',
  },

  squareLabel: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightRegular,
    color: tokens.colorNeutralForeground1,
    textAlign: 'center',
    lineHeight: tokens.lineHeightBase200,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    maxWidth: '88px',
    wordBreak: 'break-word',
  },

  /* — Horizontal variant — */
  horizontal: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 20px',
    minWidth: '280px',
    maxWidth: '400px',
    textAlign: 'left',
  },

  horizontalIcon: {
    flexShrink: 0,
  },

  horizontalContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    minWidth: 0,
  },

  horizontalTitle: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    lineHeight: tokens.lineHeightBase300,
  },

  externalIcon: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground3,
    flexShrink: 0,
  },

  horizontalDescription: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase300,
  },
});

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const CardButton: React.FC<CardButtonProps> = ({
  label,
  icon,
  iconSize,
  variant = 'square',
  description,
  external = false,
  tooltip,
  onClick,
  className,
  'aria-label': ariaLabel,
}) => {
  const styles = useStyles();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const resolvedIconSize = iconSize ?? (variant === 'square' ? 48 : 40);

  const button = (
    <button
      className={mergeClasses(
        styles.base,
        variant === 'square' ? styles.square : styles.horizontal,
        hovered && styles.hovered,
        focused && styles.focused,
        className,
      )}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      aria-label={ariaLabel ?? label}
    >
      {variant === 'square' ? (
        <>
          <AzureServiceIcon name={icon} size={resolvedIconSize} />
          <span className={styles.squareLabel}>{label}</span>
        </>
      ) : (
        <>
          <AzureServiceIcon
            name={icon}
            size={resolvedIconSize}
            className={styles.horizontalIcon}
          />
          <div className={styles.horizontalContent}>
            <span className={styles.horizontalTitle}>
              {label}
              {external && <Open16Regular className={styles.externalIcon} />}
            </span>
            {description && (
              <span className={styles.horizontalDescription}>{description}</span>
            )}
          </div>
        </>
      )}
    </button>
  );

  if (tooltip) {
    return (
      <Tooltip content={tooltip} relationship="label">
        {button}
      </Tooltip>
    );
  }

  return button;
};
