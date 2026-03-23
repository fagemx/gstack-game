# Implementation Handoff — Gotchas & Anti-Sycophancy

## Claude-Specific Gotchas

1. **Writes implementation details instead of design intent.** Claude defaults to describing HOW to code things ("use a state machine with 3 states") instead of WHAT the player must experience ("player must feel the character's weight shift when changing direction"). The handoff should describe the experience, not the architecture. Architecture belongs to the engineer.

2. **Over-specifies the technical approach.** Claude tends to prescribe specific patterns, libraries, or algorithms. A good handoff says "weapon switching must feel instant (<100ms)" not "use an object pool with preloaded weapon prefabs." Let the engineer pick their approach.

3. **Forgets to list what can be placeholder.** Without explicit "this can be fake" markers, engineers will build everything at full quality. Every item in the handoff should be tagged: MUST BE REAL / CAN BE PLACEHOLDER / DEFER ENTIRELY.

4. **Defines "done" in engineering terms, not player terms.** Claude writes acceptance criteria like "all tests pass, no crashes, 60fps" — which is correct but incomplete. A game handoff must also define done in player terms: "player can feel the dodge is responsive" or "player understands they need to block after 2 encounters."

5. **Misses the "soul" of the mechanic.** Every mechanic has one thing that, if wrong, makes it feel dead. The handoff must identify this explicitly. For a jump: it's the apex hang time. For a hit: it's the hitstop frame. For a dodge: it's the i-frame window. Claude rarely identifies this.

6. **Doesn't separate must-have from nice-to-have.** Claude lists requirements as a flat list with equal weight. Good handoffs have clear tiers: MUST (without this the test is invalid), SHOULD (improves signal quality), COULD (polish, defer if tight on time).

## Anti-Sycophancy

### Forbidden Phrases
- ❌ "This will be straightforward to implement"
- ❌ "The engineer should be able to figure out the details"
- ❌ "Standard game development practices apply"
- ❌ "This is a clean handoff"

### Required Instead
```
❌ "The combat system should feel responsive."
✅ "Attack input → first animation frame: <3 frames (50ms at 60fps).
   Hit confirmation: screen flash + haptic within 1 frame of collision.
   If hit confirm is >2 frames late, the combat will feel mushy.
   This is the #1 thing that kills the feel. Get this right first."

❌ "Standard platformer jump mechanics."
✅ "MUST: Variable jump height (hold = higher). Coyote time (5 frames
   after leaving edge). Apex hang (reduced gravity at top of arc).
   CAN BE PLACEHOLDER: Jump animation (use capsule). Jump sound.
   Landing particles."
```

## Forcing Questions

**Q1:** "What is the ONE thing that, if the engineer gets wrong, makes this not the same mechanic?"

Push until you hear: A specific, measurable quality. "The dash must have i-frames during the first 0.2s" = good. "It should feel good" = not a handoff, it's a wish.

**STOP.** Wait for answer.

**Q2:** "If the engineer finishes and says 'it works, all tests pass' — what would you STILL need to check by playing it?"

This reveals the gap between engineering-done and design-done. The answer is the experiential acceptance criteria that must be in the handoff.

**STOP.** Wait for answer.

**Q3:** "What shortcut would a time-pressured engineer take that would destroy the experience?"

This is the "known risks" section. Every mechanic has a tempting shortcut that technically works but kills the feel. Name it in the handoff so the engineer knows not to take it.

**STOP.** Wait for answer.
