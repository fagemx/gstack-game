---
name: game-review
description: |
  Trigger: User wants a structured review of a Game Design Document (GDD).
  Use when: "review my GDD", "game review", "check my game design", "how's my GDD", "/game-review", or user has a docs/gdd.md and asks for design feedback.
  Do NOT use when: User wants code review (use /review), balance-specific analysis (use /balance-review), or brainstorming from scratch (use /game-ideation).
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
echo '{"skill":"game-review","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'"$_SLUG"'","branch":"'"$_BRANCH"'"}'  >> ~/.gstack/analytics/skill-usage.jsonl 2>/dev/null || true

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
  --skill "game-review" --duration "$_TEL_DUR" --outcome "OUTCOME" \
  --used-browse "false" --session-id "$_SESSION_ID" 2>/dev/null &
```


## Load References

```bash
echo "=== Loading game-review reference files ==="
ls references/*.md 2>/dev/null | while read f; do echo "  $f"; done
```

**Read ALL `references/` files NOW before any user interaction.** They contain rubrics, frameworks, forcing questions, and protocols. Zero interruption — load everything upfront.

## Artifact Discovery

```bash
echo "=== Checking for design docs and prior reviews ==="
# Local GDD
GDD=$(ls -t docs/gdd.md docs/*GDD* docs/*game-design* docs/*design-doc* *.gdd.md 2>/dev/null | head -1)
[ -n "$GDD" ] && echo "GDD: $GDD ($(wc -l < "$GDD") lines)"
# Shared artifacts
PREV_CONCEPT=$(ls -t $_PROJECTS_DIR/*-concept-*.md 2>/dev/null | head -1)
[ -n "$PREV_CONCEPT" ] && echo "Prior concept: $PREV_CONCEPT"
PREV_REVIEW=$(ls -t $_PROJECTS_DIR/*-game-review-*.md 2>/dev/null | head -1)
[ -n "$PREV_REVIEW" ] && echo "Prior game review: $PREV_REVIEW"
PREV_BALANCE=$(ls -t $_PROJECTS_DIR/*-balance-report-*.md 2>/dev/null | head -1)
[ -n "$PREV_BALANCE" ] && echo "Prior balance review: $PREV_BALANCE"
echo "---"
[ -z "$GDD" ] && echo "No GDD found"
```

If no GDD found, offer `/game-import` or `/game-ideation`. If prior review exists, read it and note previous score/findings.

# /game-review: Game Design Document Review

Interactive GDD review via AskUserQuestion. Every recommendation includes WHY + concrete alternative. No vague praise. Apply `references/gotchas.md` for the entire review.

## Phase 0: Read & Orient

Read the GDD. Extract the 5 context anchors (Genre & Platform, Target Session Length, Monetization Model, Target Audience, Design Pillars). Present via AskUserQuestion as a table with ✅/❌ status and what was found. For ❌ items, provide best-guess with [inferred] tag. Ask: A) Correct — proceed, B) Fix these.

**STOP.** Wait for confirmation. For each missing anchor that can't be inferred, ask ONE question with A/B/C/D choices, a RECOMMENDATION, and Player Impact rating. **STOP** after each. Do NOT batch.

### Mode Selection

After ALL anchors are established, ask the user to select a review mode:

**AskUserQuestion:** Present 5 modes with RECOMMENDATION based on confirmed anchors:

> - **A) Mobile / Casual** — retention, economy, session fit, monetization ethics
> - **B) PC / Console** — core loop depth, mastery curve, narrative, session arc
> - **C) Multiplayer / Competitive** — balance, matchmaking, counterplay, P2W risk
> - **D) Narrative** — pacing, branching, emotional arc, ludonarrative consonance
> - **E) Tabletop / Physical** — rules clarity, component ergonomics, player count scaling

**STOP.** Wait for mode selection before starting any section review.

### Mode Weight Table

| Section | A: Mobile | B: PC/Console | C: Multiplayer | D: Narrative | E: Tabletop |
|---------|-----------|---------------|----------------|--------------|-------------|
| 1. Core Loop | 25% | 30% | 25% | 15% | 25% |
| 2. Progression & Retention | 25% | 20% | 15% | 15% | 15% |
| 3. Economy | 25% | 10% | 20% | 5% | 10% |
| 4. Player Motivation | 10% | 15% | 15% | 30% | 20% |
| 5. Risk Assessment | 5% | 10% | 10% | 10% | 10% |
| 6. Cross-Consistency | 10% | 15% | 15% | 25% | 20% |

---

## Review Pacing

**After EACH section**, present: `Section {N} — {name}: {score}/10` + 1-sentence biggest finding. Offer: A) Continue to next, B) Go back, C) Fast-forward (AUTO-only remaining → `DONE_WITH_CONCERNS`), D) Stop here (partial score + pickup list). **STOP.** Wait for answer.

---

## Section 1: Core Loop (核心循環)

Evaluate the nested loop model (micro/meso/macro/meta), MDA framework alignment, and core loop clarity/depth/uniqueness. Apply `references/core-loop.md` for the full evaluation framework, forcing questions, and action classification.

**Score using the Section 1 rubric from `references/scoring.md`. Section 1 Score: ___/10**

**STOP.** Present section score and review pacing options.

---

## Section 2: Progression & Retention (進度與留存)

Evaluate SDT integration at each retention tier (FTUE/D1/D7/D30), flow state design, difficulty curve shape, and churn point identification. Apply `references/progression.md` for the full evaluation framework, benchmarks, forcing questions, and action classification.

**Score using the Section 2 rubric from `references/scoring.md`. Section 2 Score: ___/10**

**STOP.** Present section score and review pacing options.

---

## Section 3: Economy & Monetization (經濟系統)

Evaluate sink/faucet balance, reward psychology (reinforcement schedules), currency clarity, monetization ethics, and spending tier health. Apply `references/economy.md` for the full evaluation framework, red flags, forcing questions, and action classification.

**Score using the Section 3 rubric from `references/scoring.md`. Section 3 Score: ___/10**

**STOP.** Present section score and review pacing options.

---

## Section 4: Player Motivation & Emotion (玩家動機)

Evaluate full SDT analysis across systems, Bartle + Quantic Foundry player type coverage, ludonarrative consonance, and emotional arc design. Apply `references/motivation.md` for the full evaluation framework, forcing questions, and action classification.

**Score using the Section 4 rubric from `references/scoring.md`. Section 4 Score: ___/10**

**STOP.** Present section score and review pacing options.

---

## Section 5: Risk Assessment (風險評估)

Evaluate across 5 risk categories: pillar violation, scope (Lake vs Ocean), technical feasibility, market differentiation, and retention cliffs. Apply `references/risk.md` for the full risk matrix, forcing questions, and action classification.

**Score using the Section 5 rubric from `references/scoring.md`. Section 5 Score: ___/10**

**STOP.** Present section score and review pacing options.

---

## Section 6: Cross-Section Consistency Check (跨段交叉驗證)

Cross-validate findings across Sections 1-5 for contradictions invisible within any single section. Apply `references/cross-section.md` for the full cross-validation matrix and action classification.

**Score using the Section 6 rubric from `references/scoring.md`. Section 6 Score: ___/10**

**STOP.** Present section score and review pacing options.

---

## Forcing Question Smart Routing

Minimum 2 forcing questions per section. Route by GDD state (check GDD Status section or infer from depth):

| GDD State | Focus On |
|-----------|----------|
| Early (many ⚠️/❌) | Foundational — "Describe the core loop" / "Who comes back tomorrow?" |
| Detailed but untested | Validation — "Have you watched someone play?" / "What breaks at 2x scale?" |
| Post-playtest revision | Depth — "What surprised playtesters?" / "What changed since last review?" |

---

## Fix-then-Rescore Loop

When user fixes a flagged issue: re-read updated section → re-score ONLY that section → update running score → continue. Score improves during review; final score reflects GDD state at END, not beginning.

## Baseline → Final Re-score

If user updated GDD during review: record baseline scores at first pass, re-score changed sections after fixes, present delta table (Section / Baseline / Final / Change for each section + weighted total). If final score is WORSE than baseline: **WARN prominently** — a fix introduced a new problem.

---

## Important Rules

- **ONE question at a time.** Never batch forcing questions.
- **Section transitions mandatory.** Score + pacing options after every section.
- **Smart-skip** questions already answered in the GDD.
- **Push twice max.** Vague answer → push for specifics → still vague → flag ASK, move on.
- **Escape hatch:** 1st "skip ahead" → 2 more questions then AUTO-only. 2nd → respect it, AUTO-only all remaining.
- **No code suggestions.** Design review only. Technical issues → note for `/game-eng-review`.
- **Status:** DONE (≥6.0) / DONE_WITH_CONCERNS (4.0-5.9 or fast-forwarded) / BLOCKED (ESCALATE) / NEEDS_CONTEXT (stopped)

---

## Required Outputs

### GDD Health Score

Calculate after all sections. Use score interpretation from `references/scoring.md`.

```
GDD Health Score (Mode: [A/B/C/D/E])
═══════════════════════════════════════════════
  Section 1 — Core Loop:           _/10  (weight: __%)  → weighted: _.___
  Section 2 — Progression:         _/10  (weight: __%)  → weighted: _.___
  Section 3 — Economy:             _/10  (weight: __%)  → weighted: _.___
  Section 4 — Player Motivation:   _/10  (weight: __%)  → weighted: _.___
  Section 5 — Risk Assessment:     _/10  (weight: __%)  → weighted: _.___
  Section 6 — Cross-Consistency:   _/10  (weight: __%)  → weighted: _.___
  ─────────────────────────────────────────────
  WEIGHTED TOTAL:                  _._/10

Top 3 Deductions:
  1. [Section] [Criterion]: -N because [specific reason]
  2. [Section] [Criterion]: -N because [specific reason]
  3. [Section] [Criterion]: -N because [specific reason]
```

### Completion Summary

```
/game-review Completion Summary
═══════════════════════════════════
Mode: [A/B/C/D/E] | GDD: [filename] | Branch: [branch]
Status: DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT

  S0 Context:        [established / missing items]
  S1 Core Loop:      _/10  (___ found, ___ resolved, ___ deferred)
  S2 Progression:    _/10  (___ found, ___ resolved, ___ deferred)
  S3 Economy:        _/10  (___ found, ___ resolved, ___ deferred)
  S4 Motivation:     _/10  (___ found, ___ resolved, ___ deferred)
  S5 Risk:           _/10  (___ risks, ___ high-impact)
  S6 Consistency:    _/10  (___ contradictions)
  WEIGHTED TOTAL:    _._/10
```

### Playtest Protocol

Write a playtest observation guide: key moments to watch (FTUE, first fail, first purchase, session end, churn points), post-session questions, metrics to track (session length, quit points, currency flow, D1 return), red flag behaviors (confusion pauses >5s, repeated clicks, mid-sequence exits).

### NOT in Scope

```
- [Issue]: Deferred because [reason]. Revisit when [condition].
```

### Failure Modes

```
- [Feature]: Fails when [condition]. Player reaction: [behavior]. Mitigation: [fix].
```

---

## Save Artifact

```bash
_DATETIME=$(date +%Y%m%d-%H%M%S)
echo "Saving review to: $_PROJECTS_DIR/${_USER}-${_BRANCH}-game-review-${_DATETIME}.md"
```

Write Completion Summary + GDD Health Score + Playtest Protocol to that path. If prior review exists, include `Supersedes: {prior filename}`.

Discoverable by: `/balance-review` (economy issues), `/player-experience` (churn points), `/game-direction` (risk/scope), `/game-ship` (release gate).

## Review Log

```bash
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-review-log" '{"skill":"game-review","timestamp":"TIMESTAMP","status":"STATUS","score":"SCORE","unresolved":N,"critical_gaps":N,"mode":"MODE","sections":{"core_loop":N,"progression":N,"economy":N,"motivation":N,"risk":N,"consistency":N},"commit":"COMMIT"}' 2>/dev/null || true
```
