# Phase 3: Plan — Issue #6 (game-visual-qa)

## Selected Approach

**A (Reference Files) + C elements (quantifiable focus)** — create `references/` directory with domain knowledge files, expand template with forcing questions and severity model, add AI confidence disclaimers on subjective sections.

## Implementation Plan

### Step 1: Create reference files (5 files)

All files go in `skills/game-visual-qa/references/`.

#### 1a. `visual-thresholds.md` (~80 lines)

Contents:
- **Font size minimums** by resolution tier: 720p (14px min body, 18px min heading), 1080p (16px/20px), 1440p (18px/24px), 4K (24px/32px)
- **Touch target minimums**: iOS 44pt, Android 48dp, spacing >= 8dp between targets
- **Color contrast ratios**: WCAG AA text 4.5:1, large text 3:1, UI components 3:1; include formula for calculating
- **Pixel alignment**: Elements must snap to whole pixels; sub-pixel rendering tolerance per context (UI: 0px, game world: 1px)
- **Icon legibility**: Minimum icon size per context (toolbar: 24px, HUD: 32px, mobile: 44px)
- **Text readability**: Maximum line length 60-80 characters, minimum line height 1.4x font size

#### 1b. `animation-standards.md` (~100 lines)

Contents:
- **Frame count guidelines by animation type**:
  - Pixel art: idle 4-8f, walk 6-8f, run 6-10f, attack 4-8f, death 6-12f, jump 4-6f
  - 3D / high-fidelity: idle 24-60f, walk 16-24f, run 12-20f, attack 8-15f
- **12 Principles of Animation mapped to game QA checks**:
  - Anticipation: >= 2 frames before action (critical for readability in combat)
  - Follow-through: >= 2 frames after action (critical for game feel)
  - Timing: heavy objects slower ease-in, light objects snappy
  - Squash & stretch: present in character animations? (art style dependent)
- **FPS targets per platform**: mobile 30/60, PC 60/120/144, console 30/60, VR 72/90/120
- **Animation blend times**: walk-to-run < 150ms, idle-to-action < 100ms, action-to-idle < 200ms
- **Common animation bugs**: T-pose flash (0 frames acceptable), foot sliding (< 2px/cycle), root motion desync, blend tree dead zones

#### 1c. `platform-requirements.md` (~80 lines)

Contents:
- **Safe zones**: TV safe area (90% action safe, 80% title safe), mobile notch areas by device family (iPhone notch: 30px status bar + 44px home indicator, Android: varies), console overscan
- **Resolution tiers**: 720p (mobile minimum), 1080p (mobile target/PC minimum), 1440p (PC target), 4K (PC/console high-end)
- **Aspect ratios**: 16:9 (baseline), 18:9 / 19.5:9 (modern mobile), 21:9 (ultrawide), 4:3 (iPad), 32:9 (super ultrawide)
- **HDR requirements**: peak brightness, tone mapping, SDR fallback
- **Platform-specific gotchas**: Steam Deck (1280x800, 16:10), Switch (720p handheld, 1080p docked), older iPads (4:3)

#### 1d. `scoring.md` (~60 lines)

Contents:
- **Severity definitions with visual examples**:
  - Critical (-25): black screen, rendering makes game unplayable, flashing that could trigger seizures
  - High (-15): always-visible during normal play (wrong animation state, UI overlap hiding gameplay info, consistent Z-fighting in main area)
  - Medium (-8): sometimes visible during normal play (occasional texture pop-in, animation blend glitch on rare transition, minor UI misalignment)
  - Low (-3): only visible when looking for it (1px misalignment, sub-pixel font rendering, texture seam at extreme angle)
- **Severity dispute decision tree** (adapted from `/game-qa`):
  - Would a player screenshot this as a bug? -> High
  - Would a player notice during focused gameplay? -> Medium
  - Would a player only see this if pausing/zooming? -> Low
- **Score interpretation**: 90-100 ship-ready, 75-89 shippable with known issues, 60-74 needs work, below 60 not ready

#### 1e. `gotchas.md` (~50 lines)

Contents:
- **False positives**: intentional art choices that look like bugs (deliberate pixel offset for hand-drawn feel, intentional screen shake, stylized color banding)
- **Platform-specific quirks**: gamma differences between platforms, color space (sRGB vs Display P3), HDR brightness perception
- **Common AI misjudgments**: style consistency in mixed-media games (e.g., 2D characters on 3D backgrounds is intentional), animation frame count in limited-animation styles (e.g., cutout animation intentionally has fewer frames)
- **Scope traps**: reviewing placeholder art as final, judging animation quality on non-final rigs, testing screen adaptation on non-target resolutions

