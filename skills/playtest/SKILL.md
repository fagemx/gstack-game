---
name: playtest
description: "Playtest protocol design. Creates test plans, defines observation metrics, structures feedback collection, and designs data analysis frameworks."
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
echo '{"skill":"playtest","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'"$_SLUG"'","branch":"'"$_BRANCH"'"}'  >> ~/.gstack/analytics/skill-usage.jsonl 2>/dev/null || true

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
  --skill "playtest" --duration "$_TEL_DUR" --outcome "OUTCOME" \
  --used-browse "false" --session-id "$_SESSION_ID" 2>/dev/null &
```


# /playtest: Playtest Protocol Design

Design structured playtest protocols. This skill creates the TEST PLAN, not the test itself.

## Step 0: Playtest Context

AskUserQuestion:
1. **What's being tested?** (full game / specific feature / specific flow / balance)
2. **What stage?** (paper prototype / greybox / alpha / beta / soft launch)
3. **How many testers?** (1-5 internal / 5-20 friends & family / 20-100 closed beta / 100+ open)
4. **What's the key question?** (is it fun? is it clear? is it balanced? where do players quit?)

## Section 1: Test Plan

**Hypothesis:**
"We believe [specific thing]. This playtest will confirm or refute it by observing [specific metric]."

**Session Structure:**
```
1. Pre-test: Demographics questionnaire (age, gaming experience, genre familiarity)
2. Play session: [duration] minutes, [guided/unguided]
3. Observation: Silent observation with timestamp notes
4. Post-test: Structured interview (see Section 3)
5. Data collection: [automated metrics / manual notes / video recording]
```

**Control Variables:**
- Same build version for all testers
- Same hardware/platform (or document differences)
- Same starting point (unless testing different entry points)
- Observer does NOT help unless tester is completely stuck for >2 minutes

## Section 2: Observation Metrics

**Quantitative (measure these):**
- Time to first meaningful action (seconds)
- Time to first "aha moment" (estimated by observer behavior: lean forward, smile, verbal reaction)
- Number of failures before quitting
- Session length (voluntary end vs forced end)
- Feature discovery rate (what % of features were found without guidance)
- Quit point (where exactly did they stop? what was on screen?)

**Qualitative (observe these):**
- Body language shifts (lean in = engaged, lean back = bored, fidget = frustrated)
- Verbal reactions ("oh!", "what?", "why?", profanity)
- Moments of confusion (pause, look away from screen, re-read UI)
- Moments of delight (smile, laugh, show someone else)

**Event Log Template:**
```
Time    Event                   Player Reaction    Flag
0:00    Opens game              Neutral
0:12    Reads tutorial          Skips text         ⚠️ Didn't read
0:30    First tap               Smiles             ✅ Delight
0:45    First failure           Pauses, retries
1:15    Second failure          Sighs              ⚠️ Frustration
1:30    Quits app               Puts phone down    🔴 Churn
```

## Section 3: Post-Test Questions

**Standard questions (adapt per playtest goal):**
1. "What was the game about?" (tests comprehension)
2. "What was the most fun part?" (identifies core appeal)
3. "What was the most confusing part?" (identifies friction)
4. "Would you play again?" → Follow up: "Why / why not?" (tests retention hypothesis)
5. "What would you change?" (get specific: "which screen? which moment?")
6. "Who would you recommend this to?" (tests market fit)

**Rules for interviewing:**
- Ask open-ended questions, not leading ones
- ❌ "Did you like the combat?" → ✅ "Tell me about the combat."
- ❌ "Was the tutorial clear?" → ✅ "What did you think of the first few minutes?"
- Don't explain or defend design choices during the interview
- Record exact words, not your interpretation

## Section 4: Data Analysis Framework

**After all sessions, analyze:**

```
Finding Summary:
  Testers: N
  Average session length: ___ min
  Completion rate: ___% (reached target milestone)

  Top 3 delight moments: (most common positive reactions)
  1. ___
  2. ___
  3. ___

  Top 3 friction points: (most common negative reactions)
  1. ___
  2. ___
  3. ___

  Key insight: ___

  Confidence level:
    N < 5:  Low (directional only)
    N 5-15: Medium (patterns visible)
    N > 15: High (statistically meaningful)
```

## Section 5: Tester Recruitment

**Who to recruit (by stage):**
- Paper prototype: Team members, designer friends (fast, cheap, biased)
- Alpha: Friends & family outside team (some bias, good for major issues)
- Beta: Target demographic strangers (low bias, expensive to find)
- Soft launch: Real players via ad/organic (no bias, real data)

**Where to find testers:**
- Game dev communities (Reddit, Discord, itch.io forums)
- University game clubs
- Playtest platforms (PlaytestCloud, UserTesting)
- Social media callouts with screening questions

**Screening questions (filter for target audience):**
1. How often do you play [genre] games?
2. Name 2-3 games you've played recently
3. What platform do you play on most?
4. Age range (for content rating compliance)

## AUTO/ASK/ESCALATE

- **AUTO:** Generate test plan template, observation log template, question list
- **ASK:** Hypothesis definition, tester profile, session structure
- **ESCALATE:** No testable build exists, target testers undefined, no clear hypothesis

## Anti-Sycophancy

Forbidden:
- ❌ "This playtest plan is comprehensive"
- ❌ "Testers will enjoy the session"

Instead: "Plan covers core loop testing. Missing: no metric for D1 return rate, no question about monetization perception. 5 testers is directional only — insufficient for balance conclusions."

## Completion Summary

```
Playtest Protocol:
  Type: [internal / friends / closed beta / open]
  Hypothesis: [one sentence]
  Metrics defined: ___
  Questions prepared: ___
  Tester criteria: [defined / needs work]
  STATUS: DONE / DONE_WITH_CONCERNS / BLOCKED
```

## Review Log

```bash
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-review-log" '{"skill":"playtest","timestamp":"TIMESTAMP","status":"STATUS","tester_count":N,"commit":"COMMIT"}' 2>/dev/null || true
```
