# Azure Portal Page Patterns

This reference documents the standard page layouts, compositions, and UX patterns found in the Azure Portal. Use these as templates when building Storybook stories.

## Portal Shell Structure

The Azure Portal has a consistent shell with these permanent elements:

```
┌─────────────────────────────────────────────────────────────┐
│ [☰ Menu]  [Search bar ...........] [⚡Copilot] [🔔 ⚙ ? 👤] │  ← Global header
├────┬────────────────────────────────────────────────────────┤
│    │ Breadcrumb: Home > RG > Resource                       │
│ N  │ ─────────────────────────────────────────────────       │
│ A  │ Page Title Bar                                          │
│ V  │ ─────────────────────────────────────────────────       │
│    │ Command Bar                                             │
│ M  │ ─────────────────────────────────────────────────       │
│ E  │                                                         │
│ N  │            Working Pane (Content)                       │
│ U  │                                                         │
│    │                                                         │
└────┴────────────────────────────────────────────────────────┘
```

In Storybook, we simulate the **working pane** (right side) — not the global shell.

## Page Types

### 1. Resource List (Browse Blade)

The most common page type. Lists resources with filtering, sorting, and bulk actions.

**Structure:**
```
AzureBreadcrumb    Home > Resource Groups > myResourceGroup
PageTitleBar       🖥️ Virtual Machines    ☆  ⋯   [Copilot suggestions]
CommandBar         + Create | ✏️ Edit | 🗑️ Delete ‖ 🔄 Refresh | ⬇ Export | 🔍 Filter | ⊞ Columns
FilterBar          [Search...] [Type ▾] [Location ▾]  × East US  × Running
DataGrid           Name | Type | Resource Group | Location | Status
                   ─────────────────────────────────────────────
                   myVM-1        VM    rg-prod    East US   ● Running
                   myVM-2        VM    rg-dev     West US   ● Stopped
```

