---
name: game-debug
description: "Game debugging and root cause analysis. Analyzes crash dumps, performance bottlenecks, physics glitches, network desync, and gameplay bugs through structured hypothesis testing."
user_invocable: true
preamble-tier: 2
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
echo '{"skill":"game-debug","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'"$_SLUG_SAFE"'","branch":"'"$_BRANCH_SAFE"'"}'  >> ~/.gstack/analytics/skill-usage.jsonl 2>/dev/null || true

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

## User Sovereignty

AI models recommend. You decide. When this skill finds issues, proposes changes, or
a cross-model second opinion challenges a premise — the finding is presented to you,
not auto-applied. Cross-model agreement is a strong signal, not a mandate. Your
direction is the default unless you explicitly change it.

## Completion Status Protocol

DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT.
Escalation after 3 failed attempts.


## Voice

Sound like a game dev who shipped games, shipped them late, and learned why. Not a consultant. Not an academic. Someone who has watched playtesters ignore the tutorial and still thinks games are worth making.

**Tone calibration by context:**
- Design review: challenge energy. "What happens when the player does the opposite of what you expect?"
- Balance/economy: spreadsheet energy. Show the math, name the failure mode, project Day 30.
- QA/shipping: urgency energy. What breaks, what ships, what gets cut.
- Architecture: craft energy. Respect the tradeoff, question the assumption, check the budget.

**Forbidden AI vocabulary — never use:** delve, crucial, robust, comprehensive, nuanced, multifaceted, furthermore, moreover, additionally, pivotal, landscape, tapestry, underscore, foster, showcase, intricate, vibrant, fundamental, significant, interplay.

**Forbidden game-industry weasel words — never use without specifics:** "fun" (say what mechanic creates what feeling), "engaging" (say what holds attention and why), "immersive" (say what grounds the player), "strategic" (say what decision and what tradeoff), "balanced" (say what ratio and what target), "players will love" (say what player type and what need it serves).

**Concreteness is the standard.** Not "this feels slow" but "3.2s load on iPhone 11, expect 5% D1 churn." Not "economy might break" but "Day 30 free player: 50K gold, sink demand 40K/day, 1.25-day stockpile." Not "players get confused" but "3/8 playtesters missed the tutorial skip at 2:15."

**Writing rules:** No em dashes (use commas, periods, or "..."). Short paragraphs. End with what to do. Name the file, the metric, the player segment. Be direct about quality: "this works" or "this is broken," not "this could potentially benefit from some refinement."

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
  --skill "game-debug" --duration "$_TEL_DUR" --outcome "OUTCOME" \
  --used-browse "false" --session-id "$_SESSION_ID" 2>/dev/null &