### Step 2: Expand the template (~180 lines target, up from 140)

#### 2a. Add "Load References" block after preamble
```
## Load References

\```bash
echo "=== Loading game-visual-qa reference files ==="
ls references/*.md 2>/dev/null | while read f; do echo "  $f"; done
\```

**Read ALL `references/` files NOW before any user interaction.**
```

#### 2b. Expand Step 0 with proper context gathering
- Add build identifier, target platforms, test devices, art style reference (art bible URL/file)
- Add art style classification: A) Pixel art, B) Hand-drawn/2D, C) 3D stylized, D) 3D realistic, E) Mixed media
- Style classification affects which thresholds from references apply

#### 2c. Add severity classification section
- Import the 4-tier model from `references/scoring.md`
- Apply to all 6 sections (replace the vague "same deduction model" with explicit reference)

#### 2d. Add forcing questions to each section (2 per section, 12 total)

Examples:
- Art Style Consistency: "Show me the 2 most visually different screens side by side. Are they from the same game?" / "If you removed the HUD, could you identify which game this screenshot is from?"
- Animation Quality: "Play the most common action at 0.25x speed. Is every frame intentional?" / "Watch a character stand idle for 30 seconds. Do they feel alive?"
- UI Polish: "Navigate the 3 most-used menus using only the intended input method. Any hesitation point?" / "Screenshot every screen with text. Is the font hierarchy identical?"

#### 2e. Add AI confidence disclaimers
- Section 1 (First Impression): "AI confidence: 25% -- first impressions are inherently subjective. This section is a prompt for human evaluation, not an AI judgment."
- Section 2 (Art Style Consistency): "AI confidence: 35% -- style evaluation requires art direction context. Flag inconsistencies but defer final judgment."
- Sections 3-6: "AI confidence: 60-75% -- these checks are largely measurable."

#### 2f. Expand anti-sycophancy
- Add 4 more forbidden phrases (total 7, matching `/game-qa`)
- Add push-back cadence protocol
- Add 2 more calibrated acknowledgment examples

#### 2g. Add scope boundary with /game-qa and /asset-review
- `/game-visual-qa`: Reviews the VISUAL OUTPUT of a built game (what the player sees on screen)
- `/asset-review`: Reviews ASSET FILES in the project (formats, sizes, naming, pipeline)
- `/game-qa` Section 3: Quick visual pass as part of full QA -- use `/game-visual-qa` for deep visual-only review

### Step 3: Build and test

```bash
bun run build          # regenerate SKILL.md from template
bun test               # verify all 11 tests pass
```

### Step 4: Commit

Two commits (bisect-friendly):
1. `feat(game-visual-qa): add reference files with visual thresholds and animation standards`
   - 5 new files in `skills/game-visual-qa/references/`
2. `feat(game-visual-qa): expand template with scoring model, forcing questions, and AI confidence`
   - Updated `SKILL.md.tmpl`
   - Regenerated `SKILL.md`

## Quality Target

Move `/game-visual-qa` from **Skeleton (35%)** to **A-type (55-65%)**.

Reaching B-type (70-80%) requires calibration with an Art Director / QA Lead, which is out of scope for this issue. The reference files are structured to make that expert calibration straightforward -- they can review and adjust thresholds in isolation.

## Files Changed

| File | Action |
|------|--------|
| `skills/game-visual-qa/references/visual-thresholds.md` | Create |
| `skills/game-visual-qa/references/animation-standards.md` | Create |
| `skills/game-visual-qa/references/platform-requirements.md` | Create |
| `skills/game-visual-qa/references/scoring.md` | Create |
| `skills/game-visual-qa/references/gotchas.md` | Create |
| `skills/game-visual-qa/SKILL.md.tmpl` | Edit (expand ~140L -> ~180L) |
| `skills/game-visual-qa/SKILL.md` | Regenerate |

## Estimated Effort

~3-4 hours implementation. No dependencies on other issues.

## Risks

1. **Threshold values may need expert calibration** -- mitigated by structuring references for easy expert review.
2. **Animation frame counts vary wildly by art style** -- mitigated by providing ranges and requiring art style classification in Step 0.
3. **Template could bloat** -- mitigated by keeping domain knowledge in references, template focused on workflow.
