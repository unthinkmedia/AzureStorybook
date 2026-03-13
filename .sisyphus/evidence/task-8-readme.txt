1
- `.copilot-instructions.md` — project conventions for Copilot
> Stakeholders can annotate UI issues directly in the deployed Storybook. Annotations automatically become GitHub Issues assigned to GitHub Copilot for automated fix PRs.
  → GitHub repository_dispatch
  → GitHub Issue (assigned to Copilot)
  → Copilot PR
| `GITHUB_TOKEN` | ✅ Yes | GitHub token with `contents: write` scope. Used by the `/api/feedback` proxy to trigger `repository_dispatch`. |
5. The issue is auto-assigned to Copilot, which will create a fix PR
echo '{"IsEncrypted":false,"Values":{"FUNCTIONS_WORKER_RUNTIME":"node","GITHUB_TOKEN":"your-token-here"}}' > local.settings.json
