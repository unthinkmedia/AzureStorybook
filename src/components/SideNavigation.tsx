import React, { useState, useCallback, useMemo } from 'react';
import {
  SearchBox,
  makeStyles,
  tokens,
  mergeClasses,
} from '@fluentui/react-components';
import {
  ChevronRight16Regular,
  ChevronDown20Regular,
  Filter20Regular,
  PanelLeftContract20Regular,
  PanelLeftExpand20Regular,
} from '@fluentui/react-icons';
import { AzureServiceIcon } from './AzureServiceIcon';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NavItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  /** Sub-items — renders as an expandable group */
  children?: NavItem[];
}

export interface SideNavigationProps {
  /** Navigation items to render */
  items?: NavItem[];
  /** Width in pixels when expanded */
  width?: number;
  /** Initially collapsed */
  defaultCollapsed?: boolean;
  /** Show search box at the top */
  searchEnabled?: boolean;
  /** Placeholder for search box */
  searchPlaceholder?: string;
  /** Footer help text */
  footerText?: string;
  /** Called when an item is clicked */
  onItemClick?: (key: string) => void;
  /** Called when search value changes */
  onSearch?: (value: string) => void;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    overflow: 'hidden',
    transitionProperty: 'width, min-width',
    transitionDuration: '200ms',
    transitionTimingFunction: 'ease',
    userSelect: 'none',
  },
  expanded: {
    width: '260px',
    minWidth: '260px',
  },
  collapsed: {
    width: '48px',
    minWidth: '48px',
  },

  // ── Header ──
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '8px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
  },
  searchBox: {
    flex: 1,
    minWidth: 0,
  },
  headerButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    border: 'none',
    background: 'none',
    borderRadius: tokens.borderRadiusMedium,
    color: tokens.colorNeutralForeground3,
    cursor: 'pointer',
    flexShrink: 0,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground3,
      color: tokens.colorNeutralForeground1,
    },
  },
  collapsedHeader: {
    justifyContent: 'center',
    padding: '8px 0',
  },

  // ── Items list ──
  itemsList: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '4px 0',
  },

  // ── Nav item ──
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '6px 16px',
    height: '36px',
    boxSizing: 'border-box',
    border: 'none',
    background: 'none',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    color: tokens.colorNeutralForeground1,
    fontSize: '13px',
    fontWeight: 400,
    lineHeight: '20px',
    borderLeft: '3px solid transparent',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground3,
    },
  },
  navItemSelected: {
    backgroundColor: tokens.colorNeutralBackground3,
    borderLeftColor: tokens.colorBrandForeground1,
    fontWeight: 600,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground3,
    },
  },
  navItemIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    flexShrink: 0,
    color: tokens.colorNeutralForeground3,
  },
  navItemIconSelected: {
    color: tokens.colorBrandForeground1,
  },
  navItemLabel: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    minWidth: 0,
  },

  // ── Group header ──
  groupHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 16px',
    height: '36px',
    boxSizing: 'border-box',
    border: 'none',
    background: 'none',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    color: tokens.colorNeutralForeground2,
    fontSize: '13px',
    fontWeight: 600,
    lineHeight: '20px',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground3,
    },
  },
  groupChevron: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '16px',
    height: '16px',
    flexShrink: 0,
    color: tokens.colorNeutralForeground3,
  },
  groupChildren: {
    paddingLeft: '8px',
  },

  // ── Footer ──
  footer: {
    padding: '12px 16px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    fontSize: '12px',
    color: tokens.colorBrandForeground1,
    fontStyle: 'italic',
    flexShrink: 0,
  },
});

// ─── Default items (matching Azure Portal Resource Manager) ───────────────────

