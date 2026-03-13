import React, { useState, useCallback } from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  mergeClasses,
  Popover,
  PopoverTrigger,
  PopoverSurface,
  Checkbox,
  Button,
  Divider,
} from '@fluentui/react-components';
import { Dismiss16Regular, FilterRegular } from '@fluentui/react-icons';

// ─── Types ────────────────────────────────────────────────────────

export interface FilterPillOption {
  key: string;
  label: string;
}

export interface FilterPillProps {
  /** The filter field name (e.g. "Subscription", "Scope") */
  label: string;
  /** Display value shown in the pill (e.g. "Azure subscription 1", "All") */
  value: string;
  /** Separator between label and value — "equals" or ":" */
  separator?: 'equals' | ':';
  /** Menu options with checkboxes (if provided, pill opens a popover on click) */
  options?: FilterPillOption[];
  /** Currently selected option keys */
  selectedKeys?: string[];
  /** Called when the user clicks Apply with updated selections */
  onApply?: (selectedKeys: string[]) => void;
  /** Called when the dismiss button is clicked */
  onDismiss?: () => void;
  /** Show a dismiss (X) button on the pill */
  dismissible?: boolean;
  /** Whether the pill is visually selected / active */
  selected?: boolean;
}

export interface AddFilterPillProps {
  /** Called when the Add filter button is clicked */
  onClick?: () => void;
}

// ─── Styles ───────────────────────────────────────────────────────

const useStyles = makeStyles({
  pill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    height: tokens.spacingHorizontalXXXL, // closest available token
    paddingLeft: tokens.spacingHorizontalM,
    paddingRight: tokens.spacingHorizontalM,
    borderRadius: tokens.borderRadiusCircular,
    border: `${tokens.strokeWidthThin} solid ${tokens.colorBrandStroke2}`,
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorNeutralForeground1,
    fontSize: tokens.fontSizeBase200,
    fontFamily: tokens.fontFamilyBase,
    lineHeight: tokens.lineHeightBase200,
    cursor: 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',

    ':hover': {
      backgroundColor: tokens.colorBrandBackground2Hover,
      ...shorthands.borderColor(tokens.colorBrandStroke2),
    },
    ':active': {
      backgroundColor: tokens.colorBrandBackground2Pressed,
      ...shorthands.borderColor(tokens.colorBrandStroke1),
    },
  },
  pillSelected: {
    backgroundColor: tokens.colorBrandBackground2Hover,
    ...shorthands.borderColor(tokens.colorBrandStroke2),
  },
  pillOpen: {
    backgroundColor: tokens.colorBrandBackground2Pressed,
    ...shorthands.borderColor(tokens.colorBrandStroke1),
  },
  separator: {
    color: tokens.colorNeutralForeground3,
    marginLeft: tokens.spacingHorizontalXXS,
    marginRight: tokens.spacingHorizontalXXS,
    fontWeight: tokens.fontWeightRegular,
  },
  value: {
    fontWeight: tokens.fontWeightSemibold,
  },
  dismissBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: tokens.spacingHorizontalXL, // closest available token
    height: tokens.spacingHorizontalXL, // closest available token
    padding: '0',
    marginLeft: tokens.spacingHorizontalXXS,
    border: 'none',
    borderRadius: '50%',
    backgroundColor: 'transparent',
    color: tokens.colorNeutralForeground3,
    cursor: 'pointer',

    ':hover': {
      backgroundColor: tokens.colorNeutralBackground5,
      color: tokens.colorNeutralForeground1,
    },
  },
  popoverSurface: {
    padding: tokens.spacingVerticalL,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingHorizontalXS,
    minWidth: '200px', // functional layout minimum
  },
  popoverTitle: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    marginBottom: tokens.spacingVerticalS,
  },
  popoverActions: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    marginTop: tokens.spacingVerticalS,
  },
  addFilter: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalSNudge,
    height: tokens.spacingHorizontalXXXL, // closest available token
    paddingLeft: tokens.spacingHorizontalM,
    paddingRight: tokens.spacingHorizontalM,
    borderRadius: tokens.borderRadiusCircular,
    border: `${tokens.strokeWidthThin} solid transparent`,
    backgroundColor: 'transparent',
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
    fontFamily: tokens.fontFamilyBase,
    cursor: 'pointer',

    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      color: tokens.colorNeutralForeground1,
    },
  },
  clearAll: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: tokens.spacingHorizontalXXL, // closest available token
    height: tokens.spacingHorizontalXXL, // closest available token
    padding: '0',
    border: 'none',
    borderRadius: '50%',
    backgroundColor: 'transparent',
    color: tokens.colorNeutralForeground3,
    cursor: 'pointer',
    alignSelf: 'center',

    ':hover': {
      backgroundColor: tokens.colorNeutralBackground5,
      color: tokens.colorNeutralForeground1,
    },
  },
});

