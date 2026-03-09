# Cross-Workspace Agent Guide: Consuming the Azure Storybook

How to set up AI agents in a separate workspace to use this Storybook as their design system reference — even when the Storybook lives at a different URL.

## Architecture

```
┌────────────────────────┐         ┌───────────────────────────────┐
│  Your App Workspace    │         │   Azure Storybook (deployed)  │
│                        │  fetch  │                               │
│  .instructions.md ─────┼────────►│  /llm-context-bundle.json     │
│  custom skill/agent    │         │  /index.json (story manifest) │
│                        │         │  /project.json                │
│  Agent builds UI       │         │  /iframe.html?id=...          │
│  using Storybook       │         │                               │
│  patterns + tokens     │         │  Source: llm-context/          │
└────────────────────────┘         │          src/stories/          │
                                   └───────────────────────────────┘
```

---

## Option 1: Static Instructions File (Simplest)

In your consuming workspace, create `.github/copilot-instructions.md`:

```markdown
## UI Design System

This project uses the Azure Storybook design system for all UI components.

### Core Rules
- Use `@fluentui/react-components` (Fluent UI v9) for all components
- Style with `makeStyles` from `@fluentui/react-components` + `tokens.*` — never hardcode
- Follow the Azure brand ramp: primary `#0f6cbd`, darker `#0f548c`, light `#2886de`
- Spacing: 2/4/6/8/10/12/16/20/24/32/40px scale
- Typography: Segoe UI, base 14px, sizes 10/12/14/16/20/24/28/32/40/68px
- Border radius: 0 | 2px | 4px | 8px | 12px | 10000px (pill)

### Component Reference
- Storybook: https://YOUR-STORYBOOK-URL.azurestaticapps.net
- Full context: https://YOUR-STORYBOOK-URL.azurestaticapps.net/llm-context-bundle.json
- Story manifest: https://YOUR-STORYBOOK-URL.azurestaticapps.net/index.json

### Page Layout
1. AzureBreadcrumb (always first)
2. PageTitleBar (icon + title + star + more-actions)
3. CommandBar (primary actions | secondary actions)
4. FilterBar (SearchBox + FilterPill components)
5. DataGrid or Card Grid

### Anti-Patterns (NEVER do these)
- ❌ Hardcoded colors, fonts, spacing
- ❌ CSS Modules or vanilla CSS
- ❌ Fluent UI v8 imports
- ❌ Raw SVGs (use @fluentui/react-icons)
- ❌ `string` prop types when a union type exists
```

### Pros
- Zero setup, works immediately
- No network fetch needed at agent runtime
- Agent gets the rules in every conversation

### Cons
- Static — doesn't auto-update when Storybook changes
- Limited to what fits in instructions (no full component registry)

---

## Option 2: Fetch + Instructions Skill

Create a skill that fetches the live LLM context bundle when building UI.

### Step 1: Install the skill 

Create `.github/skills/use-design-system/SKILL.md`:

```markdown
# Use Azure Design System

Fetch and apply the Azure Storybook design system when building UI components.

## When to Use
- Building new React components or pages
- User asks to "follow the design system" or "match Azure Portal"

## Steps

1. **Fetch the context bundle:**
   ```
   GET https://YOUR-STORYBOOK-URL.azurestaticapps.net/llm-context-bundle.json
   ```

2. **Parse the response:**
   - `registry` — Array of all components with categories and variant lists
   - `componentDocs` — Descriptions for each component
   - `context.azure-theme` — Brand colors, semantic tokens, typography, spacing
   - `context.component-patterns` — Page hierarchy, composition rules
   - `context.styling-guide` — Griffel patterns, token usage, anti-patterns
   - `guidelines` — MDX docs (Getting Started, Token Usage, Page Patterns, etc.)

3. **Find relevant components:**
   Search `registry` for components matching the user's request.
   Check `componentDocs[name].description` for usage guidance.

4. **Generate code following the patterns:**
   - Import from `@fluentui/react-components` or component source
   - Use `makeStyles` + `tokens.*` for all styling
   - Follow composition rules from `context.component-patterns`
   - Match the page layout hierarchy

5. **Verify against anti-patterns** from `context.styling-guide`
```

### Step 2: Configure the skill in your workspace

Add to `.github/copilot-instructions.md`:
```markdown
When building UI, use the `use-design-system` skill to fetch the latest 
component registry and patterns from the Azure Storybook.
```

---

## Option 3: Storybook MCP Server (Most Powerful)

Build a lightweight MCP server that wraps the Storybook APIs, giving agents structured tool access.

### Server Implementation

```typescript
// mcp-storybook-server/index.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const STORYBOOK_URL = process.env.STORYBOOK_URL || 'https://YOUR-URL.azurestaticapps.net';

const server = new Server({ name: 'storybook-design-system', version: '1.0.0' }, {
  capabilities: { tools: {} },
});

