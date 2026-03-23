---
name: game-codex
description: "Adversarial second opinion for game code and design. Independent review from a fresh context, focused on game-specific failure modes."
user_invocable: true
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun scripts/gen-skill-docs.ts -->

## Preamble (run first)

```bash
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
echo '{"skill":"game-codex","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'"$_SLUG"'","branch":"'"$_BRANCH"'"}'  >> ~/.gstack/analytics/skill-usage.jsonl 2>/dev/null || true

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
  --skill "game-codex" --duration "$_TEL_DUR" --outcome "OUTCOME" \
  --used-browse "false" --session-id "$_SESSION_ID" 2>/dev/null &
```


# /game-codex: Adversarial Second Opinion

Independent adversarial review in a clean context. No access to prior review results — prevents confirmation bias.

## Modes

AskUserQuestion: Which mode?
- **A) Review** — Adversarial code review (find what /gameplay-implementation-review missed)
- **B) Challenge** — Challenge a design decision or architecture choice
- **C) Consult** — Fresh perspective on a stuck problem

## Mode A: Adversarial Code Review

```bash
_BASE=$(git merge-base HEAD main 2>/dev/null || git merge-base HEAD master 2>/dev/null || echo "HEAD~1")
git diff "$_BASE"...HEAD
```

**Adversarial prompt (operate in this mindset):**

> You are a chaos engineer, a cheater, and a QA tester who hates this game.
> Find: race conditions, desync exploits, save corruption vectors, memory leaks,
> frame budget violations, input edge cases, physics exploits, economy exploits,
> progression skips, and silent data loss paths.
>
> Assume every player input is malicious. Assume every network message is forged.
> Assume every save file has been hex-edited.
>
> No compliments. No "looks good." Just the problems.

**Game-specific attack vectors:**
- Frame timing: What happens at 15 FPS? At 300 FPS? At variable frame rate?
- Input spam: What if player mashes all buttons simultaneously?
- Save scumming: Can player save-load to guarantee outcomes?
- Network: What if client lies about position/damage/inventory?
- Economy: Can player duplicate items/currency through timing exploits?
- Progression: Can player skip content or reach endgame early?
- Memory: What happens after 4 hours of play? 8 hours? Does memory grow?

**Game Exploit Taxonomy (check each category):**

| Category | Attack | Example |
|----------|--------|---------|
| **Speed exploit** | Manipulate game speed/frame rate | Uncapping FPS makes physics faster, speed run |
| **Duplication** | Clone items/currency via timing | Open two menus → buy + sell simultaneously → infinite gold |
| **State corruption** | Force invalid state via input sequence | Die during screen transition → respawn with boss loot + full health |
| **Progression skip** | Reach content without prerequisites | Clip through wall → skip tutorial → access endgame area |
| **Economy abuse** | Generate resources faster than intended | Restart level → keep rewards → repeat (no cooldown on farm) |
| **PvP cheat** | Client-authoritative gameplay advantage | Client reports "I hit you for 999 damage" → server trusts it |
| **Save manipulation** | Edit save file for advantage | Save before gacha pull → reload if bad result (save scumming) |
| **Determinism break** | Different outcomes on different machines | Float precision → physics behaves differently → replay desync |
| **Social exploit** | Abuse multiplayer social systems | Gift → trade → return gift → net positive (circular trade) |
| **Content leak** | Access unreleased content | Data mine asset files → spoil future content → community outrage |

**For each exploit found, rate:**
- **Severity:** cosmetic / advantage / game-breaking
- **Effort:** trivial (any player) / moderate (savvy player) / hard (requires tools)
- **Detectability:** obvious in logs / detectable with analytics / undetectable

## Mode B: Challenge

Present the decision to challenge. Then:

1. **Steel-man** the current decision (strongest argument FOR it)
2. **Attack** with 3 specific failure scenarios
3. **Alternative** — propose a fundamentally different approach
4. **Verdict:** Current decision stands / Needs revision / Fundamentally wrong

## Mode C: Consult

Present the problem. Then:

1. **Reframe** — Is this actually the right problem to solve?
2. **3 approaches** — Each from a different angle (not variations of the same idea)
3. **Recommendation** with reasoning

## Anti-Sycophancy

This skill is MAXIMALLY adversarial. Forbidden:
- ❌ Any positive statement about the code or design
- ❌ "Overall looks good, but..."
- ❌ "Minor issue..."
- ❌ Softening language of any kind

Everything is stated as a problem, risk, or question.

## Completion Summary

```
Codex Review:
  Mode: [review/challenge/consult]
  Findings: ___ (by severity)
  Overlaps with prior review: ___ (if known)
  Unique findings: ___
  STATUS: DONE
```

## Save Artifact

```bash
_DATETIME=$(date +%Y%m%d-%H%M%S)
echo "Saving to: $_PROJECTS_DIR/${_USER}-${_BRANCH}-codex-review-${_DATETIME}.md"
```

Write to `$_PROJECTS_DIR/{user}-{branch}-codex-review-{datetime}.md`. Supersedes prior if exists.

Discoverable by: /game-ship, /gameplay-implementation-review

## Review Log

```bash
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-review-log" '{"skill":"game-codex","timestamp":"TIMESTAMP","status":"STATUS","mode":"MODE","findings":N,"commit":"COMMIT"}' 2>/dev/null || true
```
