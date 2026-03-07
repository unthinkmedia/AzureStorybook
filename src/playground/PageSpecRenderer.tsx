/**
 * PageSpecRenderer — renders a PageSpec JSON into live Azure Portal UI
 * using the existing Storybook components.
 */
import React, { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardHeader,
  Checkbox,
  DataGrid,
  DataGridHeader,
  DataGridRow,
  DataGridHeaderCell,
  DataGridBody,
  DataGridCell,
  Dropdown,
  Input,
  Link,
  MessageBar,
  MessageBarBody,
  MessageBarActions,
  Option,
  RadioGroup,
  Radio,
  Switch,
  Text,
  createTableColumn,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import type { TableColumnDefinition } from '@fluentui/react-components';
import {
  Add20Regular,
  ArrowSync20Regular,
  ChevronDown20Regular,
  ChevronRight20Regular,
  MoreHorizontal20Regular,
  Search20Regular,
  Star20Regular,
} from '@fluentui/react-icons';
import { AzureBreadcrumb, PageHeader, CommandBar, SideNavigation, PageTabs } from '../components';
import { FilterPill, AddFilterPill } from '../components/FilterPill';
import type {
  PageSpec,
  BodyTemplate,
  DataGridBody as DataGridBodySpec,
  CardGridBody as CardGridBodySpec,
  SettingsFormBody,
  LandingPageBody,
  DiagnosticsBody,
  MarketingBody,
  DashboardBody,
} from './types';

// ─── Styles ──────────────────────────────────────────────────────

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: tokens.colorNeutralBackground2,
    overflow: 'hidden',
  },
  headerSection: {
    flexShrink: 0,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  body: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  sideNav: {
    flexShrink: 0,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    overflowY: 'auto',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    padding: '16px',
    gap: '16px',
  },
  contentFull: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  },
  gridWrapper: {
    flex: 1,
    overflow: 'auto',
    '& [role="row"]': { minHeight: '44px' },
    '& [role="gridcell"], & [role="columnheader"]': {
      paddingTop: '10px',
      paddingBottom: '10px',
    },
  },
  cardGrid: {
    display: 'grid',
    gap: '16px',
    padding: '0',
  },
  sectionHeading: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    marginBottom: '4px',
  },
  sectionSubtitle: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    marginBottom: '12px',
  },
  formSection: {
    padding: '16px 0',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  formField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '8px 0',
  },
  landingCenter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    padding: '48px 32px',
  },
  landingCards: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  landingCard: {
    width: '280px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  diagBanner: {
    padding: '24px 32px',
    backgroundColor: tokens.colorNeutralBackground3,
    borderTop: `4px solid ${tokens.colorBrandBackground}`,
  },
  alertCard: {
    padding: '12px 16px',
    borderLeft: '3px solid',
  },
  marketingHero: {
    textAlign: 'center' as const,
    padding: '48px 32px',
  },
  benefitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '16px',
    padding: '16px',
  },
  dashboardGrid: {
    display: 'grid',
    gap: '16px',
    padding: '16px',
  },
  widgetCard: {
    padding: '16px',
    minHeight: '120px',
  },
  empty: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '64px',
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase400,
    fontStyle: 'italic',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 16px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    flexShrink: 0,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
  formActions: {
    display: 'flex',
    gap: '8px',
    padding: '16px 0',
  },
});

// ─── Body Template Renderers ─────────────────────────────────────

