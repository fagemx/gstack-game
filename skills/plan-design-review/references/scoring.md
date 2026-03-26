# Plan Design Review — Scoring Model

## The Fix-to-10 Method

For each of the 7 passes, rate the plan 0-10 on that dimension.

**Rating process:**
1. **Rate:** Assign a score with one-sentence justification
2. **Gap:** Explain what a 10 looks like for THIS plan
3. **Fix:** Propose concrete edits to the plan
4. **Re-rate:** After user accepts/rejects changes, re-score
5. **Loop:** Repeat until 10 or user says "good enough, move on"

## Per-Pass Scoring Rubric

### Pass 1: Information Architecture (weight: 15%)

| Score | Description |
|-------|-------------|
| 9-10 | Every screen has explicit visual hierarchy (what player sees 1st/2nd/3rd). Screen flow diagram exists. HUD priority mapping matches game pillars |
| 7-8 | Most screens have hierarchy defined. Some screens missing or vague |
| 5-6 | Screen list exists but hierarchy is implicit or inconsistent |
| 3-4 | Screens mentioned but no information priority defined |
| 0-2 | Plan describes features without any screen-level thinking |

### Pass 2: Interaction State Coverage (weight: 20%)

| Score | Description |
|-------|-------------|
| 9-10 | Every UI feature has all applicable states specified (loading, empty, error, death, cooldown, full, locked). Each state describes what the player SEES |
| 7-8 | Core features have states covered. Secondary features missing some |
| 5-6 | Happy path well-specified. Error/edge states partially covered |
| 3-4 | Only success states described. Failures mentioned generically |
| 0-2 | No state thinking — plan assumes everything works perfectly |

### Pass 3: Player Journey & Emotional Arc (weight: 15%)

| Score | Description |
|-------|-------------|
| 9-10 | Full player emotion storyboard from FTUE to D30. Each moment has intended emotion + UI/UX supporting it. Time-horizon design applied (5-sec, 5-min, long-term) |
| 7-8 | FTUE and core loop emotions designed. Later journey gaps |
| 5-6 | Key moments identified (first death, first win) but emotional design is implicit |
| 3-4 | Player journey described functionally, no emotional layer |
| 0-2 | No consideration of player emotional experience |

### Pass 4: AI Slop Risk (weight: 15%)

| Score | Description |
|-------|-------------|
| 9-10 | Every UI element has a specific reason to exist in THIS game. No generic descriptions. Each element answers "why this game and not any game" |
| 7-8 | Most UI is game-specific. 1-2 elements still generic |
| 5-6 | Mix of specific and generic. Some elements could be from any game in the genre |
| 3-4 | Mostly generic descriptions. "Health bar," "inventory grid," "settings menu" without differentiation |
| 0-2 | Plan reads like a template — swap the game name and it still works |

### Pass 5: Design System Alignment (weight: 10%)

| Score | Description |
|-------|-------------|
| 9-10 | DESIGN.md exists or plan establishes: color tokens, typography scale, spacing grid, button styles, icon style, component library. New components fit the vocabulary |
| 7-8 | Partial design system. Core tokens defined, some gaps |
| 5-6 | Visual direction stated ("dark theme, pixel art UI") but no systematic tokens |
| 3-4 | Inconsistent visual descriptions across screens |
| 0-2 | No design system thinking. Each screen described independently |

### Pass 6: Input Adaptation & Accessibility (weight: 15%)

| Score | Description |
|-------|-------------|
| 9-10 | All target input methods have explicit UI specs. A11y fully specified: colorblind, subtitles, difficulty assists, touch targets, keyboard nav |
| 7-8 | Primary input method well-specified. Secondary and a11y partially covered |
| 5-6 | One input method assumed. Some a11y mentioned |
| 3-4 | Input method implied but not designed for. No a11y |
| 0-2 | No platform or accessibility thinking |

### Pass 7: Unresolved Design Decisions (weight: 10%)

| Score | Description |
|-------|-------------|
| 9-10 | All design decisions either made or explicitly deferred with risk assessment. Zero ambiguity that will surprise implementation |
| 7-8 | Most decisions made. 1-2 deferred with clear reasoning |
| 5-6 | Key decisions made but several implicit assumptions |
| 3-4 | Many unstated assumptions. Implementation will require design guesswork |
| 0-2 | Plan is a feature list, not a design document |

## Weighted Total Calculation

```
Plan Health Score =
  (Pass1 × 0.15) + (Pass2 × 0.20) + (Pass3 × 0.15) +
  (Pass4 × 0.15) + (Pass5 × 0.10) + (Pass6 × 0.15) + (Pass7 × 0.10)
```

## Score Interpretation

| Range | Verdict | Meaning |
|-------|---------|---------|
| 8.0-10.0 | DESIGN-COMPLETE | Plan is ready for implementation. Run /prototype-slice-plan |
| 6.0-7.9 | SOLID | Functional gaps exist but plan is implementable with some design decisions during build |
| 4.0-5.9 | NEEDS WORK | Significant design gaps. Implementation will require frequent design guesswork |
| 2.0-3.9 | MAJOR GAPS | Plan is a feature list, not a design document. Most UI decisions unmade |
| 0.0-1.9 | NO DESIGN | Plan has no UI/UX thinking. Start from scratch or run /game-ux-review on existing designs |
