---
name: skill-review
description: "Use when you need to assess the quality of a gstack-game skill, decide which skill to improve next, or refactor a skill for progressive disclosure. Run on a single skill or scan all skills. Not for reviewing game designs (use /game-review) or code (use /game-code-review)."
user_invocable: true
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun scripts/gen-skill-docs.ts -->

## Preamble (run first)

```bash
_GD_VERSION="0.2.0"
# Find gstack-game bin directory (installed in project or standalone)
_GG_BIN=""
for _p in ".claude/skills/gstack-game/bin" ".claude/skills/game-review/../../gstack-game/bin" "$(dirname "$(readlink -f .claude/skills/game-review/SKILL.md 2>/dev/null)" 2>/dev/null)/../../bin"; do
  [ -f "$_p/gstack-config" ] && _GG_BIN="$_p" && break
done
[ -z "$_GG_BIN" ] && echo "WARN: gstack-game bin/ not found, some features disabled"

# Project identification
_SLUG=$(basename "$(git rev-parse --show-toplevel 2>/dev/null || pwd)")
_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
_USER=$(whoami 2>/dev/null || echo "unknown")

# Session tracking
mkdir -p ~/.gstack/sessions
touch ~/.gstack/sessions/"$PPID"
_PROACTIVE=$([ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-config" get proactive 2>/dev/null || echo "true")
_TEL_START=$(date +%s)
_SESSION_ID="$-$(date +%s)"

# Shared artifact storage (cross-skill, cross-session)
mkdir -p ~/.gstack/projects/$_SLUG
_PROJECTS_DIR=~/.gstack/projects/$_SLUG

# Telemetry
mkdir -p ~/.gstack/analytics
echo '{"skill":"skill-review","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'"$_SLUG"'","branch":"'"$_BRANCH"'"}'  >> ~/.gstack/analytics/skill-usage.jsonl 2>/dev/null || true

echo "SLUG: $_SLUG"
echo "BRANCH: $_BRANCH"
echo "PROACTIVE: $_PROACTIVE"
echo "PROJECTS_DIR: $_PROJECTS_DIR"
echo "GD_VERSION: $_GD_VERSION"
```

**Shared artifact directory:** `$_PROJECTS_DIR` (`~/.gstack/projects/{slug}/`) stores all skill outputs:
- Design docs from `/game-ideation`
- Review reports from `/game-review`, `/balance-review`, etc.
- Player journey maps from `/player-experience`

All skills read from this directory on startup to find prior work. All skills write their output here for downstream consumption.

If `PROACTIVE` is `"false"`, do not proactively suggest gstack-game skills.

## AskUserQuestion Format (Game Design)

**ALWAYS follow this structure for every AskUserQuestion call:**
1. **Re-ground:** Project, branch, what game/feature is being reviewed. (1-2 sentences)
2. **Simplify:** Plain language a smart 16-year-old gamer could follow. Use game examples they'd know (Minecraft, Genshin, Among Us, etc.) as analogies.
3. **Recommend:** `RECOMMENDATION: Choose [X] because [one-line reason]` — include `Player Impact: X/10` for each option. Calibration: 10 = fundamentally changes player experience, 7 = noticeable improvement, 3 = cosmetic/marginal.
4. **Options:** Lettered: `A) ... B) ... C) ...` with effort estimates (human: ~X / CC: ~Y).

**Game-specific vocabulary — USE these terms, don't reinvent:**
- Core loop, session loop, meta loop
- FTUE (First Time User Experience), aha moment, churn point
- Retention hook (D1, D7, D30)
- Economy: sink, faucet, currency, exchange rate
- Progression: skill gate, content gate, time gate
- Bartle types: Achiever, Explorer, Socializer, Killer
- Difficulty curve, flow state, friction point
- Whale, dolphin, minnow (spending tiers)

## Completion Status Protocol

DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT.
Escalation after 3 failed attempts.

## Telemetry (run last)

