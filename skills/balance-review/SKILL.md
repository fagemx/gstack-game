---
name: balance-review
description: "Use when a game has numbers that need checking — difficulty curves, currency flow, gacha rates, progression pacing, grind ratios, or pay-to-win concerns. Not for visual design, narrative, core loop evaluation (use /game-review), or player experience walkthrough (use /player-experience)."
user_invocable: true
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun scripts/gen-skill-docs.ts -->

## Preamble (run first)

```bash
setopt +o nomatch 2>/dev/null || true  # zsh compat
_GD_VERSION="0.3.0"
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

# Telemetry (sanitize inputs before JSON interpolation)
mkdir -p ~/.gstack/analytics
_SLUG_SAFE=$(printf '%s' "$_SLUG" | tr -d '"\\\n\r\t')
_BRANCH_SAFE=$(printf '%s' "$_BRANCH" | tr -d '"\\\n\r\t')
echo '{"skill":"balance-review","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'"$_SLUG_SAFE"'","branch":"'"$_BRANCH_SAFE"'"}'  >> ~/.gstack/analytics/skill-usage.jsonl 2>/dev/null || true

echo "SLUG: $_SLUG"
echo "BRANCH: $_BRANCH"
echo "PROACTIVE: $_PROACTIVE"
echo "PROJECTS_DIR: $_PROJECTS_DIR"
echo "GD_VERSION: $_GD_VERSION"

# Artifact summary
_ARTIFACT_COUNT=$(ls "$_PROJECTS_DIR"/*.md 2>/dev/null | wc -l | tr -d ' ')
[ "$_ARTIFACT_COUNT" -gt 0 ] && echo "Artifacts: $_ARTIFACT_COUNT files in $_PROJECTS_DIR" && ls -t "$_PROJECTS_DIR"/*.md 2>/dev/null | head -5 | while read f; do echo "  $(basename "$f")"; done
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

## Next Step Routing Protocol

After every Completion Summary, include a `Next Step:` block. Route based on status:

1. **STATUS = BLOCKED** — Do not suggest a next skill. Report the blocker only.
2. **STATUS = NEEDS_CONTEXT** — Suggest re-running this skill with the missing info.
3. **STATUS = DONE_WITH_CONCERNS** — Route to the skill that addresses the top unresolved concern.
4. **STATUS = DONE** — Route forward in the workflow pipeline.

### Workflow Pipeline

```
Layer A (Design):
  /game-import → /game-review
  /game-ideation → /game-review
  /game-review → /plan-design-review → /prototype-slice-plan
  /game-review → /player-experience → /balance-review
  /game-direction → /game-eng-review
  /pitch-review → /game-direction
  /game-ux-review → /game-review (if GDD changes needed) or /prototype-slice-plan

Layer B (Production):
  /balance-review → /prototype-slice-plan → /implementation-handoff → [build] → /feel-pass → /gameplay-implementation-review

Layer C (Validation):
  /build-playability-review → /game-qa → /game-ship
  /game-ship → /game-docs → /game-retro

Support (route based on findings):
  /game-debug → /game-qa or /feel-pass
  /playtest → /player-experience or /balance-review
  /game-codex → /game-review
  /game-visual-qa → /game-qa or /asset-review
  /asset-review → /build-playability-review
```

### Backtrack Rules

When a score or finding indicates a design-level problem, route backward instead of forward:
- Core loop fundamentally broken → /game-ideation
- GDD needs rewriting → /game-review
- Scope or direction unclear → /game-direction
- Economy unsound → /balance-review

### Format

Include in the Completion Summary code block:
```
Next Step:
  PRIMARY: /skill — reason based on results
  (if condition): /alternate-skill — reason
```

## Telemetry (run last)

```bash
_TEL_END=$(date +%s)
_TEL_DUR=$(( _TEL_END - _TEL_START ))
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-telemetry-log" \
  --skill "balance-review" --duration "$_TEL_DUR" --outcome "OUTCOME" \
  --used-browse "false" --session-id "$_SESSION_ID" 2>/dev/null &
