# Phase 1: Research — Issue #6 (game-visual-qa)

## Current State

`skills/game-visual-qa/SKILL.md.tmpl` is a **skeleton skill** at 140 lines, rated 35% quality (lowest tier). For comparison:
- `/game-qa` (parent QA skill, B-type production quality): **702 lines**
- `/game-review` (B-type production quality): **255 lines template + 8 reference files**
- `/asset-review` (also skeleton): **128 lines**

### What game-visual-qa HAS

1. **6 scored sections** with weights totaling 100%:
   - First Impression (10%), Art Style Consistency (20%), UI Polish (20%), Animation Quality (20%), Screen Adaptation (15%), Performance Visual (15%)
2. **Basic scoring model**: Start at 10, deduct per inconsistency (high -2, medium -1, low -0.5)
3. **AUTO/ASK/ESCALATE** classification (minimal — 1 line each)
4. **Anti-sycophancy** section with 3 forbidden phrases and 1 calibrated example
5. **Completion summary** and **review log** boilerplate

### What game-visual-qa is MISSING

#### Structural gaps (vs production skills like /game-qa)

1. **No references/ directory** — `/game-review` has 8 reference files with rubrics, frameworks, and domain knowledge. `game-visual-qa` has zero.
2. **No Step 0 context gathering** — the mode selection exists but lacks the depth of `/game-qa`'s scope definition (build identifier, target platforms, test devices, recent changes, known issues).
3. **No forcing questions** — `/game-qa` has 2+ forcing questions per section. `game-visual-qa` has none.
4. **No bug severity classification** — `/game-qa` has a 4-tier severity system with specific deduction values and a "severity disputes" decision tree. `game-visual-qa` uses vague "high-impact / medium / low" without definitions.
5. **No multi-pass structure** — no Critical Pass vs Informational Pass distinction.
6. **No fix loop** — `/game-qa` has a full triage + fix loop + re-score cycle. `game-visual-qa` is report-only.
7. **Minimal anti-sycophancy** — only 3 forbidden phrases vs `/game-qa`'s 7 + push-back cadence protocol.

#### Domain knowledge gaps (from domain-judgment-gaps.md)

The gaps doc explicitly lists `/game-visual-qa` as needing:
- **Visual quality thresholds** (what pixel sizes, what DPI, what frame counts)
- **Animation standards** (what frame rates, what easing, what are 12 principles benchmarks)
- Expert needed: **Art Director / QA Lead**

#### Specific technical gaps

1. **No quantifiable visual thresholds**:
   - Minimum font sizes per resolution (e.g., 14px at 720p, 18px at 1080p)
   - Touch target minimums (44px iOS, 48dp Android)
   - Color contrast ratios (WCAG AA: 4.5:1 for text, 3:1 for large text)
   - Pixel alignment tolerances

2. **No animation standards**:
   - Frame count guidelines per animation type (idle: 8-24 frames, walk: 8-12, attack: 6-15)
   - Timing references (anticipation: 2-4 frames, action: 1-3 frames, follow-through: 3-6 frames)
   - FPS targets per platform (mobile: 30/60, PC: 60/120/144, console: 30/60)
   - Animation blending transition time standards

3. **No platform-specific requirements**:
   - Safe zone definitions per platform
   - Notch/cutout specifications
   - HDR requirements
   - Resolution tier expectations (720p/1080p/1440p/4K)

4. **No art style consistency framework**:
   - How to evaluate color palette adherence objectively
   - Line weight measurement methodology
   - Scale consistency check procedures

### Relationship to Other Skills

- **Overlaps with `/asset-review`** — both check art style consistency and performance visuals. No clear boundary defined.
- **Overlaps with `/game-qa` Section 3 (Visual Testing)** — `/game-qa` has its own visual testing section at 15% weight. Unclear when to use `/game-visual-qa` vs just running `/game-qa`.
- **Discoverable by** `/game-ship` and `/game-qa` — but no formal handoff protocol.

### Summary

The skill has a reasonable section structure but lacks the domain knowledge, quantifiable thresholds, and methodological depth that would make it actionable. A reviewer using this skill today would be doing subjective evaluation with no calibration anchors — exactly what the anti-sycophancy protocol is supposed to prevent.
