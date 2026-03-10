---
name: npm-release
description: Release a new version of @azure-fluent-storybook/components to npm. Use this skill whenever the user wants to publish, release, bump, or ship a new version to npm. Also use when they say "release", "publish to npm", "bump version", "new version", "cut a release", "ship it", or ask about the release process for this package.
---

# npm Release Skill

Handles the full release workflow for the `@azure-fluent-storybook/components` package. The package is published to npm via GitHub Actions CI — pushing a `v*` tag triggers the publish job automatically.

## Release Workflow

### 1. Pre-flight Checks

Before releasing, verify everything is clean and ready:

```bash
# Ensure you're on main and up to date
git checkout main && git pull origin main

# Check for uncommitted changes
git status

# Verify the build passes
npm run build:lib

# Run lint
npm run lint
```

If there are uncommitted changes, commit or stash them first. Never release from a dirty working tree.

### 2. Bump the Version

Use `npm version` to bump the version. This updates `package.json` and creates a git tag automatically.

Choose the right bump type based on what changed:
- **patch** (0.1.1 → 0.1.2): Bug fixes, docs updates, minor tweaks
- **minor** (0.1.2 → 0.2.0): New components, new features, non-breaking additions
- **major** (0.2.0 → 1.0.0): Breaking API changes, removed components, renamed exports

```bash
npm version patch   # or minor, or major
```

If the user doesn't specify a bump type, ask them what changed and suggest the appropriate level.

### 3. Push the Tag

Push both the commit and the tag to trigger CI:

```bash
git push origin main --tags
```

### 4. Verify the Release

After pushing, CI handles the rest. To confirm:

```bash
# Check the GitHub Actions run (opens browser)
gh run list --workflow=ci.yml --limit 3

# Once CI completes, verify the package is live
npm view @azure-fluent-storybook/components version
```

The npm registry can take 1-2 minutes to propagate after publish. If `npm view` returns 404 immediately after CI succeeds, wait and retry.

## Package Details

| Field | Value |
|-------|-------|
| Package | `@azure-fluent-storybook/components` |
| Registry | https://registry.npmjs.org |
| Access | public (scoped) |
| Build tool | tsup |
| CI workflow | `.github/workflows/ci.yml` → `publish` job |
| Trigger | Push of `v*` tag |
| Secret | `NPM_TOKEN` (GitHub Actions secret) |

## CI Pipeline on Tag Push

When a `v*` tag is pushed, the CI runs these jobs:

1. **build** — `npm ci` → `npm run lint` → `npm run build:all`
2. **chromatic** — visual regression tests
3. **deploy** — Storybook to Azure Static Web Apps
4. **publish** — `npm run build:lib` → `npm publish --provenance --access public`

## Troubleshooting

### "npm publish" fails in CI
- Check the `NPM_TOKEN` secret is set: `gh secret list -R unthinkmedia/AzureStorybook`
- Regenerate if needed: create a new token at https://www.npmjs.com/settings/tokens and update the secret via `gh secret set NPM_TOKEN`

### Version already exists on npm
- npm won't let you publish the same version twice
- Bump to a new version and try again

### Tag already exists locally
- Delete the local tag: `git tag -d v0.1.2`
- Delete remote tag if pushed: `git push origin :refs/tags/v0.1.2`
- Re-run `npm version patch`

### Registry shows old version after publish
- npm CDN propagation can take 1-3 minutes for new versions
- Clear cache and retry: `npm cache clean --force && npm view @azure-fluent-storybook/components version`
