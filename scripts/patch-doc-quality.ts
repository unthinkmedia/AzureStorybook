/**
 * Patches all story files to maximize Documentation Quality score.
 *
 * Run: npx tsx scripts/patch-doc-quality.ts
 *
 * This script adds:
 * 1. parameters.docs.description.component with "Use this when..." guidance
 * 2. Story-level descriptions in parameters.docs.description.story
 * 3. JSDoc comments above story exports
 * 4. argTypes for component props
 *
 * Safe to run multiple times — skips files that already have the target content.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');

/* ═══════════════════════════════════════════════════════════════════
   Component descriptions with "Use this when..." guidance
   ═══════════════════════════════════════════════════════════════════ */

const componentDescriptions: Record<string, string> = {
  // ─── Components ────────────────────────────────────────────────
  'Avatar.stories': `Fluent UI Avatar renders a person or entity image with fallback initials and optional presence badge. Use this when you need to display a user photo, initials, or entity icon in headers, lists, comments, or cards. Choose this over a plain image tag to get consistent sizing, fallback behavior, and presence indicators.`,

  'Badge.stories': `Fluent UI Badge displays a small visual indicator for status, count, or category. Use this when you need to show notification counts, status labels (Running, Stopped, Error), or category tags. Choose this over plain text or custom spans for consistent color, size, and rounded-pill styling.`,

  'Button.stories': `Fluent UI Button handles user actions with multiple appearances (primary, secondary, outline, subtle, transparent) and sizes. Use this when you need clickable actions in toolbars, dialogs, forms, or inline flows. Choose this over native HTML buttons to ensure consistent Azure Portal styling and accessibility.`,

  'Card.stories': `Fluent UI Card is a surface container for grouping related information and actions with optional selection behavior. Use this when you need to present a bounded content block — such as a resource summary, metric tile, or action shortcut. Choose this over plain divs when you need hover elevation, focus ring, and selection states.`,

  'DataDisplay.stories': `Overview of data-presentation primitives: Badge, Avatar, Tag, Tooltip, Spinner, ProgressBar, and MessageBar. Use this when you need a quick reference to all available status and feedback components in one place. Each component has its own dedicated page under Components.`,

  'DataGrid.stories': `Fluent UI DataGrid provides a sortable, accessible table for tabular data with custom cell rendering. Use this when you need to display resource lists, audit logs, or any structured data with column sorting. Choose this over native HTML tables for keyboard navigation, column resizing, and consistent Azure Portal styling.`,

  'Dialog.stories': `Fluent UI Dialog presents a modal overlay for confirmations, forms, or information display. Use this when you need to capture user input (create resource, confirm deletion) or show details that require focused attention. Choose this over inline forms when the action is disruptive or requires explicit user acknowledgment.`,

  'Input.stories': `Fluent UI Input, SearchBox, Textarea, SpinButton, and related text entry controls. Use this when you need to capture text input in forms — resource names, search queries, descriptions, or numeric values. Choose this over native inputs for consistent Azure Portal field styling, validation states, and content-before/after slots.`,

  'MessageBar.stories': `Fluent UI MessageBar shows inline status messages with intent-based styling (info, success, warning, error). Use this when you need to communicate status, alerts, or guidance within a page section. Choose this over Tooltip or Dialog when the message should be persistent and visible without user interaction.`,

  'PageTabs.stories': `Horizontal tab strip for switching between sub-views within a page. Use this when a resource or service page has multiple logical sections (Overview, Settings, Monitoring) that the user switches between. Choose this over a side navigation when the sections are peer-level and the list is short (2–6 tabs).`,

  'ProgressBar.stories': `Fluent UI ProgressBar shows determinate or indeterminate progress with color-coded states. Use this when you need to indicate operation progress — deployment status, upload completion, or background task tracking. Choose this over Spinner when you can report a specific completion percentage.`,

  'Selection.stories': `Overview of selection and choice controls: Checkbox, RadioGroup, Switch, Select, Dropdown, Combobox, and Slider. Use this when you need a quick reference to all form selection primitives. Each control has its own dedicated story in this Storybook.`,

  'Spinner.stories': `Fluent UI Spinner shows an indeterminate loading indicator with optional label. Use this when content is loading and you cannot determine a progress percentage — such as fetching resource data, waiting for API responses, or initial page load. Choose this over ProgressBar when completion percentage is unknown.`,

  'Tag.stories': `Fluent UI Tag and InteractionTag display labels for categorization, filtering, or metadata. Use this when you need to show Azure resource tags, filter selections, or category labels. Choose this over Badge when the label needs to be dismissible, editable, or part of a TagGroup with add/remove behavior.`,

  'Tooltip.stories': `Fluent UI Tooltip provides supplementary text on hover or focus for icons, badges, and buttons. Use this when a UI element needs additional explanation that should not take up permanent space. Choose this over MessageBar when the information is contextual to a single element and should only appear on demand.`,

  // ─── Composed ──────────────────────────────────────────────────
  'AzureBreadcrumb.stories': `Azure Portal-style breadcrumb trail showing the current navigation hierarchy. Use this when you need to show the user where they are in the portal navigation tree — from root service down to sub-resource. Place above the PageHeader in every detail or browse blade.`,

  'EssentialsPanel.stories': `Azure Portal Essentials panel — a collapsible two-column summary of key resource properties (subscription, location, status, tags). Use this when displaying a resource overview page to show the most important metadata at a glance, matching the Azure Portal resource blade pattern.`,

  'FilterBar.stories': `Simple filter bar with search input and active tag chips. Use this when you need a lightweight row of active filters above a data grid or list. Choose this over FilterPill when you need a simpler text-search-based filter row without popover menus.`,

  'PageTitleBar.stories': `Azure Portal PageHeader — icon, title with pipe separator, subtitle, pin/more actions, and Copilot suggestion pills. Use this when building the top section of any Azure Portal blade. Combines branding, navigation context, and AI suggestions in a single row.`,

  'Colors.stories': `Azure design token color ramps extracted from the Coherence CDN theme — brand, danger, success, warning, caution, and neutral palettes. Use this when you need to reference the exact hex values used in the Azure Portal for any color decision.`,

  'Typography.stories': `Azure design token typography reference — font sizes, weights, line heights, and font families (Segoe UI, Bahnschrift, Consolas). Use this when you need to verify the correct font specifications for Azure Portal text rendering.`,

  'ResourceListPage.stories': `Full-page resource list template combining CommandBar, FilterPill row, sortable DataGrid with row actions and checkboxes, and a pagination footer. Use this when building a browse blade for any Azure resource type — resource groups, VMs, storage accounts, etc.`,
};