```bash
_TEL_END=$(date +%s)
_TEL_DUR=$(( _TEL_END - _TEL_START ))
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-telemetry-log" \
  --skill "skill-review" --duration "$_TEL_DUR" --outcome "OUTCOME" \
  --used-browse "false" --session-id "$_SESSION_ID" 2>/dev/null &
```


## Load References (BEFORE any interaction)

```bash
SKILL_DIR="$(find . -path '*skills/skill-review/references' -type d 2>/dev/null | head -1)"
[ -z "$SKILL_DIR" ] && SKILL_DIR="$(find ~/.claude -path '*skills/skill-review/references' -type d 2>/dev/null | head -1)"
echo "References at: $SKILL_DIR"
ls "$SKILL_DIR/" 2>/dev/null
```

Read ALL reference files now:
- `references/rubric.md` — 15-dimension scoring rubric (A1-E15, 0-2 each, /30 total)
- `references/refactor-patterns.md` — how to split skills, naming conventions, mechanism preservation
- `references/good-skill-examples.md` — what to learn from each refactored skill + external references

---

# /skill-review: Skill Quality Assessment & Refactoring

You are a **skill quality auditor**. You score skills against a 15-dimension rubric, identify the highest-impact improvements, and optionally execute the refactoring.

## Arguments

Parse `$ARGUMENTS`:
1. **Args is a skill name** (e.g., `game-qa`) → Review that single skill
2. **Args is `all` or `scan`** → Scan all skills, produce dashboard
3. **Args is `refactor <skill-name>`** → Score + refactor that skill (create references/, rewrite template)
4. **Args starts with `loop`** → extract skill name after `loop` (e.g., `loop game-qa`) → Auto fix loop: score → fix → re-score → repeat until Usable (18+) or max 3 iterations
5. **Args is empty** → Ask user what to do

---

## Operation: Review Single Skill

### Step 1: Find and read the skill

```bash
SKILL_NAME="<from args>"
TMPL="skills/$SKILL_NAME/SKILL.md.tmpl"
REFS_DIR="skills/$SKILL_NAME/references"
[ -f "$TMPL" ] && echo "Template: $TMPL ($(wc -l < $TMPL) lines)" || echo "NOT FOUND: $TMPL"
[ -d "$REFS_DIR" ] && echo "References: $(ls $REFS_DIR/*.md 2>/dev/null | wc -l) files" || echo "No references/"
```

Read the full SKILL.md.tmpl. If references/ exists, read all files there too.

### Step 2: Score against rubric

Apply every dimension from `references/rubric.md`. For each dimension, cite specific evidence from the skill file (line numbers or quotes).

**Rules:**
- Score 0, 1, or 2. Never 0.5 or 1.5.
- Every score MUST cite evidence. "A2: 2/2 — L34: 'You are an economy mathematician'" = good. "A2: 2/2 — good role" = bad.
- If evidence is ambiguous, score 1 (not 2).

### Step 3: Present scorecard

```
Skill: /[name]
Template: [lines]L | References: [count] files ([lines]L)

A. Entry Layer
  A1. Trigger Description:     _/2  — [evidence]
  A2. Role Identity:           _/2  — [evidence]
  A3. Mode Routing:            _/2  — [evidence]

B. Flow Layer
  B4. Flow Externalization:    _/2  — [evidence]
  B5. STOP Gates:              _/2  — [evidence]
  B6. Recovery:                _/2  — [evidence]

C. Knowledge Layer
  C7. Gotchas:                 _/2  — [evidence]
  C8. Scoring Rigor:           _/2  — [evidence]
  C9. Domain Benchmarks:       _/2  — [evidence]

D. Structure Layer
  D10. Progressive Disclosure: _/2  — [evidence]
  D11. Helper Code:            _/2  — [evidence]
  D12. Config / Memory:        _/2  — [evidence]

E. System Layer
  E13. Artifact Discovery:     _/2  — [evidence]
  E14. Output Contract:        _/2  — [evidence]
  E15. Workflow Position:       _/2  — [evidence]

TOTAL: _/30 — [Grade]
```

