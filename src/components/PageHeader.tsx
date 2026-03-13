import React from 'react';
import { makeStyles, tokens } from '@fluentui/react-components';
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
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalXXL}`,
    display: 'flex',
    alignItems: 'flex-start',
    gap: tokens.spacingHorizontalS,
    minHeight: '48px', // functional layout
    overflow: 'hidden',
  },
  suggestions: {
    /* Offset to vertically center with the 28px title line (not title+subtitle). */
    marginTop: tokens.spacingVerticalXXS,
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
  },
});

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export const PageHeader: React.FC<PageHeaderProps> = ({ copilotSuggestions, ...titleProps }) => {
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
