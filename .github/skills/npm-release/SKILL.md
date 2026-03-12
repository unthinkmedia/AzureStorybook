---
name: npm-release
description: Release a new version of @azure-fluent-storybook/components to npm. Use this skill whenever the user wants to publish, release, bump, or ship a new version to npm. Also use when they say "release", "publish to npm", "bump version", "new version", "cut a release", "ship it", "publish manually", or ask about the release process for this package.
---

# npm Release Skill

Handles the full release workflow for the `@azure-fluent-storybook/components` package. Publishing is done **manually** from the local machine — there is no CI-based publish.

---

## Manual Publish Workflow

### Step 1: Pre-flight Checks

```bash
# Ensure you're on main and up to date
git checkout main && git pull origin main

# Check for uncommitted changes — never release from a dirty tree
git status

# Verify the build passes
npm run build:lib

# Run lint
npm run lint
```

If there are uncommitted changes, commit them first.

### Step 2: Check npm Login

```bash
npm whoami
```

If this returns an error, the user needs to log in:

```bash
npm login
```

This opens a browser for authentication. **Wait for the user to complete login** before proceeding. Verify with `npm whoami` again.

### Step 3: Bump the Version

Use `npm version` to bump. This updates `package.json` and creates a git tag.

Choose the right bump type based on what changed:
- **patch** (0.1.1 → 0.1.2): Bug fixes, docs updates, minor tweaks
- **minor** (0.1.2 → 0.2.0): New components, new features, non-breaking additions
- **major** (0.2.0 → 1.0.0): Breaking API changes, removed components, renamed exports

```bash
npm version patch   # or minor, or major
```

If the user doesn't specify a bump type, ask them what changed and suggest the appropriate level.

### Step 4: Build the Library

```bash
npm run build:lib
```

Verify the dist output looks correct:

```bash
ls -la dist/
```

### Step 5: Publish

```bash
npm publish --access public
```

If the npm account has 2FA enabled, this will prompt for a one-time password (OTP). The user must enter it in the terminal.

**Do NOT use `--provenance`** for local publishes — that flag only works in GitHub Actions with `id-token: write` permission.

### Step 6: Push to Git

After successful publish, push the version commit and tag:

```bash
git push origin main --tags
```

### Step 7: Verify

```bash
npm view @azure-fluent-storybook/components version
```

The registry can take 1-2 minutes to propagate. If the old version shows, wait and retry.

---

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `npm error 401 Unauthorized` | Not logged in locally | Run `npm login` |
| `EOTP` | 2FA required | Enter OTP when prompted during `npm publish` |
| `E404 Not Found` on PUT | Token doesn't have write access | Run `npm login` to re-authenticate |
| `ENEEDAUTH` | No auth token configured | Run `npm login` |
| Version already exists | Trying to republish same version | Bump version first |

## Package Details

| Field | Value |
|-------|-------|
| Package | `@azure-fluent-storybook/components` |
| Registry | https://registry.npmjs.org |
| Access | public (scoped) |
| Build tool | tsup |

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
