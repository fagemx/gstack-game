# Phase 1: Research — Artifact Browser (Issue #8)

## Problem Statement

Users cannot see what prior skills produced. After running `/game-review`, `/balance-review`, `/game-ideation`, etc., the artifacts are stored in `~/.gstack/projects/{slug}/` but there is **no user-facing way to list, inspect, or understand what exists**. Each skill independently discovers artifacts it cares about, but the user has no overview.

## Artifact Storage Mechanism

**Location:** `~/.gstack/projects/{slug}/` (set as `$_PROJECTS_DIR` in preamble)

**Created by preamble (every skill):**
```bash
mkdir -p ~/.gstack/projects/$_SLUG
_PROJECTS_DIR=~/.gstack/projects/$_SLUG
```

**Naming convention:** `{user}-{branch}-{artifact-type}-{YYYYMMDD-HHMMSS}.md`

## Complete Artifact Type Inventory

| Skill | Artifact Type Slug | Example Filename |
|-------|-------------------|------------------|
| game-ideation | `concept` | `alice-main-concept-20260325-143000.md` |
| game-review | `game-review` | `alice-main-game-review-20260325-143000.md` |
| balance-review | `balance-report` | `alice-main-balance-report-20260325-143000.md` |
| player-experience | `player-walkthrough` | `alice-main-player-walkthrough-20260325-143000.md` |
| game-direction | `direction-review` | `alice-main-direction-review-20260325-143000.md` |
| pitch-review | `pitch-review` | `alice-main-pitch-review-20260325-143000.md` |
| game-eng-review | `eng-review` | `alice-main-eng-review-20260325-143000.md` |
| game-ux-review | `ux-review` | `alice-main-ux-review-20260325-143000.md` |
| game-qa | `qa-report` | `alice-main-qa-report-20260325-143000.md` |
| game-debug | `debug-report` | `alice-main-debug-report-20260325-143000.md` |
| game-retro | `retro` | `alice-main-retro-20260325-143000.md` |
| game-docs | `release-docs` | `alice-main-release-docs-20260325-143000.md` |
| game-visual-qa | `visual-qa` | `alice-main-visual-qa-20260325-143000.md` |
| game-codex | `codex-review` | `alice-main-codex-review-20260325-143000.md` |
| asset-review | `asset-review` | `alice-main-asset-review-20260325-143000.md` |
| playtest | `playtest-plan` | `alice-main-playtest-plan-20260325-143000.md` |
| game-import | `gdd-import` | `alice-main-gdd-import-20260325-143000.md` |
| gameplay-implementation-review | `impl-review` | `alice-main-impl-review-20260325-143000.md` |
| feel-pass | `feel-pass` | `alice-main-feel-pass-20260325-143000.md` |
| build-playability-review | `playability` | `alice-main-playability-20260325-143000.md` |
| prototype-slice-plan | `slice-plan` | `alice-main-slice-plan-20260325-143000.md` |
| implementation-handoff | `handoff` | `alice-main-handoff-20260325-143000.md` |

**Total: 22 artifact types across 22 skills** (careful, guard, unfreeze produce no artifacts).

## Supersession Chain

When a skill produces a new artifact and a prior one exists, it writes `Supersedes: {prior filename}` at the top. This creates a revision chain per artifact type.

## Current Discovery Mechanism

Each skill has an **Artifact Discovery** section that runs `ls -t $_PROJECTS_DIR/*-{type}-*.md` for the specific artifact types it cares about. Discovery is:
- **Per-skill, not global** -- each skill only looks for artifacts relevant to its own context
- **Implicit** -- users see discovered artifacts only as side output during skill startup
- **Incomplete** -- no skill lists ALL artifacts; each checks 2-4 types max

## Cross-Skill Dependency Graph (Discoverable by)

| Producer | Consumers |
|----------|-----------|
| game-review | balance-review, player-experience, game-direction, game-ship |
| balance-review | player-experience, game-review, game-direction, game-ux-review |
| player-experience | balance-review, game-review, game-direction, game-ux-review |
| game-ideation | game-review, game-direction, pitch-review, game-import |
| game-direction | pitch-review, game-eng-review, prototype-slice-plan |
| pitch-review | game-direction |
| game-eng-review | gameplay-implementation-review, implementation-handoff |
| game-ux-review | game-ship, game-qa, game-retro |
| game-qa | game-ship, game-retro, build-playability-review |
| gameplay-implementation-review | game-ship, game-eng-review, game-qa, feel-pass |
| prototype-slice-plan | implementation-handoff, gameplay-implementation-review, build-playability-review, feel-pass |
| implementation-handoff | feel-pass, gameplay-implementation-review, build-playability-review |
| feel-pass | build-playability-review, game-qa, game-debug, game-ship |
| build-playability-review | game-qa, game-ship, game-retro |
| playtest | game-qa, build-playability-review, game-retro |
| game-debug | game-qa, game-retro |
| game-retro | game-ship |
| game-codex | game-ship, gameplay-implementation-review |
| asset-review | game-ship, game-visual-qa |
| game-visual-qa | game-ship, game-qa |
| game-docs | game-ship |

## Existing Tooling Gap

- `gstack-review-log` -- logs structured JSON to `{branch}-reviews.jsonl` (skill invocation metadata, not artifact content)
- `gstack-review-read` -- reads the review log JSONL and config, but is **not used by any skill template**
- **No tool exists** to list, search, or summarize the `.md` artifact files in `$_PROJECTS_DIR`

## Key Findings

1. **22 artifact types** follow a consistent `{user}-{branch}-{type}-{datetime}.md` naming convention
2. **No global view** exists -- users must manually `ls ~/.gstack/projects/{slug}/`
3. **Supersession chains** exist but are not surfaced (which is the latest? which are stale?)
4. **Review log (JSONL)** tracks skill invocations but not artifact file paths
5. **`gstack-review-read`** exists but is unused -- potential foundation to build on
6. **Cross-skill discovery is hardcoded** per skill, not centralized
