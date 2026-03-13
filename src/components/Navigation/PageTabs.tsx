import React from 'react';
import { TabList, Tab, makeStyles, tokens, mergeClasses } from '@fluentui/react-components';
import type { SelectTabData, SelectTabEvent } from '@fluentui/react-components';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface PageTab {
  /** Unique value used to identify the tab. */
  value: string;
  /** Display label for the tab. */
  label: string;
  /** Optional icon rendered before the label. */
  icon?: React.ReactElement;
  /** Disable this tab. */
  disabled?: boolean;
}

export interface PageTabsProps {
  /** The list of tabs to render. */
  tabs: PageTab[];
  /** The currently selected tab value. */
  selectedValue: string;
  /** Callback when a tab is selected. */
  onTabSelect: (value: string) => void;
  /** Additional className for the root wrapper. */
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*  Styles                                                                    */
/* -------------------------------------------------------------------------- */

const useStyles = makeStyles({
  root: {
    borderBottomWidth: tokens.strokeWidthThin,
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke2,
    paddingLeft: tokens.spacingHorizontalXXL,
    paddingRight: tokens.spacingHorizontalXXL,
  },
});

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export const PageTabs: React.FC<PageTabsProps> = ({
  tabs,
  selectedValue,
  onTabSelect,
  className,
}) => {
  const styles = useStyles();

  const handleTabSelect = (_event: SelectTabEvent, data: SelectTabData) => {
    onTabSelect(data.value as string);
  };

  return (
    <div className={mergeClasses(styles.root, className)}>
      <TabList
        selectedValue={selectedValue}
        onTabSelect={handleTabSelect}
        appearance="transparent"
        size="medium"
      >
        {tabs.map((tab) => (
          <Tab key={tab.value} value={tab.value} icon={tab.icon} disabled={tab.disabled}>
            {tab.label}
          </Tab>
        ))}
      </TabList>
    </div>
  );
};
