import React from 'react';
import { makeStyles } from '@fluentui/react-components';
import { PageTitleBar } from './PageTitleBar';
import type { PageTitleBarProps } from './PageTitleBar';
import { CopilotSuggestionsBar } from './CopilotSuggestionsBar';
import type { CopilotSuggestionsBarProps } from './CopilotSuggestionsBar';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface PageHeaderProps extends PageTitleBarProps {
  /** Copilot suggestions bar rendered inline to the right of the title. */
  copilotSuggestions?: CopilotSuggestionsBarProps;
}

/* -------------------------------------------------------------------------- */
/*  Styles                                                                    */
/* -------------------------------------------------------------------------- */

const useStyles = makeStyles({
  root: {
    padding: '12px 24px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    minHeight: '48px',
    overflow: 'hidden',
  },
  suggestions: {
    /* Offset to vertically center with the 28px title line (not title+subtitle). */
    marginTop: '2px',
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
  },
});

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export const PageHeader: React.FC<PageHeaderProps> = ({
  copilotSuggestions,
  ...titleProps
}) => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <PageTitleBar {...titleProps} />
      {copilotSuggestions && (
        <div className={styles.suggestions}>
          <CopilotSuggestionsBar {...copilotSuggestions} />
        </div>
      )}
    </div>
  );
};
