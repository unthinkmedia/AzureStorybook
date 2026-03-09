import React from 'react';
import {
  SearchBox,
  makeStyles,
  tokens,
  Tag,
  TagGroup,
  Dropdown,
  Option,
} from '@fluentui/react-components';

export interface FilterTag {
  id: string;
  label: string;
}

export interface FilterBarProps {
  placeholder?: string;
  filters?: { label: string; options: string[] }[];
  activeTags?: FilterTag[];
  onRemoveTag?: (id: string) => void;
  onSearch?: (value: string) => void;
}

const useStyles = makeStyles({
  root: {
    padding: '8px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  row: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  search: {
    minWidth: '200px',
    maxWidth: '320px',
  },
});

export const FilterBar: React.FC<FilterBarProps> = ({
  placeholder = 'Filter resources...',
  filters = [
    { label: 'Type', options: ['Virtual Machine', 'App Service', 'SQL Database', 'Storage Account'] },
    { label: 'Location', options: ['East US', 'West US 2', 'Central US', 'North Europe'] },
  ],
  activeTags = [],
  onRemoveTag: _onRemoveTag,
  onSearch,
}) => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <SearchBox
          className={styles.search}
          placeholder={placeholder}
          onChange={(_, data) => onSearch?.(data.value)}
        />
        {filters.map((f) => (
          <Dropdown key={f.label} placeholder={f.label} size="small" style={{ minWidth: 140 }}>
            {f.options.map((opt) => (
              <Option key={opt}>{opt}</Option>
            ))}
          </Dropdown>
        ))}
      </div>
      {activeTags.length > 0 && (
        <TagGroup aria-label="Active filters">
          {activeTags.map((tag) => (
            <Tag
              key={tag.id}
              size="small"
              dismissible
              dismissIcon={{ 'aria-label': `Remove ${tag.label}` }}
              value={tag.id}
            >
              {tag.label}
            </Tag>
          ))}
        </TagGroup>
      )}
    </div>
  );
};
