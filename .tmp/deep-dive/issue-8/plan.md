# Phase 3: Implementation Plan — Artifact Browser (Issue #8)

**Recommended approach:** C (bin utility + skill + preamble integration)

---

## Step 1: Create `bin/gstack-artifacts`

**File:** `bin/gstack-artifacts`

A bash utility that reads `~/.gstack/projects/{slug}/` and outputs structured artifact information.

**Interface:**
```
Usage: gstack-artifacts [--summary|--full|--json] [--filter key=value] [--check type]

Options:
  --summary     Compact one-line-per-type output (for preamble)
  --full        Detailed table with timestamps, staleness, chains (default)
  --json        JSON output for programmatic use
  --filter      Filter by: skill=, branch=, user=, after=YYYY-MM-DD
  --check TYPE  Exit 0 if artifact of TYPE exists, 1 if not (for skill discovery)
```

**Artifact type registry** (embedded in the script as an associative array):
```bash
# Maps artifact-type slug -> producing skill name
declare -A ARTIFACT_SKILLS=(
  [concept]=game-ideation
  [game-review]=game-review
  [balance-report]=balance-review
  [player-walkthrough]=player-experience
  [direction-review]=game-direction
  [pitch-review]=pitch-review
  [eng-review]=game-eng-review
  [ux-review]=game-ux-review
  [qa-report]=game-qa
  [debug-report]=game-debug
  [retro]=game-retro
  [release-docs]=game-docs
  [visual-qa]=game-visual-qa
  [codex-review]=game-codex
  [asset-review]=asset-review
  [playtest-plan]=playtest
  [gdd-import]=game-import
  [impl-review]=gameplay-implementation-review
  [feel-pass]=feel-pass
  [playability]=build-playability-review
  [slice-plan]=prototype-slice-plan
  [handoff]=implementation-handoff
)
```

**Staleness detection:** Compare artifact mtime against `docs/gdd.md` (or latest commit touching `docs/`). If GDD is newer than a review artifact, mark it `[STALE?]`.

**Supersession:** For each type, identify the latest artifact and any superseded versions.

**`--summary` output example:**
```
Artifacts: 5 types, 8 files (3 stale)
  concept (2) | game-review (1, STALE?) | balance-report (2) | direction-review (1) | eng-review (2)
```

**`--full` output example:**
```
Artifact Inventory for my-game (branch: main)
================================================
  Type               Latest                                      Age     Status
  concept            alice-main-concept-20260320-100000.md        5d      current
                     alice-main-concept-20260315-090000.md        10d     superseded
  game-review        alice-main-game-review-20260318-140000.md    7d      STALE? (GDD updated 20260322)
  balance-report     alice-main-balance-report-20260322-110000.md 3d      current
  direction-review   alice-main-direction-review-20260319-160000.md 6d    current
  eng-review         alice-feat-eng-review-20260321-090000.md     4d      current (branch: feat)
================================================
Missing (never run): player-walkthrough, pitch-review, ux-review, qa-report, ...
```

**`--check` mode:** Used by other skills to replace hardcoded `ls -t` patterns:
```bash
# Before (current, in each skill):
PREV_REVIEW=$(ls -t $_PROJECTS_DIR/*-game-review-*.md 2>/dev/null | head -1)

# After (optional migration, not required for v1):
PREV_REVIEW=$("$_GG_BIN/gstack-artifacts" --check game-review 2>/dev/null)
```

**Acceptance criteria:**
- [ ] `gstack-artifacts --summary` outputs compact artifact summary
- [ ] `gstack-artifacts --full` outputs detailed table
- [ ] `gstack-artifacts --json` outputs parseable JSON
- [ ] `gstack-artifacts --check {type}` returns filepath or exit 1
- [ ] Staleness detection works against `docs/gdd.md` mtime
- [ ] Supersession chain identified correctly (latest vs. older)
- [ ] Handles empty `$_PROJECTS_DIR` gracefully
- [ ] Script is executable and follows existing `bin/` conventions

---

## Step 2: Create `/artifacts` Skill

**File:** `skills/artifacts/SKILL.md.tmpl`

