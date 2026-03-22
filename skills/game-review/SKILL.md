---
name: game-review
description: "Interactive game design document review. Evaluates core loop, progression, retention, economy, and player motivation through structured AskUserQuestion flow."
user_invocable: true
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun scripts/gen-skill-docs.ts -->

## Preamble (run first)

```bash
_GD_VERSION="0.1.0"
# Reuse gstack infrastructure
_GD_BIN=$(~/.claude/skills/gstack/bin/gstack-update-check 2>/dev/null && echo "global" || echo "local")
if [ "$_GD_BIN" = "local" ]; then
  _GD_BIN_PATH=".claude/skills/gstack/bin"
else
  _GD_BIN_PATH="~/.claude/skills/gstack/bin"
fi
mkdir -p ~/.gstack/sessions
touch ~/.gstack/sessions/"$PPID"
_PROACTIVE=$($_GD_BIN_PATH/gstack-config get proactive 2>/dev/null || echo "true")
_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
_TEL_START=$(date +%s)
_SESSION_ID="$-$(date +%s)"
mkdir -p ~/.gstack/analytics
echo '{"skill":"game-review","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'$(basename "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null || echo "unknown")'"}'  >> ~/.gstack/analytics/skill-usage.jsonl 2>/dev/null || true
echo "BRANCH: $_BRANCH"
echo "PROACTIVE: $_PROACTIVE"
echo "GD_VERSION: $_GD_VERSION"
```

If `PROACTIVE` is `"false"`, do not proactively suggest gstack or gstack-game skills.

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

Same as gstack: DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT.
Escalation after 3 failed attempts.

## Telemetry (run last)

```bash
_TEL_END=$(date +%s)
_TEL_DUR=$(( _TEL_END - _TEL_START ))
~/.claude/skills/gstack/bin/gstack-telemetry-log \
  --skill "game-review" --duration "$_TEL_DUR" --outcome "OUTCOME" \
  --used-browse "false" --session-id "$_SESSION_ID" 2>/dev/null &
```


## Design Doc Check

```bash
SLUG=$(basename "$(git rev-parse --show-toplevel 2>/dev/null || pwd)")
GDD=$(ls -t docs/*GDD* docs/*game-design* docs/*design-doc* *.gdd.md 2>/dev/null | head -1)
[ -z "$GDD" ] && GDD=$(ls -t ~/.gstack/projects/$SLUG/*-design-*.md 2>/dev/null | head -1)
[ -n "$GDD" ] && echo "GDD found: $GDD" || echo "No GDD found"
```

If no GDD found, offer `/office-hours` first.

# /game-review: Game Design Document Review

Review a game design document interactively. Work through each section one issue at a time via AskUserQuestion.

## Review Sections

### Step 0: Genre & Context
Before reviewing, establish:
1. **Genre & platform** — what kind of game, where does it run?
2. **Target session length** — 2 min mobile? 30 min PC? 4 hour tabletop?
3. **Monetization model** — premium, F2P, ad-supported, subscription?
4. **Target audience** — casual, mid-core, hardcore? Age? Existing genre fans?

These frame every subsequent judgment. If any are missing from the GDD, ask the user before proceeding.

### Section 1: Core Loop（核心循環）
Evaluate:
- **Clarity:** Can you describe the core loop in one sentence? (verb → feedback → reward → repeat)
- **Session fit:** Does the loop complete within the target session length?
- **Depth vs breadth:** Does mastery come from doing the loop better, or from unlocking new loops?
- **Fail state:** What happens when the player fails? Is failure interesting or just punishing?
- **Idle moments:** Are there dead zones where the player waits with nothing to do?
- **Uniqueness:** What verb or mechanic would a player describe to a friend? ("It's the game where you...")

**Cognitive patterns:**
- "Boring by default" applies here too — the core loop should use proven mechanics unless you have a specific innovation thesis.
- If the loop takes longer than 2 minutes to describe, it's probably too complex for mobile.

