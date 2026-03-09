import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CommandBar } from '../../components';
import {
  Add20Regular,
  ArrowDownload20Regular,
  ArrowSync20Regular,
  Delete20Regular,
  Edit20Regular,
  GroupList20Regular,
  MoreHorizontal20Regular,
  Save20Regular,
  Settings20Regular,
  Share20Regular,
} from '@fluentui/react-icons';

export default {
  title: 'Composed/CommandBar',
  component: CommandBar,
  tags: ['autodocs'],
  argTypes: {
    items: { control: 'object', description: 'Array of action groups, each with an array of action items' },
    farItems: { control: 'object', description: 'Actions pushed to the right edge of the bar' },
    overflowItems: { control: 'object', description: 'Actions collected into a "…" overflow menu' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Azure Portal-style command bar with grouped actions, dividers, dropdown menus, overflow, far-side items, and disabled states. Use this when you need a toolbar above a data grid or content area that provides contextual actions like Add, Edit, Delete, Refresh, Export.',
      },
    },
  },
} satisfies Meta<typeof CommandBar>;

type Story = StoryObj<typeof CommandBar>;

/** Minimal command bar with a single group of actions — no dividers, no far items. */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Minimal command bar with a single action group. No dividers, far items, or overflow — the simplest possible toolbar configuration.',
      },
    },
  },
};

/** Two action groups separated by a vertical divider to visually distinguish
 *  primary actions from secondary/contextual actions. */
export const WithDivider: Story = {
  args: {
    items: [
      {
        items: [
          { key: 'add', label: 'Add', icon: <Add20Regular /> },
          { key: 'edit', label: 'Edit', icon: <Edit20Regular /> },
          { key: 'refresh', label: 'Refresh', icon: <ArrowSync20Regular /> },
        ],
      },
      {
        items: [
          { key: 'delete', label: 'Delete', icon: <Delete20Regular /> },
          { key: 'export', label: 'Export', icon: <ArrowDownload20Regular /> },
        ],
      },
    ],
  },
};

/** Far-side items pushed to the right edge of the bar, useful for view
 *  toggles, grouping controls, or settings that apply globally. */
export const WithFarItems: Story = {
  args: {
    items: [
      {
        items: [
          { key: 'add', label: 'Add', icon: <Add20Regular /> },
          { key: 'refresh', label: 'Refresh', icon: <ArrowSync20Regular /> },
          { key: 'export', label: 'Export', icon: <ArrowDownload20Regular /> },
        ],
      },
    ],
    farItems: [
      { key: 'settings', label: 'Settings', icon: <Settings20Regular /> },
      {
        key: 'group-by',
        label: 'Group by',
        icon: <GroupList20Regular />,
        menuItems: [
          { key: 'none', label: 'None' },
          { key: 'type', label: 'Type' },
          { key: 'category', label: 'Category' },
        ],
      },
    ],
  },
};

/** Dropdown menus on buttons, shown with a chevron indicator. Mix of
 *  regular buttons and menu buttons in one bar. */
export const WithDropdownMenus: Story = {
  args: {
    items: [
      {
        items: [
          { key: 'add', label: 'Add', icon: <Add20Regular /> },
          {
            key: 'save',
            label: 'Save',
            icon: <Save20Regular />,
            menuItems: [
              { key: 'save-current', label: 'Save current' },
              { key: 'save-as', label: 'Save as…' },
              { key: 'save-copy', label: 'Save a copy' },
            ],
          },
          {
            key: 'share',
            label: 'Share',
            icon: <Share20Regular />,
            menuItems: [
              { key: 'link', label: 'Copy link' },
              { key: 'email', label: 'Email' },
              { key: 'export', label: 'Export' },
            ],
          },
          { key: 'refresh', label: 'Refresh', icon: <ArrowSync20Regular /> },
        ],
      },
    ],
  },
};

/** Overflow menu collects less-used actions behind a "…" button, keeping the
 *  bar compact when space is tight. */
export const WithOverflow: Story = {
  args: {
    items: [
      {
        items: [
          { key: 'add', label: 'Add', icon: <Add20Regular /> },
          { key: 'edit', label: 'Edit', icon: <Edit20Regular /> },
          { key: 'refresh', label: 'Refresh', icon: <ArrowSync20Regular /> },
        ],
      },
    ],
    overflowItems: [
      { key: 'share', label: 'Share', icon: <Share20Regular /> },
      { key: 'export', label: 'Export', icon: <ArrowDownload20Regular /> },
      { key: 'settings', label: 'Settings', icon: <Settings20Regular /> },
    ],
  },
};

/** Some actions are disabled to indicate they require a precondition
 *  (e.g. selecting an item first). */
export const WithDisabledItems: Story = {
  args: {
    items: [
      {
        items: [
          { key: 'add', label: 'Add', icon: <Add20Regular /> },
          { key: 'refresh', label: 'Refresh', icon: <ArrowSync20Regular /> },
        ],
      },
      {
        items: [
          { key: 'edit', label: 'Edit', icon: <Edit20Regular />, disabled: true },
          { key: 'delete', label: 'Delete', icon: <Delete20Regular />, disabled: true },
        ],
      },
    ],
  },
};

/** Full-featured bar combining dividers, dropdown menus, overflow, far items,
 *  and disabled states in a single composition. */
export const KitchenSink: Story = {
  args: {
    items: [
      {
        items: [
          { key: 'add', label: 'Add', icon: <Add20Regular /> },
          {
            key: 'save',
            label: 'Save',
            icon: <Save20Regular />,
            menuItems: [
              { key: 'save-current', label: 'Save current' },
              { key: 'save-as', label: 'Save as…' },
            ],
          },
          { key: 'refresh', label: 'Refresh', icon: <ArrowSync20Regular /> },
          { key: 'export', label: 'Export', icon: <ArrowDownload20Regular /> },
        ],
      },
      {
        items: [
          { key: 'edit', label: 'Edit', icon: <Edit20Regular />, disabled: true },
          { key: 'delete', label: 'Delete', icon: <Delete20Regular />, disabled: true },
        ],
      },
    ],
    farItems: [
      {
        key: 'group-by',
        label: 'Group by',
        icon: <GroupList20Regular />,
        menuItems: [
          { key: 'none', label: 'None' },
          { key: 'type', label: 'Type' },
          { key: 'category', label: 'Category' },
        ],
      },
      { key: 'settings', label: 'Settings', icon: <Settings20Regular /> },
    ],
    overflowItems: [
      { key: 'share', label: 'Share' },
      { key: 'feedback', label: 'Give feedback' },
    ],
  },
};
