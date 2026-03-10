import React, { useState } from 'react';
import {
  Button,
  Text,
  Input,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { SearchRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  banner: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '24px 32px 32px 32px',
    backgroundColor: tokens.colorNeutralBackground3,
    borderTop: `4px solid ${tokens.colorBrandBackground}`,
  },
  heading: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    lineHeight: tokens.lineHeightBase500,
    marginBottom: '0px',
  },
  description: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase300,
    marginBottom: '4px',
  },
  searchRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  searchInput: {
    flex: 1,
    maxWidth: '540px',
  },
});

export interface SearchBannerProps {
  /** Banner heading text */
  heading: string;
  /** Descriptive text below the heading */
  description?: string;
  /** Search input placeholder */
  placeholder?: string;
  /** Label for the submit button */
  buttonLabel?: string;
  /** Callback when the search is submitted */
  onSearch?: (query: string) => void;
}

export const SearchBanner: React.FC<SearchBannerProps> = ({
  heading,
  description,
  placeholder = 'Briefly describe the issue',
  buttonLabel = 'Go',
  onSearch,
}) => {
  const styles = useStyles();
  const [query, setQuery] = useState('');

  const handleSubmit = () => {
    onSearch?.(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className={styles.banner}>
      <Text className={styles.heading} as="h2">
        {heading}
      </Text>
      {description && (
        <Text className={styles.description}>{description}</Text>
      )}
      <div className={styles.searchRow}>
        <Input
          className={styles.searchInput}
          contentBefore={<SearchRegular />}
          placeholder={placeholder}
          value={query}
          onChange={(_, data) => setQuery(data.value)}
          onKeyDown={handleKeyDown}
          aria-label={placeholder}
        />
        <Button appearance="primary" onClick={handleSubmit}>
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
};
