# Decisions — design-system-skins

## 2026-03-13 Session Start

### Architecture Decisions (from plan)

- Composition order: `appearance base → design-system skin → product overrides` (product always wins)
- SkinSections structure: `colors`, `shape`, `elevation`, `density`, `typography` sections
- `coherenceTokens.ts` stays as reference — NOT consumed programmatically
- Skin fidelity = "recognizable era, not pixel-perfect"
- Layout constants (315/585/855/1125px context pane widths) are EXEMPT from tokenization
- SVG gradient stop colors are documented exceptions
- Chromatic modes: exactly 6 (with skin axis added)
- No new custom token definitions — use existing Fluent v9 tokens only (closest match with comments)
- `DesignSystemId` values MUST match `DESIGN_SYSTEMS` list in constants

### TDD Approach

- Tests BEFORE implementation (RED → GREEN → REFACTOR)
- Task 3 writes failing tests (it.skip for composition tests)
- Tasks 7, 12, 14 un-skip tests as implementation catches up
- All tests green before final commit for each task group