**STOP.** One issue per AskUserQuestion. Proceed only after all issues resolved.

### Section 2: Progression & Retention（進度與留存）
Evaluate:
- **FTUE (First Time User Experience):** How many seconds to first meaningful action? First "aha moment"?
- **Short-term loop (session):** What keeps them playing for 10 more minutes?
- **Medium-term loop (daily):** Why come back tomorrow?
- **Long-term loop (monthly):** What takes weeks to build and would hurt to lose?
- **Difficulty curve:** Does challenge scale with skill, or just with time played?
- **Content gates vs skill gates:** Is progression blocked by grind or by mastery?
- **Churn points:** Where would a player most likely quit forever? What's the plan for each?

**Reference benchmarks:**
- FTUE to first action: <30s (mobile), <2min (PC), <5min (complex strategy)
- D1 retention: 40%+ (good), 25-40% (average), <25% (problem)
- D7 retention: 15%+ (good), 8-15% (average), <8% (problem)
- D30 retention: 5%+ (good for F2P)

**STOP.** One issue per AskUserQuestion.

### Section 3: Economy & Monetization（經濟系統）
Evaluate:
- **Currency design:** How many currencies? Can the player understand the exchange rates intuitively?
- **Sinks & faucets:** Is there a clear model for where currency enters and exits?
- **Pay-to-win risk:** Does spending money create unfair advantages in competitive contexts?
- **Whale dependency:** What % of revenue comes from top 1% spenders? Is this healthy?
- **Free player experience:** Is the game fun without paying? Or is F2P a trial version?
- **Price anchoring:** Does the player understand what things cost before being asked to pay?

**Economy red flags:**
- More than 3 currencies → cognitive overload
- No meaningful sinks → hyperinflation, everything becomes worthless
- First IAP offered before aha moment → premature monetization
- Hard currency only obtainable by paying → pay-to-win perception

**STOP.** One issue per AskUserQuestion.

### Section 4: Player Motivation & Emotion（玩家動機）
Evaluate:
- **Bartle types:** Which player types does this serve? (Achiever, Explorer, Socializer, Killer)
- **Autonomy:** Does the player feel like they're making meaningful choices?
- **Competence:** Does the game create "I'm getting better at this" moments?
- **Relatedness:** Is there social connection (co-op, competition, sharing)?
- **Surprise:** Are there moments of unexpected delight?
- **Fantasy fulfillment:** What does the player get to BE in this game?

**STOP.** One issue per AskUserQuestion.

### Section 5: Risk Assessment（風險評估）
For each identified risk:
- **Probability:** Low / Medium / High
- **Impact:** Minor annoyance / Significant friction / Game-breaking
- **Detection:** How would you know? (metrics, playtesting, reviews, crash reports)
- **Mitigation:** Specific plan, not "we'll fix it later"

## Required Outputs

### Completion Summary
```
- Step 0: Genre & Context — ___
- Core Loop Review: ___ issues found
- Progression & Retention: ___ issues found
- Economy & Monetization: ___ issues found
- Player Motivation: ___ issues found
- Risk Assessment: ___ risks identified, ___ high-impact
- NOT in scope: written
- Playtest Protocol: written
```

### Playtest Protocol
Write a playtest observation guide:
- **Key moments to watch** (first 30s, first fail, first purchase prompt, first session end)
- **Questions to ask after** (What was most fun? When were you confused? Would you play again?)
- **Metrics to track** (session length, quit points, currency earned vs spent, feature discovery rate)

### NOT in scope
Deferred work with rationale.

### Failure Modes
For each core feature, one realistic way it fails with real players.

## Review Log

```bash
~/.claude/skills/gstack/bin/gstack-review-log '{"skill":"game-review","timestamp":"TIMESTAMP","status":"STATUS","unresolved":N,"critical_gaps":N,"mode":"MODE","commit":"COMMIT"}' 2>/dev/null || true
```
