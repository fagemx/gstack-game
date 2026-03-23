# Pass 0: Design Intent Survival

This pass is NEW — game-code-review didn't have this. It's the core difference between "code review" and "gameplay implementation review."

## Purpose

Check whether the DESIGN INTENT described in the handoff / slice plan survived the implementation. Code can be clean, tests can pass, but if the player experience described in the handoff is not what the code produces, the implementation missed the target.

## Checks

### 0.1 Handoff Acceptance Criteria

If an implementation-handoff artifact exists, read it. For each acceptance criterion:

| Criterion | In Code? | Evidence |
|-----------|----------|----------|
| [from handoff §6 Engineering Done] | Yes / No / Partial | [file:line or "missing"] |
| [from handoff §6 Design Done] | Yes / No / Partial | [how to verify — may need play testing] |

**Flag any Design Done criterion that has no code path supporting it.** These are the "technically works but doesn't feel right" gaps.

### 0.2 Soul Preservation

If the handoff identifies a "soul" (the one thing that makes the mechanic alive):

> Soul: "[from handoff §7, e.g., 'hit confirmation timing < 3 frames']"

Check: is the soul protected in the implementation?
- Is the timing hardcoded or configurable?
- Is there a test or assertion for it?
- Could a future refactor accidentally break it?

If the soul is NOT explicitly protected, flag as ASK: "The handoff says the soul of this mechanic is [X]. The implementation has no test, assertion, or comment protecting it. One accidental refactor could kill the feel."

### 0.3 Scope Boundaries

If the handoff defines In Scope / Out of Scope / Placeholder OK:

| Item | Handoff Says | Implementation Did | Match? |
|------|-------------|-------------------|--------|
| [item] | MUST | ✅ Built | ✅ |
| [item] | PLACEHOLDER OK | ❌ Built full version | ⚠️ Over-scope |
| [item] | OUT OF SCOPE | ❌ Built anyway | 🔴 Scope creep |
| [item] | MUST | ❌ Not built | 🔴 Missing |

**Over-scope is a finding.** It means the engineer spent time on something the prototype didn't need, potentially at the cost of something it did need.

### 0.4 Gameplay Value Consistency

If the handoff or GDD specifies gameplay values (damage, speed, cooldown, health):

Check that implemented values match design values. Flag mismatches:

```
Design says: player speed = 5.0 units/s
Code has:    player.speed = 12.0

→ ASK: "Player speed in code (12.0) doesn't match design doc (5.0).
   Is this intentional tuning or an implementation error?"
```

### 0.5 Silent Experience Changes

Flag code changes that LOOK like refactors but ALTER player experience:

- Moving logic between Update/FixedUpdate (changes physics behavior)
- Reordering collision checks (changes which collision wins)
- Changing data structure (array → hashset changes iteration order, affects determinism)
- Renaming events/signals (may break event chain, silent failure)
- Changing default values in constructors (affects entities not explicitly configured)

These are the most dangerous bugs because code review sees "clean refactor" but players feel something different.

## When to Skip Pass 0

- No handoff or design doc exists → skip entirely, note "No design intent to verify"
- PR is purely infrastructure (build system, CI, tooling) → skip
- PR is bug fix with no design implications → skip
