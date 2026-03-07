import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { makeStyles, tokens } from '@fluentui/react-components';
import {
  FilterPill,
  AddFilterPill,
  ClearAllFilters,
} from '../../components/FilterPill';

export default {
  title: 'Components/FilterPill',
  component: FilterPill,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Azure Portal-style filter pill buttons. Click a pill to open a popover with checkbox selections and Apply/Cancel actions. Pills can be composed into a filter bar row.',
      },
    },
  },
} satisfies Meta<typeof FilterPill>;

type Story = StoryObj<typeof FilterPill>;

// ─── Basic pill (no menu) ─────────────────────────────────────────

export const Default: Story = {
  args: {
    label: 'Subscription',
    value: 'Azure subscription 1',
    separator: 'equals',
  },
};

export const ColonSeparator: Story = {
  args: {
    label: 'Scope',
    value: 'All',
    separator: ':',
  },
};

export const Dismissible: Story = {
  args: {
    label: 'Subcategory',
    value: 'All',
    separator: 'equals',
    dismissible: true,
  },
};

export const Selected: Story = {
  args: {
    label: 'Scope',
    value: 'All',
    separator: ':',
    selected: true,
  },
};

// ─── Pill with popover menu ──────────────────────────────────────

export const WithMenu: Story = {
  args: {
    label: 'Scope',
    value: 'All',
    separator: ':',
    options: [
      { key: 'all', label: 'All' },
      { key: 'this-scope', label: 'This scope' },
    ],
    selectedKeys: ['all', 'this-scope'],
  },
};

export const WithMenuSingleOption: Story = {
  args: {
    label: 'Recommendation Status',
    value: 'Active',
    separator: 'equals',
    options: [
      { key: 'active', label: 'Active' },
      { key: 'completed', label: 'Completed' },
      { key: 'dismissed', label: 'Dismissed' },
      { key: 'postponed', label: 'Postponed' },
    ],
    selectedKeys: ['active'],
  },
};

// ─── Interactive example ──────────────────────────────────────────

const useComposedStyles = makeStyles({
  row: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: '12px 16px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
  },
});

const InteractiveFilterBar = () => {
  const styles = useComposedStyles();

  const [scopeSelection, setScopeSelection] = useState(['all', 'this-scope']);
  const [typeSelection, setTypeSelection] = useState(['all']);
  const [statusSelection, setStatusSelection] = useState(['active']);
  const [showSubscription, setShowSubscription] = useState(true);
  const [showSubcategory, setShowSubcategory] = useState(true);
  const [showCommitments, setShowCommitments] = useState(true);

  const scopeValue =
    scopeSelection.length === 2
      ? 'All'
      : scopeSelection.includes('this-scope')
        ? 'This scope'
        : 'All';

  const typeValue =
    typeSelection.length === 0 ? 'None' : typeSelection.includes('all') ? 'All' : typeSelection.join(', ');

  const statusOptions = [
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
    { key: 'dismissed', label: 'Dismissed' },
    { key: 'postponed', label: 'Postponed' },
  ];
  const statusValue =
    statusSelection.length === 0
      ? 'None'
      : statusSelection.length === statusOptions.length
        ? 'All'
        : statusSelection
            .map((k) => statusOptions.find((o) => o.key === k)?.label)
            .join(', ');

  return (
    <div className={styles.row}>
      {/* Static pills (no menu) */}
      {showSubscription && (
        <FilterPill
          label="Subscription"
          value="Azure subscription 1"
          separator="equals"
          dismissible
          onDismiss={() => setShowSubscription(false)}
        />
      )}

      {/* Pills with menus */}
      <FilterPill
        label="Recommendation Status"
        value={statusValue}
        separator="equals"
        options={statusOptions}
        selectedKeys={statusSelection}
        onApply={setStatusSelection}
      />

      {showSubcategory && (
        <FilterPill
          label="Subcategory"
          value="All"
          separator="equals"
          dismissible
          onDismiss={() => setShowSubcategory(false)}
        />
      )}

      {/* Clear all button */}
      <ClearAllFilters
        onClick={() => {
          setShowSubscription(true);
          setShowSubcategory(true);
          setShowCommitments(true);
          setScopeSelection(['all', 'this-scope']);
          setTypeSelection(['all']);
          setStatusSelection(['active']);
        }}
      />

      {/* Add filter */}
      <AddFilterPill onClick={() => alert('Open filter picker')} />

      {/* Second row wrapping */}
      {showCommitments && (
        <FilterPill
          label="Commitments"
          value="3 years, 30 days"
          separator="equals"
          dismissible
          onDismiss={() => setShowCommitments(false)}
        />
      )}
    </div>
  );
};

export const ComposedFilterBar: StoryObj = {
  render: () => <InteractiveFilterBar />,
  parameters: {
    docs: {
      description: {
        story:
          'Multiple FilterPill components composed into a filter bar row. Some pills open popover menus on click; others are static. Includes dismiss, clear-all, and add-filter affordances.',
      },
    },
  },
};

// ─── Scope / Type example from screenshot 2 ──────────────────────

const ScopeTypeExample = () => {
  const styles = useComposedStyles();
  const [scopeKeys, setScopeKeys] = useState(['all', 'this-scope']);
  const [typeKeys, setTypeKeys] = useState(['all']);

  const scopeValue =
    scopeKeys.length === 2
      ? 'All'
      : scopeKeys.includes('this-scope')
        ? 'This scope'
        : 'All';

  return (
    <div className={styles.row}>
      <FilterPill
        label="Scope"
        value={scopeValue}
        separator=":"
        options={[
          { key: 'all', label: 'All' },
          { key: 'this-scope', label: 'This scope' },
        ]}
        selectedKeys={scopeKeys}
        onApply={setScopeKeys}
      />
      <FilterPill
        label="Type"
        value={typeKeys.includes('all') ? 'All' : 'Custom'}
        separator=":"
        options={[
          { key: 'all', label: 'All' },
          { key: 'vm', label: 'Virtual Machine' },
          { key: 'sql', label: 'SQL Database' },
          { key: 'storage', label: 'Storage Account' },
        ]}
        selectedKeys={typeKeys}
        onApply={setTypeKeys}
      />
    </div>
  );
};

export const ScopeAndType: StoryObj = {
  render: () => <ScopeTypeExample />,
  parameters: {
    docs: {
      description: {
        story:
          'Filter pills with ":" separator and popover menus, matching the Scope/Type pattern from Azure Portal.',
      },
    },
  },
};