// ─── FilterPill ───────────────────────────────────────────────────

export const FilterPill: React.FC<FilterPillProps> = ({
  label,
  value,
  separator = 'equals',
  options,
  selectedKeys: controlledSelectedKeys,
  onApply,
  onDismiss,
  dismissible = false,
  selected = false,
}) => {
  const styles = useStyles();
  const [open, setOpen] = useState(false);
  const [localSelectedKeys, setLocalSelectedKeys] = useState<string[]>(
    controlledSelectedKeys ?? []
  );

  // Sync local state when controlled keys change
  React.useEffect(() => {
    if (controlledSelectedKeys) {
      setLocalSelectedKeys(controlledSelectedKeys);
    }
  }, [controlledSelectedKeys]);

  const handleOpenChange = useCallback(
    (_: unknown, data: { open: boolean }) => {
      setOpen(data.open);
      // Reset local state when opening
      if (data.open && controlledSelectedKeys) {
        setLocalSelectedKeys(controlledSelectedKeys);
      }
    },
    [controlledSelectedKeys]
  );

  const handleCheckboxChange = useCallback(
    (key: string, checked: boolean) => {
      setLocalSelectedKeys((prev) =>
        checked ? [...prev, key] : prev.filter((k) => k !== key)
      );
    },
    []
  );

  const handleApply = useCallback(() => {
    onApply?.(localSelectedKeys);
    setOpen(false);
  }, [localSelectedKeys, onApply]);

  const handleCancel = useCallback(() => {
    if (controlledSelectedKeys) {
      setLocalSelectedKeys(controlledSelectedKeys);
    }
    setOpen(false);
  }, [controlledSelectedKeys]);

  const handleDismissClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDismiss?.();
    },
    [onDismiss]
  );

  const separatorText = separator === 'equals' ? 'equals' : ':';

  const pillContent = (
    <>
      <span>{label}</span>
      <span className={styles.separator}>{separatorText}</span>
      <span className={styles.value}>{value}</span>
      {dismissible && (
        <button
          className={styles.dismissBtn}
          onClick={handleDismissClick}
          aria-label={`Remove ${label} filter`}
        >
          <Dismiss16Regular />
        </button>
      )}
    </>
  );

  const pillClassName = mergeClasses(
    styles.pill,
    selected && styles.pillSelected,
    open && styles.pillOpen
  );

  // If options are provided, wrap in a Popover
  if (options && options.length > 0) {
    return (
      <Popover
        open={open}
        onOpenChange={handleOpenChange}
        positioning="below-start"
        trapFocus
      >
        <PopoverTrigger disableButtonEnhancement>
          <button
            className={pillClassName}
            aria-haspopup="dialog"
            aria-expanded={open}
          >
            {pillContent}
          </button>
        </PopoverTrigger>
        <PopoverSurface className={styles.popoverSurface}>
          <div className={styles.popoverTitle}>{label}</div>
          <Divider />
          {options.map((option) => (
            <Checkbox
              key={option.key}
              label={option.label}
              checked={localSelectedKeys.includes(option.key)}
              onChange={(_, data) =>
                handleCheckboxChange(option.key, !!data.checked)
              }
            />
          ))}
          <Divider />
          <div className={styles.popoverActions}>
            <Button appearance="primary" onClick={handleApply}>
              Apply
            </Button>
            <Button appearance="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </PopoverSurface>
      </Popover>
    );
  }

  // Simple pill without popover
  return (
    <button className={pillClassName}>
      {pillContent}
    </button>
  );
};

// ─── AddFilterPill ────────────────────────────────────────────────

export const AddFilterPill: React.FC<AddFilterPillProps> = ({ onClick }) => {
  const styles = useStyles();
  return (
    <button className={styles.addFilter} onClick={onClick} aria-label="Add filter">
      <FilterRegular />
      <span>Add filter</span>
    </button>
  );
};

// ─── ClearAllFilters (the X button next to pills) ─────────────────

export interface ClearAllFiltersProps {
  onClick?: () => void;
}

export const ClearAllFilters: React.FC<ClearAllFiltersProps> = ({ onClick }) => {
  const styles = useStyles();
  return (
    <button
      className={styles.clearAll}
      onClick={onClick}
      aria-label="Clear all filters"
    >
      <Dismiss16Regular />
    </button>
  );
};