**Frontmatter:**
```yaml
---
name: artifacts
description: "Browse and manage artifacts from prior skill runs. Shows what exists, what's stale, what's missing, and suggests next skills to run."
user_invocable: true
---
```

**Sections:**

1. **Preamble** (`{{PREAMBLE}}`)
2. **Artifact Inventory** -- runs `gstack-artifacts --full`, presents table
3. **Interactive Browse** -- AskUserQuestion with options:
   - A) Read a specific artifact (select from list)
   - B) Show dependency graph (which skills feed into which)
   - C) Show what's missing (suggest next skills based on gaps)
   - D) Clean up stale/superseded artifacts
   - E) Filter by branch or date range
4. **Suggested Next Skill** -- Based on what exists and what's missing, recommend the most valuable next skill. For example: "You have a concept and game-review but no balance-review. Your game-review flagged economy issues. Run `/balance-review` next."
5. **Cleanup** -- If user selects D, list superseded artifacts and confirm deletion one at a time (ASK, not AUTO -- these are user files).

**Template structure follows existing patterns:**
- AUTO/ASK/ESCALATE classification
- Anti-sycophancy (no "great collection of artifacts!")
- AskUserQuestion format with Re-ground, Simplify, Recommend, Options
- Review Log at the end

**This skill produces NO artifact of its own** -- it is a read-only browser.

**Acceptance criteria:**
- [ ] Template has valid frontmatter
- [ ] `{{PREAMBLE}}` included
- [ ] `bun run build` generates SKILL.md
- [ ] `bun test` passes (all 11 + new template)
- [ ] Interactive browsing works via AskUserQuestion
- [ ] Dependency graph is accurate (matches research phase table)
- [ ] Suggested next skill logic is sound

---

## Step 3: Add Compact Artifact Summary to Preamble

**File:** `skills/shared/preamble.md`

**Change:** After the `_PROJECTS_DIR` line, add:
```bash
# Artifact summary (compact)
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-artifacts" --summary 2>/dev/null || true
```

This adds one line of output to every skill startup showing what artifacts exist. It is non-blocking (`|| true`) and only runs if `$_GG_BIN` is found.

**The preamble prose section** ("Shared artifact directory...") gets an added line:
```
Run `/artifacts` for a full interactive artifact browser.
```

**Acceptance criteria:**
- [ ] Preamble still under 90 lines
- [ ] Summary output is compact (1-2 lines max)
- [ ] Graceful degradation if `gstack-artifacts` doesn't exist yet
- [ ] `bun run build` regenerates all 22 SKILL.md files
- [ ] `bun test` passes

---

## Step 4: Update CLAUDE.md and DEVELOPMENT.md

- Add `artifacts` to the skill directory listing in CLAUDE.md
- Add `gstack-artifacts` to the bin utility listing
- Document the artifact type registry

---

## Commit Plan (bisect-friendly)

1. **Commit 1:** Add `bin/gstack-artifacts` utility (standalone, no dependencies)
2. **Commit 2:** Add `skills/artifacts/SKILL.md.tmpl` + run `bun run build`
3. **Commit 3:** Update `skills/shared/preamble.md` + run `bun run build` (regenerates all 22 skills)
4. **Commit 4:** Update CLAUDE.md and DEVELOPMENT.md

---

## Scope & Future Work

**In scope for this issue:**
- `bin/gstack-artifacts` with `--summary`, `--full`, `--json`, `--check`
- `/artifacts` skill template
- Preamble compact summary
- Documentation updates

**Out of scope (future issues):**
- Migrating existing skills' Artifact Discovery sections to use `gstack-artifacts --check` (would touch all 22 skills -- separate PR)
- Review log integration (linking JSONL entries to artifact files)
- Artifact content indexing (searching inside artifacts)

---

## Estimated Effort

| Step | Time |
|------|------|
| bin/gstack-artifacts | 2h |
| /artifacts skill template | 1.5h |
| Preamble update + rebuild | 30m |
| Documentation | 30m |
| Testing + polish | 30m |
| **Total** | **~5h** |
