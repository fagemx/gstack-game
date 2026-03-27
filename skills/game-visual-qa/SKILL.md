---
name: game-visual-qa
description: "Visual QA for games. Reviews art style consistency, UI alignment, animation quality, screen adaptation, and visual polish."
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
echo '{"skill":"game-visual-qa","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'"$_SLUG_SAFE"'","branch":"'"$_BRANCH_SAFE"'"}'  >> ~/.gstack/analytics/skill-usage.jsonl 2>/dev/null || true

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
  --skill "game-visual-qa" --duration "$_TEL_DUR" --outcome "OUTCOME" \
  --used-browse "false" --session-id "$_SESSION_ID" 2>/dev/null &
```


## Load References

```bash
setopt +o nomatch 2>/dev/null || true  # zsh compat
echo "=== Loading game-visual-qa reference files ==="
ls references/*.md 2>/dev/null | while read f; do echo "  $f"; done
```

**Read ALL `references/` files NOW before any user interaction.** They contain visual thresholds, animation standards, platform requirements, scoring model, and gotchas. Zero interruption — load everything upfront.

## Scope Boundaries

- `/game-visual-qa`: Reviews the **visual output** of a built game (what the player sees on screen)
- `/asset-review`: Reviews **asset files** in the project (formats, sizes, naming, pipeline)
- `/game-qa` Section 3: Quick visual pass as part of full QA — use `/game-visual-qa` for deep visual-only review

# /game-visual-qa: Visual Quality Assurance

Systematic visual review of game screens, UI, animations, and art consistency. Apply `references/gotchas.md` throughout the entire review.

## Step 0: Visual Context

AskUserQuestion: What are we reviewing?
- A) Full game visual sweep
- B) Specific screen/scene
- C) UI-only review
- D) Animation review

Establish:
1. **Art style reference** — art bible, moodboard, or reference game?
2. **Art style classification**: A) Pixel art, B) Hand-drawn/2D, C) 3D stylized, D) 3D realistic, E) Mixed media
   - Style classification affects which thresholds from `references/animation-standards.md` apply
3. **Target resolution** and **target platforms** (determines thresholds from `references/platform-requirements.md`)
4. **Build status** — final art, WIP, or placeholder? (See `references/gotchas.md` Scope Traps)

**STOP.** Confirm context before proceeding.

## Section 1: First Impression (weight: 10%)

**AI confidence: 25% — first impressions are inherently subjective. This section is a prompt for human evaluation, not an AI judgment.**

1-second gut reaction:
- Professional or amateur?
- Cohesive or inconsistent?
- Clear or cluttered?

Forcing questions:
- "If you saw this screenshot on a store page with no title, would you wishlist it?"
- "What genre and quality tier does the art communicate in the first second?"

Score using the per-section scoring from `references/scoring.md`. Section 1 Score: ___/10

**STOP.** One issue per AskUserQuestion.

## Section 2: Art Style Consistency (weight: 20%)

**AI confidence: 35% — style evaluation requires art direction context. Flag inconsistencies but defer final judgment to the user.**

- Color palette adherence — Do all elements use the same palette?
- Line weight consistency — Outlines same thickness across all assets?
- Lighting direction — Consistent light source across all scenes?
- Character proportion — Same head-to-body ratio across characters?
- Environmental scale — Objects correct size relative to characters?
- Effect style — Particles/VFX match the art style? (realistic effects in pixel art = mismatch)

Forcing questions:
- "Show me the 2 most visually different screens side by side. Are they from the same game?"
- "If you removed the HUD, could you identify which game this screenshot is from?"

Classify severity per issue using `references/scoring.md` severity definitions. Score: Start at 10, deduct per issue found.

**STOP.** One issue per AskUserQuestion.

## Section 3: UI Polish (weight: 20%)

**AI confidence: 65% — most UI checks are measurable against `references/visual-thresholds.md`.**

- Alignment — Elements on grid? Consistent margins? (see `references/visual-thresholds.md` Pixel Alignment)
- Typography — Font hierarchy clear? Readable at target resolution? (see font size minimums)
- Color meaning — Consistent (red = damage, green = heal) across ALL screens?
- Touch/click targets — Meet platform minimums from `references/visual-thresholds.md`?
- States — Hover, pressed, disabled, loading states all designed?
- Transitions — Screens transition smoothly? No jarring cuts?

Forcing questions:
- "Navigate the 3 most-used menus using only the intended input method. Any hesitation point?"
- "Screenshot every screen with text. Is the font hierarchy identical across all of them?"

Classify severity per issue using `references/scoring.md`. Score: ___/10

**STOP.** One issue per AskUserQuestion.

## Section 4: Animation Quality (weight: 20%)

**AI confidence: 60% — frame counts and blend times are measurable; feel and weight are subjective.**

- Frame count — Meets guidelines from `references/animation-standards.md` for the art style?
- Anticipation — Actions have wind-up >= 2 frames? (makes them readable)
- Follow-through — Actions have recovery >= 2 frames? (makes them feel weighty)
- Timing — Fast actions feel fast? Heavy actions feel heavy?
- Blending — Transition times within targets from `references/animation-standards.md`? No T-pose flashes?
- Idle — Characters alive when not acting? Breathing, blinking, shifting weight?

Forcing questions:
- "Play the most common action at 0.25x speed. Is every frame intentional?"
- "Watch a character stand idle for 30 seconds. Do they feel alive?"

Check against common animation bugs in `references/animation-standards.md`. Classify severity per issue using `references/scoring.md`. Score: ___/10

**STOP.** One issue per AskUserQuestion.

## Section 5: Screen Adaptation (weight: 15%)

**AI confidence: 75% — safe zones and aspect ratios are fully measurable against `references/platform-requirements.md`.**

- Aspect ratios — Test at widest and narrowest supported ratio. Nothing cut off?
- Safe zone — Critical UI within safe area per `references/platform-requirements.md`?
- Scaling — Text readable on smallest target screen? (check against `references/visual-thresholds.md`)
- Notch/cutout — Content not hidden behind camera notch? Uses platform safe area APIs?
- Orientation — If mobile: landscape/portrait handled correctly?

Forcing questions:
- "Screenshot the main gameplay screen at 4:3 (iPad) and 19.5:9 (iPhone). What breaks?"
- "Can you read all HUD text on the smallest target device at arm's length?"

Classify severity per issue using `references/scoring.md`. Score: ___/10

**STOP.** One issue per AskUserQuestion.

## Section 6: Performance Visual (weight: 15%)

**AI confidence: 70% — most performance visuals are observable, though root causes may not be.**

- Texture quality — No blurry textures at expected view distance?
- Pop-in — LOD transitions visible? Asset streaming visible?
- Z-fighting — Overlapping surfaces flickering?
- Overdraw — Excessive transparency layers? (check with wireframe)
- Particle budget — Particle effects reasonable? No FPS drop during effects?
- Frame pacing — Consistent frame delivery? (see FPS targets in `references/animation-standards.md`)

Forcing questions:
- "Run through the busiest scene in the game. Any visual hitches or pop-in?"
- "Toggle between lowest and highest quality settings. What changes are visible?"

Classify severity per issue using `references/scoring.md`. Score: ___/10

**STOP.** One issue per AskUserQuestion.

## Scoring

Calculate weighted final score using formula from `references/scoring.md`:

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

Interpret using score ranges from `references/scoring.md`: 90-100 ship-ready, 75-89 shippable with known issues, 60-74 needs work, below 60 not ready.

## AUTO/ASK/ESCALATE

- **AUTO:** Flag measurable threshold violations (font size, touch targets, contrast ratios, safe zone violations, animation frame counts below minimum)
- **ASK:** Style direction choices, animation priority tradeoffs, screen adaptation strategy (pillarbox vs expand vs crop), severity disputes
- **ESCALATE:** Art style fundamentally inconsistent (multiple conflicting styles with no art direction justification), UI unusable at target resolution, critical animation bugs in main gameplay loop

## Anti-Sycophancy

Forbidden:
- "Beautiful art style"
- "Smooth animations"
- "Clean UI"
- "Polished visuals"
- "Great aesthetic"
- "Nice color palette"
- "Looks professional"

Instead use specific, measurable observations: "Button text is 10px at 720p — below readability threshold (14px min). 3 screens use rounded buttons, 2 use square — inconsistent."

Push-back cadence: After every 3 positive findings, actively look for one issue. If you find none, state: "Checked [area] for [specific problem] — none found."

Calibrated acknowledgment examples:
- "Walk cycle is 8 frames with correct contact/pass/up/down phases. Foot sliding is under 1px — within tolerance."
- "Color contrast on main HUD passes WCAG AA (measured 5.2:1). Settings menu contrast is 2.9:1 — below 4.5:1 minimum for body text."

## Completion Summary

```
Visual QA:
  Scope: [full/screen/UI/animation]
  Art style: [pixel/2D/3D-stylized/3D-realistic/mixed]
  Issues: ___ critical, ___ high, ___ medium, ___ low
  Visual Score: _/10
  STATUS: DONE / DONE_WITH_CONCERNS / BLOCKED

  Next Step:
    PRIMARY: /game-qa — visual issues cataloged, include in QA
    (if asset problems): /asset-review — pipeline issue
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
