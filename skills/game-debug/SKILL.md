---
name: game-debug
description: "Game debugging and root cause analysis. Analyzes crash dumps, performance bottlenecks, physics glitches, network desync, and gameplay bugs through structured hypothesis testing."
user_invocable: true
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun scripts/gen-skill-docs.ts -->

## Preamble (run first)

```bash
_GD_VERSION="0.1.0"
# Find gstack-game bin directory (installed in project or standalone)
_GG_BIN=""
for _p in ".claude/skills/game-review/../../../gstack-game/bin" ".claude/skills/game-review/../../bin" "$(dirname "$(readlink -f .claude/skills/game-review/SKILL.md 2>/dev/null)" 2>/dev/null)/../../bin"; do
  [ -f "$_p/gstack-config" ] && _GG_BIN="$_p" && break
done
# Fallback: search common locations
[ -z "$_GG_BIN" ] && [ -f ".claude/skills/gstack-game/bin/gstack-config" ] && _GG_BIN=".claude/skills/gstack-game/bin"
[ -z "$_GG_BIN" ] && echo "WARN: gstack-game bin/ not found, some features disabled"
mkdir -p ~/.gstack/sessions
touch ~/.gstack/sessions/"$PPID"
_PROACTIVE=$([ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-config" get proactive 2>/dev/null || echo "true")
_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
_TEL_START=$(date +%s)
_SESSION_ID="$-$(date +%s)"
mkdir -p ~/.gstack/analytics
echo '{"skill":"game-debug","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'$(basename "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null || echo "unknown")'"}'  >> ~/.gstack/analytics/skill-usage.jsonl 2>/dev/null || true
echo "BRANCH: $_BRANCH"
echo "PROACTIVE: $_PROACTIVE"
echo "GD_VERSION: $_GD_VERSION"
```

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
```

## Review Log

```bash
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-review-log" '{"skill":"game-debug","timestamp":"TIMESTAMP","status":"STATUS","category":"CATEGORY","hypotheses_tested":N,"root_cause_found":BOOL,"commit":"COMMIT"}' 2>/dev/null || true
```
