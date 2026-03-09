# Storybook LLM-Readiness Audit

Audit a Storybook project for **LLM Strength** — how well an AI agent can discover, understand, and use the design system to generate correct code without human guidance.

## When to Use

- User asks to audit Storybook for LLM readiness / AI optimization
- User wants to improve how agents consume their design system
- User wants to set up a Storybook for cross-workspace agent consumption
- User says "audit", "LLM strength", "AI ready", "agent friendly", "optimize for AI"

---

## Audit Dimensions

Run the audit against these **7 dimensions**, scoring each 0–10. The overall LLM Strength Score is the weighted average.

### 1. Machine-Readable Metadata (weight: 20%)

Stories must expose structured data an LLM can parse without rendering the browser.

| Check | What to look for | Score impact |
|-------|-----------------|--------------|
| **index.json manifest** | Built Storybook exposes `/index.json` (v5 format) with `id`, `title`, `name`, `importPath`, `tags`, `exportName` | +3 if present |
| **Component registry** | A `component-registry.json` or equivalent JSON listing all components with categories, variants, tags | +3 if present |
| **project.json** | `/project.json` with framework, addons, UI library packages | +2 if present |
| **argTypes in meta** | `argTypes` defined on `Meta` with explicit `control`, `options`, `description` | +2 per 50% coverage |

**How to check:**
```bash
# Verify built outputs exist
ls storybook-static/index.json storybook-static/project.json
# Count stories with argTypes
grep -rl "argTypes" src/stories/ --include="*.stories.tsx" | wc -l
# vs total stories
find src/stories -name "*.stories.tsx" | wc -l
```

---

### 2. Component Documentation Quality (weight: 20%)

Each component needs a natural-language description an LLM can use as a "what is this and when do I use it" reference.

| Check | What to look for | Score impact |
|-------|-----------------|--------------|
| **Component-level description** | `parameters.docs.description.component` on every `Meta` | +3 per 80% coverage |
| **Story-level descriptions** | `parameters.docs.description.story` on complex/composed stories | +2 per 50% coverage |
| **JSDoc on exports** | `/** */` above story exports explaining the variant | +2 per 50% coverage |
| **When-to-use guidance** | Description includes "Use this when..." or "Choose this over X when..." | +3 if prevalent |

**How to check:**
```bash
# Stories with component-level description
grep -rl "description:" src/stories/ --include="*.stories.tsx" | wc -l
# Stories with JSDoc
grep -rl "/\*\*" src/stories/ --include="*.stories.tsx" | wc -l
```

**Best practice example:**
```tsx
const meta: Meta<typeof FilterPill> = {
  title: 'Components/FilterPill',
  component: FilterPill,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Azure Portal-style filter pill. Use this when building browse/list pages ' +
          'that need faceted filtering. Renders as a clickable pill that opens a ' +
          'popover with checkbox selections. Compose multiple pills into a FilterBar. ' +
          'Prefer FilterPill over raw Dropdown when matching Azure Portal UX.',
      },
    },
  },
};
```

---

### 3. LLM Context Files (weight: 15%)

Static markdown/JSON files specifically designed for LLM consumption — these get injected into agent context windows.

| Check | What to look for | Score impact |
|-------|-----------------|--------------|
| **Theme/token reference** | Markdown file with brand colors, semantic tokens, typography scale, spacing scale | +3 |
| **Component patterns** | Markdown file with page layout hierarchy, composition rules, common patterns | +3 |
| **Styling guide** | Markdown file explaining styling approach (Griffel, tokens, anti-patterns) | +2 |
| **Do/Don't rules** | Explicit anti-pattern list (what NOT to do) | +2 |

**Ideal directory structure:**
```
llm-context/
  azure-theme.md          # Brand ramp, semantic tokens, typography, spacing, shadows
  component-patterns.md   # Page hierarchy, composed components, common layouts
  styling-guide.md        # Griffel patterns, token usage, icon patterns, anti-patterns
  api-reference.md        # Component props, accepted values, defaults (NEW)
  composition-rules.md    # How components nest, required parents, slot conventions (NEW)
```

---

### 4. Story Structure & Naming (weight: 15%)

Story organization determines how easily an LLM can navigate the design system.

