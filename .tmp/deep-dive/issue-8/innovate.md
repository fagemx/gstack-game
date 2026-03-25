# Phase 2: Innovate — Artifact Browser (Issue #8)

## Approach A: New `/artifacts` Skill

**What:** A dedicated skill (`skills/artifacts/SKILL.md.tmpl`) that users invoke via `/artifacts`. It lists all artifacts in `$_PROJECTS_DIR` with metadata: source skill, timestamp, branch, user, staleness, supersession status, and which downstream skills would consume each.

**How it works:**
1. Preamble runs as usual (sets `$_PROJECTS_DIR`)
2. Bash block lists all `.md` files in `$_PROJECTS_DIR`, parses filenames for metadata
3. Presents a formatted table via AskUserQuestion with options: read an artifact, show dependency graph, filter by branch/skill/date, delete stale artifacts
4. Can detect staleness: if GDD was modified after the last game-review artifact, flag it as potentially stale

**Pros:**
- Full interactive experience -- user can browse, read, compare, clean up
- Follows existing skill pattern (`.tmpl`, `{{PREAMBLE}}`, tests pass)
- Can include the dependency graph so users understand the workflow
- Natural place to add "suggested next skill" based on what's missing

**Cons:**
- Requires invoking a skill just to see what exists -- adds friction
- 23rd skill increases project surface area
- Users must know `/artifacts` exists to use it

**Effort:** ~2 hours implementation, ~1 hour testing

---

## Approach B: Enhanced Preamble with Artifact Summary

**What:** Add an "Artifact Inventory" block to `skills/shared/preamble.md` that runs on every skill startup. It lists all existing artifacts with timestamps and staleness indicators.

**How it works:**
1. After `mkdir -p ~/.gstack/projects/$_SLUG`, add a block that does `ls -lt $_PROJECTS_DIR/*.md` and formats output
2. Every skill now shows "Here's what exists" before starting its own work
3. Passive discovery -- no new skill to invoke

**Pros:**
- Zero friction -- users see artifacts automatically
- No new skill to maintain
- Every skill benefits immediately

**Cons:**
- Preamble becomes longer (already 80 lines) -- adds noise to every skill invocation
- No interactivity -- just a dump of filenames
- Cannot browse, read, or compare artifacts
- Clutters skill startup for users who don't care about prior artifacts
- Cannot do staleness detection without making preamble even heavier
- Preamble runs in bash -- variable state doesn't persist to Claude's context effectively

**Effort:** ~30 minutes implementation

---

## Approach C: New `bin/gstack-artifacts` Utility + Preamble Integration

**What:** A new bin utility (`bin/gstack-artifacts`) that handles artifact listing, filtering, and staleness detection. The preamble calls it with a compact summary mode. A new `/artifacts` skill uses it in full interactive mode.

**How it works:**
1. `bin/gstack-artifacts` is a standalone bash script that:
   - Lists all artifacts in `$_PROJECTS_DIR` with parsed metadata
   - Supports `--summary` (compact one-liner per artifact for preamble use)
   - Supports `--full` (detailed table with staleness, supersession, downstream consumers)
   - Supports `--filter skill=game-review` or `--filter branch=main`
   - Detects staleness by comparing artifact timestamps against GDD/source file mtime
   - Identifies supersession chains (latest vs. outdated)
2. Preamble adds one line: `"$_GG_BIN/gstack-artifacts" --summary 2>/dev/null` -- shows a compact artifact count
3. `/artifacts` skill calls `gstack-artifacts --full` and provides interactive browsing

**Pros:**
- Clean separation: utility does the work, skill provides the UX
- Preamble integration is lightweight (one line, compact output)
- Utility is testable independently
- Follows existing pattern: `gstack-review-read` already exists for log reading
- Future-proof: other tools/scripts can call `gstack-artifacts` too
- Staleness detection lives in one place, not duplicated across skills

**Cons:**
- Most implementation effort (utility + skill + preamble change)
- Two new files to maintain (utility + skill template)
- Need to keep artifact type registry in sync as new skills are added

**Effort:** ~3-4 hours implementation, ~1 hour testing

---

## Recommendation: Approach C (Utility + Skill)

**Why C over A:** The utility is reusable. Other skills could call `gstack-artifacts --check game-review` to verify a dependency exists, replacing the ad-hoc `ls -t $_PROJECTS_DIR/*-game-review-*.md` pattern currently duplicated across 15+ skills.

**Why C over B:** Passive-only (B) doesn't solve the core problem -- users need to *browse and understand* their artifacts, not just see a list flash by during startup.

**Why the extra effort is worth it:** The artifact type registry (22 types) encoded in a utility becomes a single source of truth. When new skills are added, only the utility needs updating. Currently each skill hardcodes its own discovery globs, which is fragile.