### Step 4: Prioritized improvements

List top 3 improvements by impact (most points gained per effort):

```
Priority  Dimension    Current  Target  Effort   Action
1.        D10          0→2      +2      ~15min   Split to references/ (方案1)
2.        C7           1→2      +1      ~10min   Add Claude-specific gotchas
3.        E13          1→2      +1      ~5min    Add upstream artifact search
```

**STOP.** Present scorecard + priorities via AskUserQuestion:

> Reviewed `/[name]`: [score]/30 ([grade]).
> Top improvement: [D10 progressive disclosure] would add +2 for ~15min effort.
>
> A) **Refactor now** — I'll split this skill into references/ following 方案 1
> B) **Just the score** — note it and move on
> C) **Review another skill** — which one?

---

## Operation: Scan All Skills

### Step 1: Enumerate all skills

```bash
for skill in skills/*/; do
  name=$(basename "$skill")
  [ "$name" = "shared" ] && continue
  tmpl="$skill/SKILL.md.tmpl"
  refs="$skill/references"
  lines=$(wc -l < "$tmpl" 2>/dev/null || echo "0")
  ref_count=$(ls "$refs"/*.md 2>/dev/null | wc -l 2>/dev/null || echo "0")
  echo "$name|$lines|$ref_count"
done
```

### Step 2: Quick-score each skill

For scan mode, use the **fast rubric** (5 dimensions instead of 15):
- D10 Progressive Disclosure (0/1/2)
- C7 Gotchas (0/1/2)
- E14 Output Contract (0/1/2)
- A1 Trigger Description (0/1/2)
- B5 STOP Gates (0/1/2)

These 5 correlate most with overall quality and are assessable without deep reading.

### Step 3: Present dashboard

```
SKILL QUALITY DASHBOARD
═══════════════════════════════════════════════════════════════
Skill               Lines  Refs  D10  C7  E14  A1  B5  Quick/10  Status
─────────────────── ─────  ────  ───  ──  ───  ──  ──  ────────  ──────
balance-review       265    8    2    2   2    2   2    10       ✅ Production
game-review          255    8    2    2   2    2   2    10       ✅ Production
player-experience    254    5    2    2   2    1   1     8       ✅ Usable
pitch-review         283    7    2    2   2    1   2     9       ✅ Usable
game-eng-review      589    0    0    ?   ?    ?   ?     ?       ⚠️ Needs split
game-qa              536    0    0    ?   ?    ?   ?     ?       ⚠️ Needs split
...
═══════════════════════════════════════════════════════════════
Summary: N Production, N Usable, N Draft, N Skeleton
Top 3 skills to improve next: [by most points gained]
```

**STOP.** Present dashboard + recommendation:

> [N] skills need progressive disclosure split (>300L, 0 refs).
> Recommended order: [highest-value first, based on usage frequency and downstream dependencies]
>
> A) **Refactor the top priority** — I'll split it now
> B) **Full review** on a specific skill — which one?
> C) **Done** — just wanted the dashboard

---

## Operation: Refactor

### Step 1: Score first (same as Review Single Skill)

### Step 2: Confirm refactor plan

Before making any changes, present the plan:

```
Refactor plan for /[name]:
  Current: [lines]L, [refs] reference files
  Target:  ~[250]L main + [N] reference files

  Files to create:
  - references/gotchas.md — [what goes here]
  - references/scoring.md — [what goes here]
  - references/[section].md — [what goes here]
  ...

  Mechanisms to preserve:
  - [list each mechanism found: artifact discovery, fix loop, baseline delta, etc.]

  Estimated effort: ~[N] minutes
```

**STOP.** Wait for confirmation before creating any files.

### Step 3: Execute refactor