| Check | What to look for | Score impact |
|-------|-----------------|--------------|
| **CSF3 format** | All stories use `satisfies Meta<typeof X>` + named exports | +2 |
| **Hierarchical titles** | `title: 'Category/ComponentName'` with consistent categories | +2 |
| **Descriptive export names** | `WithStatusBadge`, `Dismissible`, `KitchenSink` — not `Story1`, `Test` | +2 |
| **Tags** | `tags: ['autodocs']` on all components for automatic doc generation | +2 |
| **Variant coverage** | Each component has Default + edge cases (empty, error, loading, max data) | +2 |

---

### 5. TypeScript Prop Extraction (weight: 10%)

LLMs need to know the API surface — every prop, its type, default, and whether it's required.

| Check | What to look for | Score impact |
|-------|-----------------|--------------|
| **Typed component props** | `interface XProps { ... }` exported from component file | +3 |
| **react-docgen-typescript** | Storybook config uses `reactDocgen: 'react-docgen-typescript'` | +3 |
| **Default values** | Props have defaults visible in `args` or component destructuring | +2 |
| **Enum/union types** | `appearance: 'primary' \| 'secondary' \| 'outline'` — not `string` | +2 |

**How to check:**
```bash
# Verify docgen config
grep -n "reactDocgen" .storybook/main.ts
```

---

### 6. Composition & Template Examples (weight: 10%)

LLMs generate better full-page UIs when they have complete, realistic composition examples.

| Check | What to look for | Score impact |
|-------|-----------------|--------------|
| **Full-page templates** | Stories with `parameters: { layout: 'fullscreen' }` showing complete pages | +3 |
| **Composition hierarchy** | Stories showing how components nest (Header → CommandBar → FilterBar → Grid) | +3 |
| **Realistic data** | Mock data uses domain-realistic values, not "Lorem ipsum" | +2 |
| **Container/layout stories** | Stories showing side-panel vs full-width layout patterns | +2 |

---

### 7. Cross-Workspace Agent Accessibility (weight: 10%)

How well can an agent in a *different* workspace consume this Storybook remotely?

| Check | What to look for | Score impact |
|-------|-----------------|--------------|
| **Hosted URL** | Storybook deployed to a public/internal URL (Azure SWA, Chromatic, etc.) | +3 |
| **Machine endpoints** | `/index.json`, `/project.json` accessible via HTTP GET | +2 |
| **CORS headers** | Static assets serve `Access-Control-Allow-Origin` for agent fetch | +2 |
| **LLM context bundle** | A single downloadable file combining all LLM context (registry + patterns + tokens) | +3 |

---

## Running the Audit

### Step 1: Gather Metrics

```bash
# Run from project root
TOTAL=$(find src/stories -name "*.stories.tsx" | wc -l | tr -d ' ')
DESC=$(grep -rl "description:" src/stories/ --include="*.stories.tsx" | wc -l | tr -d ' ')
ARGS=$(grep -rl "argTypes" src/stories/ --include="*.stories.tsx" | wc -l | tr -d ' ')
JSDOC=$(grep -rl "/\*\*" src/stories/ --include="*.stories.tsx" | wc -l | tr -d ' ')
TAGS=$(grep -rl "tags:" src/stories/ --include="*.stories.tsx" | wc -l | tr -d ' ')
PARAMS=$(grep -rl "parameters" src/stories/ --include="*.stories.tsx" | wc -l | tr -d ' ')
FULLSCREEN=$(grep -rl "fullscreen" src/stories/ --include="*.stories.tsx" | wc -l | tr -d ' ')
MDX=$(find src/stories -name "*.mdx" | wc -l | tr -d ' ')
LLM_CTX=$(find llm-context -type f 2>/dev/null | wc -l | tr -d ' ')

echo "=== Storybook LLM Audit Metrics ==="
echo "Total stories:           $TOTAL"
echo "With description:        $DESC ($((DESC*100/TOTAL))%)"
echo "With argTypes:           $ARGS ($((ARGS*100/TOTAL))%)"
echo "With JSDoc:              $JSDOC ($((JSDOC*100/TOTAL))%)"
echo "With tags:               $TAGS ($((TAGS*100/TOTAL))%)"
echo "With parameters:         $PARAMS ($((PARAMS*100/TOTAL))%)"
echo "Fullscreen templates:    $FULLSCREEN"
echo "MDX docs:                $MDX"
echo "LLM context files:       $LLM_CTX"
```