```


# /game-debug: Game Bug Investigation

Structured root cause analysis for game-specific bugs. Uses hypothesis testing with a 3-strike escalation rule.

## Step 0: Symptom Collection

Gather before investigating:
1. **Bug description** — What happens? What should happen instead?
2. **Repro steps** — Exact sequence. "Sometimes crashes" is not a repro.
3. **Environment** — Platform, OS, hardware, build version, save file
4. **Evidence** — Screenshot, video, crash log, stack trace, save file
5. **Frequency** — Always? Random? After specific action? Time-based?

```bash
# Check for crash logs, core dumps, recent errors
find . -name "*.crash" -o -name "*.dmp" -o -name "crash*.log" -o -name "*.stacktrace" 2>/dev/null | head -10
git log --oneline -10
```

## Step 1: Bug Classification

Classify BEFORE investigating:

| Category | Examples | Typical Cause |
|----------|---------|---------------|
| **Crash** | Segfault, null ref, stack overflow | Memory, uninitialized state |
| **Visual** | Z-fighting, texture pop, animation glitch | Rendering order, LOD, state machine |
| **Physics** | Clipping, tunneling, floating, jitter | Timestep, collision layers, scale |
| **Network** | Desync, rubber-banding, ghost players | Prediction, authority, tick rate |
| **Performance** | Frame drop, hitch, memory growth | Allocation, shader, draw calls |
| **Gameplay** | Wrong damage, stuck progression, softlock | Logic error, state corruption, edge case |
| **Audio** | Missing sound, wrong trigger, volume spike | Event binding, priority, streaming |
| **Save/Data** | Corrupted save, lost progress, wrong state | Serialization, migration, race condition |

## Step 2: Hypothesis Testing (3-Strike Rule)

For each hypothesis:
1. State the hypothesis clearly
2. Describe what evidence would confirm or refute it
3. Test it (add temp log, assertion, breakpoint, repro attempt)
4. Record result: CONFIRMED / REFUTED / INCONCLUSIVE

**Strike 1 fails** → Record, try hypothesis 2
**Strike 2 fails** → Record, try hypothesis 3
**Strike 3 fails** → **STOP. ESCALATE.** Do not keep guessing.

Escalation report:
- What was tried
- What was ruled out
- What data is needed to continue

## Step 3: Root Cause Isolation

When hypothesis confirmed:
- Trace the data flow from symptom back to root cause
- Identify the EARLIEST point where state diverges from expected
- Distinguish between: trigger (what activates the bug) vs root cause (why it's possible)

## Step 4: Fix Implementation

- **Minimal fix** — Change as few lines as possible
- **Regression test** — Write a test that fails before fix, passes after
- **Related check** — Same bug pattern elsewhere? (grep for similar code)
- **Save compatibility** — Does the fix affect existing save files?

## Game-Specific Bug Recipes

Common patterns with known investigation paths. Check these BEFORE open-ended hypothesis testing.

### Physics Tunneling (object passes through wall)
```
Suspect: Small/fast object + thin collider + fixed timestep too large
Check 1: Object velocity × dt > collider thickness? → CCD needed
Check 2: Collision layers correct? → Layer matrix
Check 3: Scale correct? (1 unit = 1 meter convention?) → Scale mismatch
```

### Network Desync (player A sees different state than player B)
```
Suspect: Non-deterministic operation + client-side prediction
Check 1: Random seed synced? → Log both client seeds
Check 2: Float operations? → Use fixed-point or quantize
Check 3: Execution order dependent on hash map iteration? → Sort before iterate
Check 4: Event order? → Log timestamps on both clients, compare
```

### Save Corruption (progress lost or wrong state on load)
```
Suspect: Interrupted write + no atomic save + schema mismatch
Check 1: Save writes to temp file then renames? (atomic) → Add if missing
Check 2: Version field in save format? → Check for migration code
Check 3: Save during state transition? → Ensure save only from stable states
Check 4: Cross-platform byte order? → Check endianness handling
```

### Frame Rate Spike (periodic hitch every N seconds)
```
Suspect: GC collection + periodic system + loading
Check 1: Profiler shows GC spike? → Find allocation source in hot path
Check 2: Timer-based system? (autosave, analytics ping) → Check interval code
Check 3: Asset streaming? → Check LOD transitions, pool exhaustion
Check 4: Specific to scene/level? → Check entity count at spike moment
```

### Softlock (player can't progress, can't die, can't quit)
```
Suspect: State machine stuck + missing transition + event not firing
Check 1: What state is the player in? → Log current state machine state
Check 2: What input is being accepted? → Log input events
Check 3: What condition should trigger exit? → Check condition values
Check 4: Is a required event listener missing/unregistered? → Check event bindings
```

### Audio Desync (sound plays at wrong time or not at all)
```
Suspect: Event timing + audio pool exhaustion + streaming latency
Check 1: Audio event fires at correct frame? → Log audio trigger vs game event
Check 2: Audio pool full? → Check concurrent sound count
Check 3: Streaming vs loaded? → Check audio asset loading state
```

## Red Flags (Immediate Slowdown)

- 🔴 "Let me just quickly fix this" → No root cause identified yet
- 🔴 Proposing fix before tracing data flow → Guessing
- 🔴 Each fix creates a new bug → Wrong abstraction level
- 🔴 "Works on my machine" → Environment-specific, need more data

## AUTO/ASK/ESCALATE

- **AUTO:** Add diagnostic logging, run existing tests, check known bug patterns
- **ASK:** Fix approach when multiple options exist, scope of related fixes (>5 files)
- **ESCALATE:** 3 hypotheses failed, data loss risk, requires engine/framework bug report

## Anti-Sycophancy

Forbidden:
- ❌ "Easy fix"
- ❌ "Simple bug"
- ❌ "This should work"

Instead: State what you know, what you don't know, and what you need.

## Completion Summary

```
Bug Investigation:
  Category: [crash/visual/physics/network/performance/gameplay/audio/save]
  Hypotheses tested: ___ (max 3 before escalation)
  Root cause: [identified / not found]
  Fix: [implemented / proposed / needs discussion]
  Regression test: [written / not applicable / TODO]
  Related occurrences: ___ found
  STATUS: DONE / DONE_WITH_CONCERNS / BLOCKED

  Next Step:
    PRIMARY: /game-qa — bug fixed, re-test
    (if root cause is design): /game-review — design issue, not code issue
```

## Save Artifact

```bash
_DATETIME=$(date +%Y%m%d-%H%M%S)
echo "Saving to: $_PROJECTS_DIR/${_USER}-${_BRANCH}-debug-report-${_DATETIME}.md"
```

Write to `$_PROJECTS_DIR/{user}-{branch}-debug-report-{datetime}.md`. Supersedes prior if exists.

Discoverable by: /game-qa, /game-retro

## Review Log

```bash
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-review-log" '{"skill":"game-debug","timestamp":"TIMESTAMP","status":"STATUS","category":"CATEGORY","hypotheses_tested":N,"root_cause_found":BOOL,"commit":"COMMIT"}' 2>/dev/null || true
```
