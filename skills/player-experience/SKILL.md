---
name: player-experience
description: "First-person player experience walkthrough — simulates playing the game as a specific persona, narrating moment-by-moment what the player sees, feels, and does. Use when you want to find friction, confusion, and churn risks through role-play rather than analysis."
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

# Telemetry
mkdir -p ~/.gstack/analytics
echo '{"skill":"player-experience","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'"$_SLUG"'","branch":"'"$_BRANCH"'"}'  >> ~/.gstack/analytics/skill-usage.jsonl 2>/dev/null || true

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
  --skill "player-experience" --duration "$_TEL_DUR" --outcome "OUTCOME" \
  --used-browse "false" --session-id "$_SESSION_ID" 2>/dev/null &
```


## Load References

```bash
setopt +o nomatch 2>/dev/null || true  # zsh compat
SKILL_DIR="$(dirname "$(readlink -f "${BASH_SOURCE[0]:-$0}")" 2>/dev/null || echo "skills/player-experience")"
for f in "$SKILL_DIR/references"/*.md; do [ -f "$f" ] && echo "REF: $f"; done
```

**Read ALL files in `references/` before any user interaction (zero interruptions):**
- `gotchas.md` — anti-sycophancy, forbidden phrases, Claude-specific pitfalls
- `personas.md` — 6 persona definitions + custom template
- `emotion-vocabulary.md` — fixed emotion terms, healthy/unhealthy patterns with severity
- `walkthrough-phases.md` — Phase 1-5 content, checkpoints, AUTO-FLAG rules, transition format
- `scoring.md` — scoring formula, phase weights, repeat play simulation (Session 1/3/10)

---

## Artifact Discovery

```bash
setopt +o nomatch 2>/dev/null || true  # zsh compat
echo "=== Checking for prior work ==="
PREV_WALKTHROUGH=$(ls -t $_PROJECTS_DIR/*-player-walkthrough-*.md 2>/dev/null | head -1)
[ -n "$PREV_WALKTHROUGH" ] && echo "Prior player walkthrough: $PREV_WALKTHROUGH"
PREV_GAME_REVIEW=$(ls -t $_PROJECTS_DIR/*-game-review-*.md 2>/dev/null | head -1)
[ -n "$PREV_GAME_REVIEW" ] && echo "Prior game review: $PREV_GAME_REVIEW"
PREV_BALANCE=$(ls -t $_PROJECTS_DIR/*-balance-report-*.md 2>/dev/null | head -1)
[ -n "$PREV_BALANCE" ] && echo "Prior balance review: $PREV_BALANCE"
LOCAL_GDD=$(ls -t docs/gdd.md docs/*GDD* docs/*game-design* 2>/dev/null | head -1)
[ -n "$LOCAL_GDD" ] && echo "Local GDD: $LOCAL_GDD"
echo "---"
```

If a prior player walkthrough exists, read it. Note which personas were used and what churn points were identified — compare against this walkthrough.

If a prior game review exists, read it for known design issues and churn risk areas to pay special attention to during the walkthrough.

---

# /player-experience: Player Experience Walkthrough

This skill **role-plays as a player** — not a reviewer. Walk through the game moment-by-moment in first person, narrating what the player sees, feels, thinks, and does. Flag where the experience breaks down. Let the designer draw conclusions.

---

## Step 0: Source Material & Persona Selection

### 0A. Read the GDD

```bash
setopt +o nomatch 2>/dev/null || true  # zsh compat
SLUG=$(basename "$(git rev-parse --show-toplevel 2>/dev/null || pwd)")
GDD=$(ls -t docs/*GDD* docs/*game-design* docs/*design-doc* *.gdd.md design/gdd/*.md 2>/dev/null | head -1)
[ -z "$GDD" ] && GDD=$(ls -t ~/.gstack/projects/$SLUG/*-design-*.md 2>/dev/null | head -1)
[ -n "$GDD" ] && echo "GDD found: $GDD" || echo "No GDD found"
```

If no GDD found, ask the user to provide a game design document, spec, or description of the game to walk through.

Read the entire design document. Extract these 6 elements and present what you found:

**AskUserQuestion:**

> **[Re-ground]** Starting player experience walkthrough for `[game title]` on `[branch]`.
>
> I've read your GDD. Here's what I'll be working with during the walkthrough:
>
> | Element | Status | What I Found |
> |---------|--------|-------------|
> | Core loop | ✅/⚠️/❌ | {1-line summary or "not specified"} |
> | FTUE / onboarding | ✅/⚠️/❌ | {summary} |
> | Progression systems | ✅/⚠️/❌ | {summary} |
> | Monetization touchpoints | ✅/⚠️/❌ | {summary} |
> | Session structure | ✅/⚠️/❌ | {intended length, stopping points} |
> | Platform & input | ✅/⚠️/❌ | {platform, input method} |
>
> **{N} blind spots** — moments during the walkthrough where I'll need to ask "what happens here?" because the GDD doesn't specify.
>
> Does this look correct? Anything I'm misunderstanding about your game?
> A) Correct — proceed to persona selection
> B) Let me clarify: {user corrects}

**STOP.** Wait for confirmation before selecting a persona.

### 0B. Persona Selection

Present personas from `references/personas.md`. Use this format:

**AskUserQuestion:**

> Now I need to know **who** I'm pretending to be. Each persona has different patience, expectations, and behaviors — the same game can score 9/10 for one persona and 3/10 for another.
>
> RECOMMENDATION: {Based on GDD state — if FTUE isn't designed yet, recommend Persona 1. If economy exists but untested, recommend Persona 3. If endgame exists, recommend Persona 4.}
>
> Pick a persona:
> A) **Casual Newcomer** — First session, 3 min attention, 1-2 failure tolerance. Best for: testing FTUE and first impression. Player Impact: 9/10 for D1 retention.
> B) **Interested Returner** — Day 2-3, 10-15 min, looking for depth. Best for: testing session 2 hook. Player Impact: 8/10 for D7 retention.
> C) **Dedicated Player** — Day 7, 20-30 min, knows the systems. Best for: testing mid-game economy and progression. Player Impact: 8/10 for long-term.
> D) **Hardcore Optimizer** — Day 30+, min-maxing, testing limits. Best for: finding exploits and balance issues. Player Impact: 7/10.
> E) **Content Creator** — Evaluating streamability and shareability. Best for: viral potential. Player Impact: 6/10.
> F) **Returning Player** — Day 90 lapsed, checking what's new. Best for: reactivation UX. Player Impact: 7/10 for live service.
> G) **Custom** — describe your own player type

**STOP.** Wait for persona selection. Then apply the full persona definition from `references/personas.md`.

---

## Walkthrough Execution

For each phase (1 through 5), apply the full walkthrough content from `references/walkthrough-phases.md`:
- Use the emotion vocabulary from `references/emotion-vocabulary.md`
- Follow anti-sycophancy rules from `references/gotchas.md`
- Present findings and STOP after every phase — mandatory phase transitions
- Flag unhealthy emotion patterns with severity per `references/emotion-vocabulary.md`

After all applicable phases, run the Repeat Play Simulation (Session 1/3/10) per `references/scoring.md`.

---

## Critical Checkpoints (must evaluate for every walkthrough)

These are non-negotiable evaluation points. If the GDD doesn't address one, flag it as a blind spot.

- [ ] **0-10s:** First impression — does the player know what kind of game this is?
- [ ] **10-30s:** First interaction — is it obvious what to do?
- [ ] **30s-2min:** First aha moment — has the player felt the core loop (not just been told about it)?
- [ ] **2-5min:** First failure + recovery — is the failure informative? Is recovery clear?
- [ ] **5-10min:** First meaningful choice — has the player made a real decision?
- [ ] **10-15min:** Natural session end — is there a stopping point that feels complete (not abandoned)?
- [ ] **First monetization prompt** — does the player understand the value before being asked to pay?
- [ ] **Second session opening** — is re-entry smooth? Does the player remember what to do?
- [ ] **Day 7 experience** — is there still discovery, or only repetition?
- [ ] **Day 30 experience** — is there a long-term goal worth pursuing? (if applicable to game type)

---

## Action Triage: AUTO / ASK / ESCALATE

### AUTO-FLAG (report without asking)
Dead time >5s with no input/visual, no affordance on UI elements, missing feedback after action, text wall >3 lines (mobile), loading with no indicator, forced wait with no skip/entertainment.

### ASK (present as AskUserQuestion)
Subjective experience judgments, ambiguous design intent, persona-dependent severity calls, monetization timing questions.

### ESCALATE (stop walkthrough, report blocker)
No core loop identifiable, player stuck with no path forward, tutorial impossible to complete, GDD self-contradiction, 3+ "I don't know" answers from designer.

---

## Important Rules

- **First person only.** You ARE the player. "I see a text wall" not "The player encounters a text wall."
- **Phase transitions mandatory.** After EVERY phase, present findings and ask before continuing.
- **GDD blind spots trigger AskUserQuestion.** Don't silently flag — ask the designer.
- **One finding per AskUserQuestion** for significant findings. No batching.
- **Escape hatch:** Respect on second request. Generate partial journey map.
- **Never suggest fixes.** Observe and report only. Fixes belong in `/game-review` or `/game-ux-review`.
- **Calibrate severity to persona.** Casual quitting at 2-min = CRITICAL. Hardcore at 2-min = EXPECTED.
- **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT

---

## Output: Player Journey Map

```
PLAYER JOURNEY MAP — [Persona Name]
Game: [name] | Platform: [platform] | Session: [1st/3rd/10th]

Time    Action              Emotion         Flag    Note
-----   -----------------   ------------    ----    ---------------------
0:00    Open app            Curious                 Clean splash, fast load
0:05    See tutorial        Neutral         !!      Text wall, 4 lines
0:15    First tap           Engaged         OK      Satisfying haptic
0:45    First fail          Frustrated      !!      No hint, no recovery path
1:00    Retry + succeed     Proud           OK      Competence moment
2:00    Content wall        Bored           XX      Churn risk — no new content
...

Flag legend: OK = working as intended, !! = friction/warning, XX = critical/churn risk, ?? = GDD blind spot

SUMMARY:
  Aha moment: [timestamp] ([what happened])
  First churn risk: [timestamp] ([what happened])
  Missing: [list of absent design elements this persona would need]
  Repeat play prediction: [would return? how many sessions? why/why not?]

EMOTION ARC:
  Curious --> Engaged --> Frustrated --> Proud --> Bored
                         !! dip here              XX drops here
```

---

## Scoring

Score each phase using the explicit formula from `references/scoring.md`. Start at 10/10, apply deductions: -1 per AUTO-FLAG, -1.5 per unresolved ASK, -3 per ESCALATE, -2 per unhealthy emotion pattern, -1 per blind spot at critical checkpoint. Minimum 0/10.

Use full phase weights (20/20/25/20/15) or early-phase reweight (30/35/35) per `references/scoring.md`.

---

## Regression Delta (if prior walkthrough exists for same persona)

If a prior walkthrough artifact was found for the same persona:

```
Player Experience Delta:
  Phase              Prior    Current  Change
  First Contact:     _/10     _/10     +_
  Onboarding:        _/10     _/10     +_
  Core Session:      _/10     _/10     +_
  Return & Depth:    _/10     _/10     +_
  Long-term:         _/10     _/10     +_
  WEIGHTED TOTAL:    _._/10   _._/10   +_._
```

**⚠️ If current < prior: WARN** — changes may have hurt the player experience.
Note which friction points were resolved and which are new.

## Completion Summary

```
/player-experience walkthrough complete.

Persona: [name]
Game: [name] | Platform: [platform]
Phases covered: [list]
Delta from prior: [+N / first run / N/A / different persona]

STATUS: [DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT]

Results:
  - Weighted Score: _/10
  - Critical friction points: N
  - Churn risk moments: N
  - GDD blind spots: N
  - Healthy patterns found: N
  - Unhealthy patterns found: N

Top 3 findings:
  1. [most impactful finding]
  2. [second most impactful]
  3. [third most impactful]

Recommended next steps:
  - [specific action based on findings]
  - [specific action based on findings]
  - Consider running /player-experience again with [different persona] to compare

Next Step:
  PRIMARY: /balance-review — validate economy and progression numbers after player lens
  (if churn at FTUE or UI confusion): /game-ux-review — UI/UX causing player friction
  (if core loop feels empty or unengaging): /game-ideation — core loop redesign needed
```

## Save Artifact

```bash
_DATETIME=$(date +%Y%m%d-%H%M%S)
echo "Saving to: $_PROJECTS_DIR/${_USER}-${_BRANCH}-player-walkthrough-${_DATETIME}.md"
```

Write the Player Journey Map + Score + Completion Summary to `$_PROJECTS_DIR/{user}-{branch}-player-walkthrough-{datetime}.md`. If a prior walkthrough exists, include `Supersedes: {prior filename}` at the top.

Discoverable by: `/balance-review`, `/game-review`, `/game-direction`, `/game-ux-review`.

## Review Log

```bash
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-review-log" '{"skill":"player-experience","timestamp":"TIMESTAMP","status":"STATUS","persona":"PERSONA","score":"SCORE","friction_points":N,"churn_risks":N,"blind_spots":N,"mode":"MODE","commit":"COMMIT"}' 2>/dev/null || true
```
