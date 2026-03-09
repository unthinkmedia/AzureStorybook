import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  DataGrid,
  DataGridHeader,
  DataGridRow,
  DataGridHeaderCell,
  DataGridBody,
  DataGridCell,
  TableColumnDefinition,
  createTableColumn,
  Checkbox,
  Button,
  Text,
  Link,
  Dropdown,
  Option,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  Add20Regular,
  ArrowDownload20Regular,
  ArrowSync20Regular,
  CaretLeft16Regular,
  CaretRight16Regular,
  Delete20Regular,
  Edit20Regular,
  Globe20Regular,
  GroupList20Regular,
  MoreHorizontal20Regular,
  Pin20Regular,
  Save20Regular,
  Settings20Regular,
  Star20Regular,
  Tag20Regular,
} from '@fluentui/react-icons';
import { CommandBar } from '../../components';
import { FilterPill, AddFilterPill } from '../../components/FilterPill';

// ─── Styles ──────────────────────────────────────────────────────

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  filterRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
    flexWrap: 'wrap',
  },
  filterSearch: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    height: '32px',
    paddingLeft: '12px',
    paddingRight: '12px',
    borderRadius: '4px',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
    minWidth: '160px',
    cursor: 'text',
  },
  nameCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: '8px',
  },
  gridWrapper: {
    flex: 1,
    overflow: 'auto',
    minHeight: 0,
    '& [role="row"]': {
      minHeight: '44px',
    },
    '& [role="gridcell"], & [role="columnheader"]': {
      paddingTop: '10px',
      paddingBottom: '10px',
    },
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
  footerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  pageButton: {
    minWidth: '28px',
    height: '28px',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: 'transparent',
    color: tokens.colorBrandForeground1,
    fontSize: tokens.fontSizeBase200,
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  pageButtonActive: {
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    cursor: 'default',
  },
  feedbackLink: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorBrandForeground1,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  nullStateContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '64px 24px',
    minHeight: 0,
  },
  nullStateText: {
    padding: '16px 24px',
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase300,
  },
});

// ─── Data ────────────────────────────────────────────────────────

interface ResourceGroup {
  name: string;
  subscription: string;
  location: string;
}

const resourceGroups: ResourceGroup[] = [
  { name: 'aznhassan-hackathon', subscription: 'PXT Staging Cloud', location: 'East US' },
  { name: 'AzSecPackAutoConfigRG', subscription: 'PXT Staging Cloud', location: 'East US' },
  { name: 'cloud-shell-storage-westus', subscription: 'PXT Staging Cloud', location: 'West US' },
  { name: 'coherence-preview-rg', subscription: 'PXT Staging Cloud', location: 'West US 2' },
  { name: 'dashboards', subscription: 'PXT Staging Cloud', location: 'East US' },
  { name: 'DefaultResourceGroup-CUS', subscription: 'PXT Staging Cloud', location: 'Central US' },
  { name: 'DefaultResourceGroup-EUS', subscription: 'PXT Staging Cloud', location: 'East US' },
  { name: 'DefaultResourceGroup-WUS', subscription: 'PXT Staging Cloud', location: 'West US' },
  { name: 'DefaultResourceGroup-WUS2', subscription: 'PXT Staging Cloud', location: 'West US 2' },
  { name: 'FirstPartyAzureProfilerInsights', subscription: 'Internal App Insights Resources for Perflens', location: 'West US 2' },
  { name: 'Immersive-Reader-Test', subscription: 'PXT Staging Cloud', location: 'West US' },
  { name: 'jwunder-network-iso-temp', subscription: 'PXT Staging Cloud', location: 'East US' },
  { name: 'LogAnalyticsDefaultResources', subscription: 'PXT Staging Cloud', location: 'Central US' },
];

// ─── Columns ─────────────────────────────────────────────────────

const makeColumns = (selectable: boolean): TableColumnDefinition<ResourceGroup>[] => {
  const cols: TableColumnDefinition<ResourceGroup>[] = [];
  if (selectable) {
    cols.push(
      createTableColumn<ResourceGroup>({
        columnId: 'select',
        renderHeaderCell: () => <Checkbox aria-label="Select all" />,
        renderCell: () => <Checkbox aria-label="Select row" />,
      }),
    );
  }
  cols.push(
    createTableColumn<ResourceGroup>({
      columnId: 'name',
      compare: (a, b) => a.name.localeCompare(b.name),
      renderHeaderCell: () => 'Name',
      renderCell: (item) => <NameCell name={item.name} />,
    }),
    createTableColumn<ResourceGroup>({
      columnId: 'subscription',
      compare: (a, b) => a.subscription.localeCompare(b.subscription),
      renderHeaderCell: () => 'Subscription',
      renderCell: (item) => (
        <Link style={{ fontWeight: tokens.fontWeightRegular }}>{item.subscription}</Link>
      ),
    }),
    createTableColumn<ResourceGroup>({
      columnId: 'location',
      compare: (a, b) => a.location.localeCompare(b.location),
      renderHeaderCell: () => 'Location',
      renderCell: (item) => <Text>{item.location}</Text>,
    }),
  );
  return cols;
};

// ─── Name cell with context menu ─────────────────────────────────

const NameCell: React.FC<{ name: string }> = ({ name }) => {
  const styles = useStyles();
  return (
    <div className={styles.nameCell}>
      <Link style={{ fontWeight: tokens.fontWeightRegular }}>{name}</Link>
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <Button
            appearance="subtle"
            icon={<MoreHorizontal20Regular />}
            size="small"
            aria-label="More actions"
          />
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem icon={<Pin20Regular />}>Pin to dashboard</MenuItem>
            <MenuItem icon={<Star20Regular />}>Add to favorites</MenuItem>
            <MenuItem icon={<Tag20Regular />}>Edit tags</MenuItem>
            <MenuItem icon={<Globe20Regular />}>Open in mobile</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
    </div>
  );
};