const DataGridRenderer: React.FC<{ spec: DataGridBodySpec }> = ({ spec }) => {
  const styles = useStyles();
  const columns: TableColumnDefinition<Record<string, string>>[] = spec.columns.map((col) =>
    createTableColumn({
      columnId: col.key,
      compare: col.sortable !== false ? (a, b) => (a[col.key] ?? '').localeCompare(b[col.key] ?? '') : undefined,
      renderHeaderCell: () => col.label,
      renderCell: (item) => {
        const val = item[col.key] ?? '';
        if (col.badge_color_map && col.badge_color_map[val]) {
          return <Badge appearance="filled" color={col.badge_color_map[val]}>{val}</Badge>;
        }
        if (col.is_link) {
          return <Link>{val}</Link>;
        }
        return val;
      },
    })
  );

  const rows = (spec.rows ?? []).map((r) => r.cells);

  return (
    <div className={styles.contentFull}>
      <div className={styles.gridWrapper}>
        <DataGrid items={rows} columns={columns} sortable>
          <DataGridHeader>
            <DataGridRow>
              {({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}
            </DataGridRow>
          </DataGridHeader>
          <DataGridBody<Record<string, string>>>
            {({ item, rowId }) => (
              <DataGridRow<Record<string, string>> key={rowId}>
                {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
              </DataGridRow>
            )}
          </DataGridBody>
        </DataGrid>
      </div>
      {spec.pagination && (
        <div className={styles.footer}>
          <span>{spec.total_count ? `${rows.length} of ${spec.total_count} items` : `${rows.length} items`}</span>
        </div>
      )}
    </div>
  );
};

const CardGridRenderer: React.FC<{ spec: CardGridBodySpec }> = ({ spec }) => {
  const styles = useStyles();
  return (
    <div className={styles.content}>
      {spec.sections.map((section) => (
        <div key={section.title}>
          <Text className={styles.sectionHeading} block>{section.title}</Text>
          {section.subtitle && <Text className={styles.sectionSubtitle} block>{section.subtitle}</Text>}
          <div
            className={styles.cardGrid}
            style={{ gridTemplateColumns: `repeat(${section.columns ?? 3}, 1fr)` }}
          >
            {section.cards.map((card) => (
              <Card key={card.title}>
                <CardHeader
                  header={<Text weight="semibold">{card.title}</Text>}
                  description={card.description}
                  action={
                    card.badge ? (
                      <Badge appearance="filled" color={card.badge_color ?? 'informative'}>
                        {card.badge}
                      </Badge>
                    ) : undefined
                  }
                />
                {card.metrics && (
                  <div style={{ display: 'flex', gap: '16px', padding: '8px 12px' }}>
                    {Object.entries(card.metrics).map(([k, v]) => (
                      <div key={k} style={{ textAlign: 'center' }}>
                        <Text size={200} block>{k}</Text>
                        <Text weight="semibold" size={500}>{v}</Text>
                      </div>
                    ))}
                  </div>
                )}
                {card.actions && card.actions.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', padding: '8px 12px' }}>
                    {card.actions.map((a) => (
                      <Link key={a.label}>{a.label}</Link>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const SettingsFormRenderer: React.FC<{ spec: SettingsFormBody }> = ({ spec }) => {
  const styles = useStyles();
  return (
    <div className={styles.content}>
      {spec.sections.map((section) => (
        <div key={section.title} className={styles.formSection}>
          <Text className={styles.sectionHeading} block>{section.title}</Text>
          {section.learn_more_link && <Link>Learn more</Link>}
          {section.fields.map((field) => (
            <div key={field.label} className={styles.formField}>
              {field.type === 'toggle' && (
                <Switch label={field.label} checked={field.value === 'Yes'} disabled={field.disabled} />
              )}
              {field.type === 'radio_group' && (
                <>
                  <Text weight="semibold" size={300}>{field.label}</Text>
                  {field.description && <Text size={200}>{field.description}</Text>}
                  <RadioGroup defaultValue={field.options?.find((o) => o.is_default)?.value}>
                    {(field.options ?? []).map((opt) => (
                      <Radio key={opt.value} value={opt.value} label={opt.label} disabled={field.disabled} />
                    ))}
                  </RadioGroup>
                </>
              )}
              {field.type === 'checkbox' && (
                <Checkbox label={field.label} disabled={field.disabled} />
              )}
              {field.type === 'text_input' && (
                <>
                  <Text weight="semibold" size={300}>{field.label}</Text>
                  <Input defaultValue={field.value ?? ''} disabled={field.disabled} />
                </>
              )}
              {field.type === 'dropdown' && (
                <>
                  <Text weight="semibold" size={300}>{field.label}</Text>
                  <Dropdown placeholder={field.description ?? 'Select'} disabled={field.disabled}>
                    {(field.options ?? []).map((opt) => (
                      <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                    ))}
                  </Dropdown>
                </>
              )}
            </div>
          ))}
        </div>
      ))}
      {spec.show_save_cancel !== false && (
        <div className={styles.formActions}>
          <Button appearance="primary">Save</Button>
          <Button>Cancel</Button>
        </div>
      )}
    </div>
  );
};

const LandingPageRenderer: React.FC<{ spec: LandingPageBody }> = ({ spec }) => {
  const styles = useStyles();
  return (
    <div className={styles.landingCenter}>
      <Text size={700} weight="semibold">{spec.heading}</Text>
      {spec.learn_more_link && <Link>Learn more</Link>}
      <div className={styles.landingCards} style={{ flexDirection: spec.layout === 'stacked' ? 'column' : 'row' }}>
        {spec.cards.map((card) => (
          <Card key={card.title} className={styles.landingCard}>
            {card.illustration && (
              <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', color: tokens.colorNeutralForeground3, fontSize: tokens.fontSizeBase200, fontStyle: 'italic' }}>
                [{card.illustration}]
              </div>
            )}
            <Text weight="semibold" size={400}>{card.title}</Text>
            {card.description && <Text size={200}>{card.description}</Text>}
            {card.actions?.map((a) => (
              <Button key={a.label} appearance={a.variant === 'primary' ? 'primary' : a.variant === 'outline' ? 'outline' : 'secondary'}>
                {a.label}
              </Button>
            ))}
          </Card>
        ))}
      </div>
    </div>
  );
};

const DiagnosticsRenderer: React.FC<{ spec: DiagnosticsBody }> = ({ spec }) => {
  const styles = useStyles();
  return (
    <div className={styles.contentFull}>
      <div className={styles.diagBanner}>
        <Text size={500} weight="semibold" block>{spec.search_heading}</Text>
        <Input
          placeholder={spec.search_placeholder}
          contentBefore={<Search20Regular />}
          style={{ marginTop: 12, width: '100%', maxWidth: 500 }}
        />
        {spec.info_note && <Text size={200} style={{ marginTop: 8, display: 'block' }}>{spec.info_note}</Text>}
      </div>
      <div className={styles.content}>
        {spec.alert_section_title && <Text className={styles.sectionHeading} block>{spec.alert_section_title}</Text>}
        {(spec.alerts ?? []).map((alert) => (
          <Card key={alert.title} className={styles.alertCard} style={{ borderLeftColor: alert.severity === 'error' ? tokens.colorPaletteRedBorderActive : alert.severity === 'warning' ? tokens.colorPaletteYellowBorderActive : tokens.colorBrandStroke1 }}>
            <Text weight="semibold">{alert.title}</Text>
            <Text size={200}>{alert.description}</Text>
            {alert.action_label && <Link>{alert.action_label}</Link>}
          </Card>
        ))}
      </div>
    </div>
  );
};

const MarketingRenderer: React.FC<{ spec: MarketingBody }> = ({ spec }) => {
  const styles = useStyles();
  return (
    <div className={styles.contentFull}>
      <div className={styles.marketingHero}>
        <Text size={800} weight="bold" block>{spec.hero_heading}</Text>
        <Text size={400} block style={{ marginTop: 12, maxWidth: 600, margin: '12px auto 0' }}>{spec.hero_description}</Text>
      </div>
      {spec.benefits_heading && <Text className={styles.sectionHeading} style={{ padding: '0 16px' }} block>{spec.benefits_heading}</Text>}
      <div className={styles.benefitsGrid}>
        {(spec.benefits ?? []).map((b) => (
          <Card key={b.title}>
            <CardHeader header={<Text weight="semibold">{b.title}</Text>} description={b.description} />
          </Card>
        ))}
      </div>
      {spec.upsell_banner && (
        <MessageBar intent="info" style={{ margin: 16 }}>
          <MessageBarBody>{spec.upsell_banner}</MessageBarBody>
        </MessageBar>
      )}
    </div>
  );
};

const DashboardRenderer: React.FC<{ spec: DashboardBody }> = ({ spec }) => {
  const styles = useStyles();
  return (
    <div className={styles.content}>
      <Text size={600} weight="semibold">{spec.dashboard_name}</Text>
      <div className={styles.dashboardGrid} style={{ gridTemplateColumns: `repeat(${spec.grid_columns ?? 3}, 1fr)` }}>
        {spec.widgets.map((w) => (
          <Card
            key={w.title}
            className={styles.widgetCard}
            style={{ gridColumn: `span ${w.col_span ?? 1}`, gridRow: `span ${w.row_span ?? 1}` }}
          >
            <CardHeader header={<Text weight="semibold">{w.title}</Text>} description={w.widget_type} />
            {w.items?.map((item, i) => (
              <Text key={i} size={200} block style={{ padding: '2px 12px' }}>
                {Object.values(item).join(' — ')}
              </Text>
            ))}
          </Card>
        ))}
      </div>
    </div>
  );
};

// ─── Body Router ─────────────────────────────────────────────────

const BodyRenderer: React.FC<{ body: BodyTemplate }> = ({ body }) => {
  switch (body.template) {
    case 'data_grid': return <DataGridRenderer spec={body} />;
    case 'card_grid': return <CardGridRenderer spec={body} />;
    case 'settings_form': return <SettingsFormRenderer spec={body} />;
    case 'landing_page': return <LandingPageRenderer spec={body} />;
    case 'diagnostics': return <DiagnosticsRenderer spec={body} />;
    case 'marketing': return <MarketingRenderer spec={body} />;
    case 'dashboard': return <DashboardRenderer spec={body} />;
    default: return <div>Unknown template</div>;
  }
};

// ─── Main Renderer ───────────────────────────────────────────────

export const PageSpecRenderer: React.FC<{ spec: PageSpec | null }> = ({ spec }) => {
  const styles = useStyles();
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);

  if (!spec) {
    return (
      <div className={styles.empty}>
        Describe an Azure page in the chat to see a live preview here.
      </div>
    );
  }

  const breadcrumbItems = spec.breadcrumb.items.map((item) => ({
    label: item.label,
    current: item.is_current,
  }));

  const sideNavItems = spec.side_nav?.items.map((item, i) => ({
    key: `nav-${i}`,
    label: item.label ?? '',
    selected: item.is_selected,
    children: item.children?.map((c, j) => ({ key: `nav-${i}-${j}`, label: c.label ?? '' })),
  })) ?? [];

  const commandBarGroups = spec.command_bar ? [{
    items: spec.command_bar.actions
      .filter((a) => a.is_primary)
      .map((a) => ({ key: a.label, label: a.label, disabled: a.disabled })),
  }] : undefined;

  const commandBarFarItems = spec.command_bar?.actions
    .filter((a) => !a.is_primary)
    .map((a) => ({ key: a.label, label: a.label, disabled: a.disabled })) ?? [];

  const currentTab = activeTab ?? spec.body.tabs_spec?.default_tab;

  // Determine which body to render
  let activeBody: BodyTemplate | null = null;
  if (spec.body.has_tabs && spec.body.tab_bodies && currentTab) {
    activeBody = spec.body.tab_bodies.find((tb) => tb.tab_value === currentTab)?.body ?? null;
  } else {
    activeBody = spec.body.direct_body ?? null;
  }

  return (
    <div className={styles.page}>
      {/* Header section */}
      <div className={styles.headerSection}>
        <AzureBreadcrumb items={breadcrumbItems} />
        <PageHeader
          title={spec.page_header.title}
          subtitle={spec.page_header.subtitle ?? undefined}
          onPin={spec.page_header.show_star ? () => {} : undefined}
          onMore={spec.page_header.show_more_actions ? () => {} : undefined}
          copilotSuggestions={
            spec.page_header.copilot_suggestions && spec.page_header.copilot_suggestions.length > 0
              ? { suggestions: spec.page_header.copilot_suggestions.map((s) => ({ label: s.label })) }
              : undefined
          }
        />
      </div>

      {/* Info banner */}
      {spec.info_banner && (
        <MessageBar intent={spec.info_banner.intent}>
          <MessageBarBody>{spec.info_banner.message}</MessageBarBody>
          {spec.info_banner.action_label && (
            <MessageBarActions>
              <Link>{spec.info_banner.action_label}</Link>
            </MessageBarActions>
          )}
        </MessageBar>
      )}

      {/* Command bar */}
      {spec.command_bar && (
        <CommandBar
          items={commandBarGroups}
          farItems={commandBarFarItems}
        />
      )}

      {/* Filter bar */}
      {spec.filter_bar && (
        <div style={{ display: 'flex', gap: 8, padding: '8px 16px', borderBottom: `1px solid ${tokens.colorNeutralStroke2}`, flexWrap: 'wrap', alignItems: 'center' }}>
          <Input
            placeholder={spec.filter_bar.search_placeholder ?? 'Filter...'}
            contentBefore={<Search20Regular />}
            size="small"
            style={{ minWidth: 160 }}
          />
          {(spec.filter_bar.active_filters ?? []).map((f) => (
            <FilterPill key={`${f.field}-${f.value}`} label={f.field} value={f.value} />
          ))}
          <AddFilterPill />
        </div>
      )}

      {/* Tabs */}
      {spec.body.has_tabs && spec.body.tabs_spec && (
        <PageTabs
          tabs={spec.body.tabs_spec.tabs.map((t) => ({
            value: t.value,
            label: t.label,
            disabled: t.disabled,
          }))}
          selectedValue={currentTab ?? spec.body.tabs_spec.default_tab}
          onTabSelect={(v) => setActiveTab(v)}
        />
      )}

      {/* Body */}
      <div className={styles.body}>
        {spec.layout === 'side_panel' && sideNavItems.length > 0 && (
          <div className={styles.sideNav} style={{ width: spec.side_nav?.width_px ?? 220 }}>
            <SideNavigation items={sideNavItems} />
          </div>
        )}
        {activeBody ? <BodyRenderer body={activeBody} /> : <div className={styles.empty}>No body content defined</div>}
      </div>
    </div>
  );
};
