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
  Badge,
  Button,
  Text,
  tokens,
} from '@fluentui/react-components';
import { Open24Regular, MoreHorizontal24Regular } from '@fluentui/react-icons';

interface AzureResource {
  name: string;
  type: string;
  resourceGroup: string;
  location: string;
  status: 'Running' | 'Stopped' | 'Deallocated' | 'Creating';
}

const items: AzureResource[] = [
  { name: 'my-web-app', type: 'App Service', resourceGroup: 'prod-rg', location: 'East US', status: 'Running' },
  { name: 'api-func', type: 'Function App', resourceGroup: 'prod-rg', location: 'East US', status: 'Running' },
  { name: 'dev-vm-01', type: 'Virtual Machine', resourceGroup: 'dev-rg', location: 'West US 2', status: 'Running' },
  { name: 'test-vm-02', type: 'Virtual Machine', resourceGroup: 'test-rg', location: 'West US 2', status: 'Stopped' },
  { name: 'staging-db', type: 'SQL Database', resourceGroup: 'staging-rg', location: 'Central US', status: 'Running' },
  { name: 'cache-redis', type: 'Redis Cache', resourceGroup: 'prod-rg', location: 'East US', status: 'Running' },
  { name: 'build-vm', type: 'Virtual Machine', resourceGroup: 'ci-rg', location: 'East US 2', status: 'Deallocated' },
  { name: 'new-app', type: 'Container App', resourceGroup: 'dev-rg', location: 'West US 3', status: 'Creating' },
];

const statusColor = (status: AzureResource['status']): 'success' | 'danger' | 'warning' | 'informative' => {
  switch (status) {
    case 'Running': return 'success';
    case 'Stopped': return 'danger';
    case 'Deallocated': return 'warning';
    case 'Creating': return 'informative';
  }
};

const columns: TableColumnDefinition<AzureResource>[] = [
  createTableColumn<AzureResource>({
    columnId: 'name',
    compare: (a, b) => a.name.localeCompare(b.name),
    renderHeaderCell: () => 'Name',
    renderCell: (item) => (
      <Button appearance="transparent" style={{ padding: 0, minWidth: 0 }}>
        <Text weight="semibold" style={{ color: tokens.colorBrandForeground1 }}>{item.name}</Text>
      </Button>
    ),
  }),
  createTableColumn<AzureResource>({
    columnId: 'type',
    compare: (a, b) => a.type.localeCompare(b.type),
    renderHeaderCell: () => 'Type',
    renderCell: (item) => item.type,
  }),
  createTableColumn<AzureResource>({
    columnId: 'resourceGroup',
    compare: (a, b) => a.resourceGroup.localeCompare(b.resourceGroup),
    renderHeaderCell: () => 'Resource group',
    renderCell: (item) => item.resourceGroup,
  }),
  createTableColumn<AzureResource>({
    columnId: 'location',
    compare: (a, b) => a.location.localeCompare(b.location),
    renderHeaderCell: () => 'Location',
    renderCell: (item) => item.location,
  }),
  createTableColumn<AzureResource>({
    columnId: 'status',
    compare: (a, b) => a.status.localeCompare(b.status),
    renderHeaderCell: () => 'Status',
    renderCell: (item) => (
      <Badge appearance="filled" color={statusColor(item.status)}>
        {item.status}
      </Badge>
    ),
  }),
  createTableColumn<AzureResource>({
    columnId: 'actions',
    renderHeaderCell: () => '',
    renderCell: () => (
      <div style={{ display: 'flex', gap: tokens.spacingHorizontalXS }}>
        <Button appearance="subtle" icon={<Open24Regular />} size="small" aria-label="Open" />
        <Button appearance="subtle" icon={<MoreHorizontal24Regular />} size="small" aria-label="More" />
      </div>
    ),
  }),
];

const meta: Meta<typeof DataGrid> = {
  title: 'Components/DataGrid',
  component: DataGrid,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof DataGrid>;

/** Sortable grid with linked names, status badges, and row actions. */
export const Default: Story = {
  render: () => (
    <DataGrid items={items} columns={columns} sortable getRowId={(item) => item.name}>
      <DataGridHeader>
        <DataGridRow>
          {({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}
        </DataGridRow>
      </DataGridHeader>
      <DataGridBody<AzureResource>>
        {({ item, rowId }) => (
          <DataGridRow<AzureResource> key={rowId}>
            {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
          </DataGridRow>
        )}
      </DataGridBody>
    </DataGrid>
  ),
};
