import React from 'react';
import {
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  makeStyles,
  mergeClasses,
  tokens,
} from '@fluentui/react-components';
import {
  Add20Regular,
  ArrowDownload20Regular,
  ArrowSync20Regular,
  ChevronDown16Regular,
  MoreHorizontal20Regular,
} from '@fluentui/react-icons';

export interface CommandBarItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  /** Render as a menu button with a chevron and dropdown items */
  menuItems?: { key: string; label: string; icon?: React.ReactNode; onClick?: () => void }[];
}

export interface CommandBarGroup {
  items: CommandBarItem[];
}

export interface CommandBarProps {
  /** Primary action groups on the left. Groups are separated by dividers. */
  items?: CommandBarGroup[];
  /** Actions pushed to the far-right side of the bar */
  farItems?: CommandBarItem[];
  /** Items shown in the overflow "..." menu */
  overflowItems?: CommandBarItem[];
}

const defaultItems: CommandBarGroup[] = [
  {
    items: [
      { key: 'create', label: 'Create', icon: <Add20Regular /> },
      { key: 'refresh', label: 'Refresh', icon: <ArrowSync20Regular /> },
      { key: 'export', label: 'Export to CSV', icon: <ArrowDownload20Regular /> },
    ],
  },
];

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `0 ${tokens.spacingHorizontalS}`,
    minHeight: tokens.spacingHorizontalXXXL, // closest available token
    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    flexShrink: 0,
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0',
    overflow: 'hidden',
    flexShrink: 1,
    minWidth: 0,
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0',
    flexShrink: 0,
    marginLeft: 'auto',
  },
  toolbar: {
    padding: 0,
    minWidth: 0,
  },
  button: {
    minWidth: 'auto',
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
    height: tokens.spacingHorizontalXXXL, // closest available token
    fontSize: tokens.fontSizeBase200,
    fontWeight: 400,
    color: tokens.colorNeutralForeground2,
    borderRadius: tokens.borderRadiusMedium,
    ':hover': {
      color: tokens.colorNeutralForeground1,
      backgroundColor: tokens.colorNeutralBackground3,
    },
    ':active': {
      backgroundColor: tokens.colorNeutralBackground4,
    },
  },
  buttonDisabled: {
    color: tokens.colorNeutralForegroundDisabled,
    ':hover': {
      color: tokens.colorNeutralForegroundDisabled,
      backgroundColor: 'transparent',
    },
  },
  menuButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    minWidth: 'auto',
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
    height: tokens.spacingHorizontalXXXL, // closest available token
    fontSize: tokens.fontSizeBase200,
    fontWeight: 400,
    color: tokens.colorNeutralForeground2,
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: tokens.borderRadiusMedium,
    cursor: 'pointer',
    ':hover': {
      color: tokens.colorNeutralForeground1,
      backgroundColor: tokens.colorNeutralBackground3,
    },
    ':active': {
      backgroundColor: tokens.colorNeutralBackground4,
    },
  },
  menuButtonDisabled: {
    color: tokens.colorNeutralForegroundDisabled,
    cursor: 'default',
    ':hover': {
      color: tokens.colorNeutralForegroundDisabled,
      backgroundColor: 'transparent',
    },
  },
  chevron: {
    fontSize: tokens.fontSizeBase200,
    color: 'inherit',
  },
  overflowButton: {
    minWidth: tokens.spacingHorizontalXXXL, // closest available token
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalSNudge}`,
    height: tokens.spacingHorizontalXXXL, // closest available token
    color: tokens.colorNeutralForeground2,
    ':hover': {
      color: tokens.colorNeutralForeground1,
      backgroundColor: tokens.colorNeutralBackground3,
    },
  },
  divider: {
    height: tokens.spacingHorizontalXL, // closest available token
    margin: `0 ${tokens.spacingHorizontalXS}`,
  },
  iconSlot: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: tokens.fontSizeBase500,
    color: 'inherit',
  },
});

const CommandBarButton: React.FC<{ item: CommandBarItem; className?: string }> = ({ item, className }) => {
  const styles = useStyles();

  if (item.menuItems && item.menuItems.length > 0) {
    return (
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <button
            className={mergeClasses(
              styles.menuButton,
              item.disabled && styles.menuButtonDisabled,
              className,
            )}
            disabled={item.disabled}
            aria-label={item.label}
          >
            {item.icon && <span className={styles.iconSlot}>{item.icon}</span>}
            {item.label}
            <ChevronDown16Regular className={styles.chevron} />
          </button>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            {item.menuItems.map((mi) => (
              <MenuItem key={mi.key} {...(mi.icon ? { icon: mi.icon as React.ReactElement } : {})} onClick={mi.onClick}>
                {mi.label}
              </MenuItem>
            ))}
          </MenuList>
        </MenuPopover>
      </Menu>
    );
  }

  return (
    <ToolbarButton
      {...(item.icon ? { icon: item.icon as React.ReactElement } : {})}
      onClick={item.onClick}
      disabled={item.disabled}
      className={mergeClasses(
        styles.button,
        item.disabled && styles.buttonDisabled,
        className,
      )}
    >
      {item.label}
    </ToolbarButton>
  );
};

export const CommandBar: React.FC<CommandBarProps> = ({
  items = defaultItems,
  farItems,
  overflowItems,
}) => {
  const styles = useStyles();

  return (
    <div className={styles.root} role="toolbar" aria-label="Command bar">
      <Toolbar className={mergeClasses(styles.toolbar, styles.leftSection)} aria-label="Actions">
        {items.map((group, gi) => (
          <React.Fragment key={gi}>
            {gi > 0 && <ToolbarDivider className={styles.divider} />}
            {group.items.map((item) => (
              <CommandBarButton key={item.key} item={item} />
            ))}
          </React.Fragment>
        ))}
        {overflowItems && overflowItems.length > 0 && (
          <Menu>
            <MenuTrigger disableButtonEnhancement>
              <ToolbarButton
                icon={<MoreHorizontal20Regular />}
                className={styles.overflowButton}
                aria-label="More actions"
              />
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                {overflowItems.map((item) => (
                  <MenuItem
                    key={item.key}
                    {...(item.icon ? { icon: item.icon as React.ReactElement } : {})}
                    onClick={item.onClick}
                    disabled={item.disabled}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </MenuList>
            </MenuPopover>
          </Menu>
        )}
      </Toolbar>

      {farItems && farItems.length > 0 && (
        <div className={styles.rightSection}>
          {farItems.map((item) => (
            <CommandBarButton key={item.key} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};