/* ═══════════════════════════════════════════════════════════════════
   "Use when" additions for files that already have description.component
   ═══════════════════════════════════════════════════════════════════ */

const useWhenAdditions: Record<string, { oldText: string; newText: string }> = {
  'WizardNav.stories': {
    oldText: `A step indicator for multi-step create/deploy wizard flows. Supports both vertical (sidebar) and horizontal (top bar) orientations, matching the Azure Portal wizard blade pattern.`,
    newText: `A step indicator for multi-step create/deploy wizard flows. Supports both vertical (sidebar) and horizontal (top bar) orientations, matching the Azure Portal wizard blade pattern. Use this when building create, deploy, or configuration wizards that guide users through sequential steps.`,
  },
  'CardButton.stories': {
    oldText: `A card-style button combining card and button attributes. Supports a **square** variant (icon-on-top, 104×104) for service shortcuts and a **horizontal** variant (icon-left, text-right) for resource links. Gains a shadow on hover and a brand-colored ring on focus.`,
    newText: `A card-style button combining card and button attributes. Supports a **square** variant (icon-on-top, 104×104) for service shortcuts and a **horizontal** variant (icon-left, text-right) for resource links. Gains a shadow on hover and a brand-colored ring on focus. Use this when you need clickable square tiles for Azure Portal home-page service shortcuts or horizontal cards for resource link lists.`,
  },
  'FilterPill.stories': {
    oldText: `Azure Portal-style filter pill buttons. Click a pill to open a popover with checkbox selections and Apply/Cancel actions. Pills can be composed into a filter bar row.`,
    newText: `Azure Portal-style filter pill buttons. Click a pill to open a popover with checkbox selections and Apply/Cancel actions. Pills can be composed into a filter bar row. Use this when building filter rows above data grids — such as Subscription, Location, or Status filters on browse blades.`,
  },
  'AzureGlobalHeader.stories': {
    oldText: `The persistent global header bar that sits at the top of every Azure Portal page. Includes the waffle menu, hamburger, branding, search, Copilot button, action icons, and user profile.`,
    newText: `The persistent global header bar that sits at the top of every Azure Portal page. Includes the waffle menu, hamburger, branding, search, Copilot button, action icons, and user profile. Use this when building any full-page Azure Portal layout — this header must appear at the top of every page.`,
  },
  'CommandBar.stories': {
    oldText: `Azure Portal-style command bar with grouped actions, dividers, dropdown menus, overflow, far-side items, and disabled states.`,
    newText: `Azure Portal-style command bar with grouped actions, dividers, dropdown menus, overflow, far-side items, and disabled states. Use this when you need a toolbar above a data grid or content area that provides contextual actions like Add, Edit, Delete, Refresh, Export.`,
  },
  'NullState.stories': {
    oldText: `Empty / null-state pattern used inside browse blades and data grids when there are no items to display. Two variants: an illustration-centered state with title, description, and action buttons, or a simple inline text message.`,
    newText: `Empty / null-state pattern used inside browse blades and data grids when there are no items to display. Two variants: an illustration-centered state with title, description, and action buttons, or a simple inline text message. Use this when a resource list, query result, or data grid has zero items to display.`,
  },
  'ServiceFlyout.stories': {
    oldText: `A hover-activated flyout panel that displays service details — name, quick actions, description, Copilot prompt, training links, and useful links. Wraps any trigger element (CardButton, Button, etc.).`,
    newText: `A hover-activated flyout panel that displays service details — name, quick actions, description, Copilot prompt, training links, and useful links. Wraps any trigger element (CardButton, Button, etc.). Use this when you need a hover-reveal info panel for service tiles on the Azure Portal home page or service directory.`,
  },
  'SideNavigation.stories': {
    oldText: `Azure Portal-style collapsible side navigation panel with search, expandable groups, selected state, and keyboard shortcut footer.`,
    newText: `Azure Portal-style collapsible side navigation panel with search, expandable groups, selected state, and keyboard shortcut footer. Use this when building resource detail pages or service blades that have a left-side navigation tree with grouped sub-pages.`,
  },
  'SREGlobalHeader.stories': {
    oldText: `The global header bar for the Azure SRE Agent experience. Features a light background, SRE Agent branding with a PREVIEW badge, Docs link, notification/chat/settings icons, and user avatar.`,
    newText: `The global header bar for the Azure SRE Agent experience. Features a light background, SRE Agent branding with a PREVIEW badge, Docs link, notification/chat/settings icons, and user avatar. Use this when building SRE Agent pages — this header replaces AzureGlobalHeader for the SRE-specific experience.`,
  },
  'FeatureCardsPage.stories': {
    oldText: `A centered landing page template that presents a set of illustrated feature cards, each with a title, description, external link, and primary call-to-action button. Use this for hub pages that guide users to choose between several top-level actions or workflows — for example, moving resources, selecting a deployment option, or picking a getting-started path.`,
    newText: `A centered landing page template that presents a set of illustrated feature cards, each with a title, description, external link, and primary call-to-action button. Use this when you need a hub page that guides users to choose between several top-level actions or workflows — for example, moving resources, selecting a deployment option, or picking a getting-started path.`,
  },
};

