# Fluent UI React v9 — Component Catalog for Azure Storybook

This reference lists all Fluent v9 components available for building Azure Portal-styled UI, organized by category with usage guidance.

Source: `@fluentui/react-components` v9 — https://fluent2.microsoft.design/components/web/react/

## Layout & Structure

### FluentProvider
**Wraps the app to provide theme tokens.** Storybook's `.storybook/preview.tsx` already applies the Azure theme — no need to add in individual stories.
```tsx
import { FluentProvider } from '@fluentui/react-components';
import { azureLightTheme } from '@/themes';
<FluentProvider theme={azureLightTheme}>...</FluentProvider>
```

### Card
**Container for related content.** In Azure Portal: resource cards, KPI tiles, info panels.
```tsx
import { Card, CardHeader, CardFooter, CardPreview } from '@fluentui/react-components';
```
Key patterns:
- Resource cards: `CardHeader` with title + description, body with metrics
- KPI cards: Large `Text` number + caption + Badge trend
- Interactive cards: `onClick` + `cursor: pointer` + hover shadow

### Divider
**Visual separator between sections.**
```tsx
import { Divider } from '@fluentui/react-components';
<Divider />       // horizontal
<Divider vertical />
```

### Drawer
**Slide-in side panel for detail views, settings, etc.**
```tsx
import { Drawer, DrawerBody, DrawerHeader, DrawerHeaderTitle } from '@fluentui/react-components';
```

## Navigation

### Breadcrumb
**Shows the current location in hierarchy.** Azure Portal always has breadcrumbs. Use the composed `AzureBreadcrumb` from `src/components/`.
```tsx
import { Breadcrumb, BreadcrumbItem, BreadcrumbButton, BreadcrumbDivider } from '@fluentui/react-components';
```

### Tablist
**Switch between related content sections.** Used in Azure for resource sub-pages (Overview, Properties, etc.).
```tsx
import { TabList, Tab } from '@fluentui/react-components';
<TabList selectedValue="overview">
  <Tab value="overview">Overview</Tab>
  <Tab value="properties">Properties</Tab>
  <Tab value="monitoring">Monitoring</Tab>
</TabList>
```

### Nav (Navigation)
**Side navigation for app sections.**
```tsx
import { Nav, NavCategory, NavCategoryItem, NavItem, NavSubItem } from '@fluentui/react-components';
```

### Menu
**Dropdown action list triggered by button/icon.**
```tsx
import { Menu, MenuTrigger, MenuPopover, MenuList, MenuItem } from '@fluentui/react-components';
```

## Data Display

### DataGrid (Table)
**Primary component for resource lists.** This is the workhorse of Azure Portal UI.
```tsx
import {
  DataGrid, DataGridHeader, DataGridHeaderCell, DataGridBody, DataGridRow, DataGridCell,
  createTableColumn
} from '@fluentui/react-components';
```

Key Azure patterns:
- **Sortable columns**: Use `createTableColumn` with `compare` function
- **Resource names**: Brand-colored text (`tokens.colorBrandForeground1`) to indicate links
- **Status column**: `Badge` with semantic color (success/danger/warning)
- **Selection**: Enable checkbox column for multi-select resource operations
- **Actions column**: Inline `Menu` with More (vertical dots) trigger

### Badge
**Status indicator.** Essential for Azure resource states.
```tsx
import { Badge, CounterBadge, PresenceBadge } from '@fluentui/react-components';

// Resource status
<Badge appearance="filled" color="success">Running</Badge>
<Badge appearance="filled" color="danger">Stopped</Badge>
<Badge appearance="filled" color="warning">Deallocated</Badge>
<Badge appearance="filled" color="informative">Creating</Badge>

// Notification counts
<CounterBadge count={5} appearance="filled" />
```

### Avatar
**User or service identity representation.**
```tsx
import { Avatar, AvatarGroup } from '@fluentui/react-components';
<Avatar name="Alex Britez" size={32} />
```

### Persona
**Avatar with additional context (name, status, description).**
```tsx
import { Persona } from '@fluentui/react-components';
<Persona name="Alex Britez" secondaryText="admin@contoso.com" size="medium" />
```

### Tag / TagGroup
**Represent selected values, filters, categories.**
```tsx
import { Tag, TagGroup, InteractionTag, InteractionTagPrimary } from '@fluentui/react-components';

// Filter tags (dismissible)
<TagGroup onDismiss={handleDismiss}>
  <Tag dismissible value="tag1">Location: East US</Tag>
  <Tag dismissible value="tag2">Type: VM</Tag>
</TagGroup>
```

### Text
**Typography primitive — use instead of raw HTML text elements.**
```tsx
import { Text } from '@fluentui/react-components';
<Text size={500} weight="semibold">Page Title</Text>    // 20px semibold
<Text size={300}>Body text</Text>                        // 14px regular
<Text size={200} weight="regular">Caption</Text>         // 12px regular
```

### Skeleton
**Loading placeholder.** Use when data is still loading.
```tsx
import { Skeleton, SkeletonItem } from '@fluentui/react-components';
<Skeleton>
  <SkeletonItem shape="rectangle" size={16} />
</Skeleton>
```

### Tree
**Hierarchical data display.** Used in Azure for resource group trees, navigation hierarchies.
```tsx
import { Tree, TreeItem, TreeItemLayout } from '@fluentui/react-components';
```

## Forms & Input

