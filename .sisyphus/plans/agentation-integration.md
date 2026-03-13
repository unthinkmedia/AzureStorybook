# Agentation Integration for AzureStorybook

## TL;DR

> **Quick Summary**: Add Agentation annotation toolbar to the deployed AzureStorybook so stakeholders can click UI elements, leave feedback, and auto-create GitHub Issues assigned to Copilot — which then creates fix PRs.
>
> **Deliverables**:
>
> - `<Agentation>` component wired into Storybook preview decorator
> - SWA managed API proxy (`/api/feedback`) for secure GitHub token handling
> - GitHub Actions workflow that creates formatted issues + assigns Copilot
> - CI pipeline updated to deploy API alongside static Storybook
> - Unit tests for the API proxy
>
> **Estimated Effort**: Medium
> **Parallel Execution**: YES — 4 waves
> **Critical Path**: Task 1 (API scaffolding) → Task 5 (proxy implementation) → Task 6 (tests) → Final Verification

---

## Context

### Original Request

Add Agentation (https://www.agentation.com/) to the AzureStorybook so stakeholders can annotate UI issues directly in the deployed Storybook. Annotations should automatically become GitHub Issues on `unthinkmedia/AzureStorybook`, assigned to GitHub Copilot for automated PR creation. Must support batching and work for anyone with repo access without requiring GitHub login.

### Interview Summary

**Key Discussions**:

- Agentation is a client-side React annotation tool — it captures CSS selectors, React component trees, source paths, and user comments. It does NOT talk to GitHub directly.
- A webhook/proxy architecture bridges the gap: Browser → SWA API proxy → GitHub `repository_dispatch` → GH Actions workflow → creates issue → assigns Copilot
- Batching: manual "Send Annotations" button → one issue per batch (not auto-send per annotation)
- Auth: no user login needed. Shared GitHub token lives server-side in SWA environment variables
- Storybook access control: out of scope (currently public on Azure SWA)
- GitHub Copilot: already enabled on the repo
- Issue body: full context (CSS selectors, React components, comments, page URL)
- Tests: after implementation

**Research Findings**:

- Agentation requires React 18+ ✅ (project has 18.3.1)
- `webhookUrl` prop sends POST on `submit` event with all annotations — simplest integration path
- SWA managed functions use `api/` folder at repo root with own `package.json` — zero additional hosting cost
- GitHub `repository_dispatch` requires `contents: write` scope on token
- Copilot assignment via `assignees: ["copilot"]` in issue creation API

### Metis Review

**Identified Gaps** (addressed):

- **CI deploy job can't see `api/` folder**: Current deploy job only downloads the storybook-static artifact — doesn't checkout repo. Fix: add `actions/checkout@v4` to deploy job + `api_location: api`
- **`.gitignore` blocks `*.js` globally**: Would silently break API deployment. Fix: add `!api/` exception
- **ESM vs CJS mismatch**: Root has `"type": "module"` but Azure Functions v4 needs CJS. Fix: `api/package.json` must NOT have `"type": "module"`
- **No payload validation**: Public endpoint could be spammed. Fix: validate payload structure, reject empty annotations, cap size at 1MB
- **Storybook iframe context**: Agentation in decorator runs inside story iframe — captures story DOM and React tree correctly. The `url` will show the iframe URL (noted in docs)
- **Token type recommendation**: GitHub App > PAT for longevity, but PAT is simpler for initial setup. Document both options in README.

---

## Work Objectives

### Core Objective

Enable stakeholders to annotate UI issues directly in the deployed AzureStorybook, with annotations automatically becoming GitHub Issues assigned to Copilot for automated fix PRs.

### Concrete Deliverables

- `agentation` package installed as devDependency
- `.storybook/preview.tsx` updated with `<Agentation webhookUrl="/api/feedback" />` inside decorator
- `api/` folder with SWA managed function: `api/src/functions/feedback.ts`
- `api/package.json`, `api/host.json`, `api/tsconfig.json` — isolated module
- `.github/workflows/agentation-feedback.yml` — creates issues from annotations
- `.github/workflows/ci.yml` — updated deploy job for managed functions
- `.gitignore` — updated to allow `api/` JS files
- Unit tests for API proxy
- README updated with env var setup instructions

### Definition of Done

- [ ] Agentation toolbar visible in deployed Storybook across all themes
- [ ] "Send Annotations" creates a GitHub Issue with full annotation context
- [ ] Issue auto-assigned to Copilot
- [ ] `npm run build:all` passes
- [ ] `npm run test` passes
- [ ] `npm run lint` passes
- [ ] CI deploys both static site and API functions

### Must Have

- Agentation toolbar renders in all 6 Chromatic theme modes (azure-light/dark/hc, sreagent-light/dark/hc)
- Annotations batched via "Send Annotations" button → one issue per submission
- API proxy validates payload and rejects malformed/empty submissions
- GitHub token stored as SWA environment variable (never in client-side code)
- Works for any visitor to the Storybook (no login required)

### Must NOT Have (Guardrails)

- Must NOT add Storybook access control / Azure AD auth (explicitly out of scope)
- Must NOT add per-user GitHub OAuth or login flows
- Must NOT set up MCP server (that's for local dev, not deployed Storybook)
- Must NOT add auto-send behavior — manual "Send Annotations" button only
- Must NOT add `agentation` to `peerDependencies` or library exports — Storybook devDependency only
- Must NOT modify existing Storybook components, stories, or theme files
- Must NOT create a database or persistence layer — annotations are fire-and-forget to GitHub
- Must NOT add Slack/Discord/other notifications — GitHub Issues only
- Must NOT store tokens/secrets in client-side JavaScript
- Must NOT break existing Storybook build, tests, or lint

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.
> Acceptance criteria requiring "user manually tests/confirms" are FORBIDDEN.

### Test Decision

- **Infrastructure exists**: YES (vitest configured in `vitest.config.ts`)
- **Automated tests**: Tests after implementation
- **Framework**: vitest (consistent with existing `src/themes/__tests__/themeRegistry.test.ts`)

### QA Policy

Every task MUST include agent-executed QA scenarios (see TODO template below).
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright (playwright skill) — Navigate to deployed Storybook, verify toolbar renders, test annotation flow
- **API/Backend**: Use Bash (curl) — POST to `/api/feedback`, assert status codes + response bodies
- **CI/Workflow**: Use Bash (gh CLI) — Verify workflow exists, trigger test dispatch, check issue creation

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — foundation, 4 parallel):
├── Task 1: API folder scaffolding + .gitignore update [quick]
├── Task 2: Install agentation + wire into preview.tsx [quick]
├── Task 3: Create agentation-feedback GitHub Actions workflow [quick]
└── Task 4: Update CI deploy workflow for managed functions [quick]

Wave 2 (After Wave 1 — core implementation):
└── Task 5: Implement feedback API proxy function (depends: 1) [deep]

Wave 3 (After Wave 2 — tests + docs, 2 parallel):
├── Task 6: Write API proxy unit tests (depends: 5) [quick]
└── Task 8: Update README with setup instructions (depends: 3, 4) [writing]

Wave 3b (After Task 6 — verification gate):
└── Task 7: Build + lint + existing test regression check (depends: 2, 5, 6) [quick]

Wave FINAL (After ALL tasks — independent review, 4 parallel):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA (unspecified-high)
└── Task F4: Scope fidelity check (deep)

Critical Path: Task 1 → Task 5 → Task 6 → F1-F4
Parallel Speedup: ~60% faster than sequential
Max Concurrent: 4 (Waves 1 and FINAL)
```

### Dependency Matrix

| Task  | Depends On | Blocks | Wave  |
| ----- | ---------- | ------ | ----- |
| 1     | —          | 5      | 1     |
| 2     | —          | 7      | 1     |
| 3     | —          | 8      | 1     |
| 4     | —          | 8      | 1     |
| 5     | 1          | 6, 7   | 2     |
| 6     | 5          | 7      | 3     |
| 7     | 2, 5, 6    | F1-F4  | 3b    |
| 8     | 3, 4       | F1-F4  | 3     |
| F1-F4 | all        | —      | FINAL |

### Agent Dispatch Summary

- **Wave 1**: **4 tasks** — T1 → `quick`, T2 → `quick`, T3 → `quick`, T4 → `quick`
- **Wave 2**: **1 task** — T5 → `deep`
- **Wave 3**: **2 tasks** — T6 → `quick`, T8 → `writing`
- **Wave 3b**: **1 task** — T7 → `quick` (verification gate, runs after T6)
- **FINAL**: **4 tasks** — F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high`, F4 → `deep`

---

## TODOs

> Implementation + Test = ONE Task. Never separate.
> EVERY task MUST have: Recommended Agent Profile + Parallelization info + QA Scenarios.

- [x] 1. Create feature branch + API folder scaffolding

  **What to do**:
  - Create feature branch: `git checkout -b feat/agentation-integration`
  - Create `api/` directory at repo root with:
    - `api/package.json` — Azure Functions v4 Node.js project. **CRITICAL**: Must NOT have `"type": "module"` (root has ESM, but Azure Functions v4 needs CJS). Include:
      - `"main": "dist/src/functions/*.js"` — **REQUIRED** for Azure Functions v4 runtime to discover registered functions from compiled TypeScript
      - Dependencies: `@azure/functions` (^4.x)
      - DevDependencies: `typescript` (^5.x), `vitest` (latest)
      - Scripts: `"build": "tsc"`, `"start": "func start"`, `"test": "vitest run"`
    - `api/host.json` — Azure Functions v4 extension bundle configuration: `{"version": "2.0", "extensionBundle": {"id": "Microsoft.Azure.Functions.ExtensionBundle", "version": "[4.*, 5.0.0)"}}`
    - `api/tsconfig.json` — Separate from root. Target: `ES2020`, module: `commonjs`, rootDir: `src`, outDir: `dist`, declaration: true, sourceMap: true
  - Run `npm install` inside `api/` to generate `api/package-lock.json`
  - Update `.gitignore`: The repo has a blanket `*.js` ignore. To ensure API compiled output and any JS files in `api/` are not blocked, add BOTH `!api/` AND `!api/**/*.js` exceptions. The first un-ignores the directory itself; the second re-includes JS files within it (Git requires both because a blanket `*.js` rule applies recursively even inside un-ignored directories). Also add `api/dist/` and `api/node_modules/` to the ignore list.
  - Create empty `api/src/functions/` directory (placeholder for Task 5)

  **Must NOT do**:
  - Must NOT add `"type": "module"` to `api/package.json` — Azure Functions v4 uses CJS
  - Must NOT modify root `package.json` or `tsconfig.json`
  - Must NOT install any packages in the root project (only in `api/`)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: File creation and configuration — straightforward scaffolding
  - **Skills**: []
    - No special skills needed for file creation
  - **Skills Evaluated but Omitted**:
    - `git-master`: Simple branch creation doesn't need the skill

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3, 4)
  - **Blocks**: Task 5 (proxy implementation needs the scaffolding)
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References** (existing code to follow):
  - `.gitignore` — Current file has blanket `*.js` ignore; add `!api/` exception after it
  - `tsconfig.json` — Root config for reference (do NOT extend it; API needs its own isolated config)

  **API/Type References** (contracts to implement against):
  - Azure Functions v4 Node.js programming model: `@azure/functions` package
  - SWA managed functions docs: `api/` folder convention

  **External References**:
  - Azure SWA managed functions: https://learn.microsoft.com/en-us/azure/static-web-apps/add-api
  - Azure Functions v4 Node.js: https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference-node?tabs=javascript%2Cwindows%2Cazure-cli&pivots=nodejs-model-v4

  **WHY Each Reference Matters**:
  - `.gitignore`: Without BOTH the `!api/` AND `!api/**/*.js` exceptions, the blanket `*.js` ignore will silently prevent API files from being committed, causing deployment to fail. Git requires both because `*.js` applies recursively even inside un-ignored directories.
  - Azure Functions docs: The `host.json` extension bundle version and `package.json` structure must match v4 model exactly or SWA deploy will fail

  **Acceptance Criteria**:
  - [ ] Feature branch `feat/agentation-integration` exists
  - [ ] `api/package.json` exists with `@azure/functions` dependency, WITHOUT `"type": "module"`
  - [ ] `api/package.json` has `"main": "dist/src/functions/*.js"` field (required for Azure Functions v4 runtime discovery)
  - [ ] `api/package.json` has `typescript` and `vitest` in devDependencies
  - [ ] `api/package.json` has `"build"`, `"start"`, and `"test"` scripts
  - [ ] `api/host.json` exists with v4 extension bundle
  - [ ] `api/tsconfig.json` exists with `module: "commonjs"`, `target: "ES2020"`, `outDir: "dist"`
  - [ ] `api/package-lock.json` exists (npm install ran successfully)
  - [ ] `.gitignore` has `!api/` exception
  - [ ] `.gitignore` has `!api/**/*.js` exception (required because blanket `*.js` applies recursively even inside un-ignored directories)
  - [ ] `api/src/functions/` directory exists

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: API folder structure is complete
    Tool: Bash
    Preconditions: Feature branch checked out
    Steps:
      1. Run `ls -la api/` — verify package.json, host.json, tsconfig.json, package-lock.json exist
      2. Run `ls -la api/src/functions/` — verify directory exists
      3. Run `cat api/package.json | grep -c '"type"'` — expect 0 (no "type": "module")
      4. Run `cat api/package.json | grep '@azure/functions'` — expect match
      5. Run `cat api/package.json | grep '"main"'` — expect match containing `dist/src/functions`
      6. Run `cat api/package.json | grep '"build"'` — expect match containing `tsc`
      7. Run `cat api/package.json | grep '"test"'` — expect match containing `vitest`
      8. Run `cat api/host.json | grep 'extensionBundle'` — expect match
      9. Run `cat api/tsconfig.json | grep 'commonjs'` — expect match
    Expected Result: All files present, correct content, no ESM type, main field points to compiled JS, build/test scripts defined
    Failure Indicators: Missing files, `"type": "module"` present, missing main field, missing scripts
    Evidence: .sisyphus/evidence/task-1-api-scaffolding.txt

  Scenario: .gitignore correctly excludes api/ from JS blanket ignore
    Tool: Bash
    Preconditions: .gitignore updated with BOTH `!api/` AND `!api/**/*.js` exceptions
    Steps:
      1. Run `grep '!api/' .gitignore` — should match the `!api/` exception line
      2. Run `grep '!api/\*\*/\*.js' .gitignore` — should match the `!api/**/*.js` exception line
      3. Create a test file: `touch api/test-ignore-check.js`
      4. Run `git status --porcelain api/test-ignore-check.js` — should show `?? api/test-ignore-check.js` (NOT ignored)
      5. Create a nested test file: `mkdir -p api/src/functions && touch api/src/functions/test-nested.js`
      6. Run `git status --porcelain api/src/functions/test-nested.js` — should show `?? api/src/functions/test-nested.js` (NOT ignored)
      7. Clean up: `rm api/test-ignore-check.js api/src/functions/test-nested.js`
    Expected Result: Both exception lines present in .gitignore, JS files at root AND nested levels of api/ are NOT ignored by git
    Failure Indicators: `git status` shows nothing for either test file (files are being ignored), grep fails to find exception patterns
    Evidence: .sisyphus/evidence/task-1-gitignore-check.txt
  ```

  **Commit**: YES
  - Message: `feat: scaffold api/ folder for SWA managed functions`
  - Files: `api/package.json`, `api/host.json`, `api/tsconfig.json`, `api/package-lock.json`, `api/src/functions/.gitkeep`, `.gitignore`
  - Pre-commit: `npm run lint`

- [x] 2. Install Agentation + wire into Storybook preview decorator

  **What to do**:
  - Install `agentation` as a devDependency: `npm install agentation -D`
  - Modify `.storybook/preview.tsx`:
    - Import `Agentation` from `agentation`
    - Add `<Agentation webhookUrl="/api/feedback" />` INSIDE the existing decorator's JSX return, AFTER `<Story />` but still inside `<FluentProvider>`
    - The component should be rendered unconditionally (this is a deployed Storybook for stakeholders, NOT a local dev tool — do NOT add `NODE_ENV` check)
  - Verify the Storybook still builds: `npm run build`

  **Must NOT do**:
  - Must NOT add `agentation` to `dependencies` or `peerDependencies` — devDependencies only
  - Must NOT create a separate decorator for Agentation — add it inside the existing one
  - Must NOT add `process.env.NODE_ENV === 'development'` check — toolbar should appear in production
  - Must NOT modify any other Storybook config files (main.ts, manager.ts)
  - Must NOT add `onSubmit` callback — use `webhookUrl` prop which handles POST automatically

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single package install + minor JSX modification to one file
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: No design decisions needed, just component wiring

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3, 4)
  - **Blocks**: Task 7 (build regression check)
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References** (existing code to follow):
  - `.storybook/preview.tsx:145-163` — Existing decorator with FluentProvider wrapping. The `<Agentation>` component goes AFTER `<Story />` on line 159, before the closing `</FluentProvider>` on line 160

  **API/Type References** (contracts to implement against):
  - Agentation `webhookUrl` prop: string URL, sends POST on `submit` event with `{ event: "submit", timestamp, url, output, annotations }` payload
  - Agentation `Agentation` component: default import from `agentation` package

  **External References**:
  - Agentation install docs: https://www.agentation.com/install
  - Agentation webhook docs: https://www.agentation.com/webhooks — payload format for `submit` event

  **WHY Each Reference Matters**:
  - `preview.tsx:145-163`: The EXACT insertion point. Placing Agentation inside FluentProvider means it inherits the Fluent theme context. Placing it AFTER `<Story />` means it renders as a sibling overlay, not wrapping the story.
  - Webhook docs: Confirms the `webhookUrl` prop auto-sends on "Send Annotations" click with the correct payload format the API proxy expects

  **Acceptance Criteria**:
  - [ ] `agentation` listed in `devDependencies` in `package.json`
  - [ ] `.storybook/preview.tsx` imports `Agentation` from `agentation`
  - [ ] `<Agentation webhookUrl="/api/feedback" />` rendered inside the decorator's FluentProvider
  - [ ] `npm run build` exits 0 (Storybook builds successfully)
  - [ ] No `NODE_ENV` check around the Agentation component

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Agentation component renders in Storybook dev server
    Tool: Playwright (playwright skill)
    Preconditions: Storybook dev server running (`npm run dev`)
    Steps:
      1. Navigate to `http://localhost:6006/?path=/story/components-buttons-button--default`
      2. Wait for page to fully load (wait for `#storybook-preview-iframe` to exist)
      3. Switch to the story iframe context
      4. Assert that an element with `[data-agentation]` or the Agentation toolbar root exists and is visible
      5. Take screenshot
    Expected Result: Agentation toolbar icon visible in bottom-right corner of story canvas
    Failure Indicators: No Agentation elements found in DOM, toolbar not visible
    Evidence: .sisyphus/evidence/task-2-agentation-renders.png

  Scenario: Storybook build succeeds with Agentation
    Tool: Bash
    Preconditions: agentation installed
    Steps:
      1. Run `npm run build:all`
      2. Check exit code is 0
      3. Verify `storybook-static/` directory contains `index.html`
    Expected Result: Build completes without errors
    Failure Indicators: Non-zero exit code, TypeScript errors, missing output
    Evidence: .sisyphus/evidence/task-2-build-check.txt
  ```

  **Commit**: YES
  - Message: `feat: add Agentation annotation toolbar to Storybook`
  - Files: `package.json`, `package-lock.json`, `.storybook/preview.tsx`
  - Pre-commit: `npm run build:all`

- [x] 3. Create agentation-feedback GitHub Actions workflow

  **What to do**:
  - Create `.github/workflows/agentation-feedback.yml`
  - Trigger: `on: repository_dispatch: types: [agentation_feedback]`
  - Job permissions: `issues: write`, `contents: read`
  - Steps:
    1. Parse the annotation payload from `${{ toJson(github.event.client_payload) }}`
    2. Format a rich GitHub Issue body with:
       - Page URL where feedback was submitted
       - Each annotation with: element selector (`elementPath`), React component path (`reactComponents` if available), user comment, element tag name
       - The pre-formatted markdown output from Agentation (the `output` field)
       - Submission timestamp
    3. Create the issue using `gh issue create` or the GitHub API:
       - Title: `[UI Feedback] {N} annotation(s) from Storybook`
       - Body: formatted annotation details
       - Labels: `ui-feedback`, `copilot` (create labels if they don't exist)
       - Assignees: `copilot`
    4. Add a comment on the issue tagging Copilot if needed: `@copilot please fix the issues described above`

  **Must NOT do**:
  - Must NOT create PRs directly — Copilot handles that via issue assignment
  - Must NOT add complex issue templates or forms
  - Must NOT add Slack/Discord notifications
  - Must NOT add approval gates or manual steps

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single YAML file creation following GitHub Actions conventions
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `git-master`: Not needed for file creation

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 4)
  - **Blocks**: Task 8 (README needs to reference the workflow)
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References** (existing code to follow):
  - `.github/workflows/ci.yml` — Existing workflow for CI/CD conventions (Node 20, ubuntu-latest, action versions)

  **API/Type References** (contracts to implement against):
  - GitHub `repository_dispatch` event: `github.event.client_payload` contains the annotation data
  - Agentation submit payload shape: `{ event: "submit", timestamp: number, url: string, output: string, annotations: Annotation[] }`
  - Annotation type: `{ id, comment, elementPath, element, timestamp, reactComponents?, cssClasses?, url?, boundingBox? }`

  **External References**:
  - GitHub repository_dispatch docs: https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#repository_dispatch
  - GitHub CLI issue creation: `gh issue create --title "..." --body "..." --assignee copilot --label "ui-feedback"`
  - Agentation webhook payload: https://www.agentation.com/webhooks — the `submit` event payload structure

  **WHY Each Reference Matters**:
  - `ci.yml`: Copy Node version, runner, and action version conventions to keep workflows consistent
  - Agentation payload: The workflow parses `client_payload` which mirrors the webhook `submit` event — understanding the field names (`output`, `annotations`, `url`) is critical for formatting the issue body
  - GitHub CLI: `gh issue create --assignee copilot` is the simplest way to create an issue and assign Copilot

  **Acceptance Criteria**:
  - [ ] `.github/workflows/agentation-feedback.yml` exists and is valid YAML
  - [ ] Triggered by `repository_dispatch` with type `agentation_feedback`
  - [ ] Creates an issue with annotation details in the body
  - [ ] Issue assigned to `copilot`
  - [ ] Issue labeled `ui-feedback`

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Workflow file is valid and recognized by GitHub
    Tool: Bash
    Preconditions: Workflow file created
    Steps:
      1. Run `cat .github/workflows/agentation-feedback.yml | python3 -c "import sys,yaml; yaml.safe_load(sys.stdin)"` — verify valid YAML
      2. Run `grep 'repository_dispatch' .github/workflows/agentation-feedback.yml` — verify trigger
      3. Run `grep 'agentation_feedback' .github/workflows/agentation-feedback.yml` — verify event type
      4. Run `grep 'copilot' .github/workflows/agentation-feedback.yml` — verify Copilot assignment
    Expected Result: Valid YAML, correct trigger, correct event type, Copilot referenced
    Failure Indicators: YAML parse error, missing trigger, wrong event type
    Evidence: .sisyphus/evidence/task-3-workflow-valid.txt

  Scenario: Workflow formats issue body with annotation details
    Tool: Bash
    Preconditions: Workflow file exists
    Steps:
      1. Run `grep -c 'client_payload' .github/workflows/agentation-feedback.yml` — verify the workflow references client_payload (annotation data source)
      2. Run `grep -c 'annotations' .github/workflows/agentation-feedback.yml` — verify annotations are referenced in the body template
      3. Run `grep -c 'gh issue create\|github.rest.issues.create\|/repos.*issues' .github/workflows/agentation-feedback.yml` — verify issue creation command exists
      4. Run `grep -c 'copilot' .github/workflows/agentation-feedback.yml` — verify Copilot referenced as assignee
      5. Run `grep -c 'ui-feedback' .github/workflows/agentation-feedback.yml` — verify label referenced
    Expected Result: All 5 greps return ≥1 — workflow file contains all required elements for issue creation with annotation context
    Failure Indicators: Any grep returns 0 — missing key workflow element
    Evidence: .sisyphus/evidence/task-3-issue-format.txt
  ```

  **Commit**: YES
  - Message: `feat: add agentation-feedback GitHub Actions workflow`
  - Files: `.github/workflows/agentation-feedback.yml`
  - Pre-commit: —

