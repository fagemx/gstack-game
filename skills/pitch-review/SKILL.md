---
name: pitch-review
description: "Game pitch/proposal review. Evaluates market positioning, differentiation, feasibility, and investment-readiness of a game concept."
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
echo '{"skill":"pitch-review","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'$(basename "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null || echo "unknown")'"}'  >> ~/.gstack/analytics/skill-usage.jsonl 2>/dev/null || true
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
  --skill "pitch-review" --duration "$_TEL_DUR" --outcome "OUTCOME" \
  --used-browse "false" --session-id "$_SESSION_ID" 2>/dev/null &
```


# /pitch-review: Game Pitch Review

TODO: Full implementation. Sections to build:

### Section 1: Market Positioning（市場定位）
- What existing games is this most like? (comp set)
- What's the one-line pitch? ("It's [Game A] meets [Game B] but [unique twist]")
- Market size and saturation for this genre
- Platform-market fit (is this genre viable on the target platform?)

### Section 2: Differentiation（差異化）
- What's the hook? Can you explain it in 10 seconds?
- Is the differentiation in mechanics, content, art style, or business model?
- Would a screenshot/video immediately look different from competitors?
- "Screenshot test": If a player sees one screenshot, do they understand what makes this special?

### Section 3: Feasibility（可行性）
- Team size vs scope (is this buildable by this team?)
- Technical risk (anything never been done before?)
- Content volume required (how much art/levels/writing?)
- Time to playable prototype
- Time to soft launch

### Section 4: Business Case（商業論證）
- Revenue model clarity
- Comparable game revenue benchmarks
- User acquisition strategy (organic, paid, cross-promotion?)
- LTV/CPI viability (does the math work?)

## Review Log

```bash
~/.claude/skills/gstack/bin/gstack-review-log '{"skill":"pitch-review","timestamp":"TIMESTAMP","status":"STATUS","unresolved":N,"critical_gaps":N,"mode":"MODE","commit":"COMMIT"}' 2>/dev/null || true
```
