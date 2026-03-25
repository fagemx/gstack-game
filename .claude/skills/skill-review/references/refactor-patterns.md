# Skill Refactoring Patterns

## Pattern: Progressive Disclosure Split (方案 1 — upfront read)

### When to apply
Skill SKILL.md.tmpl exceeds 300 lines AND has 0 reference files.

### Method
1. Read the entire SKILL.md.tmpl
2. Identify these extractable categories:
   - **gotchas.md** — anti-sycophancy + forbidden phrases + forcing questions + Claude-specific mistakes
   - **scoring.md** — all rubrics, formulas, point values, interpretation scales
   - **Per-section content** — detailed analysis frameworks, evaluation tables, benchmarks
3. Keep in main SKILL.md.tmpl:
   - Frontmatter
   - {{PREAMBLE}}
   - "Load References" instruction (read ALL upfront, before any interaction)
   - Artifact Discovery
   - Role identity
   - Interactive routing (Phase 0 / mode selection)
   - Section overview (2-3 lines per section + "Apply references/X.md" + STOP gate)
   - Section transitions (fast-forward / stop / go-back)
   - Action Triage (AUTO / ASK / ESCALATE summary)
   - Important Rules
   - Special mechanisms (Fix-then-rescore, Baseline→Final, driver scripts)
   - Output templates (completion summary, score report)
   - Save Artifact + Review Log
4. Target: main template ≤ 300 lines

### Critical: Mechanisms to preserve
Before splitting, grep for these patterns and ensure they remain in the main template:
- `Baseline` / `Final` / `delta` / `re-score` — score delta tracking
- `Fix.*Loop` / `fix.*rescore` — iterative fix loops
- `Save Artifact` / `PROJECTS_DIR` — artifact persistence
- `Supersedes` — revision chain
- `driver` / `Driver` — external state management
- `worktree` — git isolation
- `review-log` — review dashboard integration

### "Load References" block template
```markdown
## Load References (BEFORE any interaction)

\```bash
SKILL_DIR="$(find . -path '*skills/SKILL_NAME/references' -type d 2>/dev/null | head -1)"
[ -z "$SKILL_DIR" ] && SKILL_DIR="$(find ~/.claude -path '*skills/SKILL_NAME/references' -type d 2>/dev/null | head -1)"
echo "References at: $SKILL_DIR"
ls "$SKILL_DIR/" 2>/dev/null
\```

Read ALL reference files now. Do not proceed until you have read every file:
- `references/gotchas.md` — [description]
- `references/scoring.md` — [description]
- `references/[section].md` — [description]
```

### Naming conventions for reference files
| Content type | Filename |
|-------------|----------|
| Anti-sycophancy + Claude mistakes | `gotchas.md` |
| Scoring rubrics + formulas | `scoring.md` |
| Section analysis framework | `{section-topic}.md` (e.g., `difficulty-curve.md`, `economy-model.md`) |
| Industry benchmarks | `benchmarks.md` (if shared across sections) |
| Persona definitions | `personas.md` |
| Emotion/vocabulary standards | `emotion-vocabulary.md` |

## Pattern: Description as Trigger Condition

### Before
```yaml
description: "Game economy and balance review."
```

### After
```yaml
description: "Use when a game has numbers that need checking — difficulty curves, currency flow, gacha rates, progression pacing, grind ratios, or pay-to-win concerns. Not for visual design, narrative, core loop evaluation (use /game-review), or player experience walkthrough (use /player-experience)."
```

### Formula
`what it does` + `when to use (concrete examples)` + `when NOT to use (adjacent skills)` + `trigger phrases`

## Pattern: Artifact Discovery Block

Every skill that reads or writes to `$_PROJECTS_DIR` should have this at the top:

```bash
echo "=== Checking for prior artifacts ==="
# This skill's prior output
PREV=$(ls -t $_PROJECTS_DIR/*-{skill-name}-*.md 2>/dev/null | head -1)
[ -n "$PREV" ] && echo "Prior {skill} review: $PREV"
# Upstream artifacts
GDD=$(ls -t docs/gdd.md docs/*GDD* docs/*game-design* 2>/dev/null | head -1)
[ -n "$GDD" ] && echo "GDD: $GDD"
# Cross-skill artifacts
PREV_GAME_REVIEW=$(ls -t $_PROJECTS_DIR/*-game-review-*.md 2>/dev/null | head -1)
[ -n "$PREV_GAME_REVIEW" ] && echo "Prior game review: $PREV_GAME_REVIEW"
```

If a prior review from THIS skill exists: read it, note score and findings, check if issues have been addressed.

## Pattern: Save Artifact Block

```bash
_DATETIME=$(date +%Y%m%d-%H%M%S)
echo "Saving to: $_PROJECTS_DIR/${_USER}-${_BRANCH}-{artifact-name}-${_DATETIME}.md"
```

Write to `$_PROJECTS_DIR/{user}-{branch}-{artifact-name}-{datetime}.md`.
If prior artifact exists, include `Supersedes: {prior filename}` at top.

List downstream skills that will discover this artifact.
