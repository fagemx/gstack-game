---
name: game-docs
description: "Game release documentation update. Generates player-facing patch notes, internal changelog, and updates all project documentation after a release."
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
echo '{"skill":"game-docs","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'"$_SLUG"'","branch":"'"$_BRANCH"'"}'  >> ~/.gstack/analytics/skill-usage.jsonl 2>/dev/null || true

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
  --skill "game-docs" --duration "$_TEL_DUR" --outcome "OUTCOME" \
  --used-browse "false" --session-id "$_SESSION_ID" 2>/dev/null &
```


# /game-docs: Release Documentation

Update all documentation after a game release or patch.

## Step 0: Release Context

```bash
# Find recent release info
git tag --sort=-creatordate | head -5
_LATEST_TAG=$(git tag --sort=-creatordate | head -1)
[ -n "$_LATEST_TAG" ] && git log "$_LATEST_TAG"..HEAD --oneline --no-merges | head -20
```

AskUserQuestion: What version is this release? What are the highlights?

## Section 1: Player-Facing Patch Notes

**Format — players read this, not developers:**

```markdown
# Version X.Y.Z — [Catchy Title]

## ✨ New
- [Feature in player language] — [what it means for gameplay]

## ⚡ Improved
- [Improvement] — [why it matters]

## 🐛 Fixed
- [Bug description in player terms] — [what was happening, now fixed]

## ⚖️ Balance Changes
- [What changed] — [designer intent / reasoning]

## 🔧 Known Issues
- [Issue] — [workaround if any]
```

**Rules:**
- No code references, file paths, or technical jargon
- Every change answers "so what?" for the player
- Balance changes include the WHY (players want to understand intent)
- Group by impact, not by code area

## Section 2: Internal Changelog

**Format — for the team:**

```markdown
# [version] — [date]

## Changes
- [commit-style description] ([files affected]) @[author]

## Metrics
- LOC changed: ___
- Files changed: ___
- Tests added: ___
- Known debt introduced: ___
```

## Section 3: Documentation Sweep

Check and update:
- [ ] README — Version number, install instructions, screenshots current?
- [ ] GDD — Does it reflect current game state? Mark outdated sections.
- [ ] API docs — If modding/plugin support exists
- [ ] Platform store descriptions — App Store/Steam/Play Store
- [ ] Website/landing page — Screenshots, feature list, trailer

## AUTO/ASK/ESCALATE

- **AUTO:** Generate changelog from git log, update version numbers
- **ASK:** Patch notes tone/framing, which changes to highlight, balance change explanations
- **ESCALATE:** Major undocumented breaking change, store description contradicts current build

## Anti-Sycophancy

Forbidden:
- ❌ "Great release!"
- ❌ "Players will appreciate these changes"

Instead: "12 changes documented. 3 balance changes need designer intent explanations before publishing."

## Completion Summary

```
Documentation:
  Patch notes: [written / updated]
  Internal changelog: [written / updated]
  Docs swept: ___/___ up to date
  STATUS: DONE / DONE_WITH_CONCERNS
```

## Review Log

```bash
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-review-log" '{"skill":"game-docs","timestamp":"TIMESTAMP","status":"STATUS","version":"VERSION","commit":"COMMIT"}' 2>/dev/null || true
```
