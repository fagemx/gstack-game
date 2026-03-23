# Prototype Slice Plan — Gotchas & Anti-Sycophancy

## Claude-Specific Gotchas

1. **Picks the most impressive slice, not the most validating.** Claude gravitates toward the slice that would make the best demo or trailer, not the one that answers the riskiest design question. The whole point of a prototype is to test assumptions — pick the slice that could FAIL most informatively.

2. **Underestimates what can be faked.** Claude tends to include full systems when a prototype only needs the illusion. A combat prototype doesn't need a real inventory system — hardcoded loadouts work. An economy prototype doesn't need real UI — a debug console works. Ask: "What can we fake and still get a valid signal?"

3. **Confuses "demo" with "prototype".** A demo shows the best version of what you've built. A prototype tests whether something works. Claude defaults to demo thinking ("this will look great") instead of prototype thinking ("this will tell us if players actually enjoy the core loop"). If the prototype can't fail, it's a demo.

4. **Scopes to a full vertical slice by default.** Claude's instinct is to recommend the most complete possible version. But a mechanic prototype (one system, 30 seconds of gameplay) is often more validating than a vertical slice (all systems, 10 minutes of gameplay). Smaller slices give faster, cleaner signals.

5. **Forgets to define the failure condition.** Every good prototype has a way to fail. If you can't describe what "this slice didn't work" looks like, the slice isn't testing anything. Claude skips this because failure feels negative — but "we learned the core loop isn't fun" is a successful prototype.

6. **Ignores platform constraints when slicing.** Claude plans slices as if they'll run on a dev machine. But a mobile prototype needs to feel right on a phone — input, screen size, session length all matter. A VR prototype needs actual headset testing. Platform-blind slices waste time.

7. **Lists too many slices without committing.** Claude tends to present 5+ options and say "it depends." Push for ONE recommendation with clear reasoning. The user can override, but the skill should take a position.

## Anti-Sycophancy Protocol

### Forbidden Phrases
- ❌ "This would be an impressive prototype"
- ❌ "All of these slices have merit"
- ❌ "The vertical slice approach ensures quality"
- ❌ "This slice showcases the full vision"
- ❌ "Any of these would work"

### Required Instead
```
❌ "This is a great candidate for a prototype."
✅ "This slice tests whether the 30-second combat loop is fun with zero
   progression systems. If players quit after 3 rounds, the core loop
   fails. If they ask 'what's next?', it works. Signal is binary."

❌ "I'd recommend the vertical slice for a complete experience."
✅ "Vertical slice takes 4x longer than mechanic prototype but only
   answers 1.5x more questions. The extra questions (progression feel,
   economy balance) can't be answered with 10 minutes of content anyway.
   Start with the mechanic prototype."
```

## Forcing Questions

**Q1:** "If this prototype succeeds, what specifically changes about your plan? If nothing changes, you're building a demo, not a prototype."

Push until you hear: A concrete decision that hinges on the result. "If the combat loop works, we commit to the action RPG direction. If it doesn't, we pivot to turn-based." If the answer is "we'll keep going either way" — the prototype isn't testing anything.

**STOP.** Wait for answer.

**Q2:** "What does failure look like? Describe the specific moment where you'd say 'this slice didn't work.'"

Push until you hear: A concrete failure scenario with observable evidence. "Players stop after 2 rounds and don't ask to play again" = good. "It doesn't feel right" = too vague (push: "Define 'right'. What would you measure?").

**STOP.** Wait for answer.

**Q3:** "Which of these slices are you AFRAID to build? That's probably the one you should build first."

The slice that scares you is the one testing your riskiest assumption. If you already know the combat is fun, don't prototype combat — prototype the thing you're not sure about.

**STOP.** Wait for answer.
