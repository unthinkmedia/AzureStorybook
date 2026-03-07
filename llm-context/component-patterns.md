# Component Patterns — Azure Portal

## Page Layout Hierarchy
```
AzureBreadcrumb    (Home > Subscription > Resource Group > Resource)
PageTitleBar       (Icon + Title + Star + More + Copilot Suggestions)
CommandBar         (Create | Edit | Delete || Refresh | Export | Filter | Columns)
FilterBar          (SearchBox + Dropdown filters + Active filter tags)
DataGrid           (Sortable columns with resource data)
```

## Composed Components (src/components/)

### AzureBreadcrumb
- Fluent `Breadcrumb` with Home icon
- Used at top of every page

### PageTitleBar
- Resource name/page title with icon, star, more-actions
- Optional Copilot suggestion pills (Tag components)

### CommandBar
- Fluent `Toolbar` with primary + secondary action groups
- Primary: Create, Edit, Delete
- Secondary: Refresh, Export, Filter, Columns

### FilterBar
- SearchBox + Dropdown filters + active filter TagGroup
- Sits between CommandBar and DataGrid

## Azure-Specific Patterns

### Resource Status
Always use Badge with semantic colors:
- Running → `color="success"`
- Stopped → `color="danger"`
- Deallocated → `color="warning"`
- Creating → `color="informative"`

### Resource Names as Links
Resource names in grids use brand-colored text (`#0f6cbd`) to indicate clickability.

### KPI / Hero Cards
Use Card with large numeric display, caption label, trend indicator.

### Card Grids
`grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))` with 16px gap.
