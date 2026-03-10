/**
 * Re-export Fluent UI DataGrid components for convenience.
 *
 * These are standard Fluent UI v9 DataGrid components — no custom wrapper needed.
 * They are re-exported here so consumers can import everything from a single package.
 *
 * @example
 * ```tsx
 * import { DataGrid, DataGridHeader, DataGridRow, DataGridHeaderCell, DataGridBody, DataGridCell, createTableColumn } from '@azure-fluent-storybook/components';
 * ```
 */
export {
  DataGrid,
  DataGridHeader,
  DataGridRow,
  DataGridHeaderCell,
  DataGridBody,
  DataGridCell,
  createTableColumn,
} from '@fluentui/react-components';

export type {
  DataGridProps,
  TableColumnDefinition,
} from '@fluentui/react-components';
