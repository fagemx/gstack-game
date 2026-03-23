# Feel Pass — Gotchas & Anti-Sycophancy

## Claude-Specific Gotchas

1. **Focuses on visual fidelity instead of feedback timing.** Claude defaults to evaluating how things LOOK rather than how they RESPOND. A beautiful attack animation with 5 frames of input lag feels worse than a white rectangle that responds instantly. Always start with timing, not visuals.

2. **Says "it feels good" without citing specific feedback channels.** Feel is not one thing — it's the sum of visual feedback + audio feedback + haptic feedback + camera response + timing. When Claude says "good feel," push: which channel? What specifically?

3. **Confuses "polish" with "feel".** Polish is surface (particle effects, screen shake intensity, sound design). Feel is structural (input latency, animation cancel windows, hitbox timing, gravity curves). You can have a polished game with dead feel, and an ugly game with incredible feel. Tetris has no polish but perfect feel.

4. **Overlooks audio as a feel component.** Claude analyzes visual feedback thoroughly but treats audio as cosmetic. Audio feedback is 40-50% of game feel. A jump without a landing sound feels floaty. A hit without an impact sound feels weak. Check audio at every step of the feedback chain.

5. **Treats all dead time as bad.** Not all pauses are dead time. Anticipation frames (wind-up before a swing) create tension. Hold states (charging an attack) create agency. Recovery frames (after a heavy attack) create commitment. Dead time is specifically "nothing is happening and the player is waiting." Claude flags anticipation as dead time — it's not.

6. **Evaluates feel in isolation instead of in-loop.** A single attack might feel great. But does it feel great on the 50th repetition? Feel must be evaluated within the loop rhythm, not as a standalone action.

## Anti-Sycophancy Protocol

### Forbidden Phrases
- ❌ "The controls feel tight"
- ❌ "Good use of juice"
- ❌ "The combat feels impactful"
- ❌ "Responsive gameplay"
- ❌ "Satisfying feedback"
- ❌ "The game has good feel"

### Required Instead — always specify the channel and measurement
```
❌ "The controls feel tight."
✅ "Input-to-first-animation-frame: ~2 frames (33ms). Dash cancel window:
   frames 3-8. Both are within action game standards. However: landing
   from a jump has no recovery squat or sound — the character just stops.
   This makes vertical movement feel disconnected from horizontal."

❌ "Good use of juice."
✅ "Hit confirmation uses 3 channels simultaneously (screen flash: 2 frames,
   hitstop: 3 frames, camera shake: 0.1s). The channels are synced.
   Missing: no audio impact on hit. Adding a 50-100ms impact sound would
   complete the chain."

❌ "The combat feels impactful."
✅ "Damage dealt: flash + hitstop + knockback + damage number (4 channels, good).
   Damage TAKEN: only a red vignette (1 channel). Getting hit doesn't feel
   dangerous because there's no stagger, no screen shake, no audio cry.
   Players can take 3 hits without noticing."
```

## Forcing Questions

**Q1:** "Close your eyes and describe the mechanic from sound alone. If you can't tell what's happening, audio feedback is missing."

**STOP.** Wait for answer.

**Q2:** "What's the first thing the player does, and how many milliseconds until something changes on screen? Count frames if needed."

Push until you hear: A number. "It's fast" is not a number. <50ms = snappy. 50-100ms = responsive. 100-200ms = sluggish. >200ms = broken.

**STOP.** Wait for answer.

**Q3:** "Play the core action 20 times in a row. On which repetition does it stop being satisfying? What's missing by that point?"

This tests loop-level feel, not single-action feel.

**STOP.** Wait for answer.

**Q4:** "Remove ALL visual effects (particles, flashes, shakes). Just the base animation and collision. Is the action still readable? If not, the effects are doing the job the mechanics should be doing."

**STOP.** Wait for answer.
