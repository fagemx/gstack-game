# Build Playability Scoring

## 6 Dimensions — /12 total

### 1. Loop Closure (0-2)
Can the player complete one full cycle of the core loop?

- **2** = Full loop completes: action → reward → spend/upgrade → improved action. Player sees the cycle.
- **1** = Partial loop: action → reward exists but no spend path, or spend exists but no visible improvement.
- **0** = No loop: features exist in isolation. Player does things but there's no cycle.

### 2. Session Viability (0-2)
Can a player sustain a meaningful session?

- **2** = 5+ minutes of continuous play with variation. Natural stopping point exists.
- **1** = 2-5 minutes before repetition or dead end. No stopping point (player must abandon).
- **0** = <2 minutes before there's nothing to do, or immediate confusion/crash.

### 3. Onboarding Clarity (0-2)
Can a new player figure out what to do without external help?

- **2** = Player understands goal + controls + core action within 60 seconds. No text walls needed.
- **1** = Player understands after 1-2 minutes or with minimal hints. Some confusion but recoverable.
- **0** = Player is lost. Requires verbal explanation or external documentation to play.

### 4. Failure Recovery (0-2)
When the player fails, what happens?

- **2** = Failure is clear (player knows why), recovery is fast (<5 seconds to retry), and failure teaches something.
- **1** = Failure exists but recovery is slow or failure cause is unclear.
- **0** = No failure state (game can't lose = no tension), or failure is punishing (lose 5+ minutes of progress).

### 5. Retention Signal (0-2)
After one session, would the player return?

- **2** = Clear "one more try" impulse OR visible next goal the player wants to reach. Build has a hook.
- **1** = Player might return if reminded. No active pull but no active repulsion either.
- **0** = No reason to return. Player has "seen everything" in one session. Or: experience was negative.

### 6. Peak Moment (0-2)
Does the build contain at least one moment of delight, surprise, or tension?

- **2** = At least one clearly identifiable peak (funny, tense, surprising, satisfying). Player would describe it to someone.
- **1** = Mild peaks exist but nothing memorable. "It was fine."
- **0** = Flat experience. No moment stands out. Emotional flatline throughout.

## Playability Verdict

| Score | Verdict | What It Means |
|-------|---------|--------------|
| 10-12 | **PLAY-READY** | Build is worth showing to external playtesters. Core experience is there. |
| 7-9 | **ALMOST** | One or two dimensions holding it back. Fix those, then retest. |
| 4-6 | **NOT YET** | Major gaps in the experience. Needs focused work on lowest-scoring dimensions. |
| 0-3 | **TECH DEMO** | Features exist but there's no player experience yet. This is a tech build, not a game build. |

## Report Template

```
Build Playability Report
═══════════════════════════════════════════════════
Game: [name]
Build: [version/branch/date]
Prototype target: [from slice plan]

  Loop Closure:        _/2  — [evidence]
  Session Viability:   _/2  — [evidence]
  Onboarding Clarity:  _/2  — [evidence]
  Failure Recovery:    _/2  — [evidence]
  Retention Signal:    _/2  — [evidence]
  Peak Moment:         _/2  — [evidence]
  ─────────────────────────
  TOTAL:               _/12 — [PLAY-READY / ALMOST / NOT YET / TECH DEMO]

Top blocker: [the one thing preventing the next verdict tier]

Session timeline:
  0:00  [what happens]
  0:30  [what happens]
  1:00  [what happens]
  ...
  X:XX  [player stops — why?]

Hypothesis validation: [from slice plan — was the hypothesis tested? result?]
═══════════════════════════════════════════════════
```
