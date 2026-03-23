# Acceptance Criteria Patterns for Games

## The Two-Layer Model

Game acceptance criteria MUST have two layers. Most handoffs only have the first.

### Layer 1: Engineering Done (functional)
"Does it work?"
- Builds, runs, doesn't crash
- All specified interactions produce specified responses
- Meets performance targets (framerate, memory, load time)

### Layer 2: Design Done (experiential)
"Does it feel right?"
- Player can perceive the intended experience
- Feedback chains are complete (input → response → confirmation → payoff)
- The "soul" of the mechanic is present

**A build that passes Layer 1 but fails Layer 2 is NOT DONE.**

---

## Bad vs Good Acceptance Criteria

### Functional

```
❌ BAD: "Combat system works"
✅ GOOD: "Player can attack (tap), dodge (swipe), and heal (hold).
   Each produces distinct animation + audio + VFX within 3 frames of input."

❌ BAD: "Save system implemented"
✅ GOOD: "Player progress persists across app close/reopen.
   Save occurs automatically at each checkpoint. Load time < 2 seconds."
```

### Experiential

```
❌ BAD: "Combat feels good"
✅ GOOD: "After 3 combat encounters, a new player can answer:
   'How do I dodge?' and 'What happens when I get hit?'
   Verified by watching someone play, not by asking them."

❌ BAD: "Progression feels rewarding"
✅ GOOD: "After first level-up, player pauses to read what changed.
   After second level-up, player actively tries the new ability.
   If player ignores level-up entirely, progression isn't communicating."
```

### Performance

```
❌ BAD: "Runs smoothly"
✅ GOOD: "60fps on target device (iPhone 13 / Pixel 7 / Steam Deck).
   No frame drops >2 frames during combat. Load between rooms < 0.5s."

❌ BAD: "No memory issues"
✅ GOOD: "Memory stays below 500MB after 30 minutes of play.
   No allocation spikes during combat (check with profiler)."
```

### Integration

```
❌ BAD: "All systems work together"
✅ GOOD: "Combat generates currency (gold) at the rate specified in
   economy doc (50-80 gold per 3-min encounter). Shop prices are
   visible and purchasable. Player can buy → equip → use in combat
   within one session."
```

---

## Priority Tiers

Every acceptance criterion should be tagged:

| Tier | Meaning | If Missing |
|------|---------|-----------|
| **MUST** | Without this, the prototype test is invalid | Build is not done. Stop and fix. |
| **SHOULD** | Improves signal quality but test still works without it | Note as known limitation. Fix in next iteration. |
| **COULD** | Polish. Nice to have. | Skip if time is tight. |

**Rule of thumb:** A prototype should have 3-5 MUSTs, 2-3 SHOULDs, and 0-2 COULDs. If you have more than 8 MUSTs, the scope is too large for a prototype.
