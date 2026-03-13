# Decisions — agentation-integration

## [2026-03-13] Session ses_3174880ffffesobC6Kzj3Uo28y — Session Start

### Architecture Decisions (from Metis review)

- PAT vs GitHub App: Use PAT for initial setup, document both options in README
- No user auth: shared GITHUB_TOKEN in SWA env vars, public Storybook
- No CORS headers in function: SWA handles automatically
- No rate limiting in function: SWA has built-in rate limiting
- Batch submit only: "Send Annotations" button → one issue per submission
- Copilot assignment: `assignees: ["copilot"]` in issue API

### Implementation Decisions

- `api/tsconfig.json`: target ES2020, module commonjs, rootDir `src`, outDir `dist`
- `api/host.json`: extension bundle `[4.*, 5.0.0)`
- GitHub workflow: use `github.rest.issues.create` or `gh issue create --assignee copilot`
- Labels: `ui-feedback` and `copilot` on created issues
