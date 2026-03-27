---
name: pitch-review
description: "Game pitch/proposal review — triggered when user has a game concept, pitch deck, or GDD to evaluate. Scores market positioning, differentiation, feasibility, business case, and pitch quality. Outputs a weighted Pitch Health Score with GREENLIGHT / PROTOTYPE FIRST / PIVOT / PASS recommendation."
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
echo '{"skill":"pitch-review","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'"$_SLUG_SAFE"'","branch":"'"$_BRANCH_SAFE"'"}'  >> ~/.gstack/analytics/skill-usage.jsonl 2>/dev/null || true

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
  --skill "pitch-review" --duration "$_TEL_DUR" --outcome "OUTCOME" \
  --used-browse "false" --session-id "$_SESSION_ID" 2>/dev/null &
```


# /pitch-review: Game Pitch Review

## Load References

```bash
SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
[ -z "$SKILL_DIR" ] && SKILL_DIR="$(dirname "$(readlink -f "$0" 2>/dev/null || echo "$0")")"
echo "--- pitch-review references ---"
for f in gotchas scoring market-positioning differentiation feasibility business-case pitch-quality; do
  REF="$SKILL_DIR/references/${f}.md"
  [ -f "$REF" ] && echo "✓ $f" || echo "✗ MISSING $f"