- [x] 4. Update CI deploy workflow for SWA managed functions

  **What to do**:
  - Modify `.github/workflows/ci.yml` deploy job:
    1. Add `actions/checkout@v4` step BEFORE the download-artifact step — the deploy job currently only downloads the storybook-static artifact, but SWA deploy needs the `api/` folder from the repo
    2. Add `api_location: api` to the `Azure/static-web-apps-deploy@v1` `with:` block — this tells SWA to build and deploy managed functions from the `api/` folder
    3. Keep `skip_app_build: true` — the static Storybook is still pre-built in the build job
  - Verify the workflow is valid YAML after changes

  **Must NOT do**:
  - Must NOT change the build job
  - Must NOT remove `skip_app_build: true`
  - Must NOT change the deploy trigger conditions (`if: github.ref == 'refs/heads/main'`)
  - Must NOT add secrets or environment variables to the workflow file (the GITHUB_TOKEN for the proxy is set in Azure Portal, not in CI)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Small YAML edit to existing workflow — 3 lines added
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `git-master`: Not needed for a small file edit

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3)
  - **Blocks**: Task 8 (README references CI changes)
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References** (existing code to follow):
  - `.github/workflows/ci.yml:31-51` — The deploy job to modify. Currently has download-artifact → SWA deploy. Need to add checkout before download-artifact and api_location to SWA deploy

  **External References**:
  - SWA deploy action with API: https://learn.microsoft.com/en-us/azure/static-web-apps/build-configuration — `api_location` parameter documentation
  - `Azure/static-web-apps-deploy@v1` action: `api_location` tells the action where to find the managed functions folder

  **WHY Each Reference Matters**:
  - `ci.yml:31-51`: The EXACT lines being modified. Without `actions/checkout@v4`, the deploy job won't have the `api/` folder. Without `api_location: api`, SWA won't know to deploy managed functions.

  **Acceptance Criteria**:
  - [ ] `ci.yml` deploy job has `actions/checkout@v4` step
  - [ ] `ci.yml` deploy job has `api_location: api` in SWA deploy action
  - [ ] `ci.yml` still has `skip_app_build: true`
  - [ ] `ci.yml` is valid YAML

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: CI workflow is valid and has required changes
    Tool: Bash
    Preconditions: ci.yml modified
    Steps:
      1. Run `cat .github/workflows/ci.yml | python3 -c "import sys,yaml; yaml.safe_load(sys.stdin)"` — verify valid YAML
      2. Run `grep -A2 'actions/checkout' .github/workflows/ci.yml` — verify checkout exists in deploy job
      3. Run `grep 'api_location' .github/workflows/ci.yml` — verify api_location present
      4. Run `grep 'skip_app_build: true' .github/workflows/ci.yml` — verify still present
    Expected Result: Valid YAML with checkout, api_location, and skip_app_build all present
    Failure Indicators: Invalid YAML, missing checkout, missing api_location
    Evidence: .sisyphus/evidence/task-4-ci-workflow.txt

  Scenario: Deploy job structure is correct (checkout before download)
    Tool: Bash
    Preconditions: ci.yml modified
    Steps:
      1. Extract deploy job steps and verify order: checkout → download-artifact → SWA deploy
      2. Run `python3 -c "import yaml; data=yaml.safe_load(open('.github/workflows/ci.yml')); steps=data['jobs']['deploy']['steps']; uses=[s.get('uses','') for s in steps]; print(uses)"` — verify step order
    Expected Result: checkout@v4 appears before download-artifact@v4 in the deploy job
    Failure Indicators: Wrong order, missing steps
    Evidence: .sisyphus/evidence/task-4-deploy-order.txt
  ```

  **Commit**: YES
  - Message: `ci: update deploy job for SWA managed functions`
  - Files: `.github/workflows/ci.yml`
  - Pre-commit: —

- [x] 5. Implement feedback API proxy function

  **What to do**:
  - Create `api/src/functions/feedback.ts` — the SWA managed function that receives annotation payloads from Agentation and forwards them to GitHub `repository_dispatch`
  - Function must:
    1. Register as an HTTP trigger at route `/feedback` (maps to `/api/feedback` on SWA)
    2. Accept POST requests only. The Azure Functions v4 runtime enforces this via `methods: ['POST']` in the registration — non-POST requests will receive a 404 from the runtime before reaching the handler. The handler itself does NOT need to check the HTTP method or return 405.
    3. Parse the JSON body. Validate:
       - `event` field equals `"submit"` (reject other event types with 400)
       - `annotations` array exists and has at least one item (reject empty with 400, include message: `"No annotations to submit"`)
       - Total payload size under 1MB (reject with 413)
    4. Forward to GitHub `repository_dispatch` API:
       - URL: `https://api.github.com/repos/unthinkmedia/AzureStorybook/dispatches`
       - Method: POST
       - Headers: `Authorization: Bearer ${process.env.GITHUB_TOKEN}`, `Accept: application/vnd.github+json`, `X-GitHub-Api-Version: 2022-11-28`
       - Body: `{ event_type: "agentation_feedback", client_payload: { output, annotations, url, timestamp } }`
    5. Return responses:
       - 200 `{ ok: true }` on success
       - 400 `{ error: "..." }` for validation failures
       - 502 `{ error: "Failed to dispatch to GitHub" }` if GitHub API returns non-2xx
    6. Note: non-POST methods are handled by the Azure Functions runtime (returns 404 automatically when `methods: ['POST']` is set) — the handler does NOT need a 405 check
    7. Log errors to console (Azure Functions captures these in Application Insights automatically)
  - Use Node.js built-in `fetch` (Node 20 has it) — NO additional HTTP libraries needed

  **Must NOT do**:
  - Must NOT use `node-fetch`, `axios`, or any HTTP library — use built-in `fetch`
  - Must NOT store or log the `GITHUB_TOKEN` value
  - Must NOT add CORS headers (SWA handles CORS for managed functions automatically)
  - Must NOT add rate limiting in the function itself (SWA has built-in rate limiting)
  - Must NOT import from the root project — `api/` is a standalone module

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Core business logic with validation, error handling, and external API integration — needs careful implementation
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `azure-observability`: Function auto-logs to App Insights without explicit instrumentation

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (solo)
  - **Blocks**: Task 6 (unit tests), Task 7 (build check)
  - **Blocked By**: Task 1 (needs API scaffolding)

  **References**:

  **Pattern References** (existing code to follow):
  - `api/package.json` (created in Task 1) — confirms `@azure/functions` dependency and CJS module system
  - `api/tsconfig.json` (created in Task 1) — confirms TypeScript compilation target and module format

  **API/Type References** (contracts to implement against):
  - Azure Functions v4 HTTP trigger: `app.http('feedback', { methods: ['POST'], route: 'feedback', handler })` — the v4 programming model registration pattern
  - `HttpRequest` / `HttpResponseInit` types from `@azure/functions`
  - Agentation webhook payload: `{ event: "submit", timestamp: number, url: string, output: string, annotations: Array<{ id: string, comment: string, elementPath: string, element: string, timestamp: number, reactComponents?: string[], cssClasses?: string[] }> }`
  - GitHub repository_dispatch API: `POST /repos/{owner}/{repo}/dispatches` with `{ event_type: string, client_payload: object }`

  **External References**:
  - Azure Functions v4 HTTP trigger (Node.js): https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference-node?tabs=javascript%2Cwindows%2Cazure-cli&pivots=nodejs-model-v4#http-trigger
  - GitHub repository_dispatch: https://docs.github.com/en/rest/repos/repos#create-a-repository-dispatch-event
  - Agentation webhook payload format: https://www.agentation.com/webhooks

  **WHY Each Reference Matters**:
  - Azure Functions v4 docs: The `app.http()` registration pattern is different from v3. Must use v4 model with `HttpRequest`/`HttpResponseInit` types, NOT `context.res` pattern.
  - GitHub dispatch API: Requires `contents: write` scope on token, returns 204 on success (not 200). The function must check for 204 specifically.
  - Agentation payload: The exact field names (`output`, `annotations`, `url`, `event`) must match what the `webhookUrl` prop sends — any mismatch means silent failures.

  **Acceptance Criteria**:
  - [ ] `api/src/functions/feedback.ts` exists and compiles (`cd api && npx tsc --noEmit`)
  - [ ] Function registers as HTTP trigger at route `feedback`
  - [ ] POST with valid payload → 200 response
  - [ ] POST with empty annotations → 400 response with error message
  - [ ] POST with missing `event` field → 400 response
  - [ ] Non-POST methods → 404 response (Azure Functions runtime enforces `methods: ['POST']` — runtime returns 404, not the handler)
  - [ ] GitHub API failure → 502 response
  - [ ] Uses `process.env.GITHUB_TOKEN` for auth header
  - [ ] No additional HTTP libraries installed

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Empty annotations returns 400
    Tool: Bash (curl)
    Preconditions: API function compiled, Azure Functions Core Tools available (install globally if needed: `npm install -g azure-functions-core-tools@4`). Start the function host: `cd api && npm run build && func start &`, wait 5s for port 7071
    Steps:
      1. Run `curl -s -o /tmp/feedback-400.json -w "%{http_code}" -X POST http://localhost:7071/api/feedback -H "Content-Type: application/json" -d '{"event":"submit","annotations":[]}'`
      2. Assert HTTP status is 400
      3. Assert response body contains error message about empty annotations
    Expected Result: 400 with `{ error: "No annotations to submit" }`
    Failure Indicators: 200 status (no validation), 500 (crash)
    Evidence: .sisyphus/evidence/task-5-empty-annotations.txt

  Scenario: Missing event field returns 400
    Tool: Bash (curl)
    Preconditions: Function running
    Steps:
      1. Run `curl -s -o /tmp/feedback-400-event.json -w "%{http_code}" -X POST http://localhost:7071/api/feedback -H "Content-Type: application/json" -d '{"annotations":[{"id":"a1","comment":"test","elementPath":"div","element":"div","timestamp":123}]}'`
      2. Assert HTTP status is 400
      3. Assert response body contains error about missing or wrong event type
    Expected Result: 400 with error about event field
    Failure Indicators: 200 or 502 status
    Evidence: .sisyphus/evidence/task-5-missing-event.txt

  Scenario: Non-POST method returns 404 (runtime-enforced)
    Tool: Bash (curl)
    Preconditions: Function running
    Steps:
      1. Run `curl -s -o /tmp/feedback-404.json -w "%{http_code}" -X GET http://localhost:7071/api/feedback`
      2. Assert HTTP status is 404 (Azure Functions runtime rejects methods not in the `methods: ['POST']` registration)
    Expected Result: 404 — request rejected by runtime for unregistered method
    Failure Indicators: 200 status (handler was reached despite GET)
    Evidence: .sisyphus/evidence/task-5-method-not-allowed.txt

  Scenario: Valid payload reaches GitHub dispatch (verified via unit tests in Task 6)
    Tool: Bash
    Preconditions: Task 6 complete (unit tests mock fetch and verify dispatch call)
    Steps:
      1. Run `cd api && npm test -- --reporter=verbose 2>&1 | grep "Valid submit"` — verify the unit test for valid submit exists and passes
      2. Assert output shows the test passed
    Expected Result: Unit test confirms valid payload → fetch called with correct GitHub API URL, headers, and body → 200 returned
    Failure Indicators: Test not found or failing
    Evidence: .sisyphus/evidence/task-5-valid-submit-via-unittest.txt
  ```

  **Commit**: YES (Task 5)
  - Message: `feat: implement feedback API proxy`
  - Files: `api/src/functions/feedback.ts`
  - Pre-commit: `cd api && npm run build`

- [x] 6. Write API proxy unit tests

  **What to do**:
  - Create `api/__tests__/feedback.test.ts` with vitest (already installed as devDependency in `api/package.json` from Task 1)
  - Vitest and the `"test"` script are already configured in `api/package.json` from Task 1
  - Test cases:
    1. **Valid submit → 200**: POST with valid payload (event, annotations, url, timestamp) → returns 200 with `{ ok: true }`. Mock `fetch` to return 204 (GitHub success).
    2. **Empty annotations → 400**: POST with `annotations: []` → returns 400 with error message.
    3. **Missing event field → 400**: POST without `event` field → returns 400.
    4. **Wrong event type → 400**: POST with `event: "annotation.add"` → returns 400 (only `submit` accepted).
    5. **GitHub API failure → 502**: Mock `fetch` to return 500 from GitHub → function returns 502.
    6. **GitHub API network error → 502**: Mock `fetch` to throw (network failure) → function returns 502.
  - Mock `fetch` globally (vitest `vi.fn()`) — don't make real GitHub API calls
  - Mock `process.env.GITHUB_TOKEN` to a test value

  **Must NOT do**:
  - Must NOT make real GitHub API calls in tests
  - Must NOT import from the root project's test setup — `api/` tests are standalone
  - Must NOT add test infrastructure to the root project — only to `api/`

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Standard unit tests following clear test patterns — input/output assertions with mocks
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - None relevant

  **Parallelization**:
  - **Can Run In Parallel**: YES (within Wave 3)
  - **Parallel Group**: Wave 3 (with Task 8)
  - **Blocks**: Task 7 (verification gate needs vitest + test script)
  - **Blocked By**: Task 5 (needs the function to test)

  **References**:

  **Pattern References** (existing code to follow):
  - `src/themes/__tests__/themeRegistry.test.ts` — Existing vitest test in the project. Shows import patterns, `describe`/`it`/`expect` usage, and assertion style (though this is in root, API tests follow same vitest conventions).
  - `api/src/functions/feedback.ts` (created in Task 5) — The function under test. Import the handler and invoke it with mock `HttpRequest` objects.

  **API/Type References** (contracts to implement against):
  - `HttpRequest` from `@azure/functions` — mock constructor: `new HttpRequest({ method: 'POST', url: '...', body: { string: JSON.stringify(payload) }, headers: { 'content-type': 'application/json' } })`
  - vitest mock API: `vi.fn()`, `vi.stubGlobal('fetch', mockFetch)`, `vi.unstubAllGlobals()`

  **External References**:
  - vitest mocking: https://vitest.dev/api/vi.html#vi-fn
  - Azure Functions v4 testing: https://learn.microsoft.com/en-us/azure/azure-functions/functions-test-a-function

  **WHY Each Reference Matters**:
  - `themeRegistry.test.ts`: Shows the team's test writing style (assertion patterns, describe grouping) — API tests should feel consistent.
  - Azure Functions testing docs: Shows how to construct mock `HttpRequest` objects for v4 model, which is different from v3's `context` pattern.

  **Acceptance Criteria**:
  - [ ] `api/__tests__/feedback.test.ts` exists
  - [ ] `cd api && npm test` exits 0 with all tests passing
  - [ ] At least 6 test cases covering: valid submit, empty annotations, missing event, wrong event type, GitHub failure, network error
  - [ ] No real GitHub API calls made during tests

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: All unit tests pass
    Tool: Bash
    Preconditions: Test file created, vitest installed in api/
    Steps:
      1. Run `cd api && npm install` (ensure vitest is installed)
      2. Run `cd api && npm test 2>&1 | tee /tmp/api-test-output.txt`
      3. Assert exit code is 0
      4. Assert output contains "6 passed" or higher (at least 6 test cases)
      5. Assert output contains "0 failed"
    Expected Result: All 6+ tests pass with 0 failures
    Failure Indicators: Non-zero exit code, any test failures, import errors
    Evidence: .sisyphus/evidence/task-6-unit-tests.txt

  Scenario: Tests don't make real HTTP calls
    Tool: Bash
    Preconditions: Tests exist
    Steps:
      1. Disconnect network (or verify): Run tests with `GITHUB_TOKEN=fake-token cd api && npm test`
      2. Verify all tests still pass (proving no real API calls)
      3. Grep test file for `vi.fn` or `vi.stubGlobal` — verify fetch is mocked
    Expected Result: Tests pass without real network, fetch is mocked
    Failure Indicators: Tests fail without network, no mock setup found
    Evidence: .sisyphus/evidence/task-6-no-real-calls.txt
  ```

  **Commit**: YES
  - Message: `test: add API proxy unit tests`
  - Files: `api/__tests__/feedback.test.ts`
  - Pre-commit: `cd api && npm test`