Follow `references/refactor-patterns.md` exactly:
1. Create references/ files
2. Rewrite SKILL.md.tmpl as lean orchestration
3. Preserve all mechanisms (grep for patterns listed in refactor-patterns.md)
4. Run `bun scripts/gen-skill-docs.ts`
5. Verify line count targets met
6. Re-score using full rubric

### Step 4: Present before/after

```
Refactor complete: /[name]
  Before: [lines]L, [refs] refs, [score]/30 ([grade])
  After:  [lines]L, [refs] refs, [score]/30 ([grade])
  Delta:  +[N] points

  Dimensions improved:
  - D10: 0→2 (progressive disclosure)
  - A1:  1→2 (trigger description rewritten)
  - E13: 1→2 (upstream artifact search added)
```

---

## Operation: Loop (Auto Fix)

Self-reviewing, self-fixing loop. Like `pr-review-loop` but for skill quality instead of code quality.

### Architecture

Loop control is handled by a **bash driver script**, not by your memory. You MUST follow the ACTION output from the driver at every step.

```
┌──────────┐     ACTION: SCORE        ┌─────────┐
│  Driver   │ ───────────────────────→ │   LLM   │  ← full 15-dimension rubric
│  Script   │ ←──────────────────────  │ (you)   │
│           │   score-done {total}     │         │
│           │                          │         │
│           │     ACTION: FIX          │         │  ← fix top 3 improvements
│           │ ───────────────────────→ │         │
│           │ ←──────────────────────  │         │
│           │       fix-done           │         │
│           │                          │         │
│           │     ACTION: PASS         │         │  ← score ≥ 18, done
│           │ ───────────────────────→ │         │
└──────────┘                           └─────────┘
```

### Step 1: Create driver script

```bash
cat > /tmp/skill-review-loop-driver.sh << 'DRIVER'
#!/bin/bash
set -euo pipefail

SKILL="$1"
CMD="$2"
STATE="/tmp/skill-review-loop-${SKILL}.state"

case "$CMD" in
  init)
    echo "0" > "$STATE"
    echo "ACTION: SCORE"
    ;;
  score-done)
    TOTAL="${3:-0}"
    ITER=$(cat "$STATE")
    ITER=$((ITER + 1))
    echo "$ITER" > "$STATE"
    if [ "$TOTAL" -ge 18 ]; then
      echo "ACTION: PASS"
    elif [ "$ITER" -ge 3 ]; then
      echo "ACTION: MAX_ITER"
    else
      echo "ACTION: FIX"
    fi
    ;;
  fix-done)
    echo "ACTION: SCORE"
    ;;
esac
DRIVER
chmod +x /tmp/skill-review-loop-driver.sh
```

### Step 2: Initialize

```bash
ACTION=$(/tmp/skill-review-loop-driver.sh "$SKILL_NAME" init)
# Output: ACTION: SCORE
```

### Step 3: Action Loop

Read the ACTION output and execute. **Always call driver after completing an action.**

### On `ACTION: SCORE`

1. Read the skill's SKILL.md.tmpl + all references/ files
2. Score against the full 15-dimension rubric from `references/rubric.md`
3. Record the score and top 3 improvement priorities
4. Report to driver:

```bash
ACTION=$(/tmp/skill-review-loop-driver.sh "$SKILL_NAME" score-done "$TOTAL_SCORE")
```

5. Follow the returned ACTION.

### On `ACTION: FIX`

Read the current iteration number:
```bash
ITER=$(cat /tmp/skill-review-loop-${SKILL_NAME}.state)
```

Fix the top 3 improvements from the most recent scoring. For each fix:

**What to fix per dimension:**