**Key implementation details:**
- DataGrid columns are sortable (click header to sort)
- Name column uses brand-colored text for clickability
- Status column uses Badge with semantic colors
- Content area has `flex: 1`, `overflow: auto`, border, border-radius
- Page background is `tokens.colorNeutralBackground2` (#fafafa)
- Content surface is `tokens.colorNeutralBackground1` (#ffffff)

### 2. Resource Overview (Detail Blade)

Shows details for a single resource. Has a side navigation panel.

**Structure:**
```
AzureBreadcrumb    Home > RG > myVM-1
PageTitleBar       🖥️ myVM-1 (Virtual Machine)    ☆  ⋯
CommandBar         ▶ Start | ⏹ Stop | 🔄 Restart | 🗑️ Delete ‖ 🔄 Refresh
┌──────────────┬──────────────────────────────────────────────┐
│              │                                              │
│  Overview    │  Essentials                                  │
│  Activity    │  ┌─────────────────────────────────────────┐ │
│  Access (IAM)│  │ Resource group: rg-prod                 │ │
│  Tags        │  │ Status: ● Running                       │ │
│  Diagnose    │  │ Location: East US                       │ │
│              │  │ Subscription: Azure-Sub-1               │ │
│ ─────────────│  │ OS: Ubuntu 22.04                        │ │
│ Settings     │  └─────────────────────────────────────────┘ │
│  Networking  │                                              │
│  Disks       │  Monitoring                                  │
│  Size        │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│  Extensions  │  │ CPU  │ │ Mem  │ │ Disk │ │ Net  │       │
│              │  │ 45%  │ │ 72%  │ │ 2.1G │ │ 850M │       │
│              │  └──────┘ └──────┘ └──────┘ └──────┘       │
└──────────────┴──────────────────────────────────────────────┘
```

**Key implementation details:**
- Side nav is 220px fixed width with `flex-shrink: 0`
- Nav items use Fluent `Nav` or plain styled links
- Essentials section is a key-value grid (2 columns)
- Monitoring section uses KPI cards in a CSS grid
- Content area fills remaining width with `flex: 1`

### 3. Create / Wizard Flow

Multi-step form for creating a new resource. Full-width (no side navigation).

**Structure:**
```
AzureBreadcrumb    Home > Virtual Machines > Create
PageTitleBar       Create a virtual machine
┌─────────────────────────────────────────────────────────────┐
│  [Basics] [Networking] [Management] [Tags] [Review+Create]  │  ← TabList
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Project details                                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Subscription    [Azure-Sub-1        ▾]              │   │
│  │  Resource group  [myResourceGroup    ▾] [Create new] │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  Instance details                                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Virtual machine name  [                           ] │   │
│  │  Region                [East US              ▾]      │   │
│  │  Image                 [Ubuntu Server 22.04  ▾]      │   │
│  │  Size                  [Standard_B2s         ▾]      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  [< Previous]                          [Next: Networking >] │
└─────────────────────────────────────────────────────────────┘
```

**Key implementation details:**
- Tabs at top for wizard steps
- Form sections with clear headings (16px semibold)
- Fields use Fluent `Field` + `Input`/`Dropdown`/`Combobox`
- Navigation buttons at bottom (Previous / Next / Review+Create)
- Validation messages appear inline below fields
- No side navigation panel

### 4. Dashboard

Grid of tiles showing KPIs, charts, quick actions, and resource summaries.

**Structure:**
```
PageTitleBar       📊 Dashboard    ☆  ⋯    [Edit] [Share]
┌──────────┬──────────┬──────────┬──────────┐
│ Active   │ Healthy  │ Alerts   │ Cost     │
│ Resources│ Services │          │ (MTD)    │
│   142    │   98%    │   3 ⚠    │  $4,521  │
│  ↑ 12%   │  ↑ 2%   │  ↓ 5    │  ↑ 8%   │
├──────────┴──────────┼──────────┴──────────┤
│                     │                     │
│  CPU Usage (chart)  │  Resource Groups    │
│  ████████░░ 78%     │  ├ rg-prod (42)    │
│                     │  ├ rg-dev (28)     │
│                     │  └ rg-test (12)    │
├─────────────────────┼─────────────────────┤
│  Recent Activity    │  Quick Actions      │
│  • VM created...    │  [+ Create VM]      │
│  • DB scaled...     │  [+ Create DB]      │
│  • Alert fired...   │  [📊 Metrics]       │
└─────────────────────┴─────────────────────┘
```

**Key implementation details:**
- Top row: KPI cards in grid (`repeat(auto-fill, minmax(200px, 1fr))`)
- Each KPI card: large number (24px semibold), label (12px), trend badge
- Chart sections: placeholder or simple bar representations
- Card grids: `gap: 16px`, cards have `shadow2` resting, `shadow4` hover
- All cards use `tokens.colorNeutralBackground1` with 1px `colorNeutralStroke2` border

### 5. Monitoring / Metrics Page

Shows time-series data, charts, and health indicators for a resource.

**Structure:**
```
AzureBreadcrumb    Home > RG > myVM-1 > Monitoring
PageTitleBar       📊 Monitoring
CommandBar         📅 Last 24 hours ▾ | 🔄 Refresh | ⬇ Export | 📌 Pin to dashboard
┌────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────┐  ┌──────────────────────┐│
│  │ CPU Usage Over Time         │  │ Memory Usage         ││
│  │ ████████████████░░░░░░░░░   │  │ ██████████████░░░░   ││
│  │ 78%                         │  │ 72%                  ││
│  └─────────────────────────────┘  └──────────────────────┘│
│  ┌─────────────────────────────┐  ┌──────────────────────┐│
│  │ Disk I/O                    │  │ Network Throughput   ││
│  │ Read: 2.1 MB/s              │  │ In: 850 KB/s         ││
│  │ Write: 1.4 MB/s             │  │ Out: 420 KB/s        ││
│  └─────────────────────────────┘  └──────────────────────┘│
└────────────────────────────────────────────────────────────┘
```

## Universal Pattern: Essentials Panel

Shows key properties of any Azure resource. Appears on Overview pages.

```tsx
// Two-column key-value layout
const useStyles = makeStyles({
  essentials: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px 24px',
    padding: '16px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  label: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  value: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground1,
  },
});
```

**Standard essentials fields:**
- Resource group, Status, Location, Subscription, Subscription ID, Tags

## Azure Portal Interaction Patterns

### Selection + Bulk Actions
1. User selects items in DataGrid via checkboxes
2. CommandBar actions become enabled/disabled based on selection
3. Destructive actions (Delete) show confirmation Dialog

### Filter + Search
1. FilterBar shows SearchBox + Dropdown filters
2. As filters are applied, they appear as dismissible Tags
3. DataGrid updates to show filtered results
4. "No results" state shows empty illustration + message

### Navigation Drill-Down
1. User clicks resource name (brand-colored link) in DataGrid
2. Navigate to resource detail page (Overview blade)
3. Breadcrumb updates to show full path
4. Side navigation appears with resource-specific sections

### Empty States
When no resources exist, show:
- Centered illustration or icon (muted colors)
- "No resources found" heading
- Brief description text
- Primary action button: "Create resource"

```tsx
const useStyles = makeStyles({
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '64px',
    gap: '16px',
  },
  emptyIcon: {
    fontSize: '48px',
    color: tokens.colorNeutralForeground3,
  },
  emptyTitle: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  emptyDescription: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
    textAlign: 'center',
    maxWidth: '400px',
  },
});
```

### Loading States
- Use `Spinner` for initial page load
- Use `Skeleton` for content-shaped loading placeholders
- Use `ProgressBar` for determinate progress (uploads, long operations)

## Accessibility Requirements

Azure Portal targets WCAG 2.1 AA compliance. When building UI:

1. **Color contrast**: Don't rely on color alone — pair with icons/text. All text meets 4.5:1 contrast ratio (Fluent tokens handle this).
2. **Keyboard navigation**: All interactive elements must be focusable and operable via keyboard. Fluent components handle this by default.
3. **ARIA labels**: Provide `aria-label` for icon-only buttons, decorative images get `aria-hidden="true"`.
4. **Focus indicators**: Fluent v9 provides built-in focus rings. Don't override `outline` styles.
5. **Screen reader support**: Use semantic HTML (`<nav>`, `<main>`, `<header>`, `<section>`) and ARIA landmarks.
6. **High contrast**: The `azureHighContrastTheme` handles all token resolution. Write once, works in HC mode automatically.

## Responsive Behavior

Azure Portal targets 1366px+ desktop viewports but gracefully handles:
- **≥1366px**: Full layout with side nav
- **1024–1365px**: Narrower content, side nav may collapse
- **<1024px**: Side nav hidden, hamburger menu

For Storybook stories, design for 1366px+ as the primary viewport. Use `parameters: { layout: 'fullscreen' }` for page templates.