const defaultItems: NavItem[] = [
  {
    key: 'resource-manager',
    label: 'Resource Manager',
    icon: <AzureServiceIcon name="resource-manager" size={18} />,
  },
  {
    key: 'all-resources',
    label: 'All resources',
    icon: <AzureServiceIcon name="all-resources" size={18} />,
    selected: true,
  },
  {
    key: 'favorite-resources',
    label: 'Favorite resources',
    icon: <AzureServiceIcon name="favorites" size={18} />,
  },
  {
    key: 'recent-resources',
    label: 'Recent resources',
    icon: <AzureServiceIcon name="recent" size={18} />,
  },
  {
    key: 'resource-groups',
    label: 'Resource groups',
    icon: <AzureServiceIcon name="resource-groups" size={18} />,
  },
  {
    key: 'tags',
    label: 'Tags',
    icon: <AzureServiceIcon name="tags" size={18} />,
  },
  {
    key: 'organization',
    label: 'Organization',
    icon: <AzureServiceIcon name="organization" size={18} />,
    children: [],
  },
  {
    key: 'tools',
    label: 'Tools',
    children: [
      { key: 'resource-graph-explorer', label: 'Resource graph explorer', icon: <AzureServiceIcon name="resource-graph-explorer" size={18} /> },
      { key: 'resource-graph-queries', label: 'Resource graph queries', icon: <AzureServiceIcon name="resource-graph-queries" size={18} /> },
      { key: 'resource-visualizer', label: 'Resource visualizer', icon: <AzureServiceIcon name="resource-visualizer" size={18} /> },
      { key: 'resource-explorer', label: 'Resource explorer', icon: <AzureServiceIcon name="resource-explorer" size={18} /> },
      { key: 'arm-api-playground', label: 'ARM API playground', icon: <AzureServiceIcon name="arm-api-playground" size={18} /> },
      { key: 'resource-mover', label: 'Resource mover', icon: <AzureServiceIcon name="resource-mover" size={18} /> },
    ],
  },
  {
    key: 'deployments',
    label: 'Deployments',
    children: [
      { key: 'templates', label: 'Templates', icon: <AzureServiceIcon name="templates" size={18} /> },
      { key: 'template-specs', label: 'Template specs', icon: <AzureServiceIcon name="template-specs" size={18} /> },
    ],
  },
  {
    key: 'help',
    label: 'Help',
    children: [
      { key: 'support-troubleshooting', label: 'Support + troubleshooting', icon: <AzureServiceIcon name="help-support" size={18} /> },
    ],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

interface NavGroupProps {
  item: NavItem;
  expanded: boolean;
  onToggle: (key: string) => void;
  onItemClick?: (key: string) => void;
}

const NavGroup: React.FC<NavGroupProps> = ({ item, expanded, onToggle, onItemClick }) => {
  const styles = useStyles();

  return (
    <div>
      <button
        className={styles.groupHeader}
        onClick={() => onToggle(item.key)}
        aria-expanded={expanded}
        aria-label={`${item.label} section`}
      >
        <span className={styles.groupChevron}>
          {expanded ? <ChevronDown20Regular /> : <ChevronRight16Regular />}
        </span>
        {item.label}
      </button>
      {expanded && item.children && (
        <div className={styles.groupChildren}>
          {item.children.map((child) => (
            <NavItemButton key={child.key} item={child} onItemClick={onItemClick} />
          ))}
        </div>
      )}
    </div>
  );
};

interface NavItemButtonProps {
  item: NavItem;
  onItemClick?: (key: string) => void;
}

const NavItemButton: React.FC<NavItemButtonProps> = ({ item, onItemClick }) => {
  const styles = useStyles();
  return (
    <button
      className={mergeClasses(styles.navItem, item.selected && styles.navItemSelected)}
      onClick={() => {
        item.onClick?.();
        onItemClick?.(item.key);
      }}
      aria-current={item.selected ? 'page' : undefined}
    >
      {item.icon && (
        <span className={mergeClasses(styles.navItemIcon, item.selected && styles.navItemIconSelected)}>
          {item.icon}
        </span>
      )}
      <span className={styles.navItemLabel}>{item.label}</span>
    </button>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

export const SideNavigation: React.FC<SideNavigationProps> = ({
  items = defaultItems,
  width = 260,
  defaultCollapsed = false,
  searchEnabled = true,
  searchPlaceholder = 'Search',
  footerText = 'Add or remove favorites by pressing Cmd+Shift+F',
  onItemClick,
  onSearch,
}) => {
  const styles = useStyles();
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  // Collect all group keys for toggle-all
  const groupKeys = useMemo(
    () => items.filter((item) => item.children).map((item) => item.key),
    [items]
  );

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    () => new Set(groupKeys)
  );

  const toggleGroup = useCallback((key: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const toggleAllGroups = useCallback(() => {
    setExpandedGroups((prev) => {
      const allExpanded = groupKeys.every((k) => prev.has(k));
      return allExpanded ? new Set<string>() : new Set(groupKeys);
    });
  }, [groupKeys]);

  const allGroupsExpanded = groupKeys.every((k) => expandedGroups.has(k));

  const toggle = useCallback(() => setCollapsed((c) => !c), []);

  if (collapsed) {
    return (
      <nav
        className={mergeClasses(styles.root, styles.collapsed)}
        aria-label="Side navigation"
      >
        <div className={mergeClasses(styles.header, styles.collapsedHeader)}>
          <button
            className={styles.headerButton}
            onClick={toggle}
            aria-label="Expand navigation"
          >
            <PanelLeftExpand20Regular />
          </button>
        </div>
        <div className={styles.itemsList}>
          {items.map((item) =>
            item.children && item.children.length > 0 ? null : (
              item.icon ? (
                <button
                  key={item.key}
                  className={mergeClasses(styles.navItem, item.selected && styles.navItemSelected)}
                  onClick={() => {
                    item.onClick?.();
                    onItemClick?.(item.key);
                  }}
                  aria-label={item.label}
                  aria-current={item.selected ? 'page' : undefined}
                  style={{ justifyContent: 'center', padding: '6px 0', borderLeft: item.selected ? `3px solid ${tokens.colorBrandForeground1}` : '3px solid transparent' }}
                  title={item.label}
                >
                  <span className={mergeClasses(styles.navItemIcon, item.selected && styles.navItemIconSelected)}>
                    {item.icon}
                  </span>
                </button>
              ) : null
            )
          )}
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={mergeClasses(styles.root, styles.expanded)}
      style={{ width: `${width}px`, minWidth: `${width}px` }}
      aria-label="Side navigation"
    >
      {/* Header with search + controls */}
      <div className={styles.header}>
        {searchEnabled && (
          <SearchBox
            className={styles.searchBox}
            placeholder={searchPlaceholder}
            size="small"
            onChange={(_e, data) => onSearch?.(data.value)}
          />
        )}
        <button
          className={styles.headerButton}
          onClick={toggleAllGroups}
          aria-label={allGroupsExpanded ? 'Collapse all sections' : 'Expand all sections'}
          title={allGroupsExpanded ? 'Collapse all sections' : 'Expand all sections'}
          aria-pressed={!allGroupsExpanded}
        >
          <Filter20Regular />
        </button>
        <button
          className={styles.headerButton}
          onClick={toggle}
          aria-label="Collapse navigation"
          title="Collapse navigation"
        >
          <PanelLeftContract20Regular />
        </button>
      </div>

      {/* Navigation items */}
      <div className={styles.itemsList} role="list">
        {items.map((item) =>
          item.children ? (
            <NavGroup
              key={item.key}
              item={item}
              expanded={expandedGroups.has(item.key)}
              onToggle={toggleGroup}
              onItemClick={onItemClick}
            />
          ) : (
            <NavItemButton key={item.key} item={item} onItemClick={onItemClick} />
          )
        )}
      </div>

      {/* Footer */}
      {footerText && <div className={styles.footer}>{footerText}</div>}
    </nav>
  );
};
