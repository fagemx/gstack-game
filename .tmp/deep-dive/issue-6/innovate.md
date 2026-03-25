# Phase 2: Innovate — Issue #6 (game-visual-qa)

## Approach A: Reference Files Architecture

**Model:** Follow `/game-review` pattern (8 reference files loaded at startup).

Create `skills/game-visual-qa/references/` with:

| File | Contents | Lines (est.) |
|------|----------|-------------|
| `visual-thresholds.md` | Font size minimums per resolution, touch target specs, color contrast ratios (WCAG), pixel alignment tolerances, DPI requirements | ~80 |
| `animation-standards.md` | Frame count guidelines by animation type, timing references (12 principles mapped to frame counts), FPS targets per platform, blend transition standards | ~100 |
| `platform-requirements.md` | Safe zones per platform, notch/cutout specs, resolution tiers, HDR requirements, aspect ratio handling | ~80 |
| `scoring.md` | Severity definitions with concrete visual examples, deduction rules, severity dispute decision tree | ~60 |
| `gotchas.md` | Common visual QA mistakes (false positives, subjective vs objective, platform-specific quirks) | ~50 |

**Pros:**
- Matches proven pattern from `/game-review` (which is the highest-quality skill)
- Reference files are reusable by other skills (e.g., `/asset-review` could reference `visual-thresholds.md`)
- Separates domain knowledge from workflow logic — easier for domain experts to review/edit
- Template stays focused on workflow; references hold the calibration data

**Cons:**
- More files to maintain
- Need to wire up "Load References" step in template (minor)
- Risk of references growing stale if not used by the template

**Effort:** ~3-4 hours

---

## Approach B: Expanded Embedded Checklists

**Model:** Follow `/game-qa` pattern (everything inline in the template, no external references).

Expand each of the 6 sections with:
- Concrete checklist items with pass/fail criteria
- Severity classification per checklist item
- Forcing questions (2+ per section)
- Platform-specific variations inline
- Quantitative thresholds embedded in the checklist

Example for Animation Quality section:
```
### Animation Quality Checklist
| Check | Target | Severity if Failed |
|-------|--------|-------------------|
| Idle animation frame count | >= 8 frames (pixel), >= 24 frames (3D) | Medium |
| Walk cycle foot sliding | < 2px drift per cycle | High |
| Attack anticipation frames | >= 2 frames | Medium |
| Blend transition time | < 200ms between states | High |
| T-pose flash on transition | 0 frames visible | High |
```

**Pros:**
- Self-contained — one file has everything
- Easier to read linearly (no jumping between files)
- Follows `/game-qa` pattern which is also production-quality

**Cons:**
- Template becomes very long (estimated 450-550 lines)
- Harder for domain experts to review just the thresholds vs the workflow
- Checklists can feel rigid — may not adapt well to different art styles (pixel art vs 3D vs hand-drawn)

**Effort:** ~3-4 hours

---

## Approach C: Quantifiable-Only Checks

**Model:** Strip all subjective evaluation. Focus exclusively on measurable criteria.

Remove or minimize:
- "First Impression" section (pure subjective)
- "Art Style Consistency" narrative evaluation
- Any "does it feel right?" type checks

Keep and expand:
- Pixel measurements (font sizes, touch targets, margins, alignment grid)
- Frame counts (animation lengths, FPS, blend times)
- Color values (contrast ratios, palette hex codes vs reference)
- Resolution checks (safe zones, aspect ratio math)
- Performance metrics (draw calls, overdraw, particle counts)

**Pros:**
- Maximum objectivity — AI confidence is highest on measurable checks
- Removes the subjective areas where AI has 35% confidence (per domain-judgment-gaps.md)
- Results are reproducible and auditable
- Faster to run (no subjective deliberation)

**Cons:**
- Misses important subjective quality ("it looks professional" is a real signal even if hard to quantify)
- Art style consistency is the #1 visual QA concern in practice and it's inherently subjective
- Players don't evaluate games with rulers — the "feel" matters
- Would make this skill a subset of what `/game-qa` Section 3 already covers

**Effort:** ~2 hours

---

## Approach Comparison

| Criteria | A: References | B: Embedded | C: Quantifiable-Only |
|----------|--------------|-------------|---------------------|
| Domain depth | High | High | Medium |
| Maintainability | High (modular) | Medium (monolith) | High (simple) |
| Expert review ease | High (focused files) | Low (dig through 500L) | Medium |
| Covers subjective | Yes (with caveats) | Yes (with caveats) | No |
| Reusable by other skills | Yes | No | Partial |
| Matches existing patterns | `/game-review` | `/game-qa` | Neither |
| AI confidence alignment | Medium | Medium | High |
| Estimated final lines | ~180 template + ~370 refs | ~500 template | ~250 template |

## Recommendation

**Approach A (Reference Files) with elements of C (quantifiable focus).**

Rationale:
1. The `/game-review` reference pattern is proven and matches the project's direction for B-type skills.
2. Reference files let domain experts (Art Director / QA Lead) review thresholds independently.
3. Quantifiable thresholds go in references; the template handles workflow and subjective sections with explicit AI confidence disclaimers (like `/asset-review` does: "AI confidence on style judgment: 35%").
4. Other skills (`/asset-review`, `/game-qa`) can cross-reference the visual thresholds without duplicating them.

The subjective sections (First Impression, Art Style Consistency) stay but get:
- Explicit AI confidence warnings
- Structured rubrics that reduce (but don't eliminate) subjectivity
- Forcing questions that push for evidence over opinion