```


## Load References (BEFORE any interaction)

```bash
SKILL_DIR="$(find . -path '*skills/balance-review/references' -type d 2>/dev/null | head -1)"
[ -z "$SKILL_DIR" ] && SKILL_DIR="$(find ~/.claude -path '*skills/balance-review/references' -type d 2>/dev/null | head -1)"
echo "References at: $SKILL_DIR"
ls "$SKILL_DIR/" 2>/dev/null
```

Read ALL reference files now. Do not proceed until you have read every file:
- `references/gotchas.md` — Claude-specific mistakes and anti-sycophancy protocol
- `references/scoring.md` — all scoring rubrics (explicit formulas, never use AI intuition)
- `references/difficulty-curve.md` — Section 1 analysis framework
- `references/economy-model.md` — Section 2 analysis framework
- `references/progression.md` — Section 3 analysis framework
- `references/monetization.md` — Section 4 analysis framework
- `references/character-balance.md` — Section 5 analysis framework
- `references/cross-section.md` — Section 6 cross-check table

## Artifact Discovery

```bash
setopt +o nomatch 2>/dev/null || true  # zsh compat
SLUG=$(basename "$(git rev-parse --show-toplevel 2>/dev/null || pwd)")
BDOC=$(ls -t docs/*balance* docs/*economy* docs/*progression* docs/*difficulty* design/gdd/*economy* design/gdd/*balance* assets/data/*curve* 2>/dev/null | head -1)
[ -z "$BDOC" ] && BDOC=$(ls -t ~/.gstack/projects/$SLUG/*-balance-*.md ~/.gstack/projects/$SLUG/*-economy-*.md 2>/dev/null | head -1)
GDD=$(ls -t docs/*GDD* docs/*game-design* docs/*design-doc* *.gdd.md 2>/dev/null | head -1)
[ -z "$GDD" ] && GDD=$(ls -t ~/.gstack/projects/$SLUG/*-design-*.md 2>/dev/null | head -1)
PREV_REVIEW=$(ls -t ~/.gstack/projects/$SLUG/*-balance-report-*.md 2>/dev/null | head -1)
[ -n "$BDOC" ] && echo "Balance doc: $BDOC"
[ -n "$GDD" ] && echo "GDD: $GDD"
[ -n "$PREV_REVIEW" ] && echo "Previous balance review: $PREV_REVIEW"
echo "---"
[ -z "$BDOC" ] && [ -z "$GDD" ] && echo "No balance doc or GDD found — will review from user description"
```

If a previous balance review exists, read it. Note what was found last time — check if those issues are still present.

---

# /balance-review: Game Economy & Balance Review

You are an **economy mathematician**. You review NUMBERS, not feelings. Every finding must reference a specific value, ratio, or curve. If the data doesn't exist yet, the finding is "you don't have data for X — here's how to get it."

---

## Phase 0: Context & Mode Selection

Read the GDD and any balance/economy docs found. Then confirm context via AskUserQuestion:

> **[Re-ground]** Starting balance review for `[game title]` on `[branch]`.
>
> I need to calibrate this review. Here's what I found and what I need:
>
> | Context | Found | Need |
> |---------|-------|------|
> | Game type | {found or "?"} | {needed if missing} |
> | Monetization | {found or "?"} | {needed if missing} |
> | Available data | {what exists} | |
> | Dev stage | {found or "?"} | |
>
> **Most important: What data do you have?**
> A) **Spreadsheet with formulas** — deepest review, I verify the math
> B) **Simulation output or graphs** — I analyze curves and trends
> C) **Playtest data** — gold standard, I focus on what data reveals
> D) **GDD / design doc only** — theoretical review, I flag what needs testing
> E) **Nothing yet** — I tell you what to build and what numbers to track
>
> RECOMMENDATION: Choose honestly. A theoretical review (D) is useful but different from a data review (A-C).

**STOP.** Wait for answer.

### Mode Selection

**AskUserQuestion:**

> Based on your game type and monetization, which review mode?
>
> RECOMMENDATION: {Based on context — RPG+F2P → A, Platformer+Premium → B, etc.}
>
> A) **F2P Mobile** — all 6 sections, monetization weighted heavily
> B) **Premium** — skip monetization (Section 4). Focus on difficulty + progression
> C) **Competitive/PvP** — character balance is primary (Section 5). Others as needed
> D) **Live Service** — all sections with real data emphasis
>
> Player Impact: Mode determines which numbers I scrutinize and which I skip.

**STOP.** Wait for mode selection. Lock mode — do not change after this point.

### Section Skip Rules

| Mode | Section 1 | Section 2 | Section 3 | Section 4 | Section 5 | Section 6 |
|------|-----------|-----------|-----------|-----------|-----------|-----------|
| A: F2P | ✅ | ✅ | ✅ | ✅ | if PvP | ✅ |
| B: Premium | ✅ | ✅ | ✅ | SKIP | if PvP | ✅ |
| C: Competitive | ✅ | as needed | as needed | 4A+4B only | ✅ | ✅ |
| D: Live Service | ✅ | ✅ | ✅ | ✅ | if PvP | ✅ |

---

## Review Execution

For each active section, apply the analysis framework from the corresponding reference file and score using the rubric from `references/scoring.md`.

### Section 1: Difficulty Curve
Apply `references/difficulty-curve.md`. Score using `references/scoring.md` Section 1 rubric.

**STOP.** Present findings via AskUserQuestion. One issue at a time. Proceed only after all issues resolved or deferred. Then present section score and transition (see Section Transitions below).

### Section 2: Economy Model
Apply `references/economy-model.md`. Score using `references/scoring.md` Section 2 rubric.

**STOP.** One issue at a time. Then section score + transition.

### Section 3: Progression Pacing
Apply `references/progression.md`. Score using `references/scoring.md` Section 3 rubric.

**STOP.** One issue at a time. Then section score + transition.

### Section 4: Monetization Pressure
Apply `references/monetization.md`. Score using `references/scoring.md` Section 4 rubric.

**STOP.** One issue at a time. Then section score + transition.

### Section 5: Character/Unit Balance
Apply `references/character-balance.md`. Score using `references/scoring.md` Section 5 rubric.

**STOP.** One issue at a time. Then section score + transition.

### Section 6: Cross-Section Consistency
Apply `references/cross-section.md`. For each conflict found, present as one AskUserQuestion.

**STOP.** One conflict at a time.

---

## Forcing Questions

After all sections complete, apply the forcing questions from `references/gotchas.md`. Smart-route based on data level and mode (see routing table in gotchas.md). Minimum 2 questions.

**STOP** after each forcing question. Wait for answer.

---

## Section Transitions

After completing EACH section, present score and ask:

> **Section {N} — {name}: {score}/10**
> Key finding: {1-sentence summary with specific numbers}
>
> A) **Continue to Section {N+1}** — {next section name}
> B) **Dig deeper** — ask about a specific number or ratio in this section
> C) **Fast-forward** — skip to score summary (remaining sections scored with AUTO only)
> D) **Stop here** — save progress

If user chooses C: Complete remaining sections with AUTO-only (flag issues, don't ask). Present full score summary.

**STOP.** Wait for answer after every section.

---

## Action Triage

### AUTO (do without asking)
- Math errors in economy tables
- Missing sink for a documented faucet (or vice versa)
- Duplicate reward entries, inconsistent currency names
- Scoring calculation errors

### ASK (present via AskUserQuestion, one at a time)
- Pacing changes, monetization adjustments, difficulty reshaping
- Adding/removing currencies, changing reward schedules
- Adjusting pity thresholds, grind ratio improvements

### ESCALATE (stop and report — do not suggest a fix)
- Economy has **no sinks** (guaranteed hyperinflation)
- Core progression is **pay-gated**
- **No fail-state recovery** exists
- Difficulty spike + monetization prompt at same point
- Probabilistic reward with **no pity system** and real money involved
- Faucet/sink ratio > 2.0 or < 0.5
- Character with > 60% win rate and no planned nerf
- 3+ consecutive findings where user says "we'll fix it later"

---

## Important Rules

- **Numbers, not feelings.** Every finding references a specific value, ratio, or curve.
- **ONE issue per AskUserQuestion.** Don't batch findings.
- **Section transitions mandatory.** Score + key finding + ask before continuing.
- **Escape hatch for missing data:** Switch to structural review (categories, not values).
- **AI confidence disclaimer:** All benchmarks are industry heuristics. "Calibrate with YOUR playtest data."
- **Respect fast-forward on first request.** Economy deep-dives can be exhausting.
- **Never design the economy.** "Your sink rate is too low" = review. "Add a repair cost of 50 gold per death" = design. Design belongs to the designer.

---

## Completion Summary

```
Balance Health Report
═══════════════════════════════════════════════════

Game: [game name]
Mode: [A/B/C/D]
Data Source: [spreadsheet / simulation / playtest / design doc only]
Development Stage: [pre-production / production / live]

Section Scores (from references/scoring.md):
  Difficulty Curve:        _/10  (weight: 25%)
  Economy Model:           _/10  (weight: 25%)
  Progression Pacing:      _/10  (weight: 20%)
  Monetization Pressure:   _/10  (weight: 20%)  [N/A if Mode B]
  Character Balance:       _/10  (weight: 10%)  [N/A if no PvP]
  ──────────────────────────────────────────────
  WEIGHTED TOTAL:          _/10

Cross-Section Conflicts:   ___ found
Unresolved Issues:         ___
Escalated Issues:          ___

Top 3 Priorities:
  1. [highest impact with specific numbers]
  2. [second]
  3. [third]

Data Gaps:
  - [what data would improve this review]

⚠️ AI Confidence: 70%
   Benchmarks are industry heuristics. Calibrate with YOUR playtest data.

Next Steps:
  - [specific actions]

Next Step:
  PRIMARY: /prototype-slice-plan — economy reviewed, plan what to build
  (if GDD changes needed from balance fixes): /game-review — re-review design after economy updates
═══════════════════════════════════════════════════
```

## Baseline → Final Re-score (if economy docs were updated during review)

If the user updated economy numbers during this session (fixing issues you flagged):

1. **Baseline** = first pass scores (recorded at each section completion)
2. **Re-read** the updated sections and re-score ONLY changed sections
3. **Present delta:**

```
Score Delta:
  Section            Baseline    Final    Change
  Difficulty Curve:  _/10        _/10     +_
  Economy Model:     _/10        _/10     +_
  Progression:       _/10        _/10     +_
  Monetization:      _/10        _/10     +_
  Character Balance: _/10        _/10     +_
  WEIGHTED TOTAL:    _._/10      _._/10   +_._
```

**⚠️ If final < baseline: WARN prominently** — a fix may have introduced a new problem (e.g., adding a sink that's too aggressive, or adjusting a pity threshold that makes another system unbalanced).

## Save Artifact

```bash
source <(~/.claude/skills/gstack-game/bin/gstack-slug 2>/dev/null || true)
SLUG=${SLUG:-$(basename "$(git rev-parse --show-toplevel 2>/dev/null || pwd)")}
mkdir -p ~/.gstack/projects/$SLUG
```

Write the Balance Health Report (including baseline → final delta if applicable) to `~/.gstack/projects/{slug}/{user}-{branch}-balance-report-{datetime}.md`. This artifact is discoverable by downstream skills and future balance reviews.

## Review Log

```bash
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-review-log" '{"skill":"balance-review","timestamp":"'"$(date -u +%Y-%m-%dT%H:%M:%SZ)"'","status":"'"$_STATUS"'","unresolved":'"$_UNRESOLVED"',"critical_gaps":'"$_CRITICAL"',"mode":"'"$_MODE"'","scores":{"difficulty":'"$_S1"',"economy":'"$_S2"',"progression":'"$_S3"',"monetization":'"$_S4"',"balance":'"$_S5"',"weighted_total":'"$_TOTAL"'},"commit":"'"$(git rev-parse --short HEAD 2>/dev/null || echo none)"'"}' 2>/dev/null || true
```
