---
name: asset-review
description: "Game asset pipeline review. Checks art style consistency, performance budgets, naming conventions, file formats, and asset specifications."
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
echo '{"skill":"asset-review","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'"$_SLUG"'","branch":"'"$_BRANCH"'"}'  >> ~/.gstack/analytics/skill-usage.jsonl 2>/dev/null || true

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
  --skill "asset-review" --duration "$_TEL_DUR" --outcome "OUTCOME" \
  --used-browse "false" --session-id "$_SESSION_ID" 2>/dev/null &
```


# /asset-review: Asset Pipeline Review

Review game assets for style consistency, performance budgets, and pipeline health.

## Step 0: Asset Context

AskUserQuestion: What are we reviewing?
- A) Full asset audit (all assets)
- B) New assets (recent additions)
- C) Specific category (textures / models / audio / UI / VFX)
- D) Performance budget check

Establish: Target platform, memory budget, art style reference.

## Section 1: Naming & Organization (weight: 10%)

- Consistent naming convention? (`snake_case`, `PascalCase`, prefix by type?)
- Folder structure logical? (by type? by scene? by feature?)
- No duplicate assets with different names?
- Source files (PSD, Blend, FBX) stored separately from game-ready assets?

## Section 2: Format & Specification (weight: 20%)

**Textures:**
- Format appropriate? (PNG for UI, compressed for 3D, WebP for web)
- Power-of-two dimensions? (required for some platforms/engines)
- Mipmaps generated?
- Alpha channel needed or wasted space?

**Models (if applicable):**
- Poly count within budget? (mobile: 1-10K, PC: 10-100K per object)
- Clean topology? (no degenerate triangles, no flipped normals)
- UV mapped efficiently? (no overlapping UVs unless intentional)

**Audio:**
- Format appropriate? (OGG/MP3 for music, WAV for short SFX)
- Sample rate appropriate? (44.1kHz for music, 22.05kHz often fine for SFX)
- Loudness normalized? (LUFS target defined?)
- Loop points clean? (no click/pop at loop boundary)

**UI/2D:**
- Resolution appropriate for target display?
- 9-slice/9-patch prepared for scalable elements?
- Consistent export settings across all UI assets?

## Section 3: Performance Budget (weight: 30%)

```
Budget Check:
  Total texture memory:   ___MB / ___MB budget
  Total mesh memory:      ___MB / ___MB budget
  Audio memory:           ___MB / ___MB budget
  Build size:             ___MB / ___MB target

  Over budget? [YES/NO]
  Largest assets: [list top 5 by size]
```

## Section 4: Style Consistency (weight: 25%)

- All assets from same style family?
- Color palette adherence?
- Detail level consistent? (one asset hyper-detailed, another flat = mismatch)
- Lighting baked consistently?
- Scale consistent? (1 unit = 1 meter across all assets?)

⚠️ AI confidence on style judgment: 35% — this section needs human art director review.

## Section 5: Pipeline Health (weight: 15%)

- Import settings consistent across similar assets?
- Automation in place? (texture compression, atlas generation, sprite packing)
- Asset dependencies mapped? (which assets depend on which?)
- Unused assets identified? (assets in project but not referenced)

## AUTO/ASK/ESCALATE

- **AUTO:** Flag naming violations, oversized assets, missing mipmaps
- **ASK:** Style consistency judgment, budget allocation priorities
- **ESCALATE:** Build size >2x budget, art style fundamentally inconsistent, missing critical assets

## Anti-Sycophancy

Forbidden:
- ❌ "Beautiful assets"
- ❌ "High-quality art"
- ❌ "Professional look"

Instead: "5 textures exceed 2048x2048 on a mobile target. Total texture memory 180MB vs 64MB budget. Top offender: `bg_forest_panorama.png` at 4096x4096 (32MB)."

## Completion Summary

```
Asset Review:
  Assets checked: ___
  Naming issues: ___
  Spec violations: ___
  Budget status: [under/at/over] (___MB / ___MB)
  Style concerns: ___ (⚠️ needs art director confirmation)
  STATUS: DONE / DONE_WITH_CONCERNS / BLOCKED
```

## Save Artifact

```bash
_DATETIME=$(date +%Y%m%d-%H%M%S)
echo "Saving to: $_PROJECTS_DIR/${_USER}-${_BRANCH}-asset-review-${_DATETIME}.md"
```

Write to `$_PROJECTS_DIR/{user}-{branch}-asset-review-{datetime}.md`. Supersedes prior if exists.

Discoverable by: /game-ship, /game-visual-qa

## Review Log

```bash
[ -n "$_GG_BIN" ] && "$_GG_BIN/gstack-review-log" '{"skill":"asset-review","timestamp":"TIMESTAMP","status":"STATUS","assets_checked":N,"issues":N,"commit":"COMMIT"}' 2>/dev/null || true
```