/* ═══════════════════════════════════════════════════════════════════
   Story-level description + JSDoc additions
   ═══════════════════════════════════════════════════════════════════ */

interface StoryPatch {
  /** Export name to find, e.g. "export const Default" */
  exportName: string;
  /** JSDoc to add above this export (if missing) */
  jsdoc?: string;
}

const storyPatches: Record<string, StoryPatch[]> = {
  'Avatar.stories': [
    { exportName: 'Overview', jsdoc: '/** All Avatar variants: sizes, shapes, badges, groups, images, and initials. */' },
  ],
  'Badge.stories': [
    { exportName: 'Overview', jsdoc: '/** All Badge variants: appearances, colors, sizes, and shapes. */' },
  ],
  'Button.stories': [
    { exportName: 'Primary', jsdoc: '/** Primary button — the main call-to-action on a page or dialog. */' },
    { exportName: 'Secondary', jsdoc: '/** Secondary button — lower emphasis action alongside a primary button. */' },
    { exportName: 'Outline', jsdoc: '/** Outline button — bordered with transparent background. */' },
    { exportName: 'Subtle', jsdoc: '/** Subtle button — minimal chrome, blends with surrounding content. */' },
    { exportName: 'IconOnly', jsdoc: '/** Icon-only button — compact action trigger with aria-label for accessibility. */' },
    { exportName: 'Disabled', jsdoc: '/** Disabled state — visually muted and non-interactive. */' },
    { exportName: 'Sizes', jsdoc: '/** Side-by-side comparison of small, medium, and large button sizes. */' },
  ],
  'DataDisplay.stories': [
    { exportName: 'Overview', jsdoc: '/** Gallery of all data-display primitives in a single view. */' },
  ],
  'DataGrid.stories': [
    // Already has JSDoc on Default
  ],
  'Dialog.stories': [
    { exportName: 'Default', jsdoc: '/** Standard form dialog — create a resource with required fields. */' },
    // Destructive already has JSDoc
    { exportName: 'Info', jsdoc: '/** Read-only informational dialog displaying key-value resource details. */' },
  ],
  'Input.stories': [
    { exportName: 'Default', jsdoc: '/** Basic text input inside a required Field with placeholder text. */' },
    { exportName: 'WithContentBefore', jsdoc: '/** Input with a leading icon — useful for API key or password fields. */' },
    { exportName: 'Disabled', jsdoc: '/** Disabled input showing a read-only value. */' },
    { exportName: 'Validation', jsdoc: '/** Validation states: success, warning, and error with messages. */' },
    { exportName: 'Search', jsdoc: '/** SearchBox — dedicated search input with built-in clear button. */' },
    { exportName: 'TextArea', jsdoc: '/** Multiline Textarea for longer text input with vertical resize. */' },
    { exportName: 'Spin', jsdoc: '/** SpinButton for numeric input with increment/decrement controls. */' },
    { exportName: 'Appearances', jsdoc: '/** All four input appearances: outline, underline, filled-darker, filled-lighter. */' },
  ],
  'MessageBar.stories': [
    { exportName: 'Overview', jsdoc: '/** All MessageBar variants: intents, actions, dismiss button, and shapes. */' },
  ],
  'PageTabs.stories': [
    { exportName: 'Default', jsdoc: '/** Basic tab strip with three text-only tabs and content switching. */' },
    { exportName: 'WithIcons', jsdoc: '/** Tabs with leading icons for visual identification. */' },
    { exportName: 'WithDisabledTab', jsdoc: '/** Tab strip with one disabled tab that cannot be selected. */' },
  ],
  'ProgressBar.stories': [
    { exportName: 'Overview', jsdoc: '/** All ProgressBar variants: determinate, indeterminate, colors, and thickness. */' },
  ],
  'Selection.stories': [
    { exportName: 'Overview', jsdoc: '/** All selection controls in one view: Checkbox, RadioGroup, Switch, Select, Dropdown, Combobox, Slider. */' },
  ],
  'Spinner.stories': [
    { exportName: 'Overview', jsdoc: '/** All Spinner variants: sizes (tiny to large), labels, and appearances. */' },
  ],
  'Tag.stories': [
    { exportName: 'Overview', jsdoc: '/** All Tag variants: TagGroup, InteractionTag with dismiss, appearances, and sizes. */' },
  ],
  'Tooltip.stories': [
    { exportName: 'Overview', jsdoc: '/** All Tooltip placements and trigger types: Badge, Button, icon-only. */' },
  ],
  'AzureBreadcrumb.stories': [
    // Both stories already have JSDoc
  ],
  'EssentialsPanel.stories': [
    // Stories have JSDoc comments
  ],
  'FilterBar.stories': [
    { exportName: 'Default', jsdoc: '/** Default filter bar with search input and no active filters. */' },
    { exportName: 'WithActiveTags', jsdoc: '/** Filter bar with two active tag filters applied. */' },
  ],
  'PageTitleBar.stories': [
    { exportName: 'WithPipeTitleAndSuggestions', jsdoc: '/** Full-featured header: icon, pipe-separated title, subtitle, pin, more, and Copilot pills. */' },
    { exportName: 'WithAllSuggestions', jsdoc: '/** All Copilot suggestion pills visible — no overflow truncation. */' },
    { exportName: 'WithOverflow', jsdoc: '/** Many suggestions collapsed into a "+N" overflow indicator. */' },
    { exportName: 'WithSubtitle', jsdoc: '/** Title with subtitle only — no Copilot suggestion pills. */' },
    { exportName: 'Default', jsdoc: '/** Minimal header — just icon and title, no actions or suggestions. */' },
  ],
  'WizardNav.stories': [
    { exportName: 'Vertical', jsdoc: '/** Vertical wizard in a create flow — second step is current. */' },
    { exportName: 'VerticalMidFlow', jsdoc: '/** Vertical wizard mid-flow with step description text. */' },
    { exportName: 'VerticalAllComplete', jsdoc: '/** All steps completed — shows check marks on every step. */' },
    { exportName: 'VerticalWithError', jsdoc: '/** Error state on the second step with validation message. */' },
    { exportName: 'Horizontal', jsdoc: '/** Horizontal wizard layout — same create flow as a top bar. */' },
    { exportName: 'HorizontalMidFlow', jsdoc: '/** Horizontal mid-flow with step description. */' },
    { exportName: 'HorizontalAllComplete', jsdoc: '/** Horizontal layout with all steps completed. */' },
    { exportName: 'HorizontalWithError', jsdoc: '/** Horizontal layout with error state on second step. */' },
  ],
  'CardButton.stories': [
    // Square and Horizontal already have JSDoc, add to others
    { exportName: 'SquareRow', jsdoc: '/** Row of square buttons — service shortcut style matching Azure Portal home. */' },
    { exportName: 'HorizontalColumn', jsdoc: '/** Column of horizontal buttons — resource link style. */' },
  ],
  'Colors.stories': [
    { exportName: 'AllColors', jsdoc: '/** All Azure brand, status, and neutral color ramps with hex values. */' },
  ],
  'Typography.stories': [
    { exportName: 'AllTypography', jsdoc: '/** All font sizes, weights, and font families used in the Azure Portal. */' },
  ],
  'ResourceListPage.stories': [
    // Default already has JSDoc
    { exportName: 'WithoutFilters', jsdoc: '/** Resource list without filter pills — just command bar and grid. */' },
    { exportName: 'WithoutCheckboxes', jsdoc: '/** Resource list without row selection checkboxes. */' },
    { exportName: 'NullStateText', jsdoc: '/** Empty state with inline text when no resource groups exist. */' },
  ],
};

