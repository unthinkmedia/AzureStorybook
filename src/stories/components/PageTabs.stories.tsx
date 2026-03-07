import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { makeStyles, Text, tokens } from '@fluentui/react-components';
import {
  Home20Regular,
  Rocket20Regular,
  Settings20Regular,
} from '@fluentui/react-icons';
import { PageTabs } from '../../components';
import type { PageTab } from '../../components';

/* ─── Styles ──────────────────────────────────────────────────── */

const useStyles = makeStyles({
  wrapper: {
    backgroundColor: tokens.colorNeutralBackground1,
    minHeight: '300px',
  },
  content: {
    padding: '24px',
  },
});

/* ─── Render helper ───────────────────────────────────────────── */

const TabContent: React.FC<{ tab: string }> = ({ tab }) => {
  const styles = useStyles();
  return (
    <div className={styles.content}>
      <Text size={400}>Content for <strong>{tab}</strong> tab</Text>
    </div>
  );
};

/* ─── Meta ────────────────────────────────────────────────────── */

const meta: Meta<typeof PageTabs> = {
  title: 'Components/PageTabs',
  component: PageTabs,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof PageTabs>;

/* ─── Stories ─────────────────────────────────────────────────── */

const defaultTabs: PageTab[] = [
  { value: 'overview', label: 'Overview' },
  { value: 'getting-started', label: 'Getting started' },
  { value: 'settings', label: 'Settings' },
];

export const Default: Story = {
  render: () => {
    const styles = useStyles();
    const [selected, setSelected] = useState('overview');

    return (
      <div className={styles.wrapper}>
        <PageTabs
          tabs={defaultTabs}
          selectedValue={selected}
          onTabSelect={setSelected}
        />
        <TabContent tab={selected} />
      </div>
    );
  },
};

export const WithIcons: Story = {
  render: () => {
    const styles = useStyles();
    const [selected, setSelected] = useState('overview');

    const tabs: PageTab[] = [
      { value: 'overview', label: 'Overview', icon: <Home20Regular /> },
      { value: 'getting-started', label: 'Getting started', icon: <Rocket20Regular /> },
      { value: 'settings', label: 'Settings', icon: <Settings20Regular /> },
    ];

    return (
      <div className={styles.wrapper}>
        <PageTabs
          tabs={tabs}
          selectedValue={selected}
          onTabSelect={setSelected}
        />
        <TabContent tab={selected} />
      </div>
    );
  },
};

export const WithDisabledTab: Story = {
  render: () => {
    const styles = useStyles();
    const [selected, setSelected] = useState('overview');

    const tabs: PageTab[] = [
      { value: 'overview', label: 'Overview' },
      { value: 'getting-started', label: 'Getting started' },
      { value: 'settings', label: 'Settings', disabled: true },
    ];

    return (
      <div className={styles.wrapper}>
        <PageTabs
          tabs={tabs}
          selectedValue={selected}
          onTabSelect={setSelected}
        />
        <TabContent tab={selected} />
      </div>
    );
  },
};