### Step 2: Check Built Outputs

```bash
# Check machine-readable endpoints
ls -la storybook-static/index.json storybook-static/project.json 2>/dev/null
cat src/component-registry.json | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'{len(d)} components registered')"
```

### Step 3: Spot-Check Documentation Quality

Read 3 random stories and verify each has:
- [ ] `parameters.docs.description.component` with "Use this when..." guidance
- [ ] `argTypes` for all controllable props
- [ ] At least one `/** */` JSDoc comment on a non-default story
- [ ] Descriptive story names (not generic)
- [ ] Realistic mock data

### Step 4: Score & Report

Use this template for the audit report:

```markdown
## Storybook LLM Strength Audit

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Machine-Readable Metadata | X/10 | 20% | X.X |
| Documentation Quality | X/10 | 20% | X.X |
| LLM Context Files | X/10 | 15% | X.X |
| Story Structure & Naming | X/10 | 15% | X.X |
| TypeScript Prop Extraction | X/10 | 10% | X.X |
| Composition & Templates | X/10 | 10% | X.X |
| Cross-Workspace Access | X/10 | 10% | X.X |
| **Overall LLM Strength** | | | **X.X/10** |

### Top Recommendations
1. ...
2. ...
3. ...
```

---

## Enhancement Recipes

### Recipe A: Add Missing Component Descriptions

For every story file missing `parameters.docs.description.component`, add a description that answers:
1. **What** — One sentence explaining the component
2. **When** — "Use this when..." with specific scenarios
3. **Composition** — "Compose with X, Y" if applicable
4. **Not** — "Don't use this for..." if there's a common confusion

### Recipe B: Generate LLM Context Bundle

Create a build script that produces a single `llm-context-bundle.json`:

```typescript
// scripts/generate-llm-bundle.ts
import * as fs from 'node:fs';
import * as path from 'node:path';

const bundle = {
  generatedAt: new Date().toISOString(),
  registry: JSON.parse(fs.readFileSync('src/component-registry.json', 'utf-8')),
  theme: fs.readFileSync('llm-context/azure-theme.md', 'utf-8'),
  patterns: fs.readFileSync('llm-context/component-patterns.md', 'utf-8'),
  styling: fs.readFileSync('llm-context/styling-guide.md', 'utf-8'),
  guidelines: fs.readdirSync('src/stories/guidelines')
    .filter(f => f.endsWith('.mdx'))
    .map(f => ({
      name: f.replace('.mdx', ''),
      content: fs.readFileSync(path.join('src/stories/guidelines', f), 'utf-8'),
    })),
};

const out = path.resolve('storybook-static', 'llm-context-bundle.json');
fs.writeFileSync(out, JSON.stringify(bundle, null, 2));
console.log(`LLM context bundle → ${out}`);
```

Add to `package.json`:
```json
"build:llm": "tsx scripts/generate-llm-bundle.ts",
"build:all": "npm run build:registry && npm run build:llm && npm run build"
```

### Recipe C: Add argTypes to All Stories

For components wrapping Fluent UI, add explicit argTypes:

```tsx
argTypes: {
  appearance: {
    control: 'select',
    options: ['secondary', 'primary', 'outline', 'subtle', 'transparent'],
    description: 'Visual style. Use "primary" for main CTA, "subtle" for inline actions.',
  },
  size: {
    control: 'radio',
    options: ['small', 'medium', 'large'],
    description: 'Button size. Default "medium". Use "small" in toolbars/command bars.',
  },
  disabled: {
    control: 'boolean',
    description: 'Disables interaction. Renders with muted appearance.',
  },
},
```

### Recipe D: Add Composition Documentation

Create `llm-context/composition-rules.md`:

```markdown
# Component Composition Rules

## Page Assembly Order
1. AzureBreadcrumb (always first, full width)
2. PageTitleBar (icon + title + star + actions + copilot suggestions)
3. CommandBar (primary actions | secondary actions)
4. FilterBar (SearchBox + FilterPills)
5. DataGrid or Card Grid (main content)

## Required Parents
- FilterPill → must be inside a flex row (FilterBar provides this)
- PageTabs → must be after PageTitleBar, before content
- SideNavigation → must be inside `.blade-sidebar` div (not slot="navigation")
- EssentialsPanel → goes below PageTitleBar, above content grid

## Slot Conventions
- `slot="navigation"` → Global nav only (AzurePortalNav / hamburger drawer)
- `slot="main"` → Everything else (breadcrumb, title, sidebar, content)

## Layout Decision
- Resource detail page → Side Panel layout (220px nav + content)
- Browse/create/home page → Full Width layout (no section nav)
```

