# Azure Storybook

Fluent UI React v9 component library themed as Azure Portal, built with Storybook 10.

## Quick Start

```bash
npm install
npm run dev        # Start Storybook dev server
```


## Scripts

| Command                  | Description                             |
| ------------------------ | --------------------------------------- |
| `npm run dev`            | Start Storybook dev server on port 6006 |
| `npm run build`          | Build static Storybook site             |
| `npm run build:registry` | Generate component-registry.json        |
| `npm run build:all`      | Build registry + Storybook              |
| `npm run lint`           | Run ESLint                              |
| `npm run format`         | Run Prettier                            |
| `npm run chromatic`      | Push to Chromatic for visual testing    |

## Structure

```
src/
├── components/          # Azure-specific composed components
│   ├── AzureBreadcrumb.tsx
│   ├── CommandBar.tsx
│   ├── FilterBar.tsx
│   └── PageTitleBar.tsx
├── stories/
│   ├── foundations/     # Design tokens: Colors, Typography, Spacing, Shadows
│   ├── components/      # Fluent v9 components: Button, Input, Card, etc.
│   ├── composed/        # Composed component stories
│   └── templates/       # Full page templates (ResourceListPage)
├── themes/
│   ├── azureThemes.ts   # Azure light/dark/HC themes
│   ├── coherenceTokens.ts # Structured token reference
│   └── index.ts
└── component-registry.json  # Auto-generated LLM context

llm-context/             # LLM-optimized documentation
├── azure-theme.md       # Theme tokens quick reference
├── component-patterns.md # Azure composition patterns
└── styling-guide.md     # Griffel + token usage guide

scripts/
├── extract-tokens.ts    # One-time token extraction from Coherence CDN
└── generate-registry.ts # Story metadata → registry JSON
```

## Theme System

Three themes extracted from Azure Portal's Coherence design system:

- **Azure Light** — default, white background with Azure blue (#0f6cbd) brand
- **Azure Dark** — dark mode with matching brand ramp
- **High Contrast** — WCAG AAA compliant

Toggle themes in the Storybook toolbar.

## Component Taxonomy

| Category        | Description                                                                    |
| --------------- | ------------------------------------------------------------------------------ |
| **Foundations** | Color swatches, typography scale, spacing, shadows                             |
| **Components**  | Stock Fluent v9: Button, Input, Card, Dialog, DataGrid, DataDisplay, Selection |
| **Composed**    | Azure-specific: Breadcrumb, PageTitleBar, CommandBar, FilterBar                |
| **Templates**   | Full pages: ResourceListPage (resource list with all composed components)      |

## LLM Optimization

This Storybook is designed for LLM context:

- `.copilot-instructions.md` — project conventions for Copilot
- `llm-context/` — structured docs for theme, patterns, and styling
- `component-registry.json` — machine-readable component index
- CSF3 stories with autodocs for self-documenting APIs

## Deployment

Deployed to Azure Static Web Apps via GitHub Actions.

Required secrets:

- `AZURE_STATIC_WEB_APPS_API_TOKEN` — SWA deployment token
- `CHROMATIC_PROJECT_TOKEN` — Chromatic project token

## Agentation Integration

> Stakeholders can annotate UI issues directly in the deployed Storybook. Annotations automatically become GitHub Issues assigned to GitHub Copilot for automated fix PRs.

### Architecture

```
Browser (Storybook)
  → POST /api/feedback  (SWA managed function)
  → GitHub repository_dispatch
  → GitHub Actions (.github/workflows/agentation-feedback.yml)
  → GitHub Issue (assigned to Copilot)
  → Copilot PR
```

### Environment Variables

Set the following in **Azure Portal → Static Web App → Configuration → Application Settings**:

| Variable | Required | Description |
| --- | --- | --- |
| `GITHUB_TOKEN` | ✅ Yes | GitHub token with `contents: write` scope. Used by the `/api/feedback` proxy to trigger `repository_dispatch`. |

**Recommended token types** (in order of preference):
1. **GitHub App installation token** — longest-lived, fine-grained permissions
2. **Fine-grained PAT** — set expiry to 1 year, scope to `unthinkmedia/AzureStorybook`, permission: `Contents: Read and write`
3. **Classic PAT** — `repo` scope (broader than needed but works)

> ⚠️ Never commit the token. Set it only in Azure Portal or as a GitHub Actions secret.

### How Stakeholders Use It

1. Visit the deployed Storybook at the Azure SWA URL
2. Click the **Agentation toolbar** icon in the story canvas
3. Click on any UI element to annotate it — add a comment describing the issue
4. Click **"Send Annotations"** to submit all annotations as a single GitHub Issue
5. The issue is auto-assigned to Copilot, which will create a fix PR

### Local Development

To run the API function locally alongside Storybook:

**Option A: Azure Functions Core Tools**
```bash
# Terminal 1 — Storybook
npm run dev

# Terminal 2 — API function
cd api
npm install
# Create local settings (not committed)
echo '{"IsEncrypted":false,"Values":{"FUNCTIONS_WORKER_RUNTIME":"node","GITHUB_TOKEN":"your-token-here"}}' > local.settings.json
npx func start
```

**Option B: SWA CLI (proxies both together)**
```bash
npm install -g @azure/static-web-apps-cli
npm run build
swa start storybook-static --api-location api
```

> `api/local.settings.json` is already in `.gitignore` — safe to create locally.

## Tech Stack

- React 18 + TypeScript 5.7
- Fluent UI React v9 (`@fluentui/react-components`)
- Storybook 10 + Vite 6
- Griffel CSS-in-JS
- Chromatic visual regression
- Azure Static Web Apps
