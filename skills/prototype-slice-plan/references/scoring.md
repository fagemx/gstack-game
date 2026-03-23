# Prototype Slice Plan — Scoring

## 5 Scoring Axes

Each axis 0-2. Total /10.

### 1. Validation Value
Does this slice test the riskiest assumption?

- **2** = Tests the #1 design risk. If the slice fails, you learn the most important thing.
- **1** = Tests a real assumption but not the riskiest one. Useful but not maximally informative.
- **0** = Tests nothing risky. Outcome is predictable. This is a demo, not a prototype.

### 2. Implementation Feasibility
Can this slice be built in the target timeframe?

- **2** = Buildable in ≤2 weeks with current team/tools. Dependencies are satisfied or fakeable.
- **1** = Buildable in 2-4 weeks, or requires 1-2 dependencies that need work first.
- **0** = >4 weeks, or blocked by unsolved technical problems. Scope is too large for a prototype.

### 3. Player Signal Clarity
Will the prototype give a clear signal about player experience?

- **2** = Binary signal: players either engage or don't. Observable in 5 minutes of watching someone play. No ambiguity.
- **1** = Signal exists but requires interpretation. "Players seemed to like it but we're not sure why."
- **0** = No clear signal possible. The prototype is too short/shallow to reveal player preference. Or the thing being tested requires context that the prototype can't provide.

### 4. Dependency Risk
How many other systems must exist (or be faked) for this slice to work?

- **2** = 0-1 dependencies. Slice is self-contained or needs only one fake system.
- **1** = 2-3 dependencies. Manageable but each fake adds noise to the signal.
- **0** = 4+ dependencies. The slice is really a mini-game that requires most of the full game to exist. This isn't a slice — it's the whole game at low quality.

### 5. Scope Discipline
Is the slice as small as possible while still being valid?

- **2** = Can't remove anything without losing the validation signal. Every element earns its place.
- **1** = Has 1-2 elements that could be cut without losing signal. Slightly over-scoped.
- **0** = Significant bloat. Multiple systems that aren't needed for validation. The team is sneaking in "nice to haves."

## Candidate Comparison Table

```
Slice Candidates:
═══════════════════════════════════════════════════════════════════
Candidate    Valid  Feasib  Signal  Depend  Scope   Total   Rank
───────────  ─────  ──────  ──────  ──────  ─────   ─────   ────
A: [name]    _/2    _/2     _/2     _/2     _/2     _/10    _
B: [name]    _/2    _/2     _/2     _/2     _/2     _/10    _
C: [name]    _/2    _/2     _/2     _/2     _/2     _/10    _
═══════════════════════════════════════════════════════════════════

Recommended: [Candidate _]
Reason: [1-2 sentences — why this one over the others]

Rejected candidates:
- [Candidate _]: [why not — specific weakness]
- [Candidate _]: [why not — specific weakness]
```

## Interpretation

| Total | Verdict |
|-------|---------|
| 8-10 | **Strong slice** — build it. Clear validation target, feasible, clean signal. |
| 6-7 | **Decent slice** — buildable but has a weakness. Address the lowest-scoring axis before starting. |
| 4-5 | **Weak slice** — reconsider. Either the scope is too large, the signal is unclear, or it's testing something that isn't the real risk. |
| 0-3 | **Not a prototype** — this is either a demo, a full feature, or a wish. Rethink what you're trying to learn. |