server.setRequestHandler('tools/list', async () => ({
  tools: [
    {
      name: 'list_components',
      description: 'List all components in the design system with their categories and variants',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'get_component',
      description: 'Get detailed docs, props, and usage examples for a specific component',
      inputSchema: {
        type: 'object',
        properties: { name: { type: 'string', description: 'Component name' } },
        required: ['name'],
      },
    },
    {
      name: 'get_theme_tokens',
      description: 'Get the full theme token reference (colors, typography, spacing, shadows)',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'get_page_pattern',
      description: 'Get the layout pattern and composition hierarchy for a page type',
      inputSchema: {
        type: 'object',
        properties: { type: { type: 'string', enum: ['resource-list', 'resource-detail', 'create-wizard', 'home', 'support'] } },
        required: ['type'],
      },
    },
    {
      name: 'search_components',
      description: 'Search for components matching a query',
      inputSchema: {
        type: 'object',
        properties: { query: { type: 'string' } },
        required: ['query'],
      },
    },
  ],
}));

server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;
  
  // Fetch the bundle once and cache
  const bundle = await fetch(`${STORYBOOK_URL}/llm-context-bundle.json`).then(r => r.json());
  
  switch (name) {
    case 'list_components':
      return { content: [{ type: 'text', text: JSON.stringify(bundle.registry, null, 2) }] };
    
    case 'get_component': {
      const comp = bundle.registry.find((c: any) => c.name.toLowerCase() === args.name.toLowerCase());
      const docs = bundle.componentDocs[args.name] || {};
      return { content: [{ type: 'text', text: JSON.stringify({ ...comp, ...docs }, null, 2) }] };
    }
    
    case 'get_theme_tokens':
      return { content: [{ type: 'text', text: bundle.context['azure-theme'] }] };
    
    case 'get_page_pattern':
      return { content: [{ type: 'text', text: bundle.context['component-patterns'] }] };
    
    case 'search_components': {
      const q = args.query.toLowerCase();
      const matches = bundle.registry.filter((c: any) =>
        c.name.toLowerCase().includes(q) ||
        c.tags.some((t: string) => t.includes(q)) ||
        (bundle.componentDocs[c.name]?.description || '').toLowerCase().includes(q)
      );
      return { content: [{ type: 'text', text: JSON.stringify(matches, null, 2) }] };
    }
    
    default:
      return { content: [{ type: 'text', text: `Unknown tool: ${name}` }] };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

### Register in VS Code

Add to `.vscode/mcp.json` in the consuming workspace:
```json
{
  "servers": {
    "storybook-design-system": {
      "command": "node",
      "args": ["path/to/mcp-storybook-server/index.js"],
      "env": {
        "STORYBOOK_URL": "https://YOUR-URL.azurestaticapps.net"
      }
    }
  }
}
```

### Pros
- Most structured agent access — tools with typed inputs/outputs
- Agents can query exactly what they need (no over-fetching)
- Extensible — add `get_story_screenshot`, `get_story_source`, etc.

### Cons
- Requires building and maintaining the MCP server
- Need to keep server in sync with Storybook evolution

---

## Option 4: Agent Browser Navigation

If agents have Playwright/browser tools, they can navigate the deployed Storybook directly.

### Key URLs

| Endpoint | URL Pattern | Returns |
|----------|------------|---------|
| **Home** | `/` | Storybook UI |
| **Story manifest** | `/index.json` | JSON with all story IDs, titles, paths |
| **Project info** | `/project.json` | Framework, addons, versions |
| **LLM bundle** | `/llm-context-bundle.json` | All context in one fetch |
| **Story iframe** | `/iframe.html?id={storyId}&viewMode=story` | Rendered story |
| **Docs iframe** | `/iframe.html?id={storyId}&viewMode=docs` | Component docs |

### Example agent workflow
```
1. GET /llm-context-bundle.json → parse registry + patterns
2. Find relevant component → e.g., "FilterPill"
3. GET /iframe.html?id=components-filterpill--composed-filter-bar&viewMode=story
4. Screenshot the rendered output for visual reference
5. Read story source from bundle → generate matching code
```

---

## Hosting the Storybook

### Azure Static Web Apps (Recommended)

Already configured via `staticwebapp.config.json`. Deploy with:

```bash
# Build
npm run build:all   # generates registry → LLM bundle → Storybook static

# Deploy via Azure CLI
az staticwebapp create --name azure-storybook --resource-group YOUR_RG
az staticwebapp deploy --app-location dist
```

Add CORS headers for agent fetch (update `staticwebapp.config.json`):
```json
{
  "globalHeaders": {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET",
    "Cache-Control": "public, max-age=3600"
  }
}
```

### Chromatic (Already Integrated)

The project has Chromatic configured. Published builds get a unique URL:
```
https://<branch>--<project-id>.chromatic.com
```

Chromatic URLs support `/index.json` and iframe access.

---

## Quick Start Checklist

For the **Storybook maintainer**:
- [ ] Run `npm run build:llm` to generate the context bundle
- [ ] Add `build:llm` to your CI/CD pipeline
- [ ] Deploy to Azure SWA or Chromatic
- [ ] Add CORS headers for cross-origin access
- [ ] Add "Use when..." descriptions to all components

For the **consuming workspace**:
- [ ] Choose an integration option (1-4 above)
- [ ] Add `.github/copilot-instructions.md` with design system rules
- [ ] Install `@fluentui/react-components` and `@fluentui/react-icons`
- [ ] Test by asking your agent to "build a resource list page following the design system"
- [ ] Verify agent output matches Storybook patterns
