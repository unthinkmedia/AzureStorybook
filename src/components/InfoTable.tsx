import React from 'react';
import {
  makeStyles,
  tokens,
  Text,
  Link,
  Button,
  Tooltip,
  mergeClasses,
} from '@fluentui/react-components';
import { Copy16Regular } from '@fluentui/react-icons';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface InfoTableItem {
  /** Label for the field (e.g. "Name", "Tenant ID") */
  label: string;
  /** The display value */
  value: string;
  /** If true, value renders as a link */
  isLink?: boolean;
  /** Click handler when value is a link */
  onClick?: () => void;
  /** If true, shows a copy-to-clipboard button next to the value */
  copyable?: boolean;
}

export interface InfoTableProps {
  /** Items to display in the table */
  items: InfoTableItem[];
  /**
   * Number of label-value columns at wide widths.
   * @default 2
   */
  columns?: 1 | 2 | 3;
  /** Additional className for the root element */
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

/** Split items into N column groups using round-robin distribution. */
function splitColumns(items: InfoTableItem[], columnCount: number): InfoTableItem[][] {
  const groups: InfoTableItem[][] = Array.from({ length: columnCount }, () => []);
  items.forEach((item, i) => {
    groups[i % columnCount].push(item);
  });
  return groups;
}

/* -------------------------------------------------------------------------- */
/*  Styles                                                                    */
/* -------------------------------------------------------------------------- */

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: `0 ${tokens.spacingHorizontalXXXL}`,
    width: '100%',
  },
  column: {
    flex: '1 1 320px', // functional layout min/max
    display: 'grid',
    gridTemplateColumns: 'max-content minmax(0, 1fr)',
    alignContent: 'start',
    overflow: 'hidden',
  },
  label: {
    paddingTop: tokens.spacingVerticalMNudge,
    paddingBottom: tokens.spacingVerticalMNudge,
    paddingRight: tokens.spacingHorizontalXXL,
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300,
    color: tokens.colorNeutralForeground1,
    fontWeight: tokens.fontWeightRegular,
    whiteSpace: 'nowrap',
  },
  value: {
    paddingTop: tokens.spacingVerticalMNudge,
    paddingBottom: tokens.spacingVerticalMNudge,
    paddingRight: tokens.spacingHorizontalXXXL,
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300,
    color: tokens.colorNeutralForeground1,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  valueLink: {
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300,
  },
  copyButton: {
    minWidth: 'auto',
    padding: tokens.spacingHorizontalXXS,
    height: '24px', // layout constant
    width: '24px', // layout constant
  },
});

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export const InfoTable: React.FC<InfoTableProps> = ({ items, columns = 2, className }) => {
  const styles = useStyles();
  const groups = splitColumns(items, columns);

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  return (
    <div className={mergeClasses(styles.root, className)}>
      {groups.map((group, colIdx) => (
        <div key={colIdx} className={styles.column}>
          {group.map((item) => (
            <React.Fragment key={item.label}>
              <Text className={styles.label}>{item.label}</Text>
              <div className={styles.value}>
                {item.isLink ? (
                  <Link className={styles.valueLink} onClick={item.onClick}>
                    {item.value}
                  </Link>
                ) : (
                  <Text>{item.value}</Text>
                )}
                {item.copyable && (
                  <Tooltip content="Copy to clipboard" relationship="label">
                    <Button
                      appearance="subtle"
                      size="small"
                      icon={<Copy16Regular />}
                      className={styles.copyButton}
                      onClick={() => handleCopy(item.value)}
                      aria-label={`Copy ${item.label}`}
                    />
                  </Tooltip>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  );
};
