---
name: game-retro
description: "Game development sprint/milestone retrospective. Tracks feature completion, bug density trends, velocity, and team health with quantitative metrics."
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
echo '{"skill":"game-retro","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'"$_SLUG_SAFE"'","branch":"'"$_BRANCH_SAFE"'"}'  >> ~/.gstack/analytics/skill-usage.jsonl 2>/dev/null || true

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
  --skill "game-retro" --duration "$_TEL_DUR" --outcome "OUTCOME" \
  --used-browse "false" --session-id "$_SESSION_ID" 2>/dev/null &
```


# /game-retro: Development Retrospective

Structured retrospective for game development sprints and milestones.

## Step 0: Retro Scope

```bash
# Gather git activity for the period
_SINCE=${1:-"2 weeks ago"}
echo "=== Retro period: $_SINCE to now ==="
git log --since="$_SINCE" --oneline --no-merges | head -30
echo "---"
git log --since="$_SINCE" --format="%an" | sort | uniq -c | sort -rn | head -10
echo "---"
git diff --stat $(git log --since="$_SINCE" --format="%H" | tail -1)..HEAD 2>/dev/null | tail -5
```

AskUserQuestion: What period are we reviewing? Sprint/milestone name?

## Section 1: Delivery Metrics

**Feature Completion:**
```
Planned Features    Completed    Carried Over    Cut
──────────────      ─────────    ────────────    ───
___                 ___          ___             ___

Completion Rate: ___%
```

**Bug Metrics:**
```
Bugs opened:     ___
Bugs closed:     ___
Net bug delta:   ___ (positive = growing debt)
Critical bugs:   ___ open / ___ closed
Bug density:     ___ bugs per 1000 LOC changed
```

**Velocity:**
- Story points / features completed vs planned
- Trend: Accelerating / Stable / Decelerating / Erratic

**Game-Specific Metrics (track these, not just code metrics):**
```
Playability score delta:  _/12 → _/12 (from /build-playability-review)
Feel pass score delta:    _/14 → _/14 (from /feel-pass)
GDD health score delta:   _/10 → _/10 (from /game-review)
Design intent survival:   ___% of handoff acceptance criteria met
Prototype hypothesis:     VALIDATED / INVALIDATED / INCONCLUSIVE / NOT TESTED
Content pipeline:         ___ assets delivered / ___ planned
Playtest sessions:        ___ conducted / ___ planned
Player feedback items:    ___ collected → ___ acted on → ___ deferred
```

**The Game-Specific Question:** "Did we make the game MORE FUN this sprint, or just more complete?" If velocity is high but playability score didn't move, we shipped features, not experience.

## Section 2: What Went Well

For each item:
- What specifically happened?
- Why did it go well? (skill? process? luck?)
- Is it repeatable?

## Section 3: What Didn't Go Well

For each item:
- What specifically happened?
- Root cause (not blame — systemic issue)
- Impact on delivery

## Section 4: Surprises & Learnings

- What was unexpected? (positive or negative)
- What do we know now that we didn't know at sprint start?
- Any Eureka moments? (conventional approach was wrong, found better way)

## Section 5: Action Items

For each action:
- **What:** Specific, actionable change
- **Who:** Owner (person, not "the team")
- **When:** Deadline or next checkpoint
- **Measure:** How do we know it worked?

Maximum 3 action items. More than 3 = nothing gets done.

## Section 6: Milestone Health Check

```
Milestone: [name]
Target date: [date]
Current progress: ___%

Risk level: 🟢 On track / 🟡 At risk / 🔴 Behind
Confidence: [1-10] that we'll hit the date with planned scope
```

If confidence < 7: What scope cuts would bring it to 8+?

**Game Milestone Types (each has different health criteria):**

| Milestone Type | Health = | Risk Signal |
|---------------|----------|-------------|
| **First Playable** | Core loop works, someone played it | No playtest happened |
| **Vertical Slice** | All systems present, 10-min session | Systems don't integrate |
| **Alpha** | Feature complete, content placeholder OK | Features still being added |
| **Beta** | Content complete, polish phase | Content still being created |
| **Gold/RC** | Ship-ready, certification passed | Critical bugs still open |

**Ask:** "Which milestone type is this? Are we measuring the right health criteria for this stage?"

## AUTO/ASK/ESCALATE

- **AUTO:** Calculate metrics from git history, generate charts
- **ASK:** Interpretation of trends, action item prioritization
- **ESCALATE:** Velocity declining 3 sprints in a row, critical bug count growing, milestone at risk

## Anti-Sycophancy

Forbidden:
- ❌ "Great progress this sprint"
- ❌ "The team worked hard"
- ❌ "Solid delivery"

Instead: Show the numbers. "Planned 8 features, delivered 5. Completion rate 62.5%, down from 75% last sprint. Trend: decelerating."

## Completion Summary

```
Retrospective:
  Period: [dates]
  Features: ___/___  completed (___%)
  Bug delta: ___
  Velocity trend: [accelerating/stable/decelerating]
  Action items: ___ (max 3)
  Milestone confidence: ___/10
  STATUS: DONE

  Next Step:
    PRIMARY: /triage — cycle complete, start next iteration
```

## Save Artifact

```bash
_DATETIME=$(date +%Y%m%d-%H%M%S)
echo "Saving to: $_PROJECTS_DIR/${_USER}-${_BRANCH}-retro-${_DATETIME}.md"
```

Write to `$_PROJECTS_DIR/{user}-{branch}-retro-{datetime}.md`. Supersedes prior if exists.

Discoverable by: /game-ship

## Review Log

```bash
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-review-log" '{"skill":"game-retro","timestamp":"TIMESTAMP","status":"STATUS","completion_rate":RATE,"bug_delta":N,"velocity_trend":"TREND","commit":"COMMIT"}' 2>/dev/null || true
```