### Recipe E: Expose Story Source Code

Add `@storybook/addon-storysource` or use `parameters.docs.source` to make story source code available to LLMs that can read the rendered docs page:

```tsx
export const Default: Story = {
  args: { label: 'Subscription', value: 'Azure subscription 1' },
  parameters: {
    docs: {
      source: {
        type: 'code',
        // Forces source display even for complex render functions
      },
    },
  },
};
```

---

## Cross-Workspace Agent Consumption Guide

When your Storybook lives at a separate URL and agents in another workspace need to use it:

### Option 1: LLM Context Bundle (Recommended)

1. **Build & deploy** the bundle as part of your Storybook build:
   ```
   https://your-storybook.azurestaticapps.net/llm-context-bundle.json
   ```

2. **In the consuming workspace**, create an instruction file (`.github/copilot-instructions.md` or `.instructions.md`):
   ```markdown
   ## Design System Reference
   
   Our UI follows the Azure Storybook design system.
   
   - Storybook URL: https://your-storybook.azurestaticapps.net
   - Component registry: https://your-storybook.azurestaticapps.net/llm-context-bundle.json
   - Always use Fluent UI v9 (`@fluentui/react-components`) with `makeStyles` and `tokens.*`
   - Never hardcode colors, spacing, or font sizes
   - Follow Azure Portal page patterns (see Storybook → Guidelines → Page Patterns)
   ```

3. **Create a fetch-context skill** that agents can invoke to pull fresh context:
   ```markdown
   # Skill: fetch-design-system
   When building UI, fetch the design system context:
   1. GET https://your-storybook.azurestaticapps.net/llm-context-bundle.json
   2. Parse the registry to find relevant components
   3. Read theme tokens and styling guide
   4. Generate code following the patterns
   ```

### Option 2: Git Submodule / NPM Package

1. Publish the `llm-context/` directory as an npm package or Git submodule
2. Consuming workspaces install it and point their `.instructions.md` at the local files
3. Agents read the files directly — no network fetch needed

### Option 3: Storybook MCP Server

Build an MCP server that exposes your Storybook as tools:

```typescript
// Tools an MCP server could expose:
- list_components()        → Returns component registry
- get_component(name)      → Returns component docs, props, usage examples
- get_story_source(id)     → Returns the TSX source of a specific story
- get_theme_tokens()       → Returns the full token reference
- get_page_pattern(type)   → Returns layout pattern for a page type
- search_components(query) → Semantic search across component docs
```

This is the most powerful option — agents can query exactly what they need.

### Option 4: Agent Browsing (Playwright)

If the Storybook is deployed, agents with browser tools can:

1. Navigate to `https://your-storybook.azurestaticapps.net`
2. Fetch `/index.json` for the full story manifest
3. Navigate to specific story iframes to see rendered output
4. Take screenshots for visual reference

The iframe URL pattern is:
```
/iframe.html?id=<story-id>&viewMode=story
```

Example:
```
/iframe.html?id=components-button--primary&viewMode=story
/iframe.html?id=templates-resource-list-page--default&viewMode=story
```

---

## What Makes a Storybook "LLM Strong"

### The 10 Commandments of LLM-Ready Storybooks

1. **Every component has a description** — `parameters.docs.description.component` with "Use when..." guidance
2. **Every prop is typed and documented** — No `any`, no `string` when an enum works, `argTypes` with descriptions
3. **Stories have semantic names** — `WithStatusBadge` not `Variant2`
4. **Full-page templates exist** — Agents need to see how components compose into real pages
5. **A machine-readable registry exists** — JSON file listing all components, their variants, and categories
6. **LLM context files exist** — Markdown files with theme tokens, patterns, styling rules, anti-patterns
7. **A single bundle endpoint exists** — One URL/file to fetch all context an agent needs
8. **Story source is visible** — Agents need copy-pasteable code, not just rendered previews
9. **Anti-patterns are documented** — "Don't do X, do Y instead" prevents common LLM mistakes
10. **Composition rules are explicit** — Which components go inside which, in what order, with what slots