// ─── Command bar items ───────────────────────────────────────────

const browseCommandBarItems = [
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
];

const browseFarItems = [
  {
    key: 'group-by',
    label: 'Group by',
    icon: <GroupList20Regular />,
    menuItems: [
      { key: 'none', label: 'None' },
      { key: 'type', label: 'Type' },
      { key: 'resource-group', label: 'Resource group' },
      { key: 'location', label: 'Location' },
    ],
  },
  { key: 'settings', label: 'Settings', icon: <Settings20Regular /> },
];

// ─── Footer component ────────────────────────────────────────────

const BrowseFooter: React.FC<{
  start: number;
  end: number;
  total: number;
  currentPage?: number;
  totalPages?: number;
}> = ({ start, end, total, currentPage = 1, totalPages = 1 }) => {
  const styles = useStyles();
  return (
    <div className={styles.footer}>
      <div className={styles.footerLeft}>
        <Text size={200}>
          Showing {start} - {end} of {total}.
        </Text>
        <Text size={200}>Display count:</Text>
        <Dropdown size="small" defaultValue="auto" style={{ minWidth: 64 }}>
          <Option>auto</Option>
          <Option>10</Option>
          <Option>25</Option>
          <Option>50</Option>
        </Dropdown>
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button className={styles.pageButton} aria-label="Previous page">
              <CaretLeft16Regular />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`${styles.pageButton} ${currentPage === i + 1 ? styles.pageButtonActive : ''}`}
                aria-label={`Page ${i + 1}`}
                aria-current={currentPage === i + 1 ? 'page' : undefined}
              >
                {i + 1}
              </button>
            ))}
            <button className={styles.pageButton} aria-label="Next page">
              <CaretRight16Regular />
            </button>
          </div>
        )}
      </div>
      <Link className={styles.feedbackLink}>Give feedback</Link>
    </div>
  );
};

// ─── ResourceListPage component ─────────────────────────────────

interface ResourceListPageProps {
  showFilters?: boolean;
  showCheckboxes?: boolean;
  items?: ResourceGroup[];
}

const ResourceListPage: React.FC<ResourceListPageProps> = ({
  showFilters = true,
  showCheckboxes = true,
  items = resourceGroups,
}) => {
  const styles = useStyles();
  const columns = makeColumns(showCheckboxes);
  const hasItems = items.length > 0;

  return (
    <div className={styles.page}>
      <CommandBar items={browseCommandBarItems} farItems={browseFarItems} />

      {showFilters && (
        <div className={styles.filterRow}>
          <div className={styles.filterSearch}>
            <Text size={200}>Filter for any field…</Text>
          </div>
          <FilterPill label="Subscription" value="17 selected" />
          <FilterPill label="Location" value="all" dismissible />
          <AddFilterPill />
        </div>
      )}

      {hasItems ? (
        <div className={styles.gridWrapper}>
          <DataGrid
            items={items}
            columns={columns}
            sortable
            resizableColumns
            columnSizingOptions={{
              select: { idealWidth: 32, minWidth: 32 },
              name: { idealWidth: 280, minWidth: 150 },
              subscription: { idealWidth: 280, minWidth: 150 },
              location: { idealWidth: 160, minWidth: 100 },
            }}
            getRowId={(item) => item.name}
          >
            <DataGridHeader>
              <DataGridRow>
                {({ renderHeaderCell }) => (
                  <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                )}
              </DataGridRow>
            </DataGridHeader>
            <DataGridBody<ResourceGroup>>
              {({ item, rowId }) => (
                <DataGridRow<ResourceGroup> key={rowId}>
                  {({ renderCell }) => (
                    <DataGridCell>{renderCell(item)}</DataGridCell>
                  )}
                </DataGridRow>
              )}
            </DataGridBody>
          </DataGrid>
        </div>
      ) : (
        <div className={styles.nullStateText}>
          <Text size={300}>You do not have any resource groups.</Text>
        </div>
      )}

      <BrowseFooter
        start={hasItems ? 1 : 1}
        end={hasItems ? items.length : 0}
        total={hasItems ? 28 : 0}
        currentPage={1}
        totalPages={hasItems ? 3 : 0}
      />
    </div>
  );
};

// ─── Stories ─────────────────────────────────────────────────────

const meta: Meta<ResourceListPageProps> = {
  title: 'Templates/Resource List Page',
  component: ResourceListPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Full-page resource list template combining CommandBar, FilterPill row, sortable DataGrid with row actions and checkboxes, and a pagination footer. Use this when building a browse blade for any Azure resource type — resource groups, VMs, storage accounts, etc.',
      },
    } },
  argTypes: {
    showFilters: { control: 'boolean' },
    showCheckboxes: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<ResourceListPageProps>;

/** Resource list page — command bar, filter pills, sortable data grid with checkboxes, and footer with pagination. */
export const Default: Story = {
  args: {
    showFilters: true,
    showCheckboxes: true,
  },

  parameters: {
    docs: {
      description: {
        story:
          'Full resource group browse page with command bar, filter pills, sortable DataGrid with checkboxes and row actions, and pagination footer.',
      },
    },
  },
};

/** Without filter pills — just command bar, data grid, and footer. */
export const WithoutFilters: Story = {
  args: {
    showFilters: false,
    showCheckboxes: true,
  },
};

/** Without row checkboxes. */
export const WithoutCheckboxes: Story = {
  args: {
    showFilters: true,
    showCheckboxes: false,
  },
};

/** Empty state with inline text message (no illustration). */
export const NullStateText: Story = {
  args: {
    showFilters: false,
    showCheckboxes: false,
    items: [],
  },
};