- [x] 7. Build + lint + existing test regression check

  **What to do**:
  - Run full project build and verification to ensure nothing is broken:
    1. `npm run build:all` — Storybook builds with Agentation component (root project)
    2. `npm run lint` — no new lint errors introduced
    3. `npm run test` — existing tests still pass (root project)
    4. `cd api && npx tsc --noEmit` — API TypeScript compiles cleanly
    5. `cd api && npm test` — API tests pass
  - If ANY of these fail, investigate and fix the root cause (likely in Task 2 or Task 5 changes)
  - This task is a gatekeeper — it ensures all previous tasks integrate cleanly

  **Must NOT do**:
  - Must NOT fix pre-existing lint warnings/errors (only fix NEW issues from this branch)
  - Must NOT modify code unless fixing a regression caused by Tasks 1-6
  - Must NOT add new features or functionality

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Running commands and verifying output — no creative work
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - None — this is pure verification

  **Parallelization** (Task 7):
  - **Can Run In Parallel**: NO (runs after Task 6 completes)
  - **Parallel Group**: Wave 3b (after Tasks 6 and 8 are dispatched)
  - **Blocks**: F1-F4 (final verification must wait for gate to pass)
  - **Blocked By**: Task 2 (Storybook changes), Task 5 (API changes), Task 6 (adds vitest + test script to api/)

  **References**:

  **Pattern References** (existing code to follow):
  - `package.json` — `scripts` section for exact build/lint/test commands
  - `.github/workflows/ci.yml` — CI build job shows the canonical build sequence

  **WHY Each Reference Matters**:
  - `package.json` scripts: Use the EXACT script names (`build:all`, `lint`, `test`) — don't improvise alternative commands
  - `ci.yml`: Shows what CI will run after merge — this task should replicate CI locally to catch issues before push

  **Acceptance Criteria**:
  - [ ] `npm run build:all` exits 0
  - [ ] `npm run lint` exits 0 (or only pre-existing warnings)
  - [ ] `npm run test` exits 0 (all existing tests pass)
  - [ ] `cd api && npx tsc --noEmit` exits 0
  - [ ] `cd api && npm test` exits 0
  - [ ] `storybook-static/` directory contains `index.html`

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Full project build succeeds
    Tool: Bash
    Preconditions: All Tasks 1-6 complete
    Steps:
      1. Run `npm run build:all 2>&1 | tail -20` — capture last 20 lines
      2. Assert exit code is 0
      3. Run `ls storybook-static/index.html` — verify output exists
    Expected Result: Build completes, storybook-static/index.html exists
    Failure Indicators: Non-zero exit code, TypeScript errors, missing output
    Evidence: .sisyphus/evidence/task-7-build.txt

  Scenario: Lint and tests pass
    Tool: Bash
    Preconditions: All Tasks 1-6 complete
    Steps:
      1. Run `npm run lint 2>&1 | tail -10` — assert exit 0
      2. Run `npm run test 2>&1 | tail -10` — assert exit 0
      3. Run `cd api && npx tsc --noEmit 2>&1` — assert exit 0
      4. Run `cd api && npm test 2>&1 | tail -10` — assert exit 0
    Expected Result: All 4 commands exit 0
    Failure Indicators: Any non-zero exit, lint errors, test failures, type errors
    Evidence: .sisyphus/evidence/task-7-lint-test.txt
  ```

  **Commit**: NO (verification only — no file changes unless fixing a regression, in which case commit the fix with message `fix: [description of regression fixed]`)

- [x] 8. Update README with Agentation integration setup instructions

  **What to do**:
  - Add a new section to `README.md` titled `## Agentation Integration` (place it after the "Deployment" section)
  - Content to include:
    1. **Overview**: Brief description of what Agentation enables (stakeholder annotation → GitHub Issues → Copilot PRs)
    2. **Architecture diagram** (text-based):
       ```
       Storybook → /api/feedback (SWA proxy) → GitHub repository_dispatch → GH Actions → Issue → Copilot PR
       ```
    3. **Environment Variables**:
       - `GITHUB_TOKEN` — Required. Set in Azure Portal → Static Web App → Configuration → Application Settings
       - Must have `contents: write` scope (for `repository_dispatch`)
       - Recommend: GitHub App token for longevity, or fine-grained PAT for simplicity
    4. **How Stakeholders Use It**:
       - Visit deployed Storybook → click Agentation toolbar → click elements → add comments → click "Send Annotations"
       - One GitHub Issue created per submission, auto-assigned to Copilot
    5. **Local Development**:
       - API proxy requires SWA CLI (`npx swa start`) or Azure Functions Core Tools (`cd api && npx func start`)
       - Set `GITHUB_TOKEN` in `api/local.settings.json` (NOT committed — already in `.gitignore`)

  **Must NOT do**:
  - Must NOT remove or modify existing README sections
  - Must NOT add setup instructions that require manual infrastructure provisioning
  - Must NOT include actual tokens or secrets in examples
  - Must NOT over-document — keep it concise and actionable

  **Recommended Agent Profile**:
  - **Category**: `writing`
    - Reason: Documentation task — clear technical writing for mixed developer/stakeholder audience
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - None relevant

  **Parallelization**:
  - **Can Run In Parallel**: YES (within Wave 3)
  - **Parallel Group**: Wave 3 (with Task 6)
  - **Blocks**: F1-F4 (final verification references README)
  - **Blocked By**: Tasks 3, 4 (needs to reference workflow and CI changes)

  **References**:

  **Pattern References** (existing code to follow):
  - `README.md` — Current structure and tone. Match the existing heading levels, table format, and code block style. The "Deployment" section is the insertion point (add AFTER it).

  **API/Type References**:
  - `staticwebapp.config.json` — For referencing SWA configuration
  - `.github/workflows/agentation-feedback.yml` (created in Task 3) — For describing the workflow
  - `.github/workflows/ci.yml` (modified in Task 4) — For describing CI changes

  **External References**:
  - SWA environment variables: https://learn.microsoft.com/en-us/azure/static-web-apps/application-settings
  - GitHub fine-grained PATs: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token

  **WHY Each Reference Matters**:
  - `README.md`: Must match existing doc style — current README uses `##` headings, tables, code blocks with language hints. New section should feel native.
  - SWA env vars docs: The EXACT Azure Portal path for setting `GITHUB_TOKEN` — stakeholders/devops need this for deployment.

  **Acceptance Criteria**:
  - [ ] `README.md` has a new `## Agentation Integration` section
  - [ ] Section includes architecture overview, env var instructions, and usage guide
  - [ ] No secrets or real tokens in the README
  - [ ] Existing README sections unchanged
  - [ ] Markdown renders correctly (no broken formatting)

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: README has Agentation section with required content
    Tool: Bash
    Preconditions: README.md updated
    Steps:
      1. Run `grep '## Agentation Integration' README.md` — verify section exists
      2. Run `grep 'GITHUB_TOKEN' README.md` — verify env var documented
      3. Run `grep 'repository_dispatch' README.md` — verify architecture referenced
      4. Run `grep 'copilot' README.md` — verify Copilot mentioned (case-insensitive)
      5. Run `grep -c 'ghp_\|github_pat_\|gho_' README.md` — assert 0 (no real tokens)
    Expected Result: Section exists with all key topics, no leaked secrets
    Failure Indicators: Missing section, missing key terms, real tokens found
    Evidence: .sisyphus/evidence/task-8-readme.txt

  Scenario: Existing README content preserved
    Tool: Bash
    Preconditions: README.md updated
    Steps:
      1. Run `grep '## Quick Start' README.md` — still present
      2. Run `grep '## Deployment' README.md` — still present
      3. Run `grep '## Tech Stack' README.md` — still present
      4. Run `grep 'npm run dev' README.md` — still present
    Expected Result: All existing sections and key content preserved
    Failure Indicators: Missing existing sections, overwritten content
    Evidence: .sisyphus/evidence/task-8-readme-preserved.txt
  ```

  **Commit**: YES
  - Message: `docs: add Agentation integration setup to README`
  - Files: `README.md`
  - Pre-commit: —

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [x] F1. **Plan Compliance Audit** — `oracle`

  **What to do**:
  Read the plan end-to-end. For each "Must Have": verify implementation exists. For each "Must NOT Have": search codebase for forbidden patterns. Check evidence files exist. Compare deliverables against plan.

  **QA Scenarios:**

  ```
  Scenario: All "Must Have" items are present
    Tool: Bash
    Steps:
      1. Run `grep -r 'agentation' .storybook/preview.tsx` — Agentation component wired into decorator
      2. Run `ls api/src/functions/feedback.ts` — API proxy exists
      3. Run `ls .github/workflows/agentation-feedback.yml` — Workflow exists
      4. Run `grep 'api_location' .github/workflows/ci.yml` — CI updated for managed functions
      5. Run `grep 'copilot' .github/workflows/agentation-feedback.yml` — Copilot assignment present
      6. Run `ls api/__tests__/feedback.test.ts` — Unit tests exist
      7. Run `grep 'Agentation Integration' README.md` — README section exists
      8. Run `grep '!api/' .gitignore` — Gitignore exception present
      9. Run `cd api && npm test 2>&1 | tail -5` — API tests pass
      10. Run `npm run build:all 2>&1 | tail -5` — Full build passes
    Expected Result: All 10 checks pass — every "Must Have" verified
    Evidence: .sisyphus/evidence/final-f1-must-have.txt

  Scenario: All "Must NOT Have" items are absent
    Tool: Bash
    Steps:
      1. Run `grep -rn 'GITHUB_TOKEN\|ghp_\|github_pat_' .storybook/ src/ --include='*.ts' --include='*.tsx'` — no tokens in client code (expect 0 matches)
      2. Run `grep -rn '"type".*"module"' api/package.json` — no ESM in API (expect 0 matches)
      3. Run `grep -rn 'Azure.*AD\|azure-ad\|msal' .storybook/ src/ --include='*.ts' --include='*.tsx'` — no auth added (expect 0 matches)
      4. Run `grep -rn 'node-fetch\|axios' api/package.json` — no extra HTTP libs (expect 0 matches)
      5. Run `grep -rn 'peerDependencies.*agentation\|"agentation"' package.json | grep -v devDependencies` — agentation only in devDeps
    Expected Result: All 5 checks return 0 matches — no forbidden patterns found
    Evidence: .sisyphus/evidence/final-f1-must-not-have.txt
  ```

  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [x] F2. **Code Quality Review** — `unspecified-high`

  **What to do**:
  Run build toolchain and review all changed files for code quality issues.

  **QA Scenarios:**

  ```
  Scenario: Build, lint, and tests all pass
    Tool: Bash
    Steps:
      1. Run `npm run build:all 2>&1 | tail -5` — assert exit 0
      2. Run `npm run lint 2>&1 | tail -10` — assert exit 0
      3. Run `npm run test 2>&1 | tail -10` — assert exit 0
      4. Run `cd api && npm run build 2>&1` — assert exit 0
      5. Run `cd api && npm test 2>&1 | tail -10` — assert exit 0
    Expected Result: All 5 commands exit 0
    Evidence: .sisyphus/evidence/final-f2-build.txt

  Scenario: Changed files have no code quality issues
    Tool: Bash
    Steps:
      1. Run `grep -rn 'as any\|@ts-ignore\|@ts-expect-error' api/src/ .storybook/preview.tsx` — expect 0 matches (no type escapes)
      2. Run `grep -rn 'console\.log' api/src/functions/feedback.ts` — expect 0 matches (use console.error for errors only)
      3. Run `grep -rn '// TODO\|// HACK\|// FIXME' api/src/ .github/workflows/agentation-feedback.yml` — expect 0 matches (no leftover markers)
      4. Run `grep -rn 'data\b.*=\|result\b.*=\|temp\b.*=' api/src/functions/feedback.ts | wc -l` — expect ≤2 (no generic variable names)
    Expected Result: No type escapes, no console.log in prod, no leftover markers, minimal generic names
    Evidence: .sisyphus/evidence/final-f2-quality.txt
  ```

  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Tests [N pass/N fail] | Files [N clean/N issues] | VERDICT`

