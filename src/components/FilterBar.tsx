import React from 'react';
import { SearchBox, makeStyles, tokens } from '@fluentui/react-components';
import { FilterPill, AddFilterPill, type FilterPillProps } from './FilterPill';

export interface FilterBarFilter {
  /** Filter field name (e.g. "Subscription", "Resource Group") */
  label: string;
  /** Display value (e.g. "17 selected", "all") */
  value: string;
  /** Separator style */
  separator?: FilterPillProps['separator'];
  /** Whether this pill is visually selected/highlighted */
  selected?: boolean;
  /** Whether this pill shows a dismiss (X) button */
  dismissible?: boolean;
  /** Menu options for popover */
  options?: FilterPillProps['options'];
  /** Currently selected option keys */
  selectedKeys?: string[];
}

export interface FilterBarProps {
  /** Placeholder text for the search input */
  placeholder?: string;
  /** Filter pills to display */
  filters?: FilterBarFilter[];
  /** Called when the search input value changes */
  onSearch?: (value: string) => void;
  /** Called when a filter pill's selections are applied */
  onFilterApply?: (label: string, selectedKeys: string[]) => void;
  /** Called when a filter pill is dismissed */
  onFilterDismiss?: (label: string) => void;
  /** Called when the Add filter button is clicked */
  onAddFilter?: () => void;
  /** Whether to show the Add filter button */
  showAddFilter?: boolean;
}

const useStyles = makeStyles({
  root: {
    padding: '8px 16px',
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexWrap: 'wrap',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  search: {
    minWidth: '180px',
    maxWidth: '220px',
  },
});

export const FilterBar: React.FC<FilterBarProps> = ({
  placeholder = 'Filter for any field...',
  filters = [
    { label: 'Subscription', value: '17 selected', selected: true },
    { label: 'Resource Group', value: 'all', dismissible: true },
    { label: 'Type', value: 'all', dismissible: true },
    { label: 'Location', value: 'all', dismissible: true },
  ],
  onSearch,
  onFilterApply,
  onFilterDismiss,
  onAddFilter,
  showAddFilter = true,
}) => {
  const styles = useStyles();
  return (
    <div className={styles.root} role="toolbar" aria-label="Filter bar">
      <SearchBox
        className={styles.search}
        placeholder={placeholder}
        size="small"
        onChange={(_, data) => onSearch?.(data.value)}
      />
      {filters.map((f) => (
        <FilterPill
          key={f.label}
          label={f.label}
          value={f.value}
          separator={f.separator ?? 'equals'}
          selected={f.selected}
          dismissible={f.dismissible}
          options={f.options}
          selectedKeys={f.selectedKeys}
          onApply={
            onFilterApply
              ? (keys) => onFilterApply(f.label, keys)
              : undefined
          }
          onDismiss={
            onFilterDismiss
              ? () => onFilterDismiss(f.label)
              : undefined
          }
        />
      ))}
      {showAddFilter && <AddFilterPill onClick={onAddFilter} />}
    </div>
  );
};
