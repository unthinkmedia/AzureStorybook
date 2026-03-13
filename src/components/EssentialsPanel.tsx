import React, { useState } from 'react';
import { makeStyles, tokens, Text, Link, mergeClasses } from '@fluentui/react-components';
import { ChevronUp20Regular, ChevronDown20Regular } from '@fluentui/react-icons';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface EssentialItem {
  /** Label for the field (e.g. "Subscription", "Location") */
  label: string;
  /** The display value */
  value: string;
  /** If true, value renders as a link */
  isLink?: boolean;
  /** Click handler when value is a link */
  onClick?: () => void;
  /** Optional inline action rendered after the label (e.g. "(move)", "(edit)") */
  labelAction?: {
    text: string;
    onClick?: () => void;
  };
}

export interface EssentialAction {
  /** Link text (e.g. "View Cost", "JSON View") */
  label: string;
  onClick?: () => void;
}

export interface EssentialsPanelProps {
  /** Items for the left column */
  leftItems: EssentialItem[];
  /** Items for the right column */
  rightItems?: EssentialItem[];
  /** Action links shown at the top-right (e.g. "View Cost", "JSON View") */
  actions?: EssentialAction[];
  /** Whether the panel starts expanded */
  defaultExpanded?: boolean;
}

/* -------------------------------------------------------------------------- */
/*  Styles                                                                    */
/* -------------------------------------------------------------------------- */

const useStyles = makeStyles({
  root: {
    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalSNudge,
    cursor: 'pointer',
    paddingTop: tokens.spacingVerticalM,
    paddingBottom: tokens.spacingVerticalM,
    userSelect: 'none',
    background: 'none',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    fontFamily: tokens.fontFamilyBase,
  },
  headerLabel: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  chevron: {
    display: 'flex',
    alignItems: 'center',
    color: tokens.colorNeutralForeground3,
    flexShrink: 0,
  },
  body: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0',
    paddingBottom: tokens.spacingVerticalL,
    '@media (max-width: 640px)': {
      gridTemplateColumns: '1fr',
    },
  },
  bodyCollapsed: {
    display: 'none',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  row: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0',
    minHeight: '24px', // functional layout
  },
  label: {
    display: 'inline-flex',
    alignItems: 'baseline',
    gap: tokens.spacingHorizontalXS,
    minWidth: '180px', // functional layout
    flexShrink: 0,
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
    color: tokens.colorNeutralForeground1,
  },
  labelAction: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorBrandForegroundLink,
    cursor: 'pointer',
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'underline',
    },
  },
  colon: {
    marginRight: tokens.spacingHorizontalS,
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
  value: {
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
    color: tokens.colorNeutralForeground1,
  },
  valueLink: {
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
  },
  actionsRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: tokens.spacingHorizontalL,
    paddingTop: tokens.spacingVerticalM,
    paddingBottom: '0',
    position: 'absolute',
    top: '0',
    right: '0',
  },
  actionLink: {
    fontSize: tokens.fontSizeBase200,
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
  },
});

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export const EssentialsPanel: React.FC<EssentialsPanelProps> = ({
  leftItems,
  rightItems,
  actions,
  defaultExpanded = true,
}) => {
  const styles = useStyles();
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className={styles.root}>
      <div className={styles.headerRow}>
        <button
          className={styles.header}
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-label={expanded ? 'Collapse Essentials' : 'Expand Essentials'}
        >
          <span className={styles.chevron}>
            {expanded ? <ChevronUp20Regular /> : <ChevronDown20Regular />}
          </span>
          <Text className={styles.headerLabel}>Essentials</Text>
        </button>
        {actions && actions.length > 0 && (
          <div className={styles.actionsRow}>
            {actions.map((action) => (
              <Link key={action.label} className={styles.actionLink} onClick={action.onClick}>
                {action.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className={mergeClasses(styles.body, !expanded && styles.bodyCollapsed)}>
        <div className={styles.column}>
          {leftItems.map((item) => (
            <EssentialRow key={item.label} item={item} styles={styles} />
          ))}
        </div>
        {rightItems && rightItems.length > 0 && (
          <div className={styles.column}>
            {rightItems.map((item) => (
              <EssentialRow key={item.label} item={item} styles={styles} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  Row sub-component                                                         */
/* -------------------------------------------------------------------------- */

const EssentialRow: React.FC<{
  item: EssentialItem;
  styles: ReturnType<typeof useStyles>;
}> = ({ item, styles }) => (
  <div className={styles.row}>
    <span className={styles.label}>
      {item.label}
      {item.labelAction && (
        <>
          {' '}
          <Link className={styles.labelAction} onClick={item.labelAction.onClick} inline>
            ({item.labelAction.text})
          </Link>
        </>
      )}
    </span>
    <span className={styles.colon}>:</span>
    {item.isLink ? (
      <Link className={styles.valueLink} onClick={item.onClick}>
        {item.value}
      </Link>
    ) : (
      <Text className={styles.value}>{item.value}</Text>
    )}
  </div>
);