| Dimension | How to fix |
|-----------|-----------|
| D10 (Progressive Disclosure) | Create references/ directory, split content out, rewrite main template. Follow `references/refactor-patterns.md` exactly. |
| A1 (Trigger Description) | Rewrite frontmatter description as trigger condition (what + when + when NOT + adjacent skills). |
| C7 (Gotchas) | Create `references/gotchas.md` with Claude-specific mistakes for this skill's domain + forbidden phrases + forcing questions. |
| E13 (Artifact Discovery) | Add bash block at top to search $_PROJECTS_DIR for upstream artifacts. |
| E14 (Output Contract) | Add Save Artifact section that writes to $_PROJECTS_DIR. |
| E15 (Workflow Position) | Add downstream discoverability list + next-skill recommendation. |
| A2 (Role Identity) | Add a one-sentence role lock at the top of the skill content. |
| A3 (Mode Routing) | Add Step 0 with AskUserQuestion mode selection or args parsing. |
| B5 (STOP Gates) | Add "STOP. One issue per AskUserQuestion." at end of each section. |
| C8 (Scoring) | Add explicit scoring rubric with point values per criterion. |
| C9 (Benchmarks) | Add structured benchmark tables from industry data. |
| B6 (Recovery) | Add interrupt recovery procedure. |
| D11 (Helper Code) | Add scripts/ directory with relevant tools. |
| D12 (Config/Memory) | Add config.json pattern + review log readback. |
| B4 (Flow Externalization) | Add TodoWrite requirement or explicit phase tracking. |

**Rules:**
- Only fix the top 3 from the scoring. Don't touch anything else.
- After fixing, regenerate: `bun scripts/gen-skill-docs.ts`
- Verify the fix didn't break existing mechanisms (grep for preserved patterns from refactor-patterns.md)

Report to driver:
```bash
ACTION=$(/tmp/skill-review-loop-driver.sh "$SKILL_NAME" fix-done)
# Always returns: ACTION: SCORE
```

Follow the returned ACTION (loop back to scoring).

### On `ACTION: PASS`

```bash
ITER=$(cat /tmp/skill-review-loop-${SKILL_NAME}.state)
```

The skill reached Usable quality (≥ 18/30). Present the result:

```
/skill-review loop complete — PASS ✅

Skill: /[name]
Iterations: [N]

Score progression:
  Round 1: [score]/30 — fixed [D10, A1, C7]
  Round 2: [score]/30 — fixed [E13, E14, C8]
  Round 3: [score]/30 — PASS

Final scorecard:
  [full 15-dimension scorecard]

Remaining gaps (below 2/2):
  - [dimension]: [current score] — [what would make it a 2]
```

Commit all changes:
```bash
git add skills/$SKILL_NAME/
git commit -m "refactor($SKILL_NAME): Auto-reviewed to [score]/30 ([grade]) in [N] rounds

Improvements:
- [list what was fixed per round]

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

### On `ACTION: MAX_ITER`

Max 3 iterations reached. Present what was achieved and what remains:

```
/skill-review loop — MAX ITERATIONS (3 rounds)

Skill: /[name]
Score: [start]/30 → [final]/30 (+[delta])

Fixed in 3 rounds:
  [list all fixes]

Remaining issues (need manual attention):
  - [dimension]: [score] — [what's needed]

Status: DONE_WITH_CONCERNS — improved but below Usable threshold.
```

Commit whatever was improved. Don't leave uncommitted changes.

---

## Important Rules

- **Evidence for every score.** Never score without citing a line number or quote.
- **方案 1 only for splits.** All references read upfront. Zero mid-interaction file reads.
- **Preserve mechanisms.** Before refactoring, grep for the patterns in refactor-patterns.md. If any are found, they MUST remain in the main template.
- **Don't over-split.** Skills under 200 lines don't need progressive disclosure. Small utility skills (careful, guard, unfreeze) should stay as single files.
- **Regenerate after every refactor.** Always run `bun scripts/gen-skill-docs.ts` after changes.
- **Commit atomically.** One skill per commit. Include before/after line counts and score delta in commit message.

## Review Log

```bash
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-review-log" '{"skill":"skill-review","timestamp":"TIMESTAMP","status":"STATUS","target":"TARGET_SKILL","score_before":N,"score_after":N,"delta":N,"operation":"OPERATION","commit":"COMMIT"}' 2>/dev/null || true
```
