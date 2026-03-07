import React from 'react';
import {
  Text,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  MoreHorizontal24Regular,
  Pin24Regular,
} from '@fluentui/react-icons';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface PageTitleBarProps {
  title: string;
  /** Optional subtitle displayed below the title (e.g. "Microsoft"). */
  subtitle?: string;
  icon?: React.ReactNode;
  onPin?: () => void;
  onMore?: () => void;
}

/* -------------------------------------------------------------------------- */
/*  Styles                                                                    */
/* -------------------------------------------------------------------------- */

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
  },
  titleIcon: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
  titleTextBlock: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    display: 'flex',
    alignItems: 'baseline',
    fontSize: tokens.fontSizeBase500,
    lineHeight: tokens.lineHeightBase500,
  },
  titleBold: {
    fontWeight: tokens.fontWeightSemibold,
  },
  titleRegular: {
    fontWeight: tokens.fontWeightRegular,
  },
  subtitle: {
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
    color: tokens.colorNeutralForeground3,
  },
  actions: {
    display: 'flex',
    gap: '2px',
    flexShrink: 0,
  },
});

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export const PageTitleBar: React.FC<PageTitleBarProps> = ({
  title,
  subtitle,
  icon,
  onPin,
  onMore,
}) => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      {icon && <span className={styles.titleIcon}>{icon}</span>}
      <div className={styles.titleTextBlock}>
        <span className={styles.title}>
          {title.includes('|') ? (
            title.split('|').map((segment, i) => (
              <span key={i}>
                {i > 0 && <span className={styles.titleRegular}>{'\u00A0| '}</span>}
                <span className={i === 0 ? styles.titleBold : styles.titleRegular}>
                  {segment.trim()}
                </span>
              </span>
            ))
          ) : (
            <span className={styles.titleBold}>{title}</span>
          )}
        </span>
        {subtitle && (
          <Text className={styles.subtitle}>{subtitle}</Text>
        )}
      </div>
      <div className={styles.actions}>
        {onPin && (
          <Button
            appearance="subtle"
            icon={<Pin24Regular />}
            aria-label="Pin"
            onClick={onPin}
          />
        )}
        {onMore && (
          <Button
            appearance="subtle"
            icon={<MoreHorizontal24Regular />}
            aria-label="More actions"
            onClick={onMore}
          />
        )}
      </div>
    </div>
  );
};