### Button
**Primary interaction element.**
```tsx
import { Button, CompoundButton, SplitButton, ToggleButton, MenuButton } from '@fluentui/react-components';

// Azure Portal button styles
<Button appearance="primary">Create Resource</Button>    // Brand blue filled
<Button appearance="secondary">Cancel</Button>           // Neutral with border
<Button appearance="subtle">More actions</Button>        // Transparent, icon-only
<Button appearance="outline">Edit</Button>               // Outlined
<Button icon={<Add24Regular />}>Create</Button>          // With icon
```

### Input
**Single-line text input.**
```tsx
import { Input } from '@fluentui/react-components';
<Input placeholder="Search resources..." contentBefore={<Search24Regular />} />
```

### SearchBox
**Specialized search input.** Used in Azure command bars and filter bars.
```tsx
import { SearchBox } from '@fluentui/react-components';
<SearchBox placeholder="Filter resources..." />
```

### Dropdown / Select
**Option selection from a list.**
```tsx
import { Dropdown, Option } from '@fluentui/react-components';
<Dropdown placeholder="Select location">
  <Option value="eastus">East US</Option>
  <Option value="westus">West US</Option>
  <Option value="westeurope">West Europe</Option>
</Dropdown>
```

### Combobox
**Dropdown with type-ahead search capability.**
```tsx
import { Combobox, Option } from '@fluentui/react-components';
```

### Checkbox / Switch / RadioGroup
**Selection controls.**
```tsx
import { Checkbox, Switch, RadioGroup, Radio } from '@fluentui/react-components';
```

### Field
**Wraps any form control with label, helper text, validation.**
```tsx
import { Field, Input } from '@fluentui/react-components';
<Field label="Resource name" required validationMessage="Name is required">
  <Input />
</Field>
```

### Textarea
**Multi-line text input.**

### SpinButton
**Numeric input with increment/decrement.**

### Slider
**Range value selection.**

## Feedback & Overlay

### Dialog
**Modal conversation for confirmations, forms, info.**
```tsx
import { Dialog, DialogTrigger, DialogSurface, DialogTitle, DialogBody, DialogActions, DialogContent } from '@fluentui/react-components';

// Azure destructive confirmation pattern
<Dialog>
  <DialogTrigger disableButtonEnhancement>
    <Button appearance="primary" style={{ backgroundColor: tokens.colorPaletteRedBackground3 }}>Delete</Button>
  </DialogTrigger>
  <DialogSurface>
    <DialogBody>
      <DialogTitle>Delete Resource?</DialogTitle>
      <DialogContent>This action cannot be undone.</DialogContent>
      <DialogActions>
        <DialogTrigger disableButtonEnhancement><Button>Cancel</Button></DialogTrigger>
        <Button appearance="primary">Delete</Button>
      </DialogActions>
    </DialogBody>
  </DialogSurface>
</Dialog>
```

### MessageBar
**Page or section-level status messages.**
```tsx
import { MessageBar, MessageBarBody, MessageBarTitle, MessageBarActions } from '@fluentui/react-components';

<MessageBar intent="info">
  <MessageBarBody><MessageBarTitle>Info:</MessageBarTitle>Your resources are being provisioned.</MessageBarBody>
</MessageBar>
<MessageBar intent="success">...</MessageBar>
<MessageBar intent="warning">...</MessageBar>
<MessageBar intent="error">...</MessageBar>
```

### Toast
**Transient notification after an action.**
```tsx
import { useToastController, Toast, ToastTitle, ToastBody } from '@fluentui/react-components';
```

### Tooltip
**Contextual info on hover/focus.**
```tsx
import { Tooltip } from '@fluentui/react-components';
<Tooltip content="Create a new resource" relationship="label">
  <Button icon={<Add24Regular />} />
</Tooltip>
```

### Popover
**Richer floating content.**
```tsx
import { Popover, PopoverTrigger, PopoverSurface } from '@fluentui/react-components';
```

### Spinner / ProgressBar
**Loading indicators.**
```tsx
import { Spinner, ProgressBar } from '@fluentui/react-components';
<Spinner label="Loading resources..." />
<ProgressBar value={0.6} />
```

## Toolbar

### Toolbar
**Action bar for contextual operations.** The composed `CommandBar` wraps this.
```tsx
import { Toolbar, ToolbarButton, ToolbarDivider } from '@fluentui/react-components';
```

## Icons

All icons come from `@fluentui/react-icons`. Naming convention: `{Name}{Size}{Style}`.

### Common Azure Portal Icons
```tsx
// Navigation & actions
import { Add24Regular, Delete24Regular, Edit24Regular, ArrowClockwise24Regular } from '@fluentui/react-icons';
import { Filter24Regular, ArrowDownload24Regular, TableSettings24Regular } from '@fluentui/react-icons';
import { Home24Regular, ChevronRight24Regular, Star24Regular, MoreHorizontal24Regular } from '@fluentui/react-icons';
import { Search24Regular, Dismiss24Regular } from '@fluentui/react-icons';

// Resource types
import { Server24Regular, Database24Regular, Globe24Regular, Cloud24Regular } from '@fluentui/react-icons';
import { Storage24Regular, Key24Regular, Shield24Regular, People24Regular } from '@fluentui/react-icons';

// Status & info
import { CheckmarkCircle24Regular, ErrorCircle24Regular, Warning24Regular, Info24Regular } from '@fluentui/react-icons';
import { ArrowTrendingUp24Regular, ArrowTrendingDown24Regular } from '@fluentui/react-icons';
```

### Icon Sizing Convention
| Size | Use Case |
|------|----------|
| 16px | Inline with small text, badges |
| 20px | Compact UI, small buttons |
| 24px | **Default** — toolbars, buttons, navigation |
| 28px | Page titles, hero sections |
| 32px+ | Large display icons |