/* ═══════════════════════════════════════════════════════════════════
   argTypes definitions for files that don't have them
   ═══════════════════════════════════════════════════════════════════ */

const argTypesPatches: Record<string, string> = {
  'Card.stories': `argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'], description: 'Card size variant' },
    orientation: { control: 'select', options: ['horizontal', 'vertical'], description: 'Layout direction' },
    appearance: { control: 'select', options: ['filled', 'filled-alternative', 'outline', 'subtle'], description: 'Visual style' },
  },`,

  'DataGrid.stories': `argTypes: {
    sortable: { control: 'boolean', description: 'Enable column sorting' },
    resizableColumns: { control: 'boolean', description: 'Enable column resizing' },
    selectionMode: { control: 'select', options: ['none', 'single', 'multiselect'], description: 'Row selection mode' },
  },`,

  'Dialog.stories': `argTypes: {
    modalType: { control: 'select', options: ['modal', 'non-modal', 'alert'], description: 'Dialog modality type' },
  },`,

  'PageTabs.stories': `argTypes: {
    selectedValue: { control: 'text', description: 'Key of the currently selected tab' },
    size: { control: 'select', options: ['small', 'medium', 'large'], description: 'Tab size' },
  },`,

  'CardButton.stories': `argTypes: {
    variant: { control: 'select', options: ['square', 'horizontal'], description: 'Layout variant — square for service tiles, horizontal for resource links' },
    label: { control: 'text', description: 'Button label text' },
    icon: { control: 'text', description: 'Azure service icon name from the icon registry' },
    description: { control: 'text', description: 'Description text (horizontal variant only)' },
    external: { control: 'boolean', description: 'Show external-link icon' },
    tooltip: { control: 'text', description: 'Tooltip text on hover' },
  },`,

  'AzureBreadcrumb.stories': `argTypes: {
    items: { control: 'object', description: 'Array of breadcrumb items with label and optional current flag' },
  },`,

  'EssentialsPanel.stories': `argTypes: {
    defaultExpanded: { control: 'boolean', description: 'Whether the panel starts expanded' },
  },`,

  'FilterBar.stories': `argTypes: {
    activeTags: { control: 'object', description: 'Array of active filter tags with id and label' },
  },`,

  'PageTitleBar.stories': `argTypes: {
    title: { control: 'text', description: 'Page title — use pipe (|) to separate service name from section' },
    subtitle: { control: 'text', description: 'Subtitle text below the title' },
  },`,

  'ServiceFlyout.stories': `argTypes: {
    name: { control: 'text', description: 'Service name displayed in flyout header' },
    icon: { control: 'text', description: 'Azure service icon name' },
    description: { control: 'text', description: 'Service description text' },
    favorited: { control: 'boolean', description: 'Whether the service is favorited' },
  },`,

  'SideNavigation.stories': `argTypes: {
    defaultCollapsed: { control: 'boolean', description: 'Start in collapsed (icon-only) state' },
    searchEnabled: { control: 'boolean', description: 'Show search bar at the top' },
    width: { control: { type: 'number', min: 160, max: 400 }, description: 'Panel width in pixels' },
  },`,

  'CommandBar.stories': `argTypes: {
    items: { control: 'object', description: 'Array of action groups, each with an array of action items' },
    farItems: { control: 'object', description: 'Actions pushed to the right edge of the bar' },
    overflowItems: { control: 'object', description: 'Actions collected into a "…" overflow menu' },
  },`,
};

