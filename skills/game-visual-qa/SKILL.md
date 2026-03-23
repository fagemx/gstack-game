---
name: game-visual-qa
description: "Visual QA for games. Reviews art style consistency, UI alignment, animation quality, screen adaptation, and visual polish."
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
echo '{"skill":"game-visual-qa","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'"$_SLUG"'","branch":"'"$_BRANCH"'"}'  >> ~/.gstack/analytics/skill-usage.jsonl 2>/dev/null || true

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
  --skill "game-visual-qa" --duration "$_TEL_DUR" --outcome "OUTCOME" \
  --used-browse "false" --session-id "$_SESSION_ID" 2>/dev/null &
```


# /game-visual-qa: Visual Quality Assurance

Systematic visual review of game screens, UI, animations, and art consistency.

## Step 0: Visual Context

AskUserQuestion: What are we reviewing?
- A) Full game visual sweep
- B) Specific screen/scene
- C) UI-only review
- D) Animation review

Establish: Art style reference (art bible? moodboard? reference game?), target resolution, target platforms.

## Section 1: First Impression (weight: 10%)

1-second gut reaction:
- Professional or amateur?
- Cohesive or inconsistent?
- Clear or cluttered?
- Score: 0-10

## Section 2: Art Style Consistency (weight: 20%)

- Color palette adherence — Do all elements use the same palette?
- Line weight consistency — Outlines same thickness across all assets?
- Lighting direction — Consistent light source across all scenes?
- Character proportion — Same head-to-body ratio across characters?
- Environmental scale — Objects correct size relative to characters?
- Effect style — Particles/VFX match the art style? (realistic effects in pixel art = mismatch)

Score: Start at 10, each inconsistency: high-impact -2, medium -1, low -0.5

## Section 3: UI Polish (weight: 20%)

- Alignment — Elements on grid? Consistent margins?
- Typography — Font hierarchy clear? Readable at target resolution?
- Color meaning — Consistent (red = damage, green = heal) across ALL screens?
- Touch/click targets — Minimum 44px on mobile? No overlapping targets?
- States — Hover, pressed, disabled, loading states all designed?
- Transitions — Screens transition smoothly? No jarring cuts?

Score: Same deduction model.

## Section 4: Animation Quality (weight: 20%)

- Frame rate — Smooth at target FPS? Any judder?
- Anticipation — Actions have wind-up? (makes them readable)
- Follow-through — Actions have recovery? (makes them feel weighty)
- Timing — Fast actions feel fast? Heavy actions feel heavy?
- Blending — Transitions between animations smooth? No T-pose flashes?
- Idle — Characters alive when not acting? Breathing, blinking, shifting weight?

Score: Same deduction model.

## Section 5: Screen Adaptation (weight: 15%)

- Aspect ratios — 16:9, 18:9, 21:9, 4:3 — nothing cut off?
- Safe zone — Critical UI elements within safe area?
- Scaling — Text readable on smallest target screen?
- Notch/cutout — Content not hidden behind camera notch?
- Orientation — If mobile: landscape/portrait handled correctly?

Score: Same deduction model.

## Section 6: Performance Visual (weight: 15%)

- Texture quality — No blurry textures at expected view distance?
- Pop-in — LOD transitions visible? Asset streaming visible?
- Z-fighting — Overlapping surfaces flickering?
- Overdraw — Excessive transparency layers? (check with wireframe)
- Particle budget — Particle effects reasonable? No FPS drop during effects?

Score: Same deduction model.

## Scoring

```
Visual QA Score:
  First Impression:       _/10 (weight: 10%)
  Art Consistency:        _/10 (weight: 20%)
  UI Polish:              _/10 (weight: 20%)
  Animation Quality:      _/10 (weight: 20%)
  Screen Adaptation:      _/10 (weight: 15%)
  Performance Visual:     _/10 (weight: 15%)
  ─────────────────────────────
  WEIGHTED TOTAL:         _/10
```

## AUTO/ASK/ESCALATE

- **AUTO:** Flag alignment issues, missing states, obvious inconsistencies
- **ASK:** Style direction choices, animation priority, screen adaptation tradeoffs
- **ESCALATE:** Art style fundamentally inconsistent (multiple conflicting styles), UI unusable at target resolution

## Anti-Sycophancy

Forbidden:
- ❌ "Beautiful art style"
- ❌ "Smooth animations"
- ❌ "Clean UI"

Instead: "Button text is 10px at 720p — below readability threshold (14px min). 3 screens use rounded buttons, 2 use square — inconsistent."

## Completion Summary

```
Visual QA:
  Scope: [full/screen/UI/animation]
  Issues: ___ high, ___ medium, ___ low
  Visual Score: _/10
  STATUS: DONE / DONE_WITH_CONCERNS / BLOCKED
```

## Save Artifact

```bash
_DATETIME=$(date +%Y%m%d-%H%M%S)
echo "Saving to: $_PROJECTS_DIR/${_USER}-${_BRANCH}-visual-qa-${_DATETIME}.md"
```

Write to `$_PROJECTS_DIR/{user}-{branch}-visual-qa-{datetime}.md`. Supersedes prior if exists.

Discoverable by: /game-ship, /game-qa

## Review Log

```bash
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-review-log" '{"skill":"game-visual-qa","timestamp":"TIMESTAMP","status":"STATUS","visual_score":SCORE,"issues":N,"commit":"COMMIT"}' 2>/dev/null || true
```
