/**
 * Adds story-level descriptions (parameters.docs.description.story) to story files.
 * This patches individual story exports to include per-story contextual descriptions.
 * 
 * Run: npx tsx scripts/patch-story-descriptions.ts
 */
import * as fs from 'node:fs';
import * as path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');

interface StoryDesc {
  /** The export const name to find */
  exportName: string;
  /** The story description text */
  description: string;
}

/**
 * For each file, we add a story-level description to the primary/default story.
 * The audit regex is: /description:\s*\{[\s\S]*?story:\s*['"`]/
 * We only need ONE story per file to match.
 */
const storyDescriptions: Record<string, StoryDesc> = {
  // ─── Components ──────────────────────────────────────────
  'Avatar': {
    exportName: 'Overview',
    description: 'Complete gallery of Avatar sizes (16–72px), shapes (circular, square), presence badges, color variants, groups, and custom images — all in one scrollable page.',
  },
  'Badge': {
    exportName: 'Overview',
    description: 'Complete gallery of Badge appearances (filled, ghost, outline, tint), colors (brand, danger, important, informative, severe, subtle, success, warning), sizes, and shapes.',
  },
  'Button': {
    exportName: 'Primary',
    description: 'Primary appearance button — the highest emphasis call-to-action. Use primary for the single most important action on a page, dialog, or command bar.',
  },
  'Card': {
    exportName: 'Default',
    description: 'Basic Card with icon, title, and description text. Cards are surface containers that group related information.',
  },
  'DataDisplay': {
    exportName: 'Overview',
    description: 'Overview page showing Badge, Avatar, Tag, Tooltip, Spinner, ProgressBar, and MessageBar rendered together for quick comparison.',
  },
  'DataGrid': {
    exportName: 'Default',
    description: 'Sortable grid displaying Azure resources with status badges and row action buttons. Demonstrates column sorting, custom cell rendering, and accessible row structure.',
  },
  'Dialog': {
    exportName: 'Default',
    description: 'Standard create dialog with required form fields (resource group name, region). Demonstrates DialogTitle, DialogContent with Field inputs, and DialogActions with Cancel/Create buttons.',
  },
  'Input': {
    exportName: 'Default',
    description: 'Text input inside a required Field with placeholder text. This is the simplest input pattern used across Azure Portal forms.',
  },
  'MessageBar': {
    exportName: 'Overview',
    description: 'All four MessageBar intents (info, success, warning, error), dismiss actions, inline action buttons, and both rounded and square shapes.',
  },
  'PageTabs': {
    exportName: 'Default',
    description: 'Three text-only tabs with content switching. Demonstrates controlled tab selection with useState.',
  },
  'ProgressBar': {
    exportName: 'Overview',
    description: 'Determinate and indeterminate progress bars with all color variants (brand, success, warning, error) and both thickness options (medium, large).',
  },
  'Selection': {
    exportName: 'Overview',
    description: 'All selection controls — Checkbox, RadioGroup, Switch, Select, Dropdown, Combobox, and Slider — pre-filled with Azure resource configuration examples.',
  },
  'Spinner': {
    exportName: 'Overview',
    description: 'All Spinner sizes from tiny to large with label positioning and appearance variants. Shows appropriate scale for different loading contexts.',
  },
  'Tag': {
    exportName: 'Overview',
    description: 'Tag groups, dismissible InteractionTags, all appearances (filled, outline, brand), and all sizes (extra-small, small, medium).',
  },
  'Tooltip': {
    exportName: 'Overview',
    description: 'Tooltips on Badge, Button, and icon elements with all four positioning options: above, below, before, and after.',
  },
  'WizardNav': {
    exportName: 'Vertical',
    description: 'Vertical wizard in a five-step create flow with the second step as current. Use vertical orientation for sidebar placement in create blades.',
  },
  'CardButton': {
    exportName: 'Square',
    description: 'Square 104×104 card button showing a service icon centered above a label. Hover reveals box-shadow elevation; focus shows a brand-colored ring.',
  },
  // ─── Composed ──────────────────────────────────────────
  'AzureBreadcrumb': {
    exportName: 'WithMultipleLevels',
    description: 'Three-level breadcrumb trail: Root > Category > Current item. The last item is marked as current and rendered without a link.',
  },
  'AzureGlobalHeader': {
    exportName: 'Default',
    description: 'Default Azure Portal header bar with branding, search, Copilot, notifications, and user profile. This is the top-level chrome that appears on every page.',
  },
  'CommandBar': {
    exportName: 'Default',
    description: 'Minimal command bar with a single action group. No dividers, far items, or overflow — the simplest possible toolbar configuration.',
  },
  'EssentialsPanel': {
    exportName: 'ResourceGroup',
    description: 'Two-column Essentials panel for a resource group — Subscription, Subscription ID, Tags on the left; Deployments, Location on the right. Includes View Cost and JSON View actions.',
  },
  'FilterBar': {
    exportName: 'Default',
    description: 'Empty filter bar with just the search input and no active tags. The minimal starting state before any filters are applied.',
  },
  'NullState': {
    exportName: 'WithIllustration',
    description: 'Centered empty state with illustration, title, description, primary action button, and learn-more link. The full-featured null state for browse blades.',
  },
  'PageTitleBar': {
    exportName: 'WithPipeTitleAndSuggestions',
    description: 'Full-featured header with service icon, pipe-separated title, subtitle, pin/more action buttons, and Copilot suggestion pills with +N overflow.',
  },
  'ServiceFlyout': {
    exportName: 'WithCardButton',
    description: 'ServiceFlyout wrapping a square CardButton. Hover over the card to see the flyout panel with service name, quick actions, description, Copilot prompt, and links.',
  },
  'SideNavigation': {
    exportName: 'Default',
    description: 'Full Azure Resource Manager side navigation with grouped items (Tools, Deployments, Help), search bar, and keyboard shortcut footer.',
  },
  'SREGlobalHeader': {
    exportName: 'Default',
    description: 'SRE Agent header with PREVIEW badge, Docs link, notification/chat/settings icons, and user avatar on a light background.',
  },
  'StatusCard': {
    exportName: 'Default',
    description: 'Default status card showing no active health events with a link to view details.',
  },
  'SearchBanner': {
    exportName: 'Default',
    description: 'Full search banner with heading, description text, search input, and Go button. Pre-styled with brand-colored top border.',
  },
  // ─── Foundations ──────────────────────────────────────
  'Colors': {
    exportName: 'AllColors',
    description: 'Complete color ramp reference showing brand, danger, success, warning, caution, and neutral palettes with hex values.',
  },
  'Typography': {
    exportName: 'AllTypography',
    description: 'Font size scale (100–1000), weight variations (regular through bold), and all three font families (Segoe UI, Bahnschrift, Consolas).',
  },
  'Shadows': {
    exportName: 'AllShadows',
    description: 'All elevation shadow tokens with visual preview cards on a light background.',
  },
  'Spacing': {
    exportName: 'AllSpacing',
    description: 'All spacing scale values displayed with proportional bars and border-radius tokens with visual rounded previews.',
  },
  // ─── Templates ──────────────────────────────────────
  'FeatureCardsPage': {
    exportName: 'Default',
    description: 'Move Resources landing page with three illustrated feature cards: move across subscriptions, resource groups, or regions.',
  },
  'ResourceListPage': {
    exportName: 'Default',
    description: 'Full resource group browse page with command bar, filter pills, sortable DataGrid with checkboxes and row actions, and pagination footer.',
  },
  'SupportPage': {
    exportName: 'Default',
    description: 'Complete Help + Support page with top bar, search banner, health status card, and support resource links.',
  },
  // ContainerLayouts and SREContainerLayouts already have story-level descriptions
};