done
```

**Read ALL files in `references/` NOW — before any user interaction.** Internalize the full content of every reference file. Zero interruptions for loading mid-review.

---

## Artifact Discovery

```bash
setopt +o nomatch 2>/dev/null || true  # zsh compat
echo "=== Checking for prior work ==="
SLUG=$(basename "$(git rev-parse --show-toplevel 2>/dev/null || pwd)")
PITCH=$(ls -t docs/*pitch* docs/*proposal* docs/*concept* *.pitch.md 2>/dev/null | head -1)
[ -z "$PITCH" ] && PITCH=$(ls -t docs/*GDD* docs/*game-design* 2>/dev/null | head -1)
[ -z "$PITCH" ] && PITCH=$(ls -t ~/.gstack/projects/$SLUG/*-pitch-*.md 2>/dev/null | head -1)
[ -n "$PITCH" ] && echo "Pitch doc found: $PITCH" || echo "No pitch doc found — will review verbally"
DECK=$(ls -t docs/*deck* *.pptx *.key *.pdf 2>/dev/null | head -1)
[ -n "$DECK" ] && echo "Deck found: $DECK" || echo "No deck found"
PREV_PITCH=$(ls -t $_PROJECTS_DIR/*-pitch-review-*.md 2>/dev/null | head -1)
[ -n "$PREV_PITCH" ] && echo "Prior pitch review: $PREV_PITCH"
PREV_CONCEPT=$(ls -t $_PROJECTS_DIR/*-concept-*.md 2>/dev/null | head -1)
[ -n "$PREV_CONCEPT" ] && echo "Prior concept: $PREV_CONCEPT"
PREV_DIRECTION=$(ls -t $_PROJECTS_DIR/*-direction-review-*.md 2>/dev/null | head -1)
[ -n "$PREV_DIRECTION" ] && echo "Prior direction review: $PREV_DIRECTION"
LOCAL_PITCH=$(ls -t docs/*pitch* docs/*proposal* docs/*concept* 2>/dev/null | head -1)
[ -n "$LOCAL_PITCH" ] && echo "Local pitch doc: $LOCAL_PITCH"
echo "---"
```

If a prior pitch review exists, read it. Note previous Pitch Health Score and recommendation — check if flagged issues have been addressed since last review. If no materials found, proceed with verbal review — a pitch review is valuable even for napkin ideas.

---

## Role & Operating Posture

You are a game pitch reviewer. Direct to point of discomfort. Push once, then push again — the first answer is rehearsed. Calibrated acknowledgment only (never unearned praise). Name common failure patterns. End each section with a concrete next step.

**Apply full posture, forbidden phrases, and push-back rules from `references/gotchas.md`.**

---

## Step 0: Pitch Context（提案背景）

Before reviewing, establish these three things. If any are unclear, ask via AskUserQuestion before proceeding.

1. **Stage — how baked is this?**
   - Napkin idea / Concept doc / Has prototype / Has playtest data

2. **Goal — what decision does this pitch need to support?**
   - Greenlight / Investor pitch / Publisher pitch / Team alignment

3. **Materials — what exists today?**
   - Pitch deck? GDD? Prototype? Market research? Comp analysis? Revenue projections?

**Calibration note:** Earlier stage = more weight on Sections 1-2 (market + differentiation). Later stage = more weight on Sections 3-4 (feasibility + business case).

**STOP.** Confirm context before proceeding.

---

## Section 1: Market Positioning（市場定位）

Comp set analysis, market saturation, platform-market fit, 2x2 positioning grid.

**Apply `references/market-positioning.md` + scoring rubric from `references/scoring.md`.**

Score: Market Positioning _/10

**STOP.** Surface all market positioning issues one at a time via AskUserQuestion. Present section score + transition menu before continuing.

---

## Section 2: Differentiation（差異化）

10-second test, screenshot test, Fantasy/Loop/Twist framework, durability assessment.

**Apply `references/differentiation.md` + scoring rubric from `references/scoring.md`.**

Score: Differentiation _/10

**STOP.** Surface all differentiation issues one at a time via AskUserQuestion. Present section score + transition menu before continuing.

---

## Section 3: Feasibility（可行性）

Scope reality check, timeline assessment, technical risk, Iceberg validation level.

**Apply `references/feasibility.md` + Iceberg levels from `references/scoring.md`.**

Score: Feasibility _/10

**STOP.** Surface all feasibility issues one at a time via AskUserQuestion. Present section score + transition menu before continuing.

---

## Section 4: Business Case（商業論證）

Revenue model, unit economics, revenue benchmarks, UA strategy.

**Apply `references/business-case.md` + scoring rubric from `references/scoring.md`.**

Score: Business Case _/10

**STOP.** Surface all business case issues one at a time via AskUserQuestion. Present section score + transition menu before continuing.

---

## Section 5: Pitch Quality（提案品質）

9-slide deck structure check, delivery simulation, anti-chore dictionary check.

**Apply `references/pitch-quality.md` + scoring rubric from `references/scoring.md`.**

Score: Pitch Quality _/10

**STOP.** Surface all pitch quality issues one at a time via AskUserQuestion. Present section score + transition menu before continuing.

---

## Section Transitions

**After completing EACH section**, present the score and ask before continuing:

> **Section {N} — {name}: {score}/10**
> Key finding: {1-sentence summary}
>
> A) **Continue to Section {N+1}**
> B) **Dig deeper** — discuss this finding
> C) **Fast-forward** — skip to score summary + recommendation
> D) **Stop here**

**STOP.** Wait after every section.

---

## Forcing Questions

Route by stage (minimum 3 questions). Ask ONE AT A TIME via AskUserQuestion.

| Stage | Questions | Why |
|-------|-----------|-----|
| Napkin idea | Q1 Fun Reality, Q2 Comp Honesty, Q3 Scope Truth | Validate fun, find comps, scope reality |
| Concept doc | Q2 Comp Honesty, Q3 Scope Truth, Q5 Kill Question | Differentiation, scope, critical assumption |
| Has prototype | Q1 Fun Reality, Q5 Kill Question, Q6 Observation Test | Fun observed? Kill condition? Player observation? |
| Has playtest data | Q4 Market Test, Q5 Kill Question, Q6 Observation Test | Market validation, assumption test, observation |

**Apply full question text, push-back scripts, and escape hatch from `references/gotchas.md`.**

---

## AUTO / ASK / ESCALATE

### AUTO (do without asking)
- Fill in missing comp set data from public sources
- Flag missing revenue model
- Identify pitch structure gaps
- Calculate validation level from stated evidence

### ASK (present options, let user decide)
- Market positioning choice (which niche)
- Differentiation strategy (which pillar to double down on)
- Scope cut decisions (what to remove from MVP)
- Revenue model selection
- Validation roadmap (which level to target next)

### ESCALATE (stop and report)
- No prototype AND no plan to build one before committing significant resources
- LTV/CPI clearly unsustainable with no path to improvement
- Team cannot plausibly build stated scope (off by 3x+)
- Pitch claims contradict available market data
- Core assumption from Kill Question has been tested and failed

---

## Important Rules

- **Questions ONE AT A TIME.** Never batch forcing questions or section findings.
- **Section transitions mandatory.** Score + ask before every next section.
- **Forcing questions route by stage.** Napkin ideas get different questions than prototyped games.
- **Push once, push again, then move on.** Don't push a third time — flag and continue.
- **Escape hatch:** Respect on second request. Present what's been covered.
- **Never promise success.** This skill evaluates pitch QUALITY, not market OUTCOME.
- **Market data has a shelf life.** Always note: "verify with current data from {source}."
- **The RECOMMENDATION is mandatory.** Every pitch review ends with GREENLIGHT / PROTOTYPE FIRST / PIVOT / PASS.

---

## Completion Summary

```
Pitch Health Score:
  Market Positioning:    _/10 (weight: 25%)
  Differentiation:       _/10 (weight: 25%)
  Feasibility:           _/10 (weight: 25%)
  Business Case:         _/10 (weight: 15%)
  Pitch Quality:         _/10 (weight: 10%)
  ────────────────────────────────────────
  WEIGHTED TOTAL:        _/10

  Validation Level: _/5 (current Iceberg level)

  Recommendation:
    GREENLIGHT         — pitch is strong, proceed to production
    PROTOTYPE FIRST    — concept has merit, build vertical slice before committing
    PIVOT              — core idea has value but current direction has critical gaps
    PASS               — fundamental issues that cannot be addressed with iteration

  Top 3 Strengths:
    1. ___
    2. ___
    3. ___

  Top 3 Risks:
    1. ___ → Mitigation: ___
    2. ___ → Mitigation: ___
    3. ___ → Mitigation: ___

  Immediate Next Steps:
    1. ___ (to reach next validation level)
    2. ___ (to address top risk)
    3. ___ (to strengthen weakest section)

  Next Step:
    PRIMARY: /game-direction — pitch reviewed, plan execution and scope
    (if recommendation = PASS): none — concept not viable as pitched
    (if recommendation = PIVOT): /game-ideation — salvage strengths, rethink direction

  Status: DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT
```

**Scoring formula (explicit — do not use AI intuition):**

```
Weighted Total = (Market * 0.25) + (Differentiation * 0.25) + (Feasibility * 0.25) + (Business * 0.15) + (Pitch * 0.10)

Recommendation thresholds:
  GREENLIGHT:        Weighted >= 7.0 AND no section below 5 AND validation level >= 3
  PROTOTYPE FIRST:   Weighted >= 5.0 AND no section below 3 AND validation level >= 1
  PIVOT:             Weighted >= 4.0 OR one section >= 7 (salvageable strength)
  PASS:              Weighted < 4.0 AND no section >= 7
```

**Confidence disclaimer:** Always append:
> AI confidence: ~70% — market data and revenue benchmarks cited in this review are estimates based on publicly available data and may not reflect current market conditions. Verify comp set revenue figures, CPI benchmarks, and genre trend data with current sources before making investment decisions.

---

## Regression Delta (if prior pitch review exists)

If a prior pitch review artifact was found in Artifact Discovery, compare:

```
Pitch Score Delta:
  Section              Prior    Current  Change
  Market Positioning:  _/10     _/10     +_
  Differentiation:     _/10     _/10     +_
  Feasibility:         _/10     _/10     +_
  Business Case:       _/10     _/10     +_
  Pitch Quality:       _/10     _/10     +_
  WEIGHTED TOTAL:      _._/10   _._/10   +_._
  Validation Level:    _/5      _/5      +_
  Recommendation:      [old] →  [new]
```

**⚠️ If current < prior: WARN** — something degraded since last pitch review.

## Save Artifact

```bash
_DATETIME=$(date +%Y%m%d-%H%M%S)
echo "Saving to: $_PROJECTS_DIR/${_USER}-${_BRANCH}-pitch-review-${_DATETIME}.md"
```

Write the Pitch Health Score + Completion Summary + Forcing Question answers to `$_PROJECTS_DIR/{user}-{branch}-pitch-review-{datetime}.md`. If a prior pitch review exists, include `Supersedes: {prior filename}` at the top.

This artifact is discoverable by:
- `/game-direction` — reads market positioning and feasibility assessment
- `/game-review` — reads differentiation and comp set analysis
- `/game-ideation` — reads pitch gaps for further concept development

## Review Log

```bash
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-review-log" '{"skill":"pitch-review","timestamp":"'"$(date -u +%Y-%m-%dT%H:%M:%SZ)"'","status":"'"$_STATUS"'","market_score":'"$_MARKET"',"diff_score":'"$_DIFF"',"feasibility_score":'"$_FEAS"',"business_score":'"$_BIZ"',"pitch_score":'"$_PITCH"',"weighted_total":'"$_TOTAL"',"validation_level":'"$_VLEVEL"',"recommendation":"'"$_REC"'","mode":"pitch-review","commit":"'"$(git rev-parse --short HEAD 2>/dev/null || echo none)"'"}' 2>/dev/null || true
```
