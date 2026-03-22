# Scoring Formula & Repeat Play Simulation

## Scoring Rules

Start each phase at 10/10. Apply deductions:

| Issue Type | Deduction |
|-----------|-----------|
| AUTO-FLAG friction point | -1 point |
| ASK-level concern (unresolved) | -1.5 points |
| ESCALATE-level blocker | -3 points |
| Healthy emotion pattern | +0 (expected, not bonus) |
| Unhealthy emotion pattern | -2 points |
| GDD blind spot in critical checkpoint | -1 point |

Minimum score per phase: 0/10.

## Phase Weights (Full Walkthrough)

```
Player Experience Score — [Persona Name]:
  First Contact (0-30s):     _/10  (weight: 20%)
  Onboarding (30s-5min):     _/10  (weight: 20%)
  Core Session (5-15min):    _/10  (weight: 25%)
  Return & Depth:            _/10  (weight: 20%)
  Long-term:                 _/10  (weight: 15%)
  -----------------------------------------
  WEIGHTED TOTAL:            _/10

  Deductions breakdown:
    [phase]: [reason] (-N)
    [phase]: [reason] (-N)
    ...
```

## Phase Weights (Early-Phase Persona Only)

If the selected persona only covers early phases (e.g., Casual Newcomer), score only applicable phases and reweight:
- First Contact: 30%, Onboarding: 35%, Core Session: 35%

---

## Repeat Play Simulation

For the selected persona, simulate across multiple sessions:

### Session 1 (Discovery)
- What surprised the player?
- What confused the player?
- What would they tell a friend about the game?
- Would they open it again? Why?

### Session 3 (Familiarity)
- What's different from session 1? (If nothing: flag as repetition risk.)
- Has the player developed a personal strategy or preference?
- What quality-of-life friction has appeared? (things that were fine once but annoying on repeat)
- Is the player looking forward to session 4?

### Session 10 (Routine or Mastery?)
- Is this routine (going through motions) or mastery (getting better, discovering depth)?
- Has the player found their own goals beyond what the game suggests?
- What would make them stop playing? What would make them recommend the game?
- Key question: "Am I still having fun? Why or why not?"
