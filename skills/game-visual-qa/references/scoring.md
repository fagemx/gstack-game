# Scoring Model

Deduction-based visual QA scoring. Start at 100, deduct per issue found.

## Severity Definitions

| Severity | Deduction | Definition | Examples |
|----------|-----------|------------|---------|
| Critical | -25 | Renders game unplayable or poses health risk | Black screen, seizure-inducing flashing, rendering corruption that blocks gameplay |
| High | -15 | Always visible during normal play | Wrong animation state in main loop, UI overlap hiding gameplay info, persistent Z-fighting in main area, T-pose flash |
| Medium | -8 | Sometimes visible during normal play | Occasional texture pop-in, animation blend glitch on rare transition, minor UI misalignment on secondary screen |
| Low | -3 | Only visible when actively looking for it | 1px misalignment, sub-pixel font rendering artifact, texture seam at extreme camera angle |

## Severity Dispute Decision Tree

When severity classification is unclear, walk through these questions in order:

1. **Would a player screenshot this and post it as a bug?** -> Critical or High
2. **Would a player notice this during focused gameplay without looking for it?** -> High or Medium
3. **Would a player notice this only during a pause, menu, or slow moment?** -> Medium
4. **Would a player only see this if deliberately zooming in or frame-stepping?** -> Low

Tiebreaker: How frequently does the player encounter this screen/state?
- Main gameplay loop (every session) -> bump up one severity level
- Occasional screen (settings, inventory) -> keep current level
- Rare screen (credits, one-time tutorial) -> bump down one severity level

## Per-Section Scoring

Each section starts at 10 points. Convert deductions to the 10-point scale:
- Critical issue: -2.5 per occurrence
- High issue: -1.5 per occurrence
- Medium issue: -0.8 per occurrence
- Low issue: -0.3 per occurrence

Minimum score per section: 0. No negative scores.

## Score Interpretation

| Score Range | Status | Meaning |
|------------|--------|---------|
| 90-100 | Ship-ready | Minor issues only, no action required |
| 75-89 | Shippable with known issues | High-priority issues documented, team accepts risk |
| 60-74 | Needs work | Multiple high-severity issues, should not ship without fixes |
| Below 60 | Not ready | Critical or numerous high-severity issues, release blocked |

## Weighted Final Score

```
Final = (S1 * 0.10) + (S2 * 0.20) + (S3 * 0.20) + (S4 * 0.20) + (S5 * 0.15) + (S6 * 0.15)
```

Where S1-S6 are the per-section scores (0-10 scale).