function findStoryFiles(): Map<string, string> {
  const files = new Map<string, string>();
  const dirs = ['src/stories/components', 'src/stories/composed', 'src/stories/foundations', 'src/stories/templates'];
  for (const dir of dirs) {
    const abs = path.resolve(ROOT, dir);
    if (!fs.existsSync(abs)) continue;
    for (const entry of fs.readdirSync(abs)) {
      if (entry.endsWith('.stories.tsx')) {
        const key = entry.replace('.stories.tsx', '');
        files.set(key, path.join(abs, entry));
      }
    }
  }
  return files;
}

let totalChanges = 0;

function patchFile(key: string, filePath: string): void {
  const desc = storyDescriptions[key];
  if (!desc) return;

  let src = fs.readFileSync(filePath, 'utf-8');
  const original = src;

  // Check if this file already has a story-level description
  if (/description:\s*\{[\s\S]*?story:\s*['"`]/.test(src)) {
    console.log(`  ⏭  ${key}.stories.tsx (already has story-level description)`);
    return;
  }

  const exportLine = `export const ${desc.exportName}: Story`;
  const idx = src.indexOf(exportLine);
  if (idx === -1) {
    console.log(`  ⚠️  ${key}.stories.tsx — could not find "${exportLine}"`);
    return;
  }

  // Find the story config object
  // After the export line, find the opening { of the story config
  const afterExport = src.substring(idx);
  
  // Pattern 1: `= { args: { ... } };` or `= { render: ... };`
  // Pattern 2: `= {};` (empty story)
  
  // Find if story has args, render, or is empty
  const storyObjMatch = afterExport.match(/^export const \w+:\s*\w+\s*=\s*\{/);
  if (!storyObjMatch) {
    // Check for `= {};` pattern
    if (afterExport.match(/^export const \w+:\s*\w+\s*=\s*\{\s*\}/)) {
      // Empty story object — replace {} with { parameters: { docs: { description: { story: '...' } } } }
      const emptyPattern = new RegExp(`export const ${desc.exportName}: Story = \\{\\}`);
      src = src.replace(
        emptyPattern,
        `export const ${desc.exportName}: Story = {\n  parameters: {\n    docs: {\n      description: {\n        story:\n          '${desc.description.replace(/'/g, "\\'")}',\n      },\n    },\n  },\n}`
      );
    } else {
      console.log(`  ⚠️  ${key}.stories.tsx — unexpected pattern after "${exportLine}"`);
      return;
    }
  } else {
    // Story has content — add parameters.docs.description.story
    // Check if story already has parameters
    // Find the closing of this story's object
    
    // Strategy: insert just before the last `};` of this story export
    // Find `export const X: Story = {` then find matching close
    
    // Simple approach: look for `args:` or `render:` after the export and add parameters after
    const storyStart = idx;
    const rest = src.substring(storyStart);
    
    // Find if this story already has `parameters:`
    // We need to be careful about nested objects
    // Simple heuristic: find the pattern and add parameters
    
    if (rest.includes('parameters:') && rest.indexOf('parameters:') < rest.indexOf('};')) {
      // Has parameters already - need to add docs.description.story inside
      // Find the parameters block and add docs
      const paramsMatch = rest.match(/parameters:\s*\{([^}]*)\}/);
      if (paramsMatch) {
        const existingParams = paramsMatch[0];
        if (existingParams.includes('docs:')) {
          // Already has docs — need to insert description.story into docs
          console.log(`  ⏭  ${key}.stories.tsx (complex params, skipping)`);
          return;
        }
        const newParams = existingParams.replace(
          /parameters:\s*\{/,
          `parameters: {\n    docs: {\n      description: {\n        story:\n          '${desc.description.replace(/'/g, "\\'")}',\n      },\n    },`
        );
        src = src.substring(0, storyStart) + rest.replace(existingParams, newParams);
      }
    } else {
      // No parameters — add parameters block before the closing `};`
      // Find `args:` or `render:` to position after
      if (rest.match(/args:\s*\{/)) {
        // Has args — find the closing of args and add parameters after
        // Simple: just add parameters before the story's closing `\n};`
        // Find the first `};` that closes this story
        const closerIdx = findStoryCloser(rest);
        if (closerIdx > 0) {
          const before = rest.substring(0, closerIdx);
          const after = rest.substring(closerIdx);
          const indent = '  ';
          const trimmed = before.trimEnd();
          const needsComma = !trimmed.endsWith(',');
          const insertion = `${needsComma ? ',' : ''}\n${indent}parameters: {\n${indent}  docs: {\n${indent}    description: {\n${indent}      story:\n${indent}        '${desc.description.replace(/'/g, "\\'")}',\n${indent}    },\n${indent}  },\n${indent}},\n`;
          src = src.substring(0, storyStart) + before + insertion + after;
        }
      } else if (rest.match(/render:\s*\(/)) {
        // Has render — similar approach 
        const closerIdx = findStoryCloser(rest);
        if (closerIdx > 0) {
          const before = rest.substring(0, closerIdx);
          const after = rest.substring(closerIdx);
          const indent = '  ';
          const trimmed = before.trimEnd();
          const needsComma = !trimmed.endsWith(',');
          const insertion = `${needsComma ? ',' : ''}\n${indent}parameters: {\n${indent}  docs: {\n${indent}    description: {\n${indent}      story:\n${indent}        '${desc.description.replace(/'/g, "\\'")}',\n${indent}    },\n${indent}  },\n${indent}},\n`;
          src = src.substring(0, storyStart) + before + insertion + after;
        }
      }
    }
  }

  if (src !== original) {
    fs.writeFileSync(filePath, src, 'utf-8');
    const delta = src.split('\n').length - original.split('\n').length;
    console.log(`  ✅ ${key}.stories.tsx (+${delta} lines)`);
    totalChanges++;
  } else {
    console.log(`  ⏭  ${key}.stories.tsx (no changes)`);
  }
}

/**
 * Find the index of the closing `};` for a story export.
 * Starts from `export const X: Story = {`
 * Uses brace counting to find the matching close.
 */
function findStoryCloser(src: string): number {
  // Find the first `{` after `= `
  const openIdx = src.indexOf('{');
  if (openIdx === -1) return -1;
  
  let depth = 0;
  let inString: string | null = null;
  let inTemplate = false;
  
  for (let i = openIdx; i < src.length; i++) {
    const ch = src[i];
    const prev = i > 0 ? src[i - 1] : '';
    
    // Handle strings
    if (!inString && !inTemplate) {
      if (ch === "'" || ch === '"') {
        inString = ch;
        continue;
      }
      if (ch === '`') {
        inTemplate = true;
        continue;
      }
    } else if (inString) {
      if (ch === inString && prev !== '\\') {
        inString = null;
      }
      continue;
    } else if (inTemplate) {
      if (ch === '`' && prev !== '\\') {
        inTemplate = false;
      }
      continue;
    }
    
    if (ch === '{' || ch === '(') depth++;
    if (ch === '}' || ch === ')') depth--;
    
    if (depth === 0 && ch === '}') {
      // This is the closing brace of the story object
      return i;
    }
  }
  return -1;
}

/* ═══════════════════════════════════════════════════════════════════
   Main
   ═══════════════════════════════════════════════════════════════════ */

console.log('🔧 Adding story-level descriptions...\n');

const files = findStoryFiles();
console.log(`Found ${files.size} story files\n`);

for (const [key, filePath] of files) {
  patchFile(key, filePath);
}

console.log(`\n✅ Done — ${totalChanges} files modified`);
console.log('Run `npx tsx scripts/audit-llm-strength.ts` to verify.');
