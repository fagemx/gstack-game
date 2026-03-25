# Phase 1: Research — Next Step Routing in Completion Summaries

## Current State of Completion Summaries

Examined 6 skill templates in detail, plus grep across all 26 published skills. Here is what exists today:

### Skills WITH some form of next-step routing (6 of 26)

| Skill | Routing Type | Format |
|-------|-------------|--------|
| `/game-import` | **Best in class** — conditional routing table (8 rows mapping GDD state to next skill + reason) | Embedded routing table + `Recommended next: /[skill] — [reason]` in summary |
| `/balance-review` | Hardcoded suggestions | `Next Steps: - Consider /player-experience ... - Consider /game-review ...` |
| `/feel-pass` | Hardcoded single line | `Next: Fix top blocker → re-run /feel-pass ... Or: /build-playability-review` |
| `/prototype-slice-plan` | Hardcoded single line | `Next: /implementation-handoff to create the build package` |
| `/implementation-handoff` | Hardcoded single line | `Next: Build it. Then /feel-pass to check if it's alive.` |
| `/build-playability-review` | Conditional (3 branches) | `Next: PLAY-READY → /game-qa ... ALMOST → re-run ... NOT YET → /feel-pass` |
| `/game-direction` | Separate "Suggested Next Skills" section (outside summary block) | Bullet list of 5 skills with conditions |
| `/player-experience` | Generic | `Recommended next steps: - [specific action] - Consider running /player-experience again` |

### Skills WITHOUT any routing (18 of 26)

`/game-review`, `/game-qa`, `/game-eng-review`, `/game-ux-review`, `/pitch-review`, `/game-ideation`, `/game-ship`, `/game-debug`, `/game-retro`, `/game-codex`, `/game-docs`, `/game-visual-qa`, `/asset-review`, `/gameplay-implementation-review`, `/playtest`, `/careful`, `/guard`, `/unfreeze`

### Completion Summary Format Patterns

Three distinct patterns exist:

1. **Rich structured block** (game-review, balance-review, game-qa, game-eng-review, game-ux-review): Full score table inside a code block with `═══` borders, per-section scores, status line.

2. **Compact structured block** (feel-pass, prototype-slice-plan, implementation-handoff, build-playability-review): Shorter code block, key metrics, status, sometimes a `Next:` line.

3. **Minimal block** (skeleton skills — game-debug, game-retro, game-codex, game-docs, game-visual-qa, asset-review, playtest): Very short code block, just key/value pairs + status.

## What Routing Info Is Missing

### 1. Score-conditional routing (the core gap)
No skill currently says "if your Economy score is below 5, run /balance-review." The issue specifically calls this out. Only `/build-playability-review` has conditional routing (PLAY-READY/ALMOST/NOT YET), and `/game-import` has state-based routing.

### 2. Workflow-position awareness
The DEVELOPMENT.md documents a clear workflow: `design → slice-plan → handoff → build → feel-pass → impl-review → playability → QA → ship`. But individual skills don't know where they sit in this pipeline or what comes next.

### 3. Cross-layer routing
Layer A skills (design) don't route to Layer B (bridge/production). Layer B doesn't route to Layer C (validation/release). The three-layer architecture exists in docs but not in skill behavior.

### 4. Backtrack routing
No skill says "your design has a fundamental problem — go BACK to /game-ideation." Only `/game-direction` has backtrack suggestions outside its summary block.

## Key Observations

1. **`/game-import` is the gold standard.** Its routing table pattern (GDD state → next skill → reason) is the model to replicate.

2. **Routing belongs INSIDE the Completion Summary code block**, not outside it. Skills that put routing outside the summary (like `/game-direction`'s "Suggested Next Skills" section) break the pattern — the summary is what gets saved to the artifact file and discovered by downstream skills.

3. **Safety skills (`/careful`, `/guard`, `/unfreeze`) don't need routing.** They are utility skills, not workflow skills.

4. **The "Discoverable by" lines at Save Artifact time are backward routing** — they tell you who reads this artifact, but they don't tell the USER what to do next. The issue is about forward routing.

5. **Existing routing is static, not conditional.** Balance-review always suggests "Consider /player-experience" regardless of scores. The issue wants conditional routing based on actual review results.