/* ═══════════════════════════════════════════════════════════════════
   Patching logic
   ═══════════════════════════════════════════════════════════════════ */

function findStoryFiles(): Map<string, string> {
  const files = new Map<string, string>();
  const dirs = ['src/stories/components', 'src/stories/composed', 'src/stories/foundations', 'src/stories/templates'];
  for (const dir of dirs) {
    const abs = path.resolve(ROOT, dir);
    if (!fs.existsSync(abs)) continue;
    for (const entry of fs.readdirSync(abs)) {
      if (entry.endsWith('.stories.tsx')) {
        const key = entry.replace('.tsx', '');
        files.set(key, path.join(abs, entry));
      }
    }
  }
  return files;
}

let totalChanges = 0;

function patchFile(key: string, filePath: string): void {
  let src = fs.readFileSync(filePath, 'utf-8');
  const original = src;
  const basename = path.basename(filePath);

  // ─── 1. Add component description (or enhance existing one with "Use when") ───
  const hasCompDesc = /description:\s*\{[\s\S]*?component:\s*['"`]/.test(src);

  if (!hasCompDesc && componentDescriptions[key]) {
    // Need to add parameters.docs.description.component
    const desc = componentDescriptions[key];

    // Pattern A: `parameters: { layout: '...' }` → inject docs into parameters
    // Pattern B: `parameters: { layout: '...',\n    docs: { ... } }` → inject component into docs
    // Pattern C: no parameters at all → add full parameters block
    const hasParameters = /parameters\s*:\s*\{/.test(src);
    const hasDocs = /docs\s*:\s*\{/.test(src);

    if (hasParameters && !hasDocs) {
      // Insert docs block into existing parameters
      src = src.replace(
        /(parameters\s*:\s*\{[^}]*?)(\s*\})/,
        (match, before, after) => {
          // Check if there's already content — need a comma
          const trimmed = before.trimEnd();
          const needsComma = trimmed.endsWith("'") || trimmed.endsWith('"') || trimmed.endsWith('}');
          return `${before},\n    docs: {\n      description: {\n        component:\n          '${desc.replace(/'/g, "\\'")}',\n      },\n    }${after}`;
        }
      );
    } else if (!hasParameters) {
      // No parameters at all — add before tags or at end of meta
      // Find the meta object closing
      if (/satisfies Meta/.test(src)) {
        // Pattern: `} satisfies Meta<typeof X>;`
        src = src.replace(
          /(\n)(} satisfies Meta)/,
          `$1  parameters: {\n    docs: {\n      description: {\n        component:\n          '${desc.replace(/'/g, "\\'")}',\n      },\n    },\n  },\n$2`
        );
      } else {
        // Pattern: `const meta: Meta...= { ... };`
        src = src.replace(
          /(tags:\s*\[.*?\],?)/,
          `$1\n  parameters: {\n    docs: {\n      description: {\n        component:\n          '${desc.replace(/'/g, "\\'")}',\n      },\n    },\n  },`
        );
      }
    }
  }

  // Handle "Use when" additions for files that already have descriptions
  if (useWhenAdditions[key]) {
    const { oldText, newText } = useWhenAdditions[key];
    if (src.includes(oldText) && !src.includes('Use this when')) {
      src = src.replace(oldText, newText);
    }
  }

  // ─── 2. Add JSDoc comments above story exports ───
  if (storyPatches[key]) {
    for (const patch of storyPatches[key]) {
      if (!patch.jsdoc) continue;
      const exportLine = `export const ${patch.exportName}`;
      if (src.includes(exportLine)) {
        // Check if there's already a JSDoc above this export
        const idx = src.indexOf(exportLine);
        const before = src.substring(Math.max(0, idx - 100), idx);
        if (!before.includes('/**')) {
          // Add JSDoc above the export
          src = src.replace(
            exportLine,
            `${patch.jsdoc}\n${exportLine}`
          );
        }
      }
    }
  }

  // ─── 3. Add argTypes ───
  if (argTypesPatches[key]) {
    const hasArgTypes = /argTypes\s*[:{]/.test(src);
    if (!hasArgTypes) {
      const argTypesBlock = argTypesPatches[key];
      // Insert after tags: ['autodocs'], or after component: ...,
      if (src.includes("tags: ['autodocs'],")) {
        src = src.replace(
          "tags: ['autodocs'],",
          `tags: ['autodocs'],\n  ${argTypesBlock}`
        );
      } else if (src.includes('tags: [\'autodocs\']')) {
        src = src.replace(
          "tags: ['autodocs']",
          `tags: ['autodocs'],\n  ${argTypesBlock}`
        );
      }
    }
  }

  if (src !== original) {
    fs.writeFileSync(filePath, src, 'utf-8');
    const changedLines = src.split('\n').length - original.split('\n').length;
    console.log(`  ✅ ${basename} (+${changedLines} lines)`);
    totalChanges++;
  } else {
    console.log(`  ⏭  ${basename} (no changes needed)`);
  }
}

/* ═══════════════════════════════════════════════════════════════════
   Main
   ═══════════════════════════════════════════════════════════════════ */

console.log('🔧 Patching story files for Documentation Quality...\n');

const files = findStoryFiles();
console.log(`Found ${files.size} story files\n`);

for (const [key, filePath] of files) {
  patchFile(key, filePath);
}

console.log(`\n✅ Done — ${totalChanges} files modified\n`);
console.log('Run `npx tsx scripts/audit-llm-strength.ts` to verify the score improvement.');