- [x] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)

  **What to do**:
  Start BOTH the Storybook dev server AND the API backend so that the full annotation-to-submit flow is testable end-to-end. Use Playwright to exercise the complete user journey across all six product×appearance theme combinations (azure-light, azure-dark, azure-hc, sreagent-light, sreagent-dark, sreagent-hc). Save screenshots and network evidence.

  **Tool Prerequisites**:
  - Azure Functions Core Tools must be installed globally (`npm install -g azure-functions-core-tools@4 --unsafe-perm true`) — needed to run the API backend locally
  - Alternatively, if Core Tools is already available on the system (check: `func --version`), skip the install

  **QA Scenarios:**

  ```
  Scenario: Full annotation submit flow with live API backend
    Tool: Playwright (playwright skill) + Bash (background processes)
    Preconditions: Feature branch checked out, `npm install` and `cd api && npm install` complete, Azure Functions Core Tools available
    Steps:
      1. Start Storybook dev server in background: `npm run dev &` — wait for port 6006 (poll with `curl -s http://localhost:6006` until 200)
      2. Build and start the API backend in background: `cd api && npm run build && func start --port 7071 &` — wait for port 7071 (poll with `curl -s http://localhost:7071` until response)
      3. Open Playwright browser to `http://localhost:6006`
      4. Navigate to any story page (e.g., click first story in sidebar or go to `http://localhost:6006/?path=/story/components-buttons-button--default`)
      5. Switch to the story iframe context (Storybook renders stories in `#storybook-preview-iframe`)
      6. Assert Agentation toolbar is visible: selector `[data-agentation]` or the Agentation container element exists in DOM
      7. Click on a UI element in the story canvas to create an annotation
      8. Type a comment: "Test annotation from QA"
      9. Click "Send Annotations" button
      10. Assert network request: POST to `/api/feedback` was sent (use Playwright request interception or check browser console network tab)
      11. Note: the POST may return an error if GITHUB_TOKEN is not configured locally — that's OK. The key assertion is that the POST fires and reaches the API function (i.e., non-network-error response)
      12. Take screenshot: `.sisyphus/evidence/final-qa/submit-flow.png`
      13. Clean up: kill background processes (`kill %1 %2` or `pkill -f "storybook"` and `pkill -f "func start"`)
    Expected Result: Annotation toolbar renders, annotation can be created and submitted, POST to /api/feedback fires and reaches the API function
    Failure Indicators: Toolbar not visible, submit button doesn't fire POST, network error before reaching API
    Evidence: .sisyphus/evidence/final-qa/submit-flow.png

  Scenario: Agentation toolbar renders in all six product×appearance theme combinations
    Tool: Playwright (playwright skill)
    Preconditions: Storybook dev server running on port 6006 (from previous scenario — or restart with `npm run dev &`)
    Steps:
      1. Navigate to `http://localhost:6006/?path=/story/components-buttons-button--default`
      2. For each of the 6 theme combinations:
         [azure-light, azure-dark, azure-hc, sreagent-light, sreagent-dark, sreagent-hc]
         a. Switch product theme via the Storybook toolbar "Product Theme" dropdown (managed by `.storybook/addons/theme-switcher/manager.tsx`)
         b. Switch appearance mode via the Storybook toolbar appearance selector
         c. Wait 1s for theme to apply
         d. Switch to the story iframe context (`#storybook-preview-iframe`)
         e. Assert Agentation toolbar/container element (`[data-agentation]`) is still visible in DOM
         f. Take screenshot: `.sisyphus/evidence/final-qa/theme-{product}-{appearance}.png`
      3. Verify screenshots show toolbar rendered without visual breakage (no invisible text, no overflow, no z-index collision with Storybook UI)
    Expected Result: Agentation toolbar visible and functional in all 6 theme combinations
    Failure Indicators: Toolbar disappears on theme switch, elements become invisible against background, layout breaks in any combination
    Evidence: .sisyphus/evidence/final-qa/theme-azure-light.png, theme-azure-dark.png, theme-azure-hc.png, theme-sreagent-light.png, theme-sreagent-dark.png, theme-sreagent-hc.png

  Scenario: Cross-task integration — CI workflow file is valid YAML
    Tool: Bash
    Steps:
      1. Run `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/agentation-feedback.yml'))"` — verify valid YAML
      2. Run `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/ci.yml'))"` — verify still valid after modifications
    Expected Result: Both workflow files parse as valid YAML without errors
    Failure Indicators: YAML parse error
    Evidence: .sisyphus/evidence/final-qa/yaml-validation.txt

  Scenario: API proxy builds and tests pass
    Tool: Bash
    Preconditions: `cd api && npm install` complete
    Steps:
      1. Run `cd api && npm run build` — TypeScript compilation
      2. Assert exit code 0
      3. Assert `api/dist/src/functions/feedback.js` exists
      4. Run `cd api && npm test` — unit tests
      5. Assert all tests pass
    Expected Result: API compiles cleanly and all unit tests pass
    Failure Indicators: TypeScript errors, missing output file, test failures
    Evidence: .sisyphus/evidence/final-qa/api-build.txt
  ```

  Output: `Scenarios [N/N pass] | Themes [6/6] | Screenshots [N captured] | VERDICT`

- [x] F4. **Scope Fidelity Check** — `deep`

  **What to do**:
  For each task: read "What to do", read actual diff. Verify 1:1 — everything in spec was built, nothing beyond spec was built. Check "Must NOT do" compliance. Detect cross-task contamination.

  **QA Scenarios:**

  ```
  Scenario: Only expected files were changed
    Tool: Bash
    Steps:
      1. Run `git diff --name-only main...HEAD | sort` — get list of all changed files on this branch
      2. Compare against expected file list: `api/package.json`, `api/package-lock.json`, `api/host.json`, `api/tsconfig.json`, `api/src/functions/feedback.ts`, `api/__tests__/feedback.test.ts`, `.storybook/preview.tsx`, `package.json`, `package-lock.json`, `.gitignore`, `.github/workflows/ci.yml`, `.github/workflows/agentation-feedback.yml`, `README.md`, `api/src/functions/.gitkeep` (optional)
      3. Flag any files NOT in the expected list as unaccounted
    Expected Result: All changed files are in the expected list, 0 unaccounted files
    Evidence: .sisyphus/evidence/final-f4-files.txt

  Scenario: No cross-task contamination
    Tool: Bash
    Steps:
      1. Run `git log --oneline main...HEAD` — list all commits
      2. For each commit, run `git diff --name-only <commit>~1..<commit>` — verify files match the commit strategy table
      3. Check that no commit touches files assigned to a different task (e.g., Task 2 commit should NOT touch `api/` files)
    Expected Result: Each commit only touches its designated files per the Commit Strategy table
    Evidence: .sisyphus/evidence/final-f4-contamination.txt
  ```

  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

| #   | Message                                                 | Files                                                                                           | Pre-commit check    |
| --- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------- |
| 1   | `feat: scaffold api/ folder for SWA managed functions`  | `api/package.json`, `api/host.json`, `api/tsconfig.json`, `api/package-lock.json`, `.gitignore` | `npm run lint`      |
| 2   | `feat: add Agentation annotation toolbar to Storybook`  | `package.json`, `package-lock.json`, `.storybook/preview.tsx`                                   | `npm run build:all` |
| 3   | `feat: add agentation-feedback GitHub Actions workflow` | `.github/workflows/agentation-feedback.yml`                                                     | —                   |
| 4   | `ci: update deploy job for SWA managed functions`       | `.github/workflows/ci.yml`                                                                      | —                   |
| 5   | `feat: implement feedback API proxy`                    | `api/src/functions/feedback.ts`                                                                 | `npm run build:all` |
| 6   | `test: add API proxy unit tests`                        | `api/__tests__/feedback.test.ts`                                                                | `npm run test`      |
| 7   | `docs: add Agentation integration setup to README`      | `README.md`                                                                                     | —                   |

---

## Success Criteria

### Verification Commands

```bash
npm run build:all          # Expected: exit 0, storybook-static/ built
npm run test               # Expected: all tests pass
npm run lint               # Expected: no errors
curl -X POST http://localhost:7071/api/feedback \
  -H 'Content-Type: application/json' \
  -d '{"event":"submit","annotations":[]}'  # Expected: 400 (empty annotations)
gh workflow list           # Expected: shows agentation-feedback workflow
```

### Final Checklist

- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] All tests pass
- [ ] CI pipeline deploys both static site and API
- [ ] GitHub Issues created with full annotation context
- [ ] Issues assigned to Copilot
