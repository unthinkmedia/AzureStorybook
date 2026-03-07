# Azure Storybook

Fluent UI React v9 component library themed as Azure Portal, built with Storybook 8.

## Quick Start

```bash
npm install
npm run dev        # Start Storybook dev server
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Storybook dev server on port 6006 |
| `npm run build` | Build static Storybook site |
| `npm run build:registry` | Generate component-registry.json |
| `npm run build:all` | Build registry + Storybook |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier |
| `npm run chromatic` | Push to Chromatic for visual testing |

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

| Category | Description |
|----------|-------------|
| **Foundations** | Color swatches, typography scale, spacing, shadows |
| **Components** | Stock Fluent v9: Button, Input, Card, Dialog, DataGrid, DataDisplay, Selection |
| **Composed** | Azure-specific: Breadcrumb, PageTitleBar, CommandBar, FilterBar |
| **Templates** | Full pages: ResourceListPage (resource list with all composed components) |

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

## Tech Stack

- React 18 + TypeScript 5.7
- Fluent UI React v9 (`@fluentui/react-components`)
- Storybook 8.5 + Vite 6
- Griffel CSS-in-JS
- Chromatic visual regression
- Azure Static Web Apps
